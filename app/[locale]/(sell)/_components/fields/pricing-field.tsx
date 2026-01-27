"use client";

import { useState, useCallback, useEffect, memo } from "react";
import { Controller } from "react-hook-form";
import {
  Tag,
  Gavel,
  CurrencyDollar,
  TrendUp,
  TrendDown,
  Minus,
  Plus,
  Handshake,
  CaretRight,
} from "@phosphor-icons/react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Field, FieldLabel, FieldDescription, FieldError, FieldContent } from "@/components/shared/field";
import { cn } from "@/lib/utils";
import { formatOptions } from "@/lib/sell/schema-v4";
import { useSellForm, useSellFormContext } from "../sell-form-provider";
import { SelectDrawer } from "../ui/select-drawer";

// ============================================================================
// Constants - V1: BGN only (Cash on Delivery in Bulgaria)
// ============================================================================
const CURRENCY_SYMBOLS: Record<string, string> = {
  BGN: "лв",
  EUR: "€",
  USD: "$",
};

// V1: Only BGN for cash on delivery in Bulgaria
const CURRENCIES = [
  { value: "BGN", label: "BGN (лв)" },
];

// ============================================================================
// Price Suggestion Types & Component
// ============================================================================
interface PriceSuggestion {
  low: number;
  median: number;
  high: number;
  currency: string;
  count: number;
}

function PriceSuggestionCard({
  suggestion,
  currentPrice,
  onApply,
  isBg,
}: {
  suggestion: PriceSuggestion | null;
  currentPrice: string;
  onApply: (price: number) => void;
  isBg: boolean;
}) {
  if (!suggestion || suggestion.count < 3) return null;

  const priceNum = Number.parseFloat(currentPrice) || 0;
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
          {isBg ? `Ценови ориентир (${suggestion.count} подобни обяви)` : `Price Guide (${suggestion.count} similar listings)`}
        </span>
      </div>

      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => onApply(suggestion.low)}
          className="flex-1 p-2 rounded-lg bg-background hover:bg-accent transition-colors text-center"
        >
          <div className="text-xs text-muted-foreground mb-0.5">{isBg ? "Ниска" : "Low"}</div>
          <div className="text-sm font-semibold text-foreground">
            {symbol}{suggestion.low.toFixed(2)}
          </div>
        </button>

        <button
          type="button"
          onClick={() => onApply(suggestion.median)}
          className="flex-1 p-2 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors text-center ring-2 ring-primary/30"
        >
          <div className="text-xs text-primary mb-0.5">{isBg ? "Препоръчана" : "Recommended"}</div>
          <div className="text-sm font-bold text-primary">
            {symbol}{suggestion.median.toFixed(2)}
          </div>
        </button>

        <button
          type="button"
          onClick={() => onApply(suggestion.high)}
          className="flex-1 p-2 rounded-lg bg-background hover:bg-accent transition-colors text-center"
        >
          <div className="text-xs text-muted-foreground mb-0.5">{isBg ? "Висока" : "High"}</div>
          <div className="text-sm font-semibold text-foreground">
            {symbol}{suggestion.high.toFixed(2)}
          </div>
        </button>
      </div>

      {position && priceNum > 0 && (
        <div className={cn(
          "mt-2 flex items-center gap-1.5 text-xs",
          position === "below" && "text-success",
          position === "above" && "text-warning",
          (position === "low" || position === "median" || position === "high") && "text-primary"
        )}>
          {position === "below" && <TrendDown className="h-3.5 w-3.5" />}
          {position === "above" && <TrendUp className="h-3.5 w-3.5" />}
          {position === "below" && (isBg ? "Цената ви е под пазарната - продава се по-бързо!" : "Your price is below market - items sell faster!")}
          {position === "above" && (isBg ? "Цената ви е над типичния диапазон" : "Your price is above typical range")}
          {position === "low" && (isBg ? "Конкурентна цена" : "Competitively priced")}
          {position === "median" && (isBg ? "Средна пазарна цена" : "Priced at market average")}
          {position === "high" && (isBg ? "Премиум ценообразуване" : "Premium pricing")}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Quantity Stepper Component
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
    <div className="flex items-center h-12 w-fit rounded-md border border-border bg-background shadow-xs overflow-hidden">
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        className="h-full px-4 flex items-center justify-center hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors touch-manipulation border-r border-border/50"
        aria-label="Decrease quantity"
      >
        <Minus className="size-4" weight="bold" />
      </button>
      <Input
        type="number"
        value={value}
        onChange={(e) => {
          const num = Number.parseInt(e.target.value, 10);
          if (!isNaN(num)) {
            onChange(Math.max(min, Math.min(max, num)));
          }
        }}
        className="w-14 h-full text-center text-base font-bold border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none"
        min={min}
        max={max}
      />
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        className="h-full px-4 flex items-center justify-center hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors touch-manipulation border-l border-border/50"
        aria-label="Increase quantity"
      >
        <Plus className="size-4" weight="bold" />
      </button>
    </div>
  );
}

