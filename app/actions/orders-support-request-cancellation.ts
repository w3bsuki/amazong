import { createAdminClient } from "@/lib/supabase/server"
import { revalidateTag } from "next/cache"
import {
  cancelOrderItem,
  fetchOrderItemForCancellation,
  insertCancellationNotification,
} from "@/lib/data/orders/support"
import {
  requireSupportContext,
  supportFailure,
  supportSuccess,
  type OrdersSupportResult,
} from "./orders-support-shared"

import { logger } from "@/lib/logger"
export async function requestOrderCancellationImpl(
  orderItemId: string,
  reason?: string
): Promise<OrdersSupportResult> {
  const context = await requireSupportContext(orderItemId)
  if (!context.success) return context

  try {
    const { userId, supabase, orderItemId: parsedOrderItemId } = context

    const orderItemResult = await fetchOrderItemForCancellation({
      supabase,
      orderItemId: parsedOrderItemId,
    })

    if (!orderItemResult.ok) {
      return supportFailure("not_found", "Order item not found")
    }

    const orderItem = orderItemResult.item

    if (orderItem.order.user_id !== userId) {
      return supportFailure("not_authorized", "Not authorized to cancel this order")
    }

    const nonCancellableStatuses = ["shipped", "delivered"]
    const currentStatus = orderItem.status || "pending"
    if (nonCancellableStatuses.includes(currentStatus)) {
      return supportFailure(
        "invalid_status",
        currentStatus === "shipped"
          ? "Cannot cancel - item has already been shipped"
          : "Cannot cancel - item has already been delivered"
      )
    }

    if (currentStatus === "cancelled") {
      return supportFailure("already_exists", "This item has already been cancelled")
    }

    const cancelResult = await cancelOrderItem({ supabase, orderItemId: parsedOrderItemId })

    if (!cancelResult.ok) {
      logger.error("[orders-support] order_cancellation_update_failed", cancelResult.error, {
        orderItemId: parsedOrderItemId,
        buyerId: userId,
      })
      return supportFailure("update_failed", "Failed to cancel order")
    }

    try {
      const admin = createAdminClient()
      const notifyResult = await insertCancellationNotification({
        adminSupabase: admin,
        sellerId: orderItem.seller_id,
        orderId: orderItem.order.id,
        orderItemId: parsedOrderItemId,
        ...(reason ? { reason } : {}),
      })

      if (!notifyResult.ok) {
        logger.error("[orders-support] cancellation_notification_failed", notifyResult.error, {
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

    return supportSuccess()
  } catch (error) {
    logger.error("[orders-support] request_order_cancellation_unexpected", error, {
      orderItemId,
    })
    return supportFailure("unexpected", "An unexpected error occurred")
  }
}
