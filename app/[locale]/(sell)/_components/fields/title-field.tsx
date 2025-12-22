"use client";

import { memo } from "react";
import { Controller } from "react-hook-form";
import { TextAa } from "@phosphor-icons/react";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldDescription, FieldError, FieldContent } from "@/components/common/field";
import { cn } from "@/lib/utils";
import { useSellForm, useSellFormContext } from "../sell-form-provider";

// ============================================================================
// TITLE FIELD - Product title input with character count
// Mobile-first: 48px input height, clear labels, readable character counter
// ============================================================================

interface TitleFieldProps {
  /** Custom class name for the field wrapper */
  className?: string;
  /** Minimum characters required */
  minLength?: number;
  /** Maximum characters allowed */
  maxLength?: number;
  /** Use compact layout (no section wrapper) */
  compact?: boolean;
}

export function TitleField({ 
  className, 
  minLength = 5, 
  maxLength = 80,
  compact = false 
}: TitleFieldProps) {
  const { control, watch } = useSellForm();
  const { isBg } = useSellFormContext();

  const currentValue = watch("title") || "";
  const charCount = currentValue.length;

  return (
    <Controller
      name="title"
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid} className={className}>
          {/* Section Header (non-compact mode) */}
          {!compact && (
            <div className="p-5 pb-4 border-b border-form-section-border bg-muted/10">
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

          {/* Input with label inside */}
          <FieldContent className={cn(!compact && "p-5")}>
            <div className={cn(
              "relative flex items-center h-12 px-4 rounded-xl border transition-all",
              "bg-background border-border shadow-xs focus-within:border-primary/50 focus-within:ring-4 focus-within:ring-primary/5",
              fieldState.invalid && "border-destructive bg-destructive/5"
            )}>
              <label 
                htmlFor="sell-form-title"
                className="text-2xs font-bold uppercase tracking-wider text-muted-foreground shrink-0 mr-2"
              >
                {isBg ? "Заглавие:" : "Title:"}
              </label>
              <Input
                {...field}
                id="sell-form-title"
                aria-invalid={fieldState.invalid}
                placeholder={isBg 
                  ? "Напр. iPhone 15 Pro Max 256GB" 
                  : "e.g., iPhone 15 Pro Max 256GB"}
                maxLength={maxLength}
                className={cn(
                  "h-auto p-0 border-none bg-transparent shadow-none focus-visible:ring-0 text-sm font-semibold flex-1 min-w-0",
                  fieldState.invalid && "text-destructive"
                )}
              />
              <span 
                className={cn(
                  "ml-2 text-2xs font-bold tabular-nums uppercase tracking-widest shrink-0",
                  charCount >= maxLength 
                    ? "text-destructive" 
                    : charCount >= minLength 
                      ? "text-muted-foreground"
                      : "text-muted-foreground/40"
                )}
              >
                {charCount}/{maxLength}
              </span>
            </div>

            {/* Helper text - shows progress toward minimum */}
            {charCount > 0 && charCount < minLength && (
              <p className="mt-2 text-xs font-bold text-primary uppercase tracking-wider">
                {isBg 
                  ? `Добавете още ${minLength - charCount} символа`
                  : `Add ${minLength - charCount} more characters`}
              </p>
            )}

            {/* Error Message */}
            {fieldState.invalid && (
              <FieldError 
                errors={[fieldState.error]} 
                className="mt-form-sm"
              />
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
export const MemoizedTitleField = memo(TitleField);
