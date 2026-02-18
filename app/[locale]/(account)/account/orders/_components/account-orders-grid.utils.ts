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

export function getOrderGridText(locale: string) {
  return {
    order: locale === "bg" ? "Поръчка" : "Order",
    items: locale === "bg" ? "артикула" : "items",
    item: locale === "bg" ? "артикул" : "item",
    viewOrder: locale === "bg" ? "Виж поръчката" : "View order",
    orderDetails: locale === "bg" ? "Детайли за поръчката" : "Order Details",
    placed: locale === "bg" ? "Направена" : "Placed",
    status: locale === "bg" ? "Статус" : "Status",
    total: locale === "bg" ? "Общо" : "Total",
    qty: locale === "bg" ? "Количество" : "Qty",
    viewProduct: locale === "bg" ? "Виж продукта" : "View product",
    noOrders: locale === "bg" ? "Няма поръчки" : "No orders found",
    noOrdersDesc:
      locale === "bg"
        ? "Когато направите поръчка, тя ще се появи тук."
        : "When you place an order, it will appear here.",
    startShopping: locale === "bg" ? "Към магазина" : "Start shopping",
  }
}
