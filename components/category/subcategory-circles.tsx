"use client"

import * as React from "react"
import { Link } from "@/i18n/routing"
import { cn } from "@/lib/utils"
import { useLocale, useTranslations } from "next-intl"
import { CategoryCircleVisual } from "@/components/shared/category/category-circle-visual"

interface Category {
  id: string
  name: string
  name_bg: string | null
  slug: string
  parent_id: string | null
  image_url?: string | null
  /** Subtree product count from category_stats (optional, DEC-002) */
  subtree_product_count?: number
}

interface SubcategoryCirclesProps {
  subcategories: Category[]
  currentCategory?: Category | null
  title?: string
  className?: string
  basePath?: string // "/categories" or undefined for "/search?category="
  /** Pre-serialized search params string (without leading '?') to preserve during navigation */
  searchParamsString?: string
  /** Variant: desktop = larger circles for desktop layout */
  variant?: "default" | "desktop"
  /** Slug of the currently active subcategory (for desktop highlighting) */
  activeSubcategorySlug?: string | null | undefined
  /** Show product counts under category names (DEC-002 curated browse UX) */
  showCounts?: boolean
}

export function SubcategoryCircles({
  subcategories,
  currentCategory,
  title,
  className,
  basePath,
  searchParamsString = "",
  variant = "default",
  activeSubcategorySlug = null,
  showCounts = false
}: SubcategoryCirclesProps) {
  const locale = useLocale()
  const tCommon = useTranslations("Common")
  const tSearch = useTranslations("SearchFilters")

  const getCategoryName = (cat: Category) => {
    if (locale === 'bg' && cat.name_bg) {
      return cat.name_bg
    }
    return cat.name
  }

  // Filter out deprecated/moved categories
  const isValidCategory = (cat: Category) => {
    const name = cat.name.toLowerCase()
    return !name.includes('[deprecated]') &&
      !name.includes('[moved]') &&
      !name.includes('[duplicate]')
  }

  const validSubcategories = subcategories.filter(isValidCategory)

  // Build URL - supports both /categories/slug and /search?category=slug
  const buildUrl = (categorySlug: string) => {
    if (basePath) {
      const params = new URLSearchParams(searchParamsString)
      params.delete("category")
      const queryString = params.toString()
      return `${basePath}/${categorySlug}${queryString ? `?${queryString}` : ''}`
    }
    const params = new URLSearchParams(searchParamsString)
    params.set("category", categorySlug)
    return `/search?${params.toString()}`
  }

  if (validSubcategories.length === 0) return null

  const isDesktop = variant === "desktop"

  return (
    <div className={cn("relative w-full overflow-x-hidden", className)}>
      {/* Title removed as requested */}

      {/* Container with circles - horizontal scroll on mobile, wrap on larger screens */}
      <div className="relative">
        <div
          className={cn(
            "flex gap-1.5 py-1 pb-2 pr-4 overflow-x-auto scrollbar-hide",
            isDesktop ? "gap-2.5 flex-wrap overflow-x-visible" : "sm:flex-wrap sm:overflow-x-visible"
          )}
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {/* "All in Category" circle - first item */}
          {currentCategory && (
            <Link
              href={buildUrl(currentCategory.slug)}
              prefetch={true}
              className={cn(
                "flex flex-col items-center gap-1 group shrink-0 touch-action-manipulation",
                isDesktop
                  ? "min-w-(--spacing-category-item-desktop) gap-2"
                  : "min-w-(--spacing-category-item-lg)"
              )}
            >
              {/* Treido muted "All" circle - active when no subcategory selected (desktop only) */}
              <div className={cn(
                "rounded-full flex items-center justify-center overflow-hidden",
                "transition-all group-active:opacity-90",
                isDesktop && !activeSubcategorySlug
                  ? "bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2"
                  : "bg-secondary/30 border border-border/60",
                isDesktop
                  ? "size-(--spacing-category-circle-desktop)"
                  : "size-(--spacing-category-circle) shrink-0"
              )}>
                <span className={cn(
                  "font-medium text-center px-1 leading-tight",
                  isDesktop && !activeSubcategorySlug ? "text-primary-foreground" : "text-foreground",
                  isDesktop ? "text-sm" : "text-tiny"
                )}>
                  {tCommon("all")}
                </span>
              </div>

              {/* Label */}
              <span className={cn(
                "font-medium text-center text-foreground px-1 leading-tight line-clamp-2",
                isDesktop
                  ? "text-sm max-w-(--spacing-category-item-desktop)"
                  : "text-tiny max-w-(--spacing-category-item-lg)"
              )}>
                {tSearch("allProducts")}
              </span>
            </Link>
          )}

          {/* Subcategory circles */}
          {validSubcategories.map((subcat) => {
            const isActive = isDesktop && activeSubcategorySlug === subcat.slug
            return (
              <Link
                key={subcat.id}
                href={buildUrl(subcat.slug)}
                prefetch={true}
                className={cn(
                  "flex flex-col items-center group shrink-0 touch-action-manipulation",
                  isDesktop
                    ? "min-w-(--spacing-category-item-desktop) gap-2"
                    : "min-w-(--spacing-category-item-lg) gap-1.5"
                )}
              >
                {/* TREIDO STYLE CIRCLE - with active state for desktop */}
                <CategoryCircleVisual
                  category={subcat}
                  active={isActive}
                  className={cn(
                    "shrink-0 group-active:opacity-90 transition-all",
                    isActive
                      ? "ring-2 ring-primary ring-offset-2 border-primary"
                      : "bg-secondary/30 border border-border/60",
                    isDesktop
                      ? "size-(--spacing-category-circle-desktop)"
                      : "size-(--spacing-category-circle)"
                  )}
                  fallbackIconSize={isDesktop ? 28 : 24}
                  fallbackIconWeight="light"
                  variant={isActive ? "colorful" : "muted"}
                />

                {/* Category Name + Count (hide zero counts per DEC-002) */}
                <span className={cn(
                  "font-medium text-center text-foreground px-1 leading-tight line-clamp-2 w-full",
                  isDesktop
                    ? "text-sm max-w-(--spacing-category-item-desktop)"
                    : "text-tiny max-w-(--spacing-category-item-lg)"
                )}>
                  {getCategoryName(subcat)}
                  {showCounts && typeof subcat.subtree_product_count === 'number' && subcat.subtree_product_count > 0 && (
                    <span className="block text-muted-foreground font-normal text-xs">
                      ({subcat.subtree_product_count})
                    </span>
                  )}
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
