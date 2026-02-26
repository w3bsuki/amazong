import { revalidateTag } from "next/cache"
import { createReturnRequest, fetchOrderItemForReturn, hasActiveReturnRequest } from "@/lib/data/orders/support"
import {
  requireSupportContext,
  supportFailure,
  supportSuccess,
  type OrdersSupportResult,
} from "./orders-support-shared"

import { logger } from "@/lib/logger"
export async function requestReturnImpl(
  orderItemId: string,
  reason: string
): Promise<OrdersSupportResult> {
  const context = await requireSupportContext(orderItemId)
  if (!context.success) return context

  try {
    const { userId, supabase, orderItemId: parsedOrderItemId } = context

    const normalizedReason = (reason ?? "").trim()
    if (normalizedReason.length < 3) {
      return supportFailure("validation_failed", "Please provide a reason")
    }

    const orderItemResult = await fetchOrderItemForReturn({ supabase, orderItemId: parsedOrderItemId })

    if (!orderItemResult.ok) {
      return supportFailure("not_found", "Order item not found")
    }

    const orderItem = orderItemResult.item

    if (orderItem.order.user_id !== userId) {
      return supportFailure("not_authorized", "Not authorized to request a return for this order")
    }

    if (orderItem.status !== "delivered") {
      return supportFailure("invalid_status", "Return requests are available after delivery")
    }

    const existingResult = await hasActiveReturnRequest({
      supabase,
      orderItemId: parsedOrderItemId,
      buyerId: userId,
    })

    if (!existingResult.ok) {
      logger.error("[orders-support] return_request_lookup_failed", existingResult.error, {
        orderItemId: parsedOrderItemId,
        buyerId: userId,
      })
      return supportFailure("create_failed", "Failed to submit return request")
    }

    if (existingResult.exists) {
      return supportFailure("already_exists", "Return request already submitted")
    }

    const createResult = await createReturnRequest({
      supabase,
      orderItemId: parsedOrderItemId,
      orderId: orderItem.order.id,
      buyerId: userId,
      sellerId: orderItem.seller_id,
      reason: normalizedReason,
    })

    if (!createResult.ok) {
      logger.error("[orders-support] return_request_create_failed", createResult.error, {
        orderItemId: parsedOrderItemId,
        buyerId: userId,
      })
      return supportFailure("create_failed", "Failed to submit return request")
    }

    revalidateTag("orders", "max")
    revalidateTag("messages", "max")
    revalidateTag("conversations", "max")

    return supportSuccess()
  } catch (error) {
    logger.error("[orders-support] request_return_unexpected", error, {
      orderItemId,
    })
    return supportFailure("unexpected", "An unexpected error occurred")
  }
}
