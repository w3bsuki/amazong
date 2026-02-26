import { errorEnvelope, successEnvelope } from "@/lib/api/envelope"
import type { OrderItemStatus } from "@/lib/order-status"
import {
  fetchProfilesByIds,
  fetchSellerOrderItemsPage,
  fetchSellerOrderItemStatuses,
} from "@/lib/data/orders/reads"
import type { OrderItem } from "@/lib/types/order-item"
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

import { logger } from "@/lib/logger"
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

    const orderItemsResult = await fetchSellerOrderItemsPage({
      supabase,
      sellerId: userId,
      statusFilter: parsedStatusFilter.data,
      offset,
      to,
    })

    if (!orderItemsResult.ok) {
      logger.error("[orders-reads] get_seller_orders_fetch_failed", orderItemsResult.error, {
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
      ...new Set(
        orderItemsResult.items
          .map((item) => {
            const order = item.order
            if (typeof order !== "object" || order === null || Array.isArray(order)) return null
            const userIdValue = (order as { user_id?: unknown }).user_id
            return typeof userIdValue === "string" ? userIdValue : null
          })
          .filter((buyerId): buyerId is string => buyerId !== null)
      ),
    ]

    const buyersMap = new Map<string, { id: string; full_name: string | null; avatar_url: string | null }>()

    if (buyerIds.length > 0) {
      const buyersResult = await fetchProfilesByIds({ supabase, userIds: buyerIds })
      if (buyersResult.ok) {
        buyersResult.profiles.forEach((buyer) => {
          buyersMap.set(buyer.id, buyer)
        })
      }
    }

    const ordersWithBuyers = orderItemsResult.items.map((item) => {
      const orderValue = item.order
      const order =
        typeof orderValue === "object" && orderValue !== null && !Array.isArray(orderValue)
          ? (orderValue as Record<string, unknown>)
          : null

      const createdAtValue = order?.created_at
      const createdAt = typeof createdAtValue === "string" ? createdAtValue : new Date().toISOString()

      const buyerIdValue = order?.user_id
      const buyerId = typeof buyerIdValue === "string" ? buyerIdValue : null

      const shippingAddressValue = order?.shipping_address
      const shippingAddress =
        typeof shippingAddressValue === "object" &&
        shippingAddressValue !== null &&
        !Array.isArray(shippingAddressValue)
          ? (shippingAddressValue as Record<string, unknown>)
          : null

      const emailValue = shippingAddress?.email
      const email = typeof emailValue === "string" ? emailValue : null

      const base = buyerId ? buyersMap.get(buyerId) : undefined

      return {
        ...item,
        created_at: createdAt,
        buyer:
          buyerId === null
            ? undefined
            : {
                id: buyerId,
                full_name: base?.full_name ?? null,
                email,
                avatar_url: base?.avatar_url ?? null,
              },
      }
    })

    const totalItems = orderItemsResult.count
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

    const statusesResult = await fetchSellerOrderItemStatuses({ supabase, sellerId: userId })
    if (!statusesResult.ok) return successEnvelope(defaultStats)

    const orderItems = statusesResult.statuses

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
