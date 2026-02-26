import { NextRequest, NextResponse } from "next/server"
import { streamText, convertToModelMessages, type ModelMessage, type UIMessage } from "ai"
import { z } from "zod"

import { assistantTools } from "@/lib/ai/tools/assistant-tools"
import { getAiChatModel, getAiFallbackModel } from "@/lib/ai/models"
import {
  getAiChatModelSpec,
  getAiFallbackModelSpec,
  isAiAssistantEnabled,
  getGroqApiKey,
} from "@/lib/ai/env"
import { preInferenceCheck } from "@/lib/ai/guardrails"
import { getAssistantChatSystemPrompt } from "@/lib/ai/prompts/assistant-chat.v1"
import { getActivePrompt } from "@/lib/ai/prompts/registry"
import { aiTelemetryWrap, type AiResponseMeta } from "@/lib/ai/telemetry"
import { isNextPrerenderInterrupted } from "@/lib/next/is-next-prerender-interrupted"
import { createRouteHandlerClient } from "@/lib/supabase/server"

import { logger } from "@/lib/logger"
const noStoreHeaders = { "Cache-Control": "private, no-store" } as const

const AssistantMessageRoleSchema = z.enum(["user", "assistant", "system"])

type AssistantMessageRole = z.infer<typeof AssistantMessageRoleSchema>
type SimpleAssistantMessage = {
  role: AssistantMessageRole
  content: string
}
type IncomingAssistantMessages = UIMessage[] | SimpleAssistantMessage[]

function isObjectRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null
}

function hasAssistantMessageRole(value: unknown): value is AssistantMessageRole {
  return AssistantMessageRoleSchema.safeParse(value).success
}

function isSimpleAssistantMessage(value: unknown): value is SimpleAssistantMessage {
  if (!isObjectRecord(value)) return false
  return hasAssistantMessageRole(value.role) && typeof value.content === "string"
}

function isUiLikeAssistantMessage(value: unknown): value is UIMessage {
  if (!isObjectRecord(value)) return false
  return hasAssistantMessageRole(value.role) && Array.isArray(value.parts)
}

function isIncomingAssistantMessages(value: unknown): value is IncomingAssistantMessages {
  if (!Array.isArray(value) || value.length > 50) return false
  return value.every((message) => isSimpleAssistantMessage(message) || isUiLikeAssistantMessage(message))
}

function isSimpleAssistantMessageArray(
  messages: IncomingAssistantMessages
): messages is SimpleAssistantMessage[] {
  return messages.every(isSimpleAssistantMessage)
}

function isUiMessageArray(messages: IncomingAssistantMessages): messages is UIMessage[] {
  return messages.every(isUiLikeAssistantMessage)
}

function extractUiMessageText(message: UIMessage): string {
  return message.parts
    .map((part) => {
      if (
        typeof part === "object" &&
        part !== null &&
        "type" in part &&
        part.type === "text" &&
        "text" in part &&
        typeof part.text === "string"
      ) {
        return part.text
      }
      return ""
    })
    .filter(Boolean)
    .join("\n")
}

function getLatestUserPromptText(messages: IncomingAssistantMessages): string {
  for (let index = messages.length - 1; index >= 0; index -= 1) {
    const message = messages[index]
    if (!message || message.role !== "user") continue

    if (isSimpleAssistantMessage(message)) {
      return message.content
    }
    if (isUiLikeAssistantMessage(message)) {
      return extractUiMessageText(message)
    }
  }

  return ""
}

const AssistantChatRequestSchema = z.object({
  messages: z.custom<IncomingAssistantMessages>(isIncomingAssistantMessages),
  locale: z.enum(["en", "bg"]).optional(),
})

function isRateLimitError(error: unknown): boolean {
  const cause =
    typeof error === "object" &&
    error !== null &&
    "cause" in error
      ? (error as { cause?: unknown }).cause
      : undefined

  if (cause) {
    return isRateLimitError(cause)
  }

  if (error instanceof Error) {
    const msg = error.message.toLowerCase()
    return (
      msg.includes("rate limit") ||
      msg.includes("quota") ||
      msg.includes("429") ||
      msg.includes("resource exhausted")
    )
  }
  return false
}

