
import { TrendingDown as TrendDown, TrendingUp as TrendUp } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTranslations } from "next-intl"
import { CURRENCY_SYMBOLS, type PriceSuggestion } from "./pricing.constants"

type PriceSuggestionCardProps = {
  suggestion: PriceSuggestion | null
  currentPrice: string
  onApply: (price: number) => void
}

export function PriceSuggestionCard({
  suggestion,
  currentPrice,
  onApply,
}: PriceSuggestionCardProps) {
  const tSell = useTranslations("Sell")

  if (!suggestion || suggestion.count < 3) return null

  const priceNum = Number.parseFloat(currentPrice) || 0
  const symbol = CURRENCY_SYMBOLS[suggestion.currency] || suggestion.currency

  const getPricePosition = () => {
    if (priceNum <= 0) return null
    if (priceNum < suggestion.low) return "below"
    if (priceNum > suggestion.high) return "above"
    if (priceNum < suggestion.median) return "low"
    if (priceNum > suggestion.median) return "high"
    return "median"
  }

  const position = getPricePosition()

  return (
    <div className="p-3 rounded-lg bg-muted border border-border">
      <div className="flex items-center gap-2 mb-2">
        <TrendUp className="h-4 w-4 text-primary" />
        <span className="text-xs font-semibold text-foreground">
          {tSell("fields.pricing.priceGuide", { count: suggestion.count })}
        </span>
      </div>

      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => onApply(suggestion.low)}
          className="flex-1 p-2 rounded-lg bg-background hover:bg-accent transition-colors text-center"
        >
          <div className="text-xs text-muted-foreground mb-0.5">{tSell("fields.pricing.suggestions.low")}</div>
          <div className="text-sm font-semibold text-foreground">
            {symbol}
            {suggestion.low.toFixed(2)}
          </div>
        </button>

        <button
          type="button"
          onClick={() => onApply(suggestion.median)}
          className="flex-1 p-2 rounded-lg bg-selected hover:bg-hover active:bg-active transition-colors text-center ring-2 ring-ring"
        >
          <div className="text-xs text-primary mb-0.5">{tSell("fields.pricing.suggestions.recommended")}</div>
          <div className="text-sm font-bold text-primary">
            {symbol}
            {suggestion.median.toFixed(2)}
          </div>
        </button>

        <button
          type="button"
          onClick={() => onApply(suggestion.high)}
          className="flex-1 p-2 rounded-lg bg-background hover:bg-accent transition-colors text-center"
        >
          <div className="text-xs text-muted-foreground mb-0.5">{tSell("fields.pricing.suggestions.high")}</div>
          <div className="text-sm font-semibold text-foreground">
            {symbol}
            {suggestion.high.toFixed(2)}
          </div>
        </button>
      </div>

      {position && priceNum > 0 && (
        <div
          className={cn(
            "mt-2 flex items-center gap-1.5 text-xs",
            position === "below" && "text-success",
            position === "above" && "text-warning",
            (position === "low" || position === "median" || position === "high") && "text-primary",
          )}
        >
          {position === "below" && <TrendDown className="h-3.5 w-3.5" />}
          {position === "above" && <TrendUp className="h-3.5 w-3.5" />}
          {tSell("fields.pricing.positionHint", { position })}
        </div>
      )}
    </div>
  )
}
