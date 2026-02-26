"use server"

import { z } from "zod"
import { errorEnvelope, successEnvelope, type Envelope } from "@/lib/api/envelope"
import { requireAuth } from "@/lib/auth/require-auth"
import {
  fetchOrderItemWithBuyer,
  fetchSellerOrderItemStatusRow,
  markOrderItemDelivered,
  updateSellerOrderItem,
} from "@/lib/data/orders/status"
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

type OrderStatusActionResult = Envelope<
  { sellerId?: string },
  { error: string; code: OrderStatusActionErrorCode }
>

function ok(sellerId?: string): OrderStatusActionResult {
  if (sellerId) {
    return successEnvelope({ sellerId })
  }

  return successEnvelope<{ sellerId?: string }>()
}

function fail(code: OrderStatusActionErrorCode, error: string): OrderStatusActionResult {
  return errorEnvelope({ code, error })
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
    return fail("invalid_input", "Invalid input")
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
      return fail("not_authenticated", "Not authenticated")
    }
    const { user, supabase } = auth

    const existingResult = await fetchSellerOrderItemStatusRow({
      supabase,
      orderItemId: safeOrderItemId,
      sellerId: user.id,
    })

    if (!existingResult.ok) {
      return fail("not_found", "Order item not found")
    }

    const existingItem = existingResult.item

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

    const updateResult = await updateSellerOrderItem({
      supabase,
      orderItemId: safeOrderItemId,
      sellerId: user.id,
      updateData,
    })

    if (!updateResult.ok) {
      logger.error("[orders-status] update_order_item_status_failed", updateResult.error, {
        orderItemId: safeOrderItemId,
        sellerId: user.id,
        newStatus: safeNewStatus,
      })
      return fail("update_failed", "Failed to update order status")
    }

    revalidateTag("orders", "max")
    revalidateTag("messages", "max")
    revalidateTag("conversations", "max")

    return ok()
  } catch (error) {
    logger.error("[orders-status] update_order_item_status_unexpected", error, {
      orderItemId: safeOrderItemId,
      newStatus: safeNewStatus,
    })
    return fail("unexpected", "An unexpected error occurred")
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
    return fail("invalid_input", "Invalid orderItemId")
  }

  try {
    const auth = await requireAuth()
    if (!auth) {
      return fail("not_authenticated", "Not authenticated")
    }
    const { user, supabase } = auth

    const fetchResult = await fetchOrderItemWithBuyer({ supabase, orderItemId: parsedOrderItemId.data })

    if (!fetchResult.ok) {
      return fail("not_found", "Order item not found")
    }

    const orderItem = fetchResult.item

    if (orderItem.buyer_id !== user.id) {
      return fail("not_authorized", "Not authorized to update this order")
    }

    if (orderItem.status !== "shipped") {
      return fail(
        "invalid_status",
        orderItem.status === "delivered"
          ? "Order already marked as delivered"
          : "Order must be shipped before confirming delivery"
      )
    }

    const updateResult = await markOrderItemDelivered({
      supabase,
      orderItemId: parsedOrderItemId.data,
      deliveredAt: new Date().toISOString(),
    })

    if (!updateResult.ok) {
      logger.error("[orders-status] buyer_confirm_delivery_update_failed", updateResult.error, {
        orderItemId: parsedOrderItemId.data,
        buyerId: user.id,
      })
      return fail("update_failed", "Failed to confirm delivery")
    }

    revalidateTag("orders", "max")

    return ok(orderItem.seller_id)
  } catch (error) {
    logger.error("[orders-status] buyer_confirm_delivery_unexpected", error, {
      orderItemId: parsedOrderItemId.data,
    })
    return fail("unexpected", "An unexpected error occurred")
  }
}
