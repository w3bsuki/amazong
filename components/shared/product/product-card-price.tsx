"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { useCurrencyOptional, EUR_TO_BGN_RATE } from "@/components/providers/currency-context"
import { Badge } from "@/components/ui/badge"

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
  /** Slightly stronger hierarchy for home feed cards */
  homeEmphasis?: boolean
  /** Price hierarchy preset */
  priceEmphasis?: "default" | "strong"
  /** Controls compare-at strike-through rendering */
  showOriginalPrice?: boolean
  /** Optional compact trailing label in the main price row (e.g. "-25%") */
  trailingLabel?: string
  /** Render trailing label as discount badge */
  discountAsBadge?: boolean
  /** Visual presentation style for the price row */
  presentation?: "default" | "soft-strip"
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
  homeEmphasis = false,
  priceEmphasis = "default",
  showOriginalPrice = true,
  trailingLabel,
  discountAsBadge = false,
  presentation = "default",
}: ProductCardPriceProps) {
  const currencyCtx = useCurrencyOptional()
  const selectedCurrency = currencyCtx?.currency ?? "EUR"

  // Derived values
  const hasDiscount = Boolean(showOriginalPrice && originalPrice && originalPrice > price)

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

  const priceRow = (
    <div className={cn("flex items-baseline gap-1", homeEmphasis ? "flex-nowrap" : "flex-wrap")}>
      {/* Primary price */}
      <span
        className={cn(
          "tabular-nums whitespace-nowrap tracking-tight text-foreground",
          compact && priceEmphasis !== "strong" ? "text-sm" : "text-price",
          priceEmphasis === "strong" ? "font-bold" : "font-semibold"
        )}
      >
        {formattedPrice}
      </span>
      {/* Original price struck through */}
      {hasDiscount && formattedOriginalPrice && (
        <span className={cn(
          "line-through tabular-nums text-muted-foreground",
          compact && !homeEmphasis ? "text-2xs" : "text-compact"
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
      {trailingLabel && (
        discountAsBadge ? (
          <Badge variant="discount" size="compact" className="shrink-0">
            {trailingLabel}
          </Badge>
        ) : (
          <span className="shrink-0 whitespace-nowrap text-compact font-semibold text-destructive">
            {trailingLabel}
          </span>
        )
      )}
    </div>
  )

  return (
    <div className={cn("flex flex-col", presentation === "soft-strip" && "gap-0.5")}>
      {/* Price row - clean compact style */}
      {presentation === "soft-strip" ? (
        <div className="flex w-full max-w-full items-baseline rounded-lg bg-muted px-2 py-1">
          {priceRow}
        </div>
      ) : (
        priceRow
      )}

      {/* Condition / Protection badges - separate row for clarity (desktop only in compact mode) */}
      {(conditionLabel || (showBuyerProtection && buyerProtectionLabel)) && (
        <div className={cn("flex items-center gap-1", compact && "hidden lg:flex")}>
          {conditionLabel && (
            <span className="text-2xs font-medium text-muted-foreground">
              {conditionLabel}
            </span>
          )}
          {showBuyerProtection && buyerProtectionLabel && (
            <span className="inline-flex items-center gap-0.5 text-2xs text-muted-foreground">
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
