import * as React from "react"
import { cn } from "@/lib/utils"
import { MarketplaceBadge } from "@/components/shared/marketplace-badge"

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
  presentation?: "default" | "soft-strip" | "price-badge"
  /** Force EUR symbol prefix for compact card readability (e.g., €67) */
  forceSymbolPrefix?: boolean
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
  compact = false,
  homeEmphasis = false,
  priceEmphasis = "default",
  showOriginalPrice = true,
  trailingLabel,
  discountAsBadge = false,
  presentation = "default",
  forceSymbolPrefix = false,
}: ProductCardPriceProps) {
  // Derived values
  const hasDiscount = Boolean(showOriginalPrice && originalPrice && originalPrice > price)

  const formatCurrencyValue = React.useCallback((value: number) => {
    const formatter = new Intl.NumberFormat(locale === "bg" ? "bg-BG" : "en-IE", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    })

    if (!forceSymbolPrefix) {
      return formatter.format(value)
    }

    const parts = formatter.formatToParts(value)
    const currencySymbol = parts.find((part) => part.type === "currency")?.value ?? "€"
    const numericPart = parts
      .filter((part) => part.type !== "currency" && part.type !== "literal")
      .map((part) => part.value)
      .join("")

    return `${currencySymbol}${numericPart}`
  }, [forceSymbolPrefix, locale])

  // Price formatting (memoized for performance)
  const formattedPrice = React.useMemo(() => formatCurrencyValue(price), [formatCurrencyValue, price])

  const formattedOriginalPrice = React.useMemo(() => {
    if (!originalPrice) return null
    return formatCurrencyValue(originalPrice)
  }, [formatCurrencyValue, originalPrice])

  const compareAndTrailing = (
    <>
      {/* Original price struck through */}
      {hasDiscount && formattedOriginalPrice && (
        <span
          className={cn(
            "line-through tabular-nums text-muted-foreground",
            compact && !homeEmphasis ? "text-2xs" : "text-compact"
          )}
        >
          {formattedOriginalPrice}
        </span>
      )}
      {trailingLabel && (
        discountAsBadge ? (
          <MarketplaceBadge variant="discount" size="compact" className="shrink-0">
            {trailingLabel}
          </MarketplaceBadge>
        ) : (
          <span className="shrink-0 whitespace-nowrap text-compact font-semibold text-destructive">
            {trailingLabel}
          </span>
        )
      )}
    </>
  )

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
      {compareAndTrailing}
    </div>
  )

  const badgePriceRow = (
    <div className={cn("flex items-center gap-1", homeEmphasis ? "flex-nowrap" : "flex-wrap")}>
      <MarketplaceBadge
        variant="price"
        size={compact ? "default" : "prominent"}
        className={compact ? "min-h-5 px-2 text-sm leading-none" : undefined}
      >
        {formattedPrice}
      </MarketplaceBadge>
      {compareAndTrailing}
    </div>
  )

  return (
    <div className={cn("flex flex-col", presentation === "soft-strip" && "gap-0.5")}>
      {/* Price row - clean compact style */}
      {presentation === "soft-strip" ? (
        <div className="flex w-full max-w-full items-baseline rounded-lg bg-muted px-2 py-1">
          {priceRow}
        </div>
      ) : presentation === "price-badge" ? (
        badgePriceRow
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

export { ProductCardPrice }

