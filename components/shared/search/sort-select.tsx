"use client"

import { CaretDown, ArrowsDownUp } from "@phosphor-icons/react"
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
    router.push(queryString ? `${pathname}?${queryString}` : pathname)
  }, [router, pathname, searchParams])

  const isSorted = currentSort !== 'featured'

  return (
    <Select value={currentSort} onValueChange={handleSortChange}>
      <SelectTrigger 
        size="sm"
        className={cn(
          "!h-8 !py-0 px-3 rounded-full gap-1",
          "bg-secondary hover:bg-secondary/80 hover:text-foreground border border-border/50",
          "active:bg-secondary/80",
          isSorted && "bg-primary/10 text-primary border-primary/20",
          "text-sm text-foreground",
          "focus:ring-2 focus:ring-offset-1 focus:ring-ring",
          "[&_svg[data-slot=select-icon]]:size-3"
        )}
        aria-label={t('sortBy')}
      >
        <ArrowsDownUp size={14} weight="regular" className={cn(
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
