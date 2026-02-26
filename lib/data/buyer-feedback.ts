import "server-only"

import type { SupabaseClient } from "@supabase/supabase-js"
import type { Database } from "@/lib/supabase/database.types"

type DbClient = SupabaseClient<Database>

export type BuyerFeedbackRow = Database["public"]["Tables"]["buyer_feedback"]["Row"]

export type OrderItemForBuyerFeedback = {
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

export async function fetchSellerProfileForBuyerFeedback(params: {
  supabase: DbClient
  sellerId: string
}): Promise<
  | { ok: true; profile: { id: string; username: string | null; is_seller: boolean | null } }
  | { ok: false; error: unknown }
> {
  const { supabase, sellerId } = params

  const { data, error } = await supabase
    .from("profiles")
    .select("id, username, is_seller")
    .eq("id", sellerId)
    .single()

  if (error || !data) {
    return { ok: false, error: error ?? new Error("Profile not found") }
  }

  return { ok: true, profile: data }
}

export async function fetchOrderItemForBuyerFeedback(params: {
  supabase: DbClient
  orderId: string
  sellerId: string
}): Promise<
  | { ok: true; orderItem: OrderItemForBuyerFeedback }
  | { ok: false; error: unknown }
> {
  const { supabase, orderId, sellerId } = params

  const { data, error } = await supabase
    .from("order_items")
    .select(
      `
        id,
        order_id,
        seller_id,
        status,
        order:orders!inner(
          id,
          user_id,
          status
        )
      `
    )
    .eq("order_id", orderId)
    .eq("seller_id", sellerId)
    .single<OrderItemForBuyerFeedback>()

  if (error || !data) {
    return { ok: false, error: error ?? new Error("Order not found") }
  }

  return { ok: true, orderItem: data }
}

export async function hasExistingBuyerFeedback(params: {
  supabase: DbClient
  sellerId: string
  orderId: string
}): Promise<{ ok: true; exists: boolean } | { ok: false; error: unknown }> {
  const { supabase, sellerId, orderId } = params

  const { data, error } = await supabase
    .from("buyer_feedback")
    .select("id")
    .eq("seller_id", sellerId)
    .eq("order_id", orderId)
    .maybeSingle()

  if (error) {
    return { ok: false, error }
  }

  return { ok: true, exists: Boolean(data) }
}

export async function insertBuyerFeedback(params: {
  supabase: DbClient
  sellerId: string
  buyerId: string
  orderId: string
  rating: number
  comment: string | null
  paymentPromptness: boolean | null
  communication: boolean | null
  reasonableExpectations: boolean | null
}): Promise<{ ok: true; row: BuyerFeedbackRow } | { ok: false; error: unknown }> {
  const {
    supabase,
    sellerId,
    buyerId,
    orderId,
    rating,
    comment,
    paymentPromptness,
    communication,
    reasonableExpectations,
  } = params

  const { data, error } = await supabase
    .from("buyer_feedback")
    .insert({
      seller_id: sellerId,
      buyer_id: buyerId,
      order_id: orderId,
      rating,
      comment,
      payment_promptness: paymentPromptness,
      communication,
      reasonable_expectations: reasonableExpectations,
    })
    .select(
      "id, seller_id, buyer_id, order_id, rating, comment, payment_promptness, communication, reasonable_expectations, seller_response, seller_response_at, created_at, updated_at"
    )
    .single<BuyerFeedbackRow>()

  if (error || !data) {
    return { ok: false, error: error ?? new Error("Failed to insert feedback") }
  }

  return { ok: true, row: data }
}

