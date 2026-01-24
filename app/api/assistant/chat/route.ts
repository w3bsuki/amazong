import { NextResponse } from "next/server"
import { streamText, convertToModelMessages } from "ai"
import { z } from "zod"

import { assistantTools } from "@/lib/ai/tools/assistant-tools"
import { getAiChatModel } from "@/lib/ai/models"
import { isAiAssistantEnabled } from "@/lib/ai/env"
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

export async function POST(request: Request) {
  if (!isAiAssistantEnabled()) {
    return NextResponse.json({ error: "AI assistant disabled" }, { status: 404 })
  }

  try {
    const body = await request.json()
    const parsed = AssistantChatRequestSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 })
    }

    const locale = parsed.data.locale ?? "en"
    const messages = await convertToModelMessages(parsed.data.messages, {
      tools: assistantTools,
    })

    const result = streamText({
      model: getAiChatModel(),
      system: getSystemPrompt(locale),
      messages,
      tools: assistantTools,
    })

    return result.toUIMessageStreamResponse({
      headers: {
        "Cache-Control": "private, no-store",
      },
    })
  } catch (error) {
    if (isNextPrerenderInterrupted(error)) throw error
    logger.error("[AI Assistant] chat route error", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
