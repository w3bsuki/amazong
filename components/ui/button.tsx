import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  // Treido: Remove ring-offset, use active:opacity-90 for native iOS feel, tap-highlight-transparent
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none shrink-0 [&_svg]:shrink-0 outline-none focus-visible:outline-2 focus-visible:outline-ring active:opacity-90 tap-highlight-transparent",
  {
    variants: {
      variant: {
        // Treido: Solid black default, no gradients
        default: "bg-zinc-900 text-zinc-50 hover:bg-zinc-800 border border-zinc-900",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 dark:bg-destructive/60",
        outline:
          "border border-zinc-200/80 bg-zinc-50/50 hover:bg-zinc-100 text-zinc-900 active:bg-zinc-200/50 backdrop-blur-sm shadow-sm",
        secondary:
          "bg-zinc-100 text-zinc-900 hover:bg-zinc-200",
        ghost:
          "hover:bg-zinc-100 text-zinc-900 active:bg-zinc-100",
        link: "text-zinc-900 underline-offset-4 hover:underline",
        // Marketplace CTA variants
        cta: "bg-cta-trust-blue text-white hover:bg-cta-trust-blue-hover",
        deal: "bg-deal text-white hover:bg-deal/90",
        // Treido black CTA (primary marketplace action)
        black: "bg-zinc-900 text-white hover:bg-zinc-800 border border-zinc-900",
        // Brand purple (legacy)
        brand: "bg-primary text-primary-foreground hover:bg-primary/90",
      },
      size: {
        xs: "h-8 px-2 text-xs gap-1 [&_svg]:size-3",           /* 32px - minimum for density */
        sm: "h-9 px-3 text-xs gap-1.5 [&_svg]:size-3.5",       /* 36px - compact */
        default: "h-11 px-5 text-sm gap-2 [&_svg]:size-4",     /* 44px - Treido standard */
        lg: "h-12 px-8 text-sm gap-2 [&_svg]:size-4",          /* 48px - touch-safe large */
        xl: "h-14 px-8 text-[15px] font-bold gap-2 [&_svg]:size-4.5", /* 56px - hero CTA */
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
