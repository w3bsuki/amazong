"use client"

import * as React from "react"
import type { CategoryTreeNode } from "@/lib/category-tree"
import { getCategoryName, getCategorySlugKey } from "@/lib/category-display"
import { cn } from "@/lib/utils"
import { useTranslations } from "next-intl"

import { CategoryCircle } from "@/components/shared/category/category-circle"
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
 * Simple horizontal category circles for homepage (icon + label inside).
 *
 * - Horizontal scroll with momentum, no visible scrollbar
 * - Active state uses a clear ring (native app feel)
 * - Tapping opens the CategoryBrowseDrawer (when available)
 */
export function CategoryCirclesSimple({
  categories,
  locale,
  className,
  onCategorySelect,
}: CategoryCirclesSimpleProps) {
  const tCategories = useTranslations("Categories")
  const tDrawer = useTranslations("CategoryDrawer")
  const drawer = useCategoryDrawerOptional()

  const handleCategoryClick = React.useCallback(
    (category: CategoryTreeNode) => {
      if (drawer) {
        drawer.openCategory(category)
      } else {
        onCategorySelect?.(category)
      }
    },
    [drawer, onCategorySelect]
  )

  if (categories.length === 0) return null

  const circleSize = "size-(--spacing-category-circle)"
  const itemWidth = "flex-none w-(--spacing-category-item-lg)"

  const rootActive = Boolean(drawer?.isOpen && drawer.path.length === 0)
  const rootLabel = tDrawer("title")
  const rootHref = "/categories" as const

  return (
    <div className={cn("px-inset-md py-2 overflow-x-auto no-scrollbar", className)}>
      <div className="flex items-start gap-1">
        {/* Root / Categories */}
        <CategoryCircle
          category={{ slug: "categories" }}
          label={rootLabel}
          active={rootActive}
          {...(drawer ? { onClick: drawer.openRoot } : { href: rootHref, prefetch: true })}
          labelPlacement="inside"
          circleClassName={circleSize}
          fallbackIconSize={24}
          fallbackIconWeight="duotone"
          variant="colorful"
          preferIcon
          className={itemWidth}
          insideLabelClassName={rootActive ? "text-foreground" : "text-muted-foreground"}
        />

        {/* L0 categories */}
        {categories.map((category) => {
          const isActive = drawer?.path[0]?.slug === category.slug
          const label = tCategories("shortName", {
            slug: getCategorySlugKey(category.slug),
            name: getCategoryName(category, locale),
          })

          return (
            <CategoryCircle
              key={category.slug}
              category={category}
              label={label}
              {...(drawer
                ? { onClick: () => handleCategoryClick(category) }
                : { href: (`/categories/${category.slug}` as const), prefetch: true })}
              active={isActive}
              labelPlacement="inside"
              circleClassName={circleSize}
              fallbackIconSize={24}
              fallbackIconWeight="duotone"
              variant="colorful"
              preferIcon
              className={itemWidth}
              insideLabelClassName={isActive ? "text-foreground" : "text-muted-foreground"}
            />
          )
        })}
      </div>
    </div>
  )
}
