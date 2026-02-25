import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface QuickViewPriceRowProps {
  formattedPrice: string
  formattedOriginalPrice?: string | null
  showDiscount: boolean
  discountPercent: number
  inStock: boolean
  outOfStockLabel: string
  priceClassName?: string
}

export function QuickViewPriceRow({
  formattedPrice,
  formattedOriginalPrice,
  showDiscount,
  discountPercent,
  inStock,
  outOfStockLabel,
  priceClassName,
}: QuickViewPriceRowProps) {
  return (
    <div className="flex flex-wrap items-baseline gap-2">
      <span className={cn("tabular-nums tracking-tight text-price", priceClassName)}>
        {formattedPrice}
      </span>

      {formattedOriginalPrice ? (
        <span className="text-sm tabular-nums text-muted-foreground line-through">
          {formattedOriginalPrice}
        </span>
      ) : null}

      {showDiscount && discountPercent > 0 ? (
        <Badge variant="destructive" size="compact" className="tabular-nums">
          -{discountPercent}%
        </Badge>
      ) : null}

      {!inStock ? (
        <Badge
          variant="outline"
          className="ml-auto border-destructive bg-destructive-subtle text-destructive"
        >
          {outOfStockLabel}
        </Badge>
      ) : null}
    </div>
  )
}

