import type { createStaticClient } from "@/lib/supabase/server"

/**
 * Shared product search types for search and category pages.
 */

export interface ProductSearchFilters {
  minPrice?: string
  maxPrice?: string
  tag?: string
  minRating?: string
  deals?: string
  verified?: string
  availability?: string
  sort?: string
  attributes?: Record<string, string | string[]>
}

export interface ProductSearchResult {
  id: string
  title: string
  price: number
  list_price: number | null
  images: string[]
  rating: number | null
  review_count: number | null
  category_id: string | null
  image_url?: string | null
  slug?: string | null
  tags?: string[]
  attributes?: Record<string, string> | null
  categories?: { slug: string } | null
  seller?: {
    id: string | null
    username: string | null
    display_name: string | null
    business_name: string | null
    avatar_url: string | null
    tier: string | null
    account_type: string | null
    is_verified_business: boolean | null
  } | null
}

export interface ProductSearchOptions {
  /** Supabase client instance */
  supabase: ReturnType<typeof createStaticClient>
  /** Category IDs to filter by (optional) */
  categoryIds?: string[] | null
  /** Search query string (optional) */
  query?: string
  /** Filter options */
  filters: ProductSearchFilters
  /** Page number (1-indexed) */
  page?: number
  /** Items per page */
  limit?: number
  /** Shipping filter expression (e.g., "ships_to_bulgaria.eq.true") */
  shippingFilter?: string
}

const DEFAULT_LIMIT = 24

/**
 * Unified product search function for search and category pages.
 * Consolidates duplicate logic from:
 * - app/[locale]/(main)/search/_lib/search-products.ts
 * - app/[locale]/(main)/categories/[slug]/_lib/search-products.ts
 */
export async function searchProducts(
  options: ProductSearchOptions
): Promise<{ products: ProductSearchResult[]; total: number }> {
  const {
    supabase,
    categoryIds,
    query,
    filters,
    page = 1,
    limit = DEFAULT_LIMIT,
    shippingFilter,
  } = options

  if (!supabase) {
    return { products: [], total: 0 }
  }

  const offset = (page - 1) * limit

  // Build count query
  let countQuery = supabase
    .from("products")
    .select("id, profiles!products_seller_id_fkey(is_verified_business,account_type)", { 
      count: "exact", 
      head: true 
    })

  // Build data query with all needed relations
  let dbQuery = supabase
    .from("products")
    .select(
      "*, profiles!products_seller_id_fkey(id,username,display_name,business_name,avatar_url,tier,account_type,is_verified_business), attributes, categories(slug)"
    )

  // Shipping filter
  if (shippingFilter) {
    countQuery = countQuery.or(shippingFilter)
    dbQuery = dbQuery.or(shippingFilter)
  }

  // Category filter
  if (categoryIds && categoryIds.length > 0) {
    countQuery = countQuery.in("category_id", categoryIds)
    dbQuery = dbQuery.in("category_id", categoryIds)
  }

  // Price range
  if (filters.minPrice) {
    countQuery = countQuery.gte("price", Number(filters.minPrice))
    dbQuery = dbQuery.gte("price", Number(filters.minPrice))
  }
  if (filters.maxPrice) {
    countQuery = countQuery.lte("price", Number(filters.maxPrice))
    dbQuery = dbQuery.lte("price", Number(filters.maxPrice))
  }

  // Tags
  if (filters.tag) {
    countQuery = countQuery.contains("tags", [filters.tag])
    dbQuery = dbQuery.contains("tags", [filters.tag])
  }

  // Rating
  if (filters.minRating) {
    countQuery = countQuery.gte("rating", Number(filters.minRating))
    dbQuery = dbQuery.gte("rating", Number(filters.minRating))
  }

  // Deals (has list_price)
  if (filters.deals === "true") {
    countQuery = countQuery.not("list_price", "is", null)
    dbQuery = dbQuery.not("list_price", "is", null)
  }

  // Verified sellers
  if (filters.verified === "true") {
    countQuery = countQuery.eq("profiles.is_verified_business", true)
    dbQuery = dbQuery.eq("profiles.is_verified_business", true)
  }

  // In stock
  if (filters.availability === "instock") {
    countQuery = countQuery.gt("stock", 0)
    dbQuery = dbQuery.gt("stock", 0)
  }

  // Dynamic attributes filter
  if (filters.attributes) {
    for (const [attrName, attrValue] of Object.entries(filters.attributes)) {
      if (!attrValue) continue

      if (Array.isArray(attrValue)) {
        const values = attrValue.filter((v): v is string => typeof v === "string" && v.length > 0)
        if (values.length === 1) {
          countQuery = countQuery.contains("attributes", { [attrName]: values[0] })
          dbQuery = dbQuery.contains("attributes", { [attrName]: values[0] })
        } else if (values.length > 1) {
          countQuery = countQuery.in(`attributes->>${attrName}`, values)
          dbQuery = dbQuery.in(`attributes->>${attrName}`, values)
        }
      } else if (typeof attrValue === "string" && attrValue.length > 0) {
        countQuery = countQuery.contains("attributes", { [attrName]: attrValue })
        dbQuery = dbQuery.contains("attributes", { [attrName]: attrValue })
      }
    }
  }

  // Text search (if provided)
  if (query) {
    countQuery = countQuery.or(`title.ilike.%${query}%,description.ilike.%${query}%`)
    dbQuery = dbQuery.or(`title.ilike.%${query}%,description.ilike.%${query}%`)
  }

  // Get count
  const { count: total } = await countQuery

  // Apply sorting
  switch (filters.sort) {
    case "newest":
      dbQuery = dbQuery.order("created_at", { ascending: false })
      break
    case "price-asc":
      dbQuery = dbQuery.order("price", { ascending: true })
      break
    case "price-desc":
      dbQuery = dbQuery.order("price", { ascending: false })
      break
    case "rating":
      dbQuery = dbQuery.order("rating", { ascending: false, nullsFirst: false })
      break
    default:
      dbQuery = dbQuery.order("rating", { ascending: false, nullsFirst: false })
  }

  // Apply pagination
  dbQuery = dbQuery.range(offset, offset + limit - 1)

  // Execute query
  const { data } = await dbQuery

  // Transform results
  const products: ProductSearchResult[] = (data || []).map((p) => {
    const profile = p.profiles && !Array.isArray(p.profiles) ? p.profiles : null
    const categories = p.categories && !Array.isArray(p.categories) ? p.categories : null

    return {
      id: p.id,
      title: p.title,
      price: p.price,
      list_price: p.list_price,
      images: p.images || [],
      rating: p.rating,
      review_count: p.review_count,
      category_id: p.category_id,
      image_url: p.images?.[0] || null,
      slug: p.slug,
      tags: Array.isArray(p.tags) ? p.tags.filter((t): t is string => typeof t === "string") : [],
      attributes: p.attributes as Record<string, string> | null,
      categories,
      seller: profile
        ? {
            id: profile.id ?? null,
            username: profile.username ?? null,
            display_name: profile.display_name ?? null,
            business_name: profile.business_name ?? null,
            avatar_url: profile.avatar_url ?? null,
            tier: profile.tier ?? null,
            account_type: profile.account_type ?? null,
            is_verified_business: profile.is_verified_business ?? null,
          }
        : null,
    }
  })

  return { products, total: total || 0 }
}
