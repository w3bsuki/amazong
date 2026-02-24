"use client";

import { useState } from "react";
import { Controller } from "react-hook-form";
import { ChevronRight as CaretRight, Check, Sparkles as Sparkle } from "lucide-react";

import { Field, FieldError, FieldContent } from "@/components/shared/field";
import { cn } from "@/lib/utils";
import { conditionOptions } from "@/lib/sell/schema";
import { useSellForm } from "../sell-form-provider";
import { useTranslations } from "next-intl";
import { DrawerShell } from "@/components/shared/drawer-shell";
import { SellFieldSectionHeader } from "./_shared/sell-field-section-header";

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
  const [isOpen, setIsOpen] = useState(false);
  const tSell = useTranslations("Sell")
  const tCommon = useTranslations("Common")

  return (
    <Controller
      name="condition"
      control={control}
      render={({ field, fieldState }) => {
        const selectedOption = conditionOptions.find(opt => opt.value === field.value);
        const selectedLabel = selectedOption ? tSell(selectedOption.labelKey as never) : null;

        return (
          <Field data-invalid={fieldState.invalid} className={className}>
            <SellFieldSectionHeader
              compact={compact}
              label={tSell("steps.details.conditionLabel")}
              description={tSell("fields.condition.helpText")}
              icon={<Sparkle className="size-5 text-muted-foreground" />}
              sectionClassName="mb-4"
              iconWrapClassName="bg-form-section-bg border-form-section-border"
              descriptionClassName="text-sm mt-0.5"
              compactLabelClassName="text-sm font-semibold mb-form-sm normal-case tracking-normal text-foreground"
            />

            <FieldContent>
              {compact ? (
                /* Mobile: Drawer Pattern with "SelectionCard" Trigger */
                <>
                  <button
                    type="button"
                    onClick={() => setIsOpen(true)}
                    className={cn(
                      "w-full flex items-center gap-3.5 min-h-16 px-4 py-3 rounded-xl border text-left transition-colors",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      fieldState.invalid
                        ? "border-destructive/50 bg-destructive-subtle"
                        : selectedLabel
                          ? "border-selected-border bg-selected"
                          : "border-border bg-card hover:bg-hover"
                    )}
                    aria-haspopup="dialog"
                    aria-expanded={isOpen}
                  >
                    <div className={cn(
                      "size-11 rounded-xl flex items-center justify-center shrink-0 transition-colors",
                      selectedLabel ? "bg-selected text-primary" : "bg-muted text-muted-foreground"
                    )}>
                      <Sparkle className="size-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                          {tSell("steps.details.conditionLabel")}
                        </span>
                        <span className="text-destructive text-xs">*</span>
                      </div>
                      <span className={cn(
                        "text-base font-semibold truncate block mt-0.5",
                        selectedLabel ? "text-foreground" : "text-text-subtle"
                      )}>
                        {selectedLabel || tSell("steps.details.conditionPlaceholder")}
                      </span>
                    </div>
                    <CaretRight className={cn(
                      "size-5 shrink-0 transition-colors",
                      selectedLabel ? "text-primary" : "text-text-subtle"
                    )} />
                  </button>

                  <DrawerShell
                    open={isOpen}
                    onOpenChange={setIsOpen}
                    title={tSell("steps.details.conditionDrawerTitle")}
                    closeLabel={tCommon("close")}
                    contentAriaLabel={tSell("steps.details.conditionDrawerTitle")}
                    description={tSell("fields.condition.drawerDescription")}
                    descriptionClassName="text-sm text-muted-foreground"
                    headerClassName="border-b border-border-subtle pb-4"
                    titleClassName="text-xl font-bold"
                    contentClassName="max-h-dialog"
                  >
                    <div className="p-4 space-y-3 max-h-dialog-sm overflow-y-auto" data-vaul-no-drag>
                      {conditionOptions.map((option) => {
                        const isSelected = field.value === option.value;
                        const label = tSell(option.labelKey as never);

                        return (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => {
                              field.onChange(option.value);
                              setIsOpen(false);
                            }}
                            className={cn(
                              "w-full flex items-center gap-4 p-4 rounded-2xl border transition-colors text-left",
                              isSelected
                                ? "border-selected-border bg-selected ring-2 ring-ring"
                                : "border-transparent bg-surface-subtle hover:bg-hover"
                            )}
                          >
                            <div className={cn(
                              "size-12 rounded-xl flex items-center justify-center shrink-0 transition-colors",
                              isSelected ? "bg-selected" : "bg-surface-subtle"
                            )}>
                              <Sparkle 
                                className={cn(
                                  "size-6 transition-colors",
                                  isSelected ? "text-primary" : "text-muted-foreground"
                                )} 
                              />
                            </div>
                            <div className="flex-1 min-w-0 py-0.5">
                              <div className={cn(
                                "text-base font-bold",
                                isSelected ? "text-primary" : "text-foreground"
                              )}>
                                {label}
                              </div>
                            </div>
                            {isSelected && (
                              <div className="size-7 rounded-full bg-primary flex items-center justify-center shrink-0">
                                <Check className="size-4 text-primary-foreground" />
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                    <div className="h-safe-b" />
                  </DrawerShell>
                </>
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
                          "flex items-center justify-center h-12 px-4 rounded-md border transition-colors text-center",
                          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background",
                          "touch-manipulation",
                          isSelected
                            ? "border-selected-border bg-selected text-primary font-bold shadow-xs"
                            : "border-border bg-background hover:border-hover-border text-muted-foreground hover:text-foreground"
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
                <FieldError className="mt-3">
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

