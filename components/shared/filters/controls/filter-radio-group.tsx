"use client"

import * as React from "react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { cn } from "@/lib/utils"

/**
 * FilterRadioGroup — Radio group for single-select filter sections
 * 
 * Wraps shadcn RadioGroup with full-width list-item styling matching
 * the existing filter drawer visual pattern.
 * 
 * Usage:
 * ```tsx
 * <FilterRadioGroup value={currentSort} onValueChange={handleSortChange}>
 *   <FilterRadioItem value="featured">Featured</FilterRadioItem>
 *   <FilterRadioItem value="price-asc">Price: Low to High</FilterRadioItem>
 * </FilterRadioGroup>
 * ```
 */

interface FilterRadioGroupProps {
  /** Current selected value */
  value: string
  /** Callback when value changes */
  onValueChange: (value: string) => void
  /** Radio items */
  children: React.ReactNode
  /** Additional class names */
  className?: string
}

export function FilterRadioGroup({
  value,
  onValueChange,
  children,
  className,
}: FilterRadioGroupProps) {
  return (
    <RadioGroup
      value={value}
      onValueChange={onValueChange}
      className={cn("divide-y divide-border gap-0", className)}
    >
      {children}
    </RadioGroup>
  )
}

interface FilterRadioItemProps {
  /** The value of this radio option */
  value: string
  /** Label content */
  children: React.ReactNode
  /** Optional description shown below the label */
  description?: React.ReactNode
  /** Additional class names for the item */
  className?: string
  /** Whether to use full-bleed styling (negative margins for drawer context) */
  fullBleed?: boolean
  /** Disable the item */
  disabled?: boolean
}

export function FilterRadioItem({
  value,
  children,
  description,
  className,
  fullBleed = false,
  disabled = false,
}: FilterRadioItemProps) {
  const id = React.useId()

  return (
    <label
      htmlFor={id}
      className={cn(
        "w-full flex items-center gap-3 h-11 cursor-pointer text-left transition-colors focus-within:ring-2 focus-within:ring-focus-ring",
        fullBleed ? "px-inset" : "px-3",
        // Selection styling via data attribute from RadioGroup
        "has-[[data-state=checked]]:bg-selected has-[[data-state=checked]]:font-medium",
        "active:bg-active",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      <RadioGroupItem
        id={id}
        value={value}
        disabled={disabled}
        className="shrink-0"
      />
      <div className="flex flex-col min-w-0 flex-1">
        <span className="text-sm truncate">{children}</span>
        {description && (
          <span className="text-xs text-muted-foreground truncate">
            {description}
          </span>
        )}
      </div>
    </label>
  )
}

/**
 * FilterRadioList — Alias for FilterRadioGroup for semantic consistency
 * @deprecated Use FilterRadioGroup directly
 */
