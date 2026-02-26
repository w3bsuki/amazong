import type { NextRequest } from "next/server"
import { generateObject } from "ai"
import { z } from "zod"

import { getAiVisionModelSpec } from "@/lib/ai/env"
import { postInferenceCheck, preInferenceCheck } from "@/lib/ai/guardrails"
import { getAiVisionModel } from "@/lib/ai/models"
import { getListingFindSimilarPromptInput } from "@/lib/ai/prompts/listing-find-similar.v1"
import { getActivePrompt } from "@/lib/ai/prompts/registry"
import { aiTelemetryWrap } from "@/lib/ai/telemetry"
import { searchListings } from "@/lib/ai/tools/search-listings"
import { createRouteJsonHelpers } from "@/lib/api/route-json"
import {
  getAuthenticatedUserId,
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
  const userId = getAuthenticatedUserId(auth.user)
  if (!userId) {
    return json(
      { error: "Unauthorized" },
      { status: 401, headers: { "Cache-Control": "private, no-store" } },
    )
  }

  const enabled = requireAiAssistantEnabled(json)
  if (!enabled.ok) return enabled.response

  try {
    const parsed = await parseRequestJson(request, FindSimilarRequestSchema, json)
    if (!parsed.ok) return parsed.response

    const safeUrl = validateAiImageUrl(parsed.data.imageUrl, json)
    if (!safeUrl.ok) return safeUrl.response

    const safeLimit = parsed.data.limit ?? 10
    const promptSpec = getActivePrompt("listing.find-similar")
    const modelRoute = getAiVisionModelSpec()
    const promptInput = getListingFindSimilarPromptInput()
    const preCheck = preInferenceCheck({
      text: promptInput,
      imageUrl: parsed.data.imageUrl,
      userId,
    })
    if (!preCheck.ok) {
      logger.warn("[AI Guardrail] find-similar pre-inference rejected", {
        feature_id: "listing.find-similar",
        user_id: userId,
        reason: preCheck.reason,
        prompt_version: promptSpec.id,
        model_route: modelRoute,
      })
      return json(
        { error: "AI input blocked" },
        { status: 400, headers: { "Cache-Control": "private, no-store" } },
      )
    }

    const { result: extracted, meta } = await aiTelemetryWrap(
      {
        featureId: "listing.find-similar",
        promptVersion: promptSpec.id,
        modelRoute,
      },
      async () =>
        generateObject({
          model: getAiVisionModel(),
          schema: FindSimilarExtractedSchema,
          system: promptSpec.system,
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: promptInput,
                },
                { type: "image", image: parsed.data.imageUrl },
              ],
            },
          ],
        }),
    )
    const postCheck = postInferenceCheck(extracted.object, FindSimilarExtractedSchema)
    if (!postCheck.ok || !postCheck.validated) {
      logger.warn("[AI Guardrail] find-similar post-inference rejected", {
        feature_id: "listing.find-similar",
        user_id: userId,
        reason: postCheck.reason,
        prompt_version: promptSpec.id,
        model_route: modelRoute,
      })
      return json(
        { error: "AI output blocked" },
        { status: 422, headers: { "Cache-Control": "private, no-store" } },
      )
    }

    const results = await searchListings({
      query: postCheck.validated.query,
      limit: safeLimit,
    })

    return noStore({
      query: postCheck.validated.query,
      extracted: postCheck.validated,
      results,
      meta,
    })
  } catch (error) {
    if (isNextPrerenderInterrupted(error)) throw error
    logger.error("[AI Assistant] find-similar route error", error)
    return json({ error: "Internal server error" }, { status: 500 })
  }
}
