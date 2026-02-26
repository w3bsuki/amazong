import "server-only"

import type { SupabaseClient } from "@supabase/supabase-js"
import type { Database } from "@/lib/supabase/database.types"

type DbClient = SupabaseClient<Database>

const ORDER_ITEM_RATING_SELECT = `
  id,
  status,
  seller_id,
  order_id,
  order:orders!inner(user_id)
` as const

type RatingOrderItemRow = {
  id: string
  status: string | null
  seller_id: string
  order_id: string
  order: { user_id: string }
}

export async function fetchRatingOrderItem(params: {
  supabase: DbClient
  orderItemId: string
  sellerId?: string
}): Promise<{ ok: true; item: RatingOrderItemRow | null } | { ok: false; error: unknown }> {
  const { supabase, orderItemId, sellerId } = params

  let query = supabase.from("order_items").select(ORDER_ITEM_RATING_SELECT).eq("id", orderItemId)
  if (sellerId) {
    query = query.eq("seller_id", sellerId)
  }

  const { data, error } = await query.maybeSingle<RatingOrderItemRow>()
  if (error) {
    return { ok: false, error }
  }

  return { ok: true, item: data ?? null }
}

export async function hasSellerFeedback(params: {
  supabase: DbClient
  buyerId: string
  sellerId: string
  orderId: string
}): Promise<{ ok: true; exists: boolean } | { ok: false; error: unknown }> {
  const { supabase, buyerId, sellerId, orderId } = params

  const { data, error } = await supabase
    .from("seller_feedback")
    .select("id")
    .eq("buyer_id", buyerId)
    .eq("seller_id", sellerId)
    .eq("order_id", orderId)
    .maybeSingle()

  if (error) {
    return { ok: false, error }
  }

  return { ok: true, exists: Boolean(data) }
}

export async function hasBuyerFeedback(params: {
  supabase: DbClient
  sellerId: string
  buyerId: string
  orderId: string
}): Promise<{ ok: true; exists: boolean } | { ok: false; error: unknown }> {
  const { supabase, sellerId, buyerId, orderId } = params

  const { data, error } = await supabase
    .from("buyer_feedback")
    .select("id")
    .eq("seller_id", sellerId)
    .eq("buyer_id", buyerId)
    .eq("order_id", orderId)
    .maybeSingle()

  if (error) {
    return { ok: false, error }
  }

  return { ok: true, exists: Boolean(data) }
}

