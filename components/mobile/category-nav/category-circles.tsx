"use client"

import { useRef } from "react"
import type { CategoryTreeNode } from "@/lib/category-tree"
import { getCategoryShortName, getCategoryName } from "@/lib/category-display"
import { CategoryCircle } from "@/components/shared/category/category-circle"
import { X, CaretLeft, SquaresFour } from "@phosphor-icons/react"
import { cn } from "@/lib/utils"
import { getCategoryIcon } from "@/lib/category-icons"
import { Skeleton } from "@/components/ui/skeleton"
import { useTranslations } from "next-intl"

type Category = CategoryTreeNode

// =============================================================================
// Types
// =============================================================================

export interface CategoryCirclesProps {
  circles: Category[]
  activeL1: string | null
  activeL2: string | null
  /** The active L2 category object (for morphed back button icon) */
  activeL2Category?: Category | null
  activeCategoryName?: string | null
  showL2Circles: boolean
  /** Treido pattern: true when circles should be hidden and pills visible */
  isDrilledDown?: boolean
  /** L3 categories to show as pills when drilled down */
  l3Categories?: Category[]
  /** Selected L3 pill slug */
  selectedPill?: string | null
  /** L3 loading state */
  isL3Loading?: boolean
  /** Slug of the category currently being loaded (for loading indicator) */
  loadingSlug?: string | null
  locale: string
  circlesNavigateToPages: boolean
  activeTab: string
  onCircleClick: (category: Category) => void
  onBack: () => void
  /** Handler for L3 pill clicks */
  onPillClick?: (category: Category) => void
  /** Handler for "All" pill click */
  onAllPillClick?: () => void
  hideBackButton?: boolean
  className?: string
}

// =============================================================================
// Component
// =============================================================================

export function CategoryCircles({
  circles,
  activeL1,
  activeL2,
  activeL2Category,
  activeCategoryName,
  showL2Circles,
  isDrilledDown = false,
  l3Categories = [],
  selectedPill,
  isL3Loading = false,
  loadingSlug,
  locale,
  circlesNavigateToPages,
  activeTab,
  onCircleClick,
  onBack,
  onPillClick,
  onAllPillClick,
  hideBackButton,
  className,
}: CategoryCirclesProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const tCommon = useTranslations("Common")

  // When circlesNavigateToPages is true, circles become Link elements for SEO + prefetch.
  // This gives us proper loading.tsx skeleton states during navigation.
  const allowHrefNavigation = circlesNavigateToPages

  // ==========================================================================
  // STATE B: Drilled Down (Treido-mock "Shelf" view)
  // Show morphed back pill + L3 pills in same row, NO circles
  // ==========================================================================
  if (isDrilledDown) {
    // Get icon for the morphed back button using category slug
    const activeIcon = activeL2Category?.slug
      ? getCategoryIcon(activeL2Category.slug, { size: 16, weight: "bold" })
      : <CaretLeft size={12} weight="bold" />

    const backLabel = activeL2Category
      ? getCategoryName(activeL2Category, locale)
      : (activeCategoryName || tCommon("back"))

    const allLabel = tCommon("all")

    return (
      <div className="px-3 py-2.5 flex items-center overflow-x-auto no-scrollbar gap-2">
        {/* Morphed Back Button (Treido pattern) */}
        <button
          type="button"
          onClick={onBack}
          className={cn(
            "shrink-0 flex items-center gap-1.5 pl-2 pr-3 py-1.5",
            "bg-foreground text-background rounded-full",
            "text-xs font-medium",
            "active:opacity-90 transition-opacity"
          )}
          aria-label={tCommon("back")}
        >
          {/* Mini icon inside translucent circle */}
          <div className="w-4 h-4 bg-background/20 rounded-full flex items-center justify-center text-background">
            {activeIcon}
          </div>
          <span className="max-w-20 truncate">{backLabel}</span>
          <X size={12} weight="bold" className="ml-0.5 opacity-60" />
        </button>

        {/* Divider */}
        <div className="w-px h-4 bg-border shrink-0" />

        {/* L3 Pills (inline with back button) */}
        {isL3Loading ? (
          <div className="flex gap-1.5 items-center">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-7 w-14 rounded-full" />
            ))}
          </div>
        ) : (
          <>
            {/* "All" Pill */}
            <button
              type="button"
              onClick={onAllPillClick}
              className={cn(
                "shrink-0 whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium border transition-all",
                selectedPill === null
                  ? "bg-foreground text-background border-foreground"
                  : "bg-background text-muted-foreground border-border hover:border-foreground/30"
              )}
            >
              {allLabel}
            </button>

            {/* L3 Category Pills */}
            {l3Categories.map((cat) => {
              const isSelected = selectedPill === cat.slug
              return (
                <button
                  key={cat.slug}
                  type="button"
                  onClick={() => onPillClick?.(cat)}
                  className={cn(
                    "shrink-0 whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium border transition-all",
                    isSelected
                      ? "bg-foreground text-background border-foreground"
                      : "bg-background text-muted-foreground border-border hover:border-foreground/30"
                  )}
                >
                  {getCategoryName(cat, locale)}
                </button>
              )
            })}
          </>
        )}
      </div>
    )
  }

  // ==========================================================================
  // STATE A: Showroom (Treido-mock "Showroom" view)
  // Show visual circles, NO back button, NO pills
  // ==========================================================================

  // Don't render if no circles to show
  if (circles.length === 0) {
    return null
  }

  return (
    <div className={cn("px-inset py-2 overflow-x-auto no-scrollbar", className)}>
      <div
        ref={containerRef}
        className="flex items-start gap-1.5"
      >
        {/* 'All' Circle (Static - Always visible) */}
        <CategoryCircle
          category={{ slug: 'all' }}
          label={tCommon("all")}
          active={!activeL2}
          onClick={() => onBack()}
          circleClassName="size-(--spacing-category-circle)"
          fallbackIconSize={24}
          fallbackIconWeight="regular"
          variant="colorful"
          className="flex-none w-(--spacing-category-item-lg)"
          labelClassName={cn(
            "w-full text-2xs text-center leading-tight line-clamp-2 px-0 mt-1",
            "font-medium",
            !activeL2 ? "text-foreground" : "text-muted-foreground"
          )}
        />
        {circles.map((sub) => {
          const isActive = showL2Circles
            ? activeL2 === sub.slug
            : activeL1 === sub.slug
          const isLoading = loadingSlug === sub.slug

          const href = allowHrefNavigation ? (`/categories/${sub.slug}` as const) : undefined

          return (
            <CategoryCircle
              key={sub.slug}
              category={sub}
              {...(href ? { href, prefetch: true } : { onClick: () => onCircleClick(sub) })}
              active={isActive}
              loading={isLoading}
              circleClassName="size-(--spacing-category-circle)"
              fallbackIconSize={24}
              fallbackIconWeight="regular"
              variant="colorful"
              label={getCategoryShortName(sub, locale)}
              className="flex-none w-(--spacing-category-item-lg)"
              labelClassName={cn(
                "w-full text-2xs text-center leading-tight line-clamp-2 px-0 mt-1",
                "font-medium",
                isActive ? "text-foreground" : "text-muted-foreground"
              )}
            />
          )
        })}
      </div>
    </div>
  )
}
