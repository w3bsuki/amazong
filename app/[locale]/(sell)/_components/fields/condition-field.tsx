"use client";

import { memo } from "react";
import { Controller } from "react-hook-form";
import { Sparkle, Check } from "@phosphor-icons/react";
import { Field, FieldLabel, FieldDescription, FieldError, FieldContent } from "@/components/ui/field";
import { cn } from "@/lib/utils";
import { conditionOptions } from "@/lib/sell-form-schema-v4";
import { useSellForm, useSellFormContext } from "../sell-form-provider";

// ============================================================================
// CONDITION FIELD - Item condition selector with proper mobile touch targets
// Best practices: min 44px touch targets, clear selection states
// ============================================================================

interface ConditionFieldProps {
  /** Custom class name for the field wrapper */
  className?: string;
  /** Use compact mobile-style layout */
  compact?: boolean;
}

export function ConditionField({ className, compact = false }: ConditionFieldProps) {
  const { control } = useSellForm();
  const { isBg } = useSellFormContext();

  return (
    <Controller
      name="condition"
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid} className={className}>
          {/* Section Header (non-compact mode) */}
          {!compact && (
            <div className="flex items-center gap-3.5 mb-4">
              <div className="flex size-10 items-center justify-center rounded-md bg-background border border-border shadow-xs">
                <Sparkle className="size-5 text-muted-foreground" weight="bold" />
              </div>
              <div>
                <FieldLabel className="text-sm font-bold tracking-tight text-foreground">
                  {isBg ? "Състояние" : "Condition"}
                </FieldLabel>
                <FieldDescription className="text-sm text-muted-foreground mt-0.5">
                  {isBg 
                    ? "Изберете състоянието на вашия продукт"
                    : "Select the condition of your item"}
                </FieldDescription>
              </div>
            </div>
          )}

          {/* Compact Label */}
          {compact && (
            <FieldLabel className="text-sm font-semibold mb-form-sm">
              {isBg ? "Състояние" : "Condition"}
            </FieldLabel>
          )}

          {/* Condition Options Grid - proper touch targets (min 44px) */}
          <FieldContent>
            <div className={cn(
              "grid gap-form-sm",
              compact 
                ? "grid-cols-2" // 2 columns, 3 rows on mobile
                : "grid-cols-2 sm:grid-cols-3"
            )}>
              {conditionOptions.map((option) => {
                const isSelected = field.value === option.value;
                const label = isBg ? option.labelBg : option.label;
                
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => field.onChange(option.value)}
                    className={cn(
                      // Base: touch-lg min height for touch, centered content
                      "relative flex items-center justify-center gap-form-sm min-h-touch-lg px-form-sm py-form-sm rounded-2xl border-2 transition-all text-center",
                      "hover:border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                      "touch-manipulation active:scale-[0.97]",
                      isSelected
                        ? "border-primary bg-primary/10 shadow-sm"
                        : "border-border bg-background hover:bg-muted/50"
                    )}
                  >
                    {/* Selection checkmark - top right corner when selected */}
                    {isSelected && (
                      <div className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary shadow-sm">
                        <Check className="size-3 text-primary-foreground" weight="bold" />
                      </div>
                    )}
                    
                    <span className={cn(
                      "text-sm font-medium",
                      isSelected ? "text-primary font-semibold" : "text-foreground"
                    )}>
                      {label}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Error Message */}
            {fieldState.invalid && (
              <FieldError 
                errors={[fieldState.error]} 
                className="mt-3"
              />
            )}
          </FieldContent>
        </Field>
      )}
    />
  );
}

/**
 * Memoized ConditionField - Item condition selector using context pattern.
 * Optimized to prevent unnecessary re-renders when unrelated form state changes.
 * @see useSellForm - Hook for form state access
 * @see useSellFormContext - Hook for context access
 */
export const MemoizedConditionField = memo(ConditionField);
