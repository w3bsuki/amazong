"use server"

import { z } from "zod"
import { createAdminClient } from "@/lib/supabase/server"
import { requireAuth } from "@/lib/auth/require-auth"
import { logger } from "@/lib/logger"
import { revalidateTag } from "next/cache"
import type { IssueType } from "./orders-shared"

const OrderItemIdSchema = z.string().uuid()
const IssueTypeSchema = z.enum([
  "not_received",
  "wrong_item",
  "damaged",
  "not_as_described",
  "missing_parts",
  "other",
])
const ReportOrderIssueInputSchema = z.object({
  orderItemId: OrderItemIdSchema,
  issueType: IssueTypeSchema,
  description: z.string(),
})

type OrdersSupportErrorCode =
  | "invalid_input"
  | "not_authenticated"
  | "not_found"
  | "not_authorized"
  | "invalid_status"
  | "already_exists"
  | "validation_failed"
  | "create_failed"
  | "update_failed"
  | "unexpected"

type OrdersSupportFailure = {
  success: false
  error: string
  code: OrdersSupportErrorCode
}

type OrdersSupportSuccess = {
  success: true
  conversationId?: string
}

type OrdersSupportResult = OrdersSupportSuccess | OrdersSupportFailure

function supportFailure(
  code: OrdersSupportErrorCode,
  error: string
): OrdersSupportFailure {
  return { success: false, error, code }
}

/**
 * Request a return for an order item (buyer only)
 */
export async function requestReturn(
  orderItemId: string,
  reason: string
): Promise<OrdersSupportResult> {
  const parsedOrderItemId = OrderItemIdSchema.safeParse(orderItemId)
  if (!parsedOrderItemId.success) return supportFailure("invalid_input", "Invalid orderItemId")

  try {
    const auth = await requireAuth()
    if (!auth) {
      return supportFailure("not_authenticated", "Not authenticated")
    }
    const { user, supabase } = auth

    const normalizedReason = (reason ?? "").trim()
    if (normalizedReason.length < 3) {
      return supportFailure("validation_failed", "Please provide a reason")
    }

    const { data: orderItem, error: fetchError } = await supabase
      .from("order_items")
      .select(`
          id,
          status,
          seller_id,
          order:orders!inner(id, user_id)
        `)
      .eq("id", parsedOrderItemId.data)
      .single<{
        id: string
        status: string | null
        seller_id: string
        order: { id: string; user_id: string }
      }>()

    if (fetchError || !orderItem) {
      return supportFailure("not_found", "Order item not found")
    }

    if (orderItem.order.user_id !== user.id) {
      return supportFailure("not_authorized", "Not authorized to request a return for this order")
    }

    if (orderItem.status !== "delivered") {
      return supportFailure("invalid_status", "Return requests are available after delivery")
    }

    const { data: existingRequests, error: existingError } = await supabase
      .from("return_requests")
      .select("id,status")
      .eq("order_item_id", parsedOrderItemId.data)
      .eq("buyer_id", user.id)
      .neq("status", "cancelled")
      .limit(1)

    const existingRequest = existingRequests?.[0] ?? null

    if (existingError) {
      logger.error("[orders-support] return_request_lookup_failed", existingError, {
        orderItemId: parsedOrderItemId.data,
        buyerId: user.id,
      })
      return supportFailure("create_failed", "Failed to submit return request")
    }

    if (existingRequest?.id) {
      return supportFailure("already_exists", "Return request already submitted")
    }

    const { error: insertError } = await supabase.from("return_requests").insert({
      order_item_id: parsedOrderItemId.data,
      order_id: orderItem.order.id,
      buyer_id: user.id,
      seller_id: orderItem.seller_id,
      reason: normalizedReason,
      status: "requested",
    })

    if (insertError) {
      logger.error("[orders-support] return_request_create_failed", insertError, {
        orderItemId: parsedOrderItemId.data,
        buyerId: user.id,
      })
      return supportFailure("create_failed", "Failed to submit return request")
    }

    revalidateTag("orders", "max")
    revalidateTag("messages", "max")
    revalidateTag("conversations", "max")

    return { success: true }
  } catch (error) {
    logger.error("[orders-support] request_return_unexpected", error, {
      orderItemId: parsedOrderItemId.data,
    })
    return supportFailure("unexpected", "An unexpected error occurred")
  }
}

/**
 * Request cancellation of an order item (buyer only)
 */
