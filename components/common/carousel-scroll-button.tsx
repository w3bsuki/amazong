"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"

interface CarouselScrollButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  direction: "left" | "right"
  visible?: boolean
}

/**
 * Scroll button for horizontal carousels.
 * Shows left/right chevron icons with visibility animation.
 */
function CarouselScrollButton({
  direction,
  visible = true,
  className,
  ...props
}: CarouselScrollButtonProps) {
  const Icon = direction === "left" ? ChevronLeft : ChevronRight
  const positionClass = direction === "left" ? "left-2" : "right-2"

  return (
    <button
      type="button"
      data-slot="carousel-scroll-button"
      aria-label={`Scroll ${direction}`}
      className={cn(
        "absolute top-1/2 -translate-y-1/2 z-10 hidden md:flex",
        "items-center justify-center size-10 bg-card hover:bg-secondary rounded-full border border-border",
        "transition-opacity duration-200",
        visible ? "opacity-100" : "opacity-0 pointer-events-none",
        positionClass,
        className
      )}
      {...props}
    >
      <Icon className="size-5 text-foreground" />
    </button>
  )
}

export { CarouselScrollButton }
export type { CarouselScrollButtonProps }
