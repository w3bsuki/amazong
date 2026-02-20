import { createStaticClient } from "@/lib/supabase/server"
import { ITEMS_PER_PAGE } from "../../../_lib/pagination"
import { applySharedProductFilters, applySharedProductSort } from "@/lib/data/search-products"
import { logEvent } from "@/lib/logger"

export interface Product {
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
  sellers?: {
    store_slug: string | null
    display_name: string | null
    business_name: string | null
    avatar_url: string | null
    tier: string | null
    account_type: string | null
    is_verified_business: boolean | null
    id?: string | null
  } | null
  attributes?: Record<string, string> | null
  tags?: string[]
}

export interface CategoryProductFilters {
  minPrice?: string | undefined
  maxPrice?: string | undefined
  tag?: string | undefined
  minRating?: string | undefined
  availability?: string | undefined
  sort?: string | undefined
  attributes?: Record<string, string | string[]> | undefined
}

export async function searchProducts(
  supabase: ReturnType<typeof createStaticClient>,
  categoryId: string,
  filters: CategoryProductFilters,
  page: number = 1,
  limit: number = ITEMS_PER_PAGE,
  shippingFilter: string = ""
): Promise<{ products: Product[]; total: number }> {
  const debug = process.env.NODE_ENV !== "production" && process.env.DEBUG_CATEGORY_SEARCH === "1"
  const t0 = debug ? Date.now() : 0
  const offset = (page - 1) * limit

  // Avoid `select('*')` which can be very expensive on wide tables.
  // For counts, selecting a single column is sufficient.
  // NOTE: exact counts can be very expensive (esp. with shipping OR filters).
  // We use a planned count for much faster response time.
  let countQuery = supabase.from("products").select("id", { count: "planned", head: true })

  // Select only fields needed by the category page cards.
  // IMPORTANT: keep this as a literal string so Supabase types can infer the row shape.
  let dbQuery = supabase.from("products").select(
    "id,title,price,list_price,images,rating,review_count,category_id,slug,tags,attributes,created_at,profiles:profiles!products_seller_id_fkey(id,username,display_name,business_name,avatar_url,tier,account_type,is_verified_business)"
  )

  if (categoryId) {
    countQuery = countQuery.filter("category_ancestors", "cs", `{${categoryId}}`)
    dbQuery = dbQuery.filter("category_ancestors", "cs", `{${categoryId}}`)
  }

  if (shippingFilter) {
    countQuery = countQuery.or(shippingFilter)
    dbQuery = dbQuery.or(shippingFilter)
  }

  countQuery = applySharedProductFilters(countQuery, filters)
  dbQuery = applySharedProductFilters(dbQuery, filters)
  dbQuery = applySharedProductSort(dbQuery, filters.sort)

  dbQuery = dbQuery.range(offset, offset + limit - 1)

  const tParallel0 = debug ? Date.now() : 0
  const [{ count: totalCount }, { data }] = await Promise.all([countQuery, dbQuery])
  if (debug) {
    logEvent("info", "category_search_products_debug", {
      route: "category/[slug]",
      parallelMs: Date.now() - tParallel0,
      rows: (data || []).length,
      total: totalCount ?? 0,
      overallMs: Date.now() - t0,
    })
  }

  type DbSellerProfile = {
    id: string | null
    username: string | null
    display_name: string | null
    business_name: string | null
    avatar_url: string | null
    tier: string | null
    account_type: string | null
    is_verified_business: boolean | null
  }

  type DbProductRow = {
    id: string
    title: string
    price: number
    list_price: number | null
    images: string[] | null
    rating: number | null
    review_count: number | null
    category_id: string | null
    slug: string | null
    tags: string[] | null
    attributes: unknown
    profiles: DbSellerProfile | DbSellerProfile[] | null
  }

  const rows = (data || []) as unknown as DbProductRow[]

  const products: Product[] = rows.map((p) => {
    const profile = p.profiles && !Array.isArray(p.profiles) ? p.profiles : null
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
      sellers: profile
        ? {
            id: profile.id ?? null,
            store_slug: profile.username ?? null,
            display_name: profile.display_name ?? null,
            business_name: profile.business_name ?? null,
            avatar_url: profile.avatar_url ?? null,
            tier: profile.tier ?? null,
            account_type: profile.account_type ?? null,
            is_verified_business: profile.is_verified_business ?? null,
          }
        : null,
      attributes: p.attributes as Record<string, string> | null,
      tags: Array.isArray(p.tags) ? p.tags.filter((t) => typeof t === "string") : [],
    }
  })

  return { products, total: totalCount || 0 }
}
