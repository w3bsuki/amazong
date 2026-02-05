"use client"

import * as React from "react"
import type { CategoryTreeNode } from "@/lib/category-tree"
import { getCategoryName, getCategorySlugKey } from "@/lib/category-display"
import { getCategoryIcon } from "@/components/shared/category/category-icons"
import { cn } from "@/lib/utils"
import { useTranslations } from "next-intl"
import { Link } from "@/i18n/routing"
import { useCategoryDrawerOptional } from "./category-drawer-context"
import { SquaresFour } from "@phosphor-icons/react"

// =============================================================================
// Types
// =============================================================================

export interface CategoryChipsSimpleProps {
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
 * Calm horizontal category chips for homepage (icon + label).
 *
 * - Horizontal scroll with momentum, no visible scrollbar
 * - Active state uses filled surface (no thick borders)
 * - Tapping opens the CategoryBrowseDrawer (when available)
 */
export function CategoryChipsSimple({
  categories,
  locale,
  className,
  onCategorySelect,
}: CategoryChipsSimpleProps) {
  const tCategories = useTranslations("Categories")
  const tDrawer = useTranslations("CategoryDrawer")
  const drawer = useCategoryDrawerOptional()

  const handleChipClick = React.useCallback(
    (category: CategoryTreeNode) => {
      if (drawer) {
        drawer.openCategory(category)
      } else {
        onCategorySelect?.(category)
      }
    },
    [drawer, onCategorySelect]
  )

  const handleCategoriesClick = React.useCallback(() => {
    if (drawer) {
      drawer.openRoot()
    }
  }, [drawer])

  if (categories.length === 0) return null

  const baseChip =
    "inline-flex items-center gap-2 min-h-touch-sm px-3 shrink-0 rounded-full text-xs font-medium whitespace-nowrap " +
    "tap-transparent transition-colors " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"

  return (
    <div className={cn("px-inset-md py-2 overflow-x-auto no-scrollbar", className)}>
      <div className="flex items-center gap-2">
        {/* Categories / More */}
        {drawer ? (
          (() => {
            const isRootActive = drawer.isOpen && drawer.path.length === 0
            return (
              <button
                type="button"
                onClick={handleCategoriesClick}
                className={cn(
                  baseChip,
                  isRootActive
                    ? "bg-muted text-foreground"
                    : "bg-surface-subtle text-muted-foreground hover:bg-hover hover:text-foreground active:bg-active"
                )}
                aria-pressed={isRootActive}
              >
                <SquaresFour
                  size={16}
                  weight={isRootActive ? "fill" : "regular"}
                  className={isRootActive ? "text-foreground" : "text-muted-foreground"}
                  aria-hidden="true"
                />
                <span>{tDrawer("title")}</span>
              </button>
            )
          })()
        ) : (
          <Link
            href="/categories"
            prefetch={true}
            className={cn(
              baseChip,
              "bg-surface-subtle text-muted-foreground hover:bg-hover hover:text-foreground active:bg-active"
            )}
            aria-label={tDrawer("ariaLabel")}
          >
            <SquaresFour
              size={16}
              weight="regular"
              className="text-muted-foreground"
              aria-hidden="true"
            />
            <span>{tDrawer("title")}</span>
          </Link>
        )}

        {/* L0 categories */}
        {categories.map((category) => {
          const isActive = drawer?.path[0]?.slug === category.slug
          const label = tCategories("shortName", {
            slug: getCategorySlugKey(category.slug),
            name: getCategoryName(category, locale),
          })

          return (
            <button
              key={category.slug}
              type="button"
              onClick={() => handleChipClick(category)}
              className={cn(
                baseChip,
                isActive
                  ? "bg-muted text-foreground"
                  : "bg-surface-subtle text-muted-foreground hover:bg-hover hover:text-foreground active:bg-active"
              )}
              aria-pressed={isActive}
            >
              {getCategoryIcon(category.slug, {
                size: 16,
                weight: isActive ? "fill" : "regular",
                className: isActive ? "text-foreground" : "text-muted-foreground",
              })}
              <span>{label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
