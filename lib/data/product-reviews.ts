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

function toProductReview(row: unknown): ProductReview | null {
  if (typeof row !== "object" || row === null) return null

  const record = row as Record<string, unknown>

  const id = typeof record.id === "string" ? record.id : null
  const rating = typeof record.rating === "number" ? record.rating : null
  const created_at = typeof record.created_at === "string" ? record.created_at : null

  const commentValue = record.comment
  const comment = commentValue === null || typeof commentValue === "string" ? commentValue : null

  if (!id || rating === null || !created_at) return null

  const userValue = record.user
  let user: ProductReview["user"] = null

  if (typeof userValue === "object" && userValue !== null && !Array.isArray(userValue)) {
    const u = userValue as Record<string, unknown>
    user = {
      display_name: typeof u.display_name === "string" ? u.display_name : null,
      username: typeof u.username === "string" ? u.username : null,
      avatar_url: typeof u.avatar_url === "string" ? u.avatar_url : null,
    }
  }

  return { id, rating, comment, created_at, user }
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

  if (error || !Array.isArray(data)) return []

  const reviews: ProductReview[] = []
  for (const row of data) {
    const parsed = toProductReview(row)
    if (!parsed) continue
    reviews.push(parsed)
  }

  return reviews
}
