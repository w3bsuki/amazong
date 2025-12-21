"use client";

import { TrendUp, TrendDown } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

interface PriceSuggestion {
  low: number;
  median: number;
  high: number;
  currency: string;
  count: number;
}

// Currency symbols
const CURRENCY_SYMBOLS: Record<string, string> = {
  BGN: "лв",
  EUR: "€",
  USD: "$",
};

interface PriceSuggestionCardProps {
  suggestion: PriceSuggestion | null;
  currentPrice: string;
  onApply: (price: number) => void;
}

/**
 * PriceSuggestionCard - Shows price range guide based on similar listings
 * 
 * Displays low/median/high price ranges with click-to-apply functionality.
 * Shows positioning feedback for current price relative to market.
 */
export function PriceSuggestionCard({
  suggestion,
  currentPrice,
  onApply,
}: PriceSuggestionCardProps) {
  if (!suggestion || suggestion.count < 3) return null;

  const priceNum = parseFloat(currentPrice) || 0;
  const symbol = CURRENCY_SYMBOLS[suggestion.currency] || suggestion.currency;

  const getPricePosition = () => {
    if (priceNum <= 0) return null;
    if (priceNum < suggestion.low) return "below";
    if (priceNum > suggestion.high) return "above";
    if (priceNum < suggestion.median) return "low";
    if (priceNum > suggestion.median) return "high";
    return "median";
  };

  const position = getPricePosition();

  return (
    <div className="p-3 rounded-lg bg-muted border border-border">
      <div className="flex items-center gap-2 mb-2">
        <TrendUp className="h-4 w-4 text-primary" />
        <span className="text-xs font-semibold text-foreground">
          Price Guide ({suggestion.count} similar listings)
        </span>
      </div>
      
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => onApply(suggestion.low)}
          className="flex-1 p-2 rounded-lg bg-background hover:bg-accent transition-colors text-center"
        >
          <div className="text-xs text-muted-foreground mb-0.5">Low</div>
          <div className="text-sm font-semibold text-foreground">
            {symbol}{suggestion.low.toFixed(2)}
          </div>
        </button>
        
        <button
          type="button"
          onClick={() => onApply(suggestion.median)}
          className="flex-1 p-2 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors text-center ring-2 ring-primary/30"
        >
          <div className="text-xs text-primary mb-0.5">Recommended</div>
          <div className="text-sm font-bold text-primary">
            {symbol}{suggestion.median.toFixed(2)}
          </div>
        </button>
        
        <button
          type="button"
          onClick={() => onApply(suggestion.high)}
          className="flex-1 p-2 rounded-lg bg-background hover:bg-accent transition-colors text-center"
        >
          <div className="text-xs text-muted-foreground mb-0.5">High</div>
          <div className="text-sm font-semibold text-foreground">
            {symbol}{suggestion.high.toFixed(2)}
          </div>
        </button>
      </div>

      {/* Position indicator */}
      {position && priceNum > 0 && (
        <div className={cn(
          "mt-2 flex items-center gap-1.5 text-xs",
          position === "below" && "text-primary",
          position === "above" && "text-destructive",
          (position === "low" || position === "median" || position === "high") && "text-primary"
        )}>
          {position === "below" && <TrendDown className="h-3.5 w-3.5" />}
          {position === "above" && <TrendUp className="h-3.5 w-3.5" />}
          {position === "below" && "Your price is below market - items sell faster!"}
          {position === "above" && "Your price is above typical range"}
          {position === "low" && "Competitively priced"}
          {position === "median" && "Priced at market average"}
          {position === "high" && "Premium pricing"}
        </div>
      )}
    </div>
  );
}
