"use client"

import * as React from "react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useCurrencyOptional, EUR_TO_BGN_RATE } from "@/components/providers/currency-context"

// =============================================================================
// TYPES
// =============================================================================

interface ProductCardPriceProps {
  price: number
  originalPrice?: number | null | undefined
  locale: string
  conditionLabel?: string | null | undefined
  showBuyerProtection?: boolean
  buyerProtectionLabel?: string
  /** Show secondary currency inline (e.g., "€12.34 / 24,13 лв.") */
  showDualCurrency?: boolean
}

// =============================================================================
// COMPONENT
// =============================================================================

function ProductCardPrice({
  price,
  originalPrice,
  locale,
  conditionLabel,
  showBuyerProtection = false,
  buyerProtectionLabel,
  showDualCurrency = false,
}: ProductCardPriceProps) {
  const currencyCtx = useCurrencyOptional()
  const selectedCurrency = currencyCtx?.currency ?? "EUR"

  // Derived values
  const hasDiscount = originalPrice && originalPrice > price
  const discountPercent = hasDiscount
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0

  // Convert price based on selected currency
  const displayPrice = selectedCurrency === "BGN" ? price * EUR_TO_BGN_RATE : price
  const displayOriginalPrice = originalPrice && selectedCurrency === "BGN" 
    ? originalPrice * EUR_TO_BGN_RATE 
    : originalPrice

  // Price formatting (memoized for performance)
  const formattedPrice = React.useMemo(() => {
    return new Intl.NumberFormat(locale === "bg" ? "bg-BG" : "en-IE", {
      style: "currency",
      currency: selectedCurrency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(displayPrice)
  }, [displayPrice, locale, selectedCurrency])

  const formattedOriginalPrice = React.useMemo(() => {
    if (!displayOriginalPrice) return null
    return new Intl.NumberFormat(locale === "bg" ? "bg-BG" : "en-IE", {
      style: "currency",
      currency: selectedCurrency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(displayOriginalPrice)
  }, [displayOriginalPrice, locale, selectedCurrency])

  // Secondary currency (opposite of selected)
  const secondaryCurrency = selectedCurrency === "EUR" ? "BGN" : "EUR"
  const secondaryPrice = selectedCurrency === "EUR" ? price * EUR_TO_BGN_RATE : price
  const formattedSecondaryPrice = React.useMemo(() => {
    if (!showDualCurrency) return null
    return new Intl.NumberFormat(locale === "bg" ? "bg-BG" : "en-IE", {
      style: "currency",
      currency: secondaryCurrency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(secondaryPrice)
  }, [showDualCurrency, secondaryPrice, locale, secondaryCurrency])

  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex min-w-0 items-baseline gap-1 flex-wrap">
        {/* Primary price in selected currency */}
        <span
          className={cn(
            "text-reading font-bold tracking-tight tabular-nums",
            hasDiscount ? "text-foreground" : "text-foreground"
          )}
        >
          {formattedPrice}
        </span>
        {/* Secondary currency display (muted, smaller) */}
        {showDualCurrency && formattedSecondaryPrice && (
          <span className="text-2xs text-muted-foreground tabular-nums">
            / {formattedSecondaryPrice}
          </span>
        )}
        {hasDiscount && formattedOriginalPrice && (
          <span className="text-tiny text-muted-foreground line-through">
            {formattedOriginalPrice}
          </span>
        )}
        {hasDiscount && discountPercent >= 5 && (
          <span className="text-2xs font-semibold text-background bg-deal px-1 py-px rounded-sm">
            -{discountPercent}%
          </span>
        )}
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        {showBuyerProtection && buyerProtectionLabel && (
          <span className="inline-flex items-center gap-0.5 text-2xs text-trust">
            <svg className="size-2.5 shrink-0" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
              <path d="M208,40H48A16,16,0,0,0,32,56v58.77c0,89.61,75.82,119.34,91,124.39a15.53,15.53,0,0,0,10,0c15.2-5.05,91-34.78,91-124.39V56A16,16,0,0,0,208,40Zm-34.34,69.66-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35a8,8,0,0,1,11.32,11.32Z"/>
            </svg>
            <span className="font-medium">{buyerProtectionLabel}</span>
          </span>
        )}
        {conditionLabel && (
          <span className="text-2xs font-medium text-muted-foreground border border-border px-1 py-px rounded-sm">
            {conditionLabel}
          </span>
        )}
      </div>
    </div>
  )
}

// =============================================================================
// EXPORTS
// =============================================================================

export { ProductCardPrice, type ProductCardPriceProps }
