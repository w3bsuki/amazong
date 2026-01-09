import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 active:opacity-90",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground active:bg-accent/80",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost:
          "hover:bg-accent hover:text-accent-foreground active:bg-accent/80",
        link: "text-primary underline-offset-4 hover:underline",
        // Marketplace CTA variants
        cta: "bg-cta-trust-blue text-white hover:bg-cta-trust-blue-hover",
        deal: "bg-deal text-white hover:bg-deal/90",
        // Treido black CTA
        black: "bg-gray-900 text-white hover:bg-gray-800",
      },
      size: {
        xs: "h-6 px-2 text-xs gap-1 [&_svg]:size-3",           /* 24px - inline/dense */
        sm: "h-7 px-3 text-xs gap-1.5 [&_svg]:size-3.5",       /* 28px - compact */
        default: "h-8 px-4 text-sm gap-2 [&_svg]:size-4",      /* 32px - standard */
        lg: "h-9 px-5 text-sm gap-2 [&_svg]:size-4",           /* 36px - primary CTA */
        xl: "h-10 px-6 text-[15px] font-bold gap-2 [&_svg]:size-4.5", /* 40px - hero CTA */
        "2xl": "h-11 px-6 text-[15px] font-bold gap-2 [&_svg]:size-5", /* 44px - mobile CTA */
        "3xl": "h-12 px-8 text-base font-bold gap-2.5 [&_svg]:size-5", /* 48px - treido buy now */
        icon: "size-9 [&_svg]:size-4",                         /* 36px */
        "icon-sm": "size-8 [&_svg]:size-4",                    /* 32px */
        "icon-lg": "size-10 [&_svg]:size-6",                   /* 40px */
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
