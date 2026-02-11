"use client"

import * as React from "react"
import { Link, usePathname } from "@/i18n/routing"
import type { CategoryTreeNode } from "@/lib/category-tree"
import { getCategoryName, getCategorySlugKey } from "@/lib/category-display"
import { useTranslations } from "next-intl"
import { cn } from "@/lib/utils"
import { getCategoryIcon } from "@/components/shared/category/category-icons"
import { useCategoryDrawerOptional } from "@/components/mobile/category-nav"
import { getHomeChipClass, getHomeChipCountClass, getHomeChipIconClass } from "./home-chip-styles"

interface HomeStickyCategoryPillsProps {
  visible: boolean
  categories: CategoryTreeNode[]
  locale: string
  categoryCounts?: Record<string, number>
  className?: string
}

interface StickyPillProps {
  label: string
  countLabel: string | undefined
  active: boolean
  tabIndex: number
  ariaLabel?: string
  icon?: React.ReactNode
  dataTestId?: string
  onClick?: () => void
  href?: string
}

function formatCompactCount(value: number, locale: string): string {
  const normalized = Math.max(0, Math.trunc(value))
  if (normalized < 1000) return normalized.toLocaleString(locale)
  return new Intl.NumberFormat(locale, {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(normalized)
}

function StickyPill({
  label,
  countLabel,
  active,
  tabIndex,
  ariaLabel,
  icon,
  dataTestId,
  onClick,
  href,
}: StickyPillProps) {
  const baseClass = getHomeChipClass({
    active,
    size: "compact",
    className: "gap-1",
  })

  const content = (
    <>
      {icon ? (
        <span className={cn("shrink-0", getHomeChipIconClass(active))}>
          {icon}
        </span>
      ) : null}
      <span>{label}</span>
      {countLabel ? (
        <span
          className={getHomeChipCountClass({ active })}
          aria-hidden="true"
        >
          {countLabel}
        </span>
      ) : null}
    </>
  )

  if (href) {
    return (
      <Link
        href={href}
        prefetch={true}
        tabIndex={tabIndex}
        className={baseClass}
        aria-label={ariaLabel}
        {...(dataTestId ? { "data-testid": dataTestId } : {})}
      >
        {content}
      </Link>
    )
  }

  return (
    <button
      type="button"
      tabIndex={tabIndex}
      onClick={onClick}
      aria-pressed={active}
      aria-label={ariaLabel}
      className={baseClass}
      {...(dataTestId ? { "data-testid": dataTestId } : {})}
    >
      {content}
    </button>
  )
}

/**
 * Compact sticky category pills for homepage.
 * Appears only after the larger category circles scroll out of view.
 */
export function HomeStickyCategoryPills({
  visible,
  categories,
  locale,
  categoryCounts = {},
  className,
}: HomeStickyCategoryPillsProps) {
  const tCategories = useTranslations("Categories")
  const tDrawer = useTranslations("CategoryDrawer")
  const tMobile = useTranslations("Home.mobile")
  const pathname = usePathname()
  const drawer = useCategoryDrawerOptional()

  if (categories.length === 0) return null

  const interactiveTabIndex = visible ? 0 : -1
  const pathWithoutLocale = pathname.replace(/^\/(en|bg)/, "") || "/"
  const categoriesPathPrefix = "/categories"
  const isDrawerRootActive = Boolean(drawer?.isOpen && drawer.path.length === 0)
  const isCategoriesIndexActive = isDrawerRootActive || pathWithoutLocale === categoriesPathPrefix
  const activeCategorySlug = pathWithoutLocale.startsWith(`${categoriesPathPrefix}/`)
    ? pathWithoutLocale.replace(`${categoriesPathPrefix}/`, "").split("/")[0] ?? null
    : null

  const hasCounts = Object.keys(categoryCounts).length > 0
  const totalListingsCount = categories.reduce((sum, category) => {
    return sum + Math.max(0, categoryCounts[category.slug] ?? 0)
  }, 0)

  const rootAriaLabel = hasCounts
    ? `${tDrawer("title")} · ${tCategories("categoryCount", { count: categories.length })} · ${tMobile("listingsCount", { count: totalListingsCount })}`
    : `${tDrawer("title")} · ${tCategories("categoryCount", { count: categories.length })}`

  return (
    <div
      data-testid="home-sticky-category-pills"
      className={cn(
        "fixed inset-x-0 z-30 border-b border-border-subtle bg-surface-elevated md:hidden",
        visible ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
        className
      )}
      style={{ top: "var(--app-header-offset)" }}
      aria-hidden={!visible}
    >
      <div className="overflow-x-auto no-scrollbar px-(--spacing-home-inset) py-1">
        <div className="flex items-center gap-1 pr-1">
          {drawer ? (
            <StickyPill
              label={tDrawer("title")}
              countLabel={categories.length.toLocaleString(locale)}
              active={isCategoriesIndexActive}
              tabIndex={interactiveTabIndex}
              onClick={drawer.openRoot}
              ariaLabel={rootAriaLabel}
              icon={getCategoryIcon("categories", { size: 14, weight: "regular" })}
              {...(!isCategoriesIndexActive ? { dataTestId: "home-sticky-pill-inactive" } : {})}
            />
          ) : (
            <StickyPill
              label={tDrawer("title")}
              countLabel={categories.length.toLocaleString(locale)}
              active={isCategoriesIndexActive}
              tabIndex={interactiveTabIndex}
              href="/categories"
              ariaLabel={rootAriaLabel}
              icon={getCategoryIcon("categories", { size: 14, weight: "regular" })}
              {...(!isCategoriesIndexActive ? { dataTestId: "home-sticky-pill-inactive" } : {})}
            />
          )}

          {categories.map((category) => {
            const label = tCategories("shortName", {
              slug: getCategorySlugKey(category.slug),
              name: getCategoryName(category, locale),
            })
            const isCategoryActive =
              activeCategorySlug === category.slug ||
              Boolean(drawer?.path[0]?.slug === category.slug)

            const categoryCount = categoryCounts[category.slug] ?? 0
            const countLabel = hasCounts ? formatCompactCount(categoryCount, locale) : undefined
            const categoryAriaLabel = hasCounts
              ? `${label} · ${tMobile("listingsCount", { count: categoryCount })}`
              : label

            if (drawer) {
              return (
                <StickyPill
                  key={category.id}
                  label={label}
                  countLabel={countLabel}
                  active={isCategoryActive}
                  tabIndex={interactiveTabIndex}
                  onClick={() => drawer.openCategory(category)}
                  ariaLabel={categoryAriaLabel}
                />
              )
            }

            return (
              <StickyPill
                key={category.id}
                label={label}
                countLabel={countLabel}
                active={isCategoryActive}
                tabIndex={interactiveTabIndex}
                href={`/categories/${category.slug}`}
                ariaLabel={categoryAriaLabel}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}
