import { cn } from '@/lib/utils'
import { formatCurrencyAmount } from '@/lib/price'

interface ProductPriceProps {
  price: number
  originalPrice?: number
  locale: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
  showAccessibleLabel?: boolean
  showVat?: boolean
}

interface CurrencyPriceParts {
  symbol: string
  wholePart: string
  decimalPart: string
  decimalSeparator: string
  symbolPosition: 'before' | 'after'
}

const sizeClasses = {
  sm: {
    symbol: 'text-xs',
    whole: 'text-lg',
    decimal: 'text-xs',
    original: 'text-xs'
  },
  md: {
    symbol: 'text-sm',
    whole: 'text-2xl sm:text-3xl',
    decimal: 'text-sm',
    original: 'text-sm'
  },
  lg: {
    symbol: 'text-base',
    whole: 'text-3xl sm:text-4xl',
    decimal: 'text-base',
    original: 'text-base'
  }
}

function getBgnPriceParts(value: number, locale: string): CurrencyPriceParts {
  const formatter = new Intl.NumberFormat(locale.startsWith('bg') ? 'bg-BG' : 'en-BG', {
    style: 'currency',
    currency: 'BGN',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
  const parts = formatter.formatToParts(value)
  const symbol = parts.find((part) => part.type === 'currency')?.value ?? 'лв.'
  const wholePart =
    parts
      .filter((part) => part.type === 'integer' || part.type === 'group')
      .map((part) => part.value)
      .join('') || '0'
  const decimalPart = parts.find((part) => part.type === 'fraction')?.value ?? '00'
  const decimalSeparator = parts.find((part) => part.type === 'decimal')?.value ?? ','
  const currencyIndex = parts.findIndex((part) => part.type === 'currency')
  const integerIndex = parts.findIndex((part) => part.type === 'integer')

  return {
    symbol,
    wholePart,
    decimalPart,
    decimalSeparator,
    symbolPosition: currencyIndex !== -1 && integerIndex !== -1 && currencyIndex < integerIndex ? 'before' : 'after',
  }
}

export function ProductPrice({
  price,
  originalPrice,
  locale,
  size = 'md',
  className,
  showAccessibleLabel = true,
  showVat = true
}: ProductPriceProps) {
  const hasDiscount = typeof originalPrice === "number" && originalPrice > price
  const priceParts = getBgnPriceParts(price, locale)
  const classes = sizeClasses[size]
  
  // Accessible label for screen readers
  const accessiblePrice = formatCurrencyAmount(price, locale, "BGN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
  const accessibleOriginal =
    typeof originalPrice === "number"
      ? formatCurrencyAmount(originalPrice, locale, "BGN", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
      : null
  const isBgLocale = locale.toLowerCase().startsWith("bg")
  const pricePrefix = isBgLocale ? "Цена" : "Price"
  const listPricePrefix = isBgLocale ? "Листова цена" : "was"
  const discountLabel =
    hasDiscount && accessibleOriginal
      ? isBgLocale
        ? `, ${listPricePrefix}: ${accessibleOriginal}`
        : `, ${listPricePrefix} ${accessibleOriginal}`
      : ""
  const accessibleLabel = showAccessibleLabel
    ? `${pricePrefix}: ${accessiblePrice}${discountLabel}`
    : undefined
  
  const vatLabel = isBgLocale ? 'с ДДС' : 'incl. VAT'
  
  return (
    <div 
      className={cn("flex items-baseline gap-2", className)}
      aria-label={accessibleLabel}
    >
      <span className={cn(
        "flex items-baseline gap-0.5 tabular-nums font-semibold",
        hasDiscount ? "text-price-sale" : "text-price-regular"
      )}>
        {priceParts.symbolPosition === 'before' && (
          <span 
            className={cn(classes.symbol, "align-top font-semibold relative top-1")}
            aria-hidden="true"
          >
            {priceParts.symbol}
          </span>
        )}
        <span 
          className={cn(classes.whole, "font-semibold")}
          aria-hidden="true"
        >
          {priceParts.wholePart}
        </span>
        <span 
          className={cn(classes.decimal, "align-top font-semibold relative top-1")}
          aria-hidden="true"
        >
          {priceParts.decimalSeparator}{priceParts.decimalPart}
        </span>
        {priceParts.symbolPosition === 'after' && (
          <span 
            className={cn(classes.symbol, "align-top font-semibold relative top-1 ml-1")}
            aria-hidden="true"
          >
            {priceParts.symbol}
          </span>
        )}
        {showVat && (
          <span className="text-xs text-muted-foreground font-normal ml-1">
            {vatLabel}
          </span>
        )}
      </span>
      
      {hasDiscount && originalPrice && (
        <span 
          className={cn("text-price-original line-through tabular-nums", classes.original)}
          aria-hidden="true"
        >
          {formatCurrencyAmount(originalPrice, locale, "BGN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </span>
      )}
    </div>
  )
}
