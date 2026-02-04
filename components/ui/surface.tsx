import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const surfaceVariants = cva("rounded-xl border border-border shadow-none", {
  variants: {
    variant: {
      card: "bg-card text-card-foreground",
      subtle: "bg-surface-subtle text-foreground",
      background: "bg-background text-foreground",
    },
    interactive: {
      true: "transition-colors hover:bg-hover active:bg-active",
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
