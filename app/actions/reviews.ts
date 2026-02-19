"use server"

import { z } from "zod"
import { requireAuth } from "@/lib/auth/require-auth"
import { revalidatePublicProfileTagsByUsername } from "@/lib/cache/revalidate-profile-tags"
import { revalidateTag } from "next/cache"

// ============================================================================
// TYPES
// ============================================================================

interface SubmitReviewInput {
  productId: string
  rating: number
  title?: string
  comment?: string
}

interface ReviewResult {
  success: boolean
  error?: string
  review?: {
    id: string
    rating: number
    comment: string | null
    created_at: string
  }
}

const SubmitReviewInputSchema = z.object({
  productId: z.string().min(1),
  rating: z.coerce.number(),
  title: z.string().optional(),
  comment: z.string().optional(),
})

// ============================================================================
// SUBMIT REVIEW
// ============================================================================

export async function submitReview(input: SubmitReviewInput): Promise<ReviewResult> {
  const parsedInput = SubmitReviewInputSchema.safeParse(input)
  if (!parsedInput.success) {
    return { success: false, error: "Invalid input" }
  }

  const safeInput = parsedInput.data

  // 1. Verify user is authenticated
  const auth = await requireAuth()
  if (!auth) {
    return { success: false, error: "You must be logged in to leave a review" }
  }

  const { supabase, user } = auth

  // 2. Validate rating
  if (!safeInput.rating || safeInput.rating < 1 || safeInput.rating > 5) {
    return { success: false, error: "Rating must be between 1 and 5" }
  }

  // 3. Validate productId
  if (!safeInput.productId) {
    return { success: false, error: "Product ID is required" }
  }

  // 4. Verify product exists
  const { data: product, error: productError } = await supabase
    .from("products")
    .select("id, title, seller_id")
    .eq("id", safeInput.productId)
    .single()

  if (productError || !product) {
    return { success: false, error: "Product not found" }
  }

  // 5. Prevent self-review (seller can't review their own product)
  if (product.seller_id === user.id) {
    return { success: false, error: "You cannot review your own product" }
  }

  // 6. Check if user already reviewed this product
  const { data: existingReview } = await supabase
    .from("reviews")
    .select("id")
    .eq("product_id", safeInput.productId)
    .eq("user_id", user.id)
    .maybeSingle()

  if (existingReview) {
    return { success: false, error: "You have already reviewed this product" }
  }

  // 7. Optional: Check if user purchased the product (for verified purchase badge)
  const { data: purchase } = await supabase
    .from("order_items")
    .select(`
      id,
      order:orders!inner(user_id, status)
    `)
    .eq("product_id", safeInput.productId)
    .eq("orders.user_id", user.id)
    .in("orders.status", ["paid", "processing", "shipped", "delivered"])
    .limit(1)
    .maybeSingle()

  const isVerifiedPurchase = !!purchase

  // 8. Insert the review
  const { data: review, error: insertError } = await supabase
    .from("reviews")
    .insert({
      product_id: safeInput.productId,
      user_id: user.id,
      rating: safeInput.rating,
      title: safeInput.title?.trim() || null,
      comment: safeInput.comment?.trim() || null,
      verified_purchase: isVerifiedPurchase,
    })
    .select("id, rating, comment, created_at")
    .single()

  if (insertError) {
    console.error("Error inserting review:", insertError)
    
    // Handle unique constraint violation
    if (insertError.code === "23505") {
      return { success: false, error: "You have already reviewed this product" }
    }
    
    return { success: false, error: "Failed to submit review. Please try again." }
  }

  // 9. Revalidate cached product/review data
  revalidateTag(`reviews:product:${safeInput.productId}`, "products")
  revalidateTag(`product:${safeInput.productId}`, "products")
  revalidateTag(`seller-${product.seller_id}`, "products")
  revalidateTag(`seller-products-${product.seller_id}`, "products")
  
  // Also revalidate the seller's store page
  const { data: sellerProfile } = await supabase
    .from("profiles")
    .select("username")
    .eq("id", product.seller_id)
    .single()
  
  revalidatePublicProfileTagsByUsername(sellerProfile?.username, "user")

  return { 
    success: true, 
    review: review 
  }
}
