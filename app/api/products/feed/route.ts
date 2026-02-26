import type { NextRequest } from "next/server"
import { createStaticClient } from "@/lib/supabase/server"
import { fetchProductsFeedPage } from "@/lib/data/products/api-feed"
import { 
  cachedJsonResponse, 
  dbUnavailableResponse, 
  noStoreJson,
  parsePaginationParams 
} from "@/lib/api/response-helpers"
import { z } from "zod"

import { logger } from "@/lib/logger"
const FEED_TYPE_VALUES = [
  'all',
  'newest',
  'promoted',
  'deals',
  'top_rated',
  'most_viewed',
  'best_sellers',
  'price_low',
  'price_high',
  'free_shipping',
  'ending_soon',
  'nearby',
  'near_me',
] as const

const FeedTypeSchema = z.enum(FEED_TYPE_VALUES)

const FeedQuerySchema = z.object({
  type: FeedTypeSchema.optional(),
  sort: FeedTypeSchema.optional(),
  category: z.string().trim().min(1).max(64).optional(),
  city: z.string().trim().min(1).max(80).optional(),
  filters: z.string().trim().max(200).optional(),
})

type FeedType = (typeof FEED_TYPE_VALUES)[number]
type ParsedFeedQuery = { success: boolean; data?: z.infer<typeof FeedQuerySchema> }

function resolveFeedType(parsedQuery: ParsedFeedQuery, filterTypes: Set<string>): FeedType {
  if (!parsedQuery.success || !parsedQuery.data) return "all"

  const requestedType = parsedQuery.data.type ?? parsedQuery.data.sort ?? "all"
  if (requestedType !== "all") return requestedType

  let resolvedType: FeedType = "all"
  if (filterTypes.has("nearby") || filterTypes.has("near_me")) resolvedType = "nearby"
  if (filterTypes.has("promoted")) resolvedType = "promoted"
  if (filterTypes.has("deals")) resolvedType = "deals"
  if (filterTypes.has("free_shipping")) resolvedType = "free_shipping"
  return resolvedType
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const parsedQuery = FeedQuerySchema.safeParse({
    type: searchParams.get("type") ?? undefined,
    sort: searchParams.get("sort") ?? undefined,
    category: searchParams.get("category") ?? undefined,
    city: searchParams.get("city") ?? undefined,
    filters: searchParams.get("filters") ?? undefined,
  })

  const filterTypes = new Set(
    (parsedQuery.success ? parsedQuery.data.filters : "")
      ?.split(",")
      .map((value) => value.trim())
      .filter(Boolean) ?? []
  )

  const type = resolveFeedType(parsedQuery, filterTypes)

  const { page, limit: safeLimit, offset } = parsePaginationParams(searchParams)
  const category = parsedQuery.success ? parsedQuery.data.category : undefined
  const city = parsedQuery.success ? parsedQuery.data.city : undefined
  const nowIso = new Date().toISOString()
  
  try {
    const supabase = createStaticClient()
    if (!supabase) {
      return dbUnavailableResponse({ products: [], hasMore: false })
    }

    const feedResult = await fetchProductsFeedPage({
      supabase,
      type,
      offset,
      limit: safeLimit,
      nowIso,
      ...(category ? { categorySlug: category } : {}),
      ...(city ? { city } : {}),
    })

    if (!feedResult.ok) {
      logger.error("[API] Feed products error:", feedResult.error)
      return noStoreJson({ 
        products: [], 
        hasMore: false,
        error: "Query failed" 
      }, { status: 500 })
    }

    return cachedJsonResponse(
      {
        products: feedResult.products,
        hasMore: feedResult.hasMore,
        totalCount: feedResult.totalCount,
        page,
      },
      type === "deals" ? "deals" : "products"
    )
  } catch (error) {
    logger.error("[API] Feed products exception:", error)
    return noStoreJson({ 
      products: [], 
      hasMore: false,
      error: "Internal server error" 
    }, { status: 500 })
  }
}
