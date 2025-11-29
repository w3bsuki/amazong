"use client"

import { CaretDown, ArrowsDownUp } from "@phosphor-icons/react"
import { useTranslations } from "next-intl"
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

  return (
    <Select defaultValue="featured">
      <SelectTrigger 
        className={cn(
          "w-full h-11 px-4 rounded-full",
          "bg-white border border-gray-300",
          "hover:bg-gray-50 hover:border-gray-400",
          "active:bg-gray-100",
          "dark:bg-zinc-800 dark:border-zinc-600 dark:hover:bg-zinc-700 dark:hover:border-zinc-500",
          "text-sm font-medium text-gray-800 dark:text-gray-100",
          "focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue focus:border-brand-blue",
          "[&>svg:last-child]:hidden"
        )}
      >
        <ArrowsDownUp size={16} weight="regular" className="text-gray-600 dark:text-gray-300 shrink-0" />
        <span className="truncate"><SelectValue placeholder={t('sortBy')} /></span>
        <CaretDown size={16} weight="regular" className="text-gray-500 dark:text-gray-400 shrink-0 ml-auto" />
      </SelectTrigger>
      <SelectContent className="rounded-lg border-gray-200 dark:border-zinc-600">
        <SelectItem value="featured" className="rounded-md">{t('featured')}</SelectItem>
        <SelectItem value="price-asc" className="rounded-md">{t('priceLowHigh')}</SelectItem>
        <SelectItem value="price-desc" className="rounded-md">{t('priceHighLow')}</SelectItem>
        <SelectItem value="rating" className="rounded-md">{t('avgReview')}</SelectItem>
        <SelectItem value="newest" className="rounded-md">{t('newestArrivals')}</SelectItem>
      </SelectContent>
    </Select>
  )
}
