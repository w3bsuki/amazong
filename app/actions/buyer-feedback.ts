"use server"

import { z } from "zod"
import { requireAuth } from "@/lib/auth/require-auth"
import { revalidateTag } from "next/cache"

// =====================================================
// BUYER FEEDBACK SERVER ACTIONS
// For SELLERS to rate BUYERS after completed orders
// This is the reverse of seller_feedback (buyer rates seller)
// =====================================================

export interface BuyerFeedbackInput {
  buyer_id: string
  order_id: string
  rating: number // 1-5
  comment?: string
  payment_promptness?: boolean // Did they pay on time?
  communication?: boolean // Were they responsive?
  reasonable_expectations?: boolean // Were their expectations fair?
}

export interface BuyerFeedback {
  id: string
  seller_id: string
  buyer_id: string
  order_id: string | null
  rating: number
  comment: string | null
  payment_promptness: boolean | null
  communication: boolean | null
  reasonable_expectations: boolean | null
  seller_response: string | null
  seller_response_at: string | null
  created_at: string | null
  updated_at: string | null
  // Joined data from profiles
  seller?: {
    display_name: string | null
    username: string | null
  } | null
}

const BuyerFeedbackInputSchema = z.object({
  buyer_id: z.string().min(1),
  order_id: z.string().min(1),
  rating: z.coerce.number(),
  comment: z.string().optional(),
  payment_promptness: z.boolean().optional(),
  communication: z.boolean().optional(),
  reasonable_expectations: z.boolean().optional(),
})

// =====================================================
// SUBMIT BUYER FEEDBACK (Seller rates Buyer)
// =====================================================
export async function submitBuyerFeedback(
  input: BuyerFeedbackInput
): Promise<{ success: boolean; error?: string; data?: BuyerFeedback }> {
  const parsedInput = BuyerFeedbackInputSchema.safeParse(input)
  if (!parsedInput.success) {
    return { success: false, error: "Invalid input" }
  }

  const safeInput = parsedInput.data

  try {
    const auth = await requireAuth()
    if (!auth) {
      return { success: false, error: "Not authenticated" }
    }
    const { user, supabase } = auth

    // Verify user is a seller (has is_seller flag)
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id, username, is_seller")
      .eq("id", user.id)
      .single()

    if (profileError || !profile) {
      return { success: false, error: "Profile not found" }
    }

    if (!profile.is_seller) {
      return { success: false, error: "Only sellers can rate buyers" }
    }

    // Verify the order exists and belongs to this seller
    const { data: orderItem, error: orderError } = await supabase
      .from("order_items")
      .select(`
        id,
        order_id,
        seller_id,
        status,
        order:orders!inner(
          id,
          user_id,
          status
        )
      `)
      .eq("order_id", safeInput.order_id)
      .eq("seller_id", user.id)
      .single()

    if (orderError || !orderItem) {
      return { success: false, error: "Order not found or you are not the seller" }
    }

    // Verify order is in a rateable state (delivered or completed)
    if (!["delivered", "completed", "shipped"].includes(orderItem.status || "")) {
      return { success: false, error: "Can only rate buyers for delivered or completed orders" }
    }

    // Verify buyer_id matches order user_id
    const order = orderItem.order as unknown as { id: string; user_id: string; status: string }
    if (order.user_id !== safeInput.buyer_id) {
      return { success: false, error: "Buyer ID does not match order" }
    }

    // Check if feedback already exists
    const { data: existing } = await supabase
      .from("buyer_feedback")
      .select("id")
      .eq("seller_id", user.id)
      .eq("order_id", safeInput.order_id)
      .maybeSingle()

    if (existing) {
      return { success: false, error: "You have already rated this buyer for this order" }
    }

    // Validate rating
    if (safeInput.rating < 1 || safeInput.rating > 5) {
      return { success: false, error: "Rating must be between 1 and 5" }
    }

    // Insert feedback
    const { data, error } = await supabase
      .from("buyer_feedback")
      .insert({
        seller_id: user.id,
        buyer_id: safeInput.buyer_id,
        order_id: safeInput.order_id,
        rating: safeInput.rating,
        comment: safeInput.comment || null,
        payment_promptness: safeInput.payment_promptness ?? true,
        communication: safeInput.communication ?? true,
        reasonable_expectations: safeInput.reasonable_expectations ?? true,
      })
      .select("id, seller_id, buyer_id, order_id, rating, comment, payment_promptness, communication, reasonable_expectations, seller_response, seller_response_at, created_at, updated_at")
      .single()

    if (error) {
      console.error("Error submitting buyer feedback:", error)
      return { success: false, error: "Failed to submit feedback" }
    }

    revalidateTag("buyer-stats", "max")
    revalidateTag("orders", "max")

    return { success: true, data: data as unknown as BuyerFeedback }
  } catch (error) {
    console.error("submitBuyerFeedback error:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}
