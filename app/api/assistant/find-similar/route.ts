import { NextRequest, NextResponse } from "next/server"
import { generateObject } from "ai"

import { isAiAssistantEnabled } from "@/lib/ai/env"
import { getAiVisionModel } from "@/lib/ai/models"
import {
  FindSimilarExtractedSchema,
  FindSimilarRequestSchema,
} from "@/lib/ai/schemas/find-similar"
import { searchListings } from "@/lib/ai/tools/search-listings"
import { isSafeUserProvidedUrl } from "@/lib/ai/safe-url"
import { noStoreJson } from "@/lib/api/response-helpers"
import { isNextPrerenderInterrupted } from "@/lib/next/is-next-prerender-interrupted"
import { logger } from "@/lib/logger"
import { createRouteHandlerClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  const { supabase, applyCookies } = createRouteHandlerClient(request)
  const json = (body: unknown, init?: Parameters<typeof NextResponse.json>[1]) =>
    applyCookies(NextResponse.json(body, init))
  const noStore = (body: unknown, init?: Parameters<typeof noStoreJson>[1]) =>
    applyCookies(noStoreJson(body, init))

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
