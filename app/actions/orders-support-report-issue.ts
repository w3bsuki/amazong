import { createAdminClient } from "@/lib/supabase/server"
import { revalidateTag } from "next/cache"
import type { IssueType } from "@/lib/types/orders"
import {
  createConversation,
  createMessage,
  fetchOrderItemForIssueReport,
  findConversationForOrder,
  insertIssueReportNotification,
  updateConversationAfterMessage,
} from "@/lib/data/orders/support"
import {
  ReportOrderIssueInputSchema,
  requireSupportContext,
  supportFailure,
  supportSuccess,
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

    const orderItemResult = await fetchOrderItemForIssueReport({ supabase, orderItemId: parsedOrderItemId })

    if (!orderItemResult.ok) {
      return supportFailure("not_found", "Order item not found")
    }

    const orderItem = orderItemResult.item

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

    const now = new Date().toISOString()

    const conversationLookup = await findConversationForOrder({
      supabase,
      buyerId: userId,
      sellerId: orderItem.seller_id,
      orderId: orderItem.order.id,
    })

    if (!conversationLookup.ok) {
      logger.error("[orders-support] issue_report_conversation_lookup_failed", conversationLookup.error, {
        orderItemId: parsedInput.data.orderItemId,
        orderId: orderItem.order.id,
        sellerId: orderItem.seller_id,
      })
      return supportFailure("create_failed", "Failed to create conversation")
    }

    let conversationId = conversationLookup.conversationId

    if (!conversationId) {
      const conversationCreate = await createConversation({
        supabase,
        buyerId: userId,
        sellerId: orderItem.seller_id,
        productId: orderItem.product?.id ?? null,
        orderId: orderItem.order.id,
        subject,
        now,
      })

      if (!conversationCreate.ok) {
        logger.error("[orders-support] issue_report_conversation_create_failed", conversationCreate.error, {
          orderItemId: parsedInput.data.orderItemId,
          orderId: orderItem.order.id,
          sellerId: orderItem.seller_id,
        })
        return supportFailure("create_failed", "Failed to create conversation")
      }

      conversationId = conversationCreate.conversationId
    }

    const messageContent = `⚠️ **Issue Report: ${issueSubjects[parsedInput.data.issueType]}**\n\n${parsedInput.data.description}`

    const messageResult = await createMessage({ supabase, conversationId, senderId: userId, content: messageContent })

    if (!messageResult.ok) {
      logger.error("[orders-support] issue_report_message_create_failed", messageResult.error, {
        conversationId,
        orderItemId: parsedInput.data.orderItemId,
      })
      return supportFailure("create_failed", "Failed to send issue report")
    }

    await updateConversationAfterMessage({ supabase, conversationId, now })

    try {
      const admin = createAdminClient()
      const title = `Issue Report: ${issueSubjects[parsedInput.data.issueType]}`
      const notifyResult = await insertIssueReportNotification({
        adminSupabase: admin,
        sellerId: orderItem.seller_id,
        orderId: orderItem.order.id,
        orderItemId: parsedOrderItemId,
        issueType: parsedInput.data.issueType,
        conversationId,
        title,
      })

      if (!notifyResult.ok) {
        logger.error("[orders-support] issue_report_notification_failed", notifyResult.error, {
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

    return supportSuccess(conversationId)
  } catch (error) {
    logger.error("[orders-support] report_order_issue_unexpected", error, {
      orderItemId: parsedInput.data.orderItemId,
      issueType: parsedInput.data.issueType,
    })
    return supportFailure("unexpected", "An unexpected error occurred")
  }
}
