import { errorEnvelope, successEnvelope } from "@/lib/api/envelope"
import { logger } from "@/lib/logger"
import type { OrderItemStatus } from "@/lib/order-status"
import {
  ORDER_ITEM_LIST_SELECT,
  type OrderItem,
} from "./orders-shared"
import {
  NOT_AUTHENTICATED_ERROR,
  PositiveIntegerSchema,
  SellerOrdersStatusFilterSchema,
  UNEXPECTED_ERROR,
  SELLER_ORDERS_DEFAULT_PAGE_SIZE,
  requireOrdersReadAuth,
  type SellerOrderStats,
  type SellerOrderStatsResult,
  type SellerOrdersStatusFilter,
  type SellerOrdersReadResult,
} from "./orders-reads-shared"

export async function getSellerOrdersImpl(
  statusFilter?: SellerOrdersStatusFilter,
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
    const authResult = await requireOrdersReadAuth(() =>
      errorEnvelope({
        orders: [],
        currentPage: parsedPage.data,
        pageSize: parsedPageSize.data,
        totalPages: 1,
        totalItems: 0,
        error: NOT_AUTHENTICATED_ERROR,
      })
    )
    if (!authResult.success) {
      return authResult.failure
    }
    const { userId, supabase } = authResult
    const offset = (parsedPage.data - 1) * parsedPageSize.data
    const to = offset + parsedPageSize.data - 1

    let query = supabase
      .from("order_items")
      .select(ORDER_ITEM_LIST_SELECT, { count: "exact" })
      .eq("seller_id", userId)
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
        sellerId: userId,
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

export async function getSellerOrderStatsImpl(): Promise<SellerOrderStatsResult> {
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
    const authResult = await requireOrdersReadAuth(() =>
      errorEnvelope({ ...defaultStats, error: NOT_AUTHENTICATED_ERROR })
    )
    if (!authResult.success) {
      return authResult.failure
    }
    const { userId, supabase } = authResult

    const { data: orderItems } = await supabase
      .from("order_items")
      .select("status")
      .eq("seller_id", userId)

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
