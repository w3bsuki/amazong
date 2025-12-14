"use server"

import { revalidatePath, revalidateTag } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import { z } from "zod"

// Types
export interface SellerFeedback {
  id: string
  buyer_id: string
  seller_id: string
  order_id: string | null
  rating: number
  comment: string | null
  item_as_described: boolean
  shipping_speed: boolean
  communication: boolean
  buyer_response: string | null
  buyer_response_at: string | null
  created_at: string
  updated_at: string
  profiles?: {
    full_name: string | null
    avatar_url: string | null
  } | null
  orders?: {
    id: string
    created_at: string
    total_amount: number
  } | null
}

export interface SellerFeedbackStats {
  totalFeedback: number
  averageRating: number
  positivePercentage: number
  itemAsDescribedPercentage: number
  shippingSpeedPercentage: number
  communicationPercentage: number
  ratingDistribution: Record<number, number>
}

// Validation schemas
const submitFeedbackSchema = z.object({
  sellerId: z.string().uuid("Invalid seller ID"),
  orderId: z.string().uuid("Invalid order ID").optional().nullable(),
  rating: z.number().int().min(1, "Rating must be at least 1").max(5, "Rating must be at most 5"),
  comment: z.string().max(1000, "Comment must be 1000 characters or less").optional().nullable(),
  itemAsDescribed: z.boolean().default(true),
  shippingSpeed: z.boolean().default(true),
  communication: z.boolean().default(true),
})

const updateFeedbackSchema = z.object({
  feedbackId: z.string().uuid("Invalid feedback ID"),
  rating: z.number().int().min(1).max(5).optional(),
  comment: z.string().max(1000).optional().nullable(),
  itemAsDescribed: z.boolean().optional(),
  shippingSpeed: z.boolean().optional(),
  communication: z.boolean().optional(),
})

interface ActionResult<T = void> {
  success: boolean
  data?: T
  error?: string
}

/**
 * Submit seller feedback after a completed order
 * - Validates buyer has a delivered order from this seller
 * - Prevents duplicate feedback for same order
 */
