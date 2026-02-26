import "server-only"

import { toUI } from "@/lib/data/products"
import { applyPublicProductVisibilityFilter } from "@/lib/supabase/filters/visibility"
import { PRODUCT_API_NEWEST_SELECT } from "@/lib/supabase/selects/products"
import type { Database } from "@/lib/supabase/database.types"
import type { SupabaseClient } from "@supabase/supabase-js"
import { buildUiProductPage } from "./api-shared"

type DbClient = SupabaseClient<Database>

export type ProductsNewestSort = "newest" | "price-asc" | "price-desc" | "rating"
export type ProductsNewestType = "newest" | "promoted"
export type ProductsNewestAvailability = "instock" | undefined

type CategoryIdResolution =
  | { ok: true; categoryId: string | null; notFound: boolean }
  | { ok: false; error: unknown }

async function resolveCategoryId(supabase: DbClient, categorySlug: string): Promise<CategoryIdResolution> {
  const { data: categoryData, error: categoryError } = await supabase
    .from("categories")
    .select("id")
    .eq("slug", categorySlug)
    .limit(1)
    .maybeSingle()

  if (categoryError) {
    return { ok: false, error: categoryError }
  }

  if (!categoryData) {
    return { ok: true, categoryId: null, notFound: true }
  }

  return { ok: true, categoryId: categoryData.id, notFound: false }
}

function resolveEffectiveCity(city: string | null | undefined, nearby: boolean): string | null {
  const normalized = city?.trim().toLowerCase()
  const cleaned = !normalized || normalized === "undefined" || normalized === "null" ? null : normalized

  if (nearby && !cleaned) {
    return "sofia"
  }

  return cleaned
}

export async function fetchProductsNewestPage(params: {
  supabase: DbClient
  page: number
  offset: number
  limit: number
  categorySlug?: string | null
  sort: ProductsNewestSort
  type: ProductsNewestType
  city?: string | null
  nearby: boolean
  minPrice?: number
  maxPrice?: number
  minRating?: number
  availability?: ProductsNewestAvailability
  deals: boolean
  attributeFilters: Record<string, string[]>
}): Promise<
  | { ok: true; products: ReturnType<typeof toUI>[]; totalCount: number; hasMore: boolean }
  | { ok: false; error: unknown }
> {
  const {
    supabase,
    page,
    offset,
    limit,
    categorySlug,
    sort,
    type,
    city,
    nearby,
    minPrice,
    maxPrice,
    minRating,
    availability,
    deals,
    attributeFilters,
  } = params

  const safePage = Number.isFinite(page) && page > 0 ? Math.floor(page) : 1
  const safeLimit = Number.isFinite(limit) && limit > 0 ? Math.floor(limit) : 24
  const safeOffset = Number.isFinite(offset) && offset >= 0 ? Math.floor(offset) : 0
  const nowIso = new Date().toISOString()

  const categoryResult = categorySlug
    ? await resolveCategoryId(supabase, categorySlug)
    : ({ ok: true, categoryId: null, notFound: false } satisfies CategoryIdResolution)

  if (!categoryResult.ok) {
    return { ok: false, error: categoryResult.error }
  }

  if (categoryResult.notFound) {
    return { ok: true, products: [], totalCount: 0, hasMore: false }
  }

  let query = supabase.from("products").select(PRODUCT_API_NEWEST_SELECT, { count: "exact" })

  type ProductsQuery = typeof query

  const applyCategoryFilter = (builder: ProductsQuery, categoryId: string | null): ProductsQuery => {
    if (!categoryId) return builder
    return builder.filter("category_ancestors", "cs", `{${categoryId}}`)
  }

  const applyPromotedFilter = (builder: ProductsQuery, type: ProductsNewestType, nowIso: string): ProductsQuery => {
    if (type !== "promoted") return builder
    let nextBuilder = builder
    nextBuilder = nextBuilder.eq("is_boosted", true)
    nextBuilder = nextBuilder.gt("boost_expires_at", nowIso)
    return nextBuilder
  }

  const applyNumericFilters = (
    builder: ProductsQuery,
    nextParams: {
      minPrice: number | undefined
      maxPrice: number | undefined
      minRating: number | undefined
      availability: ProductsNewestAvailability | undefined
    }
  ): ProductsQuery => {
    const { minPrice, maxPrice, minRating, availability } = nextParams
    let nextBuilder = builder

    if (minPrice != null) nextBuilder = nextBuilder.gte("price", minPrice)
    if (maxPrice != null) nextBuilder = nextBuilder.lte("price", maxPrice)
    if (minRating != null) nextBuilder = nextBuilder.gte("rating", minRating)
    if (availability === "instock") nextBuilder = nextBuilder.gt("stock", 0)

    return nextBuilder
  }

  const applyDealsFilter = (builder: ProductsQuery, deals: boolean): ProductsQuery => {
    if (!deals) return builder
    return builder.or("and(is_on_sale.eq.true,sale_percent.gt.0),list_price.not.is.null")
  }

  const applyCityFilter = (builder: ProductsQuery, city: string | null): ProductsQuery => {
    if (!city) return builder
    return builder.ilike("seller_city", city)
  }

  const applyAttributeFilters = (builder: ProductsQuery, attributeFilters: Record<string, string[]>): ProductsQuery => {
    let nextBuilder = builder

    for (const [attrName, values] of Object.entries(attributeFilters)) {
      if (values.length === 1) {
        const firstValue = values[0]
        if (firstValue) {
          nextBuilder = nextBuilder.contains("attributes", { [attrName]: firstValue })
        }
      } else if (values.length > 1) {
        nextBuilder = nextBuilder.in(`attributes->>${attrName}`, values)
      }
    }

    return nextBuilder
  }

  const applySort = (builder: ProductsQuery, sort: ProductsNewestSort): ProductsQuery => {
    switch (sort) {
      case "price-asc":
        return builder.order("price", { ascending: true })
      case "price-desc":
        return builder.order("price", { ascending: false })
      case "rating":
        return builder
          .order("rating", { ascending: false, nullsFirst: false })
          .order("review_count", { ascending: false })
      case "newest":
      default:
        return builder.order("created_at", { ascending: false })
    }
  }

  query = applyCategoryFilter(query, categoryResult.categoryId)

  query = applyPublicProductVisibilityFilter(query)

  query = applyPromotedFilter(query, type, nowIso)

  query = applyNumericFilters(query, { minPrice, maxPrice, minRating, availability })
  query = applyDealsFilter(query, deals)
  query = applyCityFilter(query, resolveEffectiveCity(city, nearby))
  query = applyAttributeFilters(query, attributeFilters)
  query = applySort(query, sort)

  const { data, error, count } = await query.range(safeOffset, safeOffset + safeLimit - 1)

  if (error) {
    if (safePage > 1) {
      return { ok: true, products: [], totalCount: count ?? 0, hasMore: false }
    }
    return { ok: false, error }
  }

  const { products, totalCount, hasMore } = buildUiProductPage({
    data,
    count,
    offset: safeOffset,
  })

  return { ok: true, products, totalCount, hasMore }
}
