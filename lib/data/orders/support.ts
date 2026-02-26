import "server-only"

import type { SupabaseClient } from "@supabase/supabase-js"
import type { Database } from "@/lib/supabase/database.types"

type DbClient = SupabaseClient<Database>

export async function fetchOrderItemForCancellation(params: {
  supabase: DbClient
  orderItemId: string
}): Promise<
  | {
      ok: true
      item: {
        id: string
        status: string | null
        seller_id: string
        productTitle: string | null
        order: { id: string; user_id: string; status: string }
      }
    }
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
        product:products(title),
        order:orders!inner(id, user_id, status)
      `
    )
    .eq("id", orderItemId)
    .single<{
      id: string
      status: string | null
      seller_id: string
      product: { title: string } | null
      order: { id: string; user_id: string; status: string }
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
      productTitle: data.product?.title ?? null,
      order: data.order,
    },
  }
}

export async function cancelOrderItem(params: {
  supabase: DbClient
  orderItemId: string
}): Promise<{ ok: true } | { ok: false; error: unknown }> {
  const { supabase, orderItemId } = params

  const { error } = await supabase
    .from("order_items")
    .update({ status: "cancelled" })
    .eq("id", orderItemId)

  if (error) {
    return { ok: false, error }
  }

  return { ok: true }
}

export async function insertCancellationNotification(params: {
  adminSupabase: DbClient
  sellerId: string
  orderId: string
  orderItemId: string
  reason?: string
}): Promise<{ ok: true } | { ok: false; error: unknown }> {
  const { adminSupabase, sellerId, orderId, orderItemId, reason } = params

  const body = reason ? `A buyer has cancelled their order: ${reason}` : "A buyer has cancelled their order"

  const { error } = await adminSupabase.from("notifications").insert({
    user_id: sellerId,
    type: "order_status",
    title: "Order Cancellation Request",
    body,
    data: {
      order_item_id: orderItemId,
      order_id: orderId,
      reason,
    },
    order_id: orderId,
  })

  if (error) {
    return { ok: false, error }
  }

  return { ok: true }
}

export async function fetchOrderItemForReturn(params: {
  supabase: DbClient
  orderItemId: string
}): Promise<
  | { ok: true; item: { id: string; status: string | null; seller_id: string; order: { id: string; user_id: string } } }
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
          order:orders!inner(id, user_id)
        `
    )
    .eq("id", orderItemId)
    .single<{
      id: string
      status: string | null
      seller_id: string
      order: { id: string; user_id: string }
    }>()

  if (error || !data) {
    return { ok: false, error: error ?? new Error("Order item not found") }
  }

  return { ok: true, item: data }
}

export async function hasActiveReturnRequest(params: {
  supabase: DbClient
  orderItemId: string
  buyerId: string
}): Promise<{ ok: true; exists: boolean } | { ok: false; error: unknown }> {
  const { supabase, orderItemId, buyerId } = params

  const { data, error } = await supabase
    .from("return_requests")
    .select("id,status")
    .eq("order_item_id", orderItemId)
    .eq("buyer_id", buyerId)
    .neq("status", "cancelled")
    .limit(1)

  if (error) {
    return { ok: false, error }
  }

  return { ok: true, exists: Boolean(data?.[0]?.id) }
}

export async function createReturnRequest(params: {
  supabase: DbClient
  orderItemId: string
  orderId: string
  buyerId: string
  sellerId: string
  reason: string
}): Promise<{ ok: true } | { ok: false; error: unknown }> {
  const { supabase, orderItemId, orderId, buyerId, sellerId, reason } = params

  const { error } = await supabase.from("return_requests").insert({
    order_item_id: orderItemId,
    order_id: orderId,
    buyer_id: buyerId,
    seller_id: sellerId,
    reason,
    status: "requested",
  })

  if (error) {
    return { ok: false, error }
  }

  return { ok: true }
}

