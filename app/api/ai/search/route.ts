import { NextResponse } from "next/server"
import {
  convertToModelMessages,
  stepCountIs,
  streamText,
  tool,
  type UIMessage,
} from "ai"
import { AI_CONFIG } from "@/lib/ai/config"
import { getAiModel } from "@/lib/ai/providers"
import { compactUIMessages } from "@/lib/ai/ui-messages"
import {
  searchProductsInput,
  searchProducts,
  TOP_CATEGORIES,
} from "@/lib/ai/search-utils"

export const maxDuration = 30

export async function POST(req: Request) {
  try {
    const { messages: rawMessages } = (await req.json()) as { messages: UIMessage[] }
    const messages = compactUIMessages(rawMessages, { maxMessages: AI_CONFIG.search.maxMessages })

    const modelCtx = getAiModel("chat", { tags: ["catalog-search"] })

    if (!modelCtx) {
      return NextResponse.json(
        { error: "No AI provider configured. Set AI_GATEWAY_API_KEY (recommended) or OPENAI_API_KEY / GOOGLE_GENERATIVE_AI_API_KEY / GROQ_API_KEY." },
        { status: 500 }
      )
    }

    // Build category slug list for prompt (avoids a tool call)
    const categoryHints = TOP_CATEGORIES.map((c) => `${c.slug} (${c.name})`).join(", ")

    const systemPrompt = [
      "You are a fast, helpful shopping assistant for a marketplace. Goal: help the user find products quickly.",
      "",
      "OUTPUT RULES:",
      "- Never mention tool names, JSON, or internal details.",
      "- Match the user's language (Bulgarian → bg; otherwise English).",
      "- Keep responses SHORT (bullet list preferred).",
      "- Prices are stored in BGN. If the user mentions $/USD/€/EUR, ask to clarify currency and do not apply minPrice/maxPrice yet.",
      "",
      "AVAILABLE CATEGORY SLUGS (use in searchProducts if relevant):",
      categoryHints,
      "",
      "WORKFLOW:",
      "1. When the user asks to find/browse/recommend products, call searchProducts once with good keywords.",
      "2. If no/few results, try broader keywords or drop the category filter.",
      "3. Do NOT call multiple searches—one is enough. If results are empty, say so and suggest alternatives.",
      "",
      "RESULT FORMAT:",
      "- Up to 5 items: **Title** · Price · [View](url)",
      "- One-line summary why each fits.",
      "- If nothing found, suggest 2 alternative searches.",
    ].join("\n")

    const result = streamText({
      model: modelCtx.model,
      system: systemPrompt,
      messages: convertToModelMessages(messages),
      // ONE tool round-trip is usually enough; cap at 2 to save tokens
      stopWhen: stepCountIs(2),
      maxOutputTokens: AI_CONFIG.search.maxOutputTokens,
      temperature: AI_CONFIG.search.temperature,
      maxRetries: AI_CONFIG.search.maxRetries,
      ...(modelCtx.providerOptions ? { providerOptions: modelCtx.providerOptions } : {}),
      tools: {
        searchProducts: tool({
          description: "Search marketplace listings. Pass keywords in 'query'. Optionally filter by categorySlug (see prompt), minPrice, maxPrice. Returns up to 6 products.",
          inputSchema: searchProductsInput,
          execute: async (input) => searchProducts(input),
        }),
      },
    })

    return result.toUIMessageStreamResponse({
      onError: (error) => {
        console.error("AI route error:", error)
        const msg = error instanceof Error ? error.message : String(error)
        if (/quota exceeded|rate limit|too many requests|429/i.test(msg)) {
          const retryMatch = msg.match(/retry in\s+([0-9]+(?:\.[0-9]+)?)s/i)
          const retryHint = retryMatch?.[1] ? ` Try again in ~${retryMatch[1]}s.` : ""
          return `I'm temporarily rate-limited by the AI provider (${modelCtx.provider}).${retryHint}`
        }
        return "Sorry — something went wrong while searching."
      },
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal Server Error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
