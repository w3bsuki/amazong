"use client"

import { forwardRef } from "react"
import { cn } from "@/lib/utils"
import { CaretLeft, CaretRight } from "@phosphor-icons/react"

export interface CarouselScrollButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  direction: "left" | "right"
  visible?: boolean
}

/**
 * Scroll button for horizontal carousels.
 * Shows left/right caret icons with visibility animation.
 * Used by deals-section, trending-products-section, product-carousel-section, etc.
 */
export const CarouselScrollButton = forwardRef<HTMLButtonElement, CarouselScrollButtonProps>(
  ({ direction, visible = true, className, ...props }, ref) => {
    const Icon = direction === "left" ? CaretLeft : CaretRight
    const positionClass = direction === "left" ? "left-2" : "right-2"

    return (
      <button
        ref={ref}
        type="button"
        aria-label={`Scroll ${direction}`}
        className={cn(
          "absolute top-1/2 -translate-y-1/2 z-10 hidden md:flex",
          "items-center justify-center size-10 bg-white hover:bg-secondary rounded-full border border-border",
          "transition-opacity duration-200",
          visible ? "opacity-100" : "opacity-0 pointer-events-none",
          positionClass,
          className
        )}
        {...props}
      >
        <Icon size={20} weight="regular" className="text-foreground" />
      </button>
    )
  }
)

CarouselScrollButton.displayName = "CarouselScrollButton"
