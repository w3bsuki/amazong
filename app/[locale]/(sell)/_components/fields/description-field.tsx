"use client"


import { Controller } from "react-hook-form";
import { AlignLeft as TextAlignLeft } from "lucide-react";

import { Field, FieldError, FieldContent } from "@/components/shared/field";
import { cn } from "@/lib/utils";
import { useSellForm } from "../sell-form-provider";
import { useTranslations } from "next-intl";
import { SellFieldSectionHeader } from "./_shared/sell-field-section-header";

// ============================================================================
// DESCRIPTION FIELD - Rich text area for product description
// ============================================================================

interface DescriptionFieldProps {
  /** Custom class name for the field wrapper */
  className?: string;
  /** Prefix for DOM ids (prevents duplicates across layouts) */
  idPrefix?: string;
  /** Maximum characters allowed */
  maxLength?: number;
  /** Minimum rows for the textarea */
  minRows?: number;
  /** Use compact layout (no section wrapper) */
  compact?: boolean;
}

export function DescriptionField({
  className,
  idPrefix = "sell-form",
  maxLength = 2000,
  minRows = 4,
  compact = false
}: DescriptionFieldProps) {
  const { control, watch } = useSellForm();
  const tSell = useTranslations("Sell")

  const currentValue = watch("description") || "";
  const charCount = currentValue.length;
  const textareaId = `${idPrefix}-description`;

  return (
    <Controller
      name="description"
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid} className={className}>
          <SellFieldSectionHeader
            compact={compact}
            label={tSell("fields.description.label")}
            description={tSell("fields.description.helpText")}
            icon={<TextAlignLeft className="size-5 text-muted-foreground" />}
            sectionClassName="p-4 pb-3 border-b border-border-subtle bg-surface-subtle"
          />

          <FieldContent className={cn(!compact && "p-5")}>
            <div className="space-y-1.5">
              {compact && (
                <label htmlFor={textareaId} className="text-sm font-semibold text-foreground">
                  {tSell("fields.description.label")} <span className="text-destructive">*</span>
                </label>
              )}
              <textarea
                {...field}
                id={textareaId}
                aria-invalid={fieldState.invalid}
                placeholder={tSell("fields.description.placeholder")}
                maxLength={maxLength}
                rows={minRows}
                className={cn(
                  "block w-full resize-none rounded-lg bg-secondary px-3 py-2.5 text-sm text-foreground leading-relaxed",
                  "placeholder:text-muted-foreground",
                  "focus:ring-1 focus:ring-ring focus:outline-none",
                  fieldState.invalid && "ring-1 ring-destructive"
                )}
              />
              <div className="flex justify-end">
                <span
                  className={cn(
                    "text-2xs tabular-nums",
                    charCount >= maxLength
                      ? "text-destructive"
                      : "text-muted-foreground"
                  )}
                >
                  {charCount.toLocaleString()}/{maxLength.toLocaleString()}
                </span>
              </div>
            </div>

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

