import { logger } from "@/lib/logger"
import { createAdminClient } from "@/lib/supabase/server"
import { revalidateTag } from "next/cache"
import {
  requireSupportContext,
  supportFailure,
  type OrdersSupportResult,
} from "./orders-support-shared"

export async function requestOrderCancellationImpl(
  orderItemId: string,
  reason?: string
): Promise<OrdersSupportResult> {
  const context = await requireSupportContext(orderItemId)
  if (!context.success) return context

  try {
    const { userId, supabase, orderItemId: parsedOrderItemId } = context

    const { data: orderItem, error: fetchError } = await supabase
      .from("order_items")
      .select(`
        id,
        status,
        seller_id,
        product:products(title),
        order:orders!inner(id, user_id, status)
      `)
      .eq("id", parsedOrderItemId)
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

    if (orderItem.order.user_id !== userId) {
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
      .eq("id", parsedOrderItemId)

    if (updateError) {
      logger.error("[orders-support] order_cancellation_update_failed", updateError, {
        orderItemId: parsedOrderItemId,
        buyerId: userId,
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
          order_item_id: parsedOrderItemId,
          order_id: orderItem.order.id,
          reason,
        },
        order_id: orderItem.order.id,
      })

      if (notifyError) {
        logger.error("[orders-support] cancellation_notification_failed", notifyError, {
          orderItemId: parsedOrderItemId,
          orderId: orderItem.order.id,
        })
      }
    } catch (error) {
      logger.error("[orders-support] cancellation_notification_unexpected", error, {
        orderItemId: parsedOrderItemId,
        orderId: orderItem.order.id,
      })
    }

    revalidateTag("orders", "max")

    return { success: true }
  } catch (error) {
    logger.error("[orders-support] request_order_cancellation_unexpected", error, {
      orderItemId,
    })
    return supportFailure("unexpected", "An unexpected error occurred")
  }
}
