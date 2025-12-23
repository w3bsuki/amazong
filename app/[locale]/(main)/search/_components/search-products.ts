import { createStaticClient } from "@/lib/supabase/server"
import { ITEMS_PER_PAGE } from "../../_lib/pagination"
import type { Product, SearchProductFilters } from "./types"

// Helper function to search products with ILIKE fallback and pagination
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

  // Build base query with count
  let countQuery = supabase.from("products").select("*", { count: "exact", head: true })
  let dbQuery = supabase
    .from("products")
    .select(
      "*, profiles!products_seller_id_fkey(id,username,display_name,business_name,avatar_url,tier,account_type,is_verified_business), attributes, categories(slug)"
    )

  // Apply shipping zone filter if provided
  if (shippingFilter) {
    countQuery = countQuery.or(shippingFilter)
    dbQuery = dbQuery.or(shippingFilter)
  }

  // Apply category filter if provided
  if (categoryIds && categoryIds.length > 0) {
    countQuery = countQuery.in("category_id", categoryIds)
    dbQuery = dbQuery.in("category_id", categoryIds)
  }

  // Apply other filters
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
  if (filters.prime === "true") {
    countQuery = countQuery.eq("is_prime", true)
    dbQuery = dbQuery.eq("is_prime", true)
  }
  if (filters.availability === "instock") {
    countQuery = countQuery.gt("stock", 0)
    dbQuery = dbQuery.gt("stock", 0)
  }

  // Apply attribute filters (uses idx_products_attr_* indexes)
  if (filters.attributes) {
    for (const [attrName, attrValue] of Object.entries(filters.attributes)) {
      if (attrValue) {
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
  }

  // Apply text search if query exists
  if (query) {
    countQuery = countQuery.or(`title.ilike.%${query}%,description.ilike.%${query}%`)
    dbQuery = dbQuery.or(`title.ilike.%${query}%,description.ilike.%${query}%`)
  }

  // Get total count
  const { count: total } = await countQuery

  // Apply sorting
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

  // Apply pagination
  dbQuery = dbQuery.range(offset, offset + limit - 1)

  const { data } = await dbQuery

  // Transform DB data to Product interface (handle nullable fields)
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
    categories: p.categories && !Array.isArray(p.categories) ? p.categories : null,
    attributes: p.attributes as Record<string, string> | null,
  }))

  return { products, total: total || 0 }
}
