"use client"

import { useMemo, useCallback } from "react"
import { useSearchParams, type ReadonlyURLSearchParams } from "next/navigation"
import { useRouter } from "@/i18n/routing"
import { X, Star, Truck, Package, Percent, Tag } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTranslations } from "next-intl"

// =============================================================================
// ACTIVE FILTER CHIPS — Removable pills showing applied filters
//
// Design system compliance (.codex/project/DESIGN.md):
// - Consistent chip height (h-touch-sm = 36px)
// - rounded-full for pill shape (per token reference)
// - Semantic tokens (bg-secondary, text-muted-foreground)
// - lucide-react icons (repo standard)
// - Hover state shows X more prominently
// =============================================================================

interface FilterChipsProps {
  /** Current category context (shown as removable chip) */
  currentCategory?: { name: string; slug: string } | null
  /** Base path for URL updates (e.g., "/categories/electronics") */
  basePath?: string
  /** External search params (for instant-apply flows without URL navigation) */
  appliedSearchParams?: URLSearchParams | ReadonlyURLSearchParams
  /** Callback when filters are removed (for instant-apply mode) */
  onRemoveFilter?: (key: string, key2?: string) => void
  /** Callback to clear all filters (for instant-apply mode) */
  onClearAll?: () => void
  /** Additional CSS classes */
  className?: string
}

export function FilterChips({
  currentCategory,
  basePath,
  appliedSearchParams,
  onRemoveFilter,
  onClearAll,
  className,
}: FilterChipsProps) {
  const router = useRouter()
  const searchParamsFromRouter = useSearchParams()
  const searchParams = appliedSearchParams ?? searchParamsFromRouter
  const t = useTranslations("SearchFilters")

  // Determine if we're in "instant" mode (external params + callbacks)
  const isInstantMode = Boolean(appliedSearchParams && onRemoveFilter)

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

  const removeParam = useCallback(
    (key: string, key2?: string) => {
      // Instant mode: delegate to callback
      if (isInstantMode && onRemoveFilter) {
        onRemoveFilter(key, key2)
        return
      }

      // Handle Category Chip Removal
      if (key === "category") {
        if (basePath) {
          router.push("/categories")
        } else {
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
      params.delete("page")
      const queryString = params.toString()
      if (basePath) {
        router.push(`${basePath}${queryString ? `?${queryString}` : ""}`)
      } else {
        router.push(`/search?${queryString}`)
      }
    },
    [isInstantMode, onRemoveFilter, basePath, router, searchParams]
  )

  const chips: Array<{
    key: string
    key2?: string
    label: string
    icon?: React.ReactNode
    color?: string
  }> = []

  // Current Category Chip
  if (currentCategory) {
    chips.push({
      key: "category",
      label: currentCategory.name,
      icon: <Tag className="size-3.5" />,
    })
  }

  // Free Shipping chip
  if (currentFreeShipping === "true") {
    chips.push({
      key: "freeShipping",
      label: t("freeShipping"),
      icon: <Truck className="size-3.5" />,
    })
  }

  // Rating chip
  if (currentRating) {
    chips.push({
      key: "minRating",
      label: `${currentRating}+ ${t("stars")}`,
      icon: <Star className="size-3.5 fill-current" />,
    })
  }

  // Price chip
  if (currentMinPrice || currentMaxPrice) {
    let priceLabel = ""
    if (currentMinPrice && currentMaxPrice) {
      priceLabel = `€${currentMinPrice} – €${currentMaxPrice}`
    } else if (currentMinPrice) {
      priceLabel = `€${currentMinPrice}+`
    } else if (currentMaxPrice) {
      priceLabel = `${t("under")} €${currentMaxPrice}`
    }
    chips.push({
      key: "minPrice",
      key2: "maxPrice",
      label: priceLabel,
    })
  }

  // Deals chip
  if (currentDeals === "true") {
    chips.push({
      key: "deals",
      label: t("todaysDeals"),
      icon: <Percent className="size-3.5" />,
    })
  }

  // Availability chip
  if (currentAvailability === "instock") {
    chips.push({
      key: "availability",
      label: t("inStock"),
      icon: <Package className="size-3.5" />,
    })
  }

  // Attribute filter chips (attr_*)
  for (const { name, values } of attributeFilters) {
    const displayName = name.charAt(0).toUpperCase() + name.slice(1)
    const label =
      values.length === 1
        ? `${displayName}: ${values[0]}`
        : `${displayName}: ${values.length}`

    chips.push({
      key: `attr_${name}`,
      label,
      icon: <Tag className="size-3.5" />,
    })
  }

  const handleClearAll = useCallback(() => {
    if (isInstantMode && onClearAll) {
      onClearAll()
      return
    }
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
  }, [isInstantMode, onClearAll, basePath, router, searchParams])

  // Don't render if no active filters
  if (chips.length === 0) return null

  return (
    <div
      className={cn(
        "flex items-center gap-1.5 overflow-x-auto no-scrollbar",
        "-mx-4 px-4 lg:mx-0 lg:px-0 lg:flex-wrap",
        className
      )}
      role="list"
      aria-label={t("activeFilters")}
    >
      {chips.map((chip) => (
        <button
          key={chip.key}
          type="button"
          onClick={() => removeParam(chip.key, chip.key2)}
          className={cn(
            // Layout
            "inline-flex items-center gap-1 h-touch-sm pl-2.5 pr-1.5 shrink-0",
            // Shape (pill per .codex/project/DESIGN.md)
            "rounded-full",
            // Colors (neutral, inverted on hover)
            "bg-secondary text-foreground",
            "hover:bg-destructive hover:text-destructive-foreground",
            // Typography
            "text-xs font-medium whitespace-nowrap",
            // Interaction
            "transition-colors duration-150",
            "tap-transparent",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
            "group"
          )}
          role="listitem"
          aria-label={`${t("removeFilter")}: ${chip.label}`}
        >
          {chip.icon && <span aria-hidden="true">{chip.icon}</span>}
          <span>{chip.label}</span>
          <span
            className={cn(
              "size-4 rounded-full inline-flex items-center justify-center",
              "bg-muted group-hover:bg-destructive-subtle",
              "transition-colors"
            )}
            aria-hidden="true"
          >
            <X className="size-3" />
          </span>
        </button>
      ))}

      {/* Clear All button when multiple filters */}
      {chips.length > 1 && (
        <button
          type="button"
          onClick={handleClearAll}
          className={cn(
            "inline-flex items-center gap-1 h-touch-sm px-2.5 shrink-0",
            "rounded-full",
            "text-xs font-medium whitespace-nowrap",
            "text-muted-foreground hover:text-destructive",
            "transition-colors duration-150",
            "tap-transparent",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
          )}
        >
          <X className="size-3.5" aria-hidden="true" />
          <span>{t("clearAllFilters")}</span>
        </button>
      )}
    </div>
  )
}
