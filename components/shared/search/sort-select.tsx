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
        className={cn(
          "w-full lg:w-auto h-touch-sm px-4 rounded-full gap-2",
          "border border-input bg-background",
          "hover:bg-accent hover:text-accent-foreground",
          "active:bg-accent/80",
          isSorted && "border-primary bg-primary/5",
          "text-sm font-medium text-foreground",
          "focus:ring-2 focus:ring-offset-1 focus:ring-ring focus:border-input",
          "[&>svg:last-child]:hidden"
        )}
        aria-label={t('sortBy')}
      >
        <ArrowsDownUp size={16} weight="regular" className={cn(
          isSorted ? "text-primary" : "text-muted-foreground",
          "shrink-0"
        )} aria-hidden="true" />
        <span className="whitespace-nowrap"><SelectValue placeholder={t('sortBy')} /></span>
        <CaretDown size={16} weight="regular" className="text-muted-foreground shrink-0" aria-hidden="true" />
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
