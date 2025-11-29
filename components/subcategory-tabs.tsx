"use client"

import { useSearchParams } from "next/navigation"
import { useLocale, useTranslations } from "next-intl"
import { SubcategoryCircles } from "@/components/subcategory-circles"
import { AppBreadcrumb, type BreadcrumbItemData } from "@/components/app-breadcrumb"

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
  basePath?: string // "/categories" or undefined for "/search?category="
}

export function SubcategoryTabs({ currentCategory, subcategories, parentCategory, basePath }: SubcategoryTabsProps) {
  const locale = useLocale()
  const searchParams = useSearchParams()
  const t = useTranslations('SearchFilters')

  const getCategoryName = (cat: Category) => {
    if (locale === 'bg' && cat.name_bg) {
      return cat.name_bg
    }
    return cat.name
  }

  // Build URL - supports both /categories/slug and /search?category=slug
  const buildUrl = (categorySlug: string) => {
    if (basePath) {
      // Clean category routes: /categories/electronics
      const params = new URLSearchParams(searchParams.toString())
      params.delete("category") // Remove category from query params
      const queryString = params.toString()
      return `${basePath}/${categorySlug}${queryString ? `?${queryString}` : ''}`
    }
    // Legacy search routes: /search?category=electronics
    const params = new URLSearchParams(searchParams.toString())
    params.set("category", categorySlug)
    return `/search?${params.toString()}`
  }

  if (!currentCategory) return null

  // Build breadcrumb items dynamically
  const allDeptHref = basePath ? "/categories" : "/search"
  const breadcrumbItems: BreadcrumbItemData[] = [
    { label: t('allDepartments'), href: allDeptHref },
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
        <SubcategoryCircles
          subcategories={subcategories}
          currentCategory={currentCategory}
          basePath={basePath}
        />
      )}
    </div>
  )
}
