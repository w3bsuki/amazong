"use client"

import { useRef } from "react"
import type { CategoryTreeNode } from "@/lib/category-tree"
import { getCategoryShortName, getCategoryName } from "@/lib/category-display"
import { CategoryCircle } from "@/components/shared/category/category-circle"
import { X, CaretLeft, SquaresFour } from "@phosphor-icons/react"
import { cn } from "@/lib/utils"
import { getCategoryIcon } from "@/lib/category-icons"
import { Skeleton } from "@/components/ui/skeleton"

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
      : (activeCategoryName || (locale === "bg" ? "Назад" : "Back"))

    const allLabel = locale === "bg" ? "Всички" : "All"

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
          aria-label={locale === "bg" ? "Назад" : "Back"}
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
    <div className={cn("px-(--page-inset) py-2 overflow-x-auto no-scrollbar", className)}>
      <div
        ref={containerRef}
        className="flex items-start gap-2"
      >
        {/* 'All' Circle (Static - Always visible) */}
        <CategoryCircle
          category={{ slug: 'all' }} // Icon handled by getCategoryIcon via slug
          label={locale === 'bg' ? 'Всички' : 'All'}
          active={!activeL2} // Active if no subcategory selected
          onClick={() => onBack()} // Acts as 'Reset' to parent L1
          circleClassName="size-(--spacing-category-circle) bg-muted/50 border-2 border-transparent data-[active=true]:border-foreground"
          fallbackIconSize={24}
          fallbackIconWeight="regular"
          variant="muted"
          className="flex-none w-(--spacing-category-item)"
          labelClassName={cn(
            "w-full text-2xs text-center leading-tight line-clamp-2 px-1 mt-2",
            "text-muted-foreground font-medium",
            !activeL2 && "text-foreground font-bold"
          )}
        />
        {circles.map((sub) => {
          const isActive = showL2Circles
            ? activeL2 === sub.slug
            : activeL1 === sub.slug

          // In showroom mode, no dimming - all circles equally visible
          const dimmed = false

          // Use href navigation when circlesNavigateToPages is enabled.
          // Prefetch=true gives near-instant navigation with loading.tsx skeleton.
          const href = allowHrefNavigation ? (`/categories/${sub.slug}` as const) : undefined

          return (
            <CategoryCircle
              key={sub.slug}
              category={sub}
              {...(href ? { href, prefetch: true } : { onClick: () => onCircleClick(sub) })}
              active={isActive}
              dimmed={dimmed}
              circleClassName="size-(--spacing-category-circle)"
              fallbackIconSize={20}
              fallbackIconWeight="light"
              variant="muted"
              label={getCategoryShortName(sub, locale)}
              className="flex-none w-(--spacing-category-item)"
              labelClassName={cn(
                "w-full text-2xs text-center leading-tight line-clamp-2 px-1 mt-2",
                "text-muted-foreground font-medium"
              )}
            />
          )
        })}
      </div>
    </div>
  )
}
