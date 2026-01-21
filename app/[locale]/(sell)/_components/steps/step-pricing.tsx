"use client";

import { useState, useCallback } from "react";
import { Controller } from "react-hook-form";
import {
  Tag,
  Gavel,
  Minus,
  Plus,
  Handshake,
  CaretRight,
  Check,
} from "@phosphor-icons/react";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { formatOptions } from "@/lib/sell/schema-v4";
import { useSellForm, useSellFormContext } from "../sell-form-provider";

// ============================================================================
// STEP 4: PRICING - Clean iOS-style form
// Format + Price + Currency + Quantity + Offers
// ============================================================================

// V1: BGN only for cash on delivery in Bulgaria
const CURRENCIES = [
  { value: "BGN", label: "лв", labelFull: "BGN (лв)" },
  { value: "EUR", label: "€", labelFull: "EUR (€)" },
] as const;

// ============================================================================
// Reusable Components - standardized h-14 touch targets
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
    <div className="flex items-center h-14 w-fit rounded-xl border border-border bg-card overflow-hidden">
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        className="h-full px-5 flex items-center justify-center hover:bg-hover active:bg-active disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        aria-label="Decrease quantity"
      >
        <Minus className="size-5" weight="bold" />
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
        className="w-16 h-full text-center text-lg font-bold border-none bg-transparent focus-visible:ring-0 shadow-none"
        min={min}
        max={max}
      />
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        className="h-full px-5 flex items-center justify-center hover:bg-hover active:bg-active disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        aria-label="Increase quantity"
      >
        <Plus className="size-5" weight="bold" />
      </button>
    </div>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export function StepPricing() {
  const { control, setValue, watch, formState: { errors } } = useSellForm();
  const { isBg } = useSellFormContext();

  const [currencyDrawerOpen, setCurrencyDrawerOpen] = useState(false);

  // Watch values
  const format = watch("format");
  const price = watch("price");
  const currency = watch("currency");
  const compareAtPrice = watch("compareAtPrice");
  const quantity = watch("quantity");
  const acceptOffers = watch("acceptOffers");

  const currencySymbol = CURRENCIES.find(c => c.value === currency)?.label || currency;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          {isBg ? "Цена и доставка" : "Price & shipping"}
        </h2>
        <p className="text-reading text-muted-foreground">
          {isBg 
            ? "Задайте цена и изберете опции за доставка" 
            : "Set your price and choose shipping options"}
        </p>
      </div>

      {/* Format Selection - iOS segmented style */}
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
                "flex items-center justify-center gap-2 h-14 rounded-xl border transition-all",
                "active:opacity-90",
                isSelected
                  ? "bg-selected border-selected-border text-foreground font-bold"
                  : "border-border bg-card hover:bg-hover text-muted-foreground"
              )}
            >
              <Icon className="size-5" weight={isSelected ? "fill" : "regular"} />
              <span className="text-reading">{label}</span>
            </button>
          );
        })}
      </div>

      {/* Price Input - iOS card style */}
      <Controller
        name="price"
        control={control}
        render={({ field, fieldState }) => (
          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <span className="text-tiny font-semibold uppercase tracking-wide text-muted-foreground">
                {isBg ? "Вашата цена" : "Your price"} <span className="text-destructive">*</span>
              </span>
            </div>
            <div className={cn(
              "bg-card rounded-xl border overflow-hidden transition-all",
              "focus-within:border-selected-border focus-within:ring-2 focus-within:ring-focus-ring",
              fieldState.invalid ? "border-destructive/50 bg-destructive/5" : "border-border"
            )}>
              <div className="flex items-center h-16 px-4">
                <span className="text-2xl font-bold text-muted-foreground mr-2">
                  {currencySymbol}
                </span>
                <Input
                  {...field}
                  type="text"
                  inputMode="decimal"
                  placeholder="0.00"
                  className="border-none bg-transparent h-full text-3xl font-bold p-0 focus-visible:ring-0 flex-1"
                />
                <button
                  type="button"
                  onClick={() => setCurrencyDrawerOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-muted/60 hover:bg-muted transition-colors active:opacity-90"
                >
                  <span className="text-sm font-bold">{currency}</span>
                  <CaretRight className="size-3.5 text-muted-foreground rotate-90" weight="bold" />
                </button>
              </div>
            </div>
            {fieldState.invalid && fieldState.error && (
              <p className="text-sm text-destructive px-1">{fieldState.error.message}</p>
            )}
          </div>
        )}
      />

      {/* Compare at Price - iOS grouped list item */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <span className="text-tiny font-semibold uppercase tracking-wide text-muted-foreground">
            {isBg ? "Стара цена" : "Compare at price"}
            <span className="ml-1 font-normal opacity-60">{isBg ? "(по избор)" : "(optional)"}</span>
          </span>
        </div>
        <div className={cn(
          "bg-card rounded-xl border border-border overflow-hidden transition-all",
          "focus-within:border-selected-border focus-within:ring-2 focus-within:ring-focus-ring"
        )}>
          <div className="flex items-center h-14 px-4">
            <span className="text-lg font-bold text-muted-foreground mr-2">
              {currencySymbol}
            </span>
            <Input
              type="text"
              inputMode="decimal"
              placeholder={isBg ? "Оригинална цена" : "Original price"}
              value={compareAtPrice || ""}
              onChange={(e) => setValue("compareAtPrice", e.target.value)}
              className="border-none bg-transparent h-full text-lg font-semibold p-0 focus-visible:ring-0 flex-1"
            />
          </div>
        </div>
      </div>

      {/* Quantity */}
      <div className="space-y-2">
        <span className="text-tiny font-semibold uppercase tracking-wide text-muted-foreground px-1">
          {isBg ? "Количество" : "Quantity"}
        </span>
        <QuantityStepper
          value={quantity}
          onChange={(val) => setValue("quantity", val, { shouldValidate: true })}
        />
      </div>

      {/* Accept Offers Toggle - iOS list row style */}
      <button
        type="button"
        onClick={() => setValue("acceptOffers", !acceptOffers)}
        className={cn(
          "w-full flex items-center gap-3.5 py-3.5 min-h-touch-lg px-4 rounded-xl border transition-all",
          "active:opacity-90",
          acceptOffers 
            ? "bg-selected border-selected-border" 
            : "bg-card border-border hover:bg-hover"
        )}
      >
        <div className={cn(
          "size-11 rounded-xl flex items-center justify-center shrink-0 transition-all",
          acceptOffers 
            ? "bg-checked text-checked-foreground" 
            : "bg-muted text-muted-foreground"
        )}>
          <Handshake className="size-5" weight={acceptOffers ? "fill" : "regular"} />
        </div>
        <div className="flex-1 text-left min-w-0">
          <span className="text-reading font-semibold text-foreground block">
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
          className="shrink-0"
        />
      </button>

      {/* Currency Drawer */}
      <Drawer open={currencyDrawerOpen} onOpenChange={setCurrencyDrawerOpen}>
        <DrawerContent className="max-h-dialog flex flex-col">
          <DrawerHeader className="border-b border-border pb-4">
            <DrawerTitle className="text-lg font-bold">
              {isBg ? "Изберете валута" : "Select currency"}
            </DrawerTitle>
          </DrawerHeader>
          <ScrollArea className="flex-1 min-h-0">
            <div className="p-4 space-y-1.5">
              {CURRENCIES.map((curr) => {
                const isSelected = currency === curr.value;
                return (
                  <button
                    key={curr.value}
                    type="button"
                    onClick={() => {
                      setValue("currency", curr.value as "BGN" | "EUR" | "USD");
                      setCurrencyDrawerOpen(false);
                    }}
                    className={cn(
                      "w-full flex items-center justify-between h-14 px-4 rounded-xl transition-all",
                      "active:opacity-90",
                      isSelected
                        ? "bg-selected border border-selected-border"
                        : "bg-muted/40 hover:bg-muted/60"
                    )}
                  >
                    <span className={cn(
                      "text-reading",
                      isSelected ? "font-bold text-foreground" : "font-medium text-foreground"
                    )}>
                      {curr.labelFull}
                    </span>
                    {isSelected && (
                      <div className="size-6 rounded-full bg-checked flex items-center justify-center">
                        <Check className="size-3.5 text-checked-foreground" weight="bold" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </ScrollArea>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
