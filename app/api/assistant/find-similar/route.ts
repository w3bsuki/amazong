import type { NextRequest } from "next/server"
import { generateObject } from "ai"
import { z } from "zod"

import { isAiAssistantEnabled } from "@/lib/ai/env"
import { getAiVisionModel } from "@/lib/ai/models"
import { searchListings } from "@/lib/ai/tools/search-listings"
import { isSafeUserProvidedUrl } from "@/lib/ai/safe-url"
import { createRouteJsonHelpers } from "@/lib/api/route-json"
import { isNextPrerenderInterrupted } from "@/lib/next/is-next-prerender-interrupted"
import { logger } from "@/lib/logger"

const FindSimilarRequestSchema = z.object({
  imageUrl: z.string().url().max(2048),
  limit: z.coerce.number().int().min(1).max(20).optional(),
})

const FindSimilarExtractedSchema = z.object({
  query: z.string().trim().min(2).max(80),
  categoryHint: z.string().trim().min(2).max(120).optional(),
  brandHint: z.string().trim().min(2).max(80).optional(),
  keywords: z.array(z.string().trim().min(2).max(32)).max(12).optional(),
})

export async function POST(request: NextRequest) {
  const { supabase, json, noStore } = createRouteJsonHelpers(request)

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return json(
      { error: "Unauthorized" },
      { status: 401, headers: { "Cache-Control": "private, no-store" } },
    )
  }

  if (!isAiAssistantEnabled()) {
    return json({ error: "AI assistant disabled" }, { status: 404 })
  }

  try {
    const body = await request.json()
    const parsed = FindSimilarRequestSchema.safeParse(body)
    if (!parsed.success) {
      return json({ error: "Invalid request" }, { status: 400 })
    }

    if (!isSafeUserProvidedUrl(parsed.data.imageUrl)) {
      return json({ error: "Invalid imageUrl" }, { status: 400 })
    }

    const safeLimit = parsed.data.limit ?? 10

    const extracted = await generateObject({
      model: getAiVisionModel(),
      schema: FindSimilarExtractedSchema,
      system:
        "You extract a short marketplace search query from an image. Return a compact query (2-6 words) and optional keywords.",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Look at this product photo and produce a short search query to find similar items in our marketplace.",
            },
            { type: "image", image: parsed.data.imageUrl },
          ],
        },
      ],
    })

    const results = await searchListings({
      query: extracted.object.query,
      limit: safeLimit,
    })

    return noStore({ query: extracted.object.query, extracted: extracted.object, results })
  } catch (error) {
    if (isNextPrerenderInterrupted(error)) throw error
    logger.error("[AI Assistant] find-similar route error", error)
    return json({ error: "Internal server error" }, { status: 500 })
  }
}
