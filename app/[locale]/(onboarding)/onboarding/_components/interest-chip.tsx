import * as React from "react"
import { Check } from "lucide-react";

import { cn } from "@/lib/utils"

interface InterestChipProps {
  label: string
  icon?: React.ReactNode
  selected: boolean
  onSelect: () => void
}

export function InterestChip({
  label,
  icon,
  selected,
  onSelect,
}: InterestChipProps) {
  const sizedIcon = React.isValidElement<{ className?: string }>(icon)
    ? React.cloneElement(icon, {
        className: cn("size-6", icon.props.className),
      })
    : icon

  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={selected}
      onClick={onSelect}
      className={cn(
        "tap-highlight relative flex aspect-square w-full flex-col items-center justify-center gap-2 rounded-xl border p-3 text-center transition-colors",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring",
        selected
          ? "border-primary bg-selected"
          : "border-border bg-background hover:border-hover-border hover:bg-hover"
      )}
    >
      {selected ? (
        <span className="absolute right-2 top-2 inline-flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <Check className="size-3.5" />
        </span>
      ) : null}

      <span
        aria-hidden="true"
        className={cn(
          "flex size-11 items-center justify-center rounded-xl border",
          selected
            ? "border-primary bg-primary text-primary-foreground"
            : "border-border bg-secondary text-foreground"
        )}
      >
        {sizedIcon}
      </span>

      <span className="text-xs font-medium leading-tight line-clamp-2">{label}</span>
    </button>
  )
}

