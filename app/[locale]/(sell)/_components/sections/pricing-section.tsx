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
import { Switch } from "@/components/ui/switch";
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
          <div className="text-2xs text-muted-foreground mb-0.5">Low</div>
          <div className="text-sm font-semibold text-foreground">
            {symbol}{suggestion.low.toFixed(2)}
          </div>
        </button>
        
        <button
          type="button"
          onClick={() => onApply(suggestion.median)}
          className="flex-1 p-2 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors text-center ring-2 ring-primary/30"
        >
          <div className="text-2xs text-primary mb-0.5">Recommended</div>
          <div className="text-sm font-bold text-primary">
            {symbol}{suggestion.median.toFixed(2)}
          </div>
        </button>
        
        <button
          type="button"
          onClick={() => onApply(suggestion.high)}
          className="flex-1 p-2 rounded-lg bg-background hover:bg-accent transition-colors text-center"
        >
          <div className="text-2xs text-muted-foreground mb-0.5">High</div>
          <div className="text-sm font-semibold text-foreground">
            {symbol}{suggestion.high.toFixed(2)}
          </div>
        </button>
      </div>

      {/* Position indicator */}
      {position && priceNum > 0 && (
        <div className={cn(
          "mt-2 flex items-center gap-1.5 text-xs",
          position === "below" && "text-success",
          position === "above" && "text-warning",
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
  locale = "en",
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
  const isBg = locale === "bg";

  return (
    <section className="rounded-xl border border-border bg-background overflow-hidden shadow-xs">
      <div className="p-5 pb-4 border-b border-border/50 bg-muted/10">
        <div className="flex items-center gap-3.5">
          <div className="flex size-10 items-center justify-center rounded-md bg-background border border-border shadow-xs">
            <CurrencyDollar className="size-5 text-muted-foreground" weight="bold" />
          </div>
          <div>
            <h3 className="text-sm font-bold tracking-tight text-foreground">
              {isBg ? "Ценообразуване" : "Pricing"}
            </h3>
            <p className="text-xs font-medium text-muted-foreground">
              {isBg ? "Задайте цена и формат на продажба" : "Set your price and selling format"}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-6 p-6">
        {/* Format Selection */}
        <div>
          <Label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80 mb-3 block">
            Selling format
          </Label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => form.setValue("format", "fixed", { shouldValidate: true })}
              className={cn(
                "flex items-center gap-3 p-3.5 rounded-xl border transition-all shadow-xs",
                format === "fixed"
                  ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                  : "border-border bg-background hover:border-primary/30"
              )}
            >
              <div className={cn(
                "size-9 rounded-lg flex items-center justify-center border",
                format === "fixed" ? "bg-primary/10 border-primary/20" : "bg-muted/30 border-border/50"
              )}>
                <Tag className={cn(
                  "size-4.5",
                  format === "fixed" ? "text-primary" : "text-muted-foreground"
                )} weight="bold" />
              </div>
              <div className="text-left">
                <div className={cn(
                  "font-bold text-sm tracking-tight",
                  format === "fixed" ? "text-primary" : "text-foreground"
                )}>
                  Fixed Price
                </div>
                <div className="text-[11px] font-medium text-muted-foreground/70">Buy it now</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => form.setValue("format", "auction", { shouldValidate: true })}
              className={cn(
                "flex items-center gap-3 p-3.5 rounded-xl border transition-all shadow-xs",
                format === "auction"
                  ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                  : "border-border bg-background hover:border-primary/30"
              )}
            >
              <div className={cn(
                "size-9 rounded-lg flex items-center justify-center border",
                format === "auction" ? "bg-primary/10 border-primary/20" : "bg-muted/30 border-border/50"
              )}>
                <Gavel className={cn(
                  "size-4.5",
                  format === "auction" ? "text-primary" : "text-muted-foreground"
                )} weight="bold" />
              </div>
              <div className="text-left">
                <div className={cn(
                  "font-bold text-sm tracking-tight",
                  format === "auction" ? "text-primary" : "text-foreground"
                )}>
                  Auction
                </div>
                <div className="text-[11px] font-medium text-muted-foreground/70">Accept bids</div>
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
        <div className="grid grid-cols-2 gap-5">
          <div className="space-y-2">
            <Label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80 block">
              {format === "auction" ? "Starting price" : "Price"} <span className="text-destructive">*</span>
            </Label>
            <div className="relative group">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground font-bold text-sm transition-colors group-focus-within:text-primary">
                {symbol}
              </span>
              <Input
                value={price}
                onChange={(e) => form.setValue("price", e.target.value, { shouldValidate: true })}
                placeholder="0.00"
                type="text"
                inputMode="decimal"
                className={cn(
                  "pl-9 pr-4 h-11 rounded-md text-base font-bold bg-muted/5 border-border/60 focus:bg-background transition-all",
                  priceError && "border-destructive ring-destructive/20"
                )}
              />
            </div>
            {priceError && (
              <p className="mt-1 text-[11px] font-medium text-destructive">{priceError}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80 block">
              Compare at price
              <span className="text-muted-foreground/60 font-medium ml-1">(optional)</span>
            </Label>
            <div className="relative group">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground font-bold text-sm transition-colors group-focus-within:text-primary">
                {symbol}
              </span>
              <Input
                value={compareAtPrice}
                onChange={(e) => form.setValue("compareAtPrice", e.target.value, { shouldValidate: true })}
                placeholder="0.00"
                type="text"
                inputMode="decimal"
                className="pl-9 pr-4 h-11 rounded-md text-base font-bold bg-muted/5 border-border/60 focus:bg-background transition-all"
              />
            </div>
            <p className="mt-1 text-[11px] font-medium text-muted-foreground/60">
              Shows as original price with strikethrough
            </p>
          </div>
        </div>

        {/* Quantity */}
        <div className="space-y-2">
          <Label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80 block">Quantity</Label>
          <QuantityStepper
            value={quantity}
            onChange={(val) => form.setValue("quantity", val, { shouldValidate: true })}
          />
        </div>

        {/* Accept Offers Toggle */}
        {format === "fixed" && (
          <div>
            <label
              className={cn(
                "w-full flex items-center gap-3.5 p-4 rounded-xl border transition-all cursor-pointer shadow-xs",
                acceptOffers
                  ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                  : "border-border bg-background hover:border-primary/30"
              )}
            >
              <div className={cn(
                "size-10 rounded-lg flex items-center justify-center shrink-0 border",
                acceptOffers ? "bg-primary/10 border-primary/20" : "bg-muted/30 border-border/50"
              )}>
                <Handshake className={cn(
                  "size-5",
                  acceptOffers ? "text-primary" : "text-muted-foreground"
                )} weight="bold" />
              </div>
              <div className="flex-1 text-left">
                <div className={cn(
                  "font-bold text-sm tracking-tight",
                  acceptOffers ? "text-primary" : "text-foreground"
                )}>
                  Accept offers from buyers
                </div>
                <div className="text-[11px] font-medium text-muted-foreground/70">
                  Let buyers negotiate the price with you
                </div>
              </div>
              <Switch
                checked={acceptOffers ?? false}
                onCheckedChange={(checked) => form.setValue("acceptOffers", checked)}
                aria-label="Accept offers from buyers"
              />
            </label>
          </div>
        )}

        {/* Fee Info */}
        <div className="flex items-start gap-3 p-4 rounded-xl bg-muted/5 border border-border/50 shadow-xs">
          <div className="size-8 rounded-md bg-background border border-border flex items-center justify-center shrink-0">
            <Info className="size-4 text-muted-foreground" weight="bold" />
          </div>
          <div className="text-xs font-medium text-muted-foreground leading-relaxed">
            <strong className="text-foreground font-bold">Selling fees:</strong> 10% commission on sale price. No listing fees for Basic sellers.
            <a href="/seller/pricing" className="ml-1.5 text-primary font-bold hover:underline">
              View pricing plans
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
