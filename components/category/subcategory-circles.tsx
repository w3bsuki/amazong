"use client"

import * as React from "react"
import { Link } from "@/i18n/routing"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { useLocale } from "next-intl"
import { getCategoryIcon } from "@/lib/category-icons"
import { normalizeImageUrl, PLACEHOLDER_IMAGE_PATH } from "@/lib/normalize-image-url"
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

// Map category slugs to placeholder images (these would ideally come from the database)
// REMOVED: Hardcoded categoryImages map. We now rely on Supabase image_url.

function getCategoryImage(imageUrl?: string | null): string {
  return imageUrl || "/placeholder.svg"
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
          className="flex gap-2 sm:gap-4 py-1 pb-2 overflow-x-auto sm:flex-wrap sm:overflow-x-visible scrollbar-hide"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {/* "All in Category" circle - first item */}
          {currentCategory && (
            <Link
              href={buildUrl(currentCategory.slug)}
              prefetch={true}
              className={cn(
                "flex flex-col items-center gap-1 min-w-14 sm:min-w-24 md:min-w-28 group shrink-0",
                "touch-action-manipulation"
              )}
            >
              {/* Circle with gradient/icon */}
              <div
                className={cn(
                  "rounded-full flex items-center justify-center overflow-hidden",
                  "size-14 sm:size-24 md:size-28",
                  "bg-primary"
                )}
              >
                <span className="text-white text-2xs sm:text-sm font-medium text-center px-1 leading-tight">
                  {locale === "bg" ? "Всички" : "All"}
                </span>
              </div>

              {/* Label */}
              <span className={cn(
                "text-2xs sm:text-sm font-medium text-center text-primary",
                "max-w-14 sm:max-w-24 md:max-w-28 line-clamp-2 leading-tight"
              )}>
                {locale === "bg" ? "Всички продукти" : "All Products"}
              </span>
            </Link>
          )}

          {/* Subcategory circles */}
          {validSubcategories.map((subcat, index) => {
            const normalizedImageUrl = normalizeImageUrl(subcat.image_url)
            const showImage = Boolean(subcat.image_url) && normalizedImageUrl !== PLACEHOLDER_IMAGE_PATH

            return (
              <Link
                key={subcat.id}
                href={buildUrl(subcat.slug)}
                prefetch={true}
                className={cn(
                  "flex flex-col items-center gap-1.5 min-w-[72px] sm:min-w-24 md:min-w-28 group shrink-0",
                  "touch-action-manipulation",
                  index === validSubcategories.length - 1 && "mr-4"
                )}
              >
                {/* TREIDO STYLE CIRCLE */}
                <CategoryCircleVisual
                  category={subcat}
                  active={false}
                  className="size-[56px] sm:size-24 md:size-28 shrink-0 bg-secondary/30 border border-border/60 shadow-sm group-active:scale-95 transition-transform"
                  fallbackIconSize={24}
                  fallbackIconWeight="light"
                  variant="muted"
                />

                {/* Category Name - Treido: text-[11px] font-medium */}
                <span className={cn(
                  "text-[11px] sm:text-sm font-medium text-center text-foreground px-1 leading-tight",
                  "group-hover:text-primary group-hover:underline",
                  "line-clamp-2",
                  "w-full max-w-[72px] sm:max-w-24 md:max-w-28"
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
