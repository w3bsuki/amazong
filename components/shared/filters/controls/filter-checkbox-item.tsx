"use client"

import * as React from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"

/**
 * FilterCheckboxItem — Checkbox list-item for filter drawers
 * 
 * Wraps shadcn Checkbox with full-width list-item styling matching
 * the existing filter drawer visual pattern.
 * 
 * Usage:
 * ```tsx
 * <FilterCheckboxItem
 *   checked={isActive}
 *   onCheckedChange={(checked) => setActive(checked)}
 * >
 *   In Stock
 * </FilterCheckboxItem>
 * ```
 */

interface FilterCheckboxItemProps {
  /** Whether the checkbox is checked */
  checked: boolean
  /** Callback when checked state changes */
  onCheckedChange: (checked: boolean) => void
  /** Label content (typically text) */
  children: React.ReactNode
  /** Optional description shown below the label */
  description?: React.ReactNode
  /** Additional class names for the container */
  className?: string
  /** Whether to use full-bleed styling (negative margins for drawer context) */
  fullBleed?: boolean
  /** Disable the item */
  disabled?: boolean
}

export function FilterCheckboxItem({
  checked,
  onCheckedChange,
  children,
  description,
  className,
  fullBleed = false,
  disabled = false,
}: FilterCheckboxItemProps) {
  const id = React.useId()

  return (
    <button
      type="button"
      onClick={() => !disabled && onCheckedChange(!checked)}
      disabled={disabled}
      className={cn(
        "w-full flex items-center gap-3 h-11 transition-colors text-left",
        fullBleed ? "px-inset -mx-inset" : "px-3",
        checked
          ? "bg-selected text-foreground font-medium"
          : "text-foreground active:bg-active",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
      aria-pressed={checked}
    >
      <Checkbox
        id={id}
        checked={checked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
        className="pointer-events-none"
        aria-hidden="true"
        tabIndex={-1}
      />
      <div className="flex flex-col min-w-0 flex-1">
        <span className="text-sm truncate">{children}</span>
        {description && (
          <span className="text-xs text-muted-foreground truncate">
            {description}
          </span>
        )}
      </div>
    </button>
  )
}

/**
 * FilterCheckboxList — Container for a list of FilterCheckboxItems
 * 
 * Provides proper divider styling between items.
 */
interface FilterCheckboxListProps {
  children: React.ReactNode
  className?: string
}

export function FilterCheckboxList({ children, className }: FilterCheckboxListProps) {
  return (
    <div className={cn("divide-y divide-border", className)}>
      {children}
    </div>
  )
}
