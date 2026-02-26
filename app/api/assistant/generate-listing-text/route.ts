import type { NextRequest } from "next/server"
import { generateObject } from "ai"
import { z } from "zod"

import { getAiChatModelSpec } from "@/lib/ai/env"
import { postInferenceCheck, preInferenceCheck } from "@/lib/ai/guardrails"
import { getAiChatModel } from "@/lib/ai/models"
import { getListingDescriptionPrompt } from "@/lib/ai/prompts/listing-description.v1"
import { getActivePrompt } from "@/lib/ai/prompts/registry"
import { ListingTextGenerationSchema } from "@/lib/ai/schemas/listings"
import { aiTelemetryWrap } from "@/lib/ai/telemetry"
import { createRouteJsonHelpers } from "@/lib/api/route-json"
import { isNextPrerenderInterrupted } from "@/lib/next/is-next-prerender-interrupted"
import {
  getAuthenticatedUserId,
  parseRequestJson,
  requireAiAssistantEnabled,
  requireAuthedUser,
} from "../_lib/ai-request-helpers"

import { logger } from "@/lib/logger"

const GenerateListingTextRequestSchema = z.object({
  categoryHint: z.string().trim().min(1).max(120).optional(),
  condition: z.string().trim().min(1).max(80).optional(),
  brand: z.string().trim().min(1).max(80).optional(),
  attributes: z
    .record(z.string(), z.string().trim().min(1).max(80))
    .refine((value) => Object.keys(value).length <= 30, "Too many attributes")
    .optional(),
  locale: z.enum(["en", "bg"]).optional(),
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
    const parsed = await parseRequestJson(request, GenerateListingTextRequestSchema, json)
    if (!parsed.ok) return parsed.response

    const locale = parsed.data.locale ?? "en"
    const promptSpec = getActivePrompt("listing.description")
    const prompt = getListingDescriptionPrompt(locale)
    const modelRoute = getAiChatModelSpec()
    const promptInput = [
      prompt.inputTemplate,
      "",
      "Listing context:",
      JSON.stringify(
        {
          categoryHint: parsed.data.categoryHint ?? null,
          condition: parsed.data.condition ?? null,
          brand: parsed.data.brand ?? null,
          attributes: parsed.data.attributes ?? {},
          locale,
        },
        null,
        2,
      ),
    ].join("\n")

    const preCheck = preInferenceCheck({
      text: promptInput,
      userId,
    })
    if (!preCheck.ok) {
      logger.warn("[AI Guardrail] listing-description pre-inference rejected", {
        feature_id: "listing.description",
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

    const { result, meta } = await aiTelemetryWrap(
      {
        featureId: "listing.description",
        promptVersion: promptSpec.id,
        modelRoute,
      },
      async () =>
        generateObject({
          model: getAiChatModel(),
          schema: ListingTextGenerationSchema,
          system: prompt.system,
          messages: [
            {
              role: "user",
              content: [{ type: "text", text: promptInput }],
            },
          ],
        }),
    )

    const postCheck = postInferenceCheck(result.object, ListingTextGenerationSchema)
    if (!postCheck.ok || !postCheck.validated) {
      logger.warn("[AI Guardrail] listing-description post-inference rejected", {
        feature_id: "listing.description",
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

    return noStore({ draft: postCheck.validated, meta })
  } catch (error) {
    if (isNextPrerenderInterrupted(error)) throw error
    logger.error("[AI Assistant] generate-listing-text route error", error)
    return json(
      { error: "Internal server error" },
      { status: 500, headers: { "Cache-Control": "private, no-store" } },
    )
  }
}
