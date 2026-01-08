"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { usePathname, useRouter } from "@/i18n/routing"
import { CaretDown, Star, Truck, Check, X } from "@phosphor-icons/react"
import { cn } from "@/lib/utils"
import { useTranslations } from "next-intl"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { DesktopFilterModal } from "@/components/desktop/desktop-filter-modal"
import type { CategoryAttribute } from "@/lib/data/categories"

interface DesktopFiltersProps {
  attributes?: CategoryAttribute[]
  categorySlug?: string
  categoryId?: string
}

// =============================================================================
// Component: Simplified Desktop Filters
// Now shows only 2 quick pills (Price, Rating) + "All Filters" modal
// =============================================================================

export function DesktopFilters({ attributes = [], categorySlug, categoryId }: DesktopFiltersProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const t = useTranslations('SearchFilters')
  
  const [priceOpen, setPriceOpen] = useState(false)
  const [ratingOpen, setRatingOpen] = useState(false)
  
  const currentMinPrice = searchParams.get("minPrice")
  const currentMaxPrice = searchParams.get("maxPrice")
  const currentRating = searchParams.get("minRating")

  // Build the base path for navigation (preserve current path)
  const basePath = categorySlug ? pathname : '/search'

  const updateParams = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value === null) {
      params.delete(key)
    } else {
      params.set(key, value)
    }
    const queryString = params.toString()
    router.push(`${basePath}${queryString ? `?${queryString}` : ''}`)
  }

  const handlePriceClick = (min: string | null, max: string | null) => {
    const params = new URLSearchParams(searchParams.toString())
    if (min) params.set("minPrice", min)
    else params.delete("minPrice")
    if (max) params.set("maxPrice", max)
    else params.delete("maxPrice")
    const queryString = params.toString()
    router.push(`${basePath}${queryString ? `?${queryString}` : ''}`)
    setPriceOpen(false)
  }

  const priceRanges = [
    { label: t('under25'), min: null, max: "25" },
    { label: t('range2550'), min: "25", max: "50" },
    { label: t('range50100'), min: "50", max: "100" },
    { label: t('range100200'), min: "100", max: "200" },
    { label: t('above200'), min: "200", max: null }
  ]

  const getPriceLabel = () => {
    if (currentMinPrice && currentMaxPrice) return `$${currentMinPrice}-$${currentMaxPrice}`
    if (currentMinPrice) return `$${currentMinPrice}+`
    if (currentMaxPrice) return `Under $${currentMaxPrice}`
    return t('price')
  }

  const getRatingLabel = () => {
    if (currentRating) return `${currentRating}+ Stars`
    return t('customerReviews')
  }

  const hasPriceFilter = currentMinPrice || currentMaxPrice
  const hasRatingFilter = !!currentRating
  
  // Check if we have any attributes to show the filter modal
  const hasAttributes = attributes.length > 0

  const pillBase = "inline-flex items-center gap-2 h-8 px-3.5 rounded-md"
  const pillText = "text-sm font-medium transition-colors border"
  const pillCaret = "transition-transform duration-100"

  return (
    <>
      {/* Price Filter - Quick Pill */}
      <Popover open={priceOpen} onOpenChange={setPriceOpen}>
        <PopoverTrigger asChild>
          <button
            className={cn(
              pillBase,
              pillText,
              hasPriceFilter
                ? "bg-primary/10 text-primary border-primary/20"
                : "bg-secondary hover:bg-secondary/80 text-foreground border-border/50 hover:border-border"
            )}
          >
            <span>{getPriceLabel()}</span>
            <CaretDown size={16} weight="regular" className={cn(pillCaret, priceOpen && "rotate-180")} />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-56 p-2 rounded-md shadow-dropdown border-border/50" align="start">
          {priceRanges.map(({ label, min, max }) => {
            const isActive = currentMinPrice === min && currentMaxPrice === max
            return (
              <button
                key={label}
                onClick={() => handlePriceClick(min, max)}
                className={cn(
                  "w-full text-left px-3 py-2 rounded-md text-sm flex items-center justify-between transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-foreground hover:bg-muted"
                )}
              >
                {label}
                {isActive && <Check className="h-4 w-4" />}
              </button>
            )
          })}
          {hasPriceFilter && (
            <>
              <div className="h-px bg-border my-1" />
              <button
                onClick={() => handlePriceClick(null, null)}
                className="w-full text-left px-3 py-2 rounded-md text-sm text-destructive hover:bg-destructive/10"
              >
                {t('clearPrice')}
              </button>
            </>
          )}
        </PopoverContent>
      </Popover>

      {/* Rating Filter - Quick Pill */}
      <Popover open={ratingOpen} onOpenChange={setRatingOpen}>
        <PopoverTrigger asChild>
          <button
            className={cn(
              pillBase,
              pillText,
              hasRatingFilter
                ? "bg-primary/10 text-primary border-primary/20"
                : "bg-secondary hover:bg-secondary/80 text-foreground border-border/50 hover:border-border"
            )}
          >
            <Star size={16} weight={hasRatingFilter ? "fill" : "regular"} className={hasRatingFilter ? "text-current" : ""} />
            <span>{getRatingLabel()}</span>
            <CaretDown size={16} weight="regular" className={cn(pillCaret, ratingOpen && "rotate-180")} />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-56 p-2 rounded-md shadow-dropdown border-border/50" align="start">
          {[4, 3, 2, 1].map((stars) => {
            const isActive = currentRating === stars.toString()
            return (
              <button
                key={stars}
                onClick={() => {
                  updateParams("minRating", isActive ? null : stars.toString())
                  setRatingOpen(false)
                }}
                className={cn(
                  "w-full flex items-center gap-2 px-3 py-2 rounded-md transition-colors",
                  isActive
                    ? "bg-primary/10"
                    : "hover:bg-muted"
                )}
              >
                <div className="flex text-rating">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      weight={i < stars ? "fill" : "regular"}
                    />
                  ))}
                </div>
                <span className="text-sm text-foreground">{t('andUp')}</span>
                {isActive && <Check size={16} weight="regular" className="ml-auto text-primary" />}
              </button>
            )
          })}
          {hasRatingFilter && (
            <>
              <div className="h-px bg-border my-1" />
              <button
                onClick={() => {
                  updateParams("minRating", null)
                  setRatingOpen(false)
                }}
                className="w-full text-left px-3 py-2 rounded-md text-sm text-destructive hover:bg-destructive/10"
              >
                {t('clearRating')}
              </button>
            </>
          )}
        </PopoverContent>
      </Popover>

      {/* All Filters Modal - Only show if we have category attributes */}
      {hasAttributes && categorySlug && (
        <DesktopFilterModal 
          attributes={attributes}
          categorySlug={categorySlug}
          categoryId={categoryId}
        />
      )}
    </>
  )
}