function getMetaHeaders(meta: AiResponseMeta): Record<string, string> {
  const headers: Record<string, string> = {
    "X-AI-Prompt-Version": meta.prompt_version,
    "X-AI-Model-Route": meta.model_route,
    "X-AI-Latency-Ms": String(meta.latency_ms),
    "X-AI-Success": String(meta.success),
  }

  if (typeof meta.cost_estimate === "number") {
    headers["X-AI-Cost-Estimate"] = String(meta.cost_estimate)
  }
  if (meta.error) {
    headers["X-AI-Error"] = meta.error
  }

  return headers
}

export async function POST(request: NextRequest) {
  const { supabase, applyCookies } = createRouteHandlerClient(request)
  const json = (body: unknown, init?: Parameters<typeof NextResponse.json>[1]) =>
    applyCookies(NextResponse.json(body, init))

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return json(
      { error: { code: "UNAUTHORIZED" } },
      { status: 401, headers: noStoreHeaders },
    )
  }

  if (!isAiAssistantEnabled()) {
    return json(
      { error: { code: "AI_DISABLED" } },
      { status: 503, headers: noStoreHeaders },
    )
  }

  try {
    const body = await request.json()
    const parsed = AssistantChatRequestSchema.safeParse(body)
    if (!parsed.success) {
      return json(
        { error: { code: "BAD_REQUEST" } },
        { status: 400, headers: noStoreHeaders },
      )
    }

    const locale = parsed.data.locale ?? "en"
    const prompt = getActivePrompt("assistant.chat")
    const systemPrompt = getAssistantChatSystemPrompt(locale)
    
    const rawMessages = parsed.data.messages
    const latestUserPromptText = getLatestUserPromptText(rawMessages)
    const preCheck = preInferenceCheck({
      text: latestUserPromptText,
      userId: user.id,
    })
    if (!preCheck.ok) {
      logger.warn("[AI Guardrail] assistant-chat pre-inference rejected", {
        feature_id: "assistant.chat",
        user_id: user.id,
        reason: preCheck.reason,
        prompt_version: prompt.id,
      })
      return json(
        { error: { code: "GUARDRAIL_REJECTED" } },
        { status: 400, headers: noStoreHeaders },
      )
    }

    let messages: ModelMessage[]
    if (isSimpleAssistantMessageArray(rawMessages)) {
      messages = rawMessages.map((message) => ({
        role: message.role,
        content: message.content,
      }))
    } else if (isUiMessageArray(rawMessages)) {
      messages = await convertToModelMessages(rawMessages)
    } else {
      return json(
        { error: { code: "BAD_REQUEST" } },
        { status: 400, headers: noStoreHeaders },
      )
    }

    // Try primary model first, fallback to Groq on rate limit
    let model = getAiChatModel()
    let modelRoute = getAiChatModelSpec()

    try {
      const { result, meta } = await aiTelemetryWrap(
        {
          featureId: "assistant.chat",
          promptVersion: prompt.id,
          modelRoute,
        },
        async () =>
          streamText({
            model,
            system: systemPrompt,
            messages,
            tools: assistantTools,
          }),
      )

      return result.toUIMessageStreamResponse({
        headers: {
          ...noStoreHeaders,
          ...getMetaHeaders(meta),
        },
      })
    } catch (primaryError) {
      // If rate limited and fallback is available, try fallback
      if (isRateLimitError(primaryError) && getGroqApiKey()) {
        logger.warn("[AI Assistant] Primary model rate limited, trying fallback")
        model = getAiFallbackModel()
        modelRoute = getAiFallbackModelSpec()

        const { result, meta } = await aiTelemetryWrap(
          {
            featureId: "assistant.chat",
            promptVersion: prompt.id,
            modelRoute,
          },
          async () =>
            streamText({
              model,
              system: systemPrompt,
              messages,
              tools: assistantTools,
            }),
        )

        return result.toUIMessageStreamResponse({
          headers: {
            ...noStoreHeaders,
            "X-AI-Fallback": "true",
            ...getMetaHeaders(meta),
          },
        })
      }

      throw primaryError
    }
  } catch (error) {
    if (isNextPrerenderInterrupted(error)) throw error
    logger.error("[AI Assistant] chat route error", error)
    return json(
      { error: { code: "INTERNAL" } },
      { status: 500, headers: noStoreHeaders },
    )
  }
}

export async function GET() {
  return NextResponse.json(
    { error: { code: "METHOD_NOT_ALLOWED" } },
    {
      status: 405,
      headers: {
        Allow: "POST",
        ...noStoreHeaders,
      },
    },
  )
}
