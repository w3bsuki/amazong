"use client"

import { Link } from "@/i18n/routing"
import { useSearchParams } from "next/navigation"
import { useLocale, useTranslations } from "next-intl"
import { SubcategoryCircles } from "@/components/subcategory-circles"
import { AppBreadcrumb, type BreadcrumbItemData } from "@/components/app-breadcrumb"
import { cn } from "@/lib/utils"

interface Category {
  id: string
  name: string
  name_bg: string | null
  slug: string
  parent_id: string | null
  image_url?: string | null
}

interface SubcategoryTabsProps {
  currentCategory: Category | null
  subcategories: Category[]
  parentCategory?: Category | null
}

export function SubcategoryTabs({ currentCategory, subcategories, parentCategory }: SubcategoryTabsProps) {
  const locale = useLocale()
  const searchParams = useSearchParams()
  const t = useTranslations('SearchFilters')

  const getCategoryName = (cat: Category) => {
    if (locale === 'bg' && cat.name_bg) {
      return cat.name_bg
    }
    return cat.name
  }

  // Build URL with existing params
  const buildUrl = (categorySlug: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("category", categorySlug)
    return `/search?${params.toString()}`
  }

  const buildFilterUrl = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (params.get(key) === value) {
      params.delete(key)
    } else {
      params.set(key, value)
    }
    return `/search?${params.toString()}`
  }

  const isActive = (key: string, value: string) => {
    return searchParams.get(key) === value
  }

  if (!currentCategory) return null

  // Build breadcrumb items dynamically
  const breadcrumbItems: BreadcrumbItemData[] = [
    { label: t('allDepartments'), href: "/search" },
    ...(parentCategory ? [{ label: getCategoryName(parentCategory), href: buildUrl(parentCategory.slug) }] : []),
    { label: getCategoryName(currentCategory) } // No href = current page
  ]

  return (
    <div className="mb-6">
      {/* Unified Breadcrumb */}
      <AppBreadcrumb items={breadcrumbItems} className="mb-6" />

      {/* Category Header - Target style */}
      <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-6">
        {getCategoryName(currentCategory)}
      </h1>

      {/* Subcategory Circles - Target style (only show if there are subcategories) */}
      {subcategories.length > 0 && (
        <div className="mb-6">
          <SubcategoryCircles
            subcategories={subcategories}
            currentCategory={currentCategory}
          />
        </div>
      )}

      {/* Quick Filters - Improved styling with pill buttons */}
      <div className="border-t border-border pt-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar scroll-smooth">
          <span className="font-medium text-foreground text-sm shrink-0">{t('quickFilters')}:</span>
          
          <Link
            href={buildFilterUrl("prime", "true")}
            className={cn(
              "min-h-10 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all shrink-0",
              "touch-action-manipulation active:scale-95",
              isActive("prime", "true")
                ? "bg-primary text-primary-foreground"
                : "border border-border bg-card hover:bg-secondary hover:border-ring text-foreground"
            )}
          >
            {t('primeEligible')}
          </Link>
          
          <Link
            href={buildFilterUrl("deals", "true")}
            className={cn(
              "min-h-10 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all shrink-0",
              "touch-action-manipulation active:scale-95",
              isActive("deals", "true")
                ? "bg-brand-deal text-white"
                : "border border-border bg-card hover:bg-secondary hover:border-ring text-foreground"
            )}
          >
            {t('deals')}
          </Link>
          
          <Link
            href={buildFilterUrl("freeShipping", "true")}
            className={cn(
              "min-h-10 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all shrink-0",
              "touch-action-manipulation active:scale-95",
              isActive("freeShipping", "true")
                ? "bg-brand-success text-white"
                : "border border-border bg-card hover:bg-secondary hover:border-ring text-foreground"
            )}
          >
            {t('freeShipping')}
          </Link>
          
          <Link
            href={buildFilterUrl("minRating", "4")}
            className={cn(
              "min-h-10 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all shrink-0",
              "touch-action-manipulation active:scale-95",
              isActive("minRating", "4")
                ? "bg-rating text-foreground"
                : "border border-border bg-card hover:bg-secondary hover:border-ring text-foreground"
            )}
          >
            {t('fourStarsUp')}
          </Link>
        </div>
      </div>
    </div>
  )
}
