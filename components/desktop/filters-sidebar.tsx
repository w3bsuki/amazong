"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useTranslations } from "next-intl"
import type { QuickFilter } from "./feed-toolbar"

// =============================================================================
// TYPES
// =============================================================================

export interface FilterState {
  priceMin: string
  priceMax: string
  condition: string | null
  /** Dynamic attribute filters: attributeName -> selected value */
  attributes: Record<string, string | null>
  /** Quick filter toggles (deals, nearby, etc.) */
  quickFilters: QuickFilter[]
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
  filters,
  onFiltersChange,
  onApply,
}: FiltersSidebarProps) {
  const tCommon = useTranslations("Common")
  const tFilters = useTranslations("SearchFilters")
  const tProduct = useTranslations("Product")

  const conditions = [
    { id: "new", label: tProduct("condition.new") },
    { id: "like_new", label: tProduct("condition.likeNew") },
    { id: "used", label: tProduct("condition.usedShort") },
  ]

  const hasActive = filters.priceMin !== "" || filters.priceMax !== "" || filters.condition !== null

  return (
    <div className="rounded-lg border border-border bg-card shadow-sm">
      <div className="px-3 py-2.5 border-b border-border">
        <h3 className="text-sm font-semibold text-foreground">
          {tFilters("filters")}
        </h3>
      </div>
      <div className="px-3 py-3 space-y-4">
        {/* Price */}
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-2 block">
            {tFilters("price")}
          </label>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              placeholder={tFilters("min")}
              value={filters.priceMin}
              onChange={(e) => onFiltersChange({ ...filters, priceMin: e.target.value })}
              className="h-touch-sm text-sm"
            />
            <span className="text-muted-foreground text-sm">–</span>
            <Input
              type="number"
              placeholder={tFilters("max")}
              value={filters.priceMax}
              onChange={(e) => onFiltersChange({ ...filters, priceMax: e.target.value })}
              className="h-touch-sm text-sm"
            />
          </div>
        </div>

        {/* Condition */}
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-2 block">
            {tFilters("condition")}
          </label>
          <div className="flex flex-wrap gap-1.5">
            {conditions.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => onFiltersChange({ ...filters, condition: filters.condition === c.id ? null : c.id })}
                className={cn(
                  "px-3 py-1.5 text-xs rounded-full transition-colors min-h-touch-sm",
                  filters.condition === c.id
                    ? "bg-foreground text-background font-medium"
                    : "bg-muted text-muted-foreground hover:bg-hover hover:text-foreground"
                )}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        <Button size="sm" onClick={onApply} disabled={!hasActive} className="w-full h-touch-sm text-sm font-medium">
          {tCommon("apply")}
        </Button>
      </div>
    </div>
  )
}
