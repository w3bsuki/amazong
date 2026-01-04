import { createStaticClient } from "@/lib/supabase/server"
import { ITEMS_PER_PAGE } from "../../../_lib/pagination"
import type { CategoryProductFilters, Product } from "./types"

export async function searchProducts(
  supabase: ReturnType<typeof createStaticClient>,
  categoryIds: string[],
  filters: CategoryProductFilters,
  page: number = 1,
  limit: number = ITEMS_PER_PAGE,
  shippingFilter: string = ""
): Promise<{ products: Product[]; total: number }> {
  const debug = process.env.DEBUG_CATEGORY_SEARCH === "1"
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

  if (categoryIds.length > 0) {
    countQuery = countQuery.in("category_id", categoryIds)
    dbQuery = dbQuery.in("category_id", categoryIds)
  }

  if (shippingFilter) {
    countQuery = countQuery.or(shippingFilter)
    dbQuery = dbQuery.or(shippingFilter)
  }

  if (filters.minPrice) {
    countQuery = countQuery.gte("price", Number(filters.minPrice))
    dbQuery = dbQuery.gte("price", Number(filters.minPrice))
  }
  if (filters.maxPrice) {
    countQuery = countQuery.lte("price", Number(filters.maxPrice))
    dbQuery = dbQuery.lte("price", Number(filters.maxPrice))
  }
  if (filters.tag) {
    countQuery = countQuery.contains("tags", [filters.tag])
    dbQuery = dbQuery.contains("tags", [filters.tag])
  }
  if (filters.minRating) {
    countQuery = countQuery.gte("rating", Number(filters.minRating))
    dbQuery = dbQuery.gte("rating", Number(filters.minRating))
  }
  if (filters.availability === "instock") {
    countQuery = countQuery.gt("stock", 0)
    dbQuery = dbQuery.gt("stock", 0)
  }

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

  dbQuery = dbQuery.range(offset, offset + limit - 1)

  const tParallel0 = debug ? Date.now() : 0
  const [{ count: totalCount }, { data }] = await Promise.all([countQuery, dbQuery])
  if (debug) {
    console.log(
      `[category:searchProducts] count+rows in ${Date.now() - tParallel0}ms ` +
        `(rows=${(data || []).length}, total=${totalCount ?? 0}, overall ${Date.now() - t0}ms)`
    )
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
