"use client"

import type { ComponentProps } from "react"

import { cn } from "@/lib/utils"

type SellChipProps = ComponentProps<"button"> & {
  selected?: boolean
}

export function SellChip({ selected = false, className, ...props }: SellChipProps) {
  return (
    <button
      type="button"
      className={cn(
        "px-3 py-1.5 rounded-full text-xs font-medium",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-1",
        "disabled:pointer-events-none disabled:opacity-50",
        "transition-colors tap-transparent",
        selected
          ? "bg-foreground text-background"
          : "bg-surface-subtle text-muted-foreground hover:text-foreground",
        className
      )}
      {...props}
    />
  )
}

