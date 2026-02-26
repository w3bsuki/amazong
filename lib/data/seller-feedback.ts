import "server-only"

import type { SupabaseClient } from "@supabase/supabase-js"
import type { Database } from "@/lib/supabase/database.types"

type DbClient = SupabaseClient<Database>

export async function hasDeliveredOrderItemForOrder(params: {
  supabase: DbClient
  orderId: string
  sellerId: string
  buyerId: string
}): Promise<{ ok: true; exists: boolean } | { ok: false; error: unknown }> {
  const { supabase, orderId, sellerId, buyerId } = params

  const { data, error } = await supabase
    .from("order_items")
    .select(
      `
          id,
          status,
          order:orders!inner(id, user_id)
        `
    )
    .eq("order_id", orderId)
    .eq("seller_id", sellerId)
    .eq("orders.user_id", buyerId)
    .eq("status", "delivered")
    .limit(1)
    .maybeSingle()

  if (error) {
    return { ok: false, error }
  }

  return { ok: true, exists: Boolean(data) }
}

export async function hasAnyDeliveredOrderItemForSeller(params: {
  supabase: DbClient
  sellerId: string
  buyerId: string
}): Promise<{ ok: true; exists: boolean } | { ok: false; error: unknown }> {
  const { supabase, sellerId, buyerId } = params

  const { data, error } = await supabase
    .from("order_items")
    .select(
      `
          id,
          status,
          orders!inner(id, user_id)
        `
    )
    .eq("seller_id", sellerId)
    .eq("orders.user_id", buyerId)
    .eq("status", "delivered")
    .limit(1)
    .maybeSingle()

  if (error) {
    return { ok: false, error }
  }

  return { ok: true, exists: Boolean(data) }
}

export async function hasExistingSellerFeedbackForOrder(params: {
  supabase: DbClient
  buyerId: string
  orderId: string
}): Promise<{ ok: true; exists: boolean } | { ok: false; error: unknown }> {
  const { supabase, buyerId, orderId } = params

  const { data, error } = await supabase
    .from("seller_feedback")
    .select("id")
    .eq("buyer_id", buyerId)
    .eq("order_id", orderId)
    .maybeSingle()

  if (error) {
    return { ok: false, error }
  }

  return { ok: true, exists: Boolean(data) }
}

export async function insertSellerFeedback(params: {
  supabase: DbClient
  buyerId: string
  sellerId: string
  orderId: string | null
  rating: number
  comment: string | null
  itemAsDescribed: boolean
  shippingSpeed: boolean
  communication: boolean
}): Promise<{ ok: true; feedbackId: string } | { ok: false; error: unknown }> {
  const { supabase, buyerId, sellerId, orderId, rating, comment, itemAsDescribed, shippingSpeed, communication } = params

  const { data, error } = await supabase
    .from("seller_feedback")
    .insert({
      buyer_id: buyerId,
      seller_id: sellerId,
      order_id: orderId,
      rating,
      comment,
      item_as_described: itemAsDescribed,
      shipping_speed: shippingSpeed,
      communication,
    })
    .select("id")
    .single()

  if (error || !data) {
    return { ok: false, error: error ?? new Error("Failed to insert feedback") }
  }

  return { ok: true, feedbackId: data.id as string }
}

export async function fetchSellerFeedbackStatsRows(params: {
  supabase: DbClient
  sellerId: string
}): Promise<
  | {
      ok: true
      rows: Array<{
        rating: number
        item_as_described: boolean
        shipping_speed: boolean
        communication: boolean
      }>
    }
  | { ok: false; error: unknown }
> {
  const { supabase, sellerId } = params

  const { data, error } = await supabase
    .from("seller_feedback")
    .select("rating, item_as_described, shipping_speed, communication")
    .eq("seller_id", sellerId)

  if (error) {
    return { ok: false, error }
  }

  return {
    ok: true,
    rows: (data ?? []) as Array<{
      rating: number
      item_as_described: boolean
      shipping_speed: boolean
      communication: boolean
    }>,
  }
}

export async function upsertSellerStats(params: {
  supabase: DbClient
  sellerId: string
  averageRating: number
  totalReviews: number
  positiveFeedbackPct: number
  itemDescribedPct: number
  shippingSpeedPct: number
  communicationPct: number
  updatedAt: string
}): Promise<{ ok: true } | { ok: false; error: unknown }> {
  const {
    supabase,
    sellerId,
    averageRating,
    totalReviews,
    positiveFeedbackPct,
    itemDescribedPct,
    shippingSpeedPct,
    communicationPct,
    updatedAt,
  } = params

  const { error } = await supabase.from("seller_stats").upsert(
    {
      seller_id: sellerId,
      average_rating: averageRating,
      total_reviews: totalReviews,
      positive_feedback_pct: positiveFeedbackPct,
      item_described_pct: itemDescribedPct,
      shipping_speed_pct: shippingSpeedPct,
      communication_pct: communicationPct,
      updated_at: updatedAt,
    },
    { onConflict: "seller_id" }
  )

  if (error) {
    return { ok: false, error }
  }

  return { ok: true }
}

export async function insertSellerFeedbackNotification(params: {
  adminSupabase: DbClient
  sellerId: string
  rating: number
  comment: string | null
  feedbackId: string
}): Promise<{ ok: true } | { ok: false; error: unknown }> {
  const { adminSupabase, sellerId, rating, comment, feedbackId } = params

  const title = `New ${rating}-star feedback`
  const body = comment
    ? `A buyer left ${rating}-star feedback: "${comment.slice(0, 100)}${comment.length > 100 ? "..." : ""}"`
    : `A buyer left ${rating}-star feedback`

  const { error } = await adminSupabase.from("notifications").insert({
    user_id: sellerId,
    type: "review",
    title,
    body,
    data: { rating, feedback_id: feedbackId },
  })

  if (error) {
    return { ok: false, error }
  }

  return { ok: true }
}

