"use server"

import { revalidateTag } from "next/cache"
import { createAdminClient, createClient } from "@/lib/supabase/server"
import { requireAuth } from "@/lib/auth/require-auth"
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
    // Validate input
    const validated = submitFeedbackSchema.safeParse(input)
    if (!validated.success) {
      return { success: false, error: validated.error.issues[0]?.message || "Invalid input" }
    }

    // Get current user
    const auth = await requireAuth()
    if (!auth) {
      return { success: false, error: "You must be signed in to leave feedback" }
    }

    const { supabase, user } = auth

    const data = validated.data

    // If orderId provided, verify user owns the order and it's delivered.
    // Delivery is tracked on order_items.status (buyerConfirmDelivery updates the item).
    if (data.orderId) {
      const { data: deliveredItem, error: deliveredError } = await supabase
        .from("order_items")
        .select(
          `
          id,
          status,
          order:orders!inner(id, user_id)
        `
        )
        .eq("order_id", data.orderId)
        .eq("seller_id", data.sellerId)
        .eq("orders.user_id", user.id)
        .eq("status", "delivered")
        .limit(1)
        .single()

      if (deliveredError || !deliveredItem) {
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
      // Without orderId, check if user has ANY delivered order item from this seller
      const { data: anyDeliveredItem } = await supabase
        .from("order_items")
        .select(
          `
          id,
          status,
          orders!inner(id, user_id)
        `
        )
        .eq("seller_id", data.sellerId)
        .eq("orders.user_id", user.id)
        .eq("status", "delivered")
        .limit(1)
        .single()

      if (!anyDeliveredItem) {
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

    // Create notification for seller (service role insert; users must not be able to write notifications directly).
    try {
      const admin = createAdminClient()
      const { error: notifError } = await admin.from("notifications").insert({
        user_id: data.sellerId,
        type: "review",
        title: `New ${data.rating}-star feedback`,
        body: data.comment
          ? `A buyer left ${data.rating}-star feedback: "${data.comment.slice(0, 100)}${data.comment.length > 100 ? "..." : ""}"`
          : `A buyer left ${data.rating}-star feedback`,
        data: { rating: data.rating, feedback_id: feedback.id },
      })

      if (notifError) {
        console.error("Error creating seller feedback notification:", notifError)
      }
    } catch (err) {
      console.error("Error creating seller feedback notification:", err)
    }

    revalidateTag(`seller-${data.sellerId}`, "max")

    return { success: true, data: { id: feedback.id } }
  } catch (error) {
    console.error("Error in submitSellerFeedback:", error)
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

