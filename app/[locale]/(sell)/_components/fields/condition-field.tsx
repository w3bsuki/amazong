"use client"


import { Controller } from "react-hook-form";
import { Sparkles as Sparkle } from "lucide-react";

import { Field, FieldError, FieldContent } from "@/components/shared/field";
import { cn } from "@/lib/utils";
import { conditionOptions } from "@/lib/sell/schema";
import { useSellForm } from "../sell-form-provider";
import { useTranslations } from "next-intl";
import { SellFieldSectionHeader } from "./_shared/sell-field-section-header";

// ============================================================================
// CONDITION FIELD - Item condition selector
// Mobile compact: inline chips. Desktop: grid buttons.
// ============================================================================

interface ConditionFieldProps {
  /** Custom class name for the field wrapper */
  className?: string;
  /** Use compact mobile-style layout */
  compact?: boolean;
}

export function ConditionField({ className, compact = false }: ConditionFieldProps) {
  const { control } = useSellForm();
  const tSell = useTranslations("Sell")

  return (
    <Controller
      name="condition"
      control={control}
      render={({ field, fieldState }) => {
        return (
          <Field data-invalid={fieldState.invalid} className={className}>
            <SellFieldSectionHeader
              compact={compact}
              label={tSell("steps.details.conditionLabel")}
              description={tSell("fields.condition.helpText")}
              icon={<Sparkle className="size-5 text-muted-foreground" />}
              sectionClassName="mb-4"
              iconWrapClassName="bg-surface-subtle"
              descriptionClassName="text-sm mt-0.5"
              compactLabelClassName="text-sm font-semibold mb-form-sm normal-case tracking-normal text-foreground"
            />

            <FieldContent>
              {compact ? (
                /* Mobile: Inline chip pills — flat, fast, no drawer */
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-foreground">
                    {tSell("steps.details.conditionLabel")} <span className="text-destructive">*</span>
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {conditionOptions.map((option) => {
                      const isSelected = field.value === option.value;
                      const label = tSell(option.labelKey as never);

                      return (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => field.onChange(option.value)}
                          className={cn(
                            "px-3 py-1.5 rounded-full text-xs font-medium transition-colors",
                            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                            "touch-manipulation",
                            isSelected
                              ? "bg-foreground text-background"
                              : "bg-secondary text-muted-foreground hover:text-foreground"
                          )}
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : (
                /* Desktop: Grid Pattern */
                <div className="grid gap-2.5 grid-cols-2 sm:grid-cols-3">
                  {conditionOptions.map((option) => {
                    const isSelected = field.value === option.value;
                    const label = tSell(option.labelKey as never);

                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => field.onChange(option.value)}
                        className={cn(
                          "flex items-center justify-center h-11 px-4 rounded-xl border transition-colors text-center",
                          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                          "touch-manipulation",
                          isSelected
                            ? "bg-foreground text-background border-foreground font-semibold"
                            : "border-border bg-secondary text-muted-foreground hover:text-foreground"
                        )}
                      >
                        <span className="text-sm leading-tight">
                          {label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Error Message */}
              {fieldState.invalid && (
                <FieldError className="mt-1.5">
                  {fieldState.error?.message ? tSell(fieldState.error.message as never) : null}
                </FieldError>
              )}
            </FieldContent>
          </Field>
        );
      }}
    />
  );
}

