"use client";

import { useCallback } from "react";
import { Controller } from "react-hook-form";
import { Tag } from "lucide-react";
import { Field, FieldLabel, FieldDescription, FieldError, FieldContent } from "@/components/shared/field";
import { cn } from "@/lib/utils";
import { useSellForm, useSellFormContext } from "../sell-form-provider";
import { BrandCombobox } from "../ui/brand-combobox";
import { useTranslations } from "next-intl";

// ============================================================================
// BRAND FIELD - Brand selector using shadcn Combobox pattern
// ============================================================================
// Uses the extracted BrandCombobox component for consistent shadcn/ui patterns

interface BrandFieldProps {
  /** Custom class name for the field wrapper */
  className?: string;
  /** Use compact layout (no section wrapper) */
  compact?: boolean;
  /** Allow custom brand entry */
  allowCustom?: boolean;
}

export function BrandField({
  className,
  compact = false,
  allowCustom = true
}: BrandFieldProps) {
  const { control, setValue, watch } = useSellForm();
  const { brands, locale } = useSellFormContext();
  const tSell = useTranslations("Sell")

  const brandId = watch("brandId");
  const brandName = watch("brandName");

  // Handle brand selection change
  const handleValueChange = useCallback(
    (newBrandId: string | null, newBrandName: string) => {
      setValue("brandId", newBrandId, { shouldValidate: true });
      setValue("brandName", newBrandName, { shouldValidate: false });
    },
    [setValue]
  );

  return (
    <Controller
      name="brandId"
      control={control}
      render={({ fieldState }) => (
        <Field data-invalid={fieldState.invalid} className={className}>
          {/* Section Header (non-compact mode) */}
          {!compact && (
            <div className="p-4 pb-3 border-b border-border-subtle bg-surface-subtle">
              <div className="flex items-center gap-3.5">
                <div className="flex size-10 items-center justify-center rounded-md bg-background border border-border shadow-xs">
                  <Tag className="size-5 text-muted-foreground" />
                </div>
                <div>
                  <FieldLabel className="text-sm font-bold tracking-tight text-foreground">
                    {tSell("fields.brand.label")}
                  </FieldLabel>
                  <FieldDescription className="text-xs font-medium text-muted-foreground mt-0.5">
                    {tSell("fields.brand.helpText")}
                  </FieldDescription>
                </div>
              </div>
            </div>
          )}

          {/* Compact Label - hidden if we use label inside */}
            {compact && (
              <div className="hidden">
                <FieldLabel className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">
                  {tSell("fields.brand.label")}
                </FieldLabel>
              </div>
            )}

          {/* Brand Combobox - Using extracted shadcn-compliant component */}
          <FieldContent className={cn(!compact && "p-5")}>
            <BrandCombobox
              brands={brands}
              value={brandId ?? null}
              {...(brandName ? { customValue: brandName } : {})}
              onValueChange={handleValueChange}
              allowCustom={allowCustom}
              locale={locale}
            />

            {/* Error Message */}
            {fieldState.invalid && (
              <FieldError className="mt-2">
                {fieldState.error?.message ? tSell(fieldState.error.message as never) : null}
              </FieldError>
            )}
          </FieldContent>
        </Field>
      )}
    />
  );
}
