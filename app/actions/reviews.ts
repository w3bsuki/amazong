"use server"

import { z } from "zod"
import { errorEnvelope, successEnvelope, type Envelope } from "@/lib/api/envelope"
import { requireAuth } from "@/lib/auth/require-auth"
import { revalidatePublicProfileTagsByUsername } from "@/lib/cache/revalidate-profile-tags"
import { fetchUsernameByUserId } from "@/lib/data/profile"
import { fetchProductForReview, hasExistingReview, hasVerifiedPurchase, insertReview } from "@/lib/data/reviews"
import { revalidateTag } from "next/cache"

import { logger } from "@/lib/logger"
// ============================================================================
// TYPES
// ============================================================================

interface SubmitReviewInput {
  productId: string
  rating: number
  title?: string
  comment?: string
}

type SubmitReviewResult = Envelope<
  {
    review: {
      id: string
      rating: number
      comment: string | null
      created_at: string
    }
  },
  { error: string }
>

const SubmitReviewInputSchema = z.object({
  productId: z.string().min(1),
  rating: z.coerce.number(),
  title: z.string().optional(),
  comment: z.string().optional(),
})

// ============================================================================
// SUBMIT REVIEW
// ============================================================================

export async function submitReview(input: SubmitReviewInput): Promise<SubmitReviewResult> {
  const parsedInput = SubmitReviewInputSchema.safeParse(input)
  if (!parsedInput.success) {
    return errorEnvelope({ error: "Invalid input" })
  }

  const safeInput = parsedInput.data

  // 1. Verify user is authenticated
  const auth = await requireAuth()
  if (!auth) {
    return errorEnvelope({ error: "You must be logged in to leave a review" })
  }

  const { supabase, user } = auth

  // 2. Validate rating
  if (!safeInput.rating || safeInput.rating < 1 || safeInput.rating > 5) {
    return errorEnvelope({ error: "Rating must be between 1 and 5" })
  }

  // 3. Validate productId
  if (!safeInput.productId) {
    return errorEnvelope({ error: "Product ID is required" })
  }

  // 4. Verify product exists
  const productResult = await fetchProductForReview({ supabase, productId: safeInput.productId })
  if (!productResult.ok) {
    return errorEnvelope({ error: "Product not found" })
  }

  const product = productResult.product

  // 5. Prevent self-review (seller can't review their own product)
  if (product.seller_id === user.id) {
    return errorEnvelope({ error: "You cannot review your own product" })
  }

  // 6. Check if user already reviewed this product
  const existingReviewResult = await hasExistingReview({
    supabase,
    productId: safeInput.productId,
    userId: user.id,
  })

  if (existingReviewResult.ok && existingReviewResult.exists) {
    return errorEnvelope({ error: "You have already reviewed this product" })
  }

  // 7. Optional: Check if user purchased the product (for verified purchase badge)
  const verifiedPurchaseResult = await hasVerifiedPurchase({
    supabase,
    productId: safeInput.productId,
    userId: user.id,
  })

  const isVerifiedPurchase = verifiedPurchaseResult.ok ? verifiedPurchaseResult.verified : false

  // 8. Insert the review
  const insertResult = await insertReview({
    supabase,
    productId: safeInput.productId,
    userId: user.id,
    rating: safeInput.rating,
    title: safeInput.title?.trim() || null,
    comment: safeInput.comment?.trim() || null,
    verifiedPurchase: isVerifiedPurchase,
  })

  if (!insertResult.ok) {
    logger.error("Error inserting review:", insertResult.error)
    
    // Handle unique constraint violation
    if (
      typeof insertResult.error === "object" &&
      insertResult.error !== null &&
      "code" in insertResult.error &&
      (insertResult.error as { code?: unknown }).code === "23505"
    ) {
      return errorEnvelope({ error: "You have already reviewed this product" })
    }
    
    return errorEnvelope({ error: "Failed to submit review. Please try again." })
  }

  // 9. Revalidate cached product/review data
  revalidateTag(`reviews:product:${safeInput.productId}`, "products")
  revalidateTag(`product:${safeInput.productId}`, "products")
  revalidateTag(`seller-${product.seller_id}`, "products")
  revalidateTag(`seller-products-${product.seller_id}`, "products")
  
  // Also revalidate the seller's store page
  const sellerUsername = await fetchUsernameByUserId({ supabase, userId: product.seller_id })
  revalidatePublicProfileTagsByUsername(sellerUsername, "user")

  return successEnvelope({ review: insertResult.review })
}
