import { NextResponse } from "next/server";
import { z } from "zod";
import { generateObject } from "ai";
import { AI_CONFIG } from "@/lib/ai/config";
import { getAiModel } from "@/lib/ai/providers";

export const maxDuration = 45;

const requestSchema = z.object({
  locale: z.string().optional(),
  currency: z.enum(["BGN", "EUR", "USD"]).optional(),
  images: z
    .array(
      z.object({
        url: z.string().url(),
      })
    )
    .min(1)
    .max(6),
  context: z
    .object({
      title: z.string().optional(),
      description: z.string().optional(),
      condition: z.string().optional(),
    })
    .optional(),
});

const conditionEnum = z.enum([
  "new-with-tags",
  "new-without-tags",
  "used-like-new",
  "used-excellent",
  "used-good",
  "used-fair",
]);

// IMPORTANT: avoid z.optional() for OpenAI structured outputs; prefer nullable.
const responseSchema = z.object({
  title: z.string().nullable(),
  description: z.string().nullable(),
  condition: conditionEnum.nullable(),

  category: z
    .object({
      slug: z.string().nullable(),
      name: z.string().nullable(),
      rationale: z.string().nullable(),
    })
    .nullable(),

  price: z.object({
    suggested: z.number().nullable(),
    low: z.number().nullable(),
    high: z.number().nullable(),
    currency: z.enum(["BGN", "EUR", "USD"]).nullable(),
    rationale: z.string().nullable(),
  }),

  attributes: z
    .array(
      z.object({
        name: z.string(),
        value: z.string(),
        rationale: z.string().nullable(),
      })
    )
    .describe("Item specifics inferred from the image")
    .default([]),

  tags: z.array(z.string()).default([]),
  questions: z
    .array(z.string())
    .describe("Short questions to ask the user when uncertain")
    .default([]),
  warnings: z.array(z.string()).default([]),
});

export async function POST(req: Request) {
  try {
    const body = requestSchema.parse(await req.json());

    const modelCtx = getAiModel("vision", { tags: ["listing-suggestions"] });
    if (!modelCtx) {
      return NextResponse.json(
        { error: "No AI provider configured. Set AI_GATEWAY_API_KEY (recommended) or OPENAI_API_KEY / GOOGLE_GENERATIVE_AI_API_KEY." },
        { status: 500 }
      );
    }

    const locale = body.locale === "bg" ? "bg" : "en";
    const currency = body.currency ?? "BGN";

    const promptText = `You are an expert marketplace listing assistant.

Goal: Generate best-practice listing suggestions from the provided product photo(s).

Rules:
- Output must match the provided JSON schema exactly.
- Be concise and professional.
- Title: <= 80 chars, no emojis.
- Description: <= 2000 chars, helpful and honest.
- Condition must be one of: ${conditionEnum.options.join(", ")}.
- Price: suggest a realistic market price + low/high range in ${currency}. If uncertain, leave numbers null and ask questions.
- Category: provide the best category slug/name guess. If unsure, set category to null and ask questions.
- Attributes: only include attributes you're reasonably confident about from the image.
- Tags: 0-10 short tags, lowercase, no hashtags.

User context (may be empty):
- title: ${body.context?.title ?? ""}
- description: ${body.context?.description ?? ""}
- condition: ${body.context?.condition ?? ""}

Language: ${locale === "bg" ? "Bulgarian" : "English"}.
`;

    const imageParts = body.images.slice(0, 4).map((img) => ({
      type: "image" as const,
      image: new URL(img.url),
    }));

    const result = await generateObject({
      model: modelCtx.model,
      schema: responseSchema,
      // Disable automatic retries to avoid wasting quota on rate limit errors
      maxRetries: AI_CONFIG.vision.maxRetries,
      messages: [
        {
          role: "user",
          content: [{ type: "text", text: promptText }, ...imageParts],
        },
      ],
    });

    return NextResponse.json(result.object);
  } catch (err) {
    console.error("/api/ai/listing-suggestions error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to generate listing suggestions" },
      { status: 400 }
    );
  }
}
