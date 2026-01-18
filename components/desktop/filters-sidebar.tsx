"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

// =============================================================================
// TYPES
// =============================================================================

export interface FilterState {
  priceMin: string
  priceMax: string
  condition: string | null
  /** Dynamic attribute filters: attributeName -> selected value */
  attributes: Record<string, string | null>
}

export interface FiltersSidebarProps {
  locale: string
  filters: FilterState
  onFiltersChange: (f: FilterState) => void
  onApply: () => void
}

// =============================================================================
// FILTERS SIDEBAR - Only shown when category is selected
// =============================================================================

export function FiltersSidebar({
  locale,
  filters,
  onFiltersChange,
  onApply,
}: FiltersSidebarProps) {
  const conditions = [
    { id: "new", label: locale === "bg" ? "Ново" : "New" },
    { id: "like_new", label: locale === "bg" ? "Като ново" : "Like new" },
    { id: "used", label: locale === "bg" ? "Използвано" : "Used" },
  ]

  const hasActive = filters.priceMin !== "" || filters.priceMax !== "" || filters.condition !== null

  return (
    <div className="rounded-lg border border-border bg-card shadow-sm">
      <div className="px-3 py-2.5 border-b border-border">
        <h3 className="text-sm font-semibold text-foreground">
          {locale === "bg" ? "Филтри" : "Filters"}
        </h3>
      </div>
      <div className="px-3 py-3 space-y-4">
        {/* Price */}
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-2 block">
            {locale === "bg" ? "Цена" : "Price"}
          </label>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              placeholder={locale === "bg" ? "Мин" : "Min"}
              value={filters.priceMin}
              onChange={(e) => onFiltersChange({ ...filters, priceMin: e.target.value })}
              className="h-9 text-sm"
            />
            <span className="text-muted-foreground text-sm">–</span>
            <Input
              type="number"
              placeholder={locale === "bg" ? "Макс" : "Max"}
              value={filters.priceMax}
              onChange={(e) => onFiltersChange({ ...filters, priceMax: e.target.value })}
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
            {conditions.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => onFiltersChange({ ...filters, condition: filters.condition === c.id ? null : c.id })}
                className={cn(
                  "px-3 py-1.5 text-xs rounded-full transition-colors min-h-9",
                  filters.condition === c.id
                    ? "bg-foreground text-background font-medium"
                    : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                )}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        <Button size="sm" onClick={onApply} disabled={!hasActive} className="w-full h-9 text-sm font-medium">
          {locale === "bg" ? "Приложи" : "Apply"}
        </Button>
      </div>
    </div>
  )
}
