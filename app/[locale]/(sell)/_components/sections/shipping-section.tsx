"use client";

import { UseFormReturn } from "react-hook-form";
import {
  Truck,
  MapPin,
  Globe,
  GlobeHemisphereEast,
  House,
  Info,
  Calculator,
  Check,
} from "@phosphor-icons/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import type { SellFormDataV4 } from "@/lib/sell-form-schema-v4";

interface ShippingSectionProps {
  form: UseFormReturn<SellFormDataV4>;
  locale?: string;
}

// Shipping regions with Bulgarian context - Updated December 2025 with UK and USA
const SHIPPING_REGIONS = [
  {
    id: "bulgaria",
    field: "shipsToBulgaria" as const,
    label: "Bulgaria",
    labelBg: "България",
    description: "Ship within Bulgaria",
    descriptionBg: "Доставка в България",
    icon: House,
    deliveryTime: "1-3 days",
    deliveryTimeBg: "1-3 дни",
    carriers: ["Speedy", "Econt", "Bulgarian Posts"],
  },
  {
    id: "uk",
    field: "shipsToUK" as const,
    label: "United Kingdom",
    labelBg: "Великобритания",
    description: "Ship to UK",
    descriptionBg: "Доставка до Великобритания",
    icon: GlobeHemisphereEast,
    deliveryTime: "5-12 days",
    deliveryTimeBg: "5-12 дни",
    carriers: ["Royal Mail", "DPD UK", "Parcelforce"],
  },
  {
    id: "europe",
    field: "shipsToEurope" as const,
    label: "Europe",
    labelBg: "Европа",
    description: "Ship to EU countries",
    descriptionBg: "Доставка в ЕС",
    icon: GlobeHemisphereEast,
    deliveryTime: "5-10 days",
    deliveryTimeBg: "5-10 дни",
    carriers: ["DHL", "DPD", "GLS"],
  },
  {
    id: "usa",
    field: "shipsToUSA" as const,
    label: "USA",
    labelBg: "САЩ",
    description: "Ship to United States",
    descriptionBg: "Доставка до САЩ",
    icon: Globe,
    deliveryTime: "10-20 days",
    deliveryTimeBg: "10-20 дни",
    carriers: ["USPS", "UPS", "FedEx"],
  },
  {
    id: "worldwide",
    field: "shipsToWorldwide" as const,
    label: "Worldwide",
    labelBg: "По света",
    description: "International shipping",
    descriptionBg: "Международна доставка",
    icon: Globe,
    deliveryTime: "10-21 days",
    deliveryTimeBg: "10-21 дни",
    carriers: ["DHL Express", "FedEx", "EMS"],
  },
  {
    id: "pickup",
    field: "pickupOnly" as const,
    label: "Local Pickup",
    labelBg: "Лично вземане",
    description: "Buyer picks up",
    descriptionBg: "Купувачът взема лично",
    icon: MapPin,
    deliveryTime: "Arranged",
    deliveryTimeBg: "По договаряне",
    carriers: [],
  },
];

