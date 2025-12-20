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
import { createClient } from "@/lib/supabase/server"
import { getProductUrl } from "@/lib/url-utils"
import { AI_CONFIG } from "@/lib/ai/config"
import { getAiModel } from "@/lib/ai/providers"
import { buildMarketplaceSystemPrompt, type MarketplaceChatMode } from "@/lib/ai/prompts"
import { compactUIMessages } from "@/lib/ai/ui-messages"
import { aiEnv } from "@/lib/ai/env"

export const maxDuration = 60

// ============================================================================
// Types
// ============================================================================

type UiProduct = {
  id: string
  title: string
  price: number
  images: string[]
  slug: string | null
  storeSlug: string | null
  url: string
  rating?: number
  reviewCount?: number
}

type CategoryInfo = {
  id: string
  name: string
  slug: string
  parentId: string | null
}

// ============================================================================
// Tool Input Schemas
// ============================================================================

const nonNegativeNumberFromString = z.preprocess(
  (v) => {
    if (v === undefined || v === null) return undefined
    if (typeof v === "number") return v
    if (typeof v === "string") {
      const trimmed = v.trim()
      if (!trimmed) return undefined
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
    .describe("Search keywords for products, e.g. 'laptop' or 'winter jacket'")
    .optional(),
  categorySlug: z
    .string()
    .describe("Category slug to filter by, e.g. 'electronics', 'fashion'")
    .optional(),
  // Accept numeric strings too (some providers emit numbers as strings)
  minPrice: nonNegativeNumberFromString.describe("Minimum price filter"),
  maxPrice: nonNegativeNumberFromString.describe("Maximum price filter"),
  limit: z.coerce.number().int().min(1).max(20).default(8).describe("Number of results to return"),
})

const createListingInput = z.object({
  title: z.string().min(5).max(200).describe("Product title (5-200 characters)"),
  description: z.string().min(20).max(5000).describe("Product description (20-5000 characters)"),
  price: z.number().positive().describe("Product price in currency"),
  categoryId: z.string().uuid().describe("Category ID (use getCategories to find)").optional(),
  stock: z.number().int().min(1).default(1).describe("Quantity available"),
  images: z.array(z.object({
    url: z.string().url(),
    thumbnailUrl: z.string().url().optional(),
  })).min(1).describe("Product images (at least 1 required)"),
  condition: z.enum(["new", "used", "refurbished", "like_new", "good", "fair"]).default("new").describe("Product condition"),
})

const getSuggestionsInput = z.object({
  context: z.string().describe("What kind of product suggestions the user wants, e.g. 'gifts for dad', 'tech gadgets under 100'"),
})

const listProductsInput = z.object({
  limit: z.coerce.number().int().min(1).max(20).default(8).describe("Number of results to return"),
})

// ============================================================================
// AI Vision - Analyze Listing Images
// ============================================================================

const analyzeImagesInput = z.object({
  imageUrls: z.array(z.string().url()).min(1).max(4).describe("URLs of uploaded product images to analyze"),
  locale: z.string().default("en").describe("Locale for response language"),
})

const analyzeImagesOutput = z.object({
  title: z.string().nullable().describe("Suggested product title"),
  description: z.string().nullable().describe("Suggested product description"),
  condition: z.enum(["new", "used", "refurbished", "like_new", "good", "fair"]).nullable(),
  category: z.object({
    slug: z.string().nullable(),
    name: z.string().nullable(),
    confidence: z.enum(["high", "medium", "low"]).nullable(),
  }).nullable(),
  brand: z.object({
    name: z.string().nullable(),
    confidence: z.enum(["high", "medium", "low"]).nullable(),
  }).nullable(),
  suggestedPrice: z.object({
    low: z.number().nullable(),
    mid: z.number().nullable(),
    high: z.number().nullable(),
    currency: z.string().default("BGN"),
  }).nullable(),
  attributes: z.array(z.object({
    name: z.string(),
    value: z.string(),
  })).default([]),
  tags: z.array(z.string()).default([]),
})

// Preview listing schema - for showing user a preview before publishing
const previewListingInput = z.object({
  title: z.string().min(5).max(200),
  description: z.string().min(20).max(5000),
  price: z.number().positive(),
  categorySlug: z.string().optional(),
  condition: z.enum(["new", "used", "refurbished", "like_new", "good", "fair"]).default("new"),
  images: z.array(z.object({ url: z.string().url() })).min(1),
  brand: z.string().optional(),
  attributes: z.array(z.object({ name: z.string(), value: z.string() })).optional(),
})

// ============================================================================
// Tool Implementations
// ============================================================================

// Lightweight category fetch (only when truly needed, e.g., listing creation)
async function getCategories(): Promise<{ categories: CategoryInfo[] }> {
  const supabase = createStaticClient()
  const { data, error } = await supabase
    .from("categories")
    .select("id, name, slug, parent_id")
    .is("parent_id", null) // top-level only to reduce payload
    .order("name")
    .limit(20)

  if (error) {
    console.error("getCategories error:", error)
    return { categories: [] }
  }

  return {
    categories: (data ?? []).map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      parentId: c.parent_id,
    })),
  }
}

