"use server"

import type { OrderItemStatus } from "@/lib/order-status"

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  seller_id: string
  quantity: number
  price_at_purchase: number
  status: OrderItemStatus
  seller_received_at: string | null
  shipped_at: string | null
  delivered_at: string | null
  tracking_number: string | null
  shipping_carrier: string | null
  created_at: string
  product?: {
    id: string
    title: string
    images: string[]
    slug: string
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

export const ORDER_ITEM_LIST_SELECT = `
  id,
  order_id,
  product_id,
  seller_id,
  quantity,
  price_at_purchase,
  status,
  seller_received_at,
  shipped_at,
  delivered_at,
  tracking_number,
  shipping_carrier,
  product:products(id, title, images, slug),
  order:orders(id, user_id, total_amount, status, shipping_address, created_at)
`

export const ORDER_ITEM_DETAIL_SELECT = `
  id,
  order_id,
  product_id,
  seller_id,
  quantity,
  price_at_purchase,
  status,
  seller_received_at,
  shipped_at,
  delivered_at,
  tracking_number,
  shipping_carrier,
  product:products(id, title, images, slug),
  seller:profiles!order_items_seller_id_fkey(id, full_name, avatar_url, username)
`

export type IssueType =
  | "not_received"
  | "wrong_item"
  | "damaged"
  | "not_as_described"
  | "missing_parts"
  | "other"

