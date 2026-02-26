import { NextRequest, NextResponse } from "next/server"
import { createStaticClient } from "@/lib/supabase/server"
import { fetchProductsNewestPage } from "@/lib/data/products/api-newest"
import {
  cachedJsonResponse,
  dbUnavailableResponse,
  noStoreJson,
  parsePaginationParams,
} from "@/lib/api/response-helpers"
import { normalizeAttributeKey } from "@/lib/attributes/normalize-attribute-key"
import { z } from "zod"

import { logger } from "@/lib/logger"
const SortParamSchema = z.enum(["newest", "price-asc", "price-desc", "rating"]).catch("newest").default("newest")
const TypeParamSchema = z.enum(["newest", "promoted"]).catch("newest").default("newest")

const ProductsNewestQuerySchema = z
  .object({
    category: z.string().trim().min(1).max(64).optional(),
    sort: SortParamSchema,
    type: TypeParamSchema,
    city: z.string().trim().min(1).max(80).optional(),
    nearby: z.string().optional().transform((value) => value === "true"),
    minPrice: z.coerce.number().nonnegative().optional(),
    maxPrice: z.coerce.number().nonnegative().optional(),
    minRating: z.coerce.number().min(0).max(5).optional(),
    availability: z.string().optional().transform((value) => (value === "instock" ? "instock" : undefined)),
    deals: z.string().optional().transform((value) => value === "true"),
  })
  .strict()

const AttributeFilterKeySchema = z.string().regex(/^attr_[a-z0-9_-]{1,64}$/i)
const AttributeFilterValueSchema = z.string().trim().min(1).max(80)
const RawAttributeFiltersSchema = z.record(
  AttributeFilterKeySchema,
  z.array(AttributeFilterValueSchema).max(20),
)

const MAX_ATTRIBUTE_FILTER_KEYS = 25

type ParsedProductsNewestQuery = z.infer<typeof ProductsNewestQuerySchema>

type ParseResult<T> =
  | { ok: true; data: T }
  | { ok: false; response: NextResponse }

function parseProductsNewestQuery(searchParams: URLSearchParams): ParseResult<ParsedProductsNewestQuery> {
  const parsedQuery = ProductsNewestQuerySchema.safeParse({
    category: searchParams.get("category") ?? undefined,
    sort: searchParams.get("sort") ?? undefined,
    type: searchParams.get("type") ?? undefined,
    city: searchParams.get("city") ?? undefined,
    nearby: searchParams.get("nearby") ?? undefined,
    minPrice: searchParams.get("minPrice") ?? undefined,
    maxPrice: searchParams.get("maxPrice") ?? undefined,
    minRating: searchParams.get("minRating") ?? undefined,
    availability: searchParams.get("availability") ?? undefined,
    deals: searchParams.get("deals") ?? undefined,
  })

  if (!parsedQuery.success) {
    return {
      ok: false,
      response: noStoreJson({ products: [], hasMore: false, error: "Invalid query" }, { status: 400 }),
    }
  }

  return { ok: true, data: parsedQuery.data }
}

function parseAttributeFilters(searchParams: URLSearchParams): ParseResult<Record<string, string[]>> {
  // Extract attr_* params for attribute filtering.
  // Keys are stable, canonical attribute keys (e.g. attr_brand=Apple).
  const rawAttributeFilters: Record<string, string[]> = {}
  let attributeKeysCount = 0

  for (const key of searchParams.keys()) {
    if (!key.startsWith("attr_")) continue
    rawAttributeFilters[key] = searchParams.getAll(key)
    attributeKeysCount += 1

    if (attributeKeysCount > MAX_ATTRIBUTE_FILTER_KEYS) {
      return {
        ok: false,
        response: noStoreJson(
          { products: [], hasMore: false, error: "Too many attribute filters" },
          { status: 400 },
        ),
      }
    }
  }

  const parsedAttributeFilters = RawAttributeFiltersSchema.safeParse(rawAttributeFilters)
  if (!parsedAttributeFilters.success) {
    return {
      ok: false,
      response: noStoreJson(
        { products: [], hasMore: false, error: "Invalid attribute filters" },
        { status: 400 },
      ),
    }
  }

  const attributeFilters: Record<string, string[]> = {}
  for (const [key, values] of Object.entries(parsedAttributeFilters.data)) {
    const rawName = key.slice("attr_".length)
    const name = normalizeAttributeKey(rawName)
    if (!name || !/^[a-z0-9_]{1,64}$/i.test(name)) continue

    attributeFilters[name] = attributeFilters[name]
      ? [...new Set([...(attributeFilters[name] || []), ...values])]
      : values
  }

  return { ok: true, data: attributeFilters }
}

/**
 * GET /api/products/newest
 * 
 * Fetch newest products with hierarchical category filtering.
 * When filtering by category, returns ALL products in that category
 * AND all its descendants (L0 -> L1 -> L2 -> L3 -> L4).
 * 
 * Uses the optimized `category_ancestors` GIN index for O(1) lookups.
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const { page, limit: safeLimit, offset } = parsePaginationParams(searchParams)

  const parsedQuery = parseProductsNewestQuery(searchParams)
  if (!parsedQuery.ok) return parsedQuery.response

  const category = parsedQuery.data.category ?? null
  const sort = parsedQuery.data.sort
  const type = parsedQuery.data.type
  const city = parsedQuery.data.city ?? null
  const nearby = parsedQuery.data.nearby

  const minPrice = parsedQuery.data.minPrice
  const maxPrice = parsedQuery.data.maxPrice
  const minRating = parsedQuery.data.minRating
  const availability = parsedQuery.data.availability
  const deals = parsedQuery.data.deals

  const parsedAttributeFilters = parseAttributeFilters(searchParams)
  if (!parsedAttributeFilters.ok) return parsedAttributeFilters.response
  const attributeFilters = parsedAttributeFilters.data
  
  try {
    const supabase = createStaticClient()
    if (!supabase) {
      return dbUnavailableResponse({ products: [], hasMore: false })
    }

    const newestResult = await fetchProductsNewestPage({
      supabase,
      page,
      offset,
      limit: safeLimit,
      categorySlug: category,
      sort,
      type,
      city,
      nearby,
      ...(minPrice != null ? { minPrice } : {}),
      ...(maxPrice != null ? { maxPrice } : {}),
      ...(minRating != null ? { minRating } : {}),
      ...(availability ? { availability } : {}),
      deals: Boolean(deals),
      attributeFilters,
    })

    if (!newestResult.ok) {
      logger.error("[API] Newest products error:", newestResult.error)
      return noStoreJson({ products: [], hasMore: false, error: "Query failed" }, { status: 500 })
    }

    return cachedJsonResponse({
      products: newestResult.products,
      hasMore: newestResult.hasMore,
      totalCount: newestResult.totalCount,
      page,
    })
  } catch (error) {
    logger.error("[API] Newest products exception:", error)
    return noStoreJson({ 
      products: [], 
      hasMore: false,
      error: "Internal server error" 
    }, { status: 500 })
  }
}
