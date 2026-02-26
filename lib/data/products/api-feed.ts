import "server-only"

import { toUI } from "@/lib/data/products"
import { applyPublicProductVisibilityFilter } from "@/lib/supabase/filters/visibility"
import { DEAL_PRODUCTS_API_FEED_SELECT, PRODUCT_API_FEED_SELECT } from "@/lib/supabase/selects/products"
import type { Database } from "@/lib/supabase/database.types"
import type { SupabaseClient } from "@supabase/supabase-js"
import { buildUiProductPage } from "./api-shared"

type DbClient = SupabaseClient<Database>

type FeedType =
  | "all"
  | "newest"
  | "promoted"
  | "deals"
  | "top_rated"
  | "most_viewed"
  | "best_sellers"
  | "price_low"
  | "price_high"
  | "free_shipping"
  | "ending_soon"
  | "nearby"
  | "near_me"

interface FeedQueryBuilder {
  eq(column: string, value: unknown): this
  or(filters: string): this
  gt(column: string, value: unknown): this
  gte(column: string, value: unknown): this
  lt(column: string, value: unknown): this
  ilike(column: string, value: string): this
  order(column: string, options?: { ascending?: boolean; nullsFirst?: boolean }): this
  range(from: number, to: number): PromiseLike<{ data: unknown[] | null; error: unknown; count: number | null }>
}

function normalizeNearbyCity(city: string | undefined): string {
  if (city && city !== "undefined" && city !== "null") {
    return city
  }
  return "sofia"
}

function applyTypeSpecificFeedQuery<T extends FeedQueryBuilder>(
  query: T,
  type: FeedType,
  nowIso: string,
  city: string | undefined
): T {
  switch (type) {
    case "promoted":
      return query
        .eq("is_boosted", true)
        .gt("boost_expires_at", nowIso)
        .order("boost_expires_at", { ascending: true })

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
      return query
        .order("review_count", { ascending: false })
        .order("rating", { ascending: false })

    case "best_sellers":
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

export async function fetchProductsFeedPage(params: {
  supabase: DbClient
  type: FeedType
  offset: number
  limit: number
  nowIso: string
  categorySlug?: string
  city?: string
}): Promise<
  | { ok: true; products: ReturnType<typeof toUI>[]; totalCount: number; hasMore: boolean }
  | { ok: false; error: unknown }
> {
  const { supabase, type, offset, limit, nowIso, categorySlug, city } = params

  const safeLimit = Number.isFinite(limit) && limit > 0 ? Math.floor(limit) : 24
  const safeOffset = Number.isFinite(offset) && offset >= 0 ? Math.floor(offset) : 0

  let query =
    type === "deals"
      ? supabase.from("deal_products").select(DEAL_PRODUCTS_API_FEED_SELECT, { count: "exact" })
      : supabase.from("products").select(PRODUCT_API_FEED_SELECT, { count: "exact" })

  query = applyPublicProductVisibilityFilter(query)

  if (categorySlug && categorySlug !== "all") {
    query = query.eq("categories.slug", categorySlug)
  }

  query = applyTypeSpecificFeedQuery(query, type, nowIso, city)

  const { data, error, count } = await query.range(safeOffset, safeOffset + safeLimit - 1)

  if (error) {
    return { ok: false, error }
  }

  const { products, totalCount, hasMore } = buildUiProductPage({
    data,
    count,
    offset: safeOffset,
  })

  return { ok: true, products, totalCount, hasMore }
}
