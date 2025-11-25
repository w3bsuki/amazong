"use client"

import { Link } from "@/i18n/routing"
import { useSearchParams } from "next/navigation"
import { useTranslations } from "next-intl"
import { Home, Search, Sparkles, Percent, Truck, Star, Filter } from "lucide-react"

interface SearchHeaderProps {
  query?: string
  totalResults: number
}

export function SearchHeader({ query, totalResults }: SearchHeaderProps) {
  const searchParams = useSearchParams()
  const t = useTranslations('SearchFilters')

  // Build URL with filter param
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

  return (
    <div className="mb-6">
      {/* Breadcrumb navigation */}
      <nav className="flex items-center gap-1.5 text-sm text-[#565959] mb-4 py-2 px-3 bg-[#f7f7f7] rounded-lg">
        <Link href="/" className="hover:text-[#c45500] hover:underline flex items-center gap-1">
          <Home className="h-3.5 w-3.5" />
        </Link>
        <span className="text-[#888]">›</span>
        <span className="text-[#0F1111] font-medium flex items-center gap-1.5">
          <Search className="h-3.5 w-3.5" />
          {query ? t('searchResults') : t('allProducts')}
        </span>
      </nav>

      {/* Page Header */}
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-[#0F1111] mb-1">
          {query ? (
            <>
              {t('resultsFor')} "<span className="text-[#c45500]">{query}</span>"
            </>
          ) : (
            t('exploreAllProducts')
          )}
        </h1>
        <p className="text-sm text-[#565959]">
          {totalResults.toLocaleString()} {t('productsFound')}
        </p>
      </div>

      {/* Quick Filter Chips */}
      <div className="flex flex-wrap items-center gap-3 pb-4 border-b border-[#e7e7e7]">
        <span className="text-sm font-medium text-[#0F1111] flex items-center gap-1.5">
          <Filter className="h-4 w-4" />
          {t('quickFilters')}:
        </span>
        
        <Link
          href={buildFilterUrl("prime", "true")}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg border transition-colors ${
            isActive("prime", "true")
              ? "bg-[#007185] text-white border-[#007185]"
              : "bg-white text-[#0F1111] border-[#d5d9d9] hover:bg-[#f7fafa] hover:border-[#007185]"
          }`}
        >
          <Sparkles className="h-3.5 w-3.5" />
          {t('primeEligible')}
        </Link>
        
        <Link
          href={buildFilterUrl("deals", "true")}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg border transition-colors ${
            isActive("deals", "true")
              ? "bg-[#cc0c39] text-white border-[#cc0c39]"
              : "bg-white text-[#0F1111] border-[#d5d9d9] hover:bg-[#f7fafa] hover:border-[#cc0c39]"
          }`}
        >
          <Percent className="h-3.5 w-3.5" />
          {t('deals')}
        </Link>
        
        <Link
          href={buildFilterUrl("freeShipping", "true")}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg border transition-colors ${
            isActive("freeShipping", "true")
              ? "bg-[#067D62] text-white border-[#067D62]"
              : "bg-white text-[#0F1111] border-[#d5d9d9] hover:bg-[#f7fafa] hover:border-[#067D62]"
          }`}
        >
          <Truck className="h-3.5 w-3.5" />
          {t('freeShipping')}
        </Link>
        
        <Link
          href={buildFilterUrl("minRating", "4")}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg border transition-colors ${
            isActive("minRating", "4")
              ? "bg-[#f08804] text-white border-[#f08804]"
              : "bg-white text-[#0F1111] border-[#d5d9d9] hover:bg-[#f7fafa] hover:border-[#f08804]"
          }`}
        >
          <Star className="h-3.5 w-3.5 fill-current" />
          {t('fourStarsUp')}
        </Link>

        <Link
          href={buildFilterUrl("newArrivals", "30")}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg border transition-colors ${
            isActive("newArrivals", "30")
              ? "bg-[#232F3E] text-white border-[#232F3E]"
              : "bg-white text-[#0F1111] border-[#d5d9d9] hover:bg-[#f7fafa] hover:border-[#232F3E]"
          }`}
        >
          <Sparkles className="h-3.5 w-3.5" />
          {t('newArrivals')}
        </Link>
      </div>
    </div>
  )
}
