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
        // ═══════════════════════════════════════════════════════════
        // BASE VARIANTS (shadcn defaults)
        // ═══════════════════════════════════════════════════════════
        default:
          "border-transparent bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900",
        secondary:
          "border-transparent bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300",
        outline:
          "border-neutral-300 bg-white text-neutral-700 dark:border-neutral-600 dark:bg-neutral-900 dark:text-neutral-300",
        destructive:
          "border-transparent bg-red-600 text-white",
        
        // ═══════════════════════════════════════════════════════════
        // STATUS - SOLID (high emphasis alerts)
        // ═══════════════════════════════════════════════════════════
        success:
          "border-transparent bg-emerald-600 text-white",
        warning:
          "border-transparent bg-amber-500 text-white",
        critical:
          "border-transparent bg-red-600 text-white",
        info:
          "border-transparent bg-blue-600 text-white",
        
        // ═══════════════════════════════════════════════════════════
        // STATUS - OUTLINE (eBay/Vinted style — clean, professional)
        // Border matches text, white background
        // ═══════════════════════════════════════════════════════════
        "success-subtle":
          "border-emerald-500 bg-white text-emerald-600 dark:border-emerald-500 dark:bg-neutral-900 dark:text-emerald-400",
        "warning-subtle":
          "border-amber-500 bg-white text-amber-600 dark:border-amber-500 dark:bg-neutral-900 dark:text-amber-400",
        "critical-subtle":
          "border-red-500 bg-white text-red-600 dark:border-red-500 dark:bg-neutral-900 dark:text-red-400",
        "info-subtle":
          "border-blue-500 bg-white text-blue-600 dark:border-blue-500 dark:bg-neutral-900 dark:text-blue-400",
        "neutral-subtle":
          "border-neutral-300 bg-white text-neutral-600 dark:border-neutral-600 dark:bg-neutral-900 dark:text-neutral-400",

        // ═══════════════════════════════════════════════════════════
        // PRODUCT CONDITION (C2C Marketplace)
        // eBay-style: Outline badges with semantic color hints
        // ═══════════════════════════════════════════════════════════
        "condition-new":
          "border-blue-500 bg-white text-blue-600 font-semibold dark:border-blue-500 dark:bg-neutral-900 dark:text-blue-400",
        "condition-likenew":
          "border-emerald-500 bg-white text-emerald-600 dark:border-emerald-500 dark:bg-neutral-900 dark:text-emerald-400",
        "condition-good":
          "border-teal-500 bg-white text-teal-600 dark:border-teal-500 dark:bg-neutral-900 dark:text-teal-400",
        "condition-fair":
          "border-amber-500 bg-white text-amber-600 dark:border-amber-500 dark:bg-neutral-900 dark:text-amber-400",
        "condition-used":
          "border-neutral-400 bg-white text-neutral-600 dark:border-neutral-500 dark:bg-neutral-900 dark:text-neutral-400",
        "condition-refurb":
          "border-violet-500 bg-white text-violet-600 dark:border-violet-500 dark:bg-neutral-900 dark:text-violet-400",
        
        // Generic condition (backward compat)
        condition:
          "border-neutral-400 bg-white text-neutral-700 font-medium dark:border-neutral-500 dark:bg-neutral-900 dark:text-neutral-300",
        "condition-outline":
          "border-neutral-300 bg-white text-neutral-700 dark:border-neutral-600 dark:bg-neutral-900 dark:text-neutral-300",

        // ═══════════════════════════════════════════════════════════
        // SHIPPING & DELIVERY — SOLID for emphasis
        // ═══════════════════════════════════════════════════════════
        shipping:
          "border-transparent bg-emerald-600 text-white",
        "shipping-subtle":
          "border-emerald-500 bg-white text-emerald-600 dark:border-emerald-500 dark:bg-neutral-900 dark:text-emerald-400",
        "shipping-express":
          "border-transparent bg-blue-600 text-white",

        // ═══════════════════════════════════════════════════════════
        // STOCK STATUS — Outline style for scannability
        // ═══════════════════════════════════════════════════════════
        "stock-available":
          "border-emerald-500 bg-white text-emerald-600 dark:border-emerald-500 dark:bg-neutral-900 dark:text-emerald-400",
        "stock-low":
          "border-amber-500 bg-white text-amber-600 font-medium dark:border-amber-500 dark:bg-neutral-900 dark:text-amber-400",
        "stock-out":
          "border-neutral-400 bg-neutral-100 text-neutral-500 line-through dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-500",

        // ═══════════════════════════════════════════════════════════
        // DEALS & PROMOTIONS — attention-grabbing
        // Tight palette: Red (urgency), Orange (promo), Neutral (ads)
        // ═══════════════════════════════════════════════════════════
        // Promo label - orange stands out without alarm
        promo:
          "border-transparent bg-orange-500 text-white font-semibold",
        // Discount percentage badge (e.g. -29%) - same orange family
        discount:
          "border-transparent bg-orange-500 text-white font-bold tabular-nums",
        // Deal/Sale: Red for urgency - universal "sale" color
        deal:
          "border-transparent bg-red-600 text-white font-semibold",
        sale:
          "border-transparent bg-red-600 text-white font-semibold",
        // Limited time - red with clock connotation
        "limited-time":
          "border-transparent bg-red-600 text-white font-semibold",
        // Promoted/Ad: Muted gray - shouldn't compete with content
        promoted:
          "border-neutral-300 bg-neutral-100 text-neutral-500 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-400",
        // Sponsored: Same as promoted
        sponsored:
          "border-neutral-300 bg-neutral-100 text-neutral-500 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-400",

        // ═══════════════════════════════════════════════════════════
        // TRUST & VERIFICATION — Uses brand primary (Twitter blue)
        // ═══════════════════════════════════════════════════════════
        verified:
          "border-sky-500 bg-sky-50 text-sky-600 dark:border-sky-500 dark:bg-sky-950 dark:text-sky-400",
        "verified-solid":
          "border-transparent bg-sky-500 text-white",
        "top-rated":
          "border-amber-500 bg-amber-50 text-amber-600 dark:border-amber-500 dark:bg-amber-950 dark:text-amber-400",

        // ═══════════════════════════════════════════════════════════
        // CATEGORY/INFO (muted, low emphasis)
        // ═══════════════════════════════════════════════════════════
        category:
          "border-neutral-200 bg-neutral-100 text-neutral-600 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-400",
        
        // ═══════════════════════════════════════════════════════════
        // LEGACY COMPAT
        // ═══════════════════════════════════════════════════════════
        "condition-pro": 
          "border-transparent bg-neutral-900 text-white font-semibold tracking-wide dark:bg-neutral-100 dark:text-neutral-900",
        "shipping-pro":
          "border-transparent bg-emerald-600 text-white",
        "stock-urgent":
          "border-amber-500 bg-white text-amber-600 font-semibold dark:border-amber-500 dark:bg-neutral-900 dark:text-amber-400",
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
