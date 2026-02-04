"use client"

import * as React from "react"
import type { CategoryTreeNode } from "@/lib/category-tree"
import { getCategoryName, getCategorySlugKey } from "@/lib/category-display"
import { CategoryCircle } from "@/components/shared/category/category-circle"
import { cn } from "@/lib/utils"
import { useTranslations } from "next-intl"
import { useCategoryDrawerOptional } from "./category-drawer-context"

// =============================================================================
// Types
// =============================================================================

export interface CategoryCirclesSimpleProps {
  /** L0 root categories to display */
  categories: CategoryTreeNode[]
  /** Locale for name display */
  locale: string
  /** Additional class name */
  className?: string
  /** Called when a category is selected (for non-drawer mode) */
  onCategorySelect?: (category: CategoryTreeNode) => void
}

// =============================================================================
// Component
// =============================================================================

/**
 * Instagram Stories-style category circles for homepage (2026 pattern).
 * 
 * - Compact 56px circles optimized for mobile thumb reach
 * - Tapping opens the CategoryBrowseDrawer for subcategory navigation
 * - Horizontal scroll with momentum, no visible scrollbar
 * - Active state shows ring highlight (familiar from Stories)
 */
export function CategoryCirclesSimple({
  categories,
  locale,
  className,
  onCategorySelect,
}: CategoryCirclesSimpleProps) {
  const tCommon = useTranslations("Common")
  const tCategories = useTranslations("Categories")
  const drawer = useCategoryDrawerOptional()

  // Handle circle click - open drawer or call callback
  const handleCircleClick = React.useCallback((category: CategoryTreeNode) => {
    if (drawer) {
      drawer.openCategory(category)
    } else {
      onCategorySelect?.(category)
    }
  }, [drawer, onCategorySelect])

  // Handle "All" click - close drawer, show all products
  const handleAllClick = React.useCallback(() => {
    if (drawer) {
      drawer.close()
    }
  }, [drawer])

  if (categories.length === 0) {
    return null
  }

  return (
    <div className={cn("px-inset-md py-2 overflow-x-auto no-scrollbar", className)}>
      <div className="flex items-start gap-1">
        {/* 'All' Circle */}
        <CategoryCircle
          category={{ slug: 'all' }}
          label={tCommon("all")}
          active={!drawer?.isOpen}
          onClick={handleAllClick}
          circleClassName="size-(--spacing-category-circle)"
          fallbackIconSize={20}
          fallbackIconWeight="bold"
          variant="colorful"
          preferIcon={false}
          className="flex-none w-(--spacing-category-item-lg)"
          labelClassName={cn(
            "w-full text-xs text-center leading-tight line-clamp-1 px-0 mt-1",
            "font-medium truncate",
            !drawer?.isOpen ? "text-foreground" : "text-muted-foreground"
          )}
        />

        {/* L0 Category Circles */}
        {categories.map((category) => {
          const isActive = drawer?.path[0]?.slug === category.slug

          return (
            <CategoryCircle
              key={category.slug}
              category={category}
              onClick={() => handleCircleClick(category)}
              active={isActive}
              circleClassName="size-(--spacing-category-circle)"
              fallbackIconSize={20}
              fallbackIconWeight="bold"
              variant="colorful"
              preferIcon={false}
              label={tCategories("shortName", { slug: getCategorySlugKey(category.slug), name: getCategoryName(category, locale) })}
              className="flex-none w-(--spacing-category-item-lg)"
              labelClassName={cn(
                "w-full text-xs text-center leading-tight line-clamp-1 px-0 mt-1",
                "font-medium truncate",
                isActive ? "text-foreground" : "text-muted-foreground"
              )}
            />
          )
        })}
      </div>
    </div>
  )
}
