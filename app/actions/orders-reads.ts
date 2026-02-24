"use server"

import { z } from "zod"
import { errorEnvelope, successEnvelope, type Envelope } from "@/lib/api/envelope"
import { requireAuth } from "@/lib/auth/require-auth"
import { logger } from "@/lib/logger"
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
const SellerOrdersStatusFilterSchema = z.union([
  OrderItemStatusSchema,
  z.literal("all"),
  z.literal("active"),
]).optional()
const OrderIdSchema = z.string().uuid()
const PositiveIntegerSchema = z.number().int().positive()
const NOT_AUTHENTICATED_ERROR = "Not authenticated"
const UNEXPECTED_ERROR = "An unexpected error occurred"
const SELLER_ORDERS_DEFAULT_PAGE_SIZE = 10

type OrdersReadResult = Envelope<
  { orders: OrderItem[] },
  { orders: OrderItem[]; error: string }
>

type SellerOrdersReadResult = Envelope<
  {
    orders: OrderItem[]
    currentPage: number
    pageSize: number
    totalPages: number
    totalItems: number
  },
  {
    orders: OrderItem[]
    currentPage: number
    pageSize: number
    totalPages: number
    totalItems: number
    error: string
  }
>

type SellerOrderStats = {
  pending: number
  received: number
  processing: number
  shipped: number
  delivered: number
  cancelled: number
  total: number
}

type SellerOrderStatsResult = Envelope<
  SellerOrderStats,
  SellerOrderStats & { error: string }
>

type OrderConversationResult = Envelope<
  { conversationId: string | null },
  { conversationId: string | null; error: string }
>

type BuyerOrderDetails = {
  id: string
  status: string
  total_amount: number
  shipping_address: Record<string, unknown> | null
  created_at: string
  items: OrderItem[]
}

type BuyerOrderDetailsResult = Envelope<
  { order: BuyerOrderDetails },
  { order: null; error: string }
>

/**
 * Get all order items for the current seller
 */
