import { cn } from '@/lib/utils'
import { formatPrice, formatPriceParts } from '@/lib/currency'

interface ProductPriceProps {
  price: number
  originalPrice?: number
  locale: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
  showAccessibleLabel?: boolean
  showVat?: boolean
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
  const priceParts = formatPriceParts(price, locale)
  const classes = sizeClasses[size]
  
  // Accessible label for screen readers
  const accessiblePrice = formatPrice(price, locale)
  const accessibleOriginal = originalPrice ? formatPrice(originalPrice, locale) : null
  const discountLabel = hasDiscount && accessibleOriginal ? `, was ${accessibleOriginal}` : ""
  const accessibleLabel = showAccessibleLabel
    ? `Price: ${accessiblePrice}${discountLabel}`
    : undefined
  
  const vatLabel = locale === 'bg' ? 'с ДДС' : 'incl. VAT'
  
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
          {locale === 'bg' ? ',' : '.'}{priceParts.decimalPart}
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
          {formatPrice(originalPrice, locale)}
        </span>
      )}
    </div>
  )
}
