"use client";

import { Controller } from "react-hook-form";
import { TextAlignLeft, TextB, TextItalic, List } from "@/lib/icons/phosphor";
import { Field, FieldLabel, FieldDescription, FieldError, FieldContent } from "@/components/shared/field";
import { cn } from "@/lib/utils";
import { useSellForm } from "../sell-form-provider";
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
            <div className="p-4 pb-3 border-b border-border-subtle bg-surface-subtle">
              <div className="flex items-center gap-3.5">
                <div className="flex size-10 items-center justify-center rounded-md bg-background border border-border shadow-xs">
                  <TextAlignLeft className="size-5 text-muted-foreground" weight="bold" />
                </div>
                <div>
                  <FieldLabel className="text-sm font-bold tracking-tight text-foreground">
                    {tSell("fields.description.label")}
                  </FieldLabel>
                  <FieldDescription className="text-xs font-medium text-muted-foreground mt-0.5">
                    {tSell("fields.description.helpText")}
                  </FieldDescription>
                </div>
              </div>
            </div>
          )}

          {/* Compact Label */}
            {compact && (
              <div className="hidden">
                <FieldLabel className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">
                  {tSell("fields.description.label")}
                </FieldLabel>
              </div>
            )}

          {/* Rich Textarea with label inside */}
          <FieldContent className={cn(!compact && "p-5")}>
            <div className={cn(
              "rounded-md border shadow-xs overflow-hidden transition-colors bg-background",
              "focus-within:border-ring focus-within:ring-2 focus-within:ring-ring",
              fieldState.invalid && "border-destructive focus-within:ring-destructive-subtle"
            )}>
              <div className="px-4 pt-3">
                <label
                  htmlFor={textareaId}
                  className="text-2xs font-bold uppercase tracking-wider text-muted-foreground leading-none"
                >
                  {tSell("fields.description.label")}
                </label>
              </div>
              <textarea
                {...field}
                 id={textareaId}
                 aria-invalid={fieldState.invalid}
                 placeholder={tSell("fields.description.placeholder")}
                 maxLength={maxLength}
                 rows={minRows}
                 className={cn(
                  "block w-full resize-none border-0 bg-transparent px-4 py-2 text-sm font-semibold",
                  "placeholder:text-muted-foreground focus:ring-0 focus:outline-none",
                  "min-h-32"
                )}
              />

              {/* Toolbar */}
              <div className="flex items-center justify-between border-t border-border-subtle bg-surface-subtle px-4 py-2">
                <div className="flex gap-1">
                   <button
                     type="button"
                     className="size-8 flex items-center justify-center rounded-lg text-muted-foreground hover:bg-background hover:text-primary hover:shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background"
                     title={tSell("fields.description.toolbar.boldTitle")}
                     aria-label={tSell("fields.description.toolbar.boldAriaLabel")}
                   >
                     <TextB className="size-3.5" weight="bold" />
                   </button>
                   <button
                     type="button"
                     className="size-8 flex items-center justify-center rounded-lg text-muted-foreground hover:bg-background hover:text-primary hover:shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background"
                     title={tSell("fields.description.toolbar.italicTitle")}
                     aria-label={tSell("fields.description.toolbar.italicAriaLabel")}
                   >
                     <TextItalic className="size-3.5" weight="bold" />
                   </button>
                   <button
                     type="button"
                     className="size-8 flex items-center justify-center rounded-lg text-muted-foreground hover:bg-background hover:text-primary hover:shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background"
                     title={tSell("fields.description.toolbar.listTitle")}
                     aria-label={tSell("fields.description.toolbar.listAriaLabel")}
                   >
                     <List className="size-3.5" weight="bold" />
                   </button>
                 </div>
                <span
                  className={cn(
                    "text-2xs font-bold tabular-nums uppercase tracking-widest",
                    charCount >= maxLength
                      ? "text-destructive"
                      : "text-muted-foreground"
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

