import * as React from "react"

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const marketplaceVariantClassName = {
  // Condition
  "condition-new": "border-border bg-condition-new-bg text-condition-new",
  "condition-likenew": "border-border bg-condition-likenew-bg text-condition-likenew",
  "condition-good": "border-border bg-condition-good-bg text-condition-good",
  "condition-fair": "border-border bg-condition-fair-bg text-condition-fair",
  "condition-used": "border-border bg-condition-used-bg text-condition-used",
  "condition-refurb": "border-border bg-condition-refurb-bg text-condition-refurb",
  condition: "border-border bg-badge-condition-bg text-badge-condition-text",
  "condition-outline": "border-border bg-background text-foreground",

  // Shipping
  shipping: "border-border bg-badge-shipping-bg text-badge-shipping-text",
  "shipping-free": "border-border bg-success-subtle text-success",
  "shipping-subtle": "border-border bg-success-subtle text-success",
  "shipping-express": "border-transparent bg-warning text-warning-foreground",

  // Stock
  "stock-available": "border-border bg-success-subtle text-success",
  "stock-low": "border-border bg-badge-stock-bg text-badge-stock-text",
  "stock-out": "border-border bg-destructive-subtle text-destructive line-through",

  // Commerce
  promo: "border-transparent bg-destructive text-destructive-foreground",
  discount: "border-transparent bg-destructive text-destructive-foreground font-semibold tabular-nums",
  deal: "border-transparent bg-destructive text-destructive-foreground font-semibold",
  sale: "border-transparent bg-destructive text-destructive-foreground font-semibold",
  "limited-time": "border-transparent bg-destructive text-destructive-foreground font-semibold",
  price: "border-transparent bg-foreground text-background font-semibold tabular-nums",
  promoted: "border-transparent bg-promoted text-promoted-foreground font-semibold",
  sponsored: "border-transparent bg-promoted text-promoted-foreground font-semibold",

  // Trust
  "verified-business": "border-transparent bg-verified-business text-verified-business-foreground",
  "verified-personal": "border-transparent bg-verified-personal text-verified-personal-foreground",
  verified: "border-transparent bg-verified-personal text-verified-personal-foreground",
  "verified-solid": "border-transparent bg-verified-business text-verified-business-foreground",
  "top-rated": "border-transparent bg-top-rated text-top-rated-foreground",

  // Category
  category: "border-category-badge-border bg-category-badge-bg text-category-badge-text",

  // Backward-compatible aliases (cleanup-safe)
  "condition-pro": "border-border bg-background text-foreground font-semibold tracking-wide",
  "shipping-pro": "border-border bg-success-subtle text-success",
  "stock-urgent": "border-border bg-destructive-subtle text-destructive font-semibold",
} as const

type MarketplaceBadgeVariant = keyof typeof marketplaceVariantClassName

type MarketplaceBadgeProps = Omit<React.ComponentProps<typeof Badge>, "variant"> & {
  variant: MarketplaceBadgeVariant
}

export function MarketplaceBadge({
  variant,
  className,
  ...props
}: MarketplaceBadgeProps) {
  return (
    <Badge
      variant="default"
      className={cn(marketplaceVariantClassName[variant], className)}
      {...props}
    />
  )
}

