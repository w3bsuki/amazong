import type { NextRequest } from "next/server"
import { generateObject } from "ai"
import { z } from "zod"

import { getAiVisionModel } from "@/lib/ai/models"
import { searchListings } from "@/lib/ai/tools/search-listings"
import { createRouteJsonHelpers } from "@/lib/api/route-json"
import {
  parseRequestJson,
  requireAiAssistantEnabled,
  requireAuthedUser,
  validateAiImageUrl,
} from "../_lib/ai-request-helpers"
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

  const auth = await requireAuthedUser({ supabase, json })
  if (!auth.ok) return auth.response

  const enabled = requireAiAssistantEnabled(json)
  if (!enabled.ok) return enabled.response

  try {
    const parsed = await parseRequestJson(request, FindSimilarRequestSchema, json)
    if (!parsed.ok) return parsed.response

    const safeUrl = validateAiImageUrl(parsed.data.imageUrl, json)
    if (!safeUrl.ok) return safeUrl.response

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
