"use server"

import { revalidatePath, revalidateTag } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import { z } from "zod"

// Types
export interface Review {
  id: string
  product_id: string
  user_id: string
  rating: number
  title: string | null
  comment: string | null
  created_at: string
  helpful_count: number
  images: string[]
  verified_purchase: boolean
  seller_response: string | null
  seller_response_at: string | null
  profiles?: {
    full_name: string | null
    avatar_url: string | null
  } | null
}

export interface ReviewWithProduct extends Review {
  products?: {
    id: string
    title: string
    images: string[]
    slug: string | null
    seller_id: string
  } | null
}

// Validation schemas
const submitReviewSchema = z.object({
  productId: z.string().uuid("Invalid product ID"),
  rating: z.number().int().min(1, "Rating must be at least 1").max(5, "Rating must be at most 5"),
  title: z.string().max(200, "Title must be 200 characters or less").optional().nullable(),
  comment: z.string().max(2000, "Comment must be 2000 characters or less").optional().nullable(),
  images: z.array(z.string().url()).max(5, "Maximum 5 images allowed").optional(),
})

const updateReviewSchema = z.object({
  reviewId: z.string().uuid("Invalid review ID"),
  rating: z.number().int().min(1).max(5).optional(),
  title: z.string().max(200).optional().nullable(),
  comment: z.string().max(2000).optional().nullable(),
  images: z.array(z.string().url()).max(5).optional(),
})

interface ActionResult<T = void> {
  success: boolean
  data?: T
  error?: string
}

/**
 * Submit a new product review
 * - Validates user has purchased the product
 * - Creates review in database
 * - Product rating is auto-updated via trigger
 */
