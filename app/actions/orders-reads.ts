"use server"

import { z } from "zod"
import { requireAuth } from "@/lib/auth/require-auth"
import type { OrderItemStatus } from "@/lib/order-status"
import {
  ORDER_ITEM_DETAIL_SELECT,
  ORDER_ITEM_LIST_SELECT,
  type OrderItem,
} from "./orders-shared"

const OrderItemStatusSchema = z.enum([
  "pending",
  "received",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
])
const SellerOrdersStatusFilterSchema = z.union([OrderItemStatusSchema, z.literal("all")]).optional()
const OrderIdSchema = z.string().uuid()

/**
 * Get all order items for the current seller
 */
export async function getSellerOrders(
  statusFilter?: OrderItemStatus | "all"
): Promise<{ orders: OrderItem[]; error?: string }> {
  const parsedStatusFilter = SellerOrdersStatusFilterSchema.safeParse(statusFilter)
  if (!parsedStatusFilter.success) {
    return { orders: [], error: "Invalid status filter" }
  }

  try {
    const auth = await requireAuth()
    if (!auth) {
      return { orders: [], error: "Not authenticated" }
    }
    const { user, supabase } = auth

    let query = supabase
      .from("order_items")
      .select(ORDER_ITEM_LIST_SELECT)
      .eq("seller_id", user.id)
      .order("created_at", { ascending: false, foreignTable: "orders" })
      .limit(200)

    if (parsedStatusFilter.data && parsedStatusFilter.data !== "all") {
      query = query.eq("status", parsedStatusFilter.data)
    }

    const { data: orderItems, error: fetchError } = await query

    if (fetchError) {
      console.error("Error fetching seller orders:", fetchError)
      return { orders: [], error: "Failed to fetch orders" }
    }

    const buyerIds = [
      ...new Set((orderItems ?? []).map((item) => item.order?.user_id).filter(Boolean)),
    ]

    const buyersMap = new Map<string, { id: string; full_name: string | null; avatar_url: string | null }>()

    if (buyerIds.length > 0) {
      const { data: buyers } = await supabase
        .from("profiles")
        .select("id, full_name, avatar_url")
        .in("id", buyerIds)

      buyers?.forEach((buyer) => {
        buyersMap.set(buyer.id, buyer)
      })
    }

    const ordersWithBuyers = (orderItems ?? []).map((item) => ({
      ...item,
      created_at: item.order?.created_at ?? new Date().toISOString(),
      buyer: (() => {
        if (!item.order?.user_id) return

        const base = buyersMap.get(item.order.user_id)
        const shippingAddress = item.order?.shipping_address
        const email =
          shippingAddress &&
          typeof shippingAddress === "object" &&
          !Array.isArray(shippingAddress) &&
          typeof (shippingAddress as { email?: unknown }).email === "string"
            ? (shippingAddress as { email: string }).email
            : null

        return {
          id: item.order.user_id,
          full_name: base?.full_name ?? null,
          email,
          avatar_url: base?.avatar_url ?? null,
        }
      })(),
    }))

    return { orders: ordersWithBuyers as OrderItem[] }
  } catch (error) {
    console.error("Error in getSellerOrders:", error)
    return { orders: [], error: "An unexpected error occurred" }
  }
}

/**
 * Get order counts by status for dashboard stats
 */
export async function getSellerOrderStats(): Promise<{
  pending: number
  received: number
  processing: number
  shipped: number
  delivered: number
  cancelled: number
  total: number
}> {
  const defaultStats = {
    pending: 0,
    received: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
    total: 0,
  }

  try {
    const auth = await requireAuth()
    if (!auth) return defaultStats
    const { user, supabase } = auth

    const { data: orderItems } = await supabase
      .from("order_items")
      .select("status")
      .eq("seller_id", user.id)

    if (!orderItems) return defaultStats

    const stats = { ...defaultStats }
    orderItems.forEach((item) => {
      const status = item.status as OrderItemStatus
      if (status in stats) {
        stats[status]++
      }
      stats.total++
    })

    return stats
  } catch {
    return defaultStats
  }
}

