"use client"

import { ArrowUpDown as ArrowsDownUp } from "lucide-react";

import { useTranslations } from "next-intl"
import { useSearchParams } from "next/navigation"
import { usePathname, useRouter } from "@/i18n/routing"
import { useCallback } from "react"
import { cn } from "@/lib/utils"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

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
  
  // Get current sort from URL, default to "featured"
  const currentSort = searchParams.get('sort') || 'featured'
  
  // Handle sort change
  const handleSortChange = useCallback((value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    
    if (value === 'featured') {
      params.delete('sort')
    } else {
      params.set('sort', value)
    }
    
    const queryString = params.toString()
    router.replace(queryString ? `${normalizedPathname}?${queryString}` : normalizedPathname)
  }, [router, normalizedPathname, searchParams])

  const isSorted = currentSort !== 'featured'

  return (
    <Select value={currentSort} onValueChange={handleSortChange}>
      <SelectTrigger 
        size="default"
        className={cn(
          "px-3 w-full rounded-lg gap-2",
          "bg-surface-subtle hover:bg-hover hover:text-foreground border border-border-subtle",
          "active:bg-active",
          isSorted && "bg-selected text-primary border-selected-border",
          "text-xs font-medium text-foreground",
          "focus:ring-2 focus:ring-offset-1 focus:ring-ring",
          "[&_svg[data-slot=select-icon]]:size-3"
        )}
        aria-label={t('sortBy')}
      >
        <ArrowsDownUp size={14} className={cn(
          isSorted ? "text-primary" : "text-muted-foreground",
          "shrink-0"
        )} aria-hidden="true" />
        <SelectValue placeholder={t('sortBy')} />
      </SelectTrigger>
      <SelectContent className="rounded-lg border-border">
        <SelectItem value="featured" className="rounded-md">{t('featured')}</SelectItem>
        <SelectItem value="price-asc" className="rounded-md">{t('priceLowHigh')}</SelectItem>
        <SelectItem value="price-desc" className="rounded-md">{t('priceHighLow')}</SelectItem>
        <SelectItem value="rating" className="rounded-md">{t('avgReview')}</SelectItem>
        <SelectItem value="newest" className="rounded-md">{t('newestArrivals')}</SelectItem>
      </SelectContent>
    </Select>
  )
}
