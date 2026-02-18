"use server"

import { createAdminClient } from "@/lib/supabase/server"
import { requireAuth } from "@/lib/auth/require-auth"
import { revalidateTag } from "next/cache"
import type { IssueType } from "./orders-shared"

/**
 * Request a return for an order item (buyer only)
 */
export async function requestReturn(
  orderItemId: string,
  reason: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const auth = await requireAuth()
    if (!auth) {
      return { success: false, error: "Not authenticated" }
    }
    const { user, supabase } = auth

    const normalizedReason = (reason ?? "").trim()
    if (normalizedReason.length < 3) {
      return { success: false, error: "Please provide a reason" }
    }

    const { data: orderItem, error: fetchError } = await supabase
      .from("order_items")
      .select(`
          id,
          status,
          seller_id,
          order:orders!inner(id, user_id)
        `)
      .eq("id", orderItemId)
      .single<{
        id: string
        status: string | null
        seller_id: string
        order: { id: string; user_id: string }
      }>()

    if (fetchError || !orderItem) {
      return { success: false, error: "Order item not found" }
    }

    if (orderItem.order.user_id !== user.id) {
      return { success: false, error: "Not authorized to request a return for this order" }
    }

    if (orderItem.status !== "delivered") {
      return { success: false, error: "Return requests are available after delivery" }
    }

    const { data: existingRequests, error: existingError } = await supabase
      .from("return_requests")
      .select("id,status")
      .eq("order_item_id", orderItemId)
      .eq("buyer_id", user.id)
      .neq("status", "cancelled")
      .limit(1)

    const existingRequest = existingRequests?.[0] ?? null

    if (existingError) {
      console.error("Error checking return requests:", existingError)
      return { success: false, error: "Failed to submit return request" }
    }

    if (existingRequest?.id) {
      return { success: false, error: "Return request already submitted" }
    }

    const { error: insertError } = await supabase.from("return_requests").insert({
      order_item_id: orderItemId,
      order_id: orderItem.order.id,
      buyer_id: user.id,
      seller_id: orderItem.seller_id,
      reason: normalizedReason,
      status: "requested",
    })

    if (insertError) {
      console.error("Error creating return request:", insertError)
      return { success: false, error: "Failed to submit return request" }
    }

    revalidateTag("orders", "max")
    revalidateTag("messages", "max")
    revalidateTag("conversations", "max")

    return { success: true }
  } catch (error) {
    console.error("Error in requestReturn:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

/**
 * Request cancellation of an order item (buyer only)
 */
export async function requestOrderCancellation(
  orderItemId: string,
  reason?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const auth = await requireAuth()
    if (!auth) {
      return { success: false, error: "Not authenticated" }
    }
    const { user, supabase } = auth

    const { data: orderItem, error: fetchError } = await supabase
      .from("order_items")
      .select(`
        id,
        status,
        seller_id,
        product:products(title),
        order:orders!inner(id, user_id, status)
      `)
      .eq("id", orderItemId)
      .single<{
        id: string
        status: string | null
        seller_id: string
        product: { title: string } | null
        order: { id: string; user_id: string; status: string }
      }>()

    if (fetchError || !orderItem) {
      return { success: false, error: "Order item not found" }
    }

    if (orderItem.order.user_id !== user.id) {
      return { success: false, error: "Not authorized to cancel this order" }
    }

    const nonCancellableStatuses = ["shipped", "delivered"]
    const currentStatus = orderItem.status || "pending"
    if (nonCancellableStatuses.includes(currentStatus)) {
      return {
        success: false,
        error:
          currentStatus === "shipped"
            ? "Cannot cancel - item has already been shipped"
            : "Cannot cancel - item has already been delivered",
      }
    }

    if (currentStatus === "cancelled") {
      return { success: false, error: "This item has already been cancelled" }
    }

    const { error: updateError } = await supabase
      .from("order_items")
      .update({
        status: "cancelled",
      })
      .eq("id", orderItemId)

    if (updateError) {
      console.error("Error cancelling order item:", updateError)
      return { success: false, error: "Failed to cancel order" }
    }

    try {
      const admin = createAdminClient()
      const { error: notifyError } = await admin.from("notifications").insert({
        user_id: orderItem.seller_id,
        type: "order_status",
        title: "Order Cancellation Request",
        body: `A buyer has cancelled their order${reason ? `: ${reason}` : ""}`,
        data: {
          order_item_id: orderItemId,
          order_id: orderItem.order.id,
          reason,
        },
        order_id: orderItem.order.id,
      })

      if (notifyError) {
        console.error("Error creating cancellation notification:", notifyError)
      }
    } catch (error) {
      console.error("Error creating cancellation notification:", error)
    }

    revalidateTag("orders", "max")

    return { success: true }
  } catch (error) {
    console.error("Error in requestOrderCancellation:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

/**
 * Report an issue with an order item (buyer only)
 */
export async function reportOrderIssue(
  orderItemId: string,
  issueType: IssueType,
  description: string
): Promise<{ success: boolean; error?: string; conversationId?: string }> {
  try {
    const auth = await requireAuth()
    if (!auth) {
      return { success: false, error: "Not authenticated" }
    }
    const { user, supabase } = auth

    if (!description || description.trim().length < 10) {
      return { success: false, error: "Please provide a detailed description (minimum 10 characters)" }
    }

    const { data: orderItem, error: fetchError } = await supabase
      .from("order_items")
      .select(`
        id,
        status,
        seller_id,
        product:products(id, title),
        order:orders!inner(id, user_id)
      `)
      .eq("id", orderItemId)
      .single<{
        id: string
        status: string | null
        seller_id: string
        product: { id: string; title: string } | null
        order: { id: string; user_id: string }
      }>()

    if (fetchError || !orderItem) {
      return { success: false, error: "Order item not found" }
    }

    if (orderItem.order.user_id !== user.id) {
      return { success: false, error: "Not authorized to report issues for this order" }
    }

    const issueSubjects: Record<IssueType, string> = {
      not_received: "Item Not Received",
      wrong_item: "Wrong Item Received",
      damaged: "Item Damaged",
      not_as_described: "Item Not As Described",
      missing_parts: "Missing Parts",
      other: "Order Issue",
    }

    const subject = `${issueSubjects[issueType]}${orderItem.product?.title ? ` - ${orderItem.product.title}` : ""}`

    const { data: existingConversation } = await supabase
      .from("conversations")
      .select("id")
      .eq("buyer_id", user.id)
      .eq("seller_id", orderItem.seller_id)
      .eq("order_id", orderItem.order.id)
      .single()

    let conversationId = existingConversation?.id

    if (!conversationId) {
      const { data: newConversation, error: convError } = await supabase
        .from("conversations")
        .insert({
          buyer_id: user.id,
          seller_id: orderItem.seller_id,
          product_id: orderItem.product?.id ?? null,
          order_id: orderItem.order.id,
          subject,
          status: "open",
          last_message_at: new Date().toISOString(),
          seller_unread_count: 1,
        })
        .select("id")
        .single()

      if (convError || !newConversation) {
        console.error("Error creating conversation:", convError)
        return { success: false, error: "Failed to create conversation" }
      }

      conversationId = newConversation.id
    }

    const messageContent = `⚠️ **Issue Report: ${issueSubjects[issueType]}**\n\n${description}`

    const { error: messageError } = await supabase.from("messages").insert({
      conversation_id: conversationId,
      sender_id: user.id,
      content: messageContent,
      message_type: "text",
    })

    if (messageError) {
      console.error("Error creating message:", messageError)
      return { success: false, error: "Failed to send issue report" }
    }

    await supabase
      .from("conversations")
      .update({
        last_message_at: new Date().toISOString(),
        seller_unread_count: 1,
        status: "open",
      })
      .eq("id", conversationId)

    try {
      const admin = createAdminClient()
      const { error: notifyError } = await admin.from("notifications").insert({
        user_id: orderItem.seller_id,
        type: "message",
        title: `Issue Report: ${issueSubjects[issueType]}`,
        body: "A buyer has reported an issue with their order",
        data: {
          order_item_id: orderItemId,
          order_id: orderItem.order.id,
          issue_type: issueType,
          conversation_id: conversationId,
        },
        order_id: orderItem.order.id,
        conversation_id: conversationId,
      })

      if (notifyError) {
        console.error("Error creating issue report notification:", notifyError)
      }
    } catch (error) {
      console.error("Error creating issue report notification:", error)
    }

    revalidateTag("orders", "max")
    revalidateTag("messages", "max")
    revalidateTag("conversations", "max")

    return { success: true, conversationId }
  } catch (error) {
    console.error("Error in reportOrderIssue:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

