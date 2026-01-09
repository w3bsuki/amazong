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
}

interface SubcategoryCirclesProps {
  subcategories: Category[]
  currentCategory?: Category | null
  title?: string
  className?: string
  basePath?: string // "/categories" or undefined for "/search?category="
  /** Pre-serialized search params string (without leading '?') to preserve during navigation */
  searchParamsString?: string
}

export function SubcategoryCircles({
  subcategories,
  currentCategory,
  title,
  className,
  basePath,
  searchParamsString = ""
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

  return (
    <div className={cn("relative w-full overflow-x-hidden", className)}>
      {/* Title removed as requested */}

      {/* Container with circles - horizontal scroll on mobile, wrap on larger screens */}
      <div className="relative">
        <div
          className="flex gap-2 py-1 pb-2 pr-4 overflow-x-auto sm:flex-wrap sm:overflow-x-visible scrollbar-hide"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {/* "All in Category" circle - first item */}
          {currentCategory && (
            <Link
              href={buildUrl(currentCategory.slug)}
              prefetch={true}
              className={cn(
                "flex flex-col items-center gap-1 min-w-[72px] group shrink-0",
                "touch-action-manipulation"
              )}
            >
              {/* Treido muted "All" circle */}
              <div className={cn(
                "rounded-full flex items-center justify-center overflow-hidden",
                "size-[56px] shrink-0",
                "bg-secondary/30 border border-border/60",
                "transition-opacity group-active:opacity-90"
              )}>
                <span className="text-[11px] font-medium text-foreground text-center px-1 leading-tight">
                  {tCommon("all")}
                </span>
              </div>

              {/* Label */}
              <span className={cn(
                "text-[11px] font-medium text-center text-foreground px-1 leading-tight",
                "max-w-[72px] line-clamp-2"
              )}>
                {tSearch("allProducts")}
              </span>
            </Link>
          )}

          {/* Subcategory circles */}
          {validSubcategories.map((subcat) => {
            return (
              <Link
                key={subcat.id}
                href={buildUrl(subcat.slug)}
                prefetch={true}
                className={cn(
                  "flex flex-col items-center gap-1.5 min-w-[72px] group shrink-0",
                  "touch-action-manipulation"
                )}
              >
                {/* TREIDO STYLE CIRCLE */}
                <CategoryCircleVisual
                  category={subcat}
                  active={false}
                  className="size-[56px] shrink-0 bg-secondary/30 border border-border/60 group-active:opacity-90 transition-opacity"
                  fallbackIconSize={24}
                  fallbackIconWeight="light"
                  variant="muted"
                />

                {/* Category Name - Treido: text-[11px] font-medium */}
                <span className={cn(
                  "text-[11px] font-medium text-center text-foreground px-1 leading-tight",
                  "line-clamp-2",
                  "w-full max-w-[72px]"
                )}>
                  {getCategoryName(subcat)}
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
