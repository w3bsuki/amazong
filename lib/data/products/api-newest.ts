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

  let categoryId: string | null = null
  if (categorySlug) {
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
      return { ok: true, products: [], totalCount: 0, hasMore: false }
    }

    categoryId = categoryData.id
  }

  let query = supabase.from("products").select(PRODUCT_API_NEWEST_SELECT, { count: "exact" })

  if (categoryId) {
    query = query.filter("category_ancestors", "cs", `{${categoryId}}`)
  }

  query = applyPublicProductVisibilityFilter(query)

  if (type === "promoted") {
    query = query.eq("is_boosted", true)
    query = query.gt("boost_expires_at", nowIso)
  }

  if (minPrice != null) query = query.gte("price", minPrice)
  if (maxPrice != null) query = query.lte("price", maxPrice)
  if (minRating != null) query = query.gte("rating", minRating)
  if (availability === "instock") query = query.gt("stock", 0)
  if (deals) {
    query = query.or("and(is_on_sale.eq.true,sale_percent.gt.0),list_price.not.is.null")
  }

  const normalizedCity = city?.trim().toLowerCase()
  const effectiveCity =
    nearby && (!normalizedCity || normalizedCity === "undefined" || normalizedCity === "null")
      ? "sofia"
      : normalizedCity

  if (effectiveCity) {
    query = query.ilike("seller_city", effectiveCity)
  }

  for (const [attrName, values] of Object.entries(attributeFilters)) {
    if (values.length === 1) {
      const [firstValue] = values
      if (firstValue) {
        query = query.contains("attributes", { [attrName]: firstValue })
      }
    } else if (values.length > 1) {
      query = query.in(`attributes->>${attrName}`, values)
    }
  }

  switch (sort) {
    case "price-asc":
      query = query.order("price", { ascending: true })
      break
    case "price-desc":
      query = query.order("price", { ascending: false })
      break
    case "rating":
      query = query.order("rating", { ascending: false, nullsFirst: false })
      query = query.order("review_count", { ascending: false })
      break
    case "newest":
    default:
      query = query.order("created_at", { ascending: false })
  }

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
