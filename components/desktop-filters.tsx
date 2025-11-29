"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { CaretDown, Star, Truck, Check, X } from "@phosphor-icons/react"
import { cn } from "@/lib/utils"
import { useTranslations } from "next-intl"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export function DesktopFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const t = useTranslations('SearchFilters')
  
  const [priceOpen, setPriceOpen] = useState(false)
  const [ratingOpen, setRatingOpen] = useState(false)
  
  const currentMinPrice = searchParams.get("minPrice")
  const currentMaxPrice = searchParams.get("maxPrice")
  const currentRating = searchParams.get("minRating")
  const currentPrime = searchParams.get("prime")

  const updateParams = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value === null) {
      params.delete(key)
    } else {
      params.set(key, value)
    }
    router.push(`/search?${params.toString()}`)
  }

  const handlePriceClick = (min: string | null, max: string | null) => {
    const params = new URLSearchParams(searchParams.toString())
    if (min) params.set("minPrice", min)
    else params.delete("minPrice")
    if (max) params.set("maxPrice", max)
    else params.delete("maxPrice")
    router.push(`/search?${params.toString()}`)
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

  return (
    <>
      {/* Prime Filter */}
      <button
        onClick={() => updateParams("prime", currentPrime === "true" ? null : "true")}
        className={cn(
          "inline-flex items-center gap-2 h-[38px] px-4 rounded-full",
          "border",
          "text-sm font-medium",
          "hover:bg-gray-50 hover:border-gray-400",
          "dark:hover:bg-zinc-700 dark:hover:border-zinc-500",
          currentPrime === "true"
            ? "bg-brand-blue/10 border-brand-blue text-brand-blue dark:bg-brand-blue/20"
            : "bg-white border-gray-300 text-gray-800 dark:bg-zinc-800 dark:border-zinc-600 dark:text-gray-100"
        )}
      >
        <Truck size={16} weight="regular" />
        <span>Prime</span>
        {currentPrime === "true" && (
          <X size={14} weight="regular" className="ml-0.5 hover:text-red-500" onClick={(e) => {
            e.stopPropagation()
            updateParams("prime", null)
          }} />
        )}
      </button>

      {/* Price Filter */}
      <Popover open={priceOpen} onOpenChange={setPriceOpen}>
        <PopoverTrigger asChild>
          <button
            className={cn(
              "inline-flex items-center gap-2 h-[38px] px-4 rounded-full",
              "border",
              "text-sm font-medium",
              "hover:bg-gray-50 hover:border-gray-400",
              "dark:hover:bg-zinc-700 dark:hover:border-zinc-500",
              hasPriceFilter
                ? "bg-brand-blue/10 border-brand-blue text-brand-blue dark:bg-brand-blue/20"
                : "bg-white border-gray-300 text-gray-800 dark:bg-zinc-800 dark:border-zinc-600 dark:text-gray-100"
            )}
          >
            <span>{getPriceLabel()}</span>
            <CaretDown size={16} weight="regular" className={cn("transition-transform", priceOpen && "rotate-180")} />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-48 p-1 rounded-lg" align="start">
          {priceRanges.map(({ label, min, max }) => {
            const isActive = currentMinPrice === min && currentMaxPrice === max
            return (
              <button
                key={label}
                onClick={() => handlePriceClick(min, max)}
                className={cn(
                  "w-full text-left px-3 py-2 rounded-md text-sm flex items-center justify-between transition-colors",
                  isActive
                    ? "bg-brand-blue/10 text-brand-blue font-medium"
                    : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-800"
                )}
              >
                {label}
                {isActive && <Check className="h-4 w-4" />}
              </button>
            )
          })}
          {hasPriceFilter && (
            <>
              <div className="h-px bg-gray-200 dark:bg-zinc-700 my-1" />
              <button
                onClick={() => handlePriceClick(null, null)}
                className="w-full text-left px-3 py-2 rounded-md text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
              >
                {t('clearPrice')}
              </button>
            </>
          )}
        </PopoverContent>
      </Popover>

      {/* Rating Filter */}
      <Popover open={ratingOpen} onOpenChange={setRatingOpen}>
        <PopoverTrigger asChild>
          <button
            className={cn(
              "inline-flex items-center gap-2 h-[38px] px-4 rounded-full",
              "border",
              "text-sm font-medium",
              "hover:bg-gray-50 hover:border-gray-400",
              "dark:hover:bg-zinc-700 dark:hover:border-zinc-500",
              hasRatingFilter
                ? "bg-brand-blue/10 border-brand-blue text-brand-blue dark:bg-brand-blue/20"
                : "bg-white border-gray-300 text-gray-800 dark:bg-zinc-800 dark:border-zinc-600 dark:text-gray-100"
            )}
          >
            <Star size={16} weight={hasRatingFilter ? "fill" : "regular"} className={hasRatingFilter ? "text-current" : ""} />
            <span>{getRatingLabel()}</span>
            <CaretDown size={16} weight="regular" className={cn("transition-transform", ratingOpen && "rotate-180")} />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-52 p-1 rounded-lg" align="start">
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
                    ? "bg-brand-blue/10"
                    : "hover:bg-gray-100 dark:hover:bg-zinc-800"
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
                <span className="text-sm text-gray-700 dark:text-gray-200">{t('andUp')}</span>
                {isActive && <Check size={16} weight="regular" className="ml-auto text-brand-blue" />}
              </button>
            )
          })}
          {hasRatingFilter && (
            <>
              <div className="h-px bg-gray-200 dark:bg-zinc-700 my-1" />
              <button
                onClick={() => {
                  updateParams("minRating", null)
                  setRatingOpen(false)
                }}
                className="w-full text-left px-3 py-2 rounded-md text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
              >
                Clear rating
              </button>
            </>
          )}
        </PopoverContent>
      </Popover>
    </>
  )
}
