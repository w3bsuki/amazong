import { NextRequest, NextResponse } from "next/server"
import { streamText, convertToModelMessages, type ModelMessage, type UIMessage } from "ai"
import { z } from "zod"

import { assistantTools } from "@/lib/ai/tools/assistant-tools"
import { getAiChatModel, getAiFallbackModel } from "@/lib/ai/models"
import { isAiAssistantEnabled, getGroqApiKey } from "@/lib/ai/env"
import { isNextPrerenderInterrupted } from "@/lib/next/is-next-prerender-interrupted"
import { logger } from "@/lib/logger"
import { createRouteHandlerClient } from "@/lib/supabase/server"

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

const AssistantChatRequestSchema = z.object({
  messages: z.custom<IncomingAssistantMessages>(isIncomingAssistantMessages),
  locale: z.enum(["en", "bg"]).optional(),
})

function getSystemPrompt(locale: "en" | "bg") {
  const languageLine =
    locale === "bg"
      ? "Reply in Bulgarian unless the user explicitly asks for English."
      : "Reply in English."

  return [
    "You are Treido's in-app shopping assistant.",
    languageLine,
    "",
    "Rules:",
    "- You MUST ground product suggestions in tool results (searchListings/getListing).",
    "- If you do not have enough information, ask a short clarifying question.",
    "- Do not claim to browse the web or access external websites.",
    "- Do not invent product details, prices, availability, or URLs.",
    "- Prefer concise answers. When showing results, summarize and let the UI render listing cards.",
  ].join("\n")
}

function isRateLimitError(error: unknown): boolean {
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
    
    const rawMessages = parsed.data.messages
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

    const systemPrompt = getSystemPrompt(locale)

    // Try primary model first, fallback to Groq on rate limit
    let model = getAiChatModel()

    try {
      const result = streamText({
        model,
        system: systemPrompt,
        messages,
        tools: assistantTools,
      })

      return result.toUIMessageStreamResponse({
        headers: noStoreHeaders,
      })
    } catch (primaryError) {
      // If rate limited and fallback is available, try fallback
      if (isRateLimitError(primaryError) && getGroqApiKey()) {
        logger.warn("[AI Assistant] Primary model rate limited, trying fallback")
        model = getAiFallbackModel()

        const result = streamText({
          model,
          system: systemPrompt,
          messages,
          tools: assistantTools,
        })

        return result.toUIMessageStreamResponse({
          headers: {
            ...noStoreHeaders,
            "X-AI-Fallback": "true",
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
