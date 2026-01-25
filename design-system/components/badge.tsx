/**
 * Badge Component - Reference Implementation
 * 
 * Comprehensive badge system for marketplace use cases:
 * - Status badges (success, warning, error, info)
 * - Condition badges (new, like new, good, fair, used, refurbished)
 * - Shipping badges
 * - Order status badges
 */

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center gap-1 font-medium transition-colors",
  {
    variants: {
      variant: {
        // === STATUS BADGES (Solid - High Emphasis) ===
        default: "bg-primary text-primary-foreground",
        success: "bg-badge-success-solid text-badge-fg-on-solid",
        warning: "bg-badge-warning-solid text-badge-fg-on-solid",
        error: "bg-badge-critical-solid text-badge-fg-on-solid",
        info: "bg-badge-info-solid text-badge-fg-on-solid",
        neutral: "bg-badge-neutral-solid text-badge-fg-on-solid",
        
        // === STATUS BADGES (Subtle - Low Emphasis) ===
        "success-subtle": "bg-badge-success-subtle-bg text-badge-success-subtle-fg",
        "warning-subtle": "bg-badge-warning-subtle-bg text-badge-warning-subtle-fg",
        "error-subtle": "bg-badge-critical-subtle-bg text-badge-critical-subtle-fg",
        "info-subtle": "bg-badge-info-subtle-bg text-badge-info-subtle-fg",
        "neutral-subtle": "bg-badge-neutral-subtle-bg text-badge-neutral-subtle-fg",
        
        // === CONDITION BADGES ===
        "condition-new": "bg-badge-condition-new text-white",
        "condition-likenew": "bg-badge-condition-likenew text-white",
        "condition-good": "bg-badge-condition-good text-white",
        "condition-fair": "bg-badge-condition-fair text-white",
        "condition-used": "bg-badge-condition-used text-white",
        "condition-refurb": "bg-badge-condition-refurb text-white",
        
        // === SPECIAL BADGES ===
        shipping: "bg-badge-shipping-bg text-badge-shipping-text border border-badge-shipping-border",
        stock: "bg-badge-stock-bg text-badge-stock-text border border-badge-stock-border",
        promoted: "bg-badge-promoted-bg text-badge-promoted-text border border-badge-promoted-border",
        featured: "bg-primary text-primary-foreground",
        
        // === ORDER STATUS ===
        "order-pending": "bg-badge-warning-subtle-bg text-badge-warning-subtle-fg",
        "order-processing": "bg-badge-info-subtle-bg text-badge-info-subtle-fg",
        "order-shipped": "bg-badge-info-subtle-bg text-order-shipped",
        "order-delivered": "bg-badge-success-subtle-bg text-badge-success-subtle-fg",
        "order-cancelled": "bg-badge-critical-subtle-bg text-badge-critical-subtle-fg",
        
        // === OUTLINE ===
        outline: "border border-border bg-transparent text-foreground",
      },
      size: {
        default: "text-xs px-2.5 py-0.5 rounded-full",
        sm: "text-[10px] px-2 py-0.5 rounded-full",
        lg: "text-sm px-3 py-1 rounded-full",
        // Condition badges are typically square-ish
        condition: "text-[10px] px-1.5 py-0.5 rounded uppercase tracking-wide font-semibold",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  icon?: React.ReactNode
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant, size, icon, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(badgeVariants({ variant, size, className }))}
        {...props}
      >
        {icon && <span className="shrink-0">{icon}</span>}
        {children}
      </div>
    )
  }
)
Badge.displayName = "Badge"

// === CONVENIENCE COMPONENTS ===

export const ConditionBadge = React.forwardRef<
  HTMLDivElement,
  Omit<BadgeProps, 'variant' | 'size'> & {
    condition: 'new' | 'likenew' | 'good' | 'fair' | 'used' | 'refurb'
  }
>(({ condition, ...props }, ref) => (
  <Badge
    ref={ref}
    variant={`condition-${condition}` as const}
    size="condition"
    {...props}
  />
))
ConditionBadge.displayName = "ConditionBadge"

export const StatusBadge = React.forwardRef<
  HTMLDivElement,
  Omit<BadgeProps, 'variant'> & {
    status: 'success' | 'warning' | 'error' | 'info' | 'neutral'
    subtle?: boolean
  }
>(({ status, subtle = false, ...props }, ref) => (
  <Badge
    ref={ref}
    variant={subtle ? `${status}-subtle` as const : status}
    {...props}
  />
))
StatusBadge.displayName = "StatusBadge"

export const OrderStatusBadge = React.forwardRef<
  HTMLDivElement,
  Omit<BadgeProps, 'variant'> & {
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  }
>(({ status, ...props }, ref) => (
  <Badge
    ref={ref}
    variant={`order-${status}` as const}
    {...props}
  />
))
OrderStatusBadge.displayName = "OrderStatusBadge"

export { Badge, badgeVariants }
