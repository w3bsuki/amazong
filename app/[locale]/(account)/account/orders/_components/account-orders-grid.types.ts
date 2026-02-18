import type { BuyerOrderActionsServerActions } from "./buyer-order-actions"
import type { OrderItemStatus } from "@/lib/order-status"

export type OrderStatus =
  | "pending"
  | "processing"
  | "paid"
  | "shipped"
  | "delivered"
  | "cancelled"
  | string

export type OrderProduct = {
  id: string
  title: string | null
  images: string[] | null
  slug?: string | null
  price?: number | null
}

export type OrderItemRow = {
  id: string
  product_id: string
  seller_id?: string
  seller_username?: string | null
  quantity: number
  price_at_purchase?: number
  product?: OrderProduct | null
  status?: OrderItemStatus
  tracking_number?: string | null
  shipping_carrier?: string | null
  shipped_at?: string | null
}

export type OrderRow = {
  id: string
  created_at: string
  status: OrderStatus | null
  fulfillment_status?: OrderStatus | null
  total_amount: number | string | null
  order_items: OrderItemRow[]
}

export type AccountOrdersGridServerActions = BuyerOrderActionsServerActions & {
  getOrderConversation: (
    orderId: string,
    sellerId: string
  ) => Promise<{ conversationId: string | null; error?: string }>
}

export interface AccountOrdersGridProps {
  orders: OrderRow[]
  locale: string
  actions: AccountOrdersGridServerActions
}
