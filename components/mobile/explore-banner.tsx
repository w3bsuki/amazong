"use client"

import { cn } from "@/lib/utils"
import { Clock, Tag, Star, SlidersHorizontal } from "@phosphor-icons/react"
import { useTranslations } from "next-intl"

// =============================================================================
// Types
// =============================================================================

export type ExploreTab = "newest" | "offers" | "top-rated"

interface ExploreBannerProps {
  activeTab: ExploreTab
  onTabChange: (tab: ExploreTab) => void
  onSortClick: () => void
  productCount?: number
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
  { id: "top-rated", labelKey: "mobile.exploreTabs.topRated", icon: Star },
]

// =============================================================================
// Component
// =============================================================================

export function ExploreBanner({
  activeTab,
  onTabChange,
  onSortClick,
  productCount,
}: ExploreBannerProps) {
  const t = useTranslations("Home")

  return (
    <div className="px-inset py-2">
      {/* Banner Container */}
      <div className="rounded-lg border border-border/60 bg-background">
        <div className="flex items-center gap-1.5 p-1">
          {/* Segmented Control */}
          <div className="flex-1 flex items-center rounded-md bg-muted/30 p-0.5">
            {EXPLORE_TABS.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => onTabChange(tab.id)}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-1.5",
                    "h-touch-xs rounded-md text-xs font-medium",
                    "transition-all duration-150",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
                    isActive
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                  aria-pressed={isActive}
                >
                  <Icon size={14} weight={isActive ? "fill" : "regular"} />
                  <span className="whitespace-nowrap">
                    {t(tab.labelKey)}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Sort/Settings Button */}
          <button
            type="button"
            onClick={onSortClick}
            className={cn(
              "h-touch-xs w-touch-xs shrink-0 flex items-center justify-center",
              "rounded-md border border-border/60",
              "text-muted-foreground hover:text-foreground",
              "transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
            )}
            aria-label={t("mobile.sortOptions")}
          >
            <SlidersHorizontal size={16} weight="bold" />
          </button>
        </div>
      </div>

      {/* Product Count (subtle, below banner) */}
      {typeof productCount === "number" && productCount > 0 && (
        <p className="mt-2 text-xs text-muted-foreground">
          {t("mobile.listingsCount", { count: productCount })}
        </p>
      )}
    </div>
  )
}
