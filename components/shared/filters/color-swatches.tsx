"use client"

import { Check } from "@phosphor-icons/react"
import { cn } from "@/lib/utils"

// =============================================================================
// COLOR SWATCHES — Circle-based color selector for Filter Hub
//
// Per UI_UX_CODEX.md:
// - Color: swatches (circles), not text-only
// - Touch targets >= 44x44
// =============================================================================

interface ColorSwatchesProps {
  options: string[]
  selected: string[]
  onSelect: (values: string[]) => void
  multiSelect?: boolean
}

// Common color name to hex mapping
const COLOR_MAP: Record<string, string> = {
  // Basic colors
  black: "#000000",
  white: "#FFFFFF",
  red: "#EF4444",
  blue: "#3B82F6",
  green: "#22C55E",
  yellow: "#EAB308",
  orange: "#F97316",
  purple: "#A855F7",
  pink: "#EC4899",
  brown: "#92400E",
  gray: "#6B7280",
  grey: "#6B7280",
  navy: "#1E3A5F",
  beige: "#D4C4A8",
  cream: "#FFFDD0",
  gold: "#FFD700",
  silver: "#C0C0C0",
  bronze: "#CD7F32",
  // Bulgarian translations
  черен: "#000000",
  бял: "#FFFFFF",
  червен: "#EF4444",
  син: "#3B82F6",
  зелен: "#22C55E",
  жълт: "#EAB308",
  оранжев: "#F97316",
  лилав: "#A855F7",
  розов: "#EC4899",
  кафяв: "#92400E",
  сив: "#6B7280",
  бежов: "#D4C4A8",
  златен: "#FFD700",
  сребърен: "#C0C0C0",
}

function getColorHex(colorName: string): string | null {
  const normalized = colorName.toLowerCase().trim()
  return COLOR_MAP[normalized] ?? null
}

function isLightColor(hex: string): boolean {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  // Relative luminance formula
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.7
}

export function ColorSwatches({
  options,
  selected,
  onSelect,
  multiSelect = true,
}: ColorSwatchesProps) {
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
    <div className="grid grid-cols-4 gap-3">
      {options.map((option) => {
        const isActive = selected.includes(option)
        const hex = getColorHex(option)
        const isLight = hex ? isLightColor(hex) : false

        return (
          <button
            key={option}
            type="button"
            onClick={() => handleSelect(option)}
              className={cn(
                "flex flex-col items-center gap-1.5 p-2 rounded-lg transition-colors",
                "min-h-touch min-w-touch",
              isActive ? "bg-secondary" : "active:bg-active"
            )}
            aria-pressed={isActive}
          >
            {/* Color circle */}
            <div
              className={cn(
                "size-8 rounded-full border-2 flex items-center justify-center transition-all",
                isActive ? "border-primary ring-2 ring-primary/30" : "border-border",
                !hex && "bg-muted"
              )}
              style={hex ? { backgroundColor: hex } : undefined}
            >
              {isActive && (
                <Check
                  size={16}
                  weight="bold"
                  className={cn(
                    hex && isLight ? "text-foreground" : "text-overlay-text",
                    !hex && "text-primary"
                  )}
                />
              )}
            </div>
            {/* Color name */}
            <span
              className={cn(
                "text-xs text-center line-clamp-1",
                isActive ? "text-primary font-medium" : "text-muted-foreground"
              )}
            >
              {option}
            </span>
          </button>
        )
      })}
    </div>
  )
}
