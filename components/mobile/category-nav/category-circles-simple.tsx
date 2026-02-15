"use client"

import * as React from "react"
import type { CategoryTreeNode } from "@/lib/category-tree"
import { getCategoryName, getCategorySlugKey } from "@/lib/category-display"
import { cn } from "@/lib/utils"
import { useTranslations } from "next-intl"
import { DotsThree } from "@/lib/icons/phosphor"
import { Link, usePathname } from "@/i18n/routing"
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

const ITEM_WIDTH_CLASS = "flex-none w-(--spacing-category-item-nav)"
const ICON_SHELL_SIZE_CLASS = "size-(--control-compact)"
const LABEL_CLASS = "text-xs font-semibold leading-tight tracking-normal"
const ITEM_BASE_CLASS =
  "group inline-flex min-h-(--spacing-touch-md) flex-col items-center justify-start gap-1.5 rounded-xl border px-2 py-2 tap-transparent motion-safe:transition-colors motion-safe:duration-fast motion-safe:ease-(--ease-smooth) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-1"
const ITEM_INACTIVE_CLASS =
  "border-border-subtle bg-surface-subtle text-foreground hover:border-hover-border hover:bg-hover active:bg-active"
const ITEM_ACTIVE_CLASS = "border-foreground bg-foreground text-background"
const ICON_TONE_CLASS =
  "text-foreground motion-safe:transition-colors motion-safe:duration-fast motion-safe:ease-(--ease-smooth)"

function getItemStateClass(active: boolean): string {
  return active ? ITEM_ACTIVE_CLASS : ITEM_INACTIVE_CLASS
}

function getIconShellStateClass(active: boolean): string {
  return cn(
    "flex items-center justify-center rounded-lg motion-safe:transition-colors motion-safe:duration-fast motion-safe:ease-(--ease-smooth)",
    ICON_SHELL_SIZE_CLASS,
    active
      ? "bg-background text-foreground"
      : "bg-background text-foreground group-hover:bg-hover group-hover:text-foreground"
  )
}

function getMoreIconShellStateClass(active: boolean): string {
  return cn(
    "flex items-center justify-center rounded-lg bg-background motion-safe:transition-colors motion-safe:duration-fast motion-safe:ease-(--ease-smooth)",
    ICON_SHELL_SIZE_CLASS,
    active ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
  )
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
  const pathname = usePathname()

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

  const rootActive = Boolean(drawer?.isOpen && drawer.path.length === 0)
  const rootRouteActive = pathname === "/categories"
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
            className={cn(ITEM_BASE_CLASS, getItemStateClass(rootActive), ITEM_WIDTH_CLASS)}
            aria-pressed={rootActive}
            aria-label={rootLabel}
          >
            <span className={getIconShellStateClass(rootActive)}>
              {getCategoryIcon("categories", {
                size: 20,
                weight: rootActive ? "fill" : "regular",
                className: ICON_TONE_CLASS,
              })}
            </span>
            <span className={cn(LABEL_CLASS, "w-full truncate text-center", rootActive ? "text-background" : "text-foreground")}>
              {rootLabel}
            </span>
          </button>
        ) : (
          <Link
            href={rootHref}
            prefetch={true}
            className={cn(ITEM_BASE_CLASS, getItemStateClass(rootRouteActive), ITEM_WIDTH_CLASS)}
            aria-label={rootLabel}
            aria-current={rootRouteActive ? "page" : undefined}
          >
            <span className={getIconShellStateClass(rootRouteActive)}>
              {getCategoryIcon("categories", {
                size: 20,
                weight: rootRouteActive ? "fill" : "regular",
                className: ICON_TONE_CLASS,
              })}
            </span>
            <span className={cn(LABEL_CLASS, "w-full truncate text-center text-foreground")}>
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
          const routeActive = pathname === `/categories/${category.slug}`

          if (drawer) {
            return (
              <button
                key={category.slug}
                type="button"
                onClick={() => handleCategoryClick(category)}
                className={cn(ITEM_BASE_CLASS, getItemStateClass(Boolean(isActive)), ITEM_WIDTH_CLASS)}
                aria-pressed={Boolean(isActive)}
                aria-label={label}
              >
                <span className={getIconShellStateClass(Boolean(isActive))}>
                  {getCategoryIcon(category.slug, {
                    size: 20,
                    weight: isActive ? "fill" : "regular",
                    className: ICON_TONE_CLASS,
                  })}
                </span>
                <span className={cn(LABEL_CLASS, "w-full truncate text-center", isActive ? "text-background" : "text-foreground")}>
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
              className={cn(ITEM_BASE_CLASS, getItemStateClass(routeActive), ITEM_WIDTH_CLASS)}
              aria-label={label}
              aria-current={routeActive ? "page" : undefined}
            >
              <span className={getIconShellStateClass(routeActive)}>
                {getCategoryIcon(category.slug, {
                  size: 20,
                  weight: routeActive ? "fill" : "regular",
                  className: ICON_TONE_CLASS,
                })}
              </span>
              <span className={cn(LABEL_CLASS, "w-full truncate text-center text-foreground")}>
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
              ITEM_BASE_CLASS,
              getItemStateClass(false),
              ITEM_WIDTH_CLASS
            )}
            aria-label={tMobile("moreCategories")}
          >
            <span className={getMoreIconShellStateClass(false)}>
              <DotsThree size={22} weight="bold" className="text-foreground" />
            </span>
            <span className={cn(LABEL_CLASS, "w-full truncate text-center text-foreground")}>
              {tMobile("moreCategories")}
            </span>
          </button>
        ) : (
          <Link
            href={rootHref}
            prefetch={true}
            className={cn(ITEM_BASE_CLASS, getItemStateClass(rootRouteActive), ITEM_WIDTH_CLASS)}
            aria-label={tMobile("moreCategories")}
            aria-current={rootRouteActive ? "page" : undefined}
          >
            <span className={getMoreIconShellStateClass(rootRouteActive)}>
              <DotsThree size={22} weight="bold" className="text-foreground" />
            </span>
            <span className={cn(LABEL_CLASS, "w-full truncate text-center text-foreground")}>
              {tMobile("moreCategories")}
            </span>
          </Link>
        )}
      </div>
    </div>
  )
}
