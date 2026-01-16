"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { useTranslations } from "next-intl"
import {
  TrendUp,
  GridFour,
  Fire,
  Percent,
  Star,
  Tag,
  MapPin,
  ChartLineUp,
  Eye,
  CaretDown,
  Rows,
  SquaresFour,
} from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// =============================================================================
// DESKTOP FILTER TABS
//
// Clean horizontal strip of filter/sort pills for product feeds:
// - Primary tabs inline (Newest, Best sellers, Most viewed, etc.)
// - "More" dropdown for secondary options
// - View mode toggle (grid/list)
//
// Design rules (from DESIGN.md):
// - Active pill: bg-foreground text-background border-foreground
// - Inactive pill: bg-background text-muted-foreground border-border/60
// - Use semantic tokens, no hardcoded colors
// - Touch targets h-touch-sm (36px)
// =============================================================================

type FeedTab =
  | "all"
  | "newest"
  | "promoted"
  | "deals"
  | "top_rated"
  | "best_sellers"
  | "most_viewed"
  | "price_low"
  | "nearby"

type ViewMode = "grid" | "list"

interface DesktopFilterTabsProps {
  activeTab: FeedTab
  onTabChange: (tab: FeedTab) => void
  viewMode: ViewMode
  onViewModeChange: (mode: ViewMode) => void
  showViewToggle?: boolean
  className?: string
}

export function DesktopFilterTabs({
  activeTab,
  onTabChange,
  viewMode,
  onViewModeChange,
  showViewToggle = true,
  className,
}: DesktopFilterTabsProps) {
  const t = useTranslations("TabbedProductFeed")

  // Primary tabs shown inline
  const primaryTabs: { id: FeedTab; label: string; icon: typeof GridFour }[] = [
    { id: "newest", label: t("tabs.newest"), icon: TrendUp },
    { id: "best_sellers", label: t("tabs.best_sellers"), icon: ChartLineUp },
    { id: "most_viewed", label: t("tabs.most_viewed"), icon: Eye },
    { id: "top_rated", label: t("tabs.top_rated"), icon: Star },
    { id: "deals", label: t("tabs.deals"), icon: Percent },
  ]

  // Secondary tabs in dropdown
  const secondaryTabs: { id: FeedTab; label: string; icon: typeof GridFour }[] = [
    { id: "all", label: t("tabs.all"), icon: GridFour },
    { id: "promoted", label: t("tabs.promoted"), icon: Fire },
    { id: "price_low", label: t("tabs.price_low"), icon: Tag },
    { id: "nearby", label: t("tabs.nearby"), icon: MapPin },
  ]

  const isSecondaryActive = secondaryTabs.some((tab) => tab.id === activeTab)
  const activeSecondaryTab = secondaryTabs.find((tab) => tab.id === activeTab)

  return (
    <div className={cn("flex items-center gap-3", className)}>
      {/* Primary filter tabs */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          {primaryTabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onTabChange(tab.id)}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-3.5 h-touch-sm",
                  "text-sm font-medium whitespace-nowrap transition-colors border",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
                  isActive
                    ? "bg-foreground text-background border-foreground"
                    : "bg-background text-muted-foreground border-border/60 hover:bg-muted/50 hover:text-foreground hover:border-foreground/20"
                )}
              >
                <Icon size={16} weight={isActive ? "fill" : "regular"} />
                {tab.label}
              </button>
            )
          })}

          {/* More dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-3.5 h-touch-sm",
                  "text-sm font-medium whitespace-nowrap transition-colors border",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
                  isSecondaryActive
                    ? "bg-foreground text-background border-foreground"
                    : "bg-background text-muted-foreground border-border/60 hover:bg-muted/50 hover:text-foreground hover:border-foreground/20"
                )}
              >
                {activeSecondaryTab ? (
                  <>
                    <activeSecondaryTab.icon size={16} weight="fill" />
                    {activeSecondaryTab.label}
                  </>
                ) : (
                  t("tabs.more")
                )}
                <CaretDown size={14} weight="bold" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="min-w-40">
              {secondaryTabs.map((tab) => {
                const Icon = tab.icon
                const isActive = activeTab === tab.id

                return (
                  <DropdownMenuItem
                    key={tab.id}
                    onClick={() => onTabChange(tab.id)}
                    className={cn(
                      "flex items-center gap-2 cursor-pointer",
                      isActive && "bg-muted font-medium"
                    )}
                  >
                    <Icon size={16} weight={isActive ? "fill" : "regular"} />
                    {tab.label}
                  </DropdownMenuItem>
                )
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* View mode toggle */}
      {showViewToggle && (
        <div className="flex items-center gap-0.5 p-0.5 rounded-lg bg-muted/50 border border-border/60 shrink-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onViewModeChange("grid")}
            className={cn(
              "size-8 rounded-md",
              viewMode === "grid"
                ? "bg-background text-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-transparent"
            )}
            aria-label="Grid view"
            aria-pressed={viewMode === "grid"}
          >
            <SquaresFour size={18} weight={viewMode === "grid" ? "fill" : "regular"} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onViewModeChange("list")}
            className={cn(
              "size-8 rounded-md",
              viewMode === "list"
                ? "bg-background text-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-transparent"
            )}
            aria-label="List view"
            aria-pressed={viewMode === "list"}
          >
            <Rows size={18} weight={viewMode === "list" ? "fill" : "regular"} />
          </Button>
        </div>
      )}
    </div>
  )
}
