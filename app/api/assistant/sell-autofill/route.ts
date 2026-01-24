import { NextResponse } from "next/server"
import { generateObject } from "ai"

import { getAiVisionModel } from "@/lib/ai/models"
import { isAiAssistantEnabled } from "@/lib/ai/env"
import {
  SellAutofillDraftSchema,
  SellAutofillRequestSchema,
} from "@/lib/ai/schemas/sell-autofill"
import { isSafeUserProvidedUrl } from "@/lib/ai/safe-url"
import { noStoreJson } from "@/lib/api/response-helpers"
import { isNextPrerenderInterrupted } from "@/lib/next/is-next-prerender-interrupted"
import { logger } from "@/lib/logger"

export async function POST(request: Request) {
  if (!isAiAssistantEnabled()) {
    return NextResponse.json({ error: "AI assistant disabled" }, { status: 404 })
  }

  try {
    const body = await request.json()
    const parsed = SellAutofillRequestSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 })
    }

    if (!isSafeUserProvidedUrl(parsed.data.imageUrl)) {
      return NextResponse.json({ error: "Invalid imageUrl" }, { status: 400 })
    }

    const locale = parsed.data.locale ?? "en"
    const prompt =
      locale === "bg"
        ? "Анализирай снимката на продукта и върни чернова за полетата за обява: заглавие, описание, състояние, марка (ако се вижда), подсказка за категория, тагове и примерна цена. Не измисляй конкретен модел/марка ако не е видимо."
        : "Analyze the product photo and return a draft for listing fields: title, description, condition, brand (if visible), category hint, tags, and a rough price suggestion. Do not guess specific brand/model if not visible."

    const result = await generateObject({
      model: getAiVisionModel(),
      schema: SellAutofillDraftSchema,
      system:
        "You generate structured listing drafts from images. Return only fields you are confident about. Keep text concise.",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            { type: "image", image: parsed.data.imageUrl },
          ],
        },
      ],
    })

    return noStoreJson({ draft: result.object })
  } catch (error) {
    if (isNextPrerenderInterrupted(error)) throw error
    logger.error("[AI Assistant] sell-autofill route error", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
