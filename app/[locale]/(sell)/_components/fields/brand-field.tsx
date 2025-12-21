"use client";

import { useCallback, memo } from "react";
import { Controller } from "react-hook-form";
import { Tag } from "lucide-react";
import { Field, FieldLabel, FieldDescription, FieldError, FieldContent } from "@/components/common/field";
import { cn } from "@/lib/utils";
import { useSellForm, useSellFormContext } from "../sell-form-provider";
import { BrandCombobox } from "../ui/brand-combobox";

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
  const { brands, isBg, locale } = useSellFormContext();
  
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
      render={({ field: _field, fieldState }) => (
        <Field data-invalid={fieldState.invalid} className={className}>
          {/* Section Header (non-compact mode) */}
          {!compact && (
            <div className="p-5 pb-4 border-b border-border/50 bg-muted/10">
              <div className="flex items-center gap-3.5">
                <div className="flex size-10 items-center justify-center rounded-md bg-background border border-border shadow-xs">
                  <Tag className="size-5 text-muted-foreground" weight="bold" />
                </div>
                <div>
                  <FieldLabel className="text-sm font-bold tracking-tight text-foreground">
                    {isBg ? "Марка" : "Brand"}
                  </FieldLabel>
                  <FieldDescription className="text-xs font-medium text-muted-foreground mt-0.5">
                    {isBg 
                      ? "Изберете марката на вашия продукт"
                      : "Select your product's brand"}
                  </FieldDescription>
                </div>
              </div>
            </div>
          )}

          {/* Compact Label */}
          {compact && (
            <FieldLabel className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">
              {isBg ? "Марка" : "Brand"}
            </FieldLabel>
          )}

          {/* Brand Combobox - Using extracted shadcn-compliant component */}
          <FieldContent className={cn(!compact && "p-5")}>
            <BrandCombobox
              brands={brands}
              value={brandId}
              customValue={brandName}
              onValueChange={handleValueChange}
              allowCustom={allowCustom}
              locale={locale}
            />

            {/* Error Message */}
            {fieldState.invalid && (
              <FieldError 
                errors={[fieldState.error]} 
                className="mt-2"
              />
            )}
          </FieldContent>
        </Field>
      )}
    />
  );
}

/**
 * Memoized BrandField - Brand selector using shadcn Combobox pattern.
 * Optimized to prevent unnecessary re-renders when unrelated form state changes.
 * @see useSellForm - Hook for form state access
 * @see useSellFormContext - Hook for context access
 */
export const MemoizedBrandField = memo(BrandField);
