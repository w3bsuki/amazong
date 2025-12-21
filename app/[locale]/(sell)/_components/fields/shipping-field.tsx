"use client";

import { memo } from "react";
import {
  Truck,
  MapPin,
  Globe,
  GlobeHemisphereEast,
  House,
  Package,
} from "@phosphor-icons/react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
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
import { useSellForm, useSellFormContext } from "../sell-form-provider";
import { BULGARIAN_CITIES } from "@/lib/bulgarian-cities";

// ============================================================================
// Shipping Regions Configuration
// ============================================================================
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
    carriers: ["Royal Mail", "DPD UK"],
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
    carriers: ["DHL Express", "FedEx"],
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
] as const;

// ============================================================================
// Shipping Region Card Component
// ============================================================================
function ShippingRegionCard({
  region,
  isSelected,
  onToggle,
  isBg,
}: {
  region: typeof SHIPPING_REGIONS[number];
  isSelected: boolean;
  onToggle: () => void;
  isBg: boolean;
}) {
  const Icon = region.icon;

  return (
    <label
      className={cn(
        "relative flex items-start gap-3 p-3 rounded-xl border text-left transition-all w-full cursor-pointer",
        isSelected
          ? "border-primary bg-primary/5 shadow-xs"
          : "border-border bg-background hover:border-primary/30"
      )}
    >
      {/* Icon */}
      <div className={cn(
        "size-9 rounded-full flex items-center justify-center shrink-0 border",
        isSelected ? "bg-primary/10 border-primary/20" : "bg-muted/30 border-border/50"
      )}>
        <Icon className={cn(
          "size-4.5",
          isSelected ? "text-primary" : "text-muted-foreground"
        )} weight={isSelected ? "fill" : "bold"} />
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
          <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">
            {isBg ? region.deliveryTimeBg : region.deliveryTime}
          </span>
        </div>
        <p className="text-[11px] text-muted-foreground font-medium mt-0.5">
          {isBg ? region.descriptionBg : region.description}
        </p>
        {region.carriers.length > 0 && isSelected && (
          <div className="flex flex-wrap gap-1 mt-1.5">
            {region.carriers.map((carrier) => (
              <span
                key={carrier}
                className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/10"
              >
                {carrier}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Checkbox */}
      <Checkbox
        checked={isSelected}
        onCheckedChange={() => onToggle()}
        className="size-4.5 rounded-md border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
        aria-label={isBg ? region.labelBg : region.label}
      />
    </label>
  );
}

// ============================================================================
// Dimensions Input Component
// ============================================================================
function DimensionsInput({
  dimensions,
  onChange,
  isBg,
}: {
  dimensions: { lengthCm?: number; widthCm?: number; heightCm?: number; weightKg?: number } | undefined;
  onChange: (dims: { lengthCm?: number; widthCm?: number; heightCm?: number; weightKg?: number }) => void;
  isBg: boolean;
}) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <div className="space-y-1.5">
        <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{isBg ? "Дължина" : "Length"}</Label>
        <div className="relative">
          <Input
            type="number"
            placeholder="0"
            value={dimensions?.lengthCm || ""}
            onChange={(e) => onChange({ ...dimensions, lengthCm: e.target.value ? Number(e.target.value) : undefined })}
            className="h-10 pr-8 rounded-lg border-border font-medium"
          />
          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-bold text-muted-foreground">cm</span>
        </div>
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{isBg ? "Ширина" : "Width"}</Label>
        <div className="relative">
          <Input
            type="number"
            placeholder="0"
            value={dimensions?.widthCm || ""}
            onChange={(e) => onChange({ ...dimensions, widthCm: e.target.value ? Number(e.target.value) : undefined })}
            className="h-10 pr-8 rounded-lg border-border font-medium"
          />
          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-bold text-muted-foreground">cm</span>
        </div>
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{isBg ? "Височина" : "Height"}</Label>
        <div className="relative">
          <Input
            type="number"
            placeholder="0"
            value={dimensions?.heightCm || ""}
            onChange={(e) => onChange({ ...dimensions, heightCm: e.target.value ? Number(e.target.value) : undefined })}
            className="h-10 pr-8 rounded-lg border-border font-medium"
          />
          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-bold text-muted-foreground">cm</span>
        </div>
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{isBg ? "Тегло" : "Weight"}</Label>
        <div className="relative">
          <Input
            type="number"
            step="0.1"
            placeholder="0"
            value={dimensions?.weightKg || ""}
            onChange={(e) => onChange({ ...dimensions, weightKg: e.target.value ? Number(e.target.value) : undefined })}
            className="h-10 pr-8 rounded-lg border-border font-medium"
          />
          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-bold text-muted-foreground">kg</span>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// SHIPPING FIELD - Shipping regions, city, dimensions using context
// ============================================================================

interface ShippingFieldProps {
  /** Custom class name for the field wrapper */
  className?: string;
  /** Use compact layout */
  compact?: boolean;
}

export function ShippingField({ className, compact = false }: ShippingFieldProps) {
  const { setValue, watch } = useSellForm();
  const { isBg } = useSellFormContext();

  // Watch shipping values
  const shipsToBulgaria = watch("shipsToBulgaria");
  const shipsToUK = watch("shipsToUK");
  const shipsToEurope = watch("shipsToEurope");
  const shipsToUSA = watch("shipsToUSA");
  const shipsToWorldwide = watch("shipsToWorldwide");
  const pickupOnly = watch("pickupOnly");
  const freeShipping = watch("freeShipping");
  const shippingPrice = watch("shippingPrice");
  const sellerCity = watch("sellerCity");
  const dimensions = watch("dimensions");
  const processingDays = watch("processingDays");

  const regionValues = {
    shipsToBulgaria,
    shipsToUK,
    shipsToEurope,
    shipsToUSA,
    shipsToWorldwide,
    pickupOnly,
  };

  const toggleRegion = (field: keyof typeof regionValues) => {
    setValue(field, !regionValues[field], { shouldValidate: true });
  };

  const anyRegionSelected = Object.values(regionValues).some(Boolean);
  const hasError = !anyRegionSelected;

  const content = (
    <FieldContent className={cn("space-y-6", !compact && "p-6")}>
          {/* Shipping Regions */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold">
              {isBg ? "Региони за доставка" : "Shipping Regions"}
            </Label>
            <div className="grid gap-3 sm:grid-cols-2">
              {SHIPPING_REGIONS.map((region) => (
                <ShippingRegionCard
                  key={region.id}
                  region={region}
                  isSelected={regionValues[region.field]}
                  onToggle={() => toggleRegion(region.field)}
                  isBg={isBg}
                />
              ))}
            </div>
            {hasError && (
              <FieldError errors={[{ message: isBg ? "Изберете поне един регион" : "Select at least one region" }]} />
            )}
          </div>

          {/* Seller City (for Bulgaria or Pickup) */}
          {(shipsToBulgaria || pickupOnly) && (
            <div className="space-y-2">
              <Label className="text-sm font-semibold">
                {isBg ? "Вашият град" : "Your City"} *
              </Label>
              <Select
                value={sellerCity || ""}
                onValueChange={(val) => setValue("sellerCity", val)}
              >
                <SelectTrigger className="h-12 rounded-xl border-border font-medium">
                  <SelectValue placeholder={isBg ? "Изберете град..." : "Select city..."} />
                </SelectTrigger>
                <SelectContent>
                  {BULGARIAN_CITIES.map((city) => (
                    <SelectItem key={city.value} value={city.value} className="font-medium">
                      {isBg ? city.labelBg : city.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground font-medium">
                {isBg 
                  ? "Градът, от който ще изпращате"
                  : "The city you'll ship from"}
              </p>
            </div>
          )}

          {/* Shipping Price */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-semibold">
                {isBg ? "Цена за доставка" : "Shipping Price"}
              </Label>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  {isBg ? "Безплатна" : "Free"}
                </span>
                <Switch
                  checked={freeShipping}
                  onCheckedChange={(checked) => {
                    setValue("freeShipping", checked);
                    if (checked) {
                      setValue("shippingPrice", "0");
                    }
                  }}
                />
              </div>
            </div>
            {!freeShipping && (
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">
                  лв
                </span>
                <Input
                  type="text"
                  inputMode="decimal"
                  placeholder="0.00"
                  value={shippingPrice || ""}
                  onChange={(e) => setValue("shippingPrice", e.target.value)}
                  className="pl-10 h-12 rounded-xl border-border font-bold text-lg"
                />
              </div>
            )}
          </div>

          {/* Package Dimensions */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Package className="size-4 text-muted-foreground" weight="bold" />
              <Label className="text-sm font-semibold">
                {isBg ? "Размери на пратката (по избор)" : "Package Dimensions (optional)"}
              </Label>
            </div>
            <DimensionsInput
              dimensions={dimensions}
              onChange={(dims) => setValue("dimensions", dims)}
              isBg={isBg}
            />
          </div>

          {/* Processing Time */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold">
              {isBg ? "Време за обработка" : "Processing Time"}
            </Label>
            <Select
              value={String(processingDays)}
              onValueChange={(val) => setValue("processingDays", Number(val))}
            >
              <SelectTrigger className="h-12 w-44 rounded-xl border-border font-medium">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 5, 7, 10, 14].map((days) => (
                  <SelectItem key={days} value={String(days)} className="font-medium">
                    {days} {isBg ? (days === 1 ? "ден" : "дни") : (days === 1 ? "day" : "days")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground font-medium">
              {isBg 
                ? "Време за подготовка на поръчката преди изпращане"
                : "Time to prepare the order before shipping"}
            </p>
          </div>
    </FieldContent>
  );

  return (
    <Field data-invalid={hasError} className={className}>
      {!compact ? (
        <div className="rounded-xl border border-border bg-background overflow-hidden shadow-xs">
          {/* Header */}
          <div className="p-5 pb-4 border-b border-border/50 bg-muted/10">
            <div className="flex items-center gap-3.5">
              <div className="flex size-10 items-center justify-center rounded-md bg-background border border-border shadow-xs">
                <Truck className="size-5 text-muted-foreground" weight="bold" />
              </div>
              <div>
                <FieldLabel className="text-sm font-bold tracking-tight text-foreground">
                  {isBg ? "Доставка" : "Shipping"}
                </FieldLabel>
                <FieldDescription className="text-xs font-medium text-muted-foreground mt-0.5">
                  {isBg
                    ? "Изберете регионите, до които доставяте"
                    : "Select regions you can ship to"}
                </FieldDescription>
              </div>
            </div>
          </div>

          {content}
        </div>
      ) : (
        <>
          <div className="flex items-center gap-2 mb-2">
            <Truck className="size-4 text-muted-foreground" weight="bold" />
            <FieldLabel className="text-sm font-medium">
              {isBg ? "Доставка" : "Shipping"}
            </FieldLabel>
          </div>
          {content}
        </>
      )}
    </Field>
  );
}

/**
 * Memoized ShippingField - Shipping regions, city, and dimensions selector.
 * Optimized to prevent unnecessary re-renders when unrelated form state changes.
 * @see useSellForm - Hook for form state access
 * @see useSellFormContext - Hook for context access
 */
export const MemoizedShippingField = memo(ShippingField);
