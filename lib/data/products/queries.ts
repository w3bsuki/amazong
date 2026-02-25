import "server-only"

import { cacheLife, cacheTag } from "next/cache"
import { createStaticClient } from "@/lib/supabase/server"
import { getShippingFilter, type ShippingRegion } from "@/lib/shipping"
import type { Product } from "./types"
import { mapRowToProduct } from "./normalize"

import { logger } from "@/lib/logger"
const CATEGORY_WITH_PARENT_CHAIN_SELECT =
  `id,slug,name,name_bg,icon,
   parent:categories!parent_id(
     id,slug,name,name_bg,icon,
     parent:categories!parent_id(
       id,slug,name,name_bg,icon,
       parent:categories!parent_id(
         id,slug,name,name_bg,icon,
         parent:categories!parent_id(
           id,slug,name,name_bg,icon
         )
       )
     )
   )` as const

const PRODUCT_LIST_SELECT =
  `id, title, price, seller_id, list_price, is_on_sale, sale_percent, sale_end_date, rating, review_count, images, is_boosted, boost_expires_at, created_at, ships_to_bulgaria, ships_to_uk, ships_to_europe, ships_to_usa, ships_to_worldwide, pickup_only, free_shipping, category_id, slug,
   seller:profiles!seller_id(id,username,avatar_url,tier,account_type,is_verified_business,user_verification(email_verified,phone_verified,id_verified)),
   categories(${CATEGORY_WITH_PARENT_CHAIN_SELECT})` as const

const PRODUCT_LIST_BY_CATEGORY_SLUG_SELECT =
  `id, title, price, seller_id, list_price, is_on_sale, sale_percent, sale_end_date, rating, review_count, images, is_boosted, boost_expires_at, created_at, ships_to_bulgaria, ships_to_uk, ships_to_europe, ships_to_usa, ships_to_worldwide, pickup_only, free_shipping, category_id, slug,
   seller:profiles!seller_id(id,username,avatar_url,tier,account_type,is_verified_business,user_verification(email_verified,phone_verified,id_verified)),
   categories!inner(${CATEGORY_WITH_PARENT_CHAIN_SELECT})` as const

/**
 * Public browsing surfaces must not show non-active listings.
 *
 * Temporary legacy allowance:
 * - Some older rows may have `status = NULL`; treat them as "active" until a cleanup pass
 *   normalizes them. (PROD-DATA-002)
 */
function applyPublicProductVisibilityFilter<Q extends { or: (filters: string) => Q }>(q: Q): Q {
  return q.or("status.eq.active,status.is.null")
}

type QueryType = "deals" | "newest" | "bestsellers" | "featured" | "promo"

/**
 * Fetch products with stable ordering for caching.
 * NO new Date() inside - deterministic output for ISR.
 */
type LimitableResult<T> = { data: T[] | null; error: unknown | null }
type LimitableQuery<T> = PromiseLike<LimitableResult<T>> & {
  limit: (count: number) => LimitableQuery<T>
  order: (column: string, options: { ascending: boolean; nullsFirst?: boolean }) => LimitableQuery<T>
}

async function fetchProductsStable<T, Q extends LimitableQuery<T>>(
  makeQuery: () => Q,
  {
    limit,
    applySecondaryOrder,
  }: {
    limit: number
    applySecondaryOrder: (q: Q) => Q
  },
): Promise<{ data: T[]; error: unknown | null }> {
  // Stable query: order by secondary criteria only, include boost fields for post-cache sorting
  const query = applySecondaryOrder(makeQuery())
  const { data, error } = await query.limit(limit)

  if (error) return { data: [], error }
  return { data: data ?? [], error: null }
}

/**
 * Cached category query.
 * Mirrors `getProducts` but filters by `categories.slug`.
 */
export async function getProductsByCategorySlug(
  categorySlug: string,
  limit = 18,
  zone?: ShippingRegion,
): Promise<Product[]> {
  "use cache"
  cacheTag(`products:category:${categorySlug}`)
  cacheLife("products")
  try {
    const supabase = createStaticClient()
    // NOTE: NO new Date() here - would cause ISR write storm per Vercel docs

    const makeBaseQuery = () => {
      // OPTIMIZED: Flat category join - no 4-level nesting!
      // Use getCategoryPath() separately when breadcrumbs are needed.
      // Note: user_verification joins to profiles via user_id, and we join profiles via seller_id
      let q = supabase.from("products").select(PRODUCT_LIST_BY_CATEGORY_SLUG_SELECT).eq("categories.slug", categorySlug)

      q = applyPublicProductVisibilityFilter(q)

      // Apply shipping zone filter (WW = show all, so no filter)
      if (zone && zone !== "WW") {
        const shippingFilter = getShippingFilter(zone)
        if (shippingFilter) {
          q = q.or(shippingFilter)
        }
      }

      return q
    }

    const { data, error } = await fetchProductsStable(makeBaseQuery, {
      limit,
      applySecondaryOrder: (q) => q.order("created_at", { ascending: false }),
    })

    if (error) {
      logger.error(`[getProductsByCategorySlug:${categorySlug}] Supabase error`, error)
      return []
    }

    // Map to Product type - boost sorting happens post-cache by caller if needed
    return (data || []).map(mapRowToProduct)
  } catch (error) {
    logger.error(`[getProductsByCategorySlug:${categorySlug}] Unexpected error`, error)
    return []
  }
}

