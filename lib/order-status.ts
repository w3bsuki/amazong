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

// Get available next statuses for seller
export function getNextStatusOptions(currentStatus: OrderItemStatus): OrderItemStatus[] {
  const statusOrder: OrderItemStatus[] = ["pending", "received", "processing", "shipped", "delivered"]
  const currentIndex = statusOrder.indexOf(currentStatus)
  
  if (currentIndex === -1 || currentIndex >= statusOrder.length - 1) {
    return []
  }
  
  // Can go to next status or skip to shipped (if received/processing)
  const next = statusOrder[currentIndex + 1]
  const options: OrderItemStatus[] = next ? [next] : []
  
  // Allow marking as cancelled from any non-delivered status
  if (currentStatus !== 'delivered' && currentStatus !== 'cancelled') {
    options.push("cancelled")
  }
  
  return options
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
