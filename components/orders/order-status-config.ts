import type { OrderItemStatus } from "@/lib/order-status"

export interface OrderItemStatusConfig {
  labelKey: string
  descriptionKey: string
  color: string
  bgColor: string
  borderColor: string
  icon: string
  nextStatus?: OrderItemStatus
  nextActionKey?: string
}

export const ORDER_STATUS_CONFIG: Record<OrderItemStatus, OrderItemStatusConfig> = {
  pending: {
    labelKey: "status.pending.label",
    descriptionKey: "status.pending.description",
    color: "text-order-pending",
    bgColor: "bg-order-pending/10",
    borderColor: "border-order-pending/25",
    icon: "⏳",
    nextStatus: "received",
    nextActionKey: "actions.markAsReceived",
  },
  received: {
    labelKey: "status.received.label",
    descriptionKey: "status.received.description",
    color: "text-order-received",
    bgColor: "bg-order-received/10",
    borderColor: "border-order-received/25",
    icon: "✅",
    nextStatus: "processing",
    nextActionKey: "actions.startProcessing",
  },
  processing: {
    labelKey: "status.processing.label",
    descriptionKey: "status.processing.description",
    color: "text-order-processing",
    bgColor: "bg-order-processing/10",
    borderColor: "border-order-processing/25",
    icon: "📦",
    nextStatus: "shipped",
    nextActionKey: "actions.markAsShipped",
  },
  shipped: {
    labelKey: "status.shipped.label",
    descriptionKey: "status.shipped.description",
    color: "text-order-shipped",
    bgColor: "bg-order-shipped/10",
    borderColor: "border-order-shipped/25",
    icon: "🚚",
    nextStatus: "delivered",
    nextActionKey: "actions.markAsDelivered",
  },
  delivered: {
    labelKey: "status.delivered.label",
    descriptionKey: "status.delivered.description",
    color: "text-order-delivered",
    bgColor: "bg-order-delivered/10",
    borderColor: "border-order-delivered/25",
    icon: "🎉",
  },
  cancelled: {
    labelKey: "status.cancelled.label",
    descriptionKey: "status.cancelled.description",
    color: "text-order-cancelled",
    bgColor: "bg-order-cancelled/10",
    borderColor: "border-order-cancelled/25",
    icon: "❌",
  },
}

