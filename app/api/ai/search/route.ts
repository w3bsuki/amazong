import { NextResponse } from "next/server"
import { z } from "zod"
import {
  convertToModelMessages,
  stepCountIs,
  streamText,
  tool,
  type UIMessage,
} from "ai"
import { openai } from "@ai-sdk/openai"
import { google } from "@ai-sdk/google"
import { createStaticClient } from "@/lib/supabase/server"
import { getProductUrl } from "@/lib/url-utils"

export const maxDuration = 30

const searchProductsInput = z.object({
  query: z
    .string()
    .min(1)
    .describe("What the user is searching for, e.g. 'used car' or 'honda civic'")
    .optional(),
  minPrice: z.number().nonnegative().optional(),
  maxPrice: z.number().nonnegative().optional(),
  limit: z.number().int().min(1).max(20).default(8),
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

function normalizeProductImages(row: any): string[] {
  const directImages = Array.isArray(row?.images) ? (row.images as string[]) : []
  if (directImages.length > 0) return directImages

  const productImages = Array.isArray(row?.product_images) ? row.product_images : []
  return productImages
    .filter((img: any) => !!img?.image_url)
    .slice()
    .sort((a: any, b: any) => {
      const ap = a?.is_primary ? 1 : 0
      const bp = b?.is_primary ? 1 : 0
      if (ap !== bp) return bp - ap
      const ao = a?.display_order ?? 0
      const bo = b?.display_order ?? 0
      return ao - bo
    })
    .map((img: any) => img.image_url)
}

async function searchProducts({ query, minPrice, maxPrice, limit }: SearchProductsInput) {
  const supabase = createStaticClient()

  let dbQuery = supabase
    .from("products")
    .select(
      `
        id,
        title,
        price,
        images,
        slug,
        product_images(image_url,thumbnail_url,display_order,is_primary),
        seller:profiles(username)
      `,
    )
    .order("created_at", { ascending: false })
    .limit(limit)

  if (typeof minPrice === "number") {
    dbQuery = dbQuery.gte("price", minPrice)
  }

  if (typeof maxPrice === "number") {
    dbQuery = dbQuery.lte("price", maxPrice)
  }

  const trimmedQuery = (query ?? "").trim()
  if (trimmedQuery) {
    const searchPattern = `%${trimmedQuery}%`
    dbQuery = dbQuery.or(`title.ilike.${searchPattern},description.ilike.${searchPattern}`)
  }

  const { data, error } = await dbQuery

  if (error) {
    console.error("AI searchProducts error:", error)
    return { products: [] as UiProduct[] }
  }

  const products: UiProduct[] = (data ?? []).map((p: any) => {
    const storeSlug = p?.seller?.username ?? null
    const slug = p?.slug ?? null

    const url = getProductUrl({
      id: p.id,
      slug,
      storeSlug,
      username: storeSlug,
    })

    return {
      id: p.id,
      title: p.title,
      price: p.price,
      images: normalizeProductImages(p),
      slug,
      storeSlug,
      url,
    }
  })

  return { products }
}

export async function POST(req: Request) {
  try {
    const { messages } = (await req.json()) as { messages: UIMessage[] }

    const model = process.env.GOOGLE_GENERATIVE_AI_API_KEY
      ? google("gemini-2.5-flash")
      : openai("gpt-4o-mini")

    const result = streamText({
      model,
      system:
        "You are an AI shopping assistant for a marketplace (like eBay/Amazon). " +
        "Your job is to help users find products that match their needs and budget. " +
        "Use the searchProducts tool to fetch real marketplace items before making recommendations. " +
        "If the user asks for something vague (e.g. 'best car for $3000'), ask 1-2 clarifying questions (location, type, must-have features) and still do a first pass search. " +
        "When you present products, include a short rationale and include the product URL for each item.",
      messages: convertToModelMessages(messages),
      stopWhen: stepCountIs(5),
      tools: {
        searchProducts: tool({
          description:
            "Search marketplace listings using keywords and optional price bounds. Returns a list of products.",
          inputSchema: searchProductsInput,
          execute: async (input) => searchProducts(input),
        }),
      },
    })

    return result.toUIMessageStreamResponse({
      onError: (error) => {
        console.error("AI route error:", error)
        return "Sorry — something went wrong while searching."
      },
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal Server Error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
