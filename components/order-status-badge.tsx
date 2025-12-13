"use client"

import { cn } from "@/lib/utils"
import { ORDER_STATUS_CONFIG, type OrderItemStatus } from "@/lib/order-status"

interface OrderStatusBadgeProps {
  status: OrderItemStatus
  showIcon?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function OrderStatusBadge({ 
  status, 
  showIcon = true,
  size = 'md',
  className 
}: OrderStatusBadgeProps) {
  const config = ORDER_STATUS_CONFIG[status] || ORDER_STATUS_CONFIG.pending

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base'
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 font-medium rounded-full border",
        config.bgColor,
        config.color,
        config.borderColor,
        sizeClasses[size],
        className
      )}
    >
      {showIcon && <span className="shrink-0">{config.icon}</span>}
      <span>{config.label}</span>
    </span>
  )
}

// Compact version for tables
export function OrderStatusDot({ status }: { status: OrderItemStatus }) {
  const config = ORDER_STATUS_CONFIG[status] || ORDER_STATUS_CONFIG.pending
  
  const dotColors: Record<OrderItemStatus, string> = {
    pending: 'bg-yellow-500',
    received: 'bg-blue-500',
    processing: 'bg-indigo-500',
    shipped: 'bg-purple-500',
    delivered: 'bg-green-500',
    cancelled: 'bg-red-500',
  }

  return (
    <span className="inline-flex items-center gap-2">
      <span className={cn("w-2 h-2 rounded-full", dotColors[status])} />
      <span className="text-sm text-muted-foreground">{config.label}</span>
    </span>
  )
}