// TOKEN-OPTIMIZED product search: minimal fields, small limit.
async function searchProducts(input: z.infer<typeof searchProductsInput>): Promise<{ products: UiProduct[] }> {
  const { query, categorySlug, minPrice, maxPrice, limit } = input
  const effectiveLimit = Math.min(limit, 6) // hard cap
  const supabase = createStaticClient()

  // Resolve category slug to ID
  let categoryId: string | null = null
  if (categorySlug) {
    const { data: catData } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", categorySlug)
      .single()
    categoryId = catData?.id ?? null
  }

  // MINIMAL select to reduce token cost
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
    console.error("searchProducts error:", error)
    return { products: [] }
  }

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

// Minimal newest listings
async function getNewestListings(input: z.infer<typeof listProductsInput>): Promise<{ products: UiProduct[] }> {
  const supabase = createStaticClient()
  const effectiveLimit = Math.min(input.limit, 6)

  const { data, error } = await supabase
    .from("products")
    .select(`id, title, price, images, slug, seller:profiles(username)`)
    .order("created_at", { ascending: false })
    .limit(effectiveLimit)

  if (error) {
    console.error("getNewestListings error:", error)
    return { products: [] }
  }

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

// Minimal promoted listings
async function getPromotedListings(input: z.infer<typeof listProductsInput>): Promise<{ products: UiProduct[] }> {
  const supabase = createStaticClient()
  const effectiveLimit = Math.min(input.limit, 6)

  const { data, error } = await supabase
    .from("products")
    .select(`id, title, price, images, slug, seller:profiles(username)`)
    .or("listing_type.eq.boosted,is_boosted.eq.true")
    .order("created_at", { ascending: false })
    .limit(effectiveLimit)

  if (error) {
    console.error("getPromotedListings error:", error)
    return { products: [] }
  }

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

async function createListing(input: z.infer<typeof createListingInput>): Promise<{ success: boolean; productId?: string; error?: string; url?: string }> {
  try {
    const supabase = await createClient()
    if (!supabase) {
      return { success: false, error: "Database connection failed" }
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return { success: false, error: "You must be logged in to create a listing. Please sign in first." }
    }

    // Check if user has a username
    const { data: profile } = await supabase
      .from("profiles")
      .select("id, username")
      .eq("id", user.id)
      .single()

    if (!profile?.username) {
      return { success: false, error: "You need to set up your seller profile with a username before listing products." }
    }

    // Generate slug
    const baseSlug = input.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
    const slug = `${baseSlug}-${Date.now().toString(36)}`

    // Use static client with service role for insert
    const supabaseAdmin = createStaticClient()
    
    const { data: product, error: insertError } = await supabaseAdmin
      .from("products")
      .insert({
        seller_id: user.id,
        title: input.title,
        description: input.description,
        price: input.price,
        category_id: input.categoryId || null,
        stock: input.stock,
        images: input.images.map((img) => img.url),
        slug,
        condition: input.condition,
        listing_type: "normal",
        is_boosted: false,
      })
      .select("id, slug")
      .single()

    if (insertError) {
      console.error("createListing error:", insertError)
      return { success: false, error: insertError.message }
    }

    // Insert product images
    if (input.images.length > 0) {
      const imageRecords = input.images.map((img, index) => ({
        product_id: product.id,
        image_url: img.url,
        thumbnail_url: img.thumbnailUrl || img.url,
        display_order: index,
        is_primary: index === 0,
      }))

      await supabaseAdmin.from("product_images").insert(imageRecords)
    }

    const productUrl = getProductUrl({
      id: product.id,
      slug: product.slug,
      storeSlug: profile.username,
      username: profile.username,
    })

    return { success: true, productId: product.id, url: productUrl }
  } catch (err) {
    console.error("createListing error:", err)
    return { success: false, error: "Failed to create listing" }
  }
}

// ============================================================================
// AI Vision - Analyze Images for Listing
// ============================================================================

async function analyzeListingImages(input: z.infer<typeof analyzeImagesInput>) {
  const { generateObject } = await import("ai")

  const modelCtx = getAiModel("vision", { tags: ["listing-vision"] })
  if (!modelCtx) {
    return { error: "No AI model available for image analysis" }
  }

  const locale = input.locale === "bg" ? "bg" : "en"

  const promptText = `You are an expert marketplace listing assistant analyzing product images.

Analyze the provided images and extract:
1. **Title**: Concise, descriptive title (max 80 chars)
2. **Description**: Detailed product description (100-300 chars)
3. **Condition**: new, used, like_new, good, fair, or refurbished
4. **Category**: Best matching category slug (electronics, fashion, home, automotive, sports, toys, books, etc.)
5. **Brand**: If recognizable (BMW, Apple, Nike, Samsung, Sony, Adidas, etc.)
6. **Price**: Suggest realistic market price range in BGN
7. **Attributes**: Color, size, model, material, year, etc.
8. **Tags**: Relevant search tags (max 5)

For brand recognition:
- If you see a clear logo or brand name, confidence is "high"
- If you infer from design/style, confidence is "medium"  
- If guessing, confidence is "low"

For category:
- Be specific: "smartphones" not just "electronics"
- Common slugs: electronics, fashion, home-garden, automotive, sports, toys-games, books, beauty, jewelry

Language for title/description: ${locale === "bg" ? "Bulgarian" : "English"}
Currency: BGN`

  try {
    const imageParts = input.imageUrls.slice(0, 4).map((url) => ({
      type: "image" as const,
      image: new URL(url),
    }))

    const result = await generateObject({
      model: modelCtx.model,
      schema: analyzeImagesOutput,
      // Disable automatic retries to avoid wasting quota on rate limit errors
      maxRetries: AI_CONFIG.vision.maxRetries,
      messages: [{
        role: "user",
        content: [{ type: "text", text: promptText }, ...imageParts],
      }],
    })

    return result.object
  } catch (err) {
    console.error("analyzeListingImages error:", err)
    return { error: "Failed to analyze images. Please try again." }
  }
}

async function getProductSuggestions(input: z.infer<typeof getSuggestionsInput>): Promise<{ suggestions: string[] }> {
  // Based on context, return relevant search suggestions
  const context = input.context.toLowerCase()
  
  const suggestionMap: Record<string, string[]> = {
    dad: ["tools", "electronics", "watches", "outdoor gear", "sports equipment"],
    mom: ["jewelry", "home decor", "kitchen appliances", "skincare", "handbags"],
    tech: ["laptops", "smartphones", "headphones", "smart home", "gaming"],
    student: ["laptops", "backpacks", "headphones", "desk accessories", "books"],
    gift: ["watches", "jewelry", "electronics", "fashion accessories", "gift cards"],
    home: ["furniture", "kitchen", "decor", "lighting", "storage"],
    fashion: ["clothing", "shoes", "accessories", "bags", "watches"],
    sports: ["fitness equipment", "sportswear", "outdoor gear", "bikes", "accessories"],
  }

  const matchedSuggestions: string[] = []
  for (const [key, suggestions] of Object.entries(suggestionMap)) {
    if (context.includes(key)) {
      matchedSuggestions.push(...suggestions)
    }
  }

  // If no matches, return generic popular categories
  if (matchedSuggestions.length === 0) {
    return { suggestions: ["electronics", "fashion", "home & garden", "sports", "automotive"] }
  }

  return { suggestions: [...new Set(matchedSuggestions)].slice(0, 5) }
}

async function checkUserAuth(): Promise<{ isAuthenticated: boolean; username?: string; canSell: boolean }> {
  try {
    const supabase = await createClient()
    if (!supabase) {
      return { isAuthenticated: false, canSell: false }
    }

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return { isAuthenticated: false, canSell: false }
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("username")
      .eq("id", user.id)
      .single()

    return {
      isAuthenticated: true,
      username: profile?.username || undefined,
      canSell: !!profile?.username,
    }
  } catch {
    return { isAuthenticated: false, canSell: false }
  }
}

// ============================================================================
// Main API Route
// ============================================================================

export async function POST(req: Request) {
  try {
    const { messages: rawMessages, mode } = (await req.json()) as {
      messages: UIMessage[]
      mode?: MarketplaceChatMode
    }

    const safeMode: MarketplaceChatMode = mode === "buy" || mode === "sell" ? mode : "initial"

    // Preserve conversational context but remove tool outputs to reduce token bloat.
    const messages = compactUIMessages(rawMessages, { maxMessages: AI_CONFIG.chat.maxMessages })

    // Optional: attach a stable user id for usage tracking when using the Gateway.
    let userId: string | undefined
    try {
      const supabase = await createClient()
      const { data: { user } } = await supabase.auth.getUser()
      userId = user?.id
    } catch {
      userId = undefined
    }

    const modelCtx = getAiModel("chat", {
      userId,
      tags: ["marketplace-chat", `mode:${safeMode}`],
    })

    if (!modelCtx) {
      return NextResponse.json(
        { error: "No AI provider configured. Set AI_GATEWAY_API_KEY (recommended) or OPENAI_API_KEY / GOOGLE_GENERATIVE_AI_API_KEY / GROQ_API_KEY." },
        { status: 500 }
      )
    }

    const systemPrompt = buildMarketplaceSystemPrompt(safeMode)

    const isBuyMode = safeMode === "buy"

    // Heuristic: if the user message is too short (or just a number), disable tools.
    // This avoids brittle tool-calling on some providers (e.g. Groq) and yields a normal clarifying question.
    const lastUser = [...messages].reverse().find((m) => m.role === "user") as any
    const lastUserText =
      (typeof lastUser?.content === "string" ? lastUser.content : "") ||
      (Array.isArray(lastUser?.parts)
        ? String(lastUser.parts.find((p: any) => p?.type === "text")?.text ?? "")
        : "")
    const lastTrimmed = String(lastUserText ?? "").trim()
    const disableToolsForThisTurn = lastTrimmed.length > 0 && (lastTrimmed.length < 3 || /^[0-9]+$/.test(lastTrimmed))

    const toolsForMode: Record<string, any> = disableToolsForThisTurn
      ? {}
      : safeMode === "buy"
        ? {
            searchProducts: tool({
              description: "Search products by keywords. Prices are stored in BGN. Only apply minPrice/maxPrice if the user budget is in BGN/лв; if they mention $/USD/€/EUR, ask to clarify currency and search without price filters. Returns up to 6 items.",
              inputSchema: searchProductsInput,
              execute: async (input) => searchProducts(input),
            }),
            getNewestListings: tool({
              description: "Get newest listings (recently created).",
              inputSchema: listProductsInput,
              execute: async (input) => getNewestListings(input),
            }),
            getPromotedListings: tool({
              description: "Get promoted/boosted listings.",
              inputSchema: listProductsInput,
              execute: async (input) => getPromotedListings(input),
            }),
            getProductSuggestions: tool({
              description: "Get product suggestions for gifts/inspiration.",
              inputSchema: getSuggestionsInput,
              execute: async (input) => getProductSuggestions(input),
            }),
          }
        : {
            checkUserAuth: tool({
              description: "Check if user is authenticated and can sell. Returns auth status.",
              inputSchema: z.object({}),
              execute: async () => checkUserAuth(),
            }),
            getCategories: tool({
              description: "Get top-level categories for listing creation.",
              inputSchema: z.object({}),
              execute: async () => getCategories(),
            }),
            analyzeListingImages: tool({
              description: "Analyze uploaded product images using AI vision to recognize category, brand, condition, and suggest listing details. Use this IMMEDIATELY when the user uploads images for their listing.",
              inputSchema: analyzeImagesInput,
              execute: async (input) => analyzeListingImages(input),
            }),
            previewListing: tool({
              description: "Generate a listing preview for the user to review before publishing. Returns structured data that displays as an interactive preview card. Use this after gathering all listing details and before createListing.",
              inputSchema: previewListingInput,
              execute: async (input) => ({
                preview: true,
                listing: {
                  title: input.title,
                  description: input.description,
                  price: input.price,
                  categorySlug: input.categorySlug,
                  condition: input.condition,
                  images: input.images,
                  brand: input.brand,
                  attributes: input.attributes || [],
                },
              }),
            }),
            createListing: tool({
              description: "Create a new product listing. Requires title, description (min 20 chars), price, and at least 1 image. The user must be authenticated.",
              inputSchema: createListingInput,
              execute: async (input) => createListing(input),
            }),
            // Optional: search tools still useful while selling (pricing comps)
            searchProducts: tool({
              description: "Search products by keywords. Prices are stored in BGN. Useful for pricing comps while creating a listing.",
              inputSchema: searchProductsInput,
              execute: async (input) => searchProducts(input),
            }),
          }

    const result = streamText({
      model: modelCtx.model,
      system: systemPrompt,
      messages: convertToModelMessages(messages),
      maxOutputTokens: AI_CONFIG.chat.maxOutputTokens,
      temperature: AI_CONFIG.chat.temperature,
      // Avoid burning quota with automatic retries (especially on Gemini free tier).
      maxRetries: AI_CONFIG.chat.maxRetries,
      // Buy mode: 2 steps max (search + respond). Sell mode: 3 steps (auth + analyze + create).
      stopWhen: stepCountIs(isBuyMode ? 2 : 3),
      providerOptions: modelCtx.providerOptions,
      tools: toolsForMode as any,
    })

    return result.toUIMessageStreamResponse({
      sendSources: true,
      // Don't stream internal reasoning by default (safer for production UX).
      sendReasoning: aiEnv.flags.sendReasoning,
      onError: (error) => {
        const msg = typeof (error as any)?.message === "string" ? (error as any).message : String(error)
        const isDev = process.env.NODE_ENV !== "production"
        const debugSuffix = isDev && msg ? `\n\n[debug] ${msg}` : ""

        // Common provider messages (Gemini free tier, OpenAI 429, Gateway rate limits)
        if (/quota exceeded|rate limit|too many requests|429/i.test(msg)) {
          // Surface the provider's suggested retry delay if present.
          const retryMatch = msg.match(/retry in\s+([0-9]+(\.[0-9]+)?)s/i)
          const retryHint = retryMatch?.[1] ? ` Try again in ~${retryMatch[1]}s.` : ""
          return `I'm temporarily rate-limited by the AI provider (${modelCtx.provider}).${retryHint} If this keeps happening, switch to another model/provider (Vercel AI Gateway is recommended).${debugSuffix}`
        }

        if (/tool|function call|function calling|invalid tool|unknown tool|schema/i.test(msg)) {
          return `The AI provider (${modelCtx.provider}) returned an invalid tool/function call. This usually happens when the model isn't reliably following tool-calling rules. Try switching providers/models (Gateway recommended).${debugSuffix}`
        }

        if (/No AI provider configured/i.test(msg)) {
          return `No AI provider configured. Set AI_GATEWAY_API_KEY (recommended) or OPENAI_API_KEY / GOOGLE_GENERATIVE_AI_API_KEY / GROQ_API_KEY.${debugSuffix}`
        }

        return `Sorry — something went wrong while processing that. Please try again.\n\n(Provider: ${modelCtx.provider})${debugSuffix}`
      },
    })
  } catch (error) {
    console.error("Chat API error:", error)
    const message = error instanceof Error ? error.message : "Internal Server Error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
