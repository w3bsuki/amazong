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
import { Field, FieldLabel, FieldDescription, FieldError, FieldContent } from "@/components/common/field";
import { cn } from "@/lib/utils";
import { formatOptions } from "@/lib/sell-form-schema-v4";
import { useSellForm, useSellFormContext } from "../sell-form-provider";
import { SelectDrawer } from "../ui/select-drawer";

// ============================================================================
// Constants
// ============================================================================
const CURRENCY_SYMBOLS: Record<string, string> = {
  BGN: "лв",
  EUR: "€",
  USD: "$",
};

const CURRENCIES = [
  { value: "BGN", label: "BGN (лв)" },
  { value: "EUR", label: "EUR (€)" },
  { value: "USD", label: "USD ($)" },
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
          position === "below" && "text-green-600",
          position === "above" && "text-amber-600",
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
    <div className="flex items-center h-12 w-fit rounded-xl border border-border bg-background shadow-xs overflow-hidden">
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        className="h-full px-4 flex items-center justify-center hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors active:scale-95 touch-manipulation border-r border-border/50"
        aria-label="Decrease quantity"
      >
        <Minus className="size-4" weight="bold" />
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
        className="w-14 h-full text-center text-base font-bold border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none"
        min={min}
        max={max}
      />
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        className="h-full px-4 flex items-center justify-center hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors active:scale-95 touch-manipulation border-l border-border/50"
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
  /** Use compact layout */
  compact?: boolean;
}

export function PricingField({ className, categoryId, compact = false }: PricingFieldProps) {
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

  // Fetch price suggestions (stub - would connect to API)
  useEffect(() => {
    // TODO: Fetch actual price suggestions based on category
    // For now, this is disabled
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
                    "flex items-center justify-center gap-2 h-12 rounded-xl border transition-all",
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

          {/* Price Input */}
          <Controller
            name="price"
            control={control}
            render={({ field, fieldState }) => (
              <div className="space-y-2">
                <div className={cn(
                  "flex items-center h-12 rounded-xl border border-border bg-background shadow-xs transition-all focus-within:ring-4 focus-within:ring-primary/5 focus-within:border-primary/50 overflow-hidden",
                  fieldState.invalid && "border-destructive bg-destructive/5 focus-within:ring-destructive/5 focus-within:border-destructive/50"
                )}>
                  <div className="relative flex-1 flex items-center px-4 min-w-0">
                    <label 
                      htmlFor="sell-form-price"
                      className="text-2xs font-bold uppercase tracking-wider text-muted-foreground shrink-0 mr-2"
                    >
                      {isBg ? "Цена:" : "Price:"} *
                    </label>
                    <div className="flex items-center flex-1 min-w-0">
                      <span className="text-muted-foreground font-bold text-sm shrink-0 mr-1">
                        {CURRENCY_SYMBOLS[currency] || currency}
                      </span>
                      <Input
                        {...field}
                        id="sell-form-price"
                        type="text"
                        inputMode="decimal"
                        placeholder="0.00"
                        className="border-none bg-transparent h-auto p-0 text-sm font-bold focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none flex-1 min-w-0"
                      />
                    </div>
                  </div>
                  <div className="h-6 w-px bg-border/50 shrink-0" />
                  {compact ? (
                    <>
                      <button
                        type="button"
                        onClick={() => setIsCurrencyDrawerOpen(true)}
                        className="w-auto min-w-[90px] flex items-center justify-between px-3 h-full font-bold text-sm hover:bg-muted transition-colors"
                      >
                        <span>{currency}</span>
                        <CaretRight className="size-3 opacity-50" weight="bold" />
                      </button>
                      <SelectDrawer
                        isOpen={isCurrencyDrawerOpen}
                        onClose={() => setIsCurrencyDrawerOpen(false)}
                        title={isBg ? "Изберете валута" : "Select Currency"}
                        options={CURRENCIES.map(c => c.value)}
                        optionsBg={CURRENCIES.map(c => c.label)}
                        value={currency}
                        onChange={(val) => setValue("currency", val as "BGN" | "EUR" | "USD")}
                        locale={isBg ? "bg" : "en"}
                      />
                    </>
                  ) : (
                    <Select 
                      value={currency} 
                      onValueChange={(val) => setValue("currency", val as "BGN" | "EUR" | "USD")}
                    >
                      <SelectTrigger className="w-auto min-w-[90px] border-none bg-transparent h-full rounded-none font-bold focus:ring-0 focus:ring-offset-0 shadow-none px-3 text-sm">
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
            <div className="flex items-center h-12 rounded-xl border border-border bg-background shadow-xs transition-all focus-within:ring-4 focus-within:ring-primary/5 focus-within:border-primary/50 overflow-hidden">
              <div className="relative flex-1 flex items-center px-4 min-w-0">
                <label 
                  htmlFor="sell-form-compare-price"
                  className="text-2xs font-bold uppercase tracking-wider text-muted-foreground shrink-0 mr-2"
                >
                  {isBg ? "Стара цена:" : "Old Price:"}
                </label>
                <div className="flex items-center flex-1 min-w-0">
                  <span className="text-muted-foreground font-bold text-sm shrink-0 mr-1">
                    {CURRENCY_SYMBOLS[currency] || currency}
                  </span>
                  <Input
                    id="sell-form-compare-price"
                    type="text"
                    inputMode="decimal"
                    placeholder="0.00"
                    value={compareAtPrice || ""}
                    onChange={(e) => setValue("compareAtPrice", e.target.value)}
                    className="border-none bg-transparent h-auto p-0 text-sm font-bold focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none flex-1 min-w-0"
                  />
                </div>
              </div>
            </div>
            <p className="text-[11px] text-muted-foreground font-medium px-1">
              {isBg 
                ? "Ако продуктът е на промоция, въведете оригиналната цена"
                : "If the item is on sale, enter the original price"}
            </p>
          </div>

          {/* Quantity */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold">
              {isBg ? "Количество" : "Quantity"}
            </Label>
            <QuantityStepper
              value={quantity}
              onChange={(val) => setValue("quantity", val, { shouldValidate: true })}
            />
          </div>

          {/* Accept Offers Toggle */}
          <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-muted/5 shadow-xs ring-1 ring-border/5">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-lg bg-background border border-border flex items-center justify-center shrink-0 shadow-sm">
                <Handshake className="size-5 text-primary" weight="bold" />
              </div>
              <div>
                <span className="text-sm font-bold text-foreground">
                  {isBg ? "Приемане на оферти" : "Accept Offers"}
                </span>
                <p className="text-[11px] text-muted-foreground font-medium leading-tight mt-0.5">
                  {isBg 
                    ? "Позволете на купувачите да предлагат цена"
                    : "Allow buyers to make price offers"}
                </p>
              </div>
            </div>
            <Switch
              checked={acceptOffers}
              onCheckedChange={(checked) => setValue("acceptOffers", checked)}
              className="data-[state=checked]:bg-primary"
            />
          </div>
    </FieldContent>
  );

  return (
    <Field data-invalid={hasError} className={className}>
      {!compact ? (
        <div className="rounded-2xl border border-form-section-border bg-form-section-bg overflow-hidden shadow-xs">
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
export const MemoizedPricingField = memo(PricingField);
