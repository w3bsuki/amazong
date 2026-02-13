"use client"

import { cn } from "@/lib/utils"

// =============================================================================
// SIZE TILES — Tile grid for size selection (no dropdowns)
//
// Per UI_UX_CODEX.md:
// - Size: tile grid (4 columns on mobile)
// - Touch targets >= 44x44
// =============================================================================

interface SizeTilesProps {
  options: string[]
  selected: string[]
  onSelect: (values: string[]) => void
  multiSelect?: boolean
}

export function SizeTiles({
  options,
  selected,
  onSelect,
  multiSelect = true,
}: SizeTilesProps) {
  const handleSelect = (option: string) => {
    if (!multiSelect) {
      onSelect(selected.includes(option) ? [] : [option])
      return
    }
    const newValues = selected.includes(option)
      ? selected.filter((v) => v !== option)
      : [...selected, option]
    onSelect(newValues)
  }

  return (
    <div className="grid grid-cols-4 gap-2">
      {options.map((option) => {
        const isActive = selected.includes(option)

        return (
          <button
            key={option}
            type="button"
            onClick={() => handleSelect(option)}
            className={cn(
              "flex items-center justify-center",
              "min-h-touch rounded-md border text-sm font-medium",
              "transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring",
              isActive
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-background text-foreground border-border active:bg-muted"
            )}
            aria-pressed={isActive}
          >
            {option}
          </button>
        )
      })}
    </div>
  )
}
