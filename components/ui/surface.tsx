import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const surfaceVariants = cva("rounded-xl", {
  variants: {
    variant: {
      // Cards/list rows are border-only in Treido (no elevation).
      card: "bg-card text-card-foreground border border-border-subtle shadow-none",
      // Tiles are inline/unstyled by default. Interactivity is opt-in via `interactive`.
      tile: "bg-transparent text-foreground shadow-none",
      subtle: "bg-surface-subtle text-foreground",
      background: "bg-background text-foreground",
    },
    interactive: {
      // Only color transitions; elevation is reserved for overlays (dropdowns/modals).
      true: "transition-colors hover:bg-hover active:bg-active hover:border-border",
      false: "",
    },
  },
  defaultVariants: {
    variant: "card",
    interactive: false,
  },
})

export type SurfaceProps = React.ComponentProps<"div"> &
  VariantProps<typeof surfaceVariants> & {
    asChild?: boolean
  }

const Surface = React.forwardRef<HTMLDivElement, SurfaceProps>(function Surface(
  {
    asChild = false,
    className,
    variant,
    interactive,
    ...props
  }: SurfaceProps,
  ref
) {
  const Comp = asChild ? Slot : "div"

  return (
    <Comp
      data-slot="surface"
      className={cn(surfaceVariants({ variant, interactive }), className)}
      ref={ref}
      {...props}
    />
  )
})

export { Surface, surfaceVariants }
