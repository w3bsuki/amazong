import { cn } from "@/lib/utils"
import { ORDER_STATUS_CONFIG } from "./order-status-config"
import type { OrderItemStatus } from "@/lib/order-status"
import { useTranslations } from "next-intl"

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
  const t = useTranslations("Orders")
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
      <span>{t(config.labelKey)}</span>
    </span>
  )
}

