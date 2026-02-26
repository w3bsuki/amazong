"use server"

import { revalidateTag } from "next/cache"
import { createAdminClient } from "@/lib/supabase/server"
import { requireAuth } from "@/lib/auth/require-auth"
import { errorEnvelope, successEnvelope, type Envelope } from "@/lib/api/envelope"
import { z } from "zod"
import {
  fetchSellerFeedbackStatsRows,
  hasAnyDeliveredOrderItemForSeller,
  hasDeliveredOrderItemForOrder,
  hasExistingSellerFeedbackForOrder,
  insertSellerFeedback,
  insertSellerFeedbackNotification,
  upsertSellerStats,
} from "@/lib/data/seller-feedback"

import { logger } from "@/lib/logger"
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

function getEmptySellerFeedbackStats(): SellerFeedbackStats {
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

type SubmitSellerFeedbackResult = Envelope<{ id: string }, { error: string }>

type RequireAuthResult = Awaited<ReturnType<typeof requireAuth>>
type AuthedSupabase = NonNullable<RequireAuthResult>["supabase"]

/**
 * Submit seller feedback after a completed order
 * - Validates buyer has a delivered order from this seller
 * - Prevents duplicate feedback for same order
 */
export async function submitSellerFeedback(
  input: z.infer<typeof submitFeedbackSchema>
): Promise<SubmitSellerFeedbackResult> {
  try {
    // Validate input
    const validated = submitFeedbackSchema.safeParse(input)
    if (!validated.success) {
      return errorEnvelope({ error: validated.error.issues[0]?.message || "Invalid input" })
    }

    // Get current user
    const auth = await requireAuth()
    if (!auth) {
      return errorEnvelope({ error: "You must be signed in to leave feedback" })
    }

    const { supabase, user } = auth

    const data = validated.data

    // If orderId provided, verify user owns the order and it's delivered.
    // Delivery is tracked on order_items.status (buyerConfirmDelivery updates the item).
    if (data.orderId) {
      const deliveredResult = await hasDeliveredOrderItemForOrder({
        supabase,
        orderId: data.orderId,
        sellerId: data.sellerId,
        buyerId: user.id,
      })

      if (!deliveredResult.ok || !deliveredResult.exists) {
        return errorEnvelope({ error: "You can only leave feedback after order delivery" })
      }

      // Check if feedback already exists for this order
      const existingResult = await hasExistingSellerFeedbackForOrder({
        supabase,
        buyerId: user.id,
        orderId: data.orderId,
      })

      if (existingResult.ok && existingResult.exists) {
        return errorEnvelope({ error: "You have already left feedback for this order" })
      }
    } else {
      // Without orderId, check if user has ANY delivered order item from this seller
      const purchaseResult = await hasAnyDeliveredOrderItemForSeller({
        supabase,
        sellerId: data.sellerId,
        buyerId: user.id,
      })

      if (!purchaseResult.ok || !purchaseResult.exists) {
        return errorEnvelope({ error: "You can only leave feedback after purchasing from this seller" })
      }
    }

    // Insert the feedback
    const insertResult = await insertSellerFeedback({
      supabase,
      buyerId: user.id,
      sellerId: data.sellerId,
      orderId: data.orderId || null,
      rating: data.rating,
      comment: data.comment || null,
      itemAsDescribed: data.itemAsDescribed,
      shippingSpeed: data.shippingSpeed,
      communication: data.communication,
    })

    if (!insertResult.ok) {
      logger.error("Error inserting seller feedback:", insertResult.error)
      if (
        typeof insertResult.error === "object" &&
        insertResult.error !== null &&
        "code" in insertResult.error &&
        (insertResult.error as { code?: unknown }).code === "23505"
      ) {
        return errorEnvelope({ error: "You have already left feedback for this order" })
      }
      return errorEnvelope({ error: "Failed to submit feedback" })
    }

    // Update seller stats (trigger should handle this, but we can also do it here)
    await updateSellerStatsFromFeedback(supabase, data.sellerId)

    // Create notification for seller (service role insert; users must not be able to write notifications directly).
    try {
      const admin = createAdminClient()
      const notifResult = await insertSellerFeedbackNotification({
        adminSupabase: admin,
        sellerId: data.sellerId,
        rating: data.rating,
        comment: data.comment || null,
        feedbackId: insertResult.feedbackId,
      })

      if (!notifResult.ok) {
        logger.error("Error creating seller feedback notification:", notifResult.error)
      }
    } catch (err) {
      logger.error("Error creating seller feedback notification:", err)
    }

    revalidateTag(`seller-${data.sellerId}`, "max")

    return successEnvelope({ id: insertResult.feedbackId })
  } catch (error) {
    logger.error("Error in submitSellerFeedback:", error)
    return errorEnvelope({ error: "An unexpected error occurred" })
  }
}

/**
 * Get seller feedback statistics
 */
async function getSellerFeedbackStats(
  supabase: AuthedSupabase,
  sellerId: string
): Promise<SellerFeedbackStats> {
  const rowsResult = await fetchSellerFeedbackStatsRows({ supabase, sellerId })

  if (!rowsResult.ok || rowsResult.rows.length === 0) {
    return getEmptySellerFeedbackStats()
  }

  const totalFeedback = rowsResult.rows.length
  const totalRating = rowsResult.rows.reduce((sum, f) => sum + f.rating, 0)
  const averageRating = totalRating / totalFeedback

  // Positive = 4 or 5 stars
  const positiveCount = rowsResult.rows.filter(f => f.rating >= 4).length
  const positivePercentage = (positiveCount / totalFeedback) * 100

  // Category percentages
  const itemDescribedCount = rowsResult.rows.filter(f => f.item_as_described).length
  const shippingSpeedCount = rowsResult.rows.filter(f => f.shipping_speed).length
  const communicationCount = rowsResult.rows.filter(f => f.communication).length

  const itemAsDescribedPercentage = (itemDescribedCount / totalFeedback) * 100
  const shippingSpeedPercentage = (shippingSpeedCount / totalFeedback) * 100
  const communicationPercentage = (communicationCount / totalFeedback) * 100

  // Rating distribution
  const ratingDistribution: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  rowsResult.rows.forEach(f => {
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
  supabase: AuthedSupabase,
  sellerId: string
): Promise<void> {
  const stats = await getSellerFeedbackStats(supabase, sellerId)

  const updatedAt = new Date().toISOString()
  await upsertSellerStats({
    supabase,
    sellerId,
    averageRating: stats.averageRating,
    totalReviews: stats.totalFeedback,
    positiveFeedbackPct: stats.positivePercentage,
    itemDescribedPct: stats.itemAsDescribedPercentage,
    shippingSpeedPct: stats.shippingSpeedPercentage,
    communicationPct: stats.communicationPercentage,
    updatedAt,
  })
}
