"use client";

import { memo } from "react";
import { Controller } from "react-hook-form";
import { TextAlignLeft, TextB, TextItalic, List } from "@phosphor-icons/react";
import { Field, FieldLabel, FieldDescription, FieldError, FieldContent } from "@/components/shared/field";
import { cn } from "@/lib/utils";
import { useSellForm, useSellFormContext } from "../sell-form-provider";
import { useTranslations } from "next-intl";

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
  const { isBg } = useSellFormContext();
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
          {/* Section Header (non-compact mode) */}
          {!compact && (
            <div className="p-4 pb-3 border-b border-border/50 bg-surface-subtle">
              <div className="flex items-center gap-3.5">
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
            </div>
          )}

          {/* Compact Label */}
          {compact && (
            <div className="hidden">
              <FieldLabel className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">
                {isBg ? "Описание" : "Description"}
              </FieldLabel>
            </div>
          )}

          {/* Rich Textarea with label inside */}
          <FieldContent className={cn(!compact && "p-5")}>
            <div className={cn(
              "rounded-md border shadow-xs overflow-hidden transition-colors bg-background",
              "focus-within:border-ring focus-within:ring-2 focus-within:ring-ring",
              fieldState.invalid && "border-destructive focus-within:ring-destructive/5"
            )}>
              <div className="px-4 pt-3">
                <label
                  htmlFor={textareaId}
                  className="text-2xs font-bold uppercase tracking-wider text-muted-foreground leading-none"
                >
                  {isBg ? "Описание" : "Description"}
                </label>
              </div>
              <textarea
                {...field}
                id={textareaId}
                aria-invalid={fieldState.invalid}
                placeholder={isBg
                  ? "Добавете описание на вашия продукт..."
                  : "Add a description of your product..."}
                maxLength={maxLength}
                rows={minRows}
                className={cn(
                  "block w-full resize-none border-0 bg-transparent px-4 py-2 text-sm font-semibold",
                  "placeholder:text-muted-foreground/50 focus:ring-0 focus:outline-none",
                  "min-h-32"
                )}
              />

              {/* Toolbar */}
              <div className="flex items-center justify-between border-t border-border/50 bg-surface-subtle px-4 py-2">
                <div className="flex gap-1">
                  <button
                    type="button"
                    className="size-8 flex items-center justify-center rounded-lg text-muted-foreground hover:bg-background hover:text-primary hover:shadow-sm transition-all"
                    title={isBg ? "Удебелен" : "Bold"}
                    aria-label={isBg ? "Удебелен текст" : "Bold text"}
                  >
                    <TextB className="size-3.5" weight="bold" />
                  </button>
                  <button
                    type="button"
                    className="size-8 flex items-center justify-center rounded-lg text-muted-foreground hover:bg-background hover:text-primary hover:shadow-sm transition-all"
                    title={isBg ? "Курсив" : "Italic"}
                    aria-label={isBg ? "Курсив текст" : "Italic text"}
                  >
                    <TextItalic className="size-3.5" weight="bold" />
                  </button>
                  <button
                    type="button"
                    className="size-8 flex items-center justify-center rounded-lg text-muted-foreground hover:bg-background hover:text-primary hover:shadow-sm transition-all"
                    title={isBg ? "Списък" : "List"}
                    aria-label={isBg ? "Добави списък" : "Add list"}
                  >
                    <List className="size-3.5" weight="bold" />
                  </button>
                </div>
                <span
                  className={cn(
                    "text-2xs font-bold tabular-nums uppercase tracking-widest",
                    charCount >= maxLength
                      ? "text-destructive"
                      : "text-muted-foreground/60"
                  )}
                >
                  {charCount.toLocaleString()} / {maxLength.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Error Message */}
            {fieldState.invalid && (
              <FieldError className="mt-2">
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
 * Memoized DescriptionField - Rich textarea with formatting toolbar.
 * Optimized to prevent unnecessary re-renders when unrelated form state changes.
 * @see useSellForm - Hook for form state access
 * @see useSellFormContext - Hook for context access
 */
const MemoizedDescriptionField = memo(DescriptionField);
