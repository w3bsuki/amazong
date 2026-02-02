"use client"

import { cn } from "@/lib/utils"
import { 
  Fire, 
  Clock, 
  CaretDown, 
  SlidersHorizontal, 
  TrendUp,
  MapPin,
  Percent,
  Star,
  Package,
} from "@phosphor-icons/react"
import { useTranslations } from "next-intl"
import { useState, useRef, useEffect } from "react"

// =============================================================================
// Types
// =============================================================================

export type SortOption = "newest" | "popular" | "price-low" | "price-high"

/** Quick filter pill definitions */
type QuickPillId = "offers" | "nearby" | "sale" | "topRated" | "freeShip"

interface QuickPill {
  id: QuickPillId
  labelKey: string
  icon: typeof Fire
  activeClassName: string
}

interface FeedControlBarProps {
  /** Current sort option */
  activeSort: SortOption
  /** Callback when sort changes */
  onSortChange: (sort: SortOption) => void
  /** Active quick filter pills */
  activePills: QuickPillId[]
  /** Callback when pill is toggled */
  onPillToggle: (pill: QuickPillId) => void
  /** Callback when main filter button is clicked (opens filter modal) */
  onFilterClick: () => void
  /** Number of products currently showing */
  productCount?: number
  /** Number of active filters from modal (shows badge on filter button) */
  activeFilterCount?: number
  /** Make the bar sticky */
  sticky?: boolean
  className?: string
}

// =============================================================================
// Quick Pills Config
// =============================================================================

const QUICK_PILLS: QuickPill[] = [
  { 
    id: "offers", 
    labelKey: "mobile.quickPills.offers", 
    icon: Fire,
    activeClassName: "bg-deal text-deal-foreground"
  },
  { 
    id: "nearby", 
    labelKey: "mobile.quickPills.nearby", 
    icon: MapPin,
    activeClassName: "bg-info text-info-foreground"
  },
  { 
    id: "sale", 
    labelKey: "mobile.quickPills.sale", 
    icon: Percent,
    activeClassName: "bg-success text-success-foreground"
  },
  { 
    id: "topRated", 
    labelKey: "mobile.quickPills.topRated", 
    icon: Star,
    activeClassName: "bg-warning text-warning-foreground"
  },
  { 
    id: "freeShip", 
    labelKey: "mobile.quickPills.freeShip", 
    icon: Package,
    activeClassName: "bg-primary text-primary-foreground"
  },
]

// =============================================================================
// Sort Options Config
// =============================================================================

const SORT_OPTIONS: Array<{
  id: SortOption
  labelKey: string
  icon: typeof Clock
}> = [
  { id: "newest", labelKey: "mobile.sort.newest", icon: Clock },
  { id: "popular", labelKey: "mobile.sort.popular", icon: TrendUp },
  { id: "price-low", labelKey: "mobile.sort.priceLow", icon: TrendUp },
  { id: "price-high", labelKey: "mobile.sort.priceHigh", icon: TrendUp },
]

// =============================================================================
// Sort Dropdown Component
// =============================================================================

