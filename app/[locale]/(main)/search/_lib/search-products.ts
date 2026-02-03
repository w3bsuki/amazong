import { createStaticClient } from "@/lib/supabase/server"
import { ITEMS_PER_PAGE } from "../../_lib/pagination"
import type { Product, SearchProductFilters } from "./types"
import { isBoostActiveNow } from "@/lib/boost/boost-status"
import { normalizeAttributeKey } from "@/lib/attributes/normalize-attribute-key"

type SearchQueryResult = {
  data?: unknown[] | null
  count?: number | null
}

type SearchQuery = {
  select: (columns: string, options?: Record<string, unknown>) => SearchQuery
  or: (filters: string) => SearchQuery
  in: (column: string, values: string[]) => SearchQuery
  gte: (column: string, value: number) => SearchQuery
  lte: (column: string, value: number) => SearchQuery
  contains: (column: string, value: unknown) => SearchQuery
  eq: (column: string, value: unknown) => SearchQuery
  gt: (column: string, value: unknown) => SearchQuery
  order: (column: string, options: { ascending: boolean; nullsFirst?: boolean }) => SearchQuery
  range: (from: number, to: number) => PromiseLike<SearchQueryResult>
} & PromiseLike<SearchQueryResult>

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
  const dealsOnly = filters.deals === "true"

  const buildCountBase = () => {
    const base = dealsOnly
      ? supabase.from("deal_products")
      : supabase.from("products")

    return base.select(
      "id, profiles!products_seller_id_fkey(is_verified_business,account_type)",
      { count: "exact", head: true }
    ) as unknown as SearchQuery
  }

  const buildDbBase = () => {
    const base = dealsOnly
      ? supabase.from("deal_products")
      : supabase.from("products")

    return base.select(
      "id,title,price,list_price,images,rating,review_count,category_id,slug,tags,is_boosted,boost_expires_at,profiles:profiles!products_seller_id_fkey(id,username,display_name,business_name,avatar_url,tier,account_type,is_verified_business),categories:categories!products_category_id_fkey(slug)"
    ) as unknown as SearchQuery
  }

  const applyFilters = (q: SearchQuery) => {
    let next = q

    if (shippingFilter) next = next.or(shippingFilter)

    if (categoryIds && categoryIds.length > 0) next = next.in("category_id", categoryIds)

    if (filters.minPrice) next = next.gte("price", Number(filters.minPrice))
    if (filters.maxPrice) next = next.lte("price", Number(filters.maxPrice))
    if (filters.tag) next = next.contains("tags", [filters.tag])
    if (filters.minRating) next = next.gte("rating", Number(filters.minRating))

    // Verified sellers (business verification)
    if (filters.verified === "true") next = next.eq("profiles.is_verified_business", true)
    if (filters.availability === "instock") next = next.gt("stock", 0)

    if (filters.attributes) {
      for (const [rawAttrName, attrValue] of Object.entries(filters.attributes)) {
        if (!attrValue) continue

        const attrName = normalizeAttributeKey(rawAttrName) || rawAttrName

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

  const applySecondarySort = (q: SearchQuery) => {
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

  let data: unknown[] = []

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

  const products: Product[] = (data || [])
    .map((raw): Product | null => {
      if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null
      const p = raw as Record<string, unknown>

      const id = typeof p.id === "string" ? p.id : null
      const title = typeof p.title === "string" ? p.title : null
      const price = typeof p.price === "number" ? p.price : null
      if (!id || !title || price == null) return null

      const list_price = typeof p.list_price === "number" ? p.list_price : null
      const images = Array.isArray(p.images)
        ? p.images.filter((img): img is string => typeof img === "string" && img.length > 0)
        : []

      const rating = typeof p.rating === "number" ? p.rating : null
      const review_count = typeof p.review_count === "number" ? p.review_count : null
      const category_id = typeof p.category_id === "string" ? p.category_id : null
      const slug = typeof p.slug === "string" ? p.slug : null

      const boostExpiresAt = typeof p.boost_expires_at === "string" ? p.boost_expires_at : null
      const isBoostedFlag = typeof p.is_boosted === "boolean" ? p.is_boosted : false

      const profilesValue = p.profiles
      const profiles =
        profilesValue && typeof profilesValue === "object" && !Array.isArray(profilesValue)
          ? (() => {
              const pr = profilesValue as Record<string, unknown>
              return {
                id: typeof pr.id === "string" ? pr.id : null,
                username: typeof pr.username === "string" ? pr.username : null,
                display_name: typeof pr.display_name === "string" ? pr.display_name : null,
                business_name: typeof pr.business_name === "string" ? pr.business_name : null,
                avatar_url: typeof pr.avatar_url === "string" ? pr.avatar_url : null,
                tier: typeof pr.tier === "string" ? pr.tier : null,
                account_type: typeof pr.account_type === "string" ? pr.account_type : null,
                is_verified_business:
                  typeof pr.is_verified_business === "boolean" ? pr.is_verified_business : null,
              }
            })()
          : null

      const categoriesValue = p.categories
      const categoriesSlug =
        categoriesValue && typeof categoriesValue === "object" && !Array.isArray(categoriesValue)
          ? (categoriesValue as Record<string, unknown>).slug
          : null
      const categories =
        typeof categoriesSlug === "string" && categoriesSlug.length > 0
          ? { slug: categoriesSlug }
          : null

      const tags = Array.isArray(p.tags)
        ? p.tags.filter((t): t is string => typeof t === "string" && t.length > 0)
        : []

      const product: Product = {
        id,
        title,
        price,
        list_price,
        images,
        rating,
        review_count,
        category_id,
        image_url: images[0] ?? null,
        tags,
        slug,
        is_boosted: isBoostActiveNow({ is_boosted: isBoostedFlag, boost_expires_at: boostExpiresAt }),
        profiles,
        categories,
      }

      return product
    })
    .filter((p): p is Product => p != null)

  return { products, total: total ?? 0 }
}
