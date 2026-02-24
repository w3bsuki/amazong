"use server"

import { z } from "zod"
import { requireAuth } from "@/lib/auth/require-auth"
import { revalidateTag } from "next/cache"
import { errorEnvelope, successEnvelope, type Envelope } from "@/lib/api/envelope"
import type { Database } from "@/lib/supabase/database.types"

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

type BuyerFeedbackRow = Database["public"]["Tables"]["buyer_feedback"]["Row"]

type OrderItemForBuyerFeedback = {
  id: string
  order_id: string
  seller_id: string
  status: string | null
  order: {
    id: string
    user_id: string
    status: string | null
  }
}

const BuyerFeedbackInputSchema = z.object({
  buyer_id: z.string().uuid(),
  order_id: z.string().uuid(),
  rating: z.coerce.number().int().min(1).max(5),
  comment: z.string().optional(),
  payment_promptness: z.boolean().optional(),
  communication: z.boolean().optional(),
  reasonable_expectations: z.boolean().optional(),
})

type SubmitBuyerFeedbackResult = Envelope<
  { data: BuyerFeedback },
  { error: string }
>

function mapBuyerFeedbackRow(row: BuyerFeedbackRow): BuyerFeedback {
  return {
    id: row.id,
    seller_id: row.seller_id,
    buyer_id: row.buyer_id,
    order_id: row.order_id,
    rating: row.rating,
    comment: row.comment,
    payment_promptness: row.payment_promptness,
    communication: row.communication,
    reasonable_expectations: row.reasonable_expectations,
    seller_response: row.seller_response,
    seller_response_at: row.seller_response_at,
    created_at: row.created_at,
    updated_at: row.updated_at,
  }
}

// =====================================================
// SUBMIT BUYER FEEDBACK (Seller rates Buyer)
// =====================================================
export async function submitBuyerFeedback(
  input: BuyerFeedbackInput
): Promise<SubmitBuyerFeedbackResult> {
  const parsedInput = BuyerFeedbackInputSchema.safeParse(input)
  if (!parsedInput.success) {
    return errorEnvelope({ error: "Invalid input" })
  }

  const safeInput = parsedInput.data

  try {
    const auth = await requireAuth()
    if (!auth) {
      return errorEnvelope({ error: "Not authenticated" })
    }
    const { user, supabase } = auth

    // Verify user is a seller (has is_seller flag)
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id, username, is_seller")
      .eq("id", user.id)
      .single()

    if (profileError || !profile) {
      return errorEnvelope({ error: "Profile not found" })
    }

    if (!profile.is_seller) {
      return errorEnvelope({ error: "Only sellers can rate buyers" })
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
      .single<OrderItemForBuyerFeedback>()

    if (orderError || !orderItem) {
      return errorEnvelope({ error: "Order not found or you are not the seller" })
    }

    // Verify order is in a rateable state (delivered or completed)
    if (!["delivered", "completed", "shipped"].includes(orderItem.status || "")) {
      return errorEnvelope({ error: "Can only rate buyers for delivered or completed orders" })
    }

    // Verify buyer_id matches order user_id
    if (orderItem.order.user_id !== safeInput.buyer_id) {
      return errorEnvelope({ error: "Buyer ID does not match order" })
    }

    // Check if feedback already exists
    const { data: existing } = await supabase
      .from("buyer_feedback")
      .select("id")
      .eq("seller_id", user.id)
      .eq("order_id", safeInput.order_id)
      .maybeSingle()

    if (existing) {
      return errorEnvelope({ error: "You have already rated this buyer for this order" })
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
      .single<BuyerFeedbackRow>()

    if (error) {
      console.error("Error submitting buyer feedback:", error)
      return errorEnvelope({ error: "Failed to submit feedback" })
    }

    revalidateTag("buyer-stats", "max")
    revalidateTag("orders", "max")

    return successEnvelope({ data: mapBuyerFeedbackRow(data) })
  } catch (error) {
    console.error("submitBuyerFeedback error:", error)
    return errorEnvelope({ error: "An unexpected error occurred" })
  }
}
