"use server"

import { z } from "zod"
import { requireAuth } from "@/lib/auth/require-auth"
import { revalidateTag } from "next/cache"
import { SHIPPING_CARRIER_VALUES } from "@/lib/order-status"
import type { OrderItemStatus, ShippingCarrier } from "@/lib/order-status"

import { logger } from "@/lib/logger"
const OrderItemStatusSchema = z.enum([
  "pending",
  "received",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
])

const UpdateOrderItemStatusInputSchema = z.object({
  orderItemId: z.string().uuid(),
  newStatus: OrderItemStatusSchema,
  trackingNumber: z.string().max(256).optional(),
  shippingCarrier: z.enum(SHIPPING_CARRIER_VALUES).optional(),
})

type OrderStatusActionErrorCode =
  | "invalid_input"
  | "not_authenticated"
  | "not_found"
  | "not_authorized"
  | "invalid_status"
  | "update_failed"
  | "unexpected"

type OrderStatusActionFailure = {
  success: false
  error: string
  code: OrderStatusActionErrorCode
}

type OrderStatusActionSuccess = {
  success: true
  sellerId?: string
}

type OrderStatusActionResult = OrderStatusActionSuccess | OrderStatusActionFailure

function actionFailure(
  code: OrderStatusActionErrorCode,
  error: string
): OrderStatusActionFailure {
  return { success: false, error, code }
}

/**
 * Update the status of an order item (seller only)
 */
export async function updateOrderItemStatus(
  orderItemId: string,
  newStatus: OrderItemStatus,
  trackingNumber?: string,
  shippingCarrier?: ShippingCarrier
): Promise<OrderStatusActionResult> {
  const parsedInput = UpdateOrderItemStatusInputSchema.safeParse({
    orderItemId,
    newStatus,
    trackingNumber,
    shippingCarrier,
  })
  if (!parsedInput.success) {
    return actionFailure("invalid_input", "Invalid input")
  }

  const {
    orderItemId: safeOrderItemId,
    newStatus: safeNewStatus,
    trackingNumber: safeTrackingNumber,
    shippingCarrier: safeShippingCarrier,
  } = parsedInput.data

  try {
    const auth = await requireAuth()
    if (!auth) {
      return actionFailure("not_authenticated", "Not authenticated")
    }
    const { user, supabase } = auth

    const { data: existingItem, error: existingError } = await supabase
      .from("order_items")
      .select("id, seller_id, seller_received_at, shipped_at, delivered_at")
      .eq("id", safeOrderItemId)
      .eq("seller_id", user.id)
      .single()

    if (existingError || !existingItem) {
      return actionFailure("not_found", "Order item not found")
    }

    const updateData: Record<string, unknown> = { status: safeNewStatus }
    const now = new Date().toISOString()

    if (safeNewStatus === "received" && !existingItem.seller_received_at) {
      updateData.seller_received_at = now
    }

    if (safeNewStatus === "shipped" && !existingItem.shipped_at) {
      updateData.shipped_at = now
    }

    if (safeNewStatus === "delivered" && !existingItem.delivered_at) {
      updateData.delivered_at = now
    }

    if (safeNewStatus === "shipped") {
      if (safeTrackingNumber) {
        updateData.tracking_number = safeTrackingNumber
      }
      if (safeShippingCarrier) {
        updateData.shipping_carrier = safeShippingCarrier
      }
    }

    const { error: updateError } = await supabase
      .from("order_items")
      .update(updateData)
      .eq("id", safeOrderItemId)
      .eq("seller_id", user.id)

    if (updateError) {
      logger.error("[orders-status] update_order_item_status_failed", updateError, {
        orderItemId: safeOrderItemId,
        sellerId: user.id,
        newStatus: safeNewStatus,
      })
      return actionFailure("update_failed", "Failed to update order status")
    }

    revalidateTag("orders", "max")
    revalidateTag("messages", "max")
    revalidateTag("conversations", "max")

    return { success: true }
  } catch (error) {
    logger.error("[orders-status] update_order_item_status_unexpected", error, {
      orderItemId: safeOrderItemId,
      newStatus: safeNewStatus,
    })
    return actionFailure("unexpected", "An unexpected error occurred")
  }
}

/**
 * Buyer confirms delivery of an order item
 */
export async function buyerConfirmDelivery(
  orderItemId: string
): Promise<OrderStatusActionResult> {
  const parsedOrderItemId = z.string().uuid().safeParse(orderItemId)
  if (!parsedOrderItemId.success) {
    return actionFailure("invalid_input", "Invalid orderItemId")
  }

  try {
    const auth = await requireAuth()
    if (!auth) {
      return actionFailure("not_authenticated", "Not authenticated")
    }
    const { user, supabase } = auth

    const { data: orderItem, error: fetchError } = await supabase
      .from("order_items")
      .select(`
        id,
        status,
        seller_id,
        order:orders!inner(user_id)
      `)
      .eq("id", parsedOrderItemId.data)
      .single<{
        id: string
        status: string
        seller_id: string
        order: { user_id: string }
      }>()

    if (fetchError || !orderItem) {
      return actionFailure("not_found", "Order item not found")
    }

    if (orderItem.order.user_id !== user.id) {
      return actionFailure("not_authorized", "Not authorized to update this order")
    }

    if (orderItem.status !== "shipped") {
      return {
        success: false,
        code: "invalid_status",
        error:
          orderItem.status === "delivered"
            ? "Order already marked as delivered"
            : "Order must be shipped before confirming delivery",
      }
    }

    const { error: updateError } = await supabase
      .from("order_items")
      .update({
        status: "delivered",
        delivered_at: new Date().toISOString(),
      })
      .eq("id", parsedOrderItemId.data)

    if (updateError) {
      logger.error("[orders-status] buyer_confirm_delivery_update_failed", updateError, {
        orderItemId: parsedOrderItemId.data,
        buyerId: user.id,
      })
      return actionFailure("update_failed", "Failed to confirm delivery")
    }

    revalidateTag("orders", "max")

    return { success: true, sellerId: orderItem.seller_id }
  } catch (error) {
    logger.error("[orders-status] buyer_confirm_delivery_unexpected", error, {
      orderItemId: parsedOrderItemId.data,
    })
    return actionFailure("unexpected", "An unexpected error occurred")
  }
}
