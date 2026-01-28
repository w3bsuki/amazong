import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/**
 * Professional E-commerce Badge System (B2B/C2C/C2B)
 * 
 * TIGHT COLOR PALETTE (industry standard):
 *   🔴 Red     — urgency, deals, limited time, sale
 *   🟠 Orange  — promotions, discounts (attention without alarm)
 *   🟢 Green   — success, shipping, in-stock, verified actions
 *   🔵 Blue    — trust, verified sellers, info (brand primary)
 *   🟡 Amber   — warnings, low stock, caution
 *   ⚫ Neutral — categories, ads, muted labels
 * 
 * THREE TIERS:
 *   SOLID   — colored bg + white text (high emphasis)
 *   OUTLINE — border + colored text + white bg (medium)
 *   MUTED   — gray bg + dark text (low emphasis)
 * 
 * NO gradients, NO glow, NO sparkles — flat, professional.
 */
const badgeVariants = cva(
  "inline-flex items-center justify-center gap-1 rounded-md border px-2 py-0.5 text-xs font-medium leading-tight w-fit whitespace-nowrap shrink-0 select-none transition-colors [&>svg]:size-3 [&>svg]:shrink-0",
  {
    variants: {
      variant: {
        // Base (shadcn-like)
        default: "border-transparent bg-foreground text-background",
        secondary: "border-transparent bg-muted text-muted-foreground",
        outline: "border-border bg-background text-muted-foreground",
        destructive: "border-transparent bg-destructive text-destructive-foreground",

        // Status (solid)
        success: "border-transparent bg-badge-success-solid text-badge-fg-on-solid",
        warning: "border-transparent bg-badge-warning-solid text-badge-fg-on-solid",
        critical: "border-transparent bg-badge-critical-solid text-badge-fg-on-solid",
        info: "border-transparent bg-badge-info-solid text-badge-fg-on-solid",

        // Status (subtle)
        "success-subtle": "border-transparent bg-badge-success-subtle-bg text-badge-success-subtle-fg",
        "warning-subtle": "border-transparent bg-badge-warning-subtle-bg text-badge-warning-subtle-fg",
        "critical-subtle": "border-transparent bg-badge-critical-subtle-bg text-badge-critical-subtle-fg",
        "info-subtle": "border-transparent bg-badge-info-subtle-bg text-badge-info-subtle-fg",
        "neutral-subtle": "border-transparent bg-badge-neutral-subtle-bg text-badge-neutral-subtle-fg",

        // Product condition (C2C marketplace)
        "condition-new": "border-transparent bg-badge-condition-new text-badge-fg-on-solid font-semibold",
        "condition-likenew": "border-transparent bg-badge-condition-likenew text-badge-fg-on-solid",
        "condition-good": "border-transparent bg-badge-condition-good text-badge-fg-on-solid",
        "condition-fair": "border-transparent bg-badge-condition-fair text-badge-fg-on-solid",
        "condition-used": "border-transparent bg-badge-condition-used text-badge-fg-on-solid",
        "condition-refurb": "border-transparent bg-badge-condition-refurb text-badge-fg-on-solid",
        condition: "border-badge-condition-border bg-badge-condition-bg text-badge-condition-text font-medium",
        "condition-outline": "border-badge-condition-border bg-badge-condition-bg text-badge-condition-text",

        // Shipping & delivery
        shipping: "border-transparent bg-badge-success-solid text-badge-fg-on-solid",
        "shipping-subtle": "border-badge-shipping-border bg-badge-shipping-bg text-badge-shipping-text",
        "shipping-express": "border-transparent bg-badge-info-solid text-badge-fg-on-solid",

        // Stock status
        "stock-available": "border-transparent bg-badge-success-subtle-bg text-badge-success-subtle-fg",
        "stock-low": "border-badge-stock-border bg-badge-stock-bg text-badge-stock-text font-medium",
        "stock-out": "border-border bg-muted text-muted-foreground line-through",

        // Deals & promotions
        promo: "border-transparent bg-badge-warning-solid text-badge-fg-on-solid font-semibold",
        discount: "border-transparent bg-badge-warning-solid text-badge-fg-on-solid font-bold tabular-nums",
        deal: "border-transparent bg-deal text-deal-foreground font-semibold",
        sale: "border-transparent bg-deal text-deal-foreground font-semibold",
        "limited-time": "border-transparent bg-deal text-deal-foreground font-semibold",
        promoted: "border-badge-promoted-border bg-badge-promoted-bg text-badge-promoted-text",
        sponsored: "border-badge-promoted-border bg-badge-promoted-bg text-badge-promoted-text",

        // Trust & verification
        verified: "border-transparent bg-badge-info-subtle-bg text-badge-info-subtle-fg",
        "verified-solid": "border-transparent bg-badge-info-solid text-badge-fg-on-solid",
        "top-rated": "border-transparent bg-badge-warning-subtle-bg text-badge-warning-subtle-fg",

        // Category/info
        category: "border-transparent bg-badge-neutral-subtle-bg text-badge-neutral-subtle-fg",

        // Legacy compat
        "condition-pro": "border-transparent bg-foreground text-background font-semibold tracking-wide",
        "shipping-pro": "border-transparent bg-badge-success-solid text-badge-fg-on-solid",
        "stock-urgent": "border-badge-stock-border bg-badge-stock-bg text-badge-stock-text font-semibold",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

/**
 * Badge component for marketplace use cases
 */
function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span"

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
