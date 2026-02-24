import type { OrderItemStatus } from "@/lib/order-status"
import type { OrderStatusActionsServerActions } from "./order-status-actions"
import type { SellerRateBuyerActionsServerActions } from "./seller-rate-buyer-actions"

export type SellerOrderItem = {
  id: string
  order_id: string
  seller_id: string
  quantity: number
  price_at_purchase: number
  status: OrderItemStatus
  tracking_number: string | null
  shipping_carrier: string | null
  created_at: string
  product?: {
    id: string
    title: string
    images: string[]
    slug?: string | null
  }
  order?: {
    id: string
    user_id: string
    total_amount: number
    status: string
    shipping_address: {
      name?: string
      email?: string
      address?: {
        line1?: string
        line2?: string
        city?: string
        state?: string
        postal_code?: string
        country?: string
      }
    } | null
    created_at: string
  }
  buyer?: {
    id: string
    full_name: string | null
    email: string | null
    avatar_url: string | null
  }
}

export type SellerOrdersStats = {
  pending: number
  received: number
  processing: number
  shipped: number
  delivered: number
  cancelled: number
  total: number
}

export const SELLER_ORDERS_PAGE_SIZE = 10

export type SellerOrdersClientServerActions = OrderStatusActionsServerActions &
  SellerRateBuyerActionsServerActions & {
    getSellerOrders: (
      statusFilter?: OrderItemStatus | "all" | "active",
      page?: number,
      pageSize?: number,
    ) => Promise<{
      orders: SellerOrderItem[]
      currentPage: number
      pageSize: number
      totalPages: number
      totalItems: number
      error?: string
    }>
    getSellerOrderStats: () => Promise<SellerOrdersStats>
    getOrderConversation: (
      orderId: string,
      sellerId: string,
    ) => Promise<{ conversationId: string | null; error?: string }>
  }

export type SellerOrdersClientProps = {
  locale: string
  sellerUsername: string | null
  actions: SellerOrdersClientServerActions
}

export type StatusFilter = OrderItemStatus | "all" | "active"

export type SellerOrdersCopy = {
  headerTitle: string
  headerDescription: string
  refresh: string
  tabs: {
    active: string
  }
  empty: {
    title: string
    allDescription: string
    statusDescription: (statusLabel: string) => string
  }
  item: {
    unknownProduct: string
    quantity: string
    unitMultiplier: string
    shipTo: string
    tracking: string
    ordered: string
    unknownUser: string
    unknownBuyer: string
    productImageAlt: string
  }
}
