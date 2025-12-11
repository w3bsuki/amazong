"use client";

import { UseFormReturn } from "react-hook-form";
import {
  Truck,
  MapPin,
  Globe,
  GlobeHemisphereEast,
  House,
  Check,
  Info,
  Calculator,
} from "@phosphor-icons/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
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
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        "relative flex items-start gap-3 p-4 rounded-lg border-2 text-left transition-colors w-full",
        isSelected
          ? "border-primary bg-primary/5"
          : "border-border hover:border-primary/30"
      )}
    >
      {/* Checkbox indicator */}
      <div className={cn(
        "h-5 w-5 rounded-md border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors",
        isSelected
          ? "bg-primary border-primary"
          : "border-muted-foreground/30"
      )}>
        {isSelected && <Check className="h-3 w-3 text-white" weight="bold" />}
      </div>

      {/* Icon */}
      <div className={cn(
        "h-10 w-10 rounded-lg flex items-center justify-center shrink-0",
        isSelected ? "bg-primary/20" : "bg-muted"
      )}>
        <Icon className={cn(
          "h-5 w-5",
          isSelected ? "text-primary" : "text-muted-foreground"
        )} weight="duotone" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <span className={cn(
            "font-semibold text-sm",
            isSelected ? "text-primary" : "text-foreground"
          )}>
            {isBg ? region.labelBg : region.label}
          </span>
          <span className="text-xs text-muted-foreground">
            {isBg ? region.deliveryTimeBg : region.deliveryTime}
          </span>
        </div>
        <p className="text-xs text-muted-foreground mt-0.5">
          {isBg ? region.descriptionBg : region.description}
        </p>
        {region.carriers.length > 0 && isSelected && (
          <div className="flex flex-wrap gap-1 mt-2">
            {region.carriers.map((carrier) => (
              <span
                key={carrier}
                className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground"
              >
                {carrier}
              </span>
            ))}
          </div>
        )}
      </div>
    </button>
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
        <Label className="text-sm font-medium">
          {isBg ? "Размери на пратката" : "Package dimensions"}
          <span className="text-muted-foreground font-normal ml-1">({isBg ? "по избор" : "optional"})</span>
        </Label>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-7 text-xs gap-1.5"
        >
          <Calculator className="h-3.5 w-3.5" />
          {isBg ? "Калкулатор" : "Calculate"}
        </Button>
      </div>

      <div className="grid grid-cols-4 gap-3">
        <div>
          <label className="block text-xs text-muted-foreground mb-1">
            {isBg ? "Дължина" : "Length"}
          </label>
          <div className="relative">
            <Input
              type="number"
              value={dimensions?.lengthCm ?? ""}
              onChange={(e) => handleChange("lengthCm", e.target.value)}
              placeholder="0"
              className="pr-8 h-10 rounded-lg"
              min={0}
              step={0.1}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
              cm
            </span>
          </div>
        </div>

        <div>
          <label className="block text-xs text-muted-foreground mb-1">
            {isBg ? "Ширина" : "Width"}
          </label>
          <div className="relative">
            <Input
              type="number"
              value={dimensions?.widthCm ?? ""}
              onChange={(e) => handleChange("widthCm", e.target.value)}
              placeholder="0"
              className="pr-8 h-10 rounded-lg"
              min={0}
              step={0.1}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
              cm
            </span>
          </div>
        </div>

        <div>
          <label className="block text-xs text-muted-foreground mb-1">
            {isBg ? "Височина" : "Height"}
          </label>
          <div className="relative">
            <Input
              type="number"
              value={dimensions?.heightCm ?? ""}
              onChange={(e) => handleChange("heightCm", e.target.value)}
              placeholder="0"
              className="pr-8 h-10 rounded-lg"
              min={0}
              step={0.1}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
              cm
            </span>
          </div>
        </div>

        <div>
          <label className="block text-xs text-muted-foreground mb-1">
            {isBg ? "Тегло" : "Weight"}
          </label>
          <div className="relative">
            <Input
              type="number"
              value={dimensions?.weightKg ?? ""}
              onChange={(e) => handleChange("weightKg", e.target.value)}
              placeholder="0"
              className="pr-8 h-10 rounded-lg"
              min={0}
              step={0.01}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
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
    <section className="rounded-lg border border-border bg-card">
      <div className="pb-3 pt-5 px-5">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-orange-500/10">
              <Truck className="size-5 text-orange-600" weight="duotone" />
            </div>
            <div>
              <h3 className="text-base font-semibold">
                {isBg ? "Доставка" : "Shipping"}
              </h3>
              <p className="text-sm text-muted-foreground">
                {isBg ? "Изберете къде доставяте" : "Choose where you'll ship to"}
              </p>
            </div>
          </div>
          {!hasShipping && (
            <Badge variant="outline" className="text-xs font-medium text-destructive border-destructive/30">
              {isBg ? "Задължително" : "Required"}
            </Badge>
          )}
        </div>
      </div>

      <div className="space-y-6 px-5 pb-6 pt-0">
        {/* Shipping Regions */}
        <div className="space-y-3">
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
          <div className="pt-4 border-t border-border">
            {/* Free Shipping Toggle */}
            <button
              type="button"
              onClick={() => form.setValue("freeShipping", !freeShipping, { shouldValidate: true })}
              className={cn(
                "w-full flex items-center gap-3 p-3 rounded-lg border-2 transition-colors mb-4",
                freeShipping
                  ? "border-green-500 bg-green-500/10"
                  : "border-border hover:border-green-500/30"
              )}
            >
              <div className={cn(
                "h-5 w-5 rounded-md border-2 flex items-center justify-center shrink-0",
                freeShipping ? "bg-green-500 border-green-500" : "border-muted-foreground/30"
              )}>
                {freeShipping && <Check className="h-3 w-3 text-white" weight="bold" />}
              </div>
              <div className="flex-1 text-left">
                <span className={cn(
                  "font-medium text-sm",
                  freeShipping ? "text-green-600" : "text-foreground"
                )}>
                  {isBg ? "Безплатна доставка" : "Free shipping"}
                </span>
                <p className="text-xs text-muted-foreground">
                  {isBg ? "Увеличава продажбите с до 20%" : "Increases sales by up to 20%"}
                </p>
              </div>
            </button>

            {/* Shipping Price Input */}
            {!freeShipping && (
              <div>
                <Label className="text-sm font-medium mb-1.5 block">
                  {isBg ? "Цена за доставка" : "Shipping price"}
                </Label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
                    лв
                  </span>
                  <Input
                    value={shippingPrice}
                    onChange={(e) => form.setValue("shippingPrice", e.target.value, { shouldValidate: true })}
                    placeholder="0.00"
                    type="text"
                    inputMode="decimal"
                    className="pl-10 h-11 rounded-lg"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Processing Time */}
        <div>
          <Label className="text-sm font-medium mb-1.5 block">
            {isBg ? "Време за обработка" : "Processing time"}
          </Label>
          <div className="flex gap-2">
            {[1, 2, 3, 5, 7].map((days) => (
              <button
                key={days}
                type="button"
                onClick={() => form.setValue("processingDays", days, { shouldValidate: true })}
                className={cn(
                  "flex-1 py-2 px-3 rounded-lg border-2 text-sm font-medium transition-colors",
                  processingDays === days
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-border hover:border-primary/30 text-foreground"
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
        <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/50 border border-border">
          <Info className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground">
            {isBg 
              ? "Препоръчваме да използвате Speedy или Econt за доставки в България - най-ниски цени и бърза доставка."
              : "We recommend Speedy or Econt for Bulgaria deliveries - lowest prices and fast delivery."}
          </p>
        </div>
      </div>
    </section>
  );
}
