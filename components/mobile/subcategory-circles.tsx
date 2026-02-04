"use client"

import * as React from "react"
import { Link } from "@/i18n/routing"
import type { CategoryTreeNode } from "@/lib/category-tree"
import { getCategoryName } from "@/lib/category-display"
import { SquaresFour } from "@phosphor-icons/react"
import { useTranslations } from "next-intl"
import { CategoryCircleVisual } from "@/components/shared/category/category-circle-visual"

// =============================================================================
// TYPES
// =============================================================================

export interface SubcategoryCirclesProps {
  subcategories: CategoryTreeNode[]
  categorySlug: string
  locale: string
  onSubcategoryClick?: (category: CategoryTreeNode) => void
  /** When true, always show Phosphor icons instead of images. */
  preferIcon?: boolean
}

// =============================================================================
// SUBCATEGORY CIRCLES (Temu pattern - visual browse when category selected)
// =============================================================================

export function SubcategoryCircles({
  subcategories,
  categorySlug,
  locale,
  onSubcategoryClick,
  preferIcon = true, // Default to Phosphor icons
}: SubcategoryCirclesProps) {
  const tCommon = useTranslations("Common")
  const viewAllLabel = tCommon("viewAll")

  if (!subcategories || subcategories.length === 0) return null

  return (
    <div className="py-2 overflow-x-auto no-scrollbar">
      <div className="flex items-start gap-1 px-inset-md">
        {/* View All - First circle */}
        <Link
          href={`/categories/${categorySlug}`}
          className="flex flex-col items-center gap-0.5 shrink-0 w-(--spacing-category-item-lg) active:opacity-80 transition-opacity"
        >
          <div className="size-(--spacing-category-circle) rounded-full bg-foreground text-background flex items-center justify-center">
            <SquaresFour size={20} weight="fill" />
          </div>
          <span className="text-xs text-center text-foreground font-semibold leading-tight line-clamp-1 truncate w-full">
            {viewAllLabel}
          </span>
        </Link>

        {/* Subcategory circles */}
        {subcategories.slice(0, 10).map((sub) => (
          <button
            key={sub.id}
            type="button"
            onClick={() => onSubcategoryClick?.(sub)}
            className="flex flex-col items-center gap-0.5 shrink-0 w-(--spacing-category-item-lg) active:opacity-80 transition-opacity"
          >
            {/* Circle with image/icon */}
            <CategoryCircleVisual
              category={sub}
              active={false}
              className="size-(--spacing-category-circle)"
              fallbackIconSize={20}
              fallbackIconWeight="bold"
              variant="muted"
              preferIcon={preferIcon}
            />
            {/* Label */}
            <span className="text-xs text-center text-muted-foreground font-medium leading-tight line-clamp-1 truncate w-full">
              {getCategoryName(sub, locale)}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
