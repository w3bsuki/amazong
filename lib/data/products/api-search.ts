import "server-only"

import { normalizeImageUrls } from "@/lib/normalize-image-url"
import { applyPublicProductVisibilityFilter } from "@/lib/supabase/filters/visibility"
import { PRODUCT_API_QUICK_SEARCH_SELECT } from "@/lib/supabase/selects/products"
import type { Database } from "@/lib/supabase/database.types"
import type { SupabaseClient } from "@supabase/supabase-js"

type DbClient = SupabaseClient<Database>

export type QuickSearchProduct = {
  id: string
  title: string
  price: number
  images: string[]
  slug: string | null
  storeSlug: string | null
}

type QuickSearchRow = {
  id: string
  title: string
  price: number
  images: string[] | null
  slug: string | null
  seller:
    | { username: string | null }
    | Array<{ username: string | null }>
    | null
}

export async function fetchQuickSearchProducts(params: {
  supabase: DbClient
  query: string
  limit: number
}): Promise<{ ok: true; products: QuickSearchProduct[] } | { ok: false; error: unknown }> {
  const { supabase, query, limit } = params

  const safeLimit = Number.isFinite(limit) && limit > 0 ? Math.floor(limit) : 10
  const searchPattern = `%${query}%`

  const { data, error } = await applyPublicProductVisibilityFilter(
    supabase.from("products").select(PRODUCT_API_QUICK_SEARCH_SELECT)
  )
    .or(`title.ilike.${searchPattern},description.ilike.${searchPattern}`)
    .limit(safeLimit)
    .order("created_at", { ascending: false })

  if (error) {
    return { ok: false, error }
  }

  const rawRows: unknown[] = Array.isArray(data) ? data : []

  const products = rawRows
    .filter((row): row is QuickSearchRow => {
      if (!row || typeof row !== "object") return false
      const r = row as Record<string, unknown>
      return typeof r.id === "string" && typeof r.title === "string" && typeof r.price === "number"
    })
    .map((row) => {
      const images = normalizeImageUrls(Array.isArray(row.images) ? row.images : [])
      const sellerValue = row.seller
      const seller = Array.isArray(sellerValue) ? sellerValue[0] : sellerValue

      return {
        id: row.id,
        title: row.title,
        price: row.price,
        images,
        slug: row.slug ?? null,
        storeSlug: seller?.username ?? null,
      }
    })

  return { ok: true, products }
}
