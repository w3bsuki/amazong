import type { SupabaseClient } from "@supabase/supabase-js"

import type { Database } from "@/lib/supabase/database.types"

export interface Seller {
  id: string
  username: string | null
  store_name: string
  description: string | null
  verified: boolean
  created_at: string
  product_count: number
  total_rating: number | null
  avatar_url: string | null
}

export type SellerQueryResult = {
  id: string
  username: string | null
  display_name: string | null
  business_name: string | null
  bio: string | null
  verified: boolean | null
  created_at: string
  avatar_url: string | null
  products: { id: string; rating: number | null }[]
}

function toTopSeller(seller: SellerQueryResult): Seller {
  const products = seller.products || []
  const validRatings = products.filter((p) => p.rating !== null && p.rating > 0)
  const avgRating =
    validRatings.length > 0
      ? validRatings.reduce((sum, p) => sum + (p.rating || 0), 0) / validRatings.length
      : null

  return {
    id: seller.id,
    username: seller.username,
    store_name: seller.display_name || seller.business_name || seller.username || "Unknown",
    description: seller.bio,
    verified: seller.verified || false,
    created_at: seller.created_at,
    product_count: products.length,
    total_rating: avgRating,
    avatar_url: seller.avatar_url || null,
  }
}

export async function getTopSellers(supabase: SupabaseClient<Database>): Promise<Seller[]> {
  const { data } = await supabase
    .from("profiles")
    .select(
      `
        id,
        username,
        display_name,
        business_name,
        bio,
        verified,
        created_at,
        avatar_url,
        products (
          id,
          rating
        )
      `
    )
    .eq("is_seller", true)
    .not("username", "is", null)
    .order("verified", { ascending: false })
    .order("created_at", { ascending: false })

  const sellers = (data || []) as SellerQueryResult[]

  const sellersWithStats = sellers.map(toTopSeller)

  // Sort by product count (top sellers have more products)
  sellersWithStats.sort((a, b) => b.product_count - a.product_count)

  return sellersWithStats
}
