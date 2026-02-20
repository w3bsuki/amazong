import type { OrderItemStatus } from "@/lib/order-status"

export interface OrderDetailItem {
  id: string
  order_id: string
  product_id: string
  seller_id: string
  quantity: number
  price_at_purchase: number
  status: OrderItemStatus | null
  seller_received_at: string | null
  tracking_number: string | null
  shipping_carrier: string | null
  shipped_at: string | null
  delivered_at: string | null
  product: {
    id: string
    title: string
    slug: string | null
    images: string[] | null
    price: number
  } | null
  seller: {
    id: string
    store_name: string
    username?: string | null
    profile?: {
      full_name: string | null
      avatar_url: string | null
    }
  } | null
}

export interface OrderDetailOrder {
  id: string
  user_id: string
  total_amount: number
  status: string | null
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
  stripe_payment_intent_id: string | null
  order_items: OrderDetailItem[]
}
