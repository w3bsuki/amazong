import {
  Check as IconCheck,
  Package as IconPackage,
  RefreshCw as IconRefresh,
  Truck as IconTruck,
  X as IconX,
} from "lucide-react"

export interface OrderProduct {
  id: string
  title: string
  images: string[] | null
  sku: string | null
  price: number
}

export interface OrderItem {
  id: string
  quantity: number
  price_at_time: number
  status?: string | null
  tracking_number?: string | null
  shipping_carrier?: string | null
  product: OrderProduct | OrderProduct[] | null
}

export interface OrderCustomer {
  id: string
  email: string | null
  full_name: string | null
  phone: string | null
}

export interface Order {
  id: string
  status: string | null
  created_at: string
  total_amount?: number
  shipping_address: Record<string, unknown> | null
  user: OrderCustomer | OrderCustomer[] | null
}

export interface OrderDetailViewProps {
  order: Order
  items: OrderItem[]
  subtotal: number
  sellerId: string
}

export const STATUS_CONFIG = {
  pending: {
    label: "Unfulfilled",
    color: "bg-muted text-foreground border-border",
    icon: IconPackage,
    nextStatus: "processing",
  },
  paid: {
    label: "Paid",
    color: "bg-success/10 text-success border-success/20",
    icon: IconCheck,
    nextStatus: "processing",
  },
  processing: {
    label: "Processing",
    color: "bg-selected text-primary border-selected-border",
    icon: IconRefresh,
    nextStatus: "shipped",
  },
  shipped: {
    label: "Shipped",
    color: "bg-muted text-foreground border-border",
    icon: IconTruck,
    nextStatus: "delivered",
  },
  delivered: {
    label: "Delivered",
    color: "bg-success/10 text-success border-success/20",
    icon: IconCheck,
    nextStatus: undefined,
  },
  cancelled: {
    label: "Cancelled",
    color: "bg-destructive-subtle text-destructive border-destructive/20",
    icon: IconX,
    nextStatus: undefined,
  },
} as const

export type StatusKey = keyof typeof STATUS_CONFIG

export function getStatusConfig(status: string): (typeof STATUS_CONFIG)[StatusKey] {
  if (status in STATUS_CONFIG) return STATUS_CONFIG[status as StatusKey]
  return STATUS_CONFIG.pending
}

export function getProduct(item: OrderItem): OrderProduct | null {
  if (!item.product) return null
  return Array.isArray(item.product) ? (item.product.at(0) ?? null) : item.product
}

export function getCustomer(order: Order): OrderCustomer | null {
  if (!order.user) return null
  return Array.isArray(order.user) ? (order.user.at(0) ?? null) : order.user
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("bg-BG", {
    style: "currency",
    currency: "BGN",
    maximumFractionDigits: 2,
  }).format(value)
}

export function formatAddress(address: Record<string, unknown> | null) {
  if (!address) return null
  const parts = [
    address.street as string,
    address.city as string,
    address.state as string,
    address.postal_code as string,
    address.country as string,
  ].filter(Boolean)
  return parts.join(", ")
}
