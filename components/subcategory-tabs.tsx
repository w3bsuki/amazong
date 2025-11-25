"use client"

import { Link } from "@/i18n/routing"
import { useSearchParams } from "next/navigation"
import { useLocale, useTranslations } from "next-intl"
import { ChevronRight, Home } from "lucide-react"

interface Category {
  id: string
  name: string
  name_bg: string | null
  slug: string
  parent_id: string | null
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

  if (!currentCategory) return null

  return (
    <div className="mb-6">
      {/* Breadcrumb navigation */}
      <nav className="flex items-center gap-1.5 text-sm text-[#565959] mb-4 py-2 px-3 bg-[#f7f7f7]">
        <Link href="/" className="hover:text-[#c45500] hover:underline flex items-center gap-1">
          <Home className="h-3.5 w-3.5" />
        </Link>
        <ChevronRight className="h-3 w-3 text-[#888]" />
        <Link href="/search" className="hover:text-[#c45500] hover:underline">
          {t('allDepartments')}
        </Link>
        {parentCategory && (
          <>
            <ChevronRight className="h-3 w-3 text-[#888]" />
            <Link 
              href={buildUrl(parentCategory.slug)} 
              className="hover:text-[#c45500] hover:underline"
            >
              {getCategoryName(parentCategory)}
            </Link>
          </>
        )}
        <ChevronRight className="h-3 w-3 text-[#888]" />
        <span className="text-[#0F1111] font-medium">{getCategoryName(currentCategory)}</span>
      </nav>

      {/* Category Header */}
      <h1 className="text-2xl font-bold text-[#0F1111] mb-4">
        {getCategoryName(currentCategory)}
      </h1>

      {/* Subcategory Chips/Tabs */}
      {subcategories.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-bold text-[#0F1111]">{t('shopBySubcategory')}</h2>
          <div className="flex flex-wrap gap-2">
            {/* All items in this category button */}
            <Link
              href={buildUrl(currentCategory.slug)}
              className="inline-flex items-center px-4 py-2 text-sm font-medium rounded border-2 border-[#007185] bg-[#007185] text-white hover:bg-[#005f73] transition-colors"
            >
              {t('allIn')} {getCategoryName(currentCategory)}
            </Link>
            
            {/* Subcategory buttons */}
            {subcategories.map((subcat) => (
              <Link
                key={subcat.id}
                href={buildUrl(subcat.slug)}
                className="inline-flex items-center px-4 py-2 text-sm font-medium rounded border border-[#d5d9d9] bg-white text-[#0F1111] hover:bg-[#f7fafa] hover:border-[#007185] transition-colors"
              >
                {getCategoryName(subcat)}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Quick filter bar */}
      <div className="mt-4 pt-4 border-t border-[#e7e7e7]">
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <span className="font-medium text-[#0F1111]">{t('quickFilters')}:</span>
          <button className="px-3 py-1.5 rounded border border-[#d5d9d9] bg-white hover:bg-[#f7fafa] text-[#0F1111]">
            {t('primeEligible')}
          </button>
          <button className="px-3 py-1.5 rounded border border-[#d5d9d9] bg-white hover:bg-[#f7fafa] text-[#0F1111]">
            {t('deals')}
          </button>
          <button className="px-3 py-1.5 rounded border border-[#d5d9d9] bg-white hover:bg-[#f7fafa] text-[#0F1111]">
            {t('freeShipping')}
          </button>
          <button className="px-3 py-1.5 rounded border border-[#d5d9d9] bg-white hover:bg-[#f7fafa] text-[#0F1111]">
            {t('fourStarsUp')}
          </button>
        </div>
      </div>
    </div>
  )
}
