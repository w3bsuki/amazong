"use client"

import { ArrowUpDown as ArrowsDownUp, ChevronDown } from "lucide-react"

import { useTranslations } from "next-intl"
import { useSearchParams } from "next/navigation"
import { usePathname, useRouter } from "@/i18n/routing"
import { useCallback } from "react"
import { cn } from "@/lib/utils"

export function SortSelect() {
  const t = useTranslations('SearchFilters')
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const normalizedPathname = (() => {
    const segments = pathname.split('/').filter(Boolean)
    const maybeLocale = segments[0]
    if (maybeLocale && /^[a-z]{2}(-[A-Z]{2})?$/i.test(maybeLocale)) {
      segments.shift()
    }
    return `/${segments.join('/')}` || '/'
  })()
  
  // "featured" is kept as a legacy alias for "relevance".
  const rawSort = searchParams.get('sort')
  const currentSort = (() => {
    const normalized = !rawSort || rawSort === 'featured' ? 'relevance' : rawSort
    return ['relevance', 'price-asc', 'price-desc', 'rating', 'newest'].includes(normalized)
      ? normalized
      : 'relevance'
  })()
  
  // Handle sort change
  const handleSortChange = useCallback((value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    
    if (value === 'relevance') {
      params.delete('sort')
    } else {
      params.set('sort', value)
    }
    
    const queryString = params.toString()
    router.replace(queryString ? `${normalizedPathname}?${queryString}` : normalizedPathname)
  }, [router, normalizedPathname, searchParams])

  const isSorted = currentSort !== 'relevance'

  return (
    <div className="relative w-full">
      <label className="sr-only" htmlFor="sort">
        {t("sortBy")}
      </label>

      <div
        className={cn(
          "flex h-(--control-default) w-full items-center gap-2 rounded-lg border px-3 text-xs font-medium",
          "bg-surface-subtle hover:bg-hover hover:text-foreground border-border-subtle",
          "active:bg-active",
          isSorted && "bg-selected text-primary border-selected-border",
          "focus-within:ring-2 focus-within:ring-offset-1 focus-within:ring-ring",
        )}
      >
        <ArrowsDownUp
          size={14}
          className={cn(isSorted ? "text-primary" : "text-muted-foreground", "shrink-0")}
          aria-hidden="true"
        />

        <select
          id="sort"
          value={currentSort}
          onChange={(event) => handleSortChange(event.target.value)}
          className="h-full flex-1 bg-transparent text-foreground outline-none appearance-none pr-5"
          aria-label={t("sortBy")}
        >
          <option value="relevance">{t("relevance")}</option>
          <option value="price-asc">{t("priceLowHigh")}</option>
          <option value="price-desc">{t("priceHighLow")}</option>
          <option value="rating">{t("avgReview")}</option>
          <option value="newest">{t("newestArrivals")}</option>
        </select>

        <ChevronDown
          className="pointer-events-none absolute right-3 size-3 text-muted-foreground"
          aria-hidden="true"
        />
      </div>
    </div>
  )
}
