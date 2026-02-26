"use server"

import { getOrderActionContext, OrderActionItemIdSchema } from "./order-action-context"
import { errorEnvelope, successEnvelope, type Envelope } from "@/lib/api/envelope"
import { fetchRatingOrderItem, hasBuyerFeedback, hasSellerFeedback } from "@/lib/data/orders/rating"

export type BuyerSellerRatingStatusResult = Envelope<
  { canRate: boolean; hasRated: boolean; sellerId?: string },
  { canRate: boolean; hasRated: boolean; sellerId?: string; error: string }
>

export type SellerBuyerRatingStatusResult = Envelope<
  { canRate: boolean; hasRated: boolean; buyerId?: string; orderId?: string },
  { canRate: boolean; hasRated: boolean; buyerId?: string; orderId?: string; error: string }
>

async function getAuthedOrderRatingContext(orderItemId: string) {
  const parsedOrderItemId = OrderActionItemIdSchema.safeParse(orderItemId)
  if (!parsedOrderItemId.success) return null

  const context = await getOrderActionContext(parsedOrderItemId.data)
  if (!context.success) return null

  return context
}

/**
 * Check if buyer can leave feedback for a seller after delivery
 */
export async function canBuyerRateSeller(
  orderItemId: string
): Promise<BuyerSellerRatingStatusResult> {
  const context = await getAuthedOrderRatingContext(orderItemId)
  if (!context) {
    return errorEnvelope({ canRate: false, hasRated: false, error: "Not authenticated" })
  }

  try {
    const { orderItemId: parsedOrderItemId, userId, supabase } = context

    const orderItemResult = await fetchRatingOrderItem({ supabase, orderItemId: parsedOrderItemId })
    const orderItem = orderItemResult.ok ? orderItemResult.item : null

    if (!orderItem) {
      return successEnvelope({ canRate: false, hasRated: false })
    }

    if (orderItem.order.user_id !== userId) {
      return successEnvelope({ canRate: false, hasRated: false })
    }

    if (orderItem.status !== "delivered") {
      return successEnvelope({ canRate: false, hasRated: false, sellerId: orderItem.seller_id })
    }

    const feedbackResult = await hasSellerFeedback({
      supabase,
      buyerId: userId,
      sellerId: orderItem.seller_id,
      orderId: orderItem.order_id,
    })

    const hasRated = feedbackResult.ok ? feedbackResult.exists : false

    return successEnvelope({
      canRate: !hasRated,
      hasRated,
      sellerId: orderItem.seller_id,
    })
  } catch {
    return errorEnvelope({ canRate: false, hasRated: false, error: "An unexpected error occurred" })
  }
}

/**
 * Check if seller can rate buyer after delivery
 */
export async function canSellerRateBuyer(
  orderItemId: string
): Promise<SellerBuyerRatingStatusResult> {
  const context = await getAuthedOrderRatingContext(orderItemId)
  if (!context) {
    return errorEnvelope({ canRate: false, hasRated: false, error: "Not authenticated" })
  }

  try {
    const { orderItemId: parsedOrderItemId, userId, supabase } = context

    const orderItemResult = await fetchRatingOrderItem({
      supabase,
      orderItemId: parsedOrderItemId,
      sellerId: userId,
    })
    const orderItem = orderItemResult.ok ? orderItemResult.item : null

    if (!orderItem) {
      return successEnvelope({ canRate: false, hasRated: false })
    }

    const buyerId = orderItem.order.user_id

    if (orderItem.status !== "delivered") {
      return successEnvelope({ canRate: false, hasRated: false, buyerId, orderId: orderItem.order_id })
    }

    const feedbackResult = await hasBuyerFeedback({
      supabase,
      sellerId: userId,
      buyerId,
      orderId: orderItem.order_id,
    })

    const hasRated = feedbackResult.ok ? feedbackResult.exists : false

    return successEnvelope({
      canRate: !hasRated,
      hasRated,
      buyerId,
      orderId: orderItem.order_id,
    })
  } catch {
    return errorEnvelope({ canRate: false, hasRated: false, error: "An unexpected error occurred" })
  }
}