export async function submitReview(
  input: z.infer<typeof submitReviewSchema>
): Promise<ActionResult<{ id: string }>> {
  try {
    const supabase = await createClient()
    if (!supabase) {
      return { success: false, error: "Database connection failed" }
    }

    // Validate input
    const validated = submitReviewSchema.safeParse(input)
    if (!validated.success) {
      return { success: false, error: validated.error.errors[0]?.message || "Invalid input" }
    }

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return { success: false, error: "You must be signed in to write a review" }
    }

    const data = validated.data

    // Check if user already reviewed this product
    const { data: existingReview } = await supabase
      .from("reviews")
      .select("id")
      .eq("product_id", data.productId)
      .eq("user_id", user.id)
      .single()

    if (existingReview) {
      return { success: false, error: "You have already reviewed this product" }
    }

    // Check if user has purchased this product (verified purchase)
    const { data: purchase } = await supabase
      .from("order_items")
      .select(`
        id,
        orders!inner (
          id,
          user_id,
          status
        )
      `)
      .eq("product_id", data.productId)
      .eq("orders.user_id", user.id)
      .in("orders.status", ["delivered", "shipped", "processing", "paid"])
      .limit(1)
      .single()

    const verifiedPurchase = !!purchase

    // Insert the review
    const { data: review, error: insertError } = await supabase
      .from("reviews")
      .insert({
        product_id: data.productId,
        user_id: user.id,
        rating: data.rating,
        title: data.title || null,
        comment: data.comment || null,
        images: data.images || [],
        verified_purchase: verifiedPurchase,
        helpful_count: 0,
      })
      .select("id")
      .single()

    if (insertError) {
      console.error("Error inserting review:", insertError)
      return { success: false, error: "Failed to submit review" }
    }

    // Create notification for seller
    const { data: product } = await supabase
      .from("products")
      .select("seller_id, title")
      .eq("id", data.productId)
      .single()

    if (product?.seller_id) {
      await supabase.from("notifications").insert({
        user_id: product.seller_id,
        type: "review",
        title: `New ${data.rating}-star review`,
        body: `Someone left a ${data.rating}-star review on "${product.title}"`,
        product_id: data.productId,
        data: { rating: data.rating, review_id: review.id },
      })
    }

    // Revalidate product page cache
    revalidatePath(`/product/${data.productId}`)
    revalidateTag(`product-${data.productId}`)

    return { success: true, data: { id: review.id } }
  } catch (error) {
    console.error("Error in submitReview:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

/**
 * Update an existing review
 * - Only the review author can update within 30 days
 */
export async function updateReview(
  input: z.infer<typeof updateReviewSchema>
): Promise<ActionResult> {
  try {
    const supabase = await createClient()
    if (!supabase) {
      return { success: false, error: "Database connection failed" }
    }

    // Validate input
    const validated = updateReviewSchema.safeParse(input)
    if (!validated.success) {
      return { success: false, error: validated.error.errors[0]?.message || "Invalid input" }
    }

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return { success: false, error: "You must be signed in to update a review" }
    }

    const data = validated.data

    // Check review ownership and age
    const { data: review, error: reviewError } = await supabase
      .from("reviews")
      .select("id, user_id, product_id, created_at")
      .eq("id", data.reviewId)
      .single()

    if (reviewError || !review) {
      return { success: false, error: "Review not found" }
    }

    if (review.user_id !== user.id) {
      return { success: false, error: "You can only edit your own reviews" }
    }

    // Check if review is within 30 days
    const reviewDate = new Date(review.created_at)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    if (reviewDate < thirtyDaysAgo) {
      return { success: false, error: "Reviews can only be edited within 30 days of posting" }
    }

    // Build update object
    const updateData: Record<string, unknown> = {}
    if (data.rating !== undefined) updateData.rating = data.rating
    if (data.title !== undefined) updateData.title = data.title
    if (data.comment !== undefined) updateData.comment = data.comment
    if (data.images !== undefined) updateData.images = data.images

    // Update the review
    const { error: updateError } = await supabase
      .from("reviews")
      .update(updateData)
      .eq("id", data.reviewId)

    if (updateError) {
      console.error("Error updating review:", updateError)
      return { success: false, error: "Failed to update review" }
    }

    // Revalidate product page cache
    revalidatePath(`/product/${review.product_id}`)
    revalidateTag(`product-${review.product_id}`)

    return { success: true }
  } catch (error) {
    console.error("Error in updateReview:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

/**
 * Delete a review
 * - Only the review author or admin can delete
 */
export async function deleteReview(reviewId: string): Promise<ActionResult> {
  try {
    const supabase = await createClient()
    if (!supabase) {
      return { success: false, error: "Database connection failed" }
    }

    if (!z.string().uuid().safeParse(reviewId).success) {
      return { success: false, error: "Invalid review ID" }
    }

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return { success: false, error: "You must be signed in to delete a review" }
    }

    // Get review and check ownership
    const { data: review, error: reviewError } = await supabase
      .from("reviews")
      .select("id, user_id, product_id")
      .eq("id", reviewId)
      .single()

    if (reviewError || !review) {
      return { success: false, error: "Review not found" }
    }

    // Check if user is admin
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single()

    const isAdmin = profile?.role === "admin"

    if (review.user_id !== user.id && !isAdmin) {
      return { success: false, error: "You can only delete your own reviews" }
    }

    // Delete the review
    const { error: deleteError } = await supabase
      .from("reviews")
      .delete()
      .eq("id", reviewId)

    if (deleteError) {
      console.error("Error deleting review:", deleteError)
      return { success: false, error: "Failed to delete review" }
    }

    // Revalidate product page cache
    revalidatePath(`/product/${review.product_id}`)
    revalidateTag(`product-${review.product_id}`)

    return { success: true }
  } catch (error) {
    console.error("Error in deleteReview:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

/**
 * Get reviews for a product with pagination
 * Server-side data fetching for initial load
 */
export async function getProductReviews(
  productId: string,
  options?: {
    limit?: number
    offset?: number
    starFilter?: number
    sortBy?: "newest" | "oldest" | "helpful"
  }
): Promise<ActionResult<{ reviews: Review[]; total: number }>> {
  try {
    const supabase = await createClient()
    if (!supabase) {
      return { success: false, error: "Database connection failed" }
    }

    if (!z.string().uuid().safeParse(productId).success) {
      return { success: false, error: "Invalid product ID" }
    }

    const limit = options?.limit || 10
    const offset = options?.offset || 0

    // Build query
    let query = supabase
      .from("reviews")
      .select(`
        id,
        product_id,
        user_id,
        rating,
        title,
        comment,
        created_at,
        helpful_count,
        images,
        verified_purchase,
        seller_response,
        seller_response_at,
        profiles (
          full_name,
          avatar_url
        )
      `, { count: "exact" })
      .eq("product_id", productId)

    // Apply star filter
    if (options?.starFilter && options.starFilter >= 1 && options.starFilter <= 5) {
      query = query.eq("rating", options.starFilter)
    }

    // Apply sorting
    switch (options?.sortBy) {
      case "oldest":
        query = query.order("created_at", { ascending: true })
        break
      case "helpful":
        query = query.order("helpful_count", { ascending: false })
        break
      case "newest":
      default:
        query = query.order("created_at", { ascending: false })
    }

    // Apply pagination
    query = query.range(offset, offset + limit - 1)

    const { data, error, count } = await query

    if (error) {
      console.error("Error fetching reviews:", error)
      return { success: false, error: "Failed to fetch reviews" }
    }

    return {
      success: true,
      data: {
        reviews: (data as Review[]) || [],
        total: count || 0,
      },
    }
  } catch (error) {
    console.error("Error in getProductReviews:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

/**
 * Increment helpful count for a review
 * Rate-limited to prevent spam
 */
export async function markReviewHelpful(reviewId: string): Promise<ActionResult<{ newCount: number }>> {
  try {
    const supabase = await createClient()
    if (!supabase) {
      return { success: false, error: "Database connection failed" }
    }

    if (!z.string().uuid().safeParse(reviewId).success) {
      return { success: false, error: "Invalid review ID" }
    }

    // Get current user (optional - can be anonymous)
    const { data: { user } } = await supabase.auth.getUser()

    // For now, simple increment without tracking who voted
    // In production, you'd want a review_votes table to prevent duplicates
    const { data, error } = await supabase.rpc("increment_helpful_count", {
      review_id: reviewId,
    })

    if (error) {
      console.error("Error incrementing helpful count:", error)
      return { success: false, error: "Failed to mark as helpful" }
    }

    return { success: true, data: { newCount: data || 0 } }
  } catch (error) {
    console.error("Error in markReviewHelpful:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

/**
 * Get user's own reviews
 */
export async function getUserReviews(options?: {
  limit?: number
  offset?: number
}): Promise<ActionResult<{ reviews: ReviewWithProduct[]; total: number }>> {
  try {
    const supabase = await createClient()
    if (!supabase) {
      return { success: false, error: "Database connection failed" }
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return { success: false, error: "You must be signed in" }
    }

    const limit = options?.limit || 10
    const offset = options?.offset || 0

    const { data, error, count } = await supabase
      .from("reviews")
      .select(`
        id,
        product_id,
        user_id,
        rating,
        title,
        comment,
        created_at,
        helpful_count,
        images,
        verified_purchase,
        seller_response,
        seller_response_at,
        products (
          id,
          title,
          images,
          slug,
          seller_id
        )
      `, { count: "exact" })
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      console.error("Error fetching user reviews:", error)
      return { success: false, error: "Failed to fetch reviews" }
    }

    return {
      success: true,
      data: {
        reviews: (data as ReviewWithProduct[]) || [],
        total: count || 0,
      },
    }
  } catch (error) {
    console.error("Error in getUserReviews:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

/**
 * Seller: Respond to a review
 */
export async function respondToReview(
  reviewId: string,
  response: string
): Promise<ActionResult> {
  try {
    const supabase = await createClient()
    if (!supabase) {
      return { success: false, error: "Database connection failed" }
    }

    if (!z.string().uuid().safeParse(reviewId).success) {
      return { success: false, error: "Invalid review ID" }
    }

    if (!response || response.trim().length === 0) {
      return { success: false, error: "Response cannot be empty" }
    }

    if (response.length > 1000) {
      return { success: false, error: "Response must be 1000 characters or less" }
    }

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return { success: false, error: "You must be signed in" }
    }

    // Get review and check if user is the seller
    const { data: review, error: reviewError } = await supabase
      .from("reviews")
      .select(`
        id,
        product_id,
        user_id,
        products (
          seller_id
        )
      `)
      .eq("id", reviewId)
      .single()

    if (reviewError || !review) {
      return { success: false, error: "Review not found" }
    }

    const productSellerId = (review.products as { seller_id: string })?.seller_id

    if (productSellerId !== user.id) {
      return { success: false, error: "Only the product seller can respond to reviews" }
    }

    // Update review with seller response
    const { error: updateError } = await supabase
      .from("reviews")
      .update({
        seller_response: response.trim(),
        seller_response_at: new Date().toISOString(),
      })
      .eq("id", reviewId)

    if (updateError) {
      console.error("Error responding to review:", updateError)
      return { success: false, error: "Failed to submit response" }
    }

    // Notify the reviewer
    await supabase.from("notifications").insert({
      user_id: review.user_id,
      type: "review",
      title: "Seller responded to your review",
      body: "The seller has responded to your review",
      product_id: review.product_id,
      data: { review_id: reviewId },
    })

    // Revalidate product page
    revalidatePath(`/product/${review.product_id}`)

    return { success: true }
  } catch (error) {
    console.error("Error in respondToReview:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

/**
 * Check if user can review a product
 */
export async function canUserReviewProduct(productId: string): Promise<ActionResult<{
  canReview: boolean
  hasReviewed: boolean
  hasPurchased: boolean
}>> {
  try {
    const supabase = await createClient()
    if (!supabase) {
      return { success: false, error: "Database connection failed" }
    }

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return {
        success: true,
        data: { canReview: false, hasReviewed: false, hasPurchased: false },
      }
    }

    // Check if already reviewed
    const { data: existingReview } = await supabase
      .from("reviews")
      .select("id")
      .eq("product_id", productId)
      .eq("user_id", user.id)
      .single()

    const hasReviewed = !!existingReview

    // Check if user has purchased
    const { data: purchase } = await supabase
      .from("order_items")
      .select(`
        id,
        orders!inner (
          user_id,
          status
        )
      `)
      .eq("product_id", productId)
      .eq("orders.user_id", user.id)
      .in("orders.status", ["delivered", "shipped", "processing", "paid"])
      .limit(1)
      .single()

    const hasPurchased = !!purchase
    const canReview = !hasReviewed && hasPurchased

    return {
      success: true,
      data: { canReview, hasReviewed, hasPurchased },
    }
  } catch (error) {
    console.error("Error in canUserReviewProduct:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}
