"use client"


import { Controller } from "react-hook-form";
import { Type as TextAa } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Field, FieldError, FieldContent } from "@/components/shared/field";
import { cn } from "@/lib/utils";
import { useSellForm } from "../sell-form-provider";
import { useTranslations } from "next-intl";
import { SellFieldSectionHeader } from "./_shared/sell-field-section-header";

// ============================================================================
// TITLE FIELD - Product title input with character count
// Mobile-first: 48px input height, clear labels, readable character counter
// ============================================================================

interface TitleFieldProps {
  /** Custom class name for the field wrapper */
  className?: string;
  /** Prefix for DOM ids (prevents duplicates across layouts) */
  idPrefix?: string;
  /** Minimum characters required */
  minLength?: number;
  /** Maximum characters allowed */
  maxLength?: number;
  /** Use compact layout (no section wrapper) */
  compact?: boolean;
}

export function TitleField({
  className,
  idPrefix = "sell-form",
  minLength = 5,
  maxLength = 80,
  compact = false
}: TitleFieldProps) {
  const { control, watch } = useSellForm();
  const tSell = useTranslations("Sell")

  const currentValue = watch("title") || "";
  const charCount = currentValue.length;
  const inputId = `${idPrefix}-title`;

  return (
    <Controller
      name="title"
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid} className={className}>
          <SellFieldSectionHeader
            compact={compact}
            label={tSell("fields.title.label")}
            description={tSell("fields.title.description", { min: minLength, max: maxLength })}
            icon={<TextAa className="size-5 text-muted-foreground" />}
            sectionClassName="p-4 pb-3 border-b border-form-section-border bg-surface-subtle"
            iconWrapClassName="bg-form-section-bg border-form-section-border"
          />

          <FieldContent className={cn(!compact && "p-5")}>
            <div className="space-y-1.5">
              {compact && (
                <div className="flex items-center justify-between">
                  <label htmlFor={inputId} className="text-xs font-semibold text-foreground">
                    {tSell("fields.title.label")} <span className="text-destructive">*</span>
                  </label>
                  <span className={cn(
                    "text-2xs tabular-nums",
                    charCount > maxLength - 10 ? "text-warning" : "text-muted-foreground"
                  )}>
                    {charCount}/{maxLength}
                  </span>
                </div>
              )}
              <Input
                {...field}
                id={inputId}
                aria-invalid={fieldState.invalid}
                placeholder={tSell("fields.title.placeholder")}
                maxLength={maxLength}
                className={cn(
                  "bg-surface-subtle border-border-subtle"
                )}
              />
            </div>

            {/* Helper text - shows progress toward minimum */}
            {charCount > 0 && charCount < minLength && (
              <p className="mt-1.5 text-xs text-muted-foreground">
                {tSell("fields.title.remaining", { count: minLength - charCount })}
              </p>
            )}

            {/* Error Message */}
            {fieldState.invalid && (
              <FieldError className="mt-1">
                {fieldState.error?.message ? tSell(fieldState.error.message as never) : null}
              </FieldError>
            )}
          </FieldContent>
        </Field>
      )}
    />
  );
}
