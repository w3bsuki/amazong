"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { Controller } from "react-hook-form";
import { ChevronRight as CaretRight, DollarSign as CurrencyDollar, Gavel, Handshake, Tag } from "lucide-react";

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
import { formatOptions } from "@/lib/sell/schema";
import { clampModesToPolicy, toCategoryPolicy } from "@/lib/sell/category-policy";
import { useSellForm, useSellFormContext } from "../sell-form-provider";
import { SelectDrawer } from "../ui/select-drawer";
import { useTranslations } from "next-intl";
import { findCategoryById } from "./category-helpers";
import { PriceSuggestionCard } from "./pricing/price-suggestion-card";
import { QuantityStepper } from "./pricing/quantity-stepper";
import { CURRENCIES, CURRENCY_SYMBOLS, type PriceSuggestion } from "./pricing/pricing.constants";

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
  const { locale, categories } = useSellFormContext();
  const tSell = useTranslations("Sell")

  const [isCurrencyDrawerOpen, setIsCurrencyDrawerOpen] = useState(false);

  // Watch form values
  const selectedCategoryId = watch("categoryId");
  const pricingMode = watch("pricingMode");
  const format = watch("format");
  const price = watch("price");
  const currency = watch("currency");
  const quantity = watch("quantity");
  const acceptOffers = watch("acceptOffers");
  const compareAtPrice = watch("compareAtPrice");

  const [priceSuggestion] = useState<PriceSuggestion | null>(null);
  const priceInputId = `${idPrefix}-price`;
  const comparePriceInputId = `${idPrefix}-compare-price`;

  const selectedCategory = useMemo(
    () => (selectedCategoryId ? findCategoryById(categories, selectedCategoryId) : null),
    [categories, selectedCategoryId]
  )

  const categoryPolicy = useMemo(
    () =>
      toCategoryPolicy(
        selectedCategory
          ? {
              allowed_listing_kinds: selectedCategory.allowed_listing_kinds,
              allowed_transaction_modes: selectedCategory.allowed_transaction_modes,
              allowed_fulfillment_modes: selectedCategory.allowed_fulfillment_modes,
              allowed_pricing_modes: selectedCategory.allowed_pricing_modes,
              default_fulfillment_mode: selectedCategory.default_fulfillment_mode,
            }
          : null
      ),
    [selectedCategory]
  )

  const allowedPricingModes = categoryPolicy.allowedPricingModes

  useEffect(() => {
    if (!allowedPricingModes.includes(pricingMode)) {
      const constrained = clampModesToPolicy({ pricingMode }, categoryPolicy)
      setValue("pricingMode", constrained.pricingMode, { shouldValidate: true })
      setValue("format", constrained.pricingMode === "auction" ? "auction" : "fixed", { shouldValidate: true })
      return
    }

    const expectedFormat = pricingMode === "auction" ? "auction" : "fixed"
    if (format !== expectedFormat) {
      setValue("format", expectedFormat, { shouldValidate: true })
    }
  }, [allowedPricingModes, categoryPolicy, format, pricingMode, setValue])

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
          const optionPricingMode = option.value === "auction" ? "auction" : "fixed";
          const isDisabled = !allowedPricingModes.includes(optionPricingMode);
          const Icon = option.value === "fixed" ? Tag : Gavel;
          const label = tSell(option.labelKey as never);

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                if (isDisabled) return
                setValue("format", option.value, { shouldValidate: true, shouldDirty: true })
                setValue("pricingMode", optionPricingMode, { shouldValidate: true, shouldDirty: true })
              }}
              disabled={isDisabled}
              className={cn(
                "flex items-center justify-center gap-2 h-12 rounded-md border transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background",
                isSelected
                  ? "border-selected-border bg-selected text-primary font-bold shadow-xs"
                  : "border-border bg-background hover:border-hover-border text-muted-foreground hover:text-foreground",
                isDisabled && "opacity-50 cursor-not-allowed hover:border-border hover:text-muted-foreground"
              )}
            >
              <Icon className="size-5" />
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
                {tSell("steps.pricing.yourPriceLabel")} <span className="text-destructive">*</span>
              </label>
            </div>
            
            <div className={cn(
              "rounded-xl border bg-card overflow-hidden transition-colors",
              "focus-within:ring-2 focus-within:ring-ring focus-within:border-ring",
              fieldState.invalid ? "border-destructive/50 bg-destructive-subtle" : "border-border"
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
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-surface-subtle hover:bg-hover active:bg-active transition-colors"
                    >
                      <span className="text-sm font-bold">{currency}</span>
                      <CaretRight className="size-3.5 text-muted-foreground rotate-90" />
                    </button>
                    <SelectDrawer
                      isOpen={isCurrencyDrawerOpen}
                      onClose={() => setIsCurrencyDrawerOpen(false)}
                      title={tSell("steps.pricing.selectCurrencyTitle")}
                      options={CURRENCIES.map(c => c.value)}
                      optionsBg={CURRENCIES.map(c => c.label)}
                      value={currency}
                      onChange={(val) => setValue("currency", val as "EUR")}
                      locale={locale}
                    />
                  </>
                ) : (
                  <Select
                    value={currency}
                    onValueChange={(val) => setValue("currency", val as "EUR")}
                  >
                    <SelectTrigger
                      size="sm"
                      className="w-auto min-w-24 border-none bg-surface-subtle rounded-xl font-bold focus:ring-0 focus:ring-offset-0 shadow-none px-3 text-sm"
                    >
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
              <FieldError>
                {fieldState.error?.message ? tSell(fieldState.error.message as never) : null}
              </FieldError>
            )}
          </div>
        )}
      />

      {/* Price Suggestions */}
      <PriceSuggestionCard
        suggestion={priceSuggestion}
        currentPrice={price}
        onApply={handleApplyPrice}
      />

      {/* Compare at Price (Optional) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <label htmlFor={comparePriceInputId} className="text-sm font-bold text-foreground flex items-center gap-2">
            {tSell("steps.pricing.compareAtLabel")}
            <span className="text-xs font-medium text-muted-foreground">{tSell("common.optionalParenthetical")}</span>
          </label>
        </div>
        <div className={cn(
          "flex items-center h-14 px-4 rounded-xl border bg-card transition-colors",
          "focus-within:ring-2 focus-within:ring-ring focus-within:border-ring"
        )}>
          <span className="text-base font-bold text-muted-foreground mr-2">
            {CURRENCY_SYMBOLS[currency] || currency}
          </span>
          <Input
            id={comparePriceInputId}
            type="text"
            inputMode="decimal"
            placeholder={tSell("steps.pricing.originalPricePlaceholder")}
            value={compareAtPrice || ""}
            onChange={(e) => setValue("compareAtPrice", e.target.value)}
            className="border-none bg-transparent h-full text-lg font-semibold p-0 focus-visible:ring-0 flex-1"
          />
        </div>
      </div>

      {/* Quantity */}
      <div className="space-y-2">
        <Label className="text-sm font-bold px-1">
          {tSell("steps.pricing.quantityLabel")}
        </Label>
        <QuantityStepper
          value={quantity}
          onChange={(val) => setValue("quantity", val, { shouldValidate: true })}
        />
      </div>

      {/* Accept Offers Toggle - Premium pill design */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => setValue("acceptOffers", !acceptOffers, { shouldDirty: true })}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setValue("acceptOffers", !acceptOffers, { shouldDirty: true }); } }}
        className={cn(
          "w-full flex items-center gap-3.5 p-4 rounded-xl border transition-colors cursor-pointer",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          acceptOffers 
            ? "border-selected-border bg-selected" 
            : "border-border bg-card hover:bg-hover"
        )}
      >
        <div className={cn(
          "size-11 rounded-xl flex items-center justify-center shrink-0 transition-colors",
          acceptOffers 
            ? "bg-selected text-primary" 
            : "bg-muted text-muted-foreground"
        )}>
          <Handshake className="size-5" />
        </div>
        <div className="flex-1 text-left min-w-0">
          <span className="text-base font-semibold block text-foreground">
            {tSell("steps.pricing.acceptOffersTitle")}
          </span>
          <span className="text-sm text-muted-foreground line-clamp-1">
            {tSell("steps.pricing.acceptOffersDescription")}
          </span>
        </div>
        <div onClick={(event) => event.stopPropagation()}>
          <Switch 
            checked={acceptOffers} 
            onCheckedChange={(checked) => setValue("acceptOffers", checked, { shouldDirty: true })}
            className="shrink-0 scale-110"
          />
        </div>
      </div>
    </FieldContent>
  );

  return (
    <Field data-invalid={hasError} className={className}>
      {!compact ? (
        <div className="rounded-md border border-form-section-border bg-form-section-bg overflow-hidden shadow-xs">
          {/* Header */}
          <div className="p-section pb-form border-b border-border-subtle bg-surface-subtle">
            <div className="flex items-center gap-form-sm">
              <div className="flex size-10 items-center justify-center rounded-md bg-form-section-bg border border-form-section-border shadow-xs">
                <CurrencyDollar className="size-5 text-muted-foreground" />
              </div>
              <div>
                <FieldLabel className="text-sm font-bold tracking-tight text-foreground">
                  {tSell("fields.pricing.sectionTitle")}
                </FieldLabel>
                <FieldDescription className="text-sm text-muted-foreground mt-0.5">
                  {tSell("fields.pricing.sectionDescription")}
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
                {tSell("fields.pricing.compactLabel")}
              </FieldLabel>
            </div>
            {content}
          </>
      )}
    </Field>
  );
}