/**
 * Single cached function for all product queries.
 * Optional zone filtering is applied at the DB query level.
 */
export async function getProducts(type: QueryType, limit = 36, zone?: ShippingRegion): Promise<Product[]> {
  "use cache"
  cacheTag(`products:type:${type}`)
  cacheLife(type === "deals" ? "deals" : "products")
  try {
    const supabase = createStaticClient()
    // NOTE: NO new Date() here - would cause ISR write storm per Vercel docs

    const makeBaseQuery = () => {
      // OPTIMIZED: Flat category join - no 4-level nesting!
      // Use getCategoryPath() separately when breadcrumbs are needed.
      // Note: user_verification joins to profiles via user_id, and we join profiles via seller_id
      let q =
        type === "deals"
          ? supabase.from("deal_products").select(PRODUCT_LIST_SELECT)
          : supabase.from("products").select(PRODUCT_LIST_SELECT)

      q = applyPublicProductVisibilityFilter(q)

      // Apply shipping zone filter (WW = show all, so no filter)
      if (zone && zone !== "WW") {
        const shippingFilter = getShippingFilter(zone)
        if (shippingFilter) {
          q = q.or(shippingFilter)
        }
      }

      // Apply type filters (but no boost ordering here)
      switch (type) {
        case "deals":
          // Canonical semantics live in the `deal_products` view.
          break
        case "promo":
          // Legacy "promo" uses compare-at pricing.
          q = q.not("list_price", "is", null).gt("list_price", 0)
          break
        case "featured":
          // Include boosted products - active filtering happens post-cache
          // to avoid ISR write storms from new Date()
          q = q.eq("is_boosted", true).not("boost_expires_at", "is", null)
          break
      }

      return q
    }

    type ProductListQuery = ReturnType<typeof makeBaseQuery>

    const applySecondaryOrder = (q: ProductListQuery) => {
      switch (type) {
        case "newest":
          return q.order("created_at", { ascending: false })
        case "bestsellers":
          return q.order("review_count", { ascending: false })
        case "deals":
          // Prefer the biggest savings first (view computes effective_discount).
          return q
            .order("effective_discount", { ascending: false, nullsFirst: false })
            .order("created_at", { ascending: false })
        case "featured":
          // Fair rotation of active boosts
          return q.order("boost_expires_at", { ascending: true })
        default:
          return q
      }
    }

    // All types use stable fetch - no new Date() in cache
    // Boost priority sorting happens post-cache by caller if needed
    const { data, error } =
      type === "featured" || type === "newest"
        ? await applySecondaryOrder(makeBaseQuery()).limit(limit)
        : await fetchProductsStable(makeBaseQuery, {
            limit,
            applySecondaryOrder,
          })

    if (error) {
      logger.error(`[getProducts:${type}] Supabase error`, error)
      return []
    }

    // Map to Product type
    // NOTE: For 'featured' type, caller must filter expired boosts post-cache (boost_expires_at > now).
    // This keeps the cache deterministic (no new Date() in output)
    return (data || [])
      .map(mapRowToProduct)
      .filter((p: Product) => (type === "deals" || type === "promo" ? (p.list_price ?? 0) > p.price : true))
  } catch (error) {
    logger.error(`[getProducts:${type}] Unexpected error`, error)
    return []
  }
}

// =============================================================================
// Legacy Exports - For backward compatibility (remove after migration)
// =============================================================================

export const getNewestProducts = (limit = 36, zone?: ShippingRegion) => getProducts("newest", limit, zone)

// =============================================================================
// Homepage Curated Sections - Fetchers for category rows
// =============================================================================

/**
 * Get products for a specific root category (L0).
 * Used for category-specific homepage sections like "Trending in Fashion".
 */
export async function getCategoryRowProducts(
  categorySlug: string,
  limit = 10,
  zone?: ShippingRegion,
): Promise<Product[]> {
  "use cache"
  cacheLife("products")
  cacheTag(`products:category:${categorySlug}`)

  return getProductsByCategorySlug(categorySlug, limit, zone)
}

/**
 * Get products eligible for the "Promoted" section.
 *
 * NOTE: This function must stay safe for static prerendering (no `new Date()` in RSC).
 * Expired boosts are filtered client-side where "current time" is allowed.
 */
export async function getBoostedProducts(limit = 36, zone?: ShippingRegion): Promise<Product[]> {
  "use cache"
  cacheLife("products")
  cacheTag("products:type:featured")

  const products = await getProducts("featured", limit * 2, zone)
  return products.filter((p) => Boolean(p.is_boosted) && Boolean(p.boost_expires_at)).slice(0, limit)
}
