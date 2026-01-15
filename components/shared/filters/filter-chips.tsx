"use client"

import { useMemo } from "react"
import { useSearchParams } from "next/navigation"
import { useRouter } from "@/i18n/routing"
import { X, Star, Truck, Package, Percent, Tag } from "@phosphor-icons/react"
import { cn } from "@/lib/utils"
import { useTranslations } from "next-intl"

interface FilterChipsProps {
  currentCategory?: { name: string; slug: string } | null
  basePath?: string // e.g., "/categories/electronics" or undefined for "/search"
  className?: string
}

export function FilterChips({ currentCategory: _currentCategory, basePath, className }: FilterChipsProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const t = useTranslations('SearchFilters')

  const currentMinPrice = searchParams.get("minPrice")
  const currentMaxPrice = searchParams.get("maxPrice")
  const currentRating = searchParams.get("minRating")
  const currentDeals = searchParams.get("deals")
  const currentAvailability = searchParams.get("availability")
  const currentFreeShipping = searchParams.get("freeShipping")

  // Collect all attr_* params for attribute filter chips
  const attributeFilters = useMemo(() => {
    const attrs: Array<{ name: string; values: string[] }> = []
    for (const key of searchParams.keys()) {
      if (key.startsWith("attr_")) {
        const attrName = key.replace("attr_", "")
        const values = searchParams.getAll(key)
        if (values.length > 0) {
          attrs.push({ name: attrName, values })
        }
      }
    }
    return attrs
  }, [searchParams])

  const removeParam = (key: string, key2?: string) => {
    // Handle Category Chip Removal
    if (key === 'category') {
      if (basePath) {
        // If we differ from basepath, go up? 
        // Actually, if we are removing the "current category", we likely want to go to the PARENT or Root.
        // Simple heuristic: Go to "/categories" or "/" if we are "removing" the category context.
        router.push('/categories')
      } else {
        // Search mode: remove category param
        const params = new URLSearchParams(searchParams.toString())
        params.delete("category")
        params.delete("page")
        router.push(`/search?${params.toString()}`)
      }
      return
    }

    const params = new URLSearchParams(searchParams.toString())
    params.delete(key)
    if (key2) params.delete(key2)
    // Reset pagination when filters change
    params.delete("page")
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

  // Current Category Chip
  if (_currentCategory) {
    chips.push({
      key: 'category',
      label: _currentCategory.name,
      icon: <Tag size={14} weight="regular" />, // Using Tag icon for category
      color: 'bg-primary/5 text-primary border-primary/20'
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
      color: 'bg-secondary text-foreground border-border'
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

  // Attribute filter chips (attr_*)
  for (const { name, values } of attributeFilters) {
    // Format the attribute name for display (capitalize first letter)
    const displayName = name.charAt(0).toUpperCase() + name.slice(1)
    const label = values.length === 1
      ? `${displayName}: ${values[0]}`
      : `${displayName}: ${values.length} selected`

    chips.push({
      key: `attr_${name}`,
      label,
      icon: <Tag size={14} weight="regular" />,
      color: 'bg-primary/10 text-primary border-primary/20'
    })
  }

  // Don't render if no active filters
  if (chips.length === 0) return null

  return (
    <div className={cn("flex gap-2 overflow-x-auto no-scrollbar pb-1 -mx-4 px-4 lg:mx-0 lg:px-0 lg:flex-wrap", className)}>
      {/* Active filters label */}
      <span className="text-sm text-muted-foreground shrink-0 py-1.5 hidden sm:flex items-center">
        {t('activeFilters')}:
      </span>

      {chips.map((chip) => (
        <button
          key={chip.key}
          onClick={() => removeParam(chip.key, chip.key2)}
          className={cn(
            "inline-flex items-center gap-1.5 h-8 px-3 rounded-md text-sm whitespace-nowrap",
            "border group",
            "hover:bg-destructive/10 hover:border-destructive/20 hover:text-destructive",
            chip.color || "bg-secondary text-foreground border-border hover:bg-secondary/80"
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
            "inline-flex items-center gap-1 px-3 h-8 rounded-md text-sm whitespace-nowrap",
            "text-muted-foreground hover:text-destructive font-medium"
          )}
        >
          {t('clearAllFilters')}
        </button>
      )}
    </div>
  )
}
