import type {
  Order,
  OrderCustomer,
  OrderItem,
  OrderProduct,
} from "./orders-table.types"

export function getOrder(item: OrderItem): Order | null {
  if (!item.order) return null
  return Array.isArray(item.order) ? (item.order.at(0) ?? null) : item.order
}

export function getProduct(item: OrderItem): OrderProduct | null {
  if (!item.product) return null
  return Array.isArray(item.product) ? (item.product.at(0) ?? null) : item.product
}

export function getCustomer(order: Order | null): OrderCustomer | null {
  if (!order?.user) return null
  return Array.isArray(order.user) ? (order.user.at(0) ?? null) : order.user
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("bg-BG", {
    style: "currency",
    currency: "BGN",
    maximumFractionDigits: 2,
  }).format(value)
}
