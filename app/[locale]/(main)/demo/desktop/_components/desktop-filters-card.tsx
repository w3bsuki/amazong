"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

// =============================================================================
// TYPES
// =============================================================================

export interface FilterState {
  priceMin: string
  priceMax: string
  condition: string | null
}

interface DesktopFiltersCardProps {
  locale: string
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
  onApply: () => void
  className?: string
}

// =============================================================================
// DESKTOP FILTERS CARD
//
// Collapsible filters panel for desktop sidebar:
// - Price range (min/max)
// - Condition (New, Like New, Used)
// - Apply button
// =============================================================================

export function DesktopFiltersCard({
  locale,
  filters,
  onFiltersChange,
  onApply,
  className,
}: DesktopFiltersCardProps) {
  const conditions = [
    { id: "new", label: locale === "bg" ? "Ново" : "New" },
    { id: "like_new", label: locale === "bg" ? "Като ново" : "Like new" },
    { id: "used", label: locale === "bg" ? "Използвано" : "Used" },
  ]

  const handlePriceChange = (field: "priceMin" | "priceMax", value: string) => {
    onFiltersChange({ ...filters, [field]: value })
  }

  const handleConditionToggle = (conditionId: string) => {
    onFiltersChange({
      ...filters,
      condition: filters.condition === conditionId ? null : conditionId,
    })
  }

  const hasActiveFilters =
    filters.priceMin !== "" || filters.priceMax !== "" || filters.condition !== null

  return (
    <div className={cn("rounded-md bg-card", className)}>
      <div className="px-3 py-2.5">
        <h3 className="text-sm font-semibold text-foreground">
          {locale === "bg" ? "Филтри" : "Filters"}
        </h3>
      </div>
      <div className="px-3 pb-3 space-y-4">
        {/* Price Range */}
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-2 block">
            {locale === "bg" ? "Цена" : "Price"}
          </label>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              placeholder={locale === "bg" ? "Мин" : "Min"}
              value={filters.priceMin}
              onChange={(e) => handlePriceChange("priceMin", e.target.value)}
              className="h-9 text-sm"
            />
            <span className="text-muted-foreground text-sm">–</span>
            <Input
              type="number"
              placeholder={locale === "bg" ? "Макс" : "Max"}
              value={filters.priceMax}
              onChange={(e) => handlePriceChange("priceMax", e.target.value)}
              className="h-9 text-sm"
            />
          </div>
        </div>

        {/* Condition */}
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-2 block">
            {locale === "bg" ? "Състояние" : "Condition"}
          </label>
          <div className="flex flex-wrap gap-1.5">
            {conditions.map((c) => {
              const isActive = filters.condition === c.id
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => handleConditionToggle(c.id)}
                  className={cn(
                    "px-3 py-1.5 text-xs rounded-full transition-colors",
                    isActive
                      ? "bg-foreground text-background font-medium"
                      : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                  )}
                >
                  {c.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Apply button */}
        <Button
          size="sm"
          onClick={onApply}
          disabled={!hasActiveFilters}
          className="w-full h-9 text-sm font-medium"
        >
          {locale === "bg" ? "Приложи" : "Apply"}
        </Button>
      </div>
    </div>
  )
}

export type { DesktopFiltersCardProps }
