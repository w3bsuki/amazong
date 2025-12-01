"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { X, Star, Truck, Package, Percent } from "@phosphor-icons/react"
import { cn } from "@/lib/utils"
import { useTranslations } from "next-intl"

interface FilterChipsProps {
  currentCategory?: { name: string; slug: string } | null
  basePath?: string // e.g., "/categories/electronics" or undefined for "/search"
}

export function FilterChips({ currentCategory: _currentCategory, basePath }: FilterChipsProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const t = useTranslations('SearchFilters')

  const currentMinPrice = searchParams.get("minPrice")
  const currentMaxPrice = searchParams.get("maxPrice")
  const currentRating = searchParams.get("minRating")
  const currentPrime = searchParams.get("prime")
  const currentDeals = searchParams.get("deals")
  const currentAvailability = searchParams.get("availability")
  const currentFreeShipping = searchParams.get("freeShipping")

  const removeParam = (key: string, key2?: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.delete(key)
    if (key2) params.delete(key2)
    const queryString = params.toString()
    if (basePath) {
      router.push(`${basePath}${queryString ? `?${queryString}` : ''}`)
    } else {
      router.push(`/search?${queryString}`)
    }
  }

  const chips: Array<{
    key: string
    key2?: string
    label: string
    icon?: React.ReactNode
    color?: string
  }> = []

  // Prime chip
  if (currentPrime === "true") {
    chips.push({
      key: 'prime',
      label: 'Prime',
      icon: <Truck size={14} weight="regular" />,
      color: 'bg-primary/10 text-primary border-primary/20'
    })
  }

  // Free Shipping chip
  if (currentFreeShipping === "true") {
    chips.push({
      key: 'freeShipping',
      label: t('freeShipping'),
      icon: <Truck size={14} weight="regular" />,
      color: 'bg-shipping-free/10 text-shipping-free border-shipping-free/20'
    })
  }

  // Rating chip
  if (currentRating) {
    chips.push({
      key: 'minRating',
      label: `${currentRating}+ ${t('stars')}`,
      icon: <Star size={14} weight="fill" className="text-rating" />,
      color: 'bg-rating/10 text-rating border-rating/20'
    })
  }

  // Price chip
  if (currentMinPrice || currentMaxPrice) {
    let priceLabel = ''
    if (currentMinPrice && currentMaxPrice) {
      priceLabel = `$${currentMinPrice} - $${currentMaxPrice}`
    } else if (currentMinPrice) {
      priceLabel = `$${currentMinPrice}+`
    } else if (currentMaxPrice) {
      priceLabel = `${t('under')} $${currentMaxPrice}`
    }
    chips.push({
      key: 'minPrice',
      key2: 'maxPrice',
      label: priceLabel,
      color: 'bg-muted text-foreground border-border'
    })
  }

  // Deals chip
  if (currentDeals === "true") {
    chips.push({
      key: 'deals',
      label: t('todaysDeals'),
      icon: <Percent size={14} weight="regular" />,
      color: 'bg-deal/10 text-deal border-deal/20'
    })
  }

  // Availability chip
  if (currentAvailability === "instock") {
    chips.push({
      key: 'availability',
      label: t('inStock'),
      icon: <Package size={14} weight="regular" />,
      color: 'bg-stock-available/10 text-stock-available border-stock-available/20'
    })
  }

  // Don't render if no active filters
  if (chips.length === 0) return null

  return (
    <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 -mx-4 px-4 lg:mx-0 lg:px-0 lg:flex-wrap">
      {/* Active filters label */}
      <span className="text-sm text-muted-foreground shrink-0 py-1.5 hidden sm:flex items-center">
        {t('activeFilters')}:
      </span>
      
      {chips.map((chip) => (
        <button
          key={chip.key}
          onClick={() => removeParam(chip.key, chip.key2)}
          className={cn(
            "inline-flex items-center gap-1.5 h-8 px-3 rounded-full text-sm whitespace-nowrap",
            "border group",
            "hover:bg-destructive/10 hover:border-destructive/20 hover:text-destructive",
            "active:scale-[0.97]",
            chip.color || "bg-primary/10 text-primary border-primary/20"
          )}
        >
          {chip.icon}
          <span className="font-medium">{chip.label}</span>
          <X size={14} weight="regular" className="opacity-60 group-hover:opacity-100 transition-opacity" />
        </button>
      ))}

      {/* Clear All button when multiple filters */}
      {chips.length > 1 && (
        <button
          onClick={() => {
            if (basePath) {
              router.push(basePath)
            } else {
              const params = new URLSearchParams()
              const q = searchParams.get("q")
              const category = searchParams.get("category")
              if (q) params.set("q", q)
              if (category) params.set("category", category)
              router.push(`/search?${params.toString()}`)
            }
          }}
          className={cn(
            "inline-flex items-center gap-1 px-3 h-8 rounded-full text-sm whitespace-nowrap",
            "text-muted-foreground hover:text-destructive font-medium"
          )}
        >
          {t('clearAllFilters')}
        </button>
      )}
    </div>
  )
}
