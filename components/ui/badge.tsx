import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium leading-tight w-fit whitespace-nowrap shrink-0 select-none transition-colors [&>svg]:size-3 [&>svg]:shrink-0",
  {
    variants: {
      variant: {
        // Base (shadcn-like)
        default: "border-transparent bg-secondary text-secondary-foreground",
        secondary: "border-transparent bg-muted text-muted-foreground",
        outline: "border-border bg-background text-muted-foreground",
        destructive: "border-transparent bg-destructive text-destructive-foreground",

        // Aliases (kept for backwards compatibility; visuals stay within blue/neutral/red system)
        success: "border-transparent bg-secondary text-secondary-foreground",
        warning: "border-transparent bg-secondary text-secondary-foreground",
        critical: "border-transparent bg-secondary text-secondary-foreground",
        info: "border-transparent bg-secondary text-secondary-foreground",

        "success-subtle": "border-border bg-muted text-muted-foreground",
        "warning-subtle": "border-border bg-muted text-muted-foreground",
        "critical-subtle": "border-border bg-muted text-muted-foreground",
        "info-subtle": "border-border bg-muted text-muted-foreground",
        "neutral-subtle": "border-border bg-muted text-muted-foreground",

        "condition-new": "border-border bg-background text-foreground",
        "condition-likenew": "border-border bg-background text-foreground",
        "condition-good": "border-border bg-background text-foreground",
        "condition-fair": "border-border bg-background text-foreground",
        "condition-used": "border-border bg-background text-foreground",
        "condition-refurb": "border-border bg-background text-foreground",
        condition: "border-border bg-background text-muted-foreground",
        "condition-outline": "border-border bg-background text-muted-foreground",

        shipping: "border-border bg-background text-muted-foreground",
        "shipping-subtle": "border-border bg-muted text-muted-foreground",
        "shipping-express": "border-border bg-background text-muted-foreground",

        "stock-available": "border-border bg-muted text-muted-foreground",
        "stock-low": "border-border bg-muted text-muted-foreground",
        "stock-out": "border-border bg-muted text-muted-foreground line-through",

        promo: "border-transparent bg-destructive text-destructive-foreground",
        discount: "border-transparent bg-destructive text-destructive-foreground font-semibold tabular-nums",
        deal: "border-transparent bg-destructive text-destructive-foreground font-semibold",
        sale: "border-transparent bg-destructive text-destructive-foreground font-semibold",
        "limited-time": "border-transparent bg-destructive text-destructive-foreground font-semibold",
        promoted: "border-border bg-background text-muted-foreground",
        sponsored: "border-border bg-background text-muted-foreground",

        verified: "border-border bg-background text-muted-foreground",
        "verified-solid": "border-border bg-background text-muted-foreground",
        "top-rated": "border-border bg-background text-muted-foreground",

        category: "border-border bg-muted text-muted-foreground",

        "condition-pro": "border-border bg-background text-foreground font-semibold tracking-wide",
        "shipping-pro": "border-border bg-background text-muted-foreground",
        "stock-urgent": "border-border bg-muted text-muted-foreground font-semibold",
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