export async function requestOrderCancellation(
  orderItemId: string,
  reason?: string
): Promise<OrdersSupportResult> {
  const parsedOrderItemId = OrderItemIdSchema.safeParse(orderItemId)
  if (!parsedOrderItemId.success) return supportFailure("invalid_input", "Invalid orderItemId")

  try {
    const auth = await requireAuth()
    if (!auth) {
      return supportFailure("not_authenticated", "Not authenticated")
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
      .eq("id", parsedOrderItemId.data)
      .single<{
        id: string
        status: string | null
        seller_id: string
        product: { title: string } | null
        order: { id: string; user_id: string; status: string }
      }>()

    if (fetchError || !orderItem) {
      return supportFailure("not_found", "Order item not found")
    }

    if (orderItem.order.user_id !== user.id) {
      return supportFailure("not_authorized", "Not authorized to cancel this order")
    }

    const nonCancellableStatuses = ["shipped", "delivered"]
    const currentStatus = orderItem.status || "pending"
    if (nonCancellableStatuses.includes(currentStatus)) {
      return {
        success: false,
        code: "invalid_status",
        error:
          currentStatus === "shipped"
            ? "Cannot cancel - item has already been shipped"
            : "Cannot cancel - item has already been delivered",
      }
    }

    if (currentStatus === "cancelled") {
      return supportFailure("already_exists", "This item has already been cancelled")
    }

    const { error: updateError } = await supabase
      .from("order_items")
      .update({
        status: "cancelled",
      })
      .eq("id", parsedOrderItemId.data)

    if (updateError) {
      logger.error("[orders-support] order_cancellation_update_failed", updateError, {
        orderItemId: parsedOrderItemId.data,
        buyerId: user.id,
      })
      return supportFailure("update_failed", "Failed to cancel order")
    }

    try {
      const admin = createAdminClient()
      const cancellationBody = reason
        ? `A buyer has cancelled their order: ${reason}`
        : "A buyer has cancelled their order"
      const { error: notifyError } = await admin.from("notifications").insert({
        user_id: orderItem.seller_id,
        type: "order_status",
        title: "Order Cancellation Request",
        body: cancellationBody,
        data: {
          order_item_id: parsedOrderItemId.data,
          order_id: orderItem.order.id,
          reason,
        },
        order_id: orderItem.order.id,
      })

      if (notifyError) {
        logger.error("[orders-support] cancellation_notification_failed", notifyError, {
          orderItemId: parsedOrderItemId.data,
          orderId: orderItem.order.id,
        })
      }
    } catch (error) {
      logger.error("[orders-support] cancellation_notification_unexpected", error, {
        orderItemId: parsedOrderItemId.data,
        orderId: orderItem.order.id,
      })
    }

    revalidateTag("orders", "max")

    return { success: true }
  } catch (error) {
    logger.error("[orders-support] request_order_cancellation_unexpected", error, {
      orderItemId: parsedOrderItemId.data,
    })
    return supportFailure("unexpected", "An unexpected error occurred")
  }
}

/**
 * Report an issue with an order item (buyer only)
 */
export async function reportOrderIssue(
  orderItemId: string,
  issueType: IssueType,
  description: string
): Promise<OrdersSupportResult> {
  const parsedInput = ReportOrderIssueInputSchema.safeParse({
    orderItemId,
    issueType,
    description,
  })
  if (!parsedInput.success) {
    return supportFailure("invalid_input", "Invalid input")
  }

  try {
    const auth = await requireAuth()
    if (!auth) {
      return supportFailure("not_authenticated", "Not authenticated")
    }
    const { user, supabase } = auth

    if (!parsedInput.data.description || parsedInput.data.description.trim().length < 10) {
      return supportFailure("validation_failed", "Please provide a detailed description (minimum 10 characters)")
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
      .eq("id", parsedInput.data.orderItemId)
      .single<{
        id: string
        status: string | null
        seller_id: string
        product: { id: string; title: string } | null
        order: { id: string; user_id: string }
      }>()

    if (fetchError || !orderItem) {
      return supportFailure("not_found", "Order item not found")
    }

    if (orderItem.order.user_id !== user.id) {
      return supportFailure("not_authorized", "Not authorized to report issues for this order")
    }

    const issueSubjects: Record<IssueType, string> = {
      not_received: "Item Not Received",
      wrong_item: "Wrong Item Received",
      damaged: "Item Damaged",
      not_as_described: "Item Not As Described",
      missing_parts: "Missing Parts",
      other: "Order Issue",
    }

    const productTitleSuffix = orderItem.product?.title ? ` - ${orderItem.product.title}` : ""
    const subject = `${issueSubjects[parsedInput.data.issueType]}${productTitleSuffix}`

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
        logger.error("[orders-support] issue_report_conversation_create_failed", convError, {
          orderItemId: parsedInput.data.orderItemId,
          orderId: orderItem.order.id,
          sellerId: orderItem.seller_id,
        })
        return supportFailure("create_failed", "Failed to create conversation")
      }

      conversationId = newConversation.id
    }

    const messageContent = `⚠️ **Issue Report: ${issueSubjects[parsedInput.data.issueType]}**\n\n${parsedInput.data.description}`

    const { error: messageError } = await supabase.from("messages").insert({
      conversation_id: conversationId,
      sender_id: user.id,
      content: messageContent,
      message_type: "text",
    })

    if (messageError) {
      logger.error("[orders-support] issue_report_message_create_failed", messageError, {
        conversationId,
        orderItemId: parsedInput.data.orderItemId,
      })
      return supportFailure("create_failed", "Failed to send issue report")
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
        title: `Issue Report: ${issueSubjects[parsedInput.data.issueType]}`,
        body: "A buyer has reported an issue with their order",
        data: {
          order_item_id: parsedInput.data.orderItemId,
          order_id: orderItem.order.id,
          issue_type: parsedInput.data.issueType,
          conversation_id: conversationId,
        },
        order_id: orderItem.order.id,
        conversation_id: conversationId,
      })

      if (notifyError) {
        logger.error("[orders-support] issue_report_notification_failed", notifyError, {
          conversationId,
          orderItemId: parsedInput.data.orderItemId,
          orderId: orderItem.order.id,
        })
      }
    } catch (error) {
      logger.error("[orders-support] issue_report_notification_unexpected", error, {
        conversationId,
        orderItemId: parsedInput.data.orderItemId,
        orderId: orderItem.order.id,
      })
    }

    revalidateTag("orders", "max")
    revalidateTag("messages", "max")
    revalidateTag("conversations", "max")

    return { success: true, conversationId }
  } catch (error) {
    logger.error("[orders-support] report_order_issue_unexpected", error, {
      orderItemId: parsedInput.data.orderItemId,
      issueType: parsedInput.data.issueType,
    })
    return supportFailure("unexpected", "An unexpected error occurred")
  }
}
