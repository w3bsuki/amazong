"use client";

import { useCallback, useEffect, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import {
  Tag,
  Gavel,
  CurrencyDollar,
  TrendUp,
  TrendDown,
  Minus,
  Plus,
  Info,
  Handshake,
} from "@phosphor-icons/react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { SellFormDataV4 } from "@/lib/sell-form-schema-v4";

interface PricingSectionProps {
  form: UseFormReturn<SellFormDataV4>;
  categoryId?: string;
  locale?: string;
}

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

// ============================================================================
// Price Suggestion Component
// ============================================================================
function PriceSuggestionCard({
  suggestion,
  currentPrice,
  onApply,
}: {
  suggestion: PriceSuggestion | null;
  currentPrice: string;
  onApply: (price: number) => void;
}) {
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
          <div className="text-[10px] text-muted-foreground mb-0.5">Low</div>
          <div className="text-sm font-semibold text-foreground">
            {symbol}{suggestion.low.toFixed(2)}
          </div>
        </button>
        
        <button
          type="button"
          onClick={() => onApply(suggestion.median)}
          className="flex-1 p-2 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors text-center ring-2 ring-primary/30"
        >
          <div className="text-[10px] text-primary mb-0.5">Recommended</div>
          <div className="text-sm font-bold text-primary">
            {symbol}{suggestion.median.toFixed(2)}
          </div>
        </button>
        
        <button
          type="button"
          onClick={() => onApply(suggestion.high)}
          className="flex-1 p-2 rounded-lg bg-background hover:bg-accent transition-colors text-center"
        >
          <div className="text-[10px] text-muted-foreground mb-0.5">High</div>
          <div className="text-sm font-semibold text-foreground">
            {symbol}{suggestion.high.toFixed(2)}
          </div>
        </button>
      </div>

      {/* Position indicator */}
      {position && priceNum > 0 && (
        <div className={cn(
          "mt-2 flex items-center gap-1.5 text-xs",
          position === "below" && "text-green-600",
          position === "above" && "text-amber-600",
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

// ============================================================================
// Quantity Stepper
// ============================================================================
function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 9999,
}: {
  value: number;
  onChange: (val: number) => void;
  min?: number;
  max?: number;
}) {
  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        className="h-10 w-10 rounded-lg border border-border flex items-center justify-center hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <Minus className="h-4 w-4" />
      </button>
      <Input
        type="number"
        value={value}
        onChange={(e) => {
          const num = parseInt(e.target.value, 10);
          if (!isNaN(num)) {
            onChange(Math.max(min, Math.min(max, num)));
          }
        }}
        className="w-20 h-10 text-center rounded-lg"
        min={min}
        max={max}
      />
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        className="h-10 w-10 rounded-lg border border-border flex items-center justify-center hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}

// ============================================================================
// Main Pricing Section
// ============================================================================
export function PricingSection({
  form,
  categoryId,
}: PricingSectionProps) {
  const format = form.watch("format");
  const price = form.watch("price");
  const currency = form.watch("currency");
  const quantity = form.watch("quantity");
  const acceptOffers = form.watch("acceptOffers");
  const compareAtPrice = form.watch("compareAtPrice");

  const [priceSuggestion, setPriceSuggestion] = useState<PriceSuggestion | null>(null);
  const [isLoadingSuggestion, setIsLoadingSuggestion] = useState(false);

  // Fetch price suggestions when category changes
  useEffect(() => {
    if (!categoryId) {
      setPriceSuggestion(null);
      return;
    }

    const fetchPriceSuggestion = async () => {
      setIsLoadingSuggestion(true);
      try {
        const response = await fetch(`/api/products/price-suggestion?categoryId=${categoryId}`);
        if (response.ok) {
          const data = await response.json();
          setPriceSuggestion(data);
        }
      } catch (error) {
        console.error("Failed to fetch price suggestion:", error);
      } finally {
        setIsLoadingSuggestion(false);
      }
    };

    fetchPriceSuggestion();
  }, [categoryId]);

  // Apply suggested price
  const handleApplyPrice = useCallback((suggestedPrice: number) => {
    form.setValue("price", suggestedPrice.toFixed(2), { shouldValidate: true });
  }, [form]);

  const priceError = form.formState.errors.price?.message;
  const symbol = CURRENCY_SYMBOLS[currency] || currency;
  const isBg = false; // TODO: Add locale prop

  return (
    <section className="rounded-lg border border-border bg-card">
      <div className="pb-3 pt-5 px-5">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-green-500/10">
            <CurrencyDollar className="size-5 text-green-600" weight="duotone" />
          </div>
          <div>
            <h3 className="text-base font-semibold">
              {isBg ? "Ценообразуване" : "Pricing"}
            </h3>
            <p className="text-sm text-muted-foreground">
              {isBg ? "Задайте цена и формат на продажба" : "Set your price and selling format"}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-6 px-5 pb-6 pt-0">
        {/* Format Selection */}
        <div>
          <Label className="text-sm font-medium mb-2 block">Selling format</Label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => form.setValue("format", "fixed", { shouldValidate: true })}
              className={cn(
                "flex items-center gap-3 p-4 rounded-lg border-2 transition-colors",
                format === "fixed"
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/30"
              )}
            >
              <div className={cn(
                "h-10 w-10 rounded-lg flex items-center justify-center",
                format === "fixed" ? "bg-primary/20" : "bg-muted"
              )}>
                <Tag className={cn(
                  "h-5 w-5",
                  format === "fixed" ? "text-primary" : "text-muted-foreground"
                )} weight="duotone" />
              </div>
              <div className="text-left">
                <div className={cn(
                  "font-semibold text-sm",
                  format === "fixed" ? "text-primary" : "text-foreground"
                )}>
                  Fixed Price
                </div>
                <div className="text-xs text-muted-foreground">Buy it now</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => form.setValue("format", "auction", { shouldValidate: true })}
              className={cn(
                "flex items-center gap-3 p-4 rounded-lg border-2 transition-colors",
                format === "auction"
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/30"
              )}
            >
              <div className={cn(
                "h-10 w-10 rounded-lg flex items-center justify-center",
                format === "auction" ? "bg-primary/20" : "bg-muted"
              )}>
                <Gavel className={cn(
                  "h-5 w-5",
                  format === "auction" ? "text-primary" : "text-muted-foreground"
                )} weight="duotone" />
              </div>
              <div className="text-left">
                <div className={cn(
                  "font-semibold text-sm",
                  format === "auction" ? "text-primary" : "text-foreground"
                )}>
                  Auction
                </div>
                <div className="text-xs text-muted-foreground">Accept bids</div>
              </div>
            </button>
          </div>
        </div>

        {/* Price Suggestion */}
        {!isLoadingSuggestion && priceSuggestion && (
          <PriceSuggestionCard
            suggestion={priceSuggestion}
            currentPrice={price}
            onApply={handleApplyPrice}
          />
        )}

        {/* Price Input */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-medium mb-1.5 block">
              {format === "auction" ? "Starting price" : "Price"} <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
                {symbol}
              </span>
              <Input
                value={price}
                onChange={(e) => form.setValue("price", e.target.value, { shouldValidate: true })}
                placeholder="0.00"
                type="text"
                inputMode="decimal"
                className={cn(
                  "pl-10 pr-4 h-12 rounded-lg text-lg font-semibold",
                  priceError && "border-destructive"
                )}
              />
            </div>
            {priceError && (
              <p className="mt-1 text-xs text-destructive">{priceError}</p>
            )}
          </div>

          <div>
            <Label className="text-sm font-medium mb-1.5 block">
              Compare at price
              <span className="text-muted-foreground font-normal ml-1">(optional)</span>
            </Label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
                {symbol}
              </span>
              <Input
                value={compareAtPrice}
                onChange={(e) => form.setValue("compareAtPrice", e.target.value, { shouldValidate: true })}
                placeholder="0.00"
                type="text"
                inputMode="decimal"
                className="pl-10 pr-4 h-12 rounded-lg"
              />
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Shows as original price with strikethrough
            </p>
          </div>
        </div>

        {/* Quantity */}
        <div>
          <Label className="text-sm font-medium mb-1.5 block">Quantity</Label>
          <QuantityStepper
            value={quantity}
            onChange={(val) => form.setValue("quantity", val, { shouldValidate: true })}
          />
        </div>

        {/* Accept Offers Toggle */}
        {format === "fixed" && (
          <div>
            <button
              type="button"
              onClick={() => form.setValue("acceptOffers", !acceptOffers, { shouldValidate: true })}
              className={cn(
                "w-full flex items-center gap-3 p-4 rounded-lg border-2 transition-colors",
                acceptOffers
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/30"
              )}
            >
              <div className={cn(
                "h-10 w-10 rounded-lg flex items-center justify-center shrink-0",
                acceptOffers ? "bg-primary/20" : "bg-muted"
              )}>
                <Handshake className={cn(
                  "h-5 w-5",
                  acceptOffers ? "text-primary" : "text-muted-foreground"
                )} weight="duotone" />
              </div>
              <div className="flex-1 text-left">
                <div className={cn(
                  "font-semibold text-sm",
                  acceptOffers ? "text-primary" : "text-foreground"
                )}>
                  Accept offers from buyers
                </div>
                <div className="text-xs text-muted-foreground">
                  Let buyers negotiate the price with you
                </div>
              </div>
              <div className={cn(
                "h-6 w-11 rounded-full transition-colors relative",
                acceptOffers ? "bg-primary" : "bg-muted"
              )}>
                <div className={cn(
                  "absolute top-1 h-4 w-4 rounded-full bg-white shadow transition-transform",
                  acceptOffers ? "translate-x-6" : "translate-x-1"
                )} />
              </div>
            </button>
          </div>
        )}

        {/* Fee Info */}
        <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900">
          <Info className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-700 dark:text-amber-400">
            <strong>Selling fees:</strong> 10% commission on sale price. No listing fees for Basic sellers.
            <a href="/seller/pricing" className="ml-1 underline hover:no-underline">
              View pricing plans
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
