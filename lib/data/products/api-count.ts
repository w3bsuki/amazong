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

  if (categoryId) {
    countQuery = countQuery.filter("category_ancestors", "cs", `{${categoryId}}`)
  }

  if (query && query.trim()) {
    const searchTerm = `%${query.trim()}%`
    countQuery = countQuery.or(`title.ilike.${searchTerm},description.ilike.${searchTerm}`)
  }

  if (shippingFilter) {
    countQuery = countQuery.or(shippingFilter)
  }

  if (filters.minPrice != null) countQuery = countQuery.gte("price", filters.minPrice)
  if (filters.maxPrice != null) countQuery = countQuery.lte("price", filters.maxPrice)
  if (filters.minRating != null) countQuery = countQuery.gte("rating", filters.minRating)
  if (filters.availability === "instock") countQuery = countQuery.gt("stock", 0)

  if (filters.deals) {
    countQuery = countQuery.or("and(is_on_sale.eq.true,sale_percent.gt.0),list_price.not.is.null")
  }

  if (verifiedOnly) {
    countQuery = countQuery.eq("profiles.is_verified_business", true)
  }

  const city = resolveNormalizedCity(filters.city ?? null)
  if (filters.nearby === true) {
    countQuery = countQuery.ilike("seller_city", city ?? "sofia")
  } else if (city) {
    countQuery = countQuery.ilike("seller_city", city)
  }

  if (filters.attributes) {
    for (const [rawAttrName, attrValue] of Object.entries(filters.attributes).slice(0, 25)) {
      if (!attrValue) continue

      const attrName = normalizeAttributeKey(rawAttrName) || rawAttrName

      if (Array.isArray(attrValue)) {
        const values = attrValue.filter(
          (value): value is string => typeof value === "string" && value.length > 0,
        )

        if (values.length === 1) {
          const [firstValue] = values
          if (firstValue !== undefined) {
            countQuery = countQuery.contains("attributes", { [attrName]: firstValue })
          }
        } else if (values.length > 1) {
          countQuery = countQuery.in(`attributes->>${attrName}`, values)
        }
      } else if (typeof attrValue === "string" && attrValue.length > 0) {
        countQuery = countQuery.contains("attributes", { [attrName]: attrValue })
      }
    }
  }

  if (signal) {
    countQuery = countQuery.abortSignal(signal)
  }

  const { count, error } = await countQuery

  if (error) {
    return { ok: false, error }
  }

  return { ok: true, count: count ?? 0 }
}
