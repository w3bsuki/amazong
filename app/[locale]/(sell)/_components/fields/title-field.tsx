"use client";

import { memo } from "react";
import { Controller } from "react-hook-form";
import { TextAa } from "@phosphor-icons/react";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldDescription, FieldError, FieldContent } from "@/components/shared/field";
import { cn } from "@/lib/utils";
import { useSellForm, useSellFormContext } from "../sell-form-provider";
import { useTranslations } from "next-intl";

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
  const { isBg } = useSellFormContext();
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
          {/* Section Header (non-compact mode) */}
          {!compact && (
            <div className="p-4 pb-3 border-b border-form-section-border bg-surface-subtle">
              <div className="flex items-center gap-3.5">
                <div className="flex size-10 items-center justify-center rounded-md bg-form-section-bg border border-form-section-border shadow-xs">
                  <TextAa className="size-5 text-muted-foreground" weight="bold" />
                </div>
                <div>
                  <FieldLabel className="text-sm font-bold tracking-tight text-foreground">
                    {isBg ? "Заглавие" : "Title"}
                  </FieldLabel>
                  <FieldDescription className="text-xs font-medium text-muted-foreground mt-0.5">
                    {isBg
                      ? `${minLength}-${maxLength} символа. Бъдете конкретни.`
                      : `${minLength}-${maxLength} characters. Be specific.`}
                  </FieldDescription>
                </div>
              </div>
            </div>
          )}

          {/* Compact Label - hidden if we use label inside */}
          {compact && (
            <div className="hidden">
              <FieldLabel className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">
                {isBg ? "Заглавие" : "Title"}
              </FieldLabel>
            </div>
          )}

          {/* Input - Premium card design */}
          <FieldContent className={cn(!compact && "p-5")}>
            <div className="space-y-2">
              {compact && (
                <div className="flex items-center justify-between px-1">
                  <label htmlFor={inputId} className="text-sm font-bold text-foreground">
                    {isBg ? "Заглавие" : "Title"} <span className="text-destructive">*</span>
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
                "relative rounded-xl border bg-card overflow-hidden transition-all",
                "focus-within:ring-2 focus-within:ring-ring focus-within:border-ring",
                fieldState.invalid ? "border-destructive/50 bg-destructive-subtle" : "border-border"
              )}>
                <Input
                  {...field}
                  id={inputId}
                  aria-invalid={fieldState.invalid}
                  placeholder={isBg
                    ? "Напр. iPhone 15 Pro Max 256GB"
                    : "e.g., iPhone 15 Pro Max 256GB"}
                  maxLength={maxLength}
                  className="border-none bg-transparent h-14 px-4 text-base font-medium placeholder:text-muted-foreground focus-visible:ring-0"
                />
              </div>
            </div>

            {/* Helper text - shows progress toward minimum */}
            {charCount > 0 && charCount < minLength && (
              <p className="mt-2 text-sm font-medium text-primary flex items-center gap-1.5 px-1">
                {isBg
                  ? `Добавете още ${minLength - charCount} символа`
                  : `Add ${minLength - charCount} more characters`}
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

/**
 * Memoized TitleField - Product title input with character count.
 * Optimized to prevent unnecessary re-renders when unrelated form state changes.
 * @see useSellForm - Hook for form state access
 * @see useSellFormContext - Hook for context access
 */
const MemoizedTitleField = memo(TitleField);
