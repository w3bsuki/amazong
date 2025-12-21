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
            <div className="p-5 pb-4 border-b border-border/50 bg-muted/10">
              <div className="flex items-center gap-3.5">
                <div className="flex size-10 items-center justify-center rounded-md bg-background border border-border shadow-xs">
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

          {/* Compact Label - clear and bold */}
          {compact && (
            <FieldLabel className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">
              {isBg ? "Заглавие" : "Title"}
            </FieldLabel>
          )}

          {/* Input with character count */}
          <FieldContent className={cn(!compact && "p-5")}>
            <div className="relative">
              <Input
                {...field}
                id="sell-form-title"
                aria-invalid={fieldState.invalid}
                placeholder={isBg 
                  ? "Напр. iPhone 15 Pro Max 256GB" 
                  : "e.g., iPhone 15 Pro Max 256GB"}
                maxLength={maxLength}
                className={cn(
                  "pr-20 h-12 text-base font-bold rounded-xl border-border shadow-xs",
                  fieldState.invalid && "border-destructive focus-visible:ring-destructive"
                )}
              />
              <span 
                className={cn(
                  "absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold tabular-nums uppercase tracking-widest",
                  charCount >= maxLength 
                    ? "text-destructive" 
                    : charCount >= minLength 
                      ? "text-muted-foreground"
                      : "text-muted-foreground/40"
                )}
              >
                {charCount} / {maxLength}
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
