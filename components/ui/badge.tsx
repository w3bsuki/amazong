import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex w-fit shrink-0 select-none items-center justify-center whitespace-nowrap rounded-full border font-medium leading-none transition-colors [&>svg]:shrink-0",
  {
    variants: {
      size: {
        compact: "min-h-4.5 gap-1 px-1.5 text-2xs [&>svg]:size-2.5",
        default: "min-h-5 gap-1 px-2 text-2xs [&>svg]:size-3",
        prominent: "min-h-6 gap-1.5 px-2.5 text-xs [&>svg]:size-3.5",
      },
      variant: {
        // Base (shadcn-like)
        default: "border-transparent bg-secondary text-secondary-foreground",
        secondary: "border-border bg-muted text-muted-foreground",
        outline: "border-border bg-background text-foreground",
        glass: "border-border-subtle bg-surface-glass text-foreground backdrop-blur-sm font-semibold",
        destructive: "border-transparent bg-destructive text-destructive-foreground",

        // Canonical semantic statuses
        success: "border-transparent bg-success text-success-foreground",
        warning: "border-transparent bg-warning text-warning-foreground",
        critical: "border-transparent bg-destructive text-destructive-foreground",
        info: "border-transparent bg-info text-info-foreground",

        "success-subtle": "border-border bg-success-subtle text-success",
        "warning-subtle": "border-border bg-primary-subtle text-warning",
        "critical-subtle": "border-border bg-destructive-subtle text-destructive",
        "info-subtle": "border-border bg-primary-subtle text-info",
        "neutral-subtle": "border-border bg-muted text-muted-foreground",

        // Canonical condition variants
        "condition-new": "border-border bg-condition-new-bg text-condition-new",
        "condition-likenew": "border-border bg-condition-likenew-bg text-condition-likenew",
        "condition-good": "border-border bg-condition-good-bg text-condition-good",
        "condition-fair": "border-border bg-condition-fair-bg text-condition-fair",
        "condition-used": "border-border bg-condition-used-bg text-condition-used",
        "condition-refurb": "border-border bg-condition-refurb-bg text-condition-refurb",
        condition: "border-border bg-badge-condition-bg text-badge-condition-text",
        "condition-outline": "border-border bg-background text-foreground",

        // Canonical shipping variants
        shipping: "border-border bg-badge-shipping-bg text-badge-shipping-text",
        "shipping-free": "border-border bg-success-subtle text-success",
        "shipping-subtle": "border-border bg-success-subtle text-success",
        "shipping-express": "border-transparent bg-warning text-warning-foreground",

        // Canonical stock variants
        "stock-available": "border-border bg-success-subtle text-success",
        "stock-low": "border-border bg-badge-stock-bg text-badge-stock-text",
        "stock-out": "border-border bg-destructive-subtle text-destructive line-through",

        // Canonical commerce variants
        promo: "border-transparent bg-destructive text-destructive-foreground",
        discount: "border-transparent bg-destructive text-destructive-foreground font-semibold tabular-nums",
        deal: "border-transparent bg-destructive text-destructive-foreground font-semibold",
        sale: "border-transparent bg-destructive text-destructive-foreground font-semibold",
        "limited-time": "border-transparent bg-destructive text-destructive-foreground font-semibold",
        price: "border-transparent bg-foreground text-background font-semibold tabular-nums",
        promoted: "border-transparent bg-promoted text-promoted-foreground font-semibold",
        sponsored: "border-transparent bg-promoted text-promoted-foreground font-semibold",

        // Canonical trust variants
        "verified-business": "border-transparent bg-verified-business text-verified-business-foreground",
        "verified-personal": "border-transparent bg-verified-personal text-verified-personal-foreground",
        verified: "border-transparent bg-verified-personal text-verified-personal-foreground",
        "verified-solid": "border-transparent bg-verified-business text-verified-business-foreground",
        "top-rated": "border-transparent bg-top-rated text-top-rated-foreground",

        category: "border-category-badge-border bg-category-badge-bg text-category-badge-text",

        // Backward-compatible aliases
        "condition-pro": "border-border bg-background text-foreground font-semibold tracking-wide",
        "shipping-pro": "border-border bg-success-subtle text-success",
        "stock-urgent": "border-border bg-destructive-subtle text-destructive font-semibold",
      },
    },
    defaultVariants: {
      size: "default",
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
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span"

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
