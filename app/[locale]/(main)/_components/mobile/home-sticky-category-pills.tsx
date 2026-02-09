"use client"

import * as React from "react"
import { Link, usePathname } from "@/i18n/routing"
import type { CategoryTreeNode } from "@/lib/category-tree"
import { getCategoryName, getCategorySlugKey } from "@/lib/category-display"
import { useTranslations } from "next-intl"
import { cn } from "@/lib/utils"
import { getCategoryIcon } from "@/components/shared/category/category-icons"
import { useCategoryDrawerOptional } from "@/components/mobile/category-nav"

interface HomeStickyCategoryPillsProps {
  visible: boolean
  categories: CategoryTreeNode[]
  locale: string
  className?: string
}

/**
 * Compact sticky category pills for homepage.
 * Appears only after the larger category circles scroll out of view.
 */
export function HomeStickyCategoryPills({
  visible,
  categories,
  locale,
  className,
}: HomeStickyCategoryPillsProps) {
  const tCategories = useTranslations("Categories")
  const tDrawer = useTranslations("CategoryDrawer")
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
  const pillBase =
    "inline-flex min-h-(--spacing-touch-md) shrink-0 items-center gap-1.5 rounded-full border px-3.5 whitespace-nowrap"
  const pillText = "text-xs font-medium leading-none"
  const pillActive = "border-foreground bg-foreground text-background"
  const pillIdle = "border-border-subtle bg-surface-subtle text-foreground hover:border-hover-border hover:bg-hover"
  const pillInteractive =
    "tap-transparent transition-colors active:bg-active focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"

  return (
    <div
      data-testid="home-sticky-category-pills"
      className={cn(
        "fixed inset-x-0 z-30 border-b border-border-subtle bg-background transition-all duration-200 md:hidden",
        visible ? "pointer-events-auto translate-y-0 opacity-100" : "pointer-events-none -translate-y-1 opacity-0",
        className
      )}
      style={{ top: "var(--app-header-offset)" }}
      aria-hidden={!visible}
    >
      <div className="overflow-x-auto no-scrollbar px-(--spacing-home-inset) py-1.5">
        <div className="flex items-center gap-1.5">
          {drawer ? (
            <button
              type="button"
              tabIndex={interactiveTabIndex}
              onClick={drawer.openRoot}
              aria-pressed={isCategoriesIndexActive}
              className={cn(
                pillBase,
                pillText,
                isCategoriesIndexActive ? pillActive : pillIdle,
                pillInteractive
              )}
              {...(!isCategoriesIndexActive ? { "data-testid": "home-sticky-pill-inactive" } : {})}
            >
              {getCategoryIcon("categories", { size: 14, weight: "regular" })}
              <span>{tDrawer("title")}</span>
            </button>
          ) : (
            <Link
              href="/categories"
              prefetch={true}
              tabIndex={interactiveTabIndex}
              className={cn(
                pillBase,
                pillText,
                isCategoriesIndexActive ? pillActive : pillIdle,
                pillInteractive
              )}
              {...(!isCategoriesIndexActive ? { "data-testid": "home-sticky-pill-inactive" } : {})}
            >
              {getCategoryIcon("categories", { size: 14, weight: "regular" })}
              <span>{tDrawer("title")}</span>
            </Link>
          )}

          {categories.map((category) => {
            const label = tCategories("shortName", {
              slug: getCategorySlugKey(category.slug),
              name: getCategoryName(category, locale),
            })
            const isCategoryActive =
              activeCategorySlug === category.slug ||
              Boolean(drawer?.path[0]?.slug === category.slug)

            if (drawer) {
              return (
                <button
                  key={category.id}
                  type="button"
                  tabIndex={interactiveTabIndex}
                  onClick={() => drawer.openCategory(category)}
                  aria-pressed={isCategoryActive}
                  className={cn(
                    pillBase,
                    pillText,
                    isCategoryActive ? pillActive : pillIdle,
                    pillInteractive
                  )}
                >
                  {getCategoryIcon(category.slug, { size: 14, weight: "regular" })}
                  <span>{label}</span>
                </button>
              )
            }

            return (
              <Link
                key={category.id}
                href={`/categories/${category.slug}`}
                prefetch={true}
                tabIndex={interactiveTabIndex}
                className={cn(
                  pillBase,
                  pillText,
                  isCategoryActive ? pillActive : pillIdle,
                  pillInteractive
                )}
              >
                {getCategoryIcon(category.slug, { size: 14, weight: "regular" })}
                <span>{label}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
