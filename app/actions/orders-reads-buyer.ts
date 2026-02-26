import { errorEnvelope, successEnvelope } from "@/lib/api/envelope"
import {
  fetchBuyerOrderDetails,
  fetchBuyerOrderIds,
  fetchOrderItemsForOrderIds,
} from "@/lib/data/orders/reads"
import type { OrderItem } from "@/lib/types/order-item"
import {
  NOT_AUTHENTICATED_ERROR,
  OrderIdSchema,
  UNEXPECTED_ERROR,
  requireOrdersReadAuth,
  type BuyerOrderDetailsResult,
  type OrdersReadResult,
} from "./orders-reads-shared"

import { logger } from "@/lib/logger"
export async function getBuyerOrdersImpl(): Promise<OrdersReadResult> {
  try {
    const authResult = await requireOrdersReadAuth(() =>
      errorEnvelope({ orders: [], error: NOT_AUTHENTICATED_ERROR })
    )
    if (!authResult.success) {
      return authResult.failure
    }
    const { userId, supabase } = authResult

    const orderIdsResult = await fetchBuyerOrderIds({ supabase, userId })
    if (!orderIdsResult.ok) {
      return errorEnvelope({ orders: [], error: "Failed to fetch orders" })
    }

    if (orderIdsResult.orderIds.length === 0) {
      return successEnvelope({ orders: [] })
    }

    const orderItemsResult = await fetchOrderItemsForOrderIds({
      supabase,
      orderIds: orderIdsResult.orderIds,
      limit: 200,
    })
    if (!orderItemsResult.ok) {
      return errorEnvelope({ orders: [], error: "Failed to fetch order items" })
    }

    const itemsWithCreatedAt = orderItemsResult.items.map((item) => {
      const order = item.order
      const createdAt =
        typeof order === "object" &&
        order !== null &&
        "created_at" in order &&
        typeof (order as { created_at?: unknown }).created_at === "string"
          ? (order as { created_at: string }).created_at
          : new Date().toISOString()

      return {
        ...item,
        created_at: createdAt,
      }
    })

    return successEnvelope({ orders: itemsWithCreatedAt as OrderItem[] })
  } catch (error) {
    logger.error("[orders-reads] get_buyer_orders_unexpected", error)
    return errorEnvelope({ orders: [], error: UNEXPECTED_ERROR })
  }
}

export async function getBuyerOrderDetailsImpl(
  orderId: string
): Promise<BuyerOrderDetailsResult> {
  const parsedOrderId = OrderIdSchema.safeParse(orderId)
  if (!parsedOrderId.success) {
    return errorEnvelope({ order: null, error: "Invalid orderId" })
  }

  try {
    const authResult = await requireOrdersReadAuth(() =>
      errorEnvelope({ order: null, error: NOT_AUTHENTICATED_ERROR })
    )
    if (!authResult.success) {
      return authResult.failure
    }
    const { userId, supabase } = authResult

    const orderResult = await fetchBuyerOrderDetails({
      supabase,
      userId,
      orderId: parsedOrderId.data,
    })

    if (!orderResult.ok) {
      return errorEnvelope({ order: null, error: "Order not found" })
    }

    const order = orderResult.order

    return successEnvelope({
      order: {
        id: order.id,
        status: order.status || "pending",
        total_amount: order.total_amount,
        shipping_address: order.shipping_address,
        created_at: order.created_at,
        items: order.order_items.map((item) => ({ ...item, created_at: order.created_at })) as OrderItem[],
      },
    })
  } catch (error) {
    logger.error("[orders-reads] get_buyer_order_details_unexpected", error, {
      orderId: parsedOrderId.data,
    })
    return errorEnvelope({ order: null, error: UNEXPECTED_ERROR })
  }
}
