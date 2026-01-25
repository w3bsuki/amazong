import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/**
 * Professional E-commerce Badge System
 * 
 * Design principles (eBay/Amazon/Shopify inspired):
 * 
 * TWO-TIER SYSTEM for WCAG AA compliance (4.5:1 contrast):
 * 1. SOLID badges: Dark background + white text (high emphasis)
 * 2. SUBTLE badges: Tinted background + dark text (low emphasis)
 * 
 * NEVER use colored text on same-color tinted backgrounds!
 * 
 * Badge sizing: consistent height, proper spacing, readable text
 */
const badgeVariants = cva(
  "inline-flex items-center justify-center gap-1 rounded-sm border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 [&>svg]:shrink-0",
  {
    variants: {
      variant: {
        // ═══════════════════════════════════════════════════════════
        // CORE VARIANTS (shadcn defaults)
        // ═══════════════════════════════════════════════════════════
        default:
          "border-transparent bg-primary text-primary-foreground",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground",
        destructive:
          "border-transparent bg-destructive text-white",
        outline:
          "border-border bg-transparent text-foreground",
        
        // ═══════════════════════════════════════════════════════════
        // SEMANTIC STATUS - SOLID (white text on dark bg)
        // High emphasis for alerts, critical info
        // ═══════════════════════════════════════════════════════════
        success:
          "border-transparent bg-badge-success-solid text-white",
        warning:
          "border-transparent bg-badge-warning-solid text-white",
        critical:
          "border-transparent bg-badge-critical-solid text-white",
        info:
          "border-transparent bg-badge-info-solid text-white",
        
        // ═══════════════════════════════════════════════════════════
        // SEMANTIC STATUS - SUBTLE (dark text on tinted bg)
        // Low emphasis for secondary info
        // ═══════════════════════════════════════════════════════════
        "success-subtle":
          "border-transparent bg-badge-success-subtle-bg text-badge-success-subtle-fg",
        "warning-subtle":
          "border-transparent bg-badge-warning-subtle-bg text-badge-warning-subtle-fg",
        "critical-subtle":
          "border-transparent bg-badge-critical-subtle-bg text-badge-critical-subtle-fg",
        "info-subtle":
          "border-transparent bg-badge-info-subtle-bg text-badge-info-subtle-fg",
        "neutral-subtle":
          "border-transparent bg-badge-neutral-subtle-bg text-badge-neutral-subtle-fg",

        // ═══════════════════════════════════════════════════════════
        // CONDITION BADGES - SOLID (white text for max contrast)
        // Professional marketplace look like eBay
        // ═══════════════════════════════════════════════════════════
        "condition-new":
          "border-transparent bg-badge-condition-new text-white font-semibold uppercase tracking-wider text-[10px]",
        "condition-likenew":
          "border-transparent bg-badge-condition-likenew text-white font-semibold uppercase tracking-wider text-[10px]",
        "condition-good":
          "border-transparent bg-badge-condition-good text-white font-semibold uppercase tracking-wider text-[10px]",
        "condition-fair":
          "border-transparent bg-badge-condition-fair text-white font-semibold uppercase tracking-wider text-[10px]",
        "condition-used":
          "border-transparent bg-badge-condition-used text-white font-semibold uppercase tracking-wider text-[10px]",
        "condition-refurb":
          "border-transparent bg-badge-condition-refurb text-white font-semibold uppercase tracking-wider text-[10px]",
        
        // Generic condition (backward compat)
        condition:
          "border-transparent bg-foreground text-background font-semibold uppercase tracking-wider text-[10px]",
        "condition-outline":
          "border-border bg-background text-foreground font-medium",

        // ═══════════════════════════════════════════════════════════
        // SHIPPING BADGES
        // ═══════════════════════════════════════════════════════════
        // Solid green for emphasis
        shipping:
          "border-transparent bg-badge-success-solid text-white",
        // Subtle for secondary
        "shipping-subtle":
          "border-badge-shipping-border bg-badge-shipping-bg text-badge-shipping-text",
        // Express - info blue solid
        "shipping-express":
          "border-transparent bg-badge-info-solid text-white",

        // ═══════════════════════════════════════════════════════════
        // STOCK STATUS BADGES
        // ═══════════════════════════════════════════════════════════
        // Solid success
        "stock-available":
          "border-transparent bg-badge-success-solid text-white",
        // Subtle warning
        "stock-low":
          "border-badge-stock-border bg-badge-stock-bg text-badge-stock-text font-medium",
        // Solid critical for out of stock
        "stock-out":
          "border-transparent bg-badge-neutral-solid text-white",

        // ═══════════════════════════════════════════════════════════
        // DEAL/SALE BADGES
        // ═══════════════════════════════════════════════════════════
        deal:
          "border-transparent bg-deal text-white font-semibold",
        sale:
          "border-transparent bg-badge-critical-solid text-white font-semibold",
        promoted:
          "border-badge-promoted-border bg-badge-promoted-bg text-badge-promoted-text font-medium",

        // ═══════════════════════════════════════════════════════════
        // TRUST BADGES
        // ═══════════════════════════════════════════════════════════
        verified:
          "border-transparent bg-badge-info-solid text-white",
        "top-rated":
          "border-transparent bg-badge-warning-solid text-white",

        // ═══════════════════════════════════════════════════════════
        // CATEGORY/INFO BADGES (neutral, low emphasis)
        // ═══════════════════════════════════════════════════════════
        category:
          "border-border bg-muted text-foreground",
        
        // ═══════════════════════════════════════════════════════════
        // LEGACY COMPAT (map to new system)
        // ═══════════════════════════════════════════════════════════
        "condition-pro": 
          "border-transparent bg-foreground text-background font-semibold uppercase tracking-wider text-[10px]",
        "shipping-pro":
          "border-transparent bg-badge-success-solid text-white",
        "stock-urgent":
          "border-badge-stock-border bg-badge-stock-bg text-badge-stock-text font-semibold",
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