export async function fetchOrderItemForIssueReport(params: {
  supabase: DbClient
  orderItemId: string
}): Promise<
  | {
      ok: true
      item: {
        id: string
        status: string | null
        seller_id: string
        product: { id: string; title: string } | null
        order: { id: string; user_id: string }
      }
    }
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
        product:products(id, title),
        order:orders!inner(id, user_id)
      `
    )
    .eq("id", orderItemId)
    .single<{
      id: string
      status: string | null
      seller_id: string
      product: { id: string; title: string } | null
      order: { id: string; user_id: string }
    }>()

  if (error || !data) {
    return { ok: false, error: error ?? new Error("Order item not found") }
  }

  return { ok: true, item: data }
}

export async function findConversationForOrder(params: {
  supabase: DbClient
  buyerId: string
  sellerId: string
  orderId: string
}): Promise<{ ok: true; conversationId: string | null } | { ok: false; error: unknown }> {
  const { supabase, buyerId, sellerId, orderId } = params

  const { data, error } = await supabase
    .from("conversations")
    .select("id")
    .eq("buyer_id", buyerId)
    .eq("seller_id", sellerId)
    .eq("order_id", orderId)
    .maybeSingle()

  if (error) {
    return { ok: false, error }
  }

  return { ok: true, conversationId: data?.id ?? null }
}

export async function createConversation(params: {
  supabase: DbClient
  buyerId: string
  sellerId: string
  productId: string | null
  orderId: string
  subject: string
  now: string
}): Promise<{ ok: true; conversationId: string } | { ok: false; error: unknown }> {
  const { supabase, buyerId, sellerId, productId, orderId, subject, now } = params

  const { data, error } = await supabase
    .from("conversations")
    .insert({
      buyer_id: buyerId,
      seller_id: sellerId,
      product_id: productId,
      order_id: orderId,
      subject,
      status: "open",
      last_message_at: now,
      seller_unread_count: 1,
    })
    .select("id")
    .single()

  if (error || !data) {
    return { ok: false, error: error ?? new Error("Failed to create conversation") }
  }

  return { ok: true, conversationId: data.id as string }
}

export async function createMessage(params: {
  supabase: DbClient
  conversationId: string
  senderId: string
  content: string
}): Promise<{ ok: true } | { ok: false; error: unknown }> {
  const { supabase, conversationId, senderId, content } = params

  const { error } = await supabase.from("messages").insert({
    conversation_id: conversationId,
    sender_id: senderId,
    content,
    message_type: "text",
  })

  if (error) {
    return { ok: false, error }
  }

  return { ok: true }
}

export async function updateConversationAfterMessage(params: {
  supabase: DbClient
  conversationId: string
  now: string
}): Promise<{ ok: true } | { ok: false; error: unknown }> {
  const { supabase, conversationId, now } = params

  const { error } = await supabase
    .from("conversations")
    .update({
      last_message_at: now,
      seller_unread_count: 1,
      status: "open",
    })
    .eq("id", conversationId)

  if (error) {
    return { ok: false, error }
  }

  return { ok: true }
}

export async function insertIssueReportNotification(params: {
  adminSupabase: DbClient
  sellerId: string
  orderId: string
  orderItemId: string
  issueType: string
  conversationId: string
  title: string
}): Promise<{ ok: true } | { ok: false; error: unknown }> {
  const { adminSupabase, sellerId, orderId, orderItemId, issueType, conversationId, title } = params

  const { error } = await adminSupabase.from("notifications").insert({
    user_id: sellerId,
    type: "message",
    title,
    body: "A buyer has reported an issue with their order",
    data: {
      order_item_id: orderItemId,
      order_id: orderId,
      issue_type: issueType,
      conversation_id: conversationId,
    },
    order_id: orderId,
    conversation_id: conversationId,
  })

  if (error) {
    return { ok: false, error }
  }

  return { ok: true }
}