export async function submitSellerFeedback(
  input: z.infer<typeof submitFeedbackSchema>
): Promise<ActionResult<{ id: string }>> {
  try {
    const supabase = await createClient()
    if (!supabase) {
      return { success: false, error: "Database connection failed" }
    }

    // Validate input
    const validated = submitFeedbackSchema.safeParse(input)
    if (!validated.success) {
      return { success: false, error: validated.error.errors[0]?.message || "Invalid input" }
    }

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return { success: false, error: "You must be signed in to leave feedback" }
    }

    const data = validated.data

    // If orderId provided, verify user owns the order and it's delivered
    if (data.orderId) {
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .select(`
          id,
          user_id,
          status,
          order_items!inner (
            seller_id
          )
        `)
        .eq("id", data.orderId)
        .eq("user_id", user.id)
        .eq("order_items.seller_id", data.sellerId)
        .in("status", ["delivered", "completed"])
        .single()

      if (orderError || !order) {
        return { success: false, error: "You can only leave feedback after order delivery" }
      }

      // Check if feedback already exists for this order
      const { data: existingFeedback } = await supabase
        .from("seller_feedback")
        .select("id")
        .eq("buyer_id", user.id)
        .eq("order_id", data.orderId)
        .single()

      if (existingFeedback) {
        return { success: false, error: "You have already left feedback for this order" }
      }
    } else {
      // Without orderId, check if user has ANY completed order from this seller
      const { data: anyOrder } = await supabase
        .from("order_items")
        .select(`
          id,
          orders!inner (
            id,
            user_id,
            status
          )
        `)
        .eq("seller_id", data.sellerId)
        .eq("orders.user_id", user.id)
        .in("orders.status", ["delivered", "completed"])
        .limit(1)
        .single()

      if (!anyOrder) {
        return { success: false, error: "You can only leave feedback after purchasing from this seller" }
      }
    }

    // Insert the feedback
    const { data: feedback, error: insertError } = await supabase
      .from("seller_feedback")
      .insert({
        buyer_id: user.id,
        seller_id: data.sellerId,
        order_id: data.orderId || null,
        rating: data.rating,
        comment: data.comment || null,
        item_as_described: data.itemAsDescribed,
        shipping_speed: data.shippingSpeed,
        communication: data.communication,
      })
      .select("id")
      .single()

    if (insertError) {
      console.error("Error inserting seller feedback:", insertError)
      if (insertError.code === "23505") {
        return { success: false, error: "You have already left feedback for this order" }
      }
      return { success: false, error: "Failed to submit feedback" }
    }

    // Update seller stats (trigger should handle this, but we can also do it here)
    await updateSellerStatsFromFeedback(supabase, data.sellerId)

    // Create notification for seller
    await supabase.from("notifications").insert({
      user_id: data.sellerId,
      type: "review",
      title: `New ${data.rating}-star feedback`,
      body: data.comment 
        ? `A buyer left ${data.rating}-star feedback: "${data.comment.slice(0, 100)}${data.comment.length > 100 ? '...' : ''}"`
        : `A buyer left ${data.rating}-star feedback`,
      data: { rating: data.rating, feedback_id: feedback.id },
    })

    // Revalidate seller profile
    revalidatePath(`/seller/${data.sellerId}`)
    revalidateTag(`seller-${data.sellerId}`, "max")

    return { success: true, data: { id: feedback.id } }
  } catch (error) {
    console.error("Error in submitSellerFeedback:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

/**
 * Update existing feedback
 * - Only the feedback author can update within 30 days
 */
export async function updateSellerFeedback(
  input: z.infer<typeof updateFeedbackSchema>
): Promise<ActionResult> {
  try {
    const supabase = await createClient()
    if (!supabase) {
      return { success: false, error: "Database connection failed" }
    }

    // Validate input
    const validated = updateFeedbackSchema.safeParse(input)
    if (!validated.success) {
      return { success: false, error: validated.error.errors[0]?.message || "Invalid input" }
    }

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return { success: false, error: "You must be signed in" }
    }

    const data = validated.data

    // Check feedback ownership and age
    const { data: feedback, error: feedbackError } = await supabase
      .from("seller_feedback")
      .select("id, buyer_id, seller_id, created_at")
      .eq("id", data.feedbackId)
      .single()

    if (feedbackError || !feedback) {
      return { success: false, error: "Feedback not found" }
    }

    if (feedback.buyer_id !== user.id) {
      return { success: false, error: "You can only edit your own feedback" }
    }

    // Check if feedback is within 30 days
    const feedbackDate = new Date(feedback.created_at || Date.now())
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    if (feedbackDate < thirtyDaysAgo) {
      return { success: false, error: "Feedback can only be edited within 30 days" }
    }

    // Build update object
    const updateData: Record<string, unknown> = { updated_at: new Date().toISOString() }
    if (data.rating !== undefined) updateData.rating = data.rating
    if (data.comment !== undefined) updateData.comment = data.comment
    if (data.itemAsDescribed !== undefined) updateData.item_as_described = data.itemAsDescribed
    if (data.shippingSpeed !== undefined) updateData.shipping_speed = data.shippingSpeed
    if (data.communication !== undefined) updateData.communication = data.communication

    // Update the feedback
    const { error: updateError } = await supabase
      .from("seller_feedback")
      .update(updateData)
      .eq("id", data.feedbackId)

    if (updateError) {
      console.error("Error updating feedback:", updateError)
      return { success: false, error: "Failed to update feedback" }
    }

    // Update seller stats
    await updateSellerStatsFromFeedback(supabase, feedback.seller_id)

    // Revalidate seller profile
    revalidatePath(`/seller/${feedback.seller_id}`)
    revalidateTag(`seller-${feedback.seller_id}`, "max")

    return { success: true }
  } catch (error) {
    console.error("Error in updateSellerFeedback:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

/**
 * Delete seller feedback
 * - Only the buyer or admin can delete
 */
export async function deleteSellerFeedback(feedbackId: string): Promise<ActionResult> {
  try {
    const supabase = await createClient()
    if (!supabase) {
      return { success: false, error: "Database connection failed" }
    }

    if (!z.string().uuid().safeParse(feedbackId).success) {
      return { success: false, error: "Invalid feedback ID" }
    }

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return { success: false, error: "You must be signed in" }
    }

    // Get feedback
    const { data: feedback, error: feedbackError } = await supabase
      .from("seller_feedback")
      .select("id, buyer_id, seller_id")
      .eq("id", feedbackId)
      .single()

    if (feedbackError || !feedback) {
      return { success: false, error: "Feedback not found" }
    }

    // Check if user is admin
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single()

    const isAdmin = profile?.role === "admin"

    if (feedback.buyer_id !== user.id && !isAdmin) {
      return { success: false, error: "You can only delete your own feedback" }
    }

    // Delete the feedback
    const { error: deleteError } = await supabase
      .from("seller_feedback")
      .delete()
      .eq("id", feedbackId)

    if (deleteError) {
      console.error("Error deleting feedback:", deleteError)
      return { success: false, error: "Failed to delete feedback" }
    }

    // Update seller stats
    await updateSellerStatsFromFeedback(supabase, feedback.seller_id)

    // Revalidate seller profile
    revalidatePath(`/seller/${feedback.seller_id}`)
    revalidateTag(`seller-${feedback.seller_id}`, "max")

    return { success: true }
  } catch (error) {
    console.error("Error in deleteSellerFeedback:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

/**
 * Get seller feedback with pagination
 */
export async function getSellerFeedback(
  sellerId: string,
  options?: {
    limit?: number
    offset?: number
    rating?: number
    sortBy?: "newest" | "oldest" | "rating_high" | "rating_low"
  }
): Promise<ActionResult<{ feedback: SellerFeedback[]; total: number; stats: SellerFeedbackStats }>> {
  try {
    const supabase = await createClient()
    if (!supabase) {
      return { success: false, error: "Database connection failed" }
    }

    if (!z.string().uuid().safeParse(sellerId).success) {
      return { success: false, error: "Invalid seller ID" }
    }

    const limit = options?.limit || 10
    const offset = options?.offset || 0

    // Build query
    let query = supabase
      .from("seller_feedback")
      .select(`
        id,
        buyer_id,
        seller_id,
        order_id,
        rating,
        comment,
        item_as_described,
        shipping_speed,
        communication,
        buyer_response,
        buyer_response_at,
        created_at,
        updated_at,
        profiles:buyer_id (
          full_name,
          avatar_url
        )
      `, { count: "exact" })
      .eq("seller_id", sellerId)

    // Apply rating filter
    if (options?.rating && options.rating >= 1 && options.rating <= 5) {
      query = query.eq("rating", options.rating)
    }

    // Apply sorting
    switch (options?.sortBy) {
      case "oldest":
        query = query.order("created_at", { ascending: true })
        break
      case "rating_high":
        query = query.order("rating", { ascending: false })
        break
      case "rating_low":
        query = query.order("rating", { ascending: true })
        break
      case "newest":
      default:
        query = query.order("created_at", { ascending: false })
    }

    // Apply pagination
    query = query.range(offset, offset + limit - 1)

    const { data, error, count } = await query

    if (error) {
      console.error("Error fetching seller feedback:", error)
      return { success: false, error: "Failed to fetch feedback" }
    }

    // Get stats
    const stats = await getSellerFeedbackStats(supabase, sellerId)

    return {
      success: true,
      data: {
        feedback: ((data || []) as unknown as SellerFeedback[]),
        total: count || 0,
        stats,
      },
    }
  } catch (error) {
    console.error("Error in getSellerFeedback:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

/**
 * Get seller feedback statistics
 */
async function getSellerFeedbackStats(
  supabase: Awaited<ReturnType<typeof createClient>>,
  sellerId: string
): Promise<SellerFeedbackStats> {
  if (!supabase) {
    return {
      totalFeedback: 0,
      averageRating: 0,
      positivePercentage: 100,
      itemAsDescribedPercentage: 100,
      shippingSpeedPercentage: 100,
      communicationPercentage: 100,
      ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
    }
  }

  const { data } = await supabase
    .from("seller_feedback")
    .select("rating, item_as_described, shipping_speed, communication")
    .eq("seller_id", sellerId)

  if (!data || data.length === 0) {
    return {
      totalFeedback: 0,
      averageRating: 0,
      positivePercentage: 100,
      itemAsDescribedPercentage: 100,
      shippingSpeedPercentage: 100,
      communicationPercentage: 100,
      ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
    }
  }

  const totalFeedback = data.length
  const totalRating = data.reduce((sum, f) => sum + f.rating, 0)
  const averageRating = totalRating / totalFeedback

  // Positive = 4 or 5 stars
  const positiveCount = data.filter(f => f.rating >= 4).length
  const positivePercentage = (positiveCount / totalFeedback) * 100

  // Category percentages
  const itemDescribedCount = data.filter(f => f.item_as_described).length
  const shippingSpeedCount = data.filter(f => f.shipping_speed).length
  const communicationCount = data.filter(f => f.communication).length

  const itemAsDescribedPercentage = (itemDescribedCount / totalFeedback) * 100
  const shippingSpeedPercentage = (shippingSpeedCount / totalFeedback) * 100
  const communicationPercentage = (communicationCount / totalFeedback) * 100

  // Rating distribution
  const ratingDistribution: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  data.forEach(f => {
    ratingDistribution[f.rating] = (ratingDistribution[f.rating] || 0) + 1
  })

  return {
    totalFeedback,
    averageRating: Math.round(averageRating * 10) / 10,
    positivePercentage: Math.round(positivePercentage),
    itemAsDescribedPercentage: Math.round(itemAsDescribedPercentage),
    shippingSpeedPercentage: Math.round(shippingSpeedPercentage),
    communicationPercentage: Math.round(communicationPercentage),
    ratingDistribution,
  }
}

/**
 * Update seller_stats table from feedback data
 */
async function updateSellerStatsFromFeedback(
  supabase: Awaited<ReturnType<typeof createClient>>,
  sellerId: string
): Promise<void> {
  if (!supabase) return

  const stats = await getSellerFeedbackStats(supabase, sellerId)

  await supabase
    .from("seller_stats")
    .upsert({
      seller_id: sellerId,
      average_rating: stats.averageRating,
      total_reviews: stats.totalFeedback,
      positive_feedback_pct: stats.positivePercentage,
      item_described_pct: stats.itemAsDescribedPercentage,
      shipping_speed_pct: stats.shippingSpeedPercentage,
      communication_pct: stats.communicationPercentage,
      updated_at: new Date().toISOString(),
    }, {
      onConflict: "seller_id",
    })
}

/**
 * Check if user can leave feedback for a seller
 */
export async function canUserLeaveFeedback(
  sellerId: string,
  orderId?: string
): Promise<ActionResult<{
  canLeaveFeedback: boolean
  hasExistingFeedback: boolean
  hasQualifyingOrder: boolean
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
        data: { canLeaveFeedback: false, hasExistingFeedback: false, hasQualifyingOrder: false },
      }
    }

    // Check for existing feedback
    let feedbackQuery = supabase
      .from("seller_feedback")
      .select("id")
      .eq("buyer_id", user.id)
      .eq("seller_id", sellerId)

    if (orderId) {
      feedbackQuery = feedbackQuery.eq("order_id", orderId)
    }

    const { data: existingFeedback } = await feedbackQuery.single()
    const hasExistingFeedback = !!existingFeedback

    // Check for qualifying orders
    const { data: qualifyingOrder } = await supabase
      .from("order_items")
      .select(`
        id,
        orders!inner (
          id,
          user_id,
          status
        )
      `)
      .eq("seller_id", sellerId)
      .eq("orders.user_id", user.id)
      .in("orders.status", ["delivered", "completed"])
      .limit(1)
      .single()

    const hasQualifyingOrder = !!qualifyingOrder
    const canLeaveFeedback = !hasExistingFeedback && hasQualifyingOrder

    return {
      success: true,
      data: { canLeaveFeedback, hasExistingFeedback, hasQualifyingOrder },
    }
  } catch (error) {
    console.error("Error in canUserLeaveFeedback:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

/**
 * Seller: Respond to feedback (buyer_response field)
 * Note: This is for the seller to respond via buyer_response field on seller_feedback
 */
export async function respondToFeedback(
  feedbackId: string,
  response: string
): Promise<ActionResult> {
  try {
    const supabase = await createClient()
    if (!supabase) {
      return { success: false, error: "Database connection failed" }
    }

    if (!z.string().uuid().safeParse(feedbackId).success) {
      return { success: false, error: "Invalid feedback ID" }
    }

    if (!response || response.trim().length === 0) {
      return { success: false, error: "Response cannot be empty" }
    }

    if (response.length > 500) {
      return { success: false, error: "Response must be 500 characters or less" }
    }

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return { success: false, error: "You must be signed in" }
    }

    // Get feedback and verify seller
    const { data: feedback, error: feedbackError } = await supabase
      .from("seller_feedback")
      .select("id, seller_id, buyer_id")
      .eq("id", feedbackId)
      .single()

    if (feedbackError || !feedback) {
      return { success: false, error: "Feedback not found" }
    }

    if (feedback.seller_id !== user.id) {
      return { success: false, error: "Only the seller can respond to feedback" }
    }

    // Update with seller's response (using buyer_response field for seller's reply)
    const { error: updateError } = await supabase
      .from("seller_feedback")
      .update({
        buyer_response: response.trim(),
        buyer_response_at: new Date().toISOString(),
      })
      .eq("id", feedbackId)

    if (updateError) {
      console.error("Error responding to feedback:", updateError)
      return { success: false, error: "Failed to submit response" }
    }

    // Notify the buyer
    await supabase.from("notifications").insert({
      user_id: feedback.buyer_id,
      type: "review",
      title: "Seller responded to your feedback",
      body: "The seller has responded to your feedback",
      data: { feedback_id: feedbackId },
    })

    return { success: true }
  } catch (error) {
    console.error("Error in respondToFeedback:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}
