import { NextResponse } from "next/server"
import { z } from "zod"
import {
  convertToModelMessages,
  stepCountIs,
  streamText,
  tool,
  type UIMessage,
} from "ai"
import { createStaticClient } from "@/lib/supabase/server"
import { getProductUrl } from "@/lib/url-utils"
import { AI_CONFIG } from "@/lib/ai/config"
import { getAiModel } from "@/lib/ai/providers"
import { compactUIMessages } from "@/lib/ai/ui-messages"

export const maxDuration = 30

const nonNegativeNumberFromString = z.preprocess(
  (v) => {
    if (v === undefined || v === null) return
    if (typeof v === "number") return v
    if (typeof v === "string") {
      const trimmed = v.trim()
      if (!trimmed) return
      const n = Number(trimmed)
      return Number.isFinite(n) ? n : v
    }
    return v
  },
  z.number().nonnegative().optional(),
)

const searchProductsInput = z.object({
  query: z
    .string()
    .min(1)
    .describe("What the user is searching for, e.g. 'used car' or 'honda civic'")
    .optional(),
  categorySlug: z
    .string()
    .describe("Category slug to filter by, e.g. 'electronics', 'fashion', 'automotive'. Use getCategories tool first to see available options.")
    .optional(),
  // Accept numeric strings too (some providers emit numbers as strings)
  minPrice: nonNegativeNumberFromString,
  maxPrice: nonNegativeNumberFromString,
  limit: z.coerce.number().int().min(1).max(20).default(8),
})

type SearchProductsInput = z.infer<typeof searchProductsInput>

type UiProduct = {
  id: string
  title: string
  price: number
  images: string[]
  slug: string | null
  storeSlug: string | null
  url: string
}

// TOP-LEVEL CATEGORY SLUGS (embedded to avoid token-burning DB fetch)
// Keep this list small—just the main marketplace verticals.
const TOP_CATEGORIES = [
  { slug: "electronics", name: "Electronics" },
  { slug: "fashion", name: "Fashion & Clothing" },
  { slug: "automotive", name: "Automotive & Vehicles" },
  { slug: "home-garden", name: "Home & Garden" },
  { slug: "sports", name: "Sports & Outdoors" },
  { slug: "beauty", name: "Beauty & Personal Care" },
  { slug: "toys-games", name: "Toys & Games" },
  { slug: "books-media", name: "Books & Media" },
  { slug: "collectibles", name: "Collectibles & Art" },
  { slug: "other", name: "Other" },
] as const

// TOKEN-OPTIMIZED product search: minimal fields, capped output.
async function searchProducts({ query, categorySlug, minPrice, maxPrice, limit }: SearchProductsInput) {
  const supabase = createStaticClient()
  const effectiveLimit = Math.min(limit, 6) // cap to avoid bloat

  // If categorySlug provided, resolve to category ID
  let categoryId: string | null = null
  if (categorySlug) {
    const { data: catData } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", categorySlug)
      .single()
    categoryId = catData?.id ?? null
  }

  // MINIMAL select: only what the UI card needs
  const buildBaseQuery = () => {
    let dbQuery = supabase
      .from("products")
      .select(`id, title, price, images, slug, seller:profiles(username)`)
      .order("created_at", { ascending: false })
      .limit(effectiveLimit)

    if (categoryId) dbQuery = dbQuery.eq("category_id", categoryId)
    if (typeof minPrice === "number") dbQuery = dbQuery.gte("price", minPrice)
    if (typeof maxPrice === "number") dbQuery = dbQuery.lte("price", maxPrice)
    return dbQuery
  }

  const trimmedQuery = (query ?? "").trim()
  let data: any[] | null = null
  let error: any = null

  if (trimmedQuery) {
    const ftsResult = await buildBaseQuery().textSearch("search_vector", trimmedQuery, { type: "websearch" })
    data = ftsResult.data
    error = ftsResult.error

    if (error || !data?.length) {
      const searchPattern = `%${trimmedQuery}%`
      const fallback = await buildBaseQuery().or(`title.ilike.${searchPattern},description.ilike.${searchPattern}`)
      data = fallback.data
      error = fallback.error
    }
  } else {
    const base = await buildBaseQuery()
    data = base.data
    error = base.error
  }

  if (error) {
    console.error("AI searchProducts error:", error)
    return { products: [] as UiProduct[] }
  }

  // Build minimal product objects for the model (~150 tokens max total)
  const products: UiProduct[] = (data ?? []).map((p: any) => {
    const storeSlug = p?.seller?.username ?? null
    const images = Array.isArray(p?.images) ? p.images.slice(0, 1) : []
    return {
      id: p.id,
      title: (p.title ?? "").slice(0, 80),
      price: p.price,
      images,
      slug: p?.slug ?? null,
      storeSlug,
      url: getProductUrl({ id: p.id, slug: p?.slug, storeSlug, username: storeSlug }),
    }
  })

  return { products }
}

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
      providerOptions: modelCtx.providerOptions,
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
        const msg = typeof (error as any)?.message === "string" ? (error as any).message : String(error)
        if (/quota exceeded|rate limit|too many requests|429/i.test(msg)) {
          const retryMatch = msg.match(/retry in\s+([0-9]+(\.[0-9]+)?)s/i)
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
