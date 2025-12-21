"use client";

import { memo } from "react";
import { Controller } from "react-hook-form";
import { FolderSimple } from "@phosphor-icons/react";
import { Field, FieldLabel, FieldDescription, FieldError, FieldContent } from "@/components/ui/field";

import { useSellForm, useSellFormContext } from "../sell-form-provider";
import { CategorySelector } from "../ui/category-modal";
import type { Category } from "../types";

// ============================================================================
// CATEGORY FIELD - Category picker using context pattern
// ============================================================================

interface CategoryFieldProps {
  /** Callback when category changes (for side effects like loading attributes) */
  onCategoryChange?: (categoryId: string, path: Category[]) => void;
  /** Custom class name for the field wrapper */
  className?: string;
  /** Use compact layout (no card wrapper) */
  compact?: boolean;
}

export function CategoryField({ onCategoryChange, className, compact = false }: CategoryFieldProps) {
  const { control, setValue } = useSellForm();
  const { categories, isBg } = useSellFormContext();

  return (
    <Controller
      name="categoryId"
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid} className={className}>
          {!compact ? (
            <div className="rounded-2xl border border-border bg-background overflow-hidden shadow-xs">
              {/* Header */}
              <div className="p-section pb-form border-b border-border/50 bg-muted/10">
                <div className="flex items-center gap-form-sm">
                  <div className="flex size-10 items-center justify-center rounded-md bg-background border border-border shadow-xs">
                    <FolderSimple className="size-5 text-muted-foreground" weight="bold" />
                  </div>
                  <div>
                    <FieldLabel className="text-sm font-bold tracking-tight text-foreground">
                      {isBg ? "Категория" : "Category"}
                    </FieldLabel>
                    <FieldDescription className="text-xs font-medium text-muted-foreground mt-0.5">
                      {isBg
                        ? "Изберете най-подходящата категория за вашия продукт"
                        : "Choose the most appropriate category for your product"}
                    </FieldDescription>
                  </div>
                </div>
              </div>

              {/* Category Selector */}
              <FieldContent className="p-section">
                <CategorySelector
                  categories={categories}
                  value={field.value || ""}
                  onChange={(categoryId, path) => {
                    field.onChange(categoryId);
                    setValue("categoryPath", path, { shouldValidate: false });
                    onCategoryChange?.(categoryId, path);
                  }}
                  locale={isBg ? "bg" : "en"}
                />

                {/* Error Message */}
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} className="mt-form-sm" />
                )}
              </FieldContent>
            </div>
          ) : (
            <>
              <FieldLabel className="text-sm font-semibold mb-form-sm">
                {isBg ? "Категория" : "Category"}
              </FieldLabel>

              <FieldContent>
                <CategorySelector
                  categories={categories}
                  value={field.value || ""}
                  onChange={(categoryId, path) => {
                    field.onChange(categoryId);
                    setValue("categoryPath", path, { shouldValidate: false });
                    onCategoryChange?.(categoryId, path);
                  }}
                  locale={isBg ? "bg" : "en"}
                />

                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} className="mt-3" />
                )}
              </FieldContent>
            </>
          )}
        </Field>
      )}
    />
  );
}

/**
 * Memoized CategoryField - Category picker using context pattern.
 * Optimized to prevent unnecessary re-renders when unrelated form state changes.
 * @see useSellForm - Hook for form state access
 * @see useSellFormContext - Hook for context access
 */
export const MemoizedCategoryField = memo(CategoryField);
