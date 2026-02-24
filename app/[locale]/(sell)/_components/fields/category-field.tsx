"use client";

import { Controller } from "react-hook-form";
import { Folder as FolderSimple } from "lucide-react";

import { Field, FieldLabel, FieldDescription, FieldError, FieldContent } from "@/components/shared/field";
import { useTranslations } from "next-intl";
import { clampModesToPolicy, toCategoryPolicy } from "@/lib/sell/category-policy";

import { useSellForm, useSellFormContext } from "../sell-form-provider";
import { CategorySelector } from "../ui/category-selector";
import type { CategoryPathItem } from "../../_lib/types";
import { findCategoryById } from "./category-helpers";

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

async function prefetchCategoryAttributes(categoryId: string) {
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
}

export function CategoryField({ onCategoryChange, className, compact = false }: CategoryFieldProps) {
  const { control, setValue, watch, getValues } = useSellForm();
  const { categories, locale } = useSellFormContext();
  const tSell = useTranslations("Sell")

  const categoryPathRaw = watch("categoryPath");
  const categoryPath: CategoryPathItem[] | undefined = categoryPathRaw?.map((item) => ({
    id: item.id,
    name: item.name,
    slug: item.slug,
    name_bg: item.name_bg ?? null,
  }));

  return (
    <Controller
      name="categoryId"
      control={control}
      render={({ field, fieldState }) => {
        const handleSelectorChange = (categoryId: string, path: CategoryPathItem[]) => {
          const normalizedPath: CategoryPathItem[] = path.map((item) => ({
            id: item.id,
            name: item.name,
            slug: item.slug,
            name_bg: item.name_bg ?? null,
          }))

          // Reset item specifics when switching categories to prevent stale fields/values.
          setValue("attributes", [], { shouldValidate: true, shouldDirty: true })
          field.onChange(categoryId)
          setValue("categoryPath", normalizedPath, { shouldValidate: false, shouldDirty: true })

          const selectedCategory = findCategoryById(categories, categoryId)
          const categoryPolicy = toCategoryPolicy(
            selectedCategory
              ? {
                  allowed_listing_kinds: selectedCategory.allowed_listing_kinds,
                  allowed_transaction_modes: selectedCategory.allowed_transaction_modes,
                  allowed_fulfillment_modes: selectedCategory.allowed_fulfillment_modes,
                  allowed_pricing_modes: selectedCategory.allowed_pricing_modes,
                  default_fulfillment_mode: selectedCategory.default_fulfillment_mode,
                }
              : null
          )
          const currentValues = getValues()
          const constrainedModes = clampModesToPolicy(
            {
              listingKind: currentValues.listingKind,
              transactionMode: currentValues.transactionMode,
              fulfillmentMode: currentValues.fulfillmentMode,
              pricingMode: currentValues.pricingMode,
            },
            categoryPolicy
          )

          setValue("listingKind", constrainedModes.listingKind, { shouldValidate: true, shouldDirty: true })
          setValue("transactionMode", constrainedModes.transactionMode, { shouldValidate: true, shouldDirty: true })
          setValue("fulfillmentMode", constrainedModes.fulfillmentMode, { shouldValidate: true, shouldDirty: true })
          setValue("pricingMode", constrainedModes.pricingMode, { shouldValidate: true, shouldDirty: true })
          setValue("format", constrainedModes.pricingMode === "auction" ? "auction" : "fixed", {
            shouldValidate: true,
            shouldDirty: true,
          })

          onCategoryChange?.(categoryId, normalizedPath)
          void prefetchCategoryAttributes(categoryId)
        }

        return (
          <Field data-invalid={fieldState.invalid} className={className}>
          {!compact ? (
            <div className="rounded-md border border-form-section-border bg-form-section-bg overflow-hidden shadow-xs">
              {/* Header */}
              <div className="p-section pb-form border-b border-border-subtle bg-surface-subtle">
                <div className="flex items-center gap-form-sm">
                  <div className="flex size-10 items-center justify-center rounded-md bg-background border border-border shadow-xs">
                    <FolderSimple className="size-5 text-muted-foreground" />
                  </div>
                  <div>
                    <FieldLabel className="text-sm font-bold tracking-tight text-foreground">
                      {tSell("fields.category.label")}
                    </FieldLabel>
                    <FieldDescription className="text-xs font-medium text-muted-foreground mt-0.5">
                      {tSell("fields.category.helpText")}
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
                  onChange={handleSelectorChange}
                  locale={locale}
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
                  {tSell("fields.category.label")}
                </FieldLabel>
              </div>

              <FieldContent>
                <CategorySelector
                  categories={categories}
                  value={field.value || ""}
                  {...(categoryPath ? { selectedPath: categoryPath } : {})}
                  onChange={handleSelectorChange}
                  locale={locale}
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
        )
      }}
    />
  );
}
