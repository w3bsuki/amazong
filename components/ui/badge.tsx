import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/**
 * Badge Variants - Professional E-commerce Design System
 * 
 * Design principles (eBay/Amazon inspired):
 * - Neutral gray for informational badges (condition, category)
 * - Solid dark bg + white text for high-contrast primary info
 * - Light tinted bg + dark contrasting text for status (WCAG AA compliant)
 * - Consistent 20px height, 2px border-radius
 * - No same-color text-on-tint patterns (poor contrast)
 */
const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-sm border px-1.5 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none",
  {
    variants: {
      variant: {
        // === CORE VARIANTS ===
        default:
          "border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
        destructive:
          "border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
        
        // === MARKETPLACE: CONDITION BADGES (Neutral, professional) ===
        // Solid dark bg + white text - maximum legibility like eBay
        condition:
          "border-transparent bg-foreground/90 text-background font-semibold uppercase tracking-wide text-2xs",
        // Promoted/Ad badge: warm but subtle
        promoted:
          "border-badge-promoted-border bg-badge-promoted-bg text-badge-promoted-text font-semibold uppercase tracking-wider text-2xs rounded-full px-2",
        // Neutral outline for secondary condition display
        "condition-outline":
          "border-border bg-background text-foreground font-medium",
        
        // === MARKETPLACE: SHIPPING BADGES ===
        // Free shipping: semantic success / badge shipping tokens
        shipping:
          "border-badge-shipping-border bg-badge-shipping-bg text-badge-shipping-text",
        // Express: semantic info
        "shipping-express":
          "border-info/20 bg-info/10 text-info",
        
        // === MARKETPLACE: STOCK STATUS BADGES ===
        // In stock: semantic success
        "stock-available":
          "border-success/20 bg-success/10 text-success",
        // Low stock: semantic warning
        "stock-low":
          "border-warning/20 bg-warning/10 text-warning",
        // Out of stock: Neutral gray - disabled feel
        "stock-out":
          "border-border bg-muted text-muted-foreground",
        
        // === MARKETPLACE: DEAL/SALE BADGES ===
        // Deal: semantic deal token
        deal:
          "border-transparent bg-deal text-white font-semibold",
        // Sale: lighter deal tint
        sale:
          "border-deal/20 bg-deal/10 text-deal",
        
        // === MARKETPLACE: TRUST BADGES ===
        verified:
          "border-verified/20 bg-verified/10 text-verified",
        "top-rated":
          "border-warning/20 bg-warning/10 text-warning",
        
        // === MARKETPLACE: CATEGORY/INFO BADGES ===
        // Neutral for category/attribute info
        info:
          "border-border bg-muted text-foreground",
        // Category badge - NEUTRAL with high contrast (no blue-on-blue!)
        category:
          "border-category-badge-border bg-category-badge-bg text-category-badge-text",
        
        // === PROFESSIONAL MOBILE BADGES (high contrast, no gradients) ===
        // Condition - most important, high contrast
        "condition-pro":
          "border-badge-condition-border bg-badge-condition-bg text-badge-condition-text font-semibold",
        // Shipping - secondary, subtle
        "shipping-pro":
          "border-badge-shipping-border bg-badge-shipping-bg text-badge-shipping-text",
        // Stock urgency - amber attention
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
 * Badge with optional dot indicator
 * Dot adds a small colored circle before text for status indication
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

/**
 * Dot indicator for badge status
 * Use inside a badge for status indication
 */
function BadgeDot({ className }: { className?: string }) {
  return (
    <span 
      className={cn("size-1.5 rounded-full bg-current", className)} 
      aria-hidden="true" 
    />
  )
}

export { Badge, BadgeDot, badgeVariants }
