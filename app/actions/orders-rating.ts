"use server"

import { getOrderActionContext, OrderActionItemIdSchema } from "./order-action-context"

const ORDER_ITEM_RATING_SELECT = `
        id,
        status,
        seller_id,
        order_id,
        order:orders!inner(user_id)
      `

type RatingOrderItemRow = {
  id: string
  status: string | null
  seller_id: string
  order_id: string
  order: { user_id: string }
}

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
): Promise<{ canRate: boolean; hasRated: boolean; sellerId?: string }> {
  const context = await getAuthedOrderRatingContext(orderItemId)
  if (!context) return { canRate: false, hasRated: false }

  try {
    const { orderItemId: parsedOrderItemId, userId, supabase } = context

    const { data: orderItem } = await supabase
      .from("order_items")
      .select(ORDER_ITEM_RATING_SELECT)
      .eq("id", parsedOrderItemId)
      .single<RatingOrderItemRow>()

    if (!orderItem) {
      return { canRate: false, hasRated: false }
    }

    if (orderItem.order.user_id !== userId) {
      return { canRate: false, hasRated: false }
    }

    if (orderItem.status !== "delivered") {
      return { canRate: false, hasRated: false, sellerId: orderItem.seller_id }
    }

    const { data: existingFeedback } = await supabase
      .from("seller_feedback")
      .select("id")
      .eq("buyer_id", userId)
      .eq("seller_id", orderItem.seller_id)
      .eq("order_id", orderItem.order_id)
      .single()

    return {
      canRate: !existingFeedback,
      hasRated: !!existingFeedback,
      sellerId: orderItem.seller_id,
    }
  } catch {
    return { canRate: false, hasRated: false }
  }
}

/**
 * Check if seller can rate buyer after delivery
 */
export async function canSellerRateBuyer(
  orderItemId: string
): Promise<{ canRate: boolean; hasRated: boolean; buyerId?: string; orderId?: string }> {
  const context = await getAuthedOrderRatingContext(orderItemId)
  if (!context) return { canRate: false, hasRated: false }

  try {
    const { orderItemId: parsedOrderItemId, userId, supabase } = context

    const { data: orderItem } = await supabase
      .from("order_items")
      .select(ORDER_ITEM_RATING_SELECT)
      .eq("id", parsedOrderItemId)
      .eq("seller_id", userId)
      .single<RatingOrderItemRow>()

    if (!orderItem) {
      return { canRate: false, hasRated: false }
    }

    const buyerId = orderItem.order.user_id

    if (orderItem.status !== "delivered") {
      return { canRate: false, hasRated: false, buyerId, orderId: orderItem.order_id }
    }

    const { data: existingFeedback } = await supabase
      .from("buyer_feedback")
      .select("id")
      .eq("seller_id", userId)
      .eq("buyer_id", buyerId)
      .eq("order_id", orderItem.order_id)
      .single()

    return {
      canRate: !existingFeedback,
      hasRated: !!existingFeedback,
      buyerId,
      orderId: orderItem.order_id,
    }
  } catch {
    return { canRate: false, hasRated: false }
  }
}