/**
 * Get all orders for the current buyer
 */
export async function getBuyerOrders(): Promise<{ orders: OrderItem[]; error?: string }> {
  try {
    const auth = await requireAuth()
    if (!auth) {
      return { orders: [], error: "Not authenticated" }
    }
    const { user, supabase } = auth

    const { data: orders, error: ordersError } = await supabase
      .from("orders")
      .select("id")
      .eq("user_id", user.id)

    if (ordersError) {
      return { orders: [], error: "Failed to fetch orders" }
    }

    const orderIds = orders?.map((order) => order.id) || []
    if (orderIds.length === 0) {
      return { orders: [] }
    }

    const { data: orderItems, error: itemsError } = await supabase
      .from("order_items")
      .select(ORDER_ITEM_LIST_SELECT)
      .in("order_id", orderIds)
      .order("created_at", { ascending: false, foreignTable: "orders" })
      .limit(200)

    if (itemsError) {
      return { orders: [], error: "Failed to fetch order items" }
    }

    const itemsWithCreatedAt = (orderItems ?? []).map((item) => ({
      ...item,
      created_at: item.order?.created_at ?? new Date().toISOString(),
    }))

    return { orders: itemsWithCreatedAt as OrderItem[] }
  } catch (error) {
    console.error("Error in getBuyerOrders:", error)
    return { orders: [], error: "An unexpected error occurred" }
  }
}

/**
 * Get conversation ID for an order item (to link to chat)
 */
export async function getOrderConversation(
  orderId: string
): Promise<{ conversationId: string | null; error?: string }> {
  const parsedOrderId = OrderIdSchema.safeParse(orderId)
  if (!parsedOrderId.success) {
    return { conversationId: null, error: "Invalid orderId" }
  }

  try {
    const auth = await requireAuth()
    if (!auth) {
      return { conversationId: null, error: "Not authenticated" }
    }
    const { user, supabase } = auth

    const { data: conversation } = await supabase
      .from("conversations")
      .select("id")
      .eq("order_id", parsedOrderId.data)
      .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
      .single()

    return { conversationId: conversation?.id || null }
  } catch {
    return { conversationId: null }
  }
}

/**
 * Get detailed order information for a buyer
 */
export async function getBuyerOrderDetails(
  orderId: string
): Promise<{
  order: {
    id: string
    status: string
    total_amount: number
    shipping_address: Record<string, unknown> | null
    created_at: string
    items: OrderItem[]
  } | null
  error?: string
}> {
  const parsedOrderId = OrderIdSchema.safeParse(orderId)
  if (!parsedOrderId.success) {
    return { order: null, error: "Invalid orderId" }
  }

  try {
    const auth = await requireAuth()
    if (!auth) {
      return { order: null, error: "Not authenticated" }
    }
    const { user, supabase } = auth

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select(`
        id,
        status,
        total_amount,
        shipping_address,
        created_at,
        order_items (
          ${ORDER_ITEM_DETAIL_SELECT}
        )
      `)
      .eq("id", parsedOrderId.data)
      .eq("user_id", user.id)
      .single<{
        id: string
        status: string | null
        total_amount: number
        shipping_address: Record<string, unknown> | null
        created_at: string
        order_items: OrderItem[]
      }>()

    if (orderError || !order) {
      return { order: null, error: "Order not found" }
    }

    return {
      order: {
        id: order.id,
        status: order.status || "pending",
        total_amount: order.total_amount,
        shipping_address: order.shipping_address,
        created_at: order.created_at,
        items: order.order_items.map((item) => ({ ...item, created_at: order.created_at })) as OrderItem[],
      },
    }
  } catch (error) {
    console.error("Error in getBuyerOrderDetails:", error)
    return { order: null, error: "An unexpected error occurred" }
  }
}
