import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  // Treido: tokenized controls (36/44/48), no ad-hoc sizing in callers.
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:outline-none active:opacity-90 tap-transparent",
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
          "text-header-text bg-transparent hover:bg-header-hover active:bg-header-active rounded-xl transition-colors",
        link: "text-link underline-offset-4 hover:underline hover:text-link-hover",
        // Marketplace CTA alias (kept for semantic readability)
        cta: "bg-primary text-primary-foreground hover:bg-interactive-hover",
        deal: "bg-destructive text-destructive-foreground hover:bg-destructive",
        // Legacy variants (aliased to token-safe styles)
        black: "bg-primary text-primary-foreground hover:bg-interactive-hover",
        // Legacy alias (maps to primary)
        brand: "bg-primary text-primary-foreground hover:bg-interactive-hover",
      },
      size: {
        xs: "h-8 px-2 text-xs gap-1 [&_svg]:size-3",
        sm: "h-(--control-compact) px-3 text-xs gap-1.5 [&_svg]:size-4",
        compact: "h-(--control-compact) px-3 text-xs gap-1.5 [&_svg]:size-4",
        default: "h-(--control-default) px-4 text-sm gap-2 [&_svg]:size-4",
        lg: "h-(--control-primary) px-5 text-sm gap-2 [&_svg]:size-5",
        primary: "h-(--control-primary) px-5 text-sm gap-2 [&_svg]:size-5",
        xl: "h-14 px-8 text-base font-bold gap-2 [&_svg]:size-5",
        "icon-sm": "size-(--control-compact) [&_svg]:size-4",
        "icon-compact": "size-(--control-compact) [&_svg]:size-4",
        icon: "size-(--control-default) [&_svg]:size-5",
        "icon-default": "size-(--control-default) [&_svg]:size-5",
        "icon-lg": "size-(--control-primary) [&_svg]:size-5",
        "icon-primary": "size-(--control-primary) [&_svg]:size-5",
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

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant, size, asChild = false, ...props }: ButtonProps,
  ref
) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      ref={ref}
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
})

Button.displayName = "Button"

export { Button, buttonVariants }
