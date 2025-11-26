"use client"

import { Link } from "@/i18n/routing"
import { useSearchParams } from "next/navigation"
import { useTranslations } from "next-intl"
import { ChevronRight, Search, Sparkles, Percent, Truck, Star, Filter } from "lucide-react"
import { cn } from "@/lib/utils"

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
      {/* Target-style Breadcrumb - Full width with underlines */}
      <nav className="w-full border-b border-border py-3 mb-6">
        <ol className="flex items-center gap-1.5 text-sm">
          <li>
            <Link 
              href="/" 
              className="text-foreground hover:underline underline-offset-2"
            >
              Amazong
            </Link>
          </li>
          <li className="flex items-center gap-1.5">
            <ChevronRight className="size-3.5 text-muted-foreground/60" />
            <span className="text-muted-foreground flex items-center gap-1.5">
              <Search className="size-3.5" />
              {query ? t('searchResults') : t('allProducts')}
            </span>
          </li>
        </ol>
      </nav>

      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
          {query ? (
            <>
              {t('resultsFor')} "<span className="text-brand-deal">{query}</span>"
            </>
          ) : (
            t('exploreAllProducts')
          )}
        </h1>
        <p className="text-sm text-muted-foreground">
          {totalResults.toLocaleString()} {t('productsFound')}
        </p>
      </div>

      {/* Quick Filter Chips - Target style */}
      <div className="border-t border-border pt-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          <span className="text-sm font-medium text-foreground flex items-center gap-1.5 shrink-0">
            <Filter className="size-4" />
            {t('quickFilters')}:
          </span>
          
          <Link
            href={buildFilterUrl("prime", "true")}
            className={cn(
              "inline-flex items-center gap-1.5 px-4 py-2 text-sm rounded-full transition-all shrink-0",
              "min-h-10 touch-action-manipulation active:scale-95",
              isActive("prime", "true")
                ? "bg-brand-blue text-white"
                : "bg-card text-foreground border border-border hover:bg-secondary hover:border-ring"
            )}
          >
            <Sparkles className="size-3.5" />
            {t('primeEligible')}
          </Link>
          
          <Link
            href={buildFilterUrl("deals", "true")}
            className={cn(
              "inline-flex items-center gap-1.5 px-4 py-2 text-sm rounded-full transition-all shrink-0",
              "min-h-10 touch-action-manipulation active:scale-95",
              isActive("deals", "true")
                ? "bg-brand-deal text-white"
                : "bg-card text-foreground border border-border hover:bg-secondary hover:border-ring"
            )}
          >
            <Percent className="size-3.5" />
            {t('deals')}
          </Link>
          
          <Link
            href={buildFilterUrl("freeShipping", "true")}
            className={cn(
              "inline-flex items-center gap-1.5 px-4 py-2 text-sm rounded-full transition-all shrink-0",
              "min-h-10 touch-action-manipulation active:scale-95",
              isActive("freeShipping", "true")
                ? "bg-brand-success text-white"
                : "bg-card text-foreground border border-border hover:bg-secondary hover:border-ring"
            )}
          >
            <Truck className="size-3.5" />
            {t('freeShipping')}
          </Link>
          
          <Link
            href={buildFilterUrl("minRating", "4")}
            className={cn(
              "inline-flex items-center gap-1.5 px-4 py-2 text-sm rounded-full transition-all shrink-0",
              "min-h-10 touch-action-manipulation active:scale-95",
              isActive("minRating", "4")
                ? "bg-rating text-foreground"
                : "bg-card text-foreground border border-border hover:bg-secondary hover:border-ring"
            )}
          >
            <Star className="size-3.5 fill-current" />
            {t('fourStarsUp')}
          </Link>

          <Link
            href={buildFilterUrl("newArrivals", "30")}
            className={cn(
              "inline-flex items-center gap-1.5 px-4 py-2 text-sm rounded-full transition-all shrink-0",
              "min-h-10 touch-action-manipulation active:scale-95",
              isActive("newArrivals", "30")
                ? "bg-foreground text-background"
                : "bg-card text-foreground border border-border hover:bg-secondary hover:border-ring"
            )}
          >
            <Sparkles className="size-3.5" />
            {t('newArrivals')}
          </Link>
        </div>
      </div>
    </div>
  )
}
