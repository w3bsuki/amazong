import { NextRequest, NextResponse } from "next/server"
import { generateObject } from "ai"

import { getAiVisionModelSpec } from "@/lib/ai/env"
import { postInferenceCheck, preInferenceCheck } from "@/lib/ai/guardrails"
import { getAiVisionModel } from "@/lib/ai/models"
import { getListingAutofillPrompt } from "@/lib/ai/prompts/listing-autofill.v1"
import { getActivePrompt } from "@/lib/ai/prompts/registry"
import {
  SellAutofillDraftSchema,
  SellAutofillRequestSchema,
} from "@/lib/ai/schemas/sell-autofill"
import { aiTelemetryWrap } from "@/lib/ai/telemetry"
import { noStoreJson } from "@/lib/api/response-helpers"
import { isNextPrerenderInterrupted } from "@/lib/next/is-next-prerender-interrupted"
import { createRouteHandlerClient } from "@/lib/supabase/server"
import {
  getAuthenticatedUserId,
  parseRequestJson,
  requireAiAssistantEnabled,
  requireAuthedUser,
  validateAiImageUrl,
} from "../_lib/ai-request-helpers"

import { logger } from "@/lib/logger"
export async function POST(request: NextRequest) {
  const { supabase, applyCookies } = createRouteHandlerClient(request)
  const json = (body: unknown, init?: Parameters<typeof NextResponse.json>[1]) =>
    applyCookies(NextResponse.json(body, init))
  const noStore = (body: unknown, init?: Parameters<typeof noStoreJson>[1]) =>
    applyCookies(noStoreJson(body, init))

  const auth = await requireAuthedUser({ supabase, json })
  if (!auth.ok) return auth.response
  const userId = getAuthenticatedUserId(auth.user)
  if (!userId) {
    return json({ error: "Unauthorized" }, { status: 401, headers: { "Cache-Control": "private, no-store" } })
  }

  const enabled = requireAiAssistantEnabled(json)
  if (!enabled.ok) return enabled.response

  try {
    const parsed = await parseRequestJson(request, SellAutofillRequestSchema, json)
    if (!parsed.ok) return parsed.response

    const safeUrl = validateAiImageUrl(parsed.data.imageUrl, json)
    if (!safeUrl.ok) return safeUrl.response

    const locale = parsed.data.locale ?? "en"
    const promptSpec = getActivePrompt("listing.autofill")
    const prompt = getListingAutofillPrompt(locale)
    const modelRoute = getAiVisionModelSpec()
    const preCheck = preInferenceCheck({
      text: prompt.inputTemplate,
      imageUrl: parsed.data.imageUrl,
      userId,
    })
    if (!preCheck.ok) {
      logger.warn("[AI Guardrail] sell-autofill pre-inference rejected", {
        feature_id: "listing.autofill",
        user_id: userId,
        reason: preCheck.reason,
        prompt_version: promptSpec.id,
        model_route: modelRoute,
      })
      return json({ error: "AI input blocked" }, { status: 400, headers: { "Cache-Control": "private, no-store" } })
    }

    const { result, meta } = await aiTelemetryWrap(
      {
        featureId: "listing.autofill",
        promptVersion: promptSpec.id,
        modelRoute,
      },
      async () =>
        generateObject({
          model: getAiVisionModel(),
          schema: SellAutofillDraftSchema,
          system: prompt.system,
          messages: [
            {
              role: "user",
              content: [
                { type: "text", text: prompt.inputTemplate },
                { type: "image", image: parsed.data.imageUrl },
              ],
            },
          ],
        }),
    )
    const postCheck = postInferenceCheck(result.object, SellAutofillDraftSchema)
    if (!postCheck.ok || !postCheck.validated) {
      logger.warn("[AI Guardrail] sell-autofill post-inference rejected", {
        feature_id: "listing.autofill",
        user_id: userId,
        reason: postCheck.reason,
        prompt_version: promptSpec.id,
        model_route: modelRoute,
      })
      return json({ error: "AI output blocked" }, { status: 422, headers: { "Cache-Control": "private, no-store" } })
    }

    return noStore({
      draft: postCheck.validated,
      meta,
    })
  } catch (error) {
    if (isNextPrerenderInterrupted(error)) throw error
    logger.error("[AI Assistant] sell-autofill route error", error)
    return json({ error: "Internal server error" }, { status: 500 })
  }
}
