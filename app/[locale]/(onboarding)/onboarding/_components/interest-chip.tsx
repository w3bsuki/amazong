"use client"

import { Check } from "@/lib/icons/phosphor"
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
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={selected}
      onClick={onSelect}
      className={cn(
        "flex items-center gap-2 px-4 py-2.5 rounded-full border-2 transition-all duration-200",
        "text-sm font-medium",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        selected
          ? "bg-primary text-primary-foreground border-primary"
          : "bg-background text-foreground border-border hover:border-hover-border hover:bg-hover"
      )}
    >
      {icon && <span className="size-4">{icon}</span>}
      <span>{label}</span>
      {selected && <Check className="size-4" weight="bold" />}
    </button>
  )
}
