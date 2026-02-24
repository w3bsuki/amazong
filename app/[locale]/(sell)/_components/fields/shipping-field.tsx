"use client";

import { useState } from "react";
import { Truck } from "lucide-react";

import { Field, FieldLabel, FieldDescription, FieldContent } from "@/components/shared/field";
import { cn } from "@/lib/utils";
import { useSellForm, useSellFormContext } from "../sell-form-provider";
import {
  ShippingDimensionsSection,
  ShippingProcessingSection,
  ShippingPriceSection,
} from "./shipping-field-logistics-sections";
import {
  ShippingCitySection,
  ShippingRegionsSection,
  type ShippingRegionValues,
} from "./shipping-field-location-sections";
import { useTranslations } from "next-intl";

interface ShippingFieldProps {
  className?: string;
  compact?: boolean;
}

export function ShippingField({ className, compact = false }: ShippingFieldProps) {
  const {
    setValue,
    watch,
    formState: { errors },
  } = useSellForm();
  const { isBg } = useSellFormContext();
  const tSell = useTranslations("Sell");

  const [isCityDrawerOpen, setIsCityDrawerOpen] = useState(false);
  const [isProcessingDrawerOpen, setIsProcessingDrawerOpen] = useState(false);

  const shipsToBulgaria = watch("shipsToBulgaria");
  const pickupOnly = watch("pickupOnly");
  const freeShipping = watch("freeShipping");
  const shippingPrice = watch("shippingPrice");
  const sellerCity = watch("sellerCity") || "";
  const dimensions = watch("dimensions");
  const processingDays = watch("processingDays");

  const regionValues: ShippingRegionValues = { shipsToBulgaria, pickupOnly };
  const anyRegionSelected = Object.values(regionValues).some(Boolean);
  const shippingRegionErrorMessage =
    typeof errors.shipsToBulgaria?.message === "string"
      ? tSell(errors.shipsToBulgaria.message as never)
      : null;
  const sellerCityErrorMessage =
    typeof errors.sellerCity?.message === "string"
      ? tSell(errors.sellerCity.message as never)
      : null;
  const hasRegionSelectionError = !anyRegionSelected || !!shippingRegionErrorMessage;
  const hasError = hasRegionSelectionError || !!sellerCityErrorMessage;

  const cleanDimensions = dimensions
    ? {
        ...(dimensions.lengthCm !== undefined ? { lengthCm: dimensions.lengthCm } : {}),
        ...(dimensions.widthCm !== undefined ? { widthCm: dimensions.widthCm } : {}),
        ...(dimensions.heightCm !== undefined ? { heightCm: dimensions.heightCm } : {}),
        ...(dimensions.weightKg !== undefined ? { weightKg: dimensions.weightKg } : {}),
      }
    : undefined;

  const content = (
    <FieldContent className={cn("space-y-6", !compact && "p-6")}>
      <ShippingRegionsSection
        values={regionValues}
        hasError={hasRegionSelectionError}
        {...(shippingRegionErrorMessage ? { errorMessage: shippingRegionErrorMessage } : {})}
        onToggle={(field) =>
          setValue(field, !regionValues[field], { shouldValidate: true, shouldDirty: true })
        }
        tSell={(key) => tSell(key as never)}
      />

      <ShippingCitySection
        compact={compact}
        shipsToBulgaria={shipsToBulgaria}
        pickupOnly={pickupOnly}
        sellerCity={sellerCity}
        isBg={isBg}
        isDrawerOpen={isCityDrawerOpen}
        onDrawerOpenChange={setIsCityDrawerOpen}
        onCityChange={(city) => setValue("sellerCity", city, { shouldValidate: true, shouldDirty: true })}
        {...(sellerCityErrorMessage ? { errorMessage: sellerCityErrorMessage } : {})}
        tSell={(key) => tSell(key as never)}
      />

      <ShippingPriceSection
        freeShipping={freeShipping}
        shippingPrice={shippingPrice || ""}
        onFreeShippingChange={(checked) => {
          setValue("freeShipping", checked, { shouldValidate: true, shouldDirty: true });
          if (checked) setValue("shippingPrice", "0", { shouldValidate: true, shouldDirty: true });
        }}
        onShippingPriceChange={(value) => setValue("shippingPrice", value, { shouldValidate: true, shouldDirty: true })}
        tSell={(key) => tSell(key as never)}
      />

      <ShippingDimensionsSection
        dimensions={cleanDimensions}
        onChange={(next) => {
          const normalized = next
            ? {
                ...(next.lengthCm !== undefined ? { lengthCm: next.lengthCm } : {}),
                ...(next.widthCm !== undefined ? { widthCm: next.widthCm } : {}),
                ...(next.heightCm !== undefined ? { heightCm: next.heightCm } : {}),
                ...(next.weightKg !== undefined ? { weightKg: next.weightKg } : {}),
              }
            : undefined;
          setValue("dimensions", normalized, { shouldDirty: true });
        }}
        tSell={(key) => tSell(key as never)}
      />

      <ShippingProcessingSection
        compact={compact}
        processingDays={processingDays}
        isBg={isBg}
        isDrawerOpen={isProcessingDrawerOpen}
        onDrawerOpenChange={setIsProcessingDrawerOpen}
        onChange={(days) => setValue("processingDays", days, { shouldValidate: true, shouldDirty: true })}
        tSell={(key, values) => tSell(key as never, values as never)}
      />
    </FieldContent>
  );

  return (
    <Field data-invalid={hasError} className={className}>
      {!compact ? (
        <div className="rounded-md border border-form-section-border bg-form-section-bg overflow-hidden shadow-xs">
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
