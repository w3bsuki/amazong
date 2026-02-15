"use client"

import { useSearchParams } from "next/navigation"
import { usePathname, useRouter } from "@/i18n/routing"
import { Star, Sliders, Check, CurrencyDollar } from "@/lib/icons/phosphor"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DesktopFilterModal } from "../../_components/desktop/desktop-filter-modal"
import type { CategoryAttribute } from "@/lib/data/categories"

interface DesktopFiltersProps {
  attributes?: CategoryAttribute[]
  categorySlug?: string
  categoryId?: string
}

// =============================================================================
// Desktop Filters — Clean dropdown menus following shadcn patterns
// Matches SortSelect styling for visual consistency
// =============================================================================

export function DesktopFilters({ attributes = [], categorySlug, categoryId }: DesktopFiltersProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const t = useTranslations('SearchFilters')

  const currentMinPrice = searchParams.get("minPrice")
  const currentMaxPrice = searchParams.get("maxPrice")
  const currentRating = searchParams.get("minRating")

  const basePath = categorySlug ? pathname : '/search'

  const updateParams = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString())
    for (const [key, value] of Object.entries(updates)) {
      if (value === null) params.delete(key)
      else params.set(key, value)
    }
    const queryString = params.toString()
    router.push(`${basePath}${queryString ? `?${queryString}` : ''}`)
  }

  const priceRanges = [
    { label: t('under25'), min: null, max: "25" },
    { label: t('range2550'), min: "25", max: "50" },
    { label: t('range50100'), min: "50", max: "100" },
    { label: t('range100200'), min: "100", max: "200" },
    { label: t('above200'), min: "200", max: null }
  ]

  const getPriceLabel = () => {
    if (currentMinPrice && currentMaxPrice) return `$${currentMinPrice}–$${currentMaxPrice}`
    if (currentMinPrice) return `$${currentMinPrice}+`
    if (currentMaxPrice) return `${t('under')} $${currentMaxPrice}`
    return t('price')
  }

  const getRatingLabel = () => {
    if (currentRating) return `${currentRating}★ ${t('andUp')}`
    return t('customerReviews')
  }

  const hasPriceFilter = currentMinPrice || currentMaxPrice
  const hasRatingFilter = !!currentRating
  const hasAttributes = attributes.length > 0

  // Count all active filters for badge
  const activeFilterCount = (() => {
    let count = 0
    if (hasPriceFilter) count++
    if (hasRatingFilter) count++
    // Count attr_* params
    for (const key of searchParams.keys()) {
      if (key.startsWith('attr_')) count++
    }
    return count
  })()

  // Shared trigger styling (matches SortSelect)
  const triggerClass = cn(
    "h-8 px-3 gap-1.5 rounded-lg",
    "bg-surface-subtle hover:bg-hover border border-border",
    "text-xs font-medium text-foreground",
    "focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-ring",
  )
  const triggerActiveClass = "bg-selected text-primary border-selected-border hover:bg-hover"

  return (
    <div className="flex items-center gap-2">
      {/* Price Filter */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className={cn(triggerClass, hasPriceFilter && triggerActiveClass)}
          >
            <CurrencyDollar size={14} weight="regular" className="shrink-0" />
            <span className="max-w-24 truncate">{getPriceLabel()}</span>
            <ChevronDown className="size-3 opacity-50 shrink-0" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-48">
          <DropdownMenuGroup>
            {priceRanges.map(({ label, min, max }) => {
              const isActive = currentMinPrice === min && currentMaxPrice === max
              return (
                <DropdownMenuItem
                  key={label}
                  onClick={() => updateParams({ minPrice: min, maxPrice: max })}
                  className={cn(isActive && "bg-accent")}
                >
                  <span className="flex-1">{label}</span>
                  {isActive && <Check className="size-4 text-primary" />}
                </DropdownMenuItem>
              )
            })}
          </DropdownMenuGroup>
          {hasPriceFilter && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => updateParams({ minPrice: null, maxPrice: null })}
                variant="destructive"
              >
                {t('clearPrice')}
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Rating Filter */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className={cn(triggerClass, hasRatingFilter && triggerActiveClass)}
          >
            <Star size={14} weight={hasRatingFilter ? "fill" : "regular"} className="shrink-0 text-rating" />
            <span className="max-w-28 truncate">{getRatingLabel()}</span>
            <ChevronDown className="size-3 opacity-50 shrink-0" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-52">
          <DropdownMenuGroup>
            {[4, 3, 2, 1].map((stars) => {
              const isActive = currentRating === stars.toString()
              return (
                <DropdownMenuItem
                  key={stars}
                  onClick={() => updateParams({ minRating: isActive ? null : stars.toString() })}
                  className={cn("gap-2", isActive && "bg-accent")}
                >
                  <span className="flex text-rating">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} weight={i < stars ? "fill" : "regular"} />
                    ))}
                  </span>
                  <span className="text-muted-foreground">{t('andUp')}</span>
                  {isActive && <Check className="size-4 ml-auto text-primary" />}
                </DropdownMenuItem>
              )
            })}
          </DropdownMenuGroup>
          {hasRatingFilter && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => updateParams({ minRating: null })}
                variant="destructive"
              >
                {t('clearRating')}
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* All Filters - Only show when we have category attributes */}
      {hasAttributes && categorySlug && (
        <DesktopFilterModal
          attributes={attributes}
          categorySlug={categorySlug}
          categoryId={categoryId}
          trigger={
            <Button
              variant="ghost"
              size="sm"
              className={cn(triggerClass, activeFilterCount > 0 && triggerActiveClass)}
            >
              <Sliders size={14} weight="regular" className="shrink-0" />
              <span>{t('filters')}</span>
              {activeFilterCount > 0 && (
                <Badge variant="default" className="h-4 min-w-4 px-1 text-2xs rounded-full">
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
          }
        />
      )}
    </div>
  )
}
