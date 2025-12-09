"use client";

import { useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import {
  CurrencyDollar,
  Minus,
  Plus,
  Truck,
  Package as PackageIcon,
  MapPin,
} from "@phosphor-icons/react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import type { SellFormDataV4 } from "@/lib/sell-form-schema-v4";

interface StepPricingProps {
  form: UseFormReturn<SellFormDataV4>;
  locale?: string;
  onValidityChange?: (isValid: boolean) => void;
}

// Currency config
const currencies = [
  { value: "BGN", label: "лв.", flag: "🇧🇬" },
  { value: "EUR", label: "€", flag: "🇪🇺" },
  { value: "USD", label: "$", flag: "🇺🇸" },
] as const;

// Compact quantity stepper
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
        className={cn(
          "h-10 w-10 rounded-lg border flex items-center justify-center transition-colors",
          value <= min
            ? "bg-muted text-muted-foreground cursor-not-allowed"
            : "hover:bg-muted active:bg-muted/70"
        )}
      >
        <Minus className="size-4" />
      </button>
      <Input
        type="number"
        value={value}
        onChange={(e) => {
          const num = parseInt(e.target.value) || min;
          onChange(Math.min(max, Math.max(min, num)));
        }}
        className="h-10 w-16 text-center rounded-lg tabular-nums font-medium text-sm"
        min={min}
        max={max}
      />
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        className={cn(
          "h-10 w-10 rounded-lg border flex items-center justify-center transition-colors",
          value >= max
            ? "bg-muted text-muted-foreground cursor-not-allowed"
            : "hover:bg-muted active:bg-muted/70"
        )}
      >
        <Plus className="size-4" />
      </button>
    </div>
  );
}

export function StepPricing({
  form,
  locale = "en",
  onValidityChange,
}: StepPricingProps) {
  const isBg = locale === "bg";

  const price = form.watch("price") || "";
  const currency = form.watch("currency") || "BGN";
  const quantity = form.watch("quantity") || 1;
  const acceptOffers = form.watch("acceptOffers") || false;
  const shippingPrice = form.watch("shippingPrice") || "";
  const shipsToBulgaria = form.watch("shipsToBulgaria") ?? true;
  const shipsToEurope = form.watch("shipsToEurope") || false;
  const pickupOnly = form.watch("pickupOnly") || false;

  // Check validity
  const priceNum = parseFloat(price);
  const isValid = !isNaN(priceNum) && priceNum > 0;

  // Notify parent
  useEffect(() => {
    onValidityChange?.(isValid);
  }, [isValid, onValidityChange]);

  const currencyInfo = currencies.find(c => c.value === currency) || currencies[0];

  return (
    <div className="flex flex-col gap-5 pb-24">
      {/* Price */}
      <section className="space-y-2">
        <Label className="text-sm font-semibold flex items-center gap-1.5">
          <CurrencyDollar className="size-4 text-primary" weight="fill" />
          {isBg ? "Цена" : "Price"}
          <span className="text-destructive">*</span>
        </Label>

        {/* Currency selector - compact chips */}
        <div className="flex gap-1.5">
          {currencies.map((curr) => (
            <button
              key={curr.value}
              type="button"
              onClick={() => form.setValue("currency", curr.value)}
              className={cn(
                "h-9 px-3 rounded-full border text-sm font-medium transition-all flex items-center gap-1",
                currency === curr.value
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border hover:border-primary/50"
              )}
            >
              <span>{curr.flag}</span>
              <span>{curr.label}</span>
            </button>
          ))}
        </div>

        {/* Price input */}
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-medium">
            {currencyInfo.label}
          </span>
          <Input
            type="number"
            value={price}
            onChange={(e) => form.setValue("price", e.target.value, { shouldValidate: true })}
            placeholder="0.00"
            className="h-12 text-lg font-semibold pl-10 pr-4 rounded-lg"
            step="0.01"
            min="0"
          />
        </div>

        {/* Accept offers - shadcn Switch */}
        <label className="flex items-center justify-between py-2 cursor-pointer">
          <div>
            <p className="text-sm font-medium">{isBg ? "Приемам оферти" : "Accept offers"}</p>
            <p className="text-xs text-muted-foreground">
              {isBg ? "Купувачите могат да предлагат цена" : "Let buyers make offers"}
            </p>
          </div>
          <Switch
            checked={acceptOffers}
            onCheckedChange={(checked) => form.setValue("acceptOffers", checked)}
          />
        </label>
      </section>

      {/* Quantity */}
      <section className="space-y-2">
        <Label className="text-sm font-semibold flex items-center gap-1.5">
          <PackageIcon className="size-4 text-primary" weight="fill" />
          {isBg ? "Количество" : "Quantity"}
        </Label>
        <QuantityStepper
          value={quantity}
          onChange={(val) => form.setValue("quantity", val)}
        />
      </section>

      {/* Shipping */}
      <section className="space-y-3">
        <Label className="text-sm font-semibold flex items-center gap-1.5">
          <Truck className="size-4 text-primary" weight="fill" />
          {isBg ? "Доставка" : "Shipping"}
        </Label>

        {/* Shipping price */}
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">
            {isBg ? "Цена за доставка" : "Shipping price"}
          </Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
              {currencyInfo.label}
            </span>
            <Input
              type="number"
              value={shippingPrice}
              onChange={(e) => form.setValue("shippingPrice", e.target.value)}
              placeholder={isBg ? "0 = безплатна" : "0 = free"}
              className="h-10 pl-10 rounded-lg"
              step="0.01"
              min="0"
            />
          </div>
        </div>

        {/* Ships to - using shadcn Checkbox */}
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">
            {isBg ? "Доставка до" : "Ships to"}
          </Label>
          <div className="flex flex-wrap gap-2">
            <label className="flex items-center gap-2 h-9 px-3 rounded-full border cursor-pointer hover:bg-muted/50 transition-colors">
              <Checkbox
                checked={shipsToBulgaria}
                onCheckedChange={(checked) => form.setValue("shipsToBulgaria", !!checked)}
                className="size-4"
              />
              <span>🇧🇬</span>
              <span className="text-sm">{isBg ? "България" : "Bulgaria"}</span>
            </label>

            <label className="flex items-center gap-2 h-9 px-3 rounded-full border cursor-pointer hover:bg-muted/50 transition-colors">
              <Checkbox
                checked={shipsToEurope}
                onCheckedChange={(checked) => form.setValue("shipsToEurope", !!checked)}
                className="size-4"
              />
              <span>🇪🇺</span>
              <span className="text-sm">{isBg ? "Европа" : "Europe"}</span>
            </label>

            <label className="flex items-center gap-2 h-9 px-3 rounded-full border cursor-pointer hover:bg-muted/50 transition-colors">
              <Checkbox
                checked={pickupOnly}
                onCheckedChange={(checked) => form.setValue("pickupOnly", !!checked)}
                className="size-4"
              />
              <MapPin className="size-4 text-muted-foreground" />
              <span className="text-sm">{isBg ? "Лично" : "Pickup"}</span>
            </label>
          </div>
        </div>
      </section>
    </div>
  );
}
