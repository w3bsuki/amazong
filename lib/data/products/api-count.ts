import "server-only"

import { normalizeAttributeKey } from "@/lib/attributes/normalize-attribute-key"
import { applyPublicProductVisibilityFilter } from "@/lib/supabase/filters/visibility"
import type { Database } from "@/lib/supabase/database.types"
import type { SupabaseClient } from "@supabase/supabase-js"

type DbClient = SupabaseClient<Database>

type ProductsCountFilters = {
  minPrice?: number | null | undefined
  maxPrice?: number | null | undefined
  minRating?: number | null | undefined
  availability?: "instock" | null | undefined
  deals?: boolean | null | undefined
  verified?: boolean | null | undefined
  city?: string | null | undefined
  nearby?: boolean | null | undefined
  attributes?: Record<string, string | string[]> | undefined
}

function resolveNormalizedCity(city: string | null | undefined): string | null {
  const normalizedCity = city?.trim().toLowerCase()
  if (!normalizedCity || normalizedCity === "undefined" || normalizedCity === "null") {
    return null
  }
  return normalizedCity
}

export async function fetchProductsCount(params: {
  supabase: DbClient
  categoryId?: string | null
  query?: string | null
  shippingFilter?: string | null
  filters?: ProductsCountFilters
  signal?: AbortSignal
}): Promise<{ ok: true; count: number } | { ok: false; error: unknown }> {
  const { supabase, categoryId, query, shippingFilter, filters = {}, signal } = params

  const verifiedOnly = filters.verified === true

  const select = verifiedOnly
    ? "id, profiles!products_seller_id_fkey(is_verified_business)"
    : "id"

  let countQuery = supabase
    .from("products")
    .select(select, { count: "planned", head: true })

  countQuery = applyPublicProductVisibilityFilter(countQuery)

  type CountQuery = typeof countQuery

  const applyCategoryFilter = (builder: CountQuery, nextCategoryId: string | null | undefined): CountQuery => {
    if (!nextCategoryId) return builder
    return builder.filter("category_ancestors", "cs", `{${nextCategoryId}}`)
  }

  const applySearchFilter = (builder: CountQuery, searchQuery: string | null | undefined): CountQuery => {
    const trimmed = searchQuery?.trim()
    if (!trimmed) return builder
    const searchTerm = `%${trimmed}%`
    return builder.or(`title.ilike.${searchTerm},description.ilike.${searchTerm}`)
  }

  const applyShippingFilter = (builder: CountQuery, nextShippingFilter: string | null | undefined): CountQuery => {
    if (!nextShippingFilter) return builder
    return builder.or(nextShippingFilter)
  }

  const applyNumericFilters = (builder: CountQuery, nextFilters: ProductsCountFilters): CountQuery => {
    let nextBuilder = builder

    if (nextFilters.minPrice != null) nextBuilder = nextBuilder.gte("price", nextFilters.minPrice)
    if (nextFilters.maxPrice != null) nextBuilder = nextBuilder.lte("price", nextFilters.maxPrice)
    if (nextFilters.minRating != null) nextBuilder = nextBuilder.gte("rating", nextFilters.minRating)
    if (nextFilters.availability === "instock") nextBuilder = nextBuilder.gt("stock", 0)

    return nextBuilder
  }

  const applyDealsFilter = (builder: CountQuery, deals: boolean | null | undefined): CountQuery => {
    if (!deals) return builder
    return builder.or("and(is_on_sale.eq.true,sale_percent.gt.0),list_price.not.is.null")
  }

  const applyVerifiedFilter = (builder: CountQuery, nextVerifiedOnly: boolean): CountQuery => {
    if (!nextVerifiedOnly) return builder
    return builder.eq("profiles.is_verified_business", true)
  }

  const applyCityFilter = (builder: CountQuery, nextFilters: ProductsCountFilters): CountQuery => {
    const city = resolveNormalizedCity(nextFilters.city ?? null)

    if (nextFilters.nearby === true) {
      return builder.ilike("seller_city", city ?? "sofia")
    }

    if (city) {
      return builder.ilike("seller_city", city)
    }

    return builder
  }

  const applyAttributeFilters = (
    builder: CountQuery,
    attributes: ProductsCountFilters["attributes"]
  ): CountQuery => {
    if (!attributes) return builder

    let nextBuilder = builder

    for (const [rawAttrName, attrValue] of Object.entries(attributes).slice(0, 25)) {
      if (!attrValue) continue

      const attrName = normalizeAttributeKey(rawAttrName) || rawAttrName

      if (Array.isArray(attrValue)) {
        const values = attrValue.filter((value): value is string => typeof value === "string" && value.length > 0)

        if (values.length === 1) {
          const firstValue = values[0]
          if (firstValue !== undefined) {
            nextBuilder = nextBuilder.contains("attributes", { [attrName]: firstValue })
          }
        } else if (values.length > 1) {
          nextBuilder = nextBuilder.in(`attributes->>${attrName}`, values)
        }
      } else if (typeof attrValue === "string" && attrValue.length > 0) {
        nextBuilder = nextBuilder.contains("attributes", { [attrName]: attrValue })
      }
    }

    return nextBuilder
  }

  countQuery = applyCategoryFilter(countQuery, categoryId)
  countQuery = applySearchFilter(countQuery, query)
  countQuery = applyShippingFilter(countQuery, shippingFilter)
  countQuery = applyNumericFilters(countQuery, filters)
  countQuery = applyDealsFilter(countQuery, filters.deals)
  countQuery = applyVerifiedFilter(countQuery, verifiedOnly)
  countQuery = applyCityFilter(countQuery, filters)
  countQuery = applyAttributeFilters(countQuery, filters.attributes)

  if (signal) {
    countQuery = countQuery.abortSignal(signal)
  }

  const { count, error } = await countQuery

  if (error) {
    return { ok: false, error }
  }

  return { ok: true, count: count ?? 0 }
}
