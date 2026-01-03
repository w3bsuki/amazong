"use client"

import { useRef } from "react"
import type { CategoryTreeNode } from "@/lib/category-tree"
import { getCategoryShortName } from "@/lib/category-display"
import { CategoryCircle } from "@/components/shared/category/category-circle"
import { CaretLeft } from "@phosphor-icons/react"
import { cn } from "@/lib/utils"

type Category = CategoryTreeNode

// =============================================================================
// Types
// =============================================================================

export interface CategoryCirclesProps {
  circles: Category[]
  activeL1: string | null
  activeL2: string | null
  showL2Circles: boolean
  locale: string
  circlesNavigateToPages: boolean
  activeTab: string
  onCircleClick: (category: Category) => void
  onBack: () => void
}

// =============================================================================
// Component
// =============================================================================

export function CategoryCircles({
  circles,
  activeL1,
  activeL2,
  showL2Circles,
  locale,
  circlesNavigateToPages,
  activeTab,
  onCircleClick,
  onBack,
}: CategoryCirclesProps) {
  const subTabsContainerRef = useRef<HTMLDivElement>(null)

  // Don't render if no circles and no back button needed
  if (circles.length === 0 && !activeL1) {
    return <div className="flex-1" />
  }

  return (
    <div className="px-(--page-inset) flex items-center gap-2">
      {/* Back Button - shows when L1 or deeper is selected */}
      {activeL1 && (
        <button
          type="button"
          onClick={onBack}
          className="size-7 shrink-0 rounded-full bg-muted/60 flex items-center justify-center hover:bg-muted transition-colors duration-100"
          aria-label={locale === "bg" ? "Назад" : "Back"}
        >
          <CaretLeft
            size={16}
            weight="bold"
            className="text-muted-foreground"
            aria-hidden="true"
          />
        </button>
      )}

      <div
        ref={subTabsContainerRef}
        className="flex-1 flex overflow-x-auto no-scrollbar gap-1.5 snap-x snap-mandatory items-start"
      >
        {/* Subcategory Circles */}
        {circles.map((sub) => {
          const isActive = showL2Circles
            ? activeL2 === sub.slug
            : activeL1 === sub.slug

          const dimmed =
            (showL2Circles ? !!activeL2 : !!activeL1) && !isActive

          // When circlesNavigateToPages is true, navigate to the category's own page
          const href =
            circlesNavigateToPages && activeTab !== "all"
              ? (`/categories/${sub.slug}` as const)
              : undefined

          return (
            <CategoryCircle
              key={sub.slug}
              category={sub}
              {...(href ? { href } : { onClick: () => onCircleClick(sub) })}
              active={isActive}
              dimmed={dimmed}
              circleClassName="size-(--category-circle-mobile)"
              fallbackIconSize={20}
              fallbackIconWeight={isActive ? "fill" : "regular"}
              variant="muted"
              label={getCategoryShortName(sub, locale)}
              className={cn("w-12", "transition-opacity duration-100")}
              labelClassName={cn(
                "text-2xs text-center leading-tight line-clamp-2 w-full font-medium",
                isActive ? "text-brand" : "text-muted-foreground"
              )}
            />
          )
        })}
      </div>
    </div>
  )
}
