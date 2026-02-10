"use client";

import { memo } from "react";
import { Controller } from "react-hook-form";
import { FolderSimple } from "@phosphor-icons/react";
import { Field, FieldLabel, FieldDescription, FieldError, FieldContent } from "@/components/shared/field";
import { useTranslations } from "next-intl";

import { useSellForm, useSellFormContext } from "../sell-form-provider";
import { CategorySelector } from "../ui/category-modal";
import type { CategoryPathItem } from "../../_lib/types";

// ============================================================================
// CATEGORY FIELD - Category picker using context pattern
// ============================================================================

interface CategoryFieldProps {
  /** Callback when category changes (for side effects like loading attributes) */
  onCategoryChange?: (categoryId: string, path: CategoryPathItem[]) => void;
  /** Custom class name for the field wrapper */
  className?: string;
  /** Use compact layout (no card wrapper) */
  compact?: boolean;
}

export function CategoryField({ onCategoryChange, className, compact = false }: CategoryFieldProps) {
  const { control, setValue, watch } = useSellForm();
  const { categories, isBg } = useSellFormContext();
  const tSell = useTranslations("Sell")

  const categoryPathRaw = watch("categoryPath");
  const categoryPath: CategoryPathItem[] | undefined = categoryPathRaw?.map((item) => ({
    id: item.id,
    name: item.name,
    slug: item.slug,
    name_bg: item.name_bg ?? null,
  }));

  const prefetchCategoryAttributes = async (categoryId: string) => {
    if (!categoryId) return;
    try {
      // Warm the cache for the attributes field.
      // This endpoint accepts UUID or slug; categoryId is UUID here.
      await fetch(`/api/categories/${encodeURIComponent(categoryId)}/attributes`, {
        method: "GET",
        credentials: "same-origin",
      });
    } catch {
      // Non-blocking: it's only a prefetch.
    }
  };

  return (
    <Controller
      name="categoryId"
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid} className={className}>
          {!compact ? (
            <div className="rounded-md border border-form-section-border bg-form-section-bg overflow-hidden shadow-xs">
              {/* Header */}
              <div className="p-section pb-form border-b border-border-subtle bg-surface-subtle">
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
                  {...(categoryPath ? { selectedPath: categoryPath } : {})}
                  onChange={(categoryId, path) => {
                    const normalizedPath: CategoryPathItem[] = path.map((item) => ({
                      id: item.id,
                      name: item.name,
                      slug: item.slug,
                      name_bg: item.name_bg ?? null,
                    }))

                    // Reset item specifics when switching categories to prevent stale fields/values.
                    setValue("attributes", [], { shouldValidate: true, shouldDirty: true });
                    field.onChange(categoryId);
                    setValue("categoryPath", normalizedPath, { shouldValidate: false });
                    onCategoryChange?.(categoryId, normalizedPath);
                    void prefetchCategoryAttributes(categoryId);
                  }}
                  locale={isBg ? "bg" : "en"}
                />

                {/* Error Message */}
                {fieldState.invalid && (
                  <FieldError className="mt-form-sm">
                    {fieldState.error?.message ? tSell(fieldState.error.message as never) : null}
                  </FieldError>
                )}
              </FieldContent>
            </div>
          ) : (
            <>
              {/* Compact Label - hidden if we use label inside */}
              <div className="hidden">
                <FieldLabel className="text-sm font-semibold mb-form-sm">
                  {isBg ? "Категория" : "Category"}
                </FieldLabel>
              </div>

              <FieldContent>
                <CategorySelector
                  categories={categories}
                  value={field.value || ""}
                  {...(categoryPath ? { selectedPath: categoryPath } : {})}
                  onChange={(categoryId, path) => {
                    const normalizedPath: CategoryPathItem[] = path.map((item) => ({
                      id: item.id,
                      name: item.name,
                      slug: item.slug,
                      name_bg: item.name_bg ?? null,
                    }))

                    // Reset item specifics when switching categories to prevent stale fields/values.
                    setValue("attributes", [], { shouldValidate: true, shouldDirty: true });
                    field.onChange(categoryId);
                    setValue("categoryPath", normalizedPath, { shouldValidate: false });
                    onCategoryChange?.(categoryId, normalizedPath);
                    void prefetchCategoryAttributes(categoryId);
                  }}
                  locale={isBg ? "bg" : "en"}
                />

                {fieldState.invalid && (
                  <FieldError className="mt-3">
                    {fieldState.error?.message ? tSell(fieldState.error.message as never) : null}
                  </FieldError>
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
const MemoizedCategoryField = memo(CategoryField);
