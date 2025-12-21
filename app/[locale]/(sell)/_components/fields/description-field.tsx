"use client";

import { memo } from "react";
import { Controller } from "react-hook-form";
import { TextAlignLeft, TextB, TextItalic, List } from "@phosphor-icons/react";
import { Field, FieldLabel, FieldDescription, FieldError, FieldContent } from "@/components/ui/field";
import { cn } from "@/lib/utils";
import { useSellForm, useSellFormContext } from "../sell-form-provider";

// ============================================================================
// DESCRIPTION FIELD - Rich text area for product description
// ============================================================================

interface DescriptionFieldProps {
  /** Custom class name for the field wrapper */
  className?: string;
  /** Maximum characters allowed */
  maxLength?: number;
  /** Minimum rows for the textarea */
  minRows?: number;
  /** Use compact layout (no section wrapper) */
  compact?: boolean;
}

export function DescriptionField({ 
  className, 
  maxLength = 2000,
  minRows = 4,
  compact = false 
}: DescriptionFieldProps) {
  const { control, watch } = useSellForm();
  const { isBg } = useSellFormContext();

  const currentValue = watch("description") || "";
  const charCount = currentValue.length;

  return (
    <Controller
      name="description"
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid} className={className}>
          {/* Section Header (non-compact mode) */}
          {!compact && (
            <div className="flex items-center gap-3.5 mb-4">
              <div className="flex size-10 items-center justify-center rounded-md bg-background border border-border shadow-xs">
                <TextAlignLeft className="size-5 text-muted-foreground" weight="bold" />
              </div>
              <div>
                <FieldLabel className="text-sm font-bold tracking-tight text-foreground">
                  {isBg ? "Описание" : "Description"}
                </FieldLabel>
                <FieldDescription className="text-xs font-medium text-muted-foreground mt-0.5">
                  {isBg 
                    ? "Опишете детайлите - размер, цвят, дефекти"
                    : "Describe the details - size, color, flaws"}
                </FieldDescription>
              </div>
            </div>
          )}

          {/* Compact Label */}
          {compact && (
            <FieldLabel className="text-sm font-medium mb-2">
              {isBg ? "Описание" : "Description"}
            </FieldLabel>
          )}

          {/* Rich Textarea */}
          <FieldContent>
            <div className={cn(
              "rounded-xl border shadow-xs overflow-hidden transition-all",
              "focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10",
              fieldState.invalid && "border-destructive focus-within:ring-destructive/10"
            )}>
              <textarea
                {...field}
                id="sell-form-description"
                aria-invalid={fieldState.invalid}
                placeholder={isBg 
                  ? "Добавете описание на вашия продукт..." 
                  : "Add a description of your product..."}
                maxLength={maxLength}
                rows={minRows}
                className={cn(
                  "block w-full resize-none border-0 bg-transparent px-4 py-3 text-sm",
                  "placeholder:text-muted-foreground/70 focus:ring-0 focus:outline-none",
                  "min-h-32"
                )}
              />
              
              {/* Toolbar */}
              <div className="flex items-center justify-between border-t border-border/50 bg-muted/50 px-3 py-2">
                <div className="flex gap-0.5">
                  <button
                    type="button"
                    className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                    title={isBg ? "Удебелен" : "Bold"}
                    aria-label={isBg ? "Удебелен текст" : "Bold text"}
                  >
                    <TextB className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                    title={isBg ? "Курсив" : "Italic"}
                    aria-label={isBg ? "Курсив текст" : "Italic text"}
                  >
                    <TextItalic className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                    title={isBg ? "Списък" : "List"}
                    aria-label={isBg ? "Добави списък" : "Add list"}
                  >
                    <List className="h-3.5 w-3.5" />
                  </button>
                </div>
                <span
                  className={cn(
                    "text-xs tabular-nums",
                    charCount >= maxLength 
                      ? "text-destructive" 
                      : "text-muted-foreground/70"
                  )}
                >
                  {charCount.toLocaleString()} / {maxLength.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Error Message */}
            {fieldState.invalid && (
              <FieldError 
                errors={[fieldState.error]} 
                className="mt-2"
              />
            )}
          </FieldContent>
        </Field>
      )}
    />
  );
}

/**
 * Memoized DescriptionField - Rich textarea with formatting toolbar.
 * Optimized to prevent unnecessary re-renders when unrelated form state changes.
 * @see useSellForm - Hook for form state access
 * @see useSellFormContext - Hook for context access
 */
export const MemoizedDescriptionField = memo(DescriptionField);
