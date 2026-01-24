"use server"

import { createClient } from "@/lib/supabase/server"
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

interface Review {
  id: string
  rating: number
  comment: string | null
  created_at: string
  helpful_count?: number
  verified_purchase?: boolean
  user: {
    id: string
    username: string | null
    display_name: string | null
    avatar_url: string | null
  } | null
}

// ============================================================================
// SUBMIT REVIEW
// ============================================================================

export async function submitReview(input: SubmitReviewInput): Promise<ReviewResult> {
  const supabase = await createClient()
  
  if (!supabase) {
    return { success: false, error: "Database connection failed" }
  }

  // 1. Verify user is authenticated
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return { success: false, error: "You must be logged in to leave a review" }
  }

  // 2. Validate rating
  if (!input.rating || input.rating < 1 || input.rating > 5) {
    return { success: false, error: "Rating must be between 1 and 5" }
  }

  // 3. Validate productId
  if (!input.productId) {
    return { success: false, error: "Product ID is required" }
  }

  // 4. Verify product exists
  const { data: product, error: productError } = await supabase
    .from("products")
    .select("id, title, seller_id")
    .eq("id", input.productId)
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
    .eq("product_id", input.productId)
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
    .eq("product_id", input.productId)
    .eq("orders.user_id", user.id)
    .in("orders.status", ["paid", "processing", "shipped", "delivered"])
    .limit(1)
    .maybeSingle()

  const isVerifiedPurchase = !!purchase

  // 8. Insert the review
  const { data: review, error: insertError } = await supabase
    .from("reviews")
    .insert({
      product_id: input.productId,
      user_id: user.id,
      rating: input.rating,
      title: input.title?.trim() || null,
      comment: input.comment?.trim() || null,
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
  revalidateTag(`reviews:product:${input.productId}`, "products")
  revalidateTag("products:list", "products")
  revalidateTag(`product:${input.productId}`, "products")
  
  // Also revalidate the seller's store page
  const { data: sellerProfile } = await supabase
    .from("profiles")
    .select("username")
    .eq("id", product.seller_id)
    .single()
  
  revalidateTag("profiles", "user")
  if (sellerProfile?.username) {
    revalidateTag(`seller-${sellerProfile.username}`, "products")
    const lower = sellerProfile.username.toLowerCase()
    revalidateTag(`profile-${lower}`, "user")
    revalidateTag(`profile-meta-${lower}`, "user")
  }

  return { 
    success: true, 
    review: review 
  }
}

// ============================================================================
// GET PRODUCT REVIEWS
// ============================================================================

export async function getProductReviews(productId: string): Promise<Review[]> {
  const supabase = await createClient()
  
  if (!supabase) {
    console.error("Database connection failed")
    return []
  }

  const { data: reviews, error } = await supabase
    .from("reviews")
    .select(`
      id,
      rating,
      comment,
      created_at,
      helpful_count,
      verified_purchase,
      user:profiles!reviews_user_id_fkey(
        id,
        username,
        display_name,
        avatar_url
      )
    `)
    .eq("product_id", productId)
    .order("created_at", { ascending: false })
    .limit(50)

  if (error) {
    console.error("Error fetching reviews:", error)
    return []
  }

  return (reviews || []) as Review[]
}

// ============================================================================
// CHECK IF USER CAN REVIEW
// ============================================================================

interface CanReviewResult {
  canReview: boolean
  reason?: "login_required" | "already_reviewed" | "own_product"
  existingReviewId?: string
}

export async function canUserReview(productId: string): Promise<CanReviewResult> {
  const supabase = await createClient()
  
  if (!supabase) {
    return { canReview: false, reason: "login_required" }
  }

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { canReview: false, reason: "login_required" }
  }

  // Check if this is user's own product
  const { data: product } = await supabase
    .from("products")
    .select("seller_id")
    .eq("id", productId)
    .single()

  if (product?.seller_id === user.id) {
    return { canReview: false, reason: "own_product" }
  }

  // Check if already reviewed
  const { data: existingReview } = await supabase
    .from("reviews")
    .select("id")
    .eq("product_id", productId)
    .eq("user_id", user.id)
    .maybeSingle()

  if (existingReview) {
    return { canReview: false, reason: "already_reviewed", existingReviewId: existingReview.id }
  }

  return { canReview: true }
}

// ============================================================================
// INCREMENT HELPFUL COUNT
// ============================================================================

export async function markReviewHelpful(reviewId: string): Promise<{ success: boolean; newCount?: number; error?: string }> {
  const supabase = await createClient()
  
  if (!supabase) {
    return { success: false, error: "Database connection failed" }
  }

  // Use RPC function for atomic increment (defined in migrations)
  const { data, error } = await supabase.rpc("increment_helpful_count", {
    review_id: reviewId,
  })

  if (error) {
    console.error("Error incrementing helpful count:", error)
    return { success: false, error: "Failed to mark as helpful" }
  }

  return { success: true, newCount: data }
}

// ============================================================================
// DELETE REVIEW (own review only)
// ============================================================================

export async function deleteReview(reviewId: string): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()
  
  if (!supabase) {
    return { success: false, error: "Database connection failed" }
  }

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, error: "You must be logged in" }
  }

  // Get review to verify ownership and get product_id for revalidation
  const { data: review } = await supabase
    .from("reviews")
    .select("id, user_id, product_id")
    .eq("id", reviewId)
    .single()

  if (!review) {
    return { success: false, error: "Review not found" }
  }

  if (review.user_id !== user.id) {
    return { success: false, error: "You can only delete your own reviews" }
  }

  const { error: deleteError } = await supabase
    .from("reviews")
    .delete()
    .eq("id", reviewId)

  if (deleteError) {
    console.error("Error deleting review:", deleteError)
    return { success: false, error: "Failed to delete review" }
  }

  revalidateTag(`reviews:product:${review.product_id}`, "products")
  revalidateTag("products:list", "products")
  revalidateTag(`product:${review.product_id}`, "products")

  return { success: true }
}
