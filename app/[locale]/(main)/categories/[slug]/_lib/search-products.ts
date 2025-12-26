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
  const offset = (page - 1) * limit

  let countQuery = supabase.from("products").select("*", { count: "exact", head: true })
  let dbQuery = supabase
    .from("products")
    .select(
      "*, profiles!products_seller_id_fkey(id,username,display_name,business_name,avatar_url,tier,account_type,is_verified_business)"
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

  const products: Product[] = (data || []).map((p) => {
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
      tags: Array.isArray(p.tags) ? p.tags.filter((t): t is string => typeof t === "string") : [],
    }
  })

  return { products, total: total || 0 }
}
