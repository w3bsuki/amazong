"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { X, Star, Truck, Package, Percent } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTranslations } from "next-intl"

interface FilterChipsProps {
  currentCategory?: { name: string; slug: string } | null
}

export function FilterChips({ currentCategory }: FilterChipsProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const t = useTranslations('SearchFilters')

  const currentMinPrice = searchParams.get("minPrice")
  const currentMaxPrice = searchParams.get("maxPrice")
  const currentRating = searchParams.get("minRating")
  const currentPrime = searchParams.get("prime")
  const currentDeals = searchParams.get("deals")
  const currentAvailability = searchParams.get("availability")

  const removeParam = (key: string, key2?: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.delete(key)
    if (key2) params.delete(key2)
    router.push(`/search?${params.toString()}`)
  }

  const chips: Array<{
    key: string
    key2?: string
    label: string
    icon?: React.ReactNode
  }> = []

  // Category chip
  if (currentCategory) {
    chips.push({
      key: 'category',
      label: currentCategory.name,
      icon: null
    })
  }

  // Prime chip
  if (currentPrime === "true") {
    chips.push({
      key: 'prime',
      label: 'Prime',
      icon: <Truck className="h-3.5 w-3.5" />
    })
  }

  // Rating chip
  if (currentRating) {
    chips.push({
      key: 'minRating',
      label: `${currentRating}+ ${t('stars')}`,
      icon: <Star className="h-3.5 w-3.5 fill-current text-rating" />
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
      label: priceLabel
    })
  }

  // Deals chip
  if (currentDeals === "true") {
    chips.push({
      key: 'deals',
      label: t('todaysDeals'),
      icon: <Percent className="h-3.5 w-3.5 text-brand-deal" />
    })
  }

  // Availability chip
  if (currentAvailability === "instock") {
    chips.push({
      key: 'availability',
      label: t('inStock'),
      icon: <Package className="h-3.5 w-3.5 text-brand-success" />
    })
  }

  if (chips.length === 0) return null

  return (
    <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 -mx-4 px-4 lg:mx-0 lg:px-0 lg:flex-wrap">
      {chips.map((chip) => (
        <button
          key={chip.key}
          onClick={() => removeParam(chip.key, chip.key2)}
          className={cn(
            "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm whitespace-nowrap",
            "bg-brand-blue/10 text-brand-blue border border-brand-blue/20",
            "hover:bg-brand-blue/20 transition-colors min-h-8",
            "group"
          )}
        >
          {chip.icon}
          <span>{chip.label}</span>
          <X className="h-3.5 w-3.5 opacity-60 group-hover:opacity-100" />
        </button>
      ))}

      {/* Clear All button when multiple chips */}
      {chips.length > 1 && (
        <button
          onClick={() => {
            const params = new URLSearchParams()
            const q = searchParams.get("q")
            if (q) params.set("q", q)
            router.push(`/search?${params.toString()}`)
          }}
          className={cn(
            "inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm whitespace-nowrap",
            "text-muted-foreground hover:text-foreground transition-colors min-h-8"
          )}
        >
          {t('clearAllFilters')}
        </button>
      )}
    </div>
  )
}
