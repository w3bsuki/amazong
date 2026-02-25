import { revalidateTag } from "next/cache"
import {
  requireSupportContext,
  supportFailure,
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

    const { data: orderItem, error: fetchError } = await supabase
      .from("order_items")
      .select(`
          id,
          status,
          seller_id,
          order:orders!inner(id, user_id)
        `)
      .eq("id", parsedOrderItemId)
      .single<{
        id: string
        status: string | null
        seller_id: string
        order: { id: string; user_id: string }
      }>()

    if (fetchError || !orderItem) {
      return supportFailure("not_found", "Order item not found")
    }

    if (orderItem.order.user_id !== userId) {
      return supportFailure("not_authorized", "Not authorized to request a return for this order")
    }

    if (orderItem.status !== "delivered") {
      return supportFailure("invalid_status", "Return requests are available after delivery")
    }

    const { data: existingRequests, error: existingError } = await supabase
      .from("return_requests")
      .select("id,status")
      .eq("order_item_id", parsedOrderItemId)
      .eq("buyer_id", userId)
      .neq("status", "cancelled")
      .limit(1)

    const existingRequest = existingRequests?.[0] ?? null

    if (existingError) {
      logger.error("[orders-support] return_request_lookup_failed", existingError, {
        orderItemId: parsedOrderItemId,
        buyerId: userId,
      })
      return supportFailure("create_failed", "Failed to submit return request")
    }

    if (existingRequest?.id) {
      return supportFailure("already_exists", "Return request already submitted")
    }

    const { error: insertError } = await supabase.from("return_requests").insert({
      order_item_id: parsedOrderItemId,
      order_id: orderItem.order.id,
      buyer_id: userId,
      seller_id: orderItem.seller_id,
      reason: normalizedReason,
      status: "requested",
    })

    if (insertError) {
      logger.error("[orders-support] return_request_create_failed", insertError, {
        orderItemId: parsedOrderItemId,
        buyerId: userId,
      })
      return supportFailure("create_failed", "Failed to submit return request")
    }

    revalidateTag("orders", "max")
    revalidateTag("messages", "max")
    revalidateTag("conversations", "max")

    return { success: true }
  } catch (error) {
    logger.error("[orders-support] request_return_unexpected", error, {
      orderItemId,
    })
    return supportFailure("unexpected", "An unexpected error occurred")
  }
}
