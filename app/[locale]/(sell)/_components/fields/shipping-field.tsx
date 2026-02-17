"use client";

import { useState } from "react";
import { ChevronRight as CaretRight, House, MapPin, Package, Truck } from "lucide-react";

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
import { Field, FieldLabel, FieldDescription, FieldError, FieldContent } from "@/components/shared/field";
import { cn } from "@/lib/utils";
import { useSellForm, useSellFormContext } from "../sell-form-provider";
import { BULGARIAN_CITIES } from "@/lib/bulgarian-cities";
import { SelectDrawer } from "../ui/select-drawer";
import { useTranslations } from "next-intl";

// ============================================================================
// Shipping Regions Configuration - V1: Bulgaria only (Cash on Delivery)
// International shipping will be added when card payments are implemented
// ============================================================================
const SHIPPING_REGIONS = [
  {
    id: "bulgaria",
    field: "shipsToBulgaria" as const,
    icon: House,
    carriers: ["Speedy", "Econt"],
  },
  {
    id: "pickup",
    field: "pickupOnly" as const,
    icon: MapPin,
    carriers: [],
  },
] as const;

// ============================================================================
// Shipping Region Card Component
// ============================================================================
function ShippingRegionCard({
  region,
  label,
  description,
  deliveryTime,
  isSelected,
  onToggle,
}: {
  region: typeof SHIPPING_REGIONS[number];
  label: string;
  description: string;
  deliveryTime: string;
  isSelected: boolean;
  onToggle: () => void;
}) {
  const Icon = region.icon;

  return (
    <label
      className={cn(
        "relative flex items-start gap-3 p-3 rounded-md border text-left transition-colors w-full cursor-pointer",
        isSelected
          ? "border-selected-border bg-selected shadow-xs"
          : "border-border bg-background hover:border-hover-border"
      )}
    >
      {/* Icon */}
      <div className={cn(
        "size-9 rounded-full flex items-center justify-center shrink-0 border",
        isSelected ? "bg-selected border-selected-border" : "bg-surface-subtle border-border-subtle"
      )}>
        <Icon className={cn(
          "size-4.5",
          isSelected ? "text-primary" : "text-muted-foreground"
        )} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <span className={cn(
            "font-bold text-sm tracking-tight",
            isSelected ? "text-primary" : "text-foreground"
          )}>
            {label}
          </span>
          <span className="text-2xs font-bold text-muted-foreground uppercase tracking-wider">
            {deliveryTime}
          </span>
        </div>
        <p className="text-xs text-muted-foreground font-medium mt-0.5">
          {description}
        </p>
        {region.carriers.length > 0 && isSelected && (
          <div className="flex flex-wrap gap-1 mt-1.5">
            {region.carriers.map((carrier) => (
              <span
                key={carrier}
                className="text-2xs font-bold px-1.5 py-0.5 rounded-md bg-surface-subtle text-primary border border-border"
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
        aria-label={label}
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
  labels,
}: {
  dimensions: { lengthCm?: number; widthCm?: number; heightCm?: number; weightKg?: number } | undefined;
  onChange: (dims: { lengthCm?: number; widthCm?: number; heightCm?: number; weightKg?: number }) => void;
  labels: { length: string; width: string; height: string; weight: string };
}) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <div className="space-y-1.5">
        <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{labels.length}</Label>
        <div className="relative">
          <Input
            type="number"
            placeholder="0"
            value={dimensions?.lengthCm || ""}
            onChange={(e) =>
              onChange({
                ...(dimensions ?? {}),
                ...(e.target.value ? { lengthCm: Number(e.target.value) } : {}),
              })
            }
            className="h-10 pr-8 rounded-lg border-border font-medium"
          />
          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-2xs font-bold text-muted-foreground">cm</span>
        </div>
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{labels.width}</Label>
        <div className="relative">
          <Input
            type="number"
            placeholder="0"
            value={dimensions?.widthCm || ""}
            onChange={(e) =>
              onChange({
                ...(dimensions ?? {}),
                ...(e.target.value ? { widthCm: Number(e.target.value) } : {}),
              })
            }
            className="h-10 pr-8 rounded-lg border-border font-medium"
          />
          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-2xs font-bold text-muted-foreground">cm</span>
        </div>
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{labels.height}</Label>
        <div className="relative">
          <Input
            type="number"
            placeholder="0"
            value={dimensions?.heightCm || ""}
            onChange={(e) =>
              onChange({
                ...(dimensions ?? {}),
                ...(e.target.value ? { heightCm: Number(e.target.value) } : {}),
              })
            }
            className="h-10 pr-8 rounded-lg border-border font-medium"
          />
          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-2xs font-bold text-muted-foreground">cm</span>
        </div>
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{labels.weight}</Label>
        <div className="relative">
          <Input
            type="number"
            step="0.1"
            placeholder="0"
            value={dimensions?.weightKg || ""}
            onChange={(e) =>
              onChange({
                ...(dimensions ?? {}),
                ...(e.target.value ? { weightKg: Number(e.target.value) } : {}),
              })
            }
            className="h-10 pr-8 rounded-lg border-border font-medium"
          />
          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-2xs font-bold text-muted-foreground">kg</span>
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
  const tSell = useTranslations("Sell")

  const [isCityDrawerOpen, setIsCityDrawerOpen] = useState(false);
  const [isProcessingDrawerOpen, setIsProcessingDrawerOpen] = useState(false);

  // Watch shipping values - V1: Bulgaria only
  const shipsToBulgaria = watch("shipsToBulgaria");
  const pickupOnly = watch("pickupOnly");
  const freeShipping = watch("freeShipping");
  const shippingPrice = watch("shippingPrice");
  const sellerCity = watch("sellerCity");
  const dimensions = watch("dimensions");
  const processingDays = watch("processingDays");

  const cleanDimensions = dimensions
    ? {
      ...(dimensions.lengthCm !== undefined ? { lengthCm: dimensions.lengthCm } : {}),
      ...(dimensions.widthCm !== undefined ? { widthCm: dimensions.widthCm } : {}),
      ...(dimensions.heightCm !== undefined ? { heightCm: dimensions.heightCm } : {}),
      ...(dimensions.weightKg !== undefined ? { weightKg: dimensions.weightKg } : {}),
    }
    : undefined;

  // V1: Only Bulgaria + Local Pickup
  const regionValues = {
    shipsToBulgaria,
    pickupOnly,
  };

  const toggleRegion = (field: keyof typeof regionValues) => {
    setValue(field, !regionValues[field], { shouldValidate: true });
  };

  const anyRegionSelected = Object.values(regionValues).some(Boolean);
  const hasError = !anyRegionSelected;

  const cityOptions = BULGARIAN_CITIES.map(c => c.label);
  const cityOptionsBg = BULGARIAN_CITIES.map(c => c.labelBg);
  const selectedCityLabel = BULGARIAN_CITIES.find(c => c.value === sellerCity)?.[isBg ? "labelBg" : "label"];

  const processingOptions = [1, 2, 3, 5, 7, 10, 14].map(d => String(d));
  const processingDisplayOptions = processingOptions.map((value) =>
    tSell("shipping.processing.days", { count: Number(value) })
  );

  const content = (
    <FieldContent className={cn("space-y-6", !compact && "p-6")}>
      {/* Shipping Regions */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold">
          {tSell("shipping.regionsTitle")}
        </Label>
        <div className="grid gap-3 sm:grid-cols-2">
          {SHIPPING_REGIONS.map((region) => {
            const copy =
              region.id === "bulgaria"
                ? {
                    label: tSell("shipping.regions.bulgaria.label"),
                    description: tSell("shipping.regions.bulgaria.description"),
                    deliveryTime: tSell("shipping.regions.bulgaria.deliveryTime"),
                  }
                : {
                    label: tSell("shipping.regions.pickup.label"),
                    description: tSell("shipping.regions.pickup.description"),
                    deliveryTime: tSell("shipping.regions.pickup.deliveryTime"),
                  };

            return (
              <ShippingRegionCard
                key={region.id}
                region={region}
                label={copy.label}
                description={copy.description}
                deliveryTime={copy.deliveryTime}
                isSelected={regionValues[region.field]}
                onToggle={() => toggleRegion(region.field)}
              />
            );
          })}
        </div>
        {hasError && (
          <FieldError>
            {tSell("validation.shippingRegionRequired" as never)}
          </FieldError>
        )}
      </div>

      {/* Seller City (for Bulgaria or Pickup) */}
      {(shipsToBulgaria || pickupOnly) && (
        <div className="space-y-2">
          {compact ? (
            <>
                <button
                  type="button"
                  onClick={() => setIsCityDrawerOpen(true)}
                  className={cn(
                    "w-full flex items-center gap-3.5 min-h-16 px-4 py-3 rounded-xl border text-left transition-colors",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    sellerCity 
                      ? "border-selected-border bg-selected" 
                      : "border-border bg-card hover:bg-hover"
                  )}
                >
                  <div className={cn(
                    "size-11 rounded-xl flex items-center justify-center shrink-0 transition-colors",
                    sellerCity ? "bg-selected text-primary" : "bg-muted text-muted-foreground"
                  )}>
                    <MapPin className="size-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      {tSell("shipping.shipsFromLabel")}
                    </span>
                    <span className="text-destructive text-xs">*</span>
                  </div>
                  <span className={cn(
                    "text-base font-semibold truncate block mt-0.5",
                    sellerCity ? "text-foreground" : "text-text-subtle"
                  )}>
                    {selectedCityLabel || tSell("shipping.selectCityPlaceholder")}
                  </span>
                </div>
                <CaretRight className={cn(
                  "size-5 shrink-0 transition-colors",
                  sellerCity ? "text-primary" : "text-text-subtle"
                )} />
              </button>
              <SelectDrawer
                isOpen={isCityDrawerOpen}
                onClose={() => setIsCityDrawerOpen(false)}
                title={tSell("shipping.selectCityTitle")}
                options={BULGARIAN_CITIES.map(c => c.value)}
                displayOptions={isBg ? cityOptionsBg : cityOptions}
                value={sellerCity || ""}
                onChange={(val) => setValue("sellerCity", val)}
                locale={isBg ? "bg" : "en"}
              />
            </>
          ) : (
            <>
            <Label className="text-sm font-semibold">
              {tSell("shipping.cityLabel")} *
            </Label>
            <Select
              value={sellerCity || ""}
              onValueChange={(val) => setValue("sellerCity", val)}
            >
              <SelectTrigger className="h-(--control-primary) rounded-md border-border font-medium">
                  <SelectValue placeholder={tSell("shipping.selectCityPlaceholder")} />
                </SelectTrigger>
                <SelectContent>
                  {BULGARIAN_CITIES.map((city) => (
                    <SelectItem key={city.value} value={city.value} className="font-medium">
                      {isBg ? city.labelBg : city.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </>
          )}
          <p className="text-xs text-muted-foreground font-medium px-1">
            {tSell("shipping.shipsFromHint")}
          </p>
        </div>
      )}

      {/* Free Shipping Toggle - Premium pill design */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => {
          setValue("freeShipping", !freeShipping);
          if (!freeShipping) {
            setValue("shippingPrice", "0");
          }
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setValue("freeShipping", !freeShipping);
            if (!freeShipping) {
              setValue("shippingPrice", "0");
            }
          }
        }}
        className={cn(
          "w-full flex items-center gap-3.5 p-4 rounded-xl border transition-colors cursor-pointer",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          freeShipping 
            ? "border-selected-border bg-selected" 
            : "border-border bg-card hover:bg-hover"
        )}
      >
        <div className={cn(
          "size-11 rounded-xl flex items-center justify-center shrink-0 transition-all",
          freeShipping 
            ? "bg-selected text-primary" 
            : "bg-muted text-muted-foreground"
        )}>
          <Truck className="size-5" />
        </div>
        <div className="flex-1 text-left min-w-0">
          <span className="text-base font-semibold block">
            {tSell("shipping.freeShipping.title")}
          </span>
          <span className="text-sm text-muted-foreground line-clamp-1">
            {tSell("shipping.freeShipping.description")}
          </span>
        </div>
        <Switch 
          checked={freeShipping} 
          onCheckedChange={(checked) => {
            setValue("freeShipping", checked);
            if (checked) {
              setValue("shippingPrice", "0");
            }
          }}
          className="shrink-0 scale-110"
        />
      </div>

      {/* Shipping Price (if not free) */}
      {!freeShipping && (
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <label className="text-sm font-bold text-foreground">
              {tSell("shipping.shippingPriceLabel")}
            </label>
          </div>
          <div className={cn(
            "flex items-center h-14 px-4 rounded-xl border bg-card transition-colors",
            "focus-within:ring-2 focus-within:ring-ring focus-within:border-ring"
          )}>
            <span className="text-base font-bold text-muted-foreground mr-2">лв</span>
            <Input
              type="text"
              inputMode="decimal"
              placeholder="0.00"
              value={shippingPrice || ""}
              onChange={(e) => setValue("shippingPrice", e.target.value)}
              className="border-none bg-transparent h-full text-lg font-semibold p-0 focus-visible:ring-0 flex-1"
            />
          </div>
        </div>
      )}

      {/* Package Dimensions */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Package className="size-4 text-muted-foreground" />
          <Label className="text-sm font-semibold">
            {tSell("shipping.dimensions.title")}{" "}
            <span className="font-normal opacity-60">{tSell("common.optionalParenthetical")}</span>
          </Label>
        </div>
        <DimensionsInput
          dimensions={cleanDimensions}
          onChange={(dims) => {
            const next = dims
              ? {
                ...(dims.lengthCm !== undefined ? { lengthCm: dims.lengthCm } : {}),
                ...(dims.widthCm !== undefined ? { widthCm: dims.widthCm } : {}),
                ...(dims.heightCm !== undefined ? { heightCm: dims.heightCm } : {}),
                ...(dims.weightKg !== undefined ? { weightKg: dims.weightKg } : {}),
              }
              : undefined;
            setValue("dimensions", next);
          }}
          labels={{
            length: tSell("shipping.dimensions.lengthLabel"),
            width: tSell("shipping.dimensions.widthLabel"),
            height: tSell("shipping.dimensions.heightLabel"),
            weight: tSell("shipping.dimensions.weightLabel"),
          }}
        />
      </div>

      {/* Processing Time */}
      <div className="space-y-2">
        {compact ? (
          <>
            <button
              type="button"
              onClick={() => setIsProcessingDrawerOpen(true)}
              className="relative w-full flex items-center h-12 px-4 rounded-md border border-border bg-background hover:border-hover-border transition-colors text-left shadow-xs"
            >
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <span className="text-2xs font-bold uppercase tracking-wider text-muted-foreground shrink-0">
                  {tSell("shipping.processing.inlineLabel")}
                </span>
                <span className="text-sm font-semibold text-foreground truncate">
                  {tSell("shipping.processing.days", { count: processingDays })}
                </span>
              </div>
              <CaretRight className="size-4 text-text-subtle shrink-0 ml-2" />
            </button>
            <SelectDrawer
              isOpen={isProcessingDrawerOpen}
              onClose={() => setIsProcessingDrawerOpen(false)}
              title={tSell("shipping.processing.title")}
              options={processingOptions}
              displayOptions={processingDisplayOptions}
              value={String(processingDays)}
              onChange={(val) => setValue("processingDays", Number(val))}
              locale={isBg ? "bg" : "en"}
            />
          </>
        ) : (
          <>
            <Label className="text-sm font-semibold">
              {tSell("shipping.processing.title")}
            </Label>
            <Select
              value={String(processingDays)}
              onValueChange={(val) => setValue("processingDays", Number(val))}
            >
              <SelectTrigger className="h-(--control-primary) w-44 rounded-md border-border font-medium">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 5, 7, 10, 14].map((days) => (
                  <SelectItem key={days} value={String(days)} className="font-medium">
                    {tSell("shipping.processing.days", { count: days })}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </>
        )}
        <p className="text-xs text-muted-foreground font-medium px-1">
          {tSell("shipping.processing.hint")}
        </p>
      </div>
    </FieldContent>
  );

  return (
    <Field data-invalid={hasError} className={className}>
      {!compact ? (
        <div className="rounded-md border border-form-section-border bg-form-section-bg overflow-hidden shadow-xs">
          {/* Header */}
          <div className="p-4 pb-3 border-b border-border-subtle bg-surface-subtle">
            <div className="flex items-center gap-3.5">
              <div className="flex size-10 items-center justify-center rounded-md bg-form-section-bg border border-form-section-border shadow-xs">
                <Truck className="size-5 text-muted-foreground" />
              </div>
              <div>
                <FieldLabel className="text-sm font-bold tracking-tight text-foreground">
                  {tSell("shipping.section.title")}
                </FieldLabel>
                <FieldDescription className="text-xs font-medium text-muted-foreground mt-0.5">
                  {tSell("shipping.section.description")}
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
            <div className="flex items-center gap-2 mb-2">
              <Truck className="size-4 text-muted-foreground" />
              <FieldLabel className="text-sm font-medium">
                {tSell("shipping.section.title")}
              </FieldLabel>
            </div>
          </div>
          {content}
        </>
      )}
    </Field>
  );
}

