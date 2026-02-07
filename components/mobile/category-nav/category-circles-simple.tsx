"use client"

import * as React from "react"
import type { CategoryTreeNode } from "@/lib/category-tree"
import { getCategoryName, getCategorySlugKey } from "@/lib/category-display"
import { cn } from "@/lib/utils"
import { useTranslations } from "next-intl"
import { DotsThree } from "@phosphor-icons/react"
import { Link } from "@/i18n/routing"
import { getCategoryIcon } from "@/components/shared/category/category-icons"

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
  /** Maximum number of root categories visible in the homepage rail */
  maxVisible?: number
}

// =============================================================================
// Component
// =============================================================================

/**
 * Simple horizontal category circles for homepage (icon + label below).
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
  maxVisible = 7,
}: CategoryCirclesSimpleProps) {
  const tCategories = useTranslations("Categories")
  const tMobile = useTranslations("Home.mobile")
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

  const itemWidth = "flex-none w-(--spacing-category-item-nav)"
  const iconShellSize = "size-(--control-default)"
  const labelClass = "text-2xs font-semibold leading-tight tracking-tight"
  const itemBase =
    "group inline-flex min-h-(--spacing-touch-md) flex-col items-center justify-start gap-1.5 rounded-2xl px-1.5 py-2 tap-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-1"
  const itemState = (active: boolean) =>
    active
      ? "bg-foreground"
      : "bg-surface-subtle hover:bg-hover active:bg-active"
  const iconShellState = (active: boolean) =>
    cn(
      "flex items-center justify-center rounded-xl transition-colors",
      iconShellSize,
      active
        ? "bg-background text-foreground"
        : "bg-background text-foreground group-hover:bg-hover"
    )
  const iconTone = (active: boolean) =>
    cn("transition-colors", active ? "text-foreground" : "text-muted-foreground")
  const moreIconShellState = (active: boolean) =>
    cn(
      "flex items-center justify-center rounded-xl bg-background transition-colors",
      iconShellSize,
      active ? "text-foreground" : "text-foreground"
    )

  const rootActive = Boolean(drawer?.isOpen && drawer.path.length === 0)
  const rootLabel = tCategories("all")
  const rootHref = "/categories" as const
  const visibleCategories = categories.slice(0, Math.max(1, maxVisible))

  return (
    <div className={cn("overflow-x-auto px-(--spacing-home-inset) py-2 no-scrollbar", className)}>
      <div className="flex snap-x snap-mandatory items-start gap-2">
        {/* Root / Categories */}
        {drawer ? (
          <button
            type="button"
            onClick={drawer.openRoot}
            className={cn(itemBase, itemState(rootActive), itemWidth)}
            aria-pressed={rootActive}
            aria-label={rootLabel}
          >
            <span className={iconShellState(rootActive)}>
              {getCategoryIcon("categories", {
                size: 20,
                weight: rootActive ? "fill" : "regular",
                className: iconTone(rootActive),
              })}
            </span>
            <span className={cn(labelClass, "w-full text-center", rootActive ? "text-background" : "text-muted-foreground")}>
              {rootLabel}
            </span>
          </button>
        ) : (
          <Link
            href={rootHref}
            prefetch={true}
            className={cn(itemBase, itemState(false), itemWidth)}
            aria-label={rootLabel}
          >
            <span className={iconShellState(false)}>
              {getCategoryIcon("categories", {
                size: 20,
                weight: "regular",
                className: iconTone(false),
              })}
            </span>
            <span className={cn(labelClass, "w-full text-center text-foreground")}>
              {rootLabel}
            </span>
          </Link>
        )}

        {/* Top L0 categories */}
        {visibleCategories.map((category) => {
          const isActive = Boolean(drawer?.isOpen && drawer.path[0]?.slug === category.slug)
          const label = tCategories("shortName", {
            slug: getCategorySlugKey(category.slug),
            name: getCategoryName(category, locale),
          })

          if (drawer) {
            return (
              <button
                key={category.slug}
                type="button"
                onClick={() => handleCategoryClick(category)}
                className={cn(itemBase, itemState(Boolean(isActive)), itemWidth)}
                aria-pressed={Boolean(isActive)}
                aria-label={label}
              >
                <span className={iconShellState(Boolean(isActive))}>
                  {getCategoryIcon(category.slug, {
                    size: 20,
                    weight: isActive ? "fill" : "regular",
                    className: iconTone(Boolean(isActive)),
                  })}
                </span>
                <span className={cn(labelClass, "w-full text-center", isActive ? "text-background" : "text-muted-foreground")}>
                  {label}
                </span>
              </button>
            )
          }

          return (
            <Link
              key={category.slug}
              href={`/categories/${category.slug}` as const}
              prefetch={true}
              className={cn(itemBase, itemState(false), itemWidth)}
              aria-label={label}
            >
              <span className={iconShellState(false)}>
                {getCategoryIcon(category.slug, {
                  size: 20,
                  weight: "regular",
                  className: iconTone(false),
                })}
              </span>
              <span className={cn(labelClass, "w-full text-center text-foreground")}>
                {label}
              </span>
            </Link>
          )
        })}

        {/* Explicit "More" affordance keeps the above-the-fold rail focused. */}
        {drawer ? (
          <button
            type="button"
            onClick={drawer.openRoot}
            className={cn(
              itemBase,
              itemState(false),
              itemWidth
            )}
            aria-label={tMobile("moreCategories")}
          >
            <span className={moreIconShellState(false)}>
              <DotsThree size={22} weight="bold" className="text-foreground" />
            </span>
            <span className={cn(labelClass, "w-full text-center text-foreground")}>
              {tMobile("moreCategories")}
            </span>
          </button>
        ) : (
          <Link
            href={rootHref}
            prefetch={true}
            className={cn(itemBase, itemState(false), itemWidth)}
            aria-label={tMobile("moreCategories")}
          >
            <span className={moreIconShellState(false)}>
              <DotsThree size={22} weight="bold" className="text-foreground" />
            </span>
            <span className={cn(labelClass, "w-full text-center text-foreground")}>
              {tMobile("moreCategories")}
            </span>
          </Link>
        )}
      </div>
    </div>
  )
}
