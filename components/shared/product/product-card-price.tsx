"use client"

import * as React from "react"
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
  /** Compact mode for mobile - smaller typography */
  compact?: boolean
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
  compact = false,
}: ProductCardPriceProps) {
  const currencyCtx = useCurrencyOptional()
  const selectedCurrency = currencyCtx?.currency ?? "EUR"

  // Derived values
  const hasDiscount = originalPrice && originalPrice > price

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
    <div className="flex flex-col">
      {/* Price row - clean compact style */}
      <div className="flex items-baseline gap-1 flex-wrap">
        {/* Primary price */}
        <span
          className={cn(
            "font-semibold tracking-tight tabular-nums",
            compact ? "text-[13px]" : "text-base font-bold",
            hasDiscount ? "text-price-sale" : "text-foreground"
          )}
        >
          {formattedPrice}
        </span>
        {/* Original price struck through */}
        {hasDiscount && formattedOriginalPrice && (
          <span className={cn(
            "text-muted-foreground/70 line-through tabular-nums",
            compact ? "text-2xs" : "text-compact"
          )}>
            {formattedOriginalPrice}
          </span>
        )}
        {/* Secondary currency (dual currency mode) */}
        {showDualCurrency && formattedSecondaryPrice && (
          <span className="text-2xs text-muted-foreground tabular-nums">
            ({formattedSecondaryPrice})
          </span>
        )}
      </div>

      {/* Condition / Protection badges - separate row for clarity (desktop only in compact mode) */}
      {(conditionLabel || (showBuyerProtection && buyerProtectionLabel)) && (
        <div className={cn("flex items-center gap-1.5", compact && "hidden lg:flex")}>
          {conditionLabel && (
            <span className="text-2xs font-medium text-muted-foreground">
              {conditionLabel}
            </span>
          )}
          {showBuyerProtection && buyerProtectionLabel && (
            <span className="inline-flex items-center gap-0.5 text-2xs text-verified">
              <svg className="size-2.5 shrink-0" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
                <path d="M208,40H48A16,16,0,0,0,32,56v58.77c0,89.61,75.82,119.34,91,124.39a15.53,15.53,0,0,0,10,0c15.2-5.05,91-34.78,91-124.39V56A16,16,0,0,0,208,40Zm-34.34,69.66-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35a8,8,0,0,1,11.32,11.32Z"/>
              </svg>
              <span className="font-medium">{buyerProtectionLabel}</span>
            </span>
          )}
        </div>
      )}
    </div>
  )
}

// =============================================================================
// EXPORTS
// =============================================================================

export { ProductCardPrice, type ProductCardPriceProps }
