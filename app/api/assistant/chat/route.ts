import { NextResponse } from "next/server"
import { streamText, convertToModelMessages, type ModelMessage, type UIMessage } from "ai"
import { z } from "zod"

import { assistantTools } from "@/lib/ai/tools/assistant-tools"
import { getAiChatModel, getAiFallbackModel } from "@/lib/ai/models"
import { isAiAssistantEnabled, getGroqApiKey } from "@/lib/ai/env"
import { isNextPrerenderInterrupted } from "@/lib/next/is-next-prerender-interrupted"
import { logger } from "@/lib/logger"

const AssistantChatRequestSchema = z.object({
  messages: z.array(z.any()).max(50),
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

export async function POST(request: Request) {
  if (!isAiAssistantEnabled()) {
    return NextResponse.json(
      { error: { code: "AI_DISABLED" } },
      { status: 503, headers: { "Cache-Control": "private, no-store" } },
    )
  }

  try {
    const body = await request.json()
    const parsed = AssistantChatRequestSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: { code: "BAD_REQUEST" } },
        { status: 400, headers: { "Cache-Control": "private, no-store" } },
      )
    }

    const locale = parsed.data.locale ?? "en"
    
    // Check if messages are UIMessage format (from useChat) or simple {role, content} format
    const rawMessages = parsed.data.messages
    const isUIMessageFormat = rawMessages.some((m: { parts?: unknown }) => 
      m && typeof m === 'object' && 'parts' in m
    )
    
    // Convert to model messages or use directly
    const messages: ModelMessage[] = isUIMessageFormat
      ? await convertToModelMessages(rawMessages as UIMessage[])
      : rawMessages.map((m: { role: string; content: string }) => ({
          role: m.role as "user" | "assistant" | "system",
          content: m.content,
        }))

    const systemPrompt = getSystemPrompt(locale)

    // Try primary model first, fallback to Groq on rate limit
    let model = getAiChatModel()
    let usedFallback = false

    try {
      const result = streamText({
        model,
        system: systemPrompt,
        messages,
        tools: assistantTools,
      })

      return result.toUIMessageStreamResponse({
        headers: {
          "Cache-Control": "private, no-store",
        },
      })
    } catch (primaryError) {
      // If rate limited and fallback is available, try fallback
      if (isRateLimitError(primaryError) && getGroqApiKey()) {
        logger.warn("[AI Assistant] Primary model rate limited, trying fallback")
        usedFallback = true
        model = getAiFallbackModel()

        const result = streamText({
          model,
          system: systemPrompt,
          messages,
          tools: assistantTools,
        })

        return result.toUIMessageStreamResponse({
          headers: {
            "Cache-Control": "private, no-store",
            "X-AI-Fallback": "true",
          },
        })
      }

      throw primaryError
    }
  } catch (error) {
    if (isNextPrerenderInterrupted(error)) throw error
    logger.error("[AI Assistant] chat route error", error)
    return NextResponse.json(
      { error: { code: "INTERNAL" } },
      { status: 500, headers: { "Cache-Control": "private, no-store" } },
    )
  }
}
