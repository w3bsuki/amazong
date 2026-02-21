import type { OrderStatusKey } from "@/lib/order-status"
import type { OrderItemRow } from "./account-orders-grid.types"

const ORDER_STATUS_KEYS = [
  "pending",
  "paid",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
] as const

export function isOrderStatusKey(value: unknown): value is OrderStatusKey {
  return typeof value === "string" && ORDER_STATUS_KEYS.includes(value as (typeof ORDER_STATUS_KEYS)[number])
}

export function formatOrderCurrency(value: number, locale: string) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: locale === "bg" ? "BGN" : "EUR",
    maximumFractionDigits: 2,
  }).format(value)
}

export function getProductHref(item: OrderItemRow) {
  if (!item.seller_username) return "#"
  return `/${item.seller_username}/${item.product?.slug || item.product_id}`
}
