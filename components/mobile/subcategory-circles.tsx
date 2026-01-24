"use client"

import * as React from "react"
import Image from "next/image"
import { Link } from "@/i18n/routing"
import type { CategoryTreeNode } from "@/lib/category-tree"
import { getCategoryName } from "@/lib/category-display"
import { SquaresFour, Package } from "@phosphor-icons/react"
import { useTranslations } from "next-intl"

// =============================================================================
// TYPES
// =============================================================================

export interface SubcategoryCirclesProps {
  subcategories: CategoryTreeNode[]
  categorySlug: string
  locale: string
  onSubcategoryClick?: (category: CategoryTreeNode) => void
}

// =============================================================================
// SUBCATEGORY CIRCLES (Temu pattern - visual browse when category selected)
// =============================================================================

export function SubcategoryCircles({
  subcategories,
  categorySlug,
  locale,
  onSubcategoryClick,
}: SubcategoryCirclesProps) {
  if (!subcategories || subcategories.length === 0) return null

  const tCommon = useTranslations("Common")
  const viewAllLabel = tCommon("viewAll")

  return (
    <div className="py-3 overflow-x-auto no-scrollbar">
      <div className="flex items-start gap-3 px-inset">
        {/* View All - First circle */}
        <Link
          href={`/categories/${categorySlug}`}
          className="flex flex-col items-center gap-1.5 shrink-0 w-16 active:opacity-80 transition-opacity"
        >
          <div className="size-14 rounded-full bg-foreground text-background flex items-center justify-center">
            <SquaresFour size={22} weight="fill" />
          </div>
          <span className="text-2xs text-center text-foreground font-semibold leading-tight line-clamp-2">
            {viewAllLabel}
          </span>
        </Link>

        {/* Subcategory circles */}
        {subcategories.slice(0, 10).map((sub) => (
          <button
            key={sub.id}
            type="button"
            onClick={() => onSubcategoryClick?.(sub)}
            className="flex flex-col items-center gap-1.5 shrink-0 w-16 active:opacity-80 transition-opacity"
          >
            {/* Circle with image/icon */}
            <div className="size-14 rounded-full bg-muted/50 border border-border/30 overflow-hidden flex items-center justify-center">
              {sub.image_url ? (
                <Image
                  src={sub.image_url}
                  alt={getCategoryName(sub, locale)}
                  width={56}
                  height={56}
                  className="size-full object-cover"
                />
              ) : (
                <Package size={20} className="text-muted-foreground/40" />
              )}
            </div>
            {/* Label */}
            <span className="text-2xs text-center text-muted-foreground font-medium leading-tight line-clamp-2">
              {getCategoryName(sub, locale)}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
