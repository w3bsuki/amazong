"use client";

import { memo, useState } from "react";
import { Controller } from "react-hook-form";
import { Sparkle, Check, CaretRight } from "@phosphor-icons/react";
import { Field, FieldLabel, FieldDescription, FieldError, FieldContent } from "@/components/common/field";
import { cn } from "@/lib/utils";
import { conditionOptions } from "@/lib/sell-form-schema-v4";
import { useSellForm, useSellFormContext } from "../sell-form-provider";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerTrigger,
} from "@/components/ui/drawer";

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
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Controller
      name="condition"
      control={control}
      render={({ field, fieldState }) => {
        const selectedOption = conditionOptions.find(opt => opt.value === field.value);
        const selectedLabel = selectedOption ? (isBg ? selectedOption.labelBg : selectedOption.label) : null;

        return (
          <Field data-invalid={fieldState.invalid} className={className}>
            {/* Section Header (non-compact mode) */}
            {!compact && (
              <div className="flex items-center gap-3.5 mb-4">
                <div className="flex size-10 items-center justify-center rounded-md bg-form-section-bg border border-form-section-border shadow-xs">
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
              <div className="hidden">
                <FieldLabel className="text-sm font-semibold mb-form-sm">
                  {isBg ? "Състояние" : "Condition"}
                </FieldLabel>
              </div>
            )}

            <FieldContent>
              {compact ? (
                /* Mobile: Drawer Pattern with "Label Inside" Trigger */
                <Drawer open={isOpen} onOpenChange={setIsOpen}>
                  <DrawerTrigger asChild>
                    <button
                      type="button"
                      className={cn(
                        "relative w-full flex items-center h-12 px-4 rounded-xl border transition-all text-left",
                        "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/5",
                        "touch-action-manipulation active:scale-[0.98]",
                        fieldState.invalid ? "border-destructive bg-destructive/5" : "border-border bg-background hover:border-primary/30"
                      )}
                    >
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <span className="text-2xs font-bold uppercase tracking-wider text-muted-foreground shrink-0">
                          {isBg ? "Състояние:" : "Condition:"}
                        </span>
                        <span className={cn(
                          "text-sm font-semibold truncate",
                          selectedLabel ? "text-foreground" : "text-muted-foreground/50"
                        )}>
                          {selectedLabel || (isBg ? "Изберете..." : "Select...")}
                        </span>
                      </div>
                      <CaretRight className="size-4 text-muted-foreground/50 shrink-0 ml-2" weight="bold" />
                    </button>
                  </DrawerTrigger>
                  <DrawerContent>
                    <DrawerHeader className="text-left border-b border-border/50 pb-4">
                      <DrawerTitle className="text-lg font-bold">{isBg ? "Състояние" : "Condition"}</DrawerTitle>
                      <DrawerDescription className="text-sm">
                        {isBg ? "В какво състояние е артикулът?" : "What is the condition of the item?"}
                      </DrawerDescription>
                    </DrawerHeader>
                    <div className="p-4 space-y-2">
                      {conditionOptions.map((option) => {
                        const isSelected = field.value === option.value;
                        const label = isBg ? option.labelBg : option.label;
                        
                        return (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => {
                              field.onChange(option.value);
                              setIsOpen(false);
                            }}
                            className={cn(
                              "w-full flex items-center justify-between h-14 px-4 rounded-xl border transition-all",
                              "touch-action-manipulation active:scale-[0.97]",
                              isSelected
                                ? "border-primary bg-primary/5 text-primary font-bold"
                                : "border-transparent bg-muted/40 text-foreground hover:bg-muted/60"
                            )}
                          >
                            <span className="text-base">{label}</span>
                            {isSelected && <Check className="size-5" weight="bold" />}
                          </button>
                        );
                      })}
                    </div>
                    <div className="h-8" /> {/* Bottom spacing for safe area */}
                  </DrawerContent>
                </Drawer>
              ) : (
                /* Desktop: Grid Pattern */
                <div className="grid gap-2.5 grid-cols-2 sm:grid-cols-3">
                  {conditionOptions.map((option) => {
                    const isSelected = field.value === option.value;
                    const label = isBg ? option.labelBg : option.label;
                    
                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => field.onChange(option.value)}
                        className={cn(
                          "flex items-center justify-center h-12 px-4 rounded-xl border transition-all text-center",
                          "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/5",
                          "touch-manipulation active:scale-[0.98]",
                          isSelected
                            ? "border-primary bg-primary/10 text-primary font-bold shadow-xs"
                            : "border-border bg-background hover:border-primary/30 text-muted-foreground hover:text-foreground"
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
                <FieldError 
                  errors={[fieldState.error]} 
                  className="mt-3"
                />
              )}
            </FieldContent>
          </Field>
        );
      }}
    />
  );
}/**
 * Memoized ConditionField - Item condition selector using context pattern.
 * Optimized to prevent unnecessary re-renders when unrelated form state changes.
 * @see useSellForm - Hook for form state access
 * @see useSellFormContext - Hook for context access
 */
export const MemoizedConditionField = memo(ConditionField);
