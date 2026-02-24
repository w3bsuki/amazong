import { Badge } from "@/components/ui/badge"
import { MarketplaceBadge } from "@/components/shared/marketplace-badge"

type DesktopBuyBoxPriceSectionProps = {
  locale: string
  currency: string
  price: number
  originalPrice?: number | null | undefined
  condition?: string | null | undefined
}

function formatPrice(locale: string, currency: string, amount: number) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(amount)
}

export function DesktopBuyBoxPriceSection({
  locale,
  currency,
  price,
  originalPrice,
  condition,
}: DesktopBuyBoxPriceSectionProps) {
  const discount =
    originalPrice && originalPrice > price
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : 0

  return (
    <div className="space-y-1">
      <div className="flex items-baseline gap-2 flex-wrap">
        <span className="text-2xl font-bold text-foreground">{formatPrice(locale, currency, price)}</span>
        {originalPrice && originalPrice > price && (
          <>
            <span className="text-base text-muted-foreground line-through">
              {formatPrice(locale, currency, originalPrice)}
            </span>
            <Badge variant="destructive" className="text-xs px-1.5 py-0 h-5">
              -{discount}%
            </Badge>
          </>
        )}
      </div>
      {condition && <MarketplaceBadge variant="condition">{condition}</MarketplaceBadge>}
    </div>
  )
}
