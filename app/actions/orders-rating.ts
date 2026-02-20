"use server"

import { z } from "zod"
import { requireAuth } from "@/lib/auth/require-auth"

const OrderItemIdSchema = z.string().uuid()

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

/**
 * Check if buyer can leave feedback for a seller after delivery
 */
export async function canBuyerRateSeller(
  orderItemId: string
): Promise<{ canRate: boolean; hasRated: boolean; sellerId?: string }> {
  const parsedOrderItemId = OrderItemIdSchema.safeParse(orderItemId)
  if (!parsedOrderItemId.success) return { canRate: false, hasRated: false }

  try {
    const auth = await requireAuth()
    if (!auth) {
      return { canRate: false, hasRated: false }
    }
    const { user, supabase } = auth

    const { data: orderItem } = await supabase
      .from("order_items")
      .select(ORDER_ITEM_RATING_SELECT)
      .eq("id", parsedOrderItemId.data)
      .single<RatingOrderItemRow>()

    if (!orderItem) {
      return { canRate: false, hasRated: false }
    }

    if (orderItem.order.user_id !== user.id) {
      return { canRate: false, hasRated: false }
    }

    if (orderItem.status !== "delivered") {
      return { canRate: false, hasRated: false, sellerId: orderItem.seller_id }
    }

    const { data: existingFeedback } = await supabase
      .from("seller_feedback")
      .select("id")
      .eq("buyer_id", user.id)
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
  const parsedOrderItemId = OrderItemIdSchema.safeParse(orderItemId)
  if (!parsedOrderItemId.success) return { canRate: false, hasRated: false }

  try {
    const auth = await requireAuth()
    if (!auth) {
      return { canRate: false, hasRated: false }
    }
    const { user, supabase } = auth

    const { data: orderItem } = await supabase
      .from("order_items")
      .select(ORDER_ITEM_RATING_SELECT)
      .eq("id", parsedOrderItemId.data)
      .eq("seller_id", user.id)
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
      .eq("seller_id", user.id)
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
