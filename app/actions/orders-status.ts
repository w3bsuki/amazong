"use server"

import { requireAuth } from "@/lib/auth/require-auth"
import { revalidateTag } from "next/cache"
import type { OrderItemStatus, ShippingCarrier } from "@/lib/order-status"

/**
 * Update the status of an order item (seller only)
 */
export async function updateOrderItemStatus(
  orderItemId: string,
  newStatus: OrderItemStatus,
  trackingNumber?: string,
  shippingCarrier?: ShippingCarrier
): Promise<{ success: boolean; error?: string }> {
  try {
    const auth = await requireAuth()
    if (!auth) {
      return { success: false, error: "Not authenticated" }
    }
    const { user, supabase } = auth

    const { data: existingItem, error: existingError } = await supabase
      .from("order_items")
      .select("id, seller_id, seller_received_at, shipped_at, delivered_at")
      .eq("id", orderItemId)
      .eq("seller_id", user.id)
      .single()

    if (existingError || !existingItem) {
      return { success: false, error: "Order item not found" }
    }

    const updateData: Record<string, unknown> = { status: newStatus }
    const now = new Date().toISOString()

    if (newStatus === "received" && !existingItem.seller_received_at) {
      updateData.seller_received_at = now
    }

    if (newStatus === "shipped" && !existingItem.shipped_at) {
      updateData.shipped_at = now
    }

    if (newStatus === "delivered" && !existingItem.delivered_at) {
      updateData.delivered_at = now
    }

    if (newStatus === "shipped") {
      if (trackingNumber) {
        updateData.tracking_number = trackingNumber
      }
      if (shippingCarrier) {
        updateData.shipping_carrier = shippingCarrier
      }
    }

    const { error: updateError } = await supabase
      .from("order_items")
      .update(updateData)
      .eq("id", orderItemId)
      .eq("seller_id", user.id)

    if (updateError) {
      console.error("Error updating order item status:", updateError)
      return { success: false, error: "Failed to update order status" }
    }

    revalidateTag("orders", "max")
    revalidateTag("messages", "max")
    revalidateTag("conversations", "max")

    return { success: true }
  } catch (error) {
    console.error("Error in updateOrderItemStatus:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

/**
 * Buyer confirms delivery of an order item
 */
export async function buyerConfirmDelivery(
  orderItemId: string
): Promise<{ success: boolean; error?: string; sellerId?: string }> {
  try {
    const auth = await requireAuth()
    if (!auth) {
      return { success: false, error: "Not authenticated" }
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
      .eq("id", orderItemId)
      .single<{
        id: string
        status: string
        seller_id: string
        order: { user_id: string }
      }>()

    if (fetchError || !orderItem) {
      return { success: false, error: "Order item not found" }
    }

    if (orderItem.order.user_id !== user.id) {
      return { success: false, error: "Not authorized to update this order" }
    }

    if (orderItem.status !== "shipped") {
      return {
        success: false,
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
      .eq("id", orderItemId)

    if (updateError) {
      console.error("Error confirming delivery:", updateError)
      return { success: false, error: "Failed to confirm delivery" }
    }

    revalidateTag("orders", "max")

    return { success: true, sellerId: orderItem.seller_id }
  } catch (error) {
    console.error("Error in buyerConfirmDelivery:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

