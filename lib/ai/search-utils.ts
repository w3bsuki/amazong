/**
 * Shared AI search utilities - consolidated from app/api/ai/chat and app/api/ai/search
 * to eliminate duplicate code (~150 duplicated lines reduced to single source)
 */

import { z } from "zod"
import { createStaticClient } from "@/lib/supabase/server"
import { getProductUrl } from "@/lib/url-utils"
import type { PostgrestError } from "@supabase/supabase-js"

// ============================================================================
// Types
// ============================================================================

/** Raw product data from DB query */
export interface ProductQueryRow {
  id: string
  title: string | null
  price: number
  images: string[] | null
  slug: string | null
  seller: { username: string | null } | null
}

/** UI-optimized product for AI responses */
export type UiProduct = {
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

// ============================================================================
// Shared Schema Primitives
// ============================================================================

/**
 * Zod preprocessor for numeric values that might come as strings from some AI providers.
 * Handles undefined, null, numbers, and string representations.
 */
export const nonNegativeNumberFromString = z.preprocess(
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
  z.number().nonnegative().optional()
)

/** Search products input schema - shared between chat and search routes */
export const searchProductsInput = z.object({
  query: z
    .string()
    .describe("Search keywords for products, e.g. 'laptop' or 'winter jacket'")
    .optional(),
  categorySlug: z
    .string()
    .describe("Category slug to filter by, e.g. 'electronics', 'fashion'")
    .optional(),
  minPrice: nonNegativeNumberFromString.describe("Minimum price filter"),
  maxPrice: nonNegativeNumberFromString.describe("Maximum price filter"),
  limit: z.coerce.number().int().min(1).max(20).default(8).describe("Number of results to return"),
})

export type SearchProductsInput = z.infer<typeof searchProductsInput>

/** List products input schema */
export const listProductsInput = z.object({
  limit: z.coerce.number().int().min(1).max(20).default(8).describe("Number of results to return"),
})

// ============================================================================
// TOP-LEVEL CATEGORIES (embedded to avoid token-burning DB fetch)
// ============================================================================

export const TOP_CATEGORIES = [
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

// ============================================================================
// Shared Functions
// ============================================================================

/**
 * Transform raw product rows to UI-optimized format.
 * Centralizes the mapping logic used across AI routes.
 */
export function mapProductsToUi(data: ProductQueryRow[] | null): UiProduct[] {
  return (data ?? []).map((p) => {
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
}

/**
 * TOKEN-OPTIMIZED product search: minimal fields, capped output.
 * Used by both AI chat and AI search routes.
 */
export async function searchProducts(input: SearchProductsInput): Promise<{ products: UiProduct[] }> {
  const { query, categorySlug, minPrice, maxPrice, limit } = input
  const effectiveLimit = Math.min(limit, 6) // hard cap to reduce tokens
  const supabase = createStaticClient()

  // Resolve category slug to ID if provided
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
  let data: ProductQueryRow[] | null = null
  let error: PostgrestError | null = null

  if (trimmedQuery) {
    // Try full-text search first
    const ftsResult = await buildBaseQuery().textSearch("search_vector", trimmedQuery, { type: "websearch" })
    data = ftsResult.data
    error = ftsResult.error

    // Fallback to ILIKE if FTS fails or returns empty
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
    return { products: [] }
  }

  return { products: mapProductsToUi(data) }
}

/**
 * Get newest listings - minimal query for AI responses.
 */
export async function getNewestListings(input: z.infer<typeof listProductsInput>): Promise<{ products: UiProduct[] }> {
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

  return { products: mapProductsToUi(data) }
}

/**
 * Get promoted listings - minimal query for AI responses.
 */
export async function getPromotedListings(input: z.infer<typeof listProductsInput>): Promise<{ products: UiProduct[] }> {
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

  return { products: mapProductsToUi(data) }
}