export async function getSellerOrders(
  statusFilter?: OrderItemStatus | "all" | "active",
  page = 1,
  pageSize = SELLER_ORDERS_DEFAULT_PAGE_SIZE
): Promise<SellerOrdersReadResult> {
  const parsedStatusFilter = SellerOrdersStatusFilterSchema.safeParse(statusFilter)
  if (!parsedStatusFilter.success) {
    return errorEnvelope({
      orders: [],
      currentPage: 1,
      pageSize: SELLER_ORDERS_DEFAULT_PAGE_SIZE,
      totalPages: 1,
      totalItems: 0,
      error: "Invalid status filter",
    })
  }

  const parsedPage = PositiveIntegerSchema.safeParse(page)
  if (!parsedPage.success) {
    return errorEnvelope({
      orders: [],
      currentPage: 1,
      pageSize: SELLER_ORDERS_DEFAULT_PAGE_SIZE,
      totalPages: 1,
      totalItems: 0,
      error: "Invalid page",
    })
  }

  const parsedPageSize = PositiveIntegerSchema.safeParse(pageSize)
  if (!parsedPageSize.success) {
    return errorEnvelope({
      orders: [],
      currentPage: parsedPage.data,
      pageSize: SELLER_ORDERS_DEFAULT_PAGE_SIZE,
      totalPages: 1,
      totalItems: 0,
      error: "Invalid page size",
    })
  }

  try {
    const auth = await requireAuth()
    if (!auth) {
      return errorEnvelope({
        orders: [],
        currentPage: parsedPage.data,
        pageSize: parsedPageSize.data,
        totalPages: 1,
        totalItems: 0,
        error: NOT_AUTHENTICATED_ERROR,
      })
    }
    const { user, supabase } = auth
    const offset = (parsedPage.data - 1) * parsedPageSize.data
    const to = offset + parsedPageSize.data - 1

    let query = supabase
      .from("order_items")
      .select(ORDER_ITEM_LIST_SELECT, { count: "exact" })
      .eq("seller_id", user.id)
      .order("created_at", { ascending: false, foreignTable: "orders" })
      .range(offset, to)

    if (parsedStatusFilter.data === "active") {
      query = query.in("status", ["pending", "received", "processing", "shipped"])
    } else if (parsedStatusFilter.data && parsedStatusFilter.data !== "all") {
      query = query.eq("status", parsedStatusFilter.data)
    }

    const { data: orderItems, error: fetchError, count } = await query

    if (fetchError) {
      logger.error("[orders-reads] get_seller_orders_fetch_failed", fetchError, {
        sellerId: user.id,
      })
      return errorEnvelope({
        orders: [],
        currentPage: parsedPage.data,
        pageSize: parsedPageSize.data,
        totalPages: 1,
        totalItems: 0,
        error: "Failed to fetch orders",
      })
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

    const totalItems = count ?? 0
    const totalPages = Math.max(1, Math.ceil(totalItems / parsedPageSize.data))
    const currentPage = Math.min(parsedPage.data, totalPages)

    return successEnvelope({
      orders: ordersWithBuyers as OrderItem[],
      currentPage,
      pageSize: parsedPageSize.data,
      totalPages,
      totalItems,
    })
  } catch (error) {
    logger.error("[orders-reads] get_seller_orders_unexpected", error)
    return errorEnvelope({
      orders: [],
      currentPage: parsedPage.data,
      pageSize: parsedPageSize.data,
      totalPages: 1,
      totalItems: 0,
      error: UNEXPECTED_ERROR,
    })
  }
}

/**
 * Get order counts by status for dashboard stats
 */
export async function getSellerOrderStats(): Promise<SellerOrderStatsResult> {
  const defaultStats: SellerOrderStats = {
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
    if (!auth) {
      return errorEnvelope({ ...defaultStats, error: NOT_AUTHENTICATED_ERROR })
    }
    const { user, supabase } = auth

    const { data: orderItems } = await supabase
      .from("order_items")
      .select("status")
      .eq("seller_id", user.id)

    if (!orderItems) return successEnvelope(defaultStats)

    const stats = { ...defaultStats }
    orderItems.forEach((item) => {
      const status = item.status as OrderItemStatus
      if (status in stats) {
        stats[status]++
      }
      stats.total++
    })

    return successEnvelope(stats)
  } catch {
    return errorEnvelope({ ...defaultStats, error: UNEXPECTED_ERROR })
  }
}

/**
 * Get all orders for the current buyer
 */
export async function getBuyerOrders(): Promise<OrdersReadResult> {
  try {
    const auth = await requireAuth()
    if (!auth) {
      return errorEnvelope({ orders: [], error: NOT_AUTHENTICATED_ERROR })
    }
    const { user, supabase } = auth

    const { data: orders, error: ordersError } = await supabase
      .from("orders")
      .select("id")
      .eq("user_id", user.id)

    if (ordersError) {
      return errorEnvelope({ orders: [], error: "Failed to fetch orders" })
    }

    const orderIds = orders?.map((order) => order.id) || []
    if (orderIds.length === 0) {
      return successEnvelope({ orders: [] })
    }

    const { data: orderItems, error: itemsError } = await supabase
      .from("order_items")
      .select(ORDER_ITEM_LIST_SELECT)
      .in("order_id", orderIds)
      .order("created_at", { ascending: false, foreignTable: "orders" })
      .limit(200)

    if (itemsError) {
      return errorEnvelope({ orders: [], error: "Failed to fetch order items" })
    }

    const itemsWithCreatedAt = (orderItems ?? []).map((item) => ({
      ...item,
      created_at: item.order?.created_at ?? new Date().toISOString(),
    }))

    return successEnvelope({ orders: itemsWithCreatedAt as OrderItem[] })
  } catch (error) {
    logger.error("[orders-reads] get_buyer_orders_unexpected", error)
    return errorEnvelope({ orders: [], error: UNEXPECTED_ERROR })
  }
}

/**
 * Get conversation ID for an order item (to link to chat)
 */
export async function getOrderConversation(
  orderId: string
): Promise<OrderConversationResult> {
  const parsedOrderId = OrderIdSchema.safeParse(orderId)
  if (!parsedOrderId.success) {
    return errorEnvelope({ conversationId: null, error: "Invalid orderId" })
  }

  try {
    const auth = await requireAuth()
    if (!auth) {
      return errorEnvelope({ conversationId: null, error: NOT_AUTHENTICATED_ERROR })
    }
    const { user, supabase } = auth

    const { data: conversation, error } = await supabase
      .from("conversations")
      .select("id")
      .eq("order_id", parsedOrderId.data)
      .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
      .single()

    if (error) {
      if (error.code === "PGRST116") {
        return successEnvelope({ conversationId: null })
      }

      logger.error("[orders-reads] get_order_conversation_failed", error, {
        orderId: parsedOrderId.data,
        userId: user.id,
      })
      return errorEnvelope({ conversationId: null, error: "Failed to fetch conversation" })
    }

    return successEnvelope({ conversationId: conversation?.id || null })
  } catch {
    return errorEnvelope({ conversationId: null, error: UNEXPECTED_ERROR })
  }
}

/**
 * Get detailed order information for a buyer
 */
export async function getBuyerOrderDetails(
  orderId: string
): Promise<BuyerOrderDetailsResult> {
  const parsedOrderId = OrderIdSchema.safeParse(orderId)
  if (!parsedOrderId.success) {
    return errorEnvelope({ order: null, error: "Invalid orderId" })
  }

  try {
    const auth = await requireAuth()
    if (!auth) {
      return errorEnvelope({ order: null, error: NOT_AUTHENTICATED_ERROR })
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
      return errorEnvelope({ order: null, error: "Order not found" })
    }

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
