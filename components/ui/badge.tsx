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

        // Semantic statuses
        success: "border-transparent bg-success text-success-foreground",
        warning: "border-transparent bg-warning text-warning-foreground",
        critical: "border-transparent bg-destructive text-destructive-foreground",
        info: "border-transparent bg-info text-info-foreground",

        "success-subtle": "border-border bg-success-subtle text-success",
        "warning-subtle": "border-border bg-primary-subtle text-warning",
        "critical-subtle": "border-border bg-destructive-subtle text-destructive",
        "info-subtle": "border-border bg-primary-subtle text-info",
        "neutral-subtle": "border-border bg-muted text-muted-foreground",
      },
    },
    defaultVariants: {
      size: "default",
      variant: "default",
    },
  }
)

/**
 * Badge primitive.
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
