import { createStaticClient } from "@/lib/supabase/server"
import { ITEMS_PER_PAGE } from "../../_lib/pagination"
import type { Product, SearchProductFilters } from "./types"
import { isBoostActive } from "@/lib/boost/boost-status"

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
  const nowIso = new Date().toISOString()

  const buildCountBase = () =>
    supabase
      .from("products")
      .select("id, profiles!products_seller_id_fkey(is_verified_business,account_type)", { count: "exact", head: true })

  const buildDbBase = () =>
    supabase
      .from("products")
      .select(
        "id,title,price,list_price,images,rating,review_count,category_id,slug,tags,is_boosted,boost_expires_at,profiles:profiles!products_seller_id_fkey(id,username,display_name,business_name,avatar_url,tier,account_type,is_verified_business),categories:categories!products_category_id_fkey(slug)"
      )

  const applyFilters = (q: any) => {
    let next = q

    if (shippingFilter) next = next.or(shippingFilter)

    if (categoryIds && categoryIds.length > 0) next = next.in("category_id", categoryIds)

    if (filters.minPrice) next = next.gte("price", Number(filters.minPrice))
    if (filters.maxPrice) next = next.lte("price", Number(filters.maxPrice))
    if (filters.tag) next = next.contains("tags", [filters.tag])
    if (filters.minRating) next = next.gte("rating", Number(filters.minRating))

    // "Discounts" / "Deals": best-effort (list_price present)
    if (filters.deals === "true") next = next.not("list_price", "is", null)

    // Verified sellers (business verification)
    if (filters.verified === "true") next = next.eq("profiles.is_verified_business", true)
    if (filters.availability === "instock") next = next.gt("stock", 0)

    if (filters.attributes) {
      for (const [attrName, attrValue] of Object.entries(filters.attributes)) {
        if (!attrValue) continue

        if (Array.isArray(attrValue)) {
          const values = attrValue.filter((v): v is string => typeof v === "string" && v.length > 0)
          if (values.length === 1) {
            next = next.contains("attributes", { [attrName]: values[0] })
          } else if (values.length > 1) {
            next = next.in(`attributes->>${attrName}`, values)
          }
        } else if (typeof attrValue === "string" && attrValue.length > 0) {
          next = next.contains("attributes", { [attrName]: attrValue })
        }
      }
    }

    if (query) {
      next = next.or(`title.ilike.%${query}%,description.ilike.%${query}%`)
    }

    return next
  }

  const applySecondarySort = (q: any) => {
    switch (filters.sort) {
      case "newest":
        return q.order("created_at", { ascending: false })
      case "price-asc":
        return q.order("price", { ascending: true })
      case "price-desc":
        return q.order("price", { ascending: false })
      case "rating":
        return q.order("rating", { ascending: false, nullsFirst: false })
      default:
        return q.order("rating", { ascending: false, nullsFirst: false })
    }
  }

  const { count: total } = await applyFilters(buildCountBase())
  const { count: boostedCountRaw } = await applyFilters(buildCountBase())
    .eq("is_boosted", true)
    .gt("boost_expires_at", nowIso)

  const boostedCount = boostedCountRaw || 0

  const boostedBase = () =>
    applySecondarySort(
      applyFilters(buildDbBase())
        .eq("is_boosted", true)
        .gt("boost_expires_at", nowIso)
        .order("boost_expires_at", { ascending: false, nullsFirst: false })
    )

  const restBase = () =>
    applySecondarySort(
      applyFilters(buildDbBase()).or(`boost_expires_at.is.null,boost_expires_at.lte.${nowIso}`)
    )

  let data: any[] = []

  if (offset < boostedCount) {
    const boostedStart = offset
    const boostedEnd = Math.min(boostedCount - 1, offset + limit - 1)
    const { data: boostedData } = await boostedBase().range(boostedStart, boostedEnd)

    data = boostedData || []

    const remaining = limit - data.length
    if (remaining > 0) {
      const { data: restData } = await restBase().range(0, remaining - 1)
      data = [...data, ...(restData || [])]
    }
  } else {
    const restOffset = offset - boostedCount
    const { data: restData } = await restBase().range(restOffset, restOffset + limit - 1)
    data = restData || []
  }

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
    tags: Array.isArray(p.tags) ? p.tags.filter((t: unknown): t is string => typeof t === "string") : [],
    slug: p.slug,
    is_boosted: isBoostActive({ is_boosted: p.is_boosted ?? false, boost_expires_at: p.boost_expires_at ?? null }),
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
  }))

  return { products, total: total || 0 }
}
