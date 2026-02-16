import { z } from "zod"
import type { createStaticClient } from "@/lib/supabase/server"
import type { SellerResultCard, SellerSearchFilters } from "./types"

const SellerFilterInputSchema = z.object({
  sellerSort: z.enum(["products", "rating", "newest"]).optional(),
  sellerVerified: z.enum(["true", "false"]).optional(),
  sellerMinRating: z.coerce.number().min(0).max(5).optional(),
  sellerMinListings: z.coerce.number().int().min(0).max(100000).optional(),
  city: z.string().trim().min(1).optional(),
  nearby: z.enum(["true", "false"]).optional(),
})

interface SellerProfileRow {
  id: string
  username: string | null
  display_name: string | null
  business_name: string | null
  bio: string | null
  verified: boolean | null
  created_at: string
  avatar_url: string | null
}

interface SellerProductRow {
  seller_id: string
  rating: number | null
}

export function parseSellerSearchFilters(input: {
  sellerSort?: string
  sellerVerified?: string
  sellerMinRating?: string
  sellerMinListings?: string
  city?: string
  nearby?: string
}): SellerSearchFilters {
  const parsed = SellerFilterInputSchema.safeParse(input)

  if (!parsed.success) {
    return {
      sellerSort: "products",
      sellerVerified: false,
    }
  }

  return {
    sellerSort: parsed.data.sellerSort ?? "products",
    sellerVerified: parsed.data.sellerVerified === "true",
    ...(parsed.data.sellerMinRating != null ? { sellerMinRating: parsed.data.sellerMinRating } : {}),
    ...(parsed.data.sellerMinListings != null
      ? { sellerMinListings: parsed.data.sellerMinListings }
      : {}),
    ...(parsed.data.city ? { city: parsed.data.city } : {}),
    nearby: parsed.data.nearby === "true",
  }
}

export async function searchSellers(
  supabase: ReturnType<typeof createStaticClient>,
  options: {
    query: string
    categorySlug?: string
    filters: SellerSearchFilters
    page?: number
    limit?: number
  }
): Promise<{ sellers: SellerResultCard[]; total: number }> {
  const { query, categorySlug, filters, page = 1, limit = 24 } = options
  const safePage = Number.isFinite(page) && page > 0 ? Math.floor(page) : 1
  const safeLimit = Number.isFinite(limit) && limit > 0 ? Math.floor(limit) : 24
  const offset = (safePage - 1) * safeLimit
  const normalizedQuery = query.trim()

  let categoryId: string | null = null
  if (categorySlug) {
    const { data: categoryData } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", categorySlug)
      .maybeSingle()
    categoryId = categoryData?.id ?? null
  }

  let profilesQuery = supabase
    .from("profiles")
    .select("id, username, display_name, business_name, bio, verified, created_at, avatar_url")
    .eq("is_seller", true)
    .not("username", "is", null)

  if (normalizedQuery) {
    profilesQuery = profilesQuery.or(
      `display_name.ilike.%${normalizedQuery}%,business_name.ilike.%${normalizedQuery}%,username.ilike.%${normalizedQuery}%`
    )
  }

  const { data: profileRows } = await profilesQuery
  const sellerProfiles = (profileRows ?? []) as SellerProfileRow[]
  if (sellerProfiles.length === 0) {
    return { sellers: [], total: 0 }
  }

  const sellerIds = sellerProfiles.map((seller) => seller.id)

  let productsQuery = supabase
    .from("products")
    .select("seller_id, rating")
    .in("seller_id", sellerIds)
    // Public browsing surfaces must not show non-active listings.
    // Temporary legacy allowance: status can be NULL for older rows.
    .or("status.eq.active,status.is.null")

  if (categoryId) {
    productsQuery = productsQuery.filter("category_ancestors", "cs", `{${categoryId}}`)
  }

  const normalizedCity = filters.city?.trim().toLowerCase()
  const effectiveCity = filters.nearby
    ? normalizedCity && normalizedCity !== "undefined" && normalizedCity !== "null"
      ? normalizedCity
      : "sofia"
    : normalizedCity

  if (effectiveCity) {
    productsQuery = productsQuery.ilike("seller_city", effectiveCity)
  }

  const { data: productRows } = await productsQuery
  const sellerProducts = (productRows ?? []) as SellerProductRow[]

  const aggregates = new Map<string, { count: number; ratingSum: number; ratingCount: number }>()
  for (const row of sellerProducts) {
    const current = aggregates.get(row.seller_id) ?? { count: 0, ratingSum: 0, ratingCount: 0 }
    current.count += 1
    if (typeof row.rating === "number" && row.rating > 0) {
      current.ratingSum += row.rating
      current.ratingCount += 1
    }
    aggregates.set(row.seller_id, current)
  }

  const sellers: SellerResultCard[] = sellerProfiles
    .map((profile) => {
      const aggregate = aggregates.get(profile.id)
      const productCount = aggregate?.count ?? 0
      const avgRating =
        aggregate && aggregate.ratingCount > 0 ? aggregate.ratingSum / aggregate.ratingCount : null

      return {
        id: profile.id,
        username: profile.username,
        store_name: profile.display_name || profile.business_name || profile.username || "Unknown",
        description: profile.bio,
        verified: Boolean(profile.verified),
        created_at: profile.created_at,
        product_count: productCount,
        total_rating: avgRating,
        avatar_url: profile.avatar_url,
      }
    })
    .filter((seller) => seller.product_count > 0)

  const filtered = sellers.filter((seller) => {
    if (filters.sellerVerified && !seller.verified) return false
    if (filters.sellerMinRating != null && (seller.total_rating ?? 0) < filters.sellerMinRating) {
      return false
    }
    if (filters.sellerMinListings != null && seller.product_count < filters.sellerMinListings) {
      return false
    }
    return true
  })

  filtered.sort((a, b) => {
    if (filters.sellerSort === "rating") {
      return (b.total_rating ?? -1) - (a.total_rating ?? -1)
    }
    if (filters.sellerSort === "newest") {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    }
    return b.product_count - a.product_count
  })

  const total = filtered.length
  const pagedSellers = filtered.slice(offset, offset + safeLimit)

  return {
    sellers: pagedSellers,
    total,
  }
}
