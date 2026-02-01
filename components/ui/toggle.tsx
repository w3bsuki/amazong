"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const toggleVariants = cva(
  "ui-toggle inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium hover:bg-muted hover:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive whitespace-nowrap outline-none transition-colors",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        outline:
          "border border-input bg-transparent shadow-xs hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        default: "h-9 px-2 min-w-9",
        sm: "h-8 px-1.5 min-w-8",
        lg: "h-10 px-2.5 min-w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export type ToggleProps = React.ComponentProps<"button"> &
  VariantProps<typeof toggleVariants> & {
    pressed?: boolean
    defaultPressed?: boolean
    onPressedChange?: (pressed: boolean) => void
    asChild?: boolean
  }

function Toggle({
  className,
  variant,
  size,
  pressed: pressedProp,
  defaultPressed,
  onPressedChange,
  asChild = false,
  onClick,
  ...props
}: ToggleProps) {
  const [uncontrolledPressed, setUncontrolledPressed] = React.useState(!!defaultPressed)
  const pressed = pressedProp ?? uncontrolledPressed
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      type="button"
      data-state={pressed ? "on" : "off"}
      aria-pressed={pressed}
      className={cn(toggleVariants({ variant, size }), className)}
      onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
        onClick?.(e)
        if (e.defaultPrevented) return
        const next = !pressed
        if (pressedProp === undefined) setUncontrolledPressed(next)
        onPressedChange?.(next)
      }}
      {...props}
    />
  )
}

export { Toggle, toggleVariants }
