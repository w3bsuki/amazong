import { SHIPPING_CARRIER_VALUES, type OrderStatusKey } from "@/lib/order-status"
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

type Translator = (key: string, values?: Record<string, string | number | Date>) => string

export function getOrderItemSummaryData(item: OrderItemRow, tAccount: Translator, tOrders: Translator) {
  const product = item.product
  const image = product?.images?.[0] || "/placeholder.svg"
  const title = product?.title || tAccount("ordersPage.card.productFallbackTitle")
  const href = getProductHref(item)
  const itemStatus = item.status || "pending"
  const carrierLabel = item.shipping_carrier
    ? SHIPPING_CARRIER_VALUES.includes(item.shipping_carrier as (typeof SHIPPING_CARRIER_VALUES)[number])
      ? tOrders(`shippingCarriers.${item.shipping_carrier}`)
      : item.shipping_carrier
    : null

  return { image, title, href, itemStatus, carrierLabel }
}
