import { createAdminClient } from "@/lib/supabase/server"
import { revalidateTag } from "next/cache"
import type { IssueType } from "./orders-shared"
import {
  ReportOrderIssueInputSchema,
  requireSupportContext,
  supportFailure,
  type OrdersSupportResult,
} from "./orders-support-shared"

import { logger } from "@/lib/logger"
export async function reportOrderIssueImpl(
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
    const context = await requireSupportContext(parsedInput.data.orderItemId)
    if (!context.success) {
      return context
    }
    const { userId, supabase, orderItemId: parsedOrderItemId } = context

    if (!parsedInput.data.description || parsedInput.data.description.trim().length < 10) {
      return supportFailure(
        "validation_failed",
        "Please provide a detailed description (minimum 10 characters)"
      )
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
      .eq("id", parsedOrderItemId)
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

    if (orderItem.order.user_id !== userId) {
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
      .eq("buyer_id", userId)
      .eq("seller_id", orderItem.seller_id)
      .eq("order_id", orderItem.order.id)
      .single()

    let conversationId = existingConversation?.id

    if (!conversationId) {
      const { data: newConversation, error: convError } = await supabase
        .from("conversations")
        .insert({
          buyer_id: userId,
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
      sender_id: userId,
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
          order_item_id: parsedOrderItemId,
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
          orderItemId: parsedOrderItemId,
          orderId: orderItem.order.id,
        })
      }
    } catch (error) {
      logger.error("[orders-support] issue_report_notification_unexpected", error, {
        conversationId,
        orderItemId: parsedOrderItemId,
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
