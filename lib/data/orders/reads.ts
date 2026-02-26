import "server-only"

import type { SupabaseClient } from "@supabase/supabase-js"
import type { Database } from "@/lib/supabase/database.types"
import { ORDER_ITEM_DETAIL_SELECT, ORDER_ITEM_LIST_SELECT } from "@/lib/supabase/selects/orders"

type DbClient = SupabaseClient<Database>

export async function fetchBuyerOrderIds(params: {
  supabase: DbClient
  userId: string
}): Promise<{ ok: true; orderIds: string[] } | { ok: false; error: unknown }> {
  const { supabase, userId } = params

  const { data, error } = await supabase.from("orders").select("id").eq("user_id", userId)

  if (error) {
    return { ok: false, error }
  }

  const orderIds = (data ?? []).map((order) => order.id).filter(Boolean)
  return { ok: true, orderIds }
}

export async function fetchOrderItemsForOrderIds(params: {
  supabase: DbClient
  orderIds: string[]
  limit: number
}): Promise<{ ok: true; items: Array<Record<string, unknown>> } | { ok: false; error: unknown }> {
  const { supabase, orderIds, limit } = params

  const { data, error } = await supabase
    .from("order_items")
    .select(ORDER_ITEM_LIST_SELECT)
    .in("order_id", orderIds)
    .order("created_at", { ascending: false, foreignTable: "orders" })
    .limit(limit)

  if (error) {
    return { ok: false, error }
  }

  return { ok: true, items: (data ?? []) as Array<Record<string, unknown>> }
}

export async function fetchBuyerOrderDetails(params: {
  supabase: DbClient
  userId: string
  orderId: string
}): Promise<
  | {
      ok: true
      order: {
        id: string
        status: string | null
        total_amount: number
        shipping_address: Record<string, unknown> | null
        created_at: string
        order_items: Array<Record<string, unknown>>
      }
    }
  | { ok: false; error: unknown }
> {
  const { supabase, userId, orderId } = params

  const { data, error } = await supabase
    .from("orders")
    .select(`
        id,
        status,
        total_amount,
        shipping_address,
        created_at,
        order_items (
          ${ORDER_ITEM_DETAIL_SELECT}
        )
      `)
    .eq("id", orderId)
    .eq("user_id", userId)
    .single<{
      id: string
      status: string | null
      total_amount: number
      shipping_address: Record<string, unknown> | null
      created_at: string
      order_items: Array<Record<string, unknown>>
    }>()

  if (error || !data) {
    return { ok: false, error: error ?? new Error("Order not found") }
  }

  return { ok: true, order: data }
}

export async function fetchOrderConversationId(params: {
  supabase: DbClient
  orderId: string
  userId: string
}): Promise<{ ok: true; conversationId: string | null } | { ok: false; error: unknown }> {
  const { supabase, orderId, userId } = params

  const { data, error } = await supabase
    .from("conversations")
    .select("id")
    .eq("order_id", orderId)
    .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`)
    .single()

  if (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code?: unknown }).code === "PGRST116"
    ) {
      return { ok: true, conversationId: null }
    }

    return { ok: false, error }
  }

  return { ok: true, conversationId: data?.id ?? null }
}

export async function fetchSellerOrderItemsPage(params: {
  supabase: DbClient
  sellerId: string
  statusFilter: "all" | "active" | string | undefined
  offset: number
  to: number
}): Promise<
  | { ok: true; items: Array<Record<string, unknown>>; count: number }
  | { ok: false; error: unknown }
> {
  const { supabase, sellerId, statusFilter, offset, to } = params

  let query = supabase
    .from("order_items")
    .select(ORDER_ITEM_LIST_SELECT, { count: "exact" })
    .eq("seller_id", sellerId)
    .order("created_at", { ascending: false, foreignTable: "orders" })
    .range(offset, to)

  if (statusFilter === "active") {
    query = query.in("status", ["pending", "received", "processing", "shipped"])
  } else if (statusFilter && statusFilter !== "all") {
    query = query.eq("status", statusFilter)
  }

  const { data, error, count } = await query

  if (error) {
    return { ok: false, error }
  }

  return { ok: true, items: (data ?? []) as Array<Record<string, unknown>>, count: count ?? 0 }
}

export async function fetchProfilesByIds(params: {
  supabase: DbClient
  userIds: string[]
}): Promise<
  | { ok: true; profiles: Array<{ id: string; full_name: string | null; avatar_url: string | null }> }
  | { ok: false; error: unknown }
> {
  const { supabase, userIds } = params

  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, avatar_url")
    .in("id", userIds)

  if (error) {
    return { ok: false, error }
  }

  return {
    ok: true,
    profiles: (data ?? []).map((row) => ({
      id: row.id,
      full_name: row.full_name ?? null,
      avatar_url: row.avatar_url ?? null,
    })),
  }
}

export async function fetchSellerOrderItemStatuses(params: {
  supabase: DbClient
  sellerId: string
}): Promise<{ ok: true; statuses: Array<{ status: string | null }> } | { ok: false; error: unknown }> {
  const { supabase, sellerId } = params

  const { data, error } = await supabase
    .from("order_items")
    .select("status")
    .eq("seller_id", sellerId)

  if (error) {
    return { ok: false, error }
  }

  return { ok: true, statuses: (data ?? []) as Array<{ status: string | null }> }
}
