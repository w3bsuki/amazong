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
    <div className={cn("rounded-lg border border-border bg-muted/40", className)}>
      <div className="px-3 py-2 border-b border-border/50">
        <h3 className="text-sm font-semibold text-foreground">
          {locale === "bg" ? "Филтри" : "Filters"}
        </h3>
      </div>
      <div className="p-3 space-y-3">
        {/* Price Range */}
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
            {locale === "bg" ? "Цена" : "Price"}
          </label>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              placeholder={locale === "bg" ? "Мин" : "Min"}
              value={filters.priceMin}
              onChange={(e) => handlePriceChange("priceMin", e.target.value)}
              className="h-8 text-sm bg-background"
            />
            <span className="text-muted-foreground text-xs">–</span>
            <Input
              type="number"
              placeholder={locale === "bg" ? "Макс" : "Max"}
              value={filters.priceMax}
              onChange={(e) => handlePriceChange("priceMax", e.target.value)}
              className="h-8 text-sm bg-background"
            />
          </div>
        </div>

        {/* Condition */}
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
            {locale === "bg" ? "Състояние" : "Condition"}
          </label>
          <div className="flex flex-wrap gap-1">
            {conditions.map((c) => {
              const isActive = filters.condition === c.id
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => handleConditionToggle(c.id)}
                  className={cn(
                    "px-2.5 py-1 text-xs rounded-full border transition-colors",
                    isActive
                      ? "bg-foreground text-background border-foreground font-medium"
                      : "bg-background border-border hover:bg-muted/50"
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
          className="w-full h-8 text-xs"
        >
          {locale === "bg" ? "Приложи" : "Apply"}
        </Button>
      </div>
    </div>
  )
}

export type { DesktopFiltersCardProps }
