"use client"

import * as React from "react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

// =============================================================================
// TYPES
// =============================================================================

interface ProductCardPriceProps {
  price: number
  originalPrice?: number | null | undefined
  locale: string
  conditionLabel?: string | null | undefined
}

// =============================================================================
// COMPONENT
// =============================================================================

function ProductCardPrice({
  price,
  originalPrice,
  locale,
  conditionLabel,
}: ProductCardPriceProps) {
  // Derived values
  const hasDiscount = originalPrice && originalPrice > price
  const discountPercent = hasDiscount
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0

  // Price formatting (memoized for performance)
  const formattedPrice = React.useMemo(() => {
    return new Intl.NumberFormat(locale === "bg" ? "bg-BG" : "en-IE", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(price)
  }, [price, locale])

  const formattedOriginalPrice = React.useMemo(() => {
    if (!originalPrice) return null
    return new Intl.NumberFormat(locale === "bg" ? "bg-BG" : "en-IE", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(originalPrice)
  }, [originalPrice, locale])

  return (
    <div className="mt-0.5 flex items-center justify-between gap-2">
      <div className="flex min-w-0 items-baseline gap-1">
        <span
          className={cn(
            "text-price font-semibold leading-tight tabular-nums",
            hasDiscount ? "text-price-sale" : "text-price-regular"
          )}
        >
          {formattedPrice}
        </span>
        {hasDiscount && formattedOriginalPrice && (
          <span className="text-xs text-price-original line-through">
            {formattedOriginalPrice}
          </span>
        )}
        {hasDiscount && discountPercent >= 5 && (
          <Badge variant="sale" className="text-2xs">
            -{discountPercent}%
          </Badge>
        )}
      </div>

      {conditionLabel && (
        <Badge variant="condition-outline" className="text-2xs">
          {conditionLabel}
        </Badge>
      )}
    </div>
  )
}

// =============================================================================
// EXPORTS
// =============================================================================

export { ProductCardPrice, type ProductCardPriceProps }
