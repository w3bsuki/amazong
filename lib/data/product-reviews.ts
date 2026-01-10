import "server-only"

import { cacheLife, cacheTag } from "next/cache"
import { createStaticClient } from "@/lib/supabase/server"

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export type ProductReview = {
  id: string
  rating: number
  comment: string | null
  created_at: string
  user: {
    display_name: string | null
    username: string | null
    avatar_url: string | null
  } | null
}

export async function fetchProductReviews(productId: string, limit = 8): Promise<ProductReview[]> {
  "use cache"
  cacheLife("products")

  if (typeof productId !== "string" || !UUID_REGEX.test(productId)) return []

  // Product-granular invalidation: mutations should revalidate this tag.
  cacheTag(`reviews:product:${productId}`)
  // Align with existing product tag conventions used across the app.
  cacheTag(`product:${productId}`)

  const supabase = createStaticClient()

  const { data, error } = await supabase
    .from("reviews")
    .select(
      `
      id,
      rating,
      comment,
      created_at,
      user:profiles!reviews_user_id_fkey (
        display_name,
        username,
        avatar_url
      )
    `
    )
    .eq("product_id", productId)
    .order("created_at", { ascending: false })
    .limit(limit)

  if (error || !data) return []
  return data as unknown as ProductReview[]
}
