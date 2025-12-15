"use client"

import { CaretDown, ArrowsDownUp } from "@phosphor-icons/react"
import { useTranslations } from "next-intl"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
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

  return (
    <Select value={currentSort} onValueChange={handleSortChange}>
      <SelectTrigger 
        className={cn(
          "w-auto h-[38px] px-4 rounded-full gap-2",
          "bg-card border border-border",
          "hover:bg-muted hover:border-ring",
          "active:bg-muted",
          "text-sm font-medium text-foreground",
          "focus:ring-2 focus:ring-offset-2 focus:ring-ring focus:border-ring",
          "[&>svg:last-child]:hidden"
        )}
      >
        <ArrowsDownUp size={16} weight="regular" className="text-muted-foreground shrink-0" />
        <span className="whitespace-nowrap"><SelectValue placeholder={t('sortBy')} /></span>
        <CaretDown size={16} weight="regular" className="text-muted-foreground shrink-0" />
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
