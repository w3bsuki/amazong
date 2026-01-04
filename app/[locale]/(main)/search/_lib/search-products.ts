import { createStaticClient } from "@/lib/supabase/server"
import { ITEMS_PER_PAGE } from "../../_lib/pagination"
import type { Product, SearchProductFilters } from "./types"

export async function searchProducts(
  supabase: ReturnType<typeof createStaticClient>,
  query: string,
  categoryIds: string[] | null,
  filters: SearchProductFilters,
  page: number = 1,
  limit: number = ITEMS_PER_PAGE,
  shippingFilter?: string
): Promise<{ products: Product[]; total: number }> {
  const offset = (page - 1) * limit

  // Include the seller join so we can filter by seller fields (e.g., verified business)
  let countQuery = supabase
    .from("products")
    .select("id, profiles!products_seller_id_fkey(is_verified_business,account_type)", { count: "exact", head: true })
  let dbQuery = supabase
    .from("products")
    .select(
      "id,title,price,list_price,images,rating,review_count,category_id,slug,tags,attributes,profiles:profiles!products_seller_id_fkey(id,username,display_name,business_name,avatar_url,tier,account_type,is_verified_business),categories:categories!products_category_id_fkey(slug)"
    )

  if (shippingFilter) {
    countQuery = countQuery.or(shippingFilter)
    dbQuery = dbQuery.or(shippingFilter)
  }

  if (categoryIds && categoryIds.length > 0) {
    countQuery = countQuery.in("category_id", categoryIds)
    dbQuery = dbQuery.in("category_id", categoryIds)
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

  // "Discounts" / "Deals": best-effort (list_price present)
  if (filters.deals === "true") {
    countQuery = countQuery.not("list_price", "is", null)
    dbQuery = dbQuery.not("list_price", "is", null)
  }

  // Verified sellers (business verification)
  if (filters.verified === "true") {
    countQuery = countQuery.eq("profiles.is_verified_business", true)
    dbQuery = dbQuery.eq("profiles.is_verified_business", true)
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

  if (query) {
    countQuery = countQuery.or(`title.ilike.%${query}%,description.ilike.%${query}%`)
    dbQuery = dbQuery.or(`title.ilike.%${query}%,description.ilike.%${query}%`)
  }

  const { count: total } = await countQuery

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

  const { data } = await dbQuery

  const products: Product[] = (data || []).map((p) => ({
    id: p.id,
    title: p.title,
    price: p.price,
    list_price: p.list_price,
    images: p.images || [],
    rating: p.rating,
    review_count: p.review_count,
    category_id: p.category_id,
    image_url: p.images?.[0] || null,
    tags: Array.isArray(p.tags) ? p.tags.filter((t): t is string => typeof t === "string") : [],
    slug: p.slug,
    profiles: p.profiles && !Array.isArray(p.profiles)
      ? {
          id: p.profiles.id ?? null,
          username: p.profiles.username ?? null,
          display_name: p.profiles.display_name ?? null,
          business_name: p.profiles.business_name ?? null,
          avatar_url: p.profiles.avatar_url ?? null,
          tier: p.profiles.tier ?? null,
          account_type: p.profiles.account_type ?? null,
          is_verified_business: p.profiles.is_verified_business ?? null,
        }
      : null,
    categories: p.categories && !Array.isArray(p.categories) ? p.categories : null,
    attributes: p.attributes as Record<string, string> | null,
  }))

  return { products, total: total || 0 }
}
