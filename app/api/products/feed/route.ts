import type { NextRequest } from "next/server"
import { createStaticClient } from "@/lib/supabase/server"
import { toUI, normalizeProductRow } from "@/lib/data/products"
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

interface FeedQueryLike {
  eq(column: string, value: unknown): this
  gt(column: string, value: unknown): this
  gte(column: string, value: unknown): this
  lt(column: string, value: unknown): this
  ilike(column: string, value: string): this
  order(column: string, options?: { ascending?: boolean; nullsFirst?: boolean }): this
}

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

function normalizeNearbyCity(city: string | undefined): string {
  if (city && city !== "undefined" && city !== "null") {
    return city
  }
  // Default to Sofia for Bulgarian users if no city detected yet
  return "sofia"
}

function applyTypeSpecificFeedQuery<T extends FeedQueryLike>(query: T, type: FeedType, nowIso: string, city: string | undefined): T {
  switch (type) {
    case "promoted":
      // Only show products with ACTIVE boosts (not expired) and use fair rotation
      return query
        .eq("is_boosted", true)
        .gt("boost_expires_at", nowIso)
        .order("boost_expires_at", { ascending: true }) // Fair rotation: soonest-expiring first

    case "deals":
      return query
        .order("effective_discount", { ascending: false, nullsFirst: false })
        .order("created_at", { ascending: false })

    case "top_rated":
      return query
        .gte("rating", 4)
        .order("rating", { ascending: false })
        .order("review_count", { ascending: false })

    case "most_viewed":
      // Proxy for most viewed: high review count + high rating
      return query
        .order("review_count", { ascending: false })
        .order("rating", { ascending: false })

    case "best_sellers":
      // Proxy for best sellers: high review count + recent
      return query
        .order("review_count", { ascending: false })
        .order("created_at", { ascending: false })

    case "price_low":
      return query.order("price", { ascending: true })

    case "price_high":
      return query.order("price", { ascending: false })

    case "free_shipping":
      return query
        .eq("free_shipping", true)
        .order("created_at", { ascending: false })

    case "ending_soon": {
      // Sales ending within 7 days, sorted by soonest end
      const weekFromNow = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      return query
        .eq("is_on_sale", true)
        .gt("sale_end_date", nowIso)
        .lt("sale_end_date", weekFromNow)
        .order("sale_end_date", { ascending: true })
    }

    case "nearby":
    case "near_me":
      return query
        .ilike("seller_city", normalizeNearbyCity(city))
        .order("created_at", { ascending: false })

    case "newest":
    case "all":
    default:
      return query.order("created_at", { ascending: false })
  }
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

    const baseSelect = `
        id, 
        title, 
        price, 
        list_price, 
        is_on_sale,
        sale_percent,
        sale_end_date,
        rating, 
        review_count, 
        images,
        is_boosted,
        boost_expires_at,
        created_at, 
        free_shipping,
        seller_city,
        slug,
        attributes,
        seller:profiles(id,username,display_name,business_name,avatar_url,tier,account_type,is_verified_business),
        categories!inner(
          id,slug,name,name_bg,icon,
          parent:categories!parent_id(id,slug,name,name_bg,icon,
            parent:categories!parent_id(id,slug,name,name_bg,icon)
          )
        )
      `

    const dealsSelect = `
        id, 
        title, 
        price, 
        list_price, 
        is_on_sale,
        sale_percent,
        sale_end_date,
        effective_discount,
        rating, 
        review_count, 
        images,
        is_boosted,
        boost_expires_at,
        created_at, 
        free_shipping,
        seller_city,
        slug,
        attributes,
        seller:profiles(id,username,display_name,business_name,avatar_url,tier,account_type,is_verified_business),
        categories!inner(
          id,slug,name,name_bg,icon,
          parent:categories!parent_id(id,slug,name,name_bg,icon,
            parent:categories!parent_id(id,slug,name,name_bg,icon)
          )
        )
      `

    let query =
      type === "deals"
        ? supabase.from("deal_products").select(dealsSelect, { count: "exact" })
        : supabase.from("products").select(baseSelect, { count: "exact" })

    // Public browsing surfaces must not show non-active listings.
    // Temporary legacy allowance: status can be NULL for older rows.
    query = query.or("status.eq.active,status.is.null")

    // Apply Category Filter
    if (category && category !== 'all') {
      query = query.eq('categories.slug', category)
    }

    // Apply Type-specific Filters and Sorting
    query = applyTypeSpecificFeedQuery(query, type, nowIso, city)

    const { data, error, count } = await query.range(offset, offset + safeLimit - 1)

    if (error) {
      logger.error("[API] Feed products error:", error.message)
      return noStoreJson({ 
        products: [], 
        hasMore: false,
        error: error.message 
      }, { status: 500 })
    }

    const rows: unknown[] = Array.isArray(data) ? data : []

    // Transform to UI format using shared normalizer (runtime-guarded for view nullability)
    const products = rows
      .filter((row) => {
        if (!row || typeof row !== "object") return false
        const r = row as Record<string, unknown>
        return typeof r.id === "string" && typeof r.title === "string" && typeof r.price === "number"
      })
      .map((row) => toUI(normalizeProductRow(row as Parameters<typeof normalizeProductRow>[0])))

    const totalCount = count || 0
    const hasMore = offset + products.length < totalCount

    return cachedJsonResponse(
      {
        products,
        hasMore,
        totalCount,
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
