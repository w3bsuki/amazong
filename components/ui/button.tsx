import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  // Treido: Remove ring-offset, use active:opacity-90 for native iOS feel, tap-highlight-transparent
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none active:opacity-90 tap-highlight-transparent",
  {
    variants: {
      variant: {
        // shadcn-aligned default: primary CTA (Twitter blue)
        default: "bg-primary text-primary-foreground hover:bg-interactive-hover",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive dark:bg-destructive",
        outline:
          "border border-border bg-background hover:bg-muted text-foreground active:bg-active shadow-none",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary",
        ghost:
          "hover:bg-accent hover:text-accent-foreground active:bg-active",
        // Desktop header actions - clean, borderless interaction (treido-ui)
        "header-ghost":
          "text-header-text bg-transparent hover:bg-header-hover active:bg-header-active rounded-md transition-colors",
        link: "text-link underline-offset-4 hover:underline hover:text-link-hover",
        // Marketplace CTA alias (kept for semantic readability)
        cta: "bg-primary text-primary-foreground hover:bg-interactive-hover",
        deal: "bg-deal text-deal-foreground hover:bg-deal",
        // Treido black CTA (primary marketplace action)
        black: "bg-foreground text-background hover:bg-foreground border border-foreground",
        // Legacy alias (maps to primary)
        brand: "bg-primary text-primary-foreground hover:bg-interactive-hover",
      },
      size: {
        xs: "h-8 px-2 text-xs gap-1 [&_svg]:size-3",           /* 32px - minimum for density */
        sm: "h-9 px-3 text-xs gap-1.5 [&_svg]:size-3.5",       /* 36px - compact */
        default: "h-11 px-5 text-sm gap-2 [&_svg]:size-4",     /* 44px - Treido standard */
        lg: "h-12 px-8 text-sm gap-2 [&_svg]:size-4",          /* 48px - touch-safe large */
        xl: "h-14 px-8 text-base font-bold gap-2 [&_svg]:size-5", /* 56px - hero CTA */
        icon: "size-11 [&_svg]:size-5",                        /* 44px - Treido touch */
        "icon-sm": "size-9 [&_svg]:size-4",                    /* 36px */
        "icon-lg": "size-12 [&_svg]:size-6",                   /* 48px */
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
