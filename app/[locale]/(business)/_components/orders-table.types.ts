export interface OrderCustomer {
  id: string
  email?: string | null
  full_name: string | null
}

export interface OrderProduct {
  id: string
  title: string
  images: string[] | null
  sku: string | null
}

export interface Order {
  id: string
  status: string | null
  created_at: string
  shipping_address: Record<string, unknown> | null
  user: OrderCustomer | OrderCustomer[] | null
}

export interface OrderItem {
  id: string
  quantity: number
  price_at_purchase: number
  order_id: string
  product_id: string
  seller_id: string
  order: Order | Order[] | null
  product: OrderProduct | OrderProduct[] | null
  user?: { id: string; email?: string | null; full_name: string | null } | null
}

export interface OrdersTableProps {
  initialOrders: OrderItem[]
  total: number
  sellerId: string
}

export type OrderStatus =
  | "all"
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"

export type SortField = "created_at" | "total" | "customer"
export type SortOrder = "asc" | "desc"
