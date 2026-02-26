import "server-only"

import type { SupabaseClient } from "@supabase/supabase-js"
import type { Database } from "@/lib/supabase/database.types"

type DbClient = SupabaseClient<Database>

export async function fetchSellerOrderItemStatusRow(params: {
  supabase: DbClient
  orderItemId: string
  sellerId: string
}): Promise<
  | {
      ok: true
      item: {
        id: string
        seller_id: string
        seller_received_at: string | null
        shipped_at: string | null
        delivered_at: string | null
      }
    }
  | { ok: false; error: unknown }
> {
  const { supabase, orderItemId, sellerId } = params

  const { data, error } = await supabase
    .from("order_items")
    .select("id, seller_id, seller_received_at, shipped_at, delivered_at")
    .eq("id", orderItemId)
    .eq("seller_id", sellerId)
    .single()

  if (error || !data) {
    return { ok: false, error: error ?? new Error("Order item not found") }
  }

  return {
    ok: true,
    item: {
      id: data.id,
      seller_id: data.seller_id,
      seller_received_at: data.seller_received_at ?? null,
      shipped_at: data.shipped_at ?? null,
      delivered_at: data.delivered_at ?? null,
    },
  }
}

export async function updateSellerOrderItem(params: {
  supabase: DbClient
  orderItemId: string
  sellerId: string
  updateData: Record<string, unknown>
}): Promise<{ ok: true } | { ok: false; error: unknown }> {
  const { supabase, orderItemId, sellerId, updateData } = params

  const { error } = await supabase
    .from("order_items")
    .update(updateData)
    .eq("id", orderItemId)
    .eq("seller_id", sellerId)

  if (error) {
    return { ok: false, error }
  }

  return { ok: true }
}

export async function fetchOrderItemWithBuyer(params: {
  supabase: DbClient
  orderItemId: string
}): Promise<
  | { ok: true; item: { id: string; status: string; seller_id: string; buyer_id: string } }
  | { ok: false; error: unknown }
> {
  const { supabase, orderItemId } = params

  const { data, error } = await supabase
    .from("order_items")
    .select(
      `
        id,
        status,
        seller_id,
        order:orders!inner(user_id)
      `
    )
    .eq("id", orderItemId)
    .single<{
      id: string
      status: string
      seller_id: string
      order: { user_id: string }
    }>()

  if (error || !data) {
    return { ok: false, error: error ?? new Error("Order item not found") }
  }

  return {
    ok: true,
    item: {
      id: data.id,
      status: data.status,
      seller_id: data.seller_id,
      buyer_id: data.order.user_id,
    },
  }
}

export async function markOrderItemDelivered(params: {
  supabase: DbClient
  orderItemId: string
  deliveredAt: string
}): Promise<{ ok: true } | { ok: false; error: unknown }> {
  const { supabase, orderItemId, deliveredAt } = params

  const { error } = await supabase
    .from("order_items")
    .update({
      status: "delivered",
      delivered_at: deliveredAt,
    })
    .eq("id", orderItemId)

  if (error) {
    return { ok: false, error }
  }

  return { ok: true }
}