// ============================================================================
// PRICING FIELD - Price, quantity, offers using context pattern
// ============================================================================

interface PricingFieldProps {
  /** Custom class name for the field wrapper */
  className?: string;
  /** Category ID for price suggestions */
  categoryId?: string;
  /** Prefix for DOM ids (prevents duplicates across layouts) */
  idPrefix?: string;
  /** Use compact layout */
  compact?: boolean;
}

export function PricingField({ className, categoryId, idPrefix = "sell-form", compact = false }: PricingFieldProps) {
  const { control, setValue, watch, formState: { errors } } = useSellForm();
  const { isBg } = useSellFormContext();

  const [isCurrencyDrawerOpen, setIsCurrencyDrawerOpen] = useState(false);

  // Watch form values
  const format = watch("format");
  const price = watch("price");
  const currency = watch("currency");
  const quantity = watch("quantity");
  const acceptOffers = watch("acceptOffers");
  const compareAtPrice = watch("compareAtPrice");

  const [priceSuggestion, _setPriceSuggestion] = useState<PriceSuggestion | null>(null);
  const priceInputId = `${idPrefix}-price`;
  const comparePriceInputId = `${idPrefix}-compare-price`;

  // Fetch price suggestions (stub - would connect to API)
  useEffect(() => {
    // Stub: Price suggestion API not implemented yet
    // Would query historical prices by category/condition to suggest pricing
  }, [categoryId]);

  const handleApplyPrice = useCallback((priceValue: number) => {
    setValue("price", priceValue.toFixed(2), { shouldValidate: true });
  }, [setValue]);

  const hasError = !!errors.price;

  const content = (
    <FieldContent className={cn("space-y-6", !compact && "p-6")}>
      {/* Format Selection */}
      <div className="grid grid-cols-2 gap-3">
        {formatOptions.map((option) => {
          const isSelected = format === option.value;
          const Icon = option.value === "fixed" ? Tag : Gavel;
          const label = isBg ? option.labelBg : option.label;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => setValue("format", option.value, { shouldValidate: true })}
              className={cn(
                "flex items-center justify-center gap-2 h-12 rounded-md border transition-all",
                "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/5",
                isSelected
                  ? "border-primary bg-primary/10 text-primary font-bold shadow-xs"
                  : "border-border bg-background hover:border-primary/30 text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="size-5" weight={isSelected ? "fill" : "bold"} />
              <span className="text-sm">
                {label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Price Input - Premium card design */}
      <Controller
        name="price"
        control={control}
        render={({ field, fieldState }) => (
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <label htmlFor={priceInputId} className="text-sm font-bold text-foreground">
                {isBg ? "Вашата цена" : "Your price"} <span className="text-destructive">*</span>
              </label>
            </div>
            
            <div className={cn(
              "rounded-xl border bg-card overflow-hidden transition-all",
              "focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary/50",
              fieldState.invalid ? "border-destructive/50 bg-destructive/5" : "border-border"
            )}>
              <div className="flex items-center h-16 px-4">
                <span className="text-2xl font-bold text-muted-foreground mr-2">
                  {CURRENCY_SYMBOLS[currency] || currency}
                </span>
                <Input
                  {...field}
                  id={priceInputId}
                  type="text"
                  inputMode="decimal"
                  placeholder="0.00"
                  className="border-none bg-transparent h-full text-3xl font-bold p-0 focus-visible:ring-0 flex-1"
                />
                {compact ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setIsCurrencyDrawerOpen(true)}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-muted/60 hover:bg-muted transition-colors"
                    >
                      <span className="text-sm font-bold">{currency}</span>
                      <CaretRight className="size-3.5 text-muted-foreground rotate-90" />
                    </button>
                    <SelectDrawer
                      isOpen={isCurrencyDrawerOpen}
                      onClose={() => setIsCurrencyDrawerOpen(false)}
                      title={isBg ? "Изберете валута" : "Select Currency"}
                      options={CURRENCIES.map(c => c.value)}
                      optionsBg={CURRENCIES.map(c => c.label)}
                      value={currency}
                      onChange={(val) => setValue("currency", val as "EUR")}
                      locale={isBg ? "bg" : "en"}
                    />
                  </>
                ) : (
                  <Select
                    value={currency}
                    onValueChange={(val) => setValue("currency", val as "EUR")}
                  >
                    <SelectTrigger className="w-auto min-w-24 border-none bg-muted/60 h-10 rounded-xl font-bold focus:ring-0 focus:ring-offset-0 shadow-none px-3 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CURRENCIES.map((c) => (
                        <SelectItem key={c.value} value={c.value} className="font-medium">
                          {c.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            </div>
            {fieldState.invalid && (
              <FieldError errors={[fieldState.error]} />
            )}
          </div>
        )}
      />

      {/* Price Suggestions */}
      <PriceSuggestionCard
        suggestion={priceSuggestion}
        currentPrice={price}
        onApply={handleApplyPrice}
        isBg={isBg}
      />

      {/* Compare at Price (Optional) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <label htmlFor={comparePriceInputId} className="text-sm font-bold text-foreground flex items-center gap-2">
            {isBg ? "Стара цена" : "Compare at price"}
            <span className="text-xs font-medium text-muted-foreground">{isBg ? "(по избор)" : "(optional)"}</span>
          </label>
        </div>
        <div className={cn(
          "flex items-center h-14 px-4 rounded-xl border bg-card transition-all",
          "focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary/50"
        )}>
          <span className="text-base font-bold text-muted-foreground mr-2">
            {CURRENCY_SYMBOLS[currency] || currency}
          </span>
          <Input
            id={comparePriceInputId}
            type="text"
            inputMode="decimal"
            placeholder={isBg ? "Оригинална цена" : "Original price"}
            value={compareAtPrice || ""}
            onChange={(e) => setValue("compareAtPrice", e.target.value)}
            className="border-none bg-transparent h-full text-lg font-semibold p-0 focus-visible:ring-0 flex-1"
          />
        </div>
      </div>

      {/* Quantity */}
      <div className="space-y-2">
        <Label className="text-sm font-bold px-1">
          {isBg ? "Количество" : "Quantity"}
        </Label>
        <QuantityStepper
          value={quantity}
          onChange={(val) => setValue("quantity", val, { shouldValidate: true })}
        />
      </div>

      {/* Accept Offers Toggle - Premium pill design */}
      <button
        type="button"
        onClick={() => setValue("acceptOffers", !acceptOffers)}
        className={cn(
          "w-full flex items-center gap-3.5 p-4 rounded-xl border transition-all",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30",
          "active:scale-[0.98]",
          acceptOffers 
            ? "border-primary/40 bg-primary/5" 
            : "border-border bg-card hover:bg-muted/30"
        )}
      >
        <div className={cn(
          "size-11 rounded-xl flex items-center justify-center shrink-0 transition-all",
          acceptOffers 
            ? "bg-primary/15 text-primary" 
            : "bg-muted text-muted-foreground"
        )}>
          <Handshake className="size-5" weight={acceptOffers ? "fill" : "regular"} />
        </div>
        <div className="flex-1 text-left min-w-0">
          <span className={cn(
            "text-base font-semibold block",
            acceptOffers ? "text-foreground" : "text-foreground"
          )}>
            {isBg ? "Приемане на оферти" : "Accept offers"}
          </span>
          <span className="text-sm text-muted-foreground line-clamp-1">
            {isBg
              ? "Позволете на купувачите да предлагат цена"
              : "Let buyers negotiate the price"}
          </span>
        </div>
        <Switch 
          checked={acceptOffers} 
          onCheckedChange={(checked) => setValue("acceptOffers", checked)}
          className="shrink-0 scale-110"
        />
      </button>
    </FieldContent>
  );

  return (
    <Field data-invalid={hasError} className={className}>
      {!compact ? (
        <div className="rounded-md border border-form-section-border bg-form-section-bg overflow-hidden shadow-xs">
          {/* Header */}
          <div className="p-section pb-form border-b border-border/50 bg-muted/10">
            <div className="flex items-center gap-form-sm">
              <div className="flex size-10 items-center justify-center rounded-md bg-form-section-bg border border-form-section-border shadow-xs">
                <CurrencyDollar className="size-5 text-muted-foreground" weight="bold" />
              </div>
              <div>
                <FieldLabel className="text-sm font-bold tracking-tight text-foreground">
                  {isBg ? "Цена и количество" : "Price & Quantity"}
                </FieldLabel>
                <FieldDescription className="text-sm text-muted-foreground mt-0.5">
                  {isBg
                    ? "Задайте цена и налично количество"
                    : "Set your price and available quantity"}
                </FieldDescription>
              </div>
            </div>
          </div>

          {content}
        </div>
      ) : (
        <>
          {/* Compact Label - hidden if we use label inside */}
          <div className="hidden">
            <FieldLabel className="text-sm font-semibold mb-form-sm">
              {isBg ? "Цена и количество" : "Pricing"}
            </FieldLabel>
          </div>
          {content}
        </>
      )}
    </Field>
  );
}

/**
 * Memoized PricingField - Price, quantity, currency, and offer settings.
 * Optimized to prevent unnecessary re-renders when unrelated form state changes.
 * @see useSellForm - Hook for form state access
 * @see useSellFormContext - Hook for context access
 */
const MemoizedPricingField = memo(PricingField);