// ============================================================================
// Shipping Region Card
// ============================================================================
function ShippingRegionCard({
  region,
  isSelected,
  onToggle,
  locale,
}: {
  region: typeof SHIPPING_REGIONS[0];
  isSelected: boolean;
  onToggle: () => void;
  locale: string;
}) {
  const Icon = region.icon;
  const isBg = locale === "bg";

  return (
    <label
      className={cn(
        "relative flex items-start gap-3.5 p-4 rounded-xl border text-left transition-all w-full cursor-pointer shadow-xs",
        isSelected
          ? "border-primary bg-primary/5 ring-1 ring-primary/20"
          : "border-border bg-background hover:border-primary/30"
      )}
    >
      {/* Icon */}
      <div className={cn(
        "size-10 rounded-lg flex items-center justify-center shrink-0 border",
        isSelected ? "bg-primary/10 border-primary/20" : "bg-muted/30 border-border/50"
      )}>
        <Icon className={cn(
          "size-5",
          isSelected ? "text-primary" : "text-muted-foreground"
        )} weight="bold" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <span className={cn(
            "font-bold text-sm tracking-tight",
            isSelected ? "text-primary" : "text-foreground"
          )}>
            {isBg ? region.labelBg : region.label}
          </span>
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">
            {isBg ? region.deliveryTimeBg : region.deliveryTime}
          </span>
        </div>
        <p className="text-[11px] font-medium text-muted-foreground/70 mt-0.5">
          {isBg ? region.descriptionBg : region.description}
        </p>
        {region.carriers.length > 0 && isSelected && (
          <div className="flex flex-wrap gap-1.5 mt-2.5">
            {region.carriers.map((carrier) => (
              <span
                key={carrier}
                className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-muted/50 border border-border/50 text-muted-foreground/80"
              >
                {carrier}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Checkbox indicator */}
      <Checkbox
        checked={isSelected}
        onCheckedChange={() => onToggle()}
        className="size-5 rounded-md"
        aria-label={isBg ? region.labelBg : region.label}
      />
    </label>
  );
}

// ============================================================================
// Dimensions Input (Metric)
// ============================================================================
function DimensionsInput({
  dimensions,
  onChange,
  locale,
}: {
  dimensions: { lengthCm?: number; widthCm?: number; heightCm?: number; weightKg?: number } | undefined;
  onChange: (dims: { lengthCm?: number; widthCm?: number; heightCm?: number; weightKg?: number }) => void;
  locale: string;
}) {
  const isBg = locale === "bg";

  const handleChange = (field: string, value: string) => {
    const num = value === "" ? undefined : parseFloat(value);
    onChange({
      ...dimensions,
      [field]: num,
    });
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80">
          {isBg ? "Размери на пратката" : "Package dimensions"}
          <span className="text-muted-foreground/60 font-medium ml-1">({isBg ? "по избор" : "optional"})</span>
        </Label>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-7 text-[10px] font-bold uppercase tracking-wider gap-1.5 hover:bg-muted/50"
        >
          <Calculator className="size-3.5" weight="bold" />
          {isBg ? "Калкулатор" : "Calculate"}
        </Button>
      </div>

      <div className="grid grid-cols-4 gap-2.5">
        <div className="space-y-1.5">
          <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">
            {isBg ? "Дължина" : "Length"}
          </label>
          <div className="relative group">
            <Input
              type="number"
              value={dimensions?.lengthCm ?? ""}
              onChange={(e) => handleChange("lengthCm", e.target.value)}
              placeholder="0"
              className="pr-8 h-10 rounded-md text-sm font-bold bg-muted/5 border-border/60 focus:bg-background transition-all"
              min={0}
              step={0.1}
            />
            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-muted-foreground/50">
              cm
            </span>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">
            {isBg ? "Ширина" : "Width"}
          </label>
          <div className="relative group">
            <Input
              type="number"
              value={dimensions?.widthCm ?? ""}
              onChange={(e) => handleChange("widthCm", e.target.value)}
              placeholder="0"
              className="pr-8 h-10 rounded-md text-sm font-bold bg-muted/5 border-border/60 focus:bg-background transition-all"
              min={0}
              step={0.1}
            />
            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-muted-foreground/50">
              cm
            </span>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">
            {isBg ? "Височина" : "Height"}
          </label>
          <div className="relative group">
            <Input
              type="number"
              value={dimensions?.heightCm ?? ""}
              onChange={(e) => handleChange("heightCm", e.target.value)}
              placeholder="0"
              className="pr-8 h-10 rounded-md text-sm font-bold bg-muted/5 border-border/60 focus:bg-background transition-all"
              min={0}
              step={0.1}
            />
            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-muted-foreground/50">
              cm
            </span>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">
            {isBg ? "Тегло" : "Weight"}
          </label>
          <div className="relative group">
            <Input
              type="number"
              value={dimensions?.weightKg ?? ""}
              onChange={(e) => handleChange("weightKg", e.target.value)}
              placeholder="0"
              className="pr-8 h-10 rounded-md text-sm font-bold bg-muted/5 border-border/60 focus:bg-background transition-all"
              min={0}
              step={0.01}
            />
            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-muted-foreground/50">
              kg
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Main Shipping Section
// ============================================================================
export function ShippingSection({
  form,
  locale = "en",
}: ShippingSectionProps) {
  const shipsToBulgaria = form.watch("shipsToBulgaria");
  const shipsToEurope = form.watch("shipsToEurope");
  const shipsToWorldwide = form.watch("shipsToWorldwide");
  const pickupOnly = form.watch("pickupOnly");
  const freeShipping = form.watch("freeShipping");
  const shippingPrice = form.watch("shippingPrice");
  const dimensions = form.watch("dimensions");
  const processingDays = form.watch("processingDays");

  const isBg = locale === "bg";

  // Check if any shipping option is selected
  const hasShipping = shipsToBulgaria || shipsToEurope || shipsToWorldwide || pickupOnly;

  // Get selection state for each region
  const getSelectionState = (field: typeof SHIPPING_REGIONS[0]["field"]) => {
    switch (field) {
      case "shipsToBulgaria": return shipsToBulgaria;
      case "shipsToEurope": return shipsToEurope;
      case "shipsToWorldwide": return shipsToWorldwide;
      case "pickupOnly": return pickupOnly;
      default: return false;
    }
  };

  // Toggle region
  const toggleRegion = (field: typeof SHIPPING_REGIONS[0]["field"]) => {
    const current = getSelectionState(field);
    form.setValue(field, !current, { shouldValidate: true });
  };

  return (
    <section className="rounded-xl border border-border bg-background overflow-hidden shadow-xs">
      <div className="p-5 pb-4 border-b border-border/50 bg-muted/10">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3.5">
            <div className="flex size-10 items-center justify-center rounded-md bg-background border border-border shadow-xs">
              <Truck className="size-5 text-muted-foreground" weight="bold" />
            </div>
            <div>
              <h3 className="text-sm font-bold tracking-tight text-foreground">
                {isBg ? "Доставка" : "Shipping"}
              </h3>
              <p className="text-xs font-medium text-muted-foreground">
                {isBg ? "Изберете къде доставяте" : "Choose where you'll ship to"}
              </p>
            </div>
          </div>
          {!hasShipping && (
            <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-wider text-destructive border-destructive/30 bg-destructive/5">
              {isBg ? "Задължително" : "Required"}
            </Badge>
          )}
        </div>
      </div>

      <div className="space-y-6 p-6">
        {/* Shipping Regions */}
        <div className="space-y-2.5">
          {SHIPPING_REGIONS.map((region) => (
            <ShippingRegionCard
              key={region.id}
              region={region}
              isSelected={getSelectionState(region.field)}
              onToggle={() => toggleRegion(region.field)}
              locale={locale}
            />
          ))}
        </div>

        {/* Shipping Cost */}
        {(shipsToBulgaria || shipsToEurope || shipsToWorldwide) && (
          <div className="pt-6 border-t border-border/50 space-y-5">
            {/* Free Shipping Toggle */}
            <label
              className={cn(
                "w-full flex items-center gap-3.5 p-4 rounded-xl border transition-all cursor-pointer shadow-xs",
                freeShipping
                  ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                  : "border-border bg-background hover:border-primary/30"
              )}
            >
              <div className={cn(
                "size-10 rounded-lg flex items-center justify-center shrink-0 border",
                freeShipping ? "bg-primary/10 border-primary/20" : "bg-muted/30 border-border/50"
              )}>
                <Check className={cn(
                  "size-5",
                  freeShipping ? "text-primary" : "text-muted-foreground"
                )} weight="bold" />
              </div>
              <div className="flex-1 text-left">
                <div className={cn(
                  "font-bold text-sm tracking-tight",
                  freeShipping ? "text-primary" : "text-foreground"
                )}>
                  {isBg ? "Безплатна доставка" : "Free shipping"}
                </div>
                <div className="text-[11px] font-medium text-muted-foreground/70">
                  {isBg ? "Увеличава продажбите с до 20%" : "Increases sales by up to 20%"}
                </div>
              </div>
              <Checkbox
                checked={freeShipping ?? false}
                onCheckedChange={(checked) => form.setValue("freeShipping", !!checked, { shouldValidate: true })}
                className="size-5 rounded-md"
                aria-label={isBg ? "Безплатна доставка" : "Free shipping"}
              />
            </label>

            {/* Shipping Price Input */}
            {!freeShipping && (
              <div className="space-y-2">
                <Label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80 block">
                  {isBg ? "Цена за доставка" : "Shipping price"}
                </Label>
                <div className="relative group">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground font-bold text-sm transition-colors group-focus-within:text-primary">
                    лв
                  </span>
                  <Input
                    value={shippingPrice}
                    onChange={(e) => form.setValue("shippingPrice", e.target.value, { shouldValidate: true })}
                    placeholder="0.00"
                    type="text"
                    inputMode="decimal"
                    className="pl-9 h-11 rounded-md text-base font-bold bg-muted/5 border-border/60 focus:bg-background transition-all"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Processing Time */}
        <div className="space-y-3">
          <Label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80 block">
            {isBg ? "Време за обработка" : "Processing time"}
          </Label>
          <div className="grid grid-cols-5 gap-2">
            {[1, 2, 3, 5, 7].map((days) => (
              <button
                key={days}
                type="button"
                onClick={() => form.setValue("processingDays", days, { shouldValidate: true })}
                className={cn(
                  "py-2.5 px-3 rounded-lg border text-xs font-bold transition-all shadow-xs",
                  processingDays === days
                    ? "border-primary bg-primary/5 text-primary ring-1 ring-primary/20"
                    : "border-border bg-background hover:border-primary/30 text-muted-foreground"
                )}
              >
                {days} {isBg ? (days === 1 ? "ден" : "дни") : (days === 1 ? "day" : "days")}
              </button>
            ))}
          </div>
        </div>

        {/* Package Dimensions */}
        <DimensionsInput
          dimensions={dimensions}
          onChange={(dims) => form.setValue("dimensions", dims, { shouldValidate: true })}
          locale={locale}
        />

        {/* Info */}
        <div className="flex items-start gap-3 p-4 rounded-xl bg-muted/5 border border-border/50 shadow-xs">
          <div className="size-8 rounded-md bg-background border border-border flex items-center justify-center shrink-0">
            <Info className="size-4 text-muted-foreground" weight="bold" />
          </div>
          <p className="text-xs font-medium text-muted-foreground leading-relaxed">
            {isBg 
              ? "Препоръчваме да използвате Speedy или Econt за доставки в България - най-ниски цени и бърза доставка."
              : "We recommend Speedy or Econt for Bulgaria deliveries - lowest prices and fast delivery."}
          </p>
        </div>
      </div>
    </section>
  );
}