function SortDropdown({
  activeSort,
  onSortChange,
}: {
  activeSort: SortOption
  onSortChange: (sort: SortOption) => void
}) {
  const t = useTranslations("Home")
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const defaultOption = SORT_OPTIONS[0] ?? { id: "newest", labelKey: "mobile.sort.newest", icon: Clock }

  const activeOption = SORT_OPTIONS.find((o) => o.id === activeSort) ?? defaultOption
  const ActiveIcon = activeOption.icon

  // Close on outside click
  useEffect(() => {
    if (!open) return
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [open])

  return (
    <div ref={dropdownRef} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={cn(
          "flex items-center gap-1.5 h-8 px-3 rounded-full",
          "text-sm font-medium whitespace-nowrap",
          "bg-surface-subtle text-foreground",
          "border border-border/40",
          "transition-all duration-150",
          "active:opacity-90",
          open && "bg-hover ring-2 ring-ring/20"
        )}
      >
        <ActiveIcon size={14} weight="bold" className="text-muted-foreground" />
        <span>{t(activeOption.labelKey)}</span>
        <CaretDown 
          size={12} 
          weight="bold" 
          className={cn(
            "text-muted-foreground transition-transform duration-150",
            open && "rotate-180"
          )} 
        />
      </button>

      {/* Dropdown Menu */}
      {open && (
        <div className="absolute top-full right-0 mt-1.5 min-w-36 py-1.5 bg-popover rounded-xl shadow-lg border border-border z-50">
          {SORT_OPTIONS.map((option) => {
            const Icon = option.icon
            const isActive = activeSort === option.id
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => {
                  onSortChange(option.id)
                  setOpen(false)
                }}
                className={cn(
                  "w-full flex items-center gap-2 px-3 py-2 text-sm text-left",
                  "transition-colors duration-100",
                  isActive
                    ? "bg-selected text-primary font-medium"
                    : "text-foreground hover:bg-hover"
                )}
              >
                <Icon size={14} weight={isActive ? "fill" : "regular"} />
                <span>{t(option.labelKey)}</span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

// =============================================================================
// Main Component
// =============================================================================

export function FeedControlBar({
  activeSort,
  onSortChange,
  activePills,
  onPillToggle,
  onFilterClick,
  productCount,
  activeFilterCount = 0,
  sticky = true,
  className,
}: FeedControlBarProps) {
  const t = useTranslations("Home")
  const totalActiveFilters = activeFilterCount + activePills.length

  return (
    <div
      className={cn(
        "bg-background z-20",
        sticky && "sticky top-13",
        className
      )}
    >
      {/* Control Row */}
      <div className="flex items-center gap-2 py-2.5">
        {/* Filter Button */}
        <button
          type="button"
          onClick={onFilterClick}
          aria-label={
            totalActiveFilters > 0
              ? t("mobile.filtersActive", { count: totalActiveFilters })
              : t("mobile.sortOptions")
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
          {totalActiveFilters > 0 && (
            <span className="absolute -top-1 -right-1 size-4 flex items-center justify-center rounded-full bg-destructive text-destructive-foreground text-2xs font-bold">
              {totalActiveFilters > 9 ? "9+" : totalActiveFilters}
            </span>
          )}
        </button>

        {/* Scrollable Pills Container */}
        <div className="flex-1 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-2 pr-inset">
            {/* Sort Dropdown */}
            <SortDropdown
              activeSort={activeSort}
              onSortChange={onSortChange}
            />

            {/* Quick Filter Pills */}
            {QUICK_PILLS.map((pill) => {
              const Icon = pill.icon
              const isActive = activePills.includes(pill.id)
              return (
                <button
                  key={pill.id}
                  type="button"
                  onClick={() => onPillToggle(pill.id)}
                  aria-pressed={isActive}
                  className={cn(
                    "flex items-center gap-1.5 h-8 px-3 rounded-full shrink-0",
                    "text-sm font-medium whitespace-nowrap",
                    "border transition-all duration-200",
                    "active:opacity-90",
                    isActive
                      ? cn(
                          "border-transparent shadow-md",
                          pill.activeClassName
                        )
                      : "bg-surface-subtle text-muted-foreground border-border/40 hover:text-foreground hover:bg-hover active:bg-active"
                  )}
                >
                  <Icon 
                    size={14} 
                    weight={isActive ? "fill" : "regular"} 
                  />
                  <span>{t(pill.labelKey)}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Product Count */}
      {typeof productCount === "number" && productCount > 0 && (
        <p className="px-inset pb-2 text-xs text-muted-foreground tabular-nums">
          {t("mobile.listingsCount", { count: productCount })}
        </p>
      )}
    </div>
  )
}

// Export types for parent component
export type { QuickPillId }
