"use client"

import { cn } from "@/lib/utils"
import { Clock, Tag, SlidersHorizontal } from "@phosphor-icons/react"
import { useTranslations } from "next-intl"

// =============================================================================
// Types
// =============================================================================

export type ExploreTab = "newest" | "offers"

interface ExploreBannerProps {
  activeTab: ExploreTab
  onTabChange: (tab: ExploreTab) => void
  onFilterClick: () => void
  productCount?: number
  /** Number of active filters (shows badge) */
  activeFilterCount?: number
  /** Make the banner sticky (sticks below header + pills) */
  sticky?: boolean
  /** Top offset for sticky positioning (to account for header height) */
  stickyTop?: number
}

// =============================================================================
// Tab Configuration
// =============================================================================

const EXPLORE_TABS: Array<{
  id: ExploreTab
  labelKey: string
  icon: typeof Clock
}> = [
  { id: "newest", labelKey: "mobile.exploreTabs.newest", icon: Clock },
  { id: "offers", labelKey: "mobile.exploreTabs.offers", icon: Tag },
]

// =============================================================================
// Component
// =============================================================================

export function ExploreBanner({
  activeTab,
  onTabChange,
  onFilterClick,
  productCount,
  activeFilterCount = 0,
  sticky = true,
  stickyTop = 88,
}: ExploreBannerProps) {
  const t = useTranslations("Home")
  const hasActiveFilters = activeFilterCount > 0

  return (
    <div
      className={cn(
        "px-inset py-2 bg-background z-20",
        sticky && "sticky"
      )}
      style={sticky ? { top: stickyTop } : undefined}
    >
      {/* Segmented Control Container */}
      <div 
        className="flex items-center h-10 rounded-xl bg-muted p-1 gap-1"
        role="tablist"
        aria-label={t("mobile.sortOptions")}
      >
        {/* Tab Segments */}
        {EXPLORE_TABS.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              id={`tab-${tab.id}`}
              aria-selected={isActive}
              tabIndex={isActive ? 0 : -1}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                // Layout
                "flex-1 h-full flex items-center justify-center gap-1.5",
                // Typography
                "text-sm font-medium",
                // Shape & touch
                "rounded-lg tap-highlight-transparent",
                // Transitions
                "transition-all duration-200 ease-out",
                // Focus state (a11y)
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                // Active/Inactive states
                isActive
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon 
                size={16} 
                weight={isActive ? "fill" : "regular"} 
                aria-hidden="true"
              />
              <span>{t(tab.labelKey)}</span>
            </button>
          )
        })}

        {/* Divider */}
        <div className="w-px h-5 bg-border/50 shrink-0" aria-hidden="true" />

        {/* Filter Button */}
        <button
          type="button"
          onClick={onFilterClick}
          aria-label={
            hasActiveFilters 
              ? t("mobile.filtersActive", { count: activeFilterCount })
              : t("mobile.sortOptions")
          }
          aria-pressed={hasActiveFilters}
          className={cn(
            // Layout
            "relative h-full px-3.5 flex items-center justify-center",
            // Shape & touch
            "rounded-lg tap-highlight-transparent",
            // Transitions
            "transition-all duration-200 ease-out",
            // Focus state (a11y)
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            // Active/Inactive states
            hasActiveFilters
              ? "bg-foreground text-background"
              : "text-muted-foreground hover:text-foreground hover:bg-background/60"
          )}
        >
          <SlidersHorizontal 
            size={18} 
            weight={hasActiveFilters ? "fill" : "bold"} 
            aria-hidden="true"
          />
          {/* Active filter count badge */}
          {hasActiveFilters && (
            <span 
              className="absolute -top-1 -right-1 size-4 flex items-center justify-center rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold"
              aria-hidden="true"
            >
              {activeFilterCount > 9 ? "9+" : activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* Product Count */}
      {typeof productCount === "number" && productCount > 0 && (
        <p className="mt-2.5 text-xs text-muted-foreground tabular-nums">
          {t("mobile.listingsCount", { count: productCount })}
        </p>
      )}
    </div>
  )
}
