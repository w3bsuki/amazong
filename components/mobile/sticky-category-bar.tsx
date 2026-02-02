"use client"

import { cn } from "@/lib/utils"
import { SlidersHorizontal } from "@phosphor-icons/react"
import { useTranslations } from "next-intl"
import type { CategoryTreeNode } from "@/lib/category-tree"
import { getCategoryShortName } from "@/lib/category-display"

// =============================================================================
// Types
// =============================================================================

interface StickyCategoryBarProps {
  /** L0 categories to display as pills */
  categories: CategoryTreeNode[]
  /** Currently active category slug (null = "All") */
  activeCategory: string | null
  /** Callback when category is selected */
  onCategorySelect: (slug: string | null) => void
  /** Callback when filter button is clicked */
  onFilterClick: () => void
  /** Number of active filters (shows badge) */
  activeFilterCount?: number
  /** Locale for category names */
  locale: string
  className?: string
}

// =============================================================================
// Component
// =============================================================================

/**
 * Sticky category bar that appears when scrolling past promo sections.
 * Filter button + horizontal scrollable category pills.
 */
export function StickyCategoryBar({
  categories,
  activeCategory,
  onCategorySelect,
  onFilterClick,
  activeFilterCount = 0,
  locale,
  className,
}: StickyCategoryBarProps) {
  const t = useTranslations("Common")
  const tHome = useTranslations("Home")

  return (
    <div className={cn("bg-background z-30 border-b border-border/50", className)}>
      <div className="flex items-center gap-2 py-2">
        {/* Filter Button - First */}
        <button
          type="button"
          onClick={onFilterClick}
          aria-label={
            activeFilterCount > 0
              ? tHome("mobile.filtersActive", { count: activeFilterCount })
              : tHome("mobile.sortOptions")
          }
          className={cn(
            "relative flex items-center justify-center shrink-0 ml-inset",
            "h-8 w-8 rounded-full",
            "transition-all duration-150",
            "active:opacity-90",
            "bg-foreground text-background"
          )}
        >
          <SlidersHorizontal size={16} weight="bold" />
          {activeFilterCount > 0 && (
            <span className="absolute -top-1 -right-1 size-4 flex items-center justify-center rounded-full bg-destructive text-destructive-foreground text-2xs font-bold">
              {activeFilterCount > 9 ? "9+" : activeFilterCount}
            </span>
          )}
        </button>

        {/* Scrollable Category Pills */}
        <div className="flex-1 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-1.5 pr-inset">
            {/* "All" Pill */}
            <button
              type="button"
              onClick={() => onCategorySelect(null)}
              className={cn(
                "h-7 px-3 rounded-full shrink-0",
                "text-xs font-medium whitespace-nowrap",
                "transition-all duration-150",
                "active:opacity-90",
                activeCategory === null
                  ? "bg-foreground text-background"
                  : "bg-surface-subtle text-muted-foreground border border-border/40"
              )}
            >
              {t("all")}
            </button>

            {/* Category Pills */}
            {categories.map((cat) => {
              const isActive = activeCategory === cat.slug
              return (
                <button
                  key={cat.slug}
                  type="button"
                  onClick={() => onCategorySelect(cat.slug)}
                  className={cn(
                    "h-7 px-3 rounded-full shrink-0",
                    "text-xs font-medium whitespace-nowrap",
                    "transition-all duration-150",
                    "active:opacity-90",
                    isActive
                      ? "bg-foreground text-background"
                      : "bg-surface-subtle text-muted-foreground border border-border/40"
                  )}
                >
                  {getCategoryShortName(cat, locale)}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
