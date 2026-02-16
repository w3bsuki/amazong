export type OrderItemStatus =
  | "pending"
  | "received"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"

export type OrderStatusKey =
  | "pending"
  | "paid"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"

export function getOrderStatusFromItems(
  statuses: Array<OrderItemStatus | null | undefined>,
  fallback?: OrderStatusKey | null
): OrderStatusKey {
  const normalized = statuses.filter(Boolean) as OrderItemStatus[]
  if (normalized.length === 0) return fallback ?? 'pending'

  const active = normalized.filter((s) => s !== 'cancelled')
  if (active.length === 0) return 'cancelled'

  if (active.every((s) => s === 'delivered')) return 'delivered'
  if (active.some((s) => s === 'shipped' || s === 'delivered')) return 'shipped'
  if (active.some((s) => s === 'processing' || s === 'received')) return 'processing'

  return 'pending'
}

// Check if status can be updated by seller
export function canSellerUpdateStatus(currentStatus: OrderItemStatus): boolean {
  return ["pending", "received", "processing", "shipped"].includes(currentStatus)
}

const ORDER_STATUS_TRANSITIONS: Record<OrderItemStatus, OrderItemStatus[]> = {
  pending: ["received"],
  received: ["processing"],
  processing: ["shipped"],
  shipped: ["delivered"],
  delivered: [],
  cancelled: [],
}

/**
 * Returns available next statuses for manual seller transitions.
 */
export function getNextStatusOptions(currentStatus: OrderItemStatus): OrderItemStatus[] {
  return ORDER_STATUS_TRANSITIONS[currentStatus] ?? []
}

export const SHIPPING_CARRIER_VALUES = [
  "speedy",
  "econt",
  "dhl",
  "ups",
  "fedex",
  "bulgarian_posts",
  "other",
] as const

export type ShippingCarrier = (typeof SHIPPING_CARRIER_VALUES)[number]
