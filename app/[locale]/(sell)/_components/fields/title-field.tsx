"use client";

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

          {/* Input - Premium card design */}
          <FieldContent className={cn(!compact && "p-5")}>
            <div className="space-y-2">
              {compact && (
                <div className="flex items-center justify-between px-1">
                  <label htmlFor={inputId} className="text-sm font-bold text-foreground">
                    {tSell("fields.title.label")} <span className="text-destructive">*</span>
                  </label>
                  <span className={cn(
                    "text-xs font-bold tabular-nums",
                    charCount > maxLength - 10 ? "text-warning" : "text-muted-foreground"
                  )}>
                    {charCount}/{maxLength}
                  </span>
                </div>
              )}
              <div className={cn(
                "relative rounded-xl border bg-card overflow-hidden transition-colors",
                "focus-within:ring-2 focus-within:ring-ring focus-within:border-ring",
                fieldState.invalid ? "border-destructive/50 bg-destructive-subtle" : "border-border"
              )}>
                <Input
                  {...field}
                  id={inputId}
                  aria-invalid={fieldState.invalid}
                  placeholder={tSell("fields.title.placeholder")}
                  maxLength={maxLength}
                  className="border-none bg-transparent h-14 px-4 text-base font-medium placeholder:text-muted-foreground focus-visible:ring-0"
                />
              </div>
            </div>

            {/* Helper text - shows progress toward minimum */}
            {charCount > 0 && charCount < minLength && (
              <p className="mt-2 text-sm font-medium text-primary flex items-center gap-1.5 px-1">
                {tSell("fields.title.remaining", { count: minLength - charCount })}
              </p>
            )}

            {/* Error Message */}
            {fieldState.invalid && (
              <FieldError className="mt-form-sm">
                {fieldState.error?.message ? tSell(fieldState.error.message as never) : null}
              </FieldError>
            )}
          </FieldContent>
        </Field>
      )}
    />
  );
}
