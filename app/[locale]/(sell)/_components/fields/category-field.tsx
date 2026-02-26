"use client"


import { useEffect, useMemo, useState } from "react";
import { Controller } from "react-hook-form";
import { Folder as FolderSimple, Search as MagnifyingGlass } from "lucide-react";

import { Field, FieldLabel, FieldDescription, FieldError, FieldContent } from "@/components/shared/field";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useIsMobile } from "@/hooks/use-is-mobile";
import { useTranslations } from "next-intl";
import { clampModesToPolicy, toCategoryPolicy } from "@/lib/sell/category-policy";
import { cn } from "@/lib/utils";

import { useSellForm, useSellFormContext } from "../sell-form-provider";
import { CategorySelector } from "../ui/category-selector";
import { CategoryModalContent } from "../ui/category-selector-modal-content";
import { SellChip } from "../ui/sell-chip";
import { CategoryPickerDrawerShell, flattenCategories, toPathItem } from "../ui/category-selector-shared";
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
  const isMobile = useIsMobile()

  const [isPickerOpen, setIsPickerOpen] = useState(false);

  const categoryId = watch("categoryId") || "";
  const categoryPathRaw = watch("categoryPath");
  const categoryPath: CategoryPathItem[] | undefined = categoryPathRaw?.map((item) => ({
    id: item.id,
    name: item.name,
    slug: item.slug,
    name_bg: item.name_bg ?? null,
  }));

  const flatCategories = useMemo(() => {
    return flattenCategories(categories, locale)
  }, [categories, locale]);

  const derivedRootId = useMemo(() => {
    const rootFromPath = categoryPath?.[0]?.id;
    if (rootFromPath) return rootFromPath;

    if (categoryId) {
      const root = categories.find((entry) => entry.children?.some((child) => child.id === categoryId));
      if (root) return root.id;
    }

    return categories[0]?.id ?? null;
  }, [categories, categoryId, categoryPath]);

  const [activeRootId, setActiveRootId] = useState<string | null>(derivedRootId);

  useEffect(() => {
    if (derivedRootId && derivedRootId !== activeRootId) {
      setActiveRootId(derivedRootId);
    }
  }, [activeRootId, derivedRootId]);

  const activeRoot = useMemo(() => {
    if (!activeRootId) return categories[0] ?? null;
    return categories.find((entry) => entry.id === activeRootId) ?? categories[0] ?? null;
  }, [activeRootId, categories]);

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

          const nextRootId = normalizedPath[0]?.id
          if (nextRootId) setActiveRootId(nextRootId)

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
              <FieldContent>
                <div>
                  <p className="text-xs font-semibold text-foreground mb-1.5">
                    {tSell("fields.category.label")} <span className="text-destructive">*</span>
                  </p>

                  <div className="flex flex-wrap gap-1.5">
                    {categories.map((root) => {
                      const name = locale === "bg" && root.name_bg ? root.name_bg : root.name
                      const isSelected = root.id === activeRootId
                      const hasChildren = (root.children?.length ?? 0) > 0

                      return (
                        <SellChip
                          key={root.id}
                          selected={isSelected}
                          onClick={() => {
                            setActiveRootId(root.id)
                            if (!hasChildren) {
                              handleSelectorChange(root.id, [toPathItem(root)])
                            }
                          }}
                        >
                          {name}
                        </SellChip>
                      )
                    })}
                  </div>

                  {activeRoot && (activeRoot.children?.length ?? 0) > 0 ? (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {activeRoot.children?.map((leaf) => {
                        const name = locale === "bg" && leaf.name_bg ? leaf.name_bg : leaf.name

                        return (
                          <SellChip
                            key={leaf.id}
                            selected={field.value === leaf.id}
                            onClick={() => handleSelectorChange(leaf.id, [toPathItem(activeRoot), toPathItem(leaf)])}
                          >
                            {name}
                          </SellChip>
                        )
                      })}
                    </div>
                  ) : null}

                  <button
                    type="button"
                    onClick={() => setIsPickerOpen(true)}
                    className={cn(
                      "mt-3 inline-flex items-center gap-2 text-xs font-medium text-muted-foreground transition-colors",
                      "hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-1"
                    )}
                  >
                    <MagnifyingGlass className="size-4" />
                    {tSell("categoryModal.title")}
                  </button>
                </div>

                {fieldState.invalid && (
                  <FieldError className="mt-3">
                    {fieldState.error?.message ? tSell(fieldState.error.message as never) : null}
                  </FieldError>
                )}
              </FieldContent>

              {isMobile ? (
                <CategoryPickerDrawerShell open={isPickerOpen} onOpenChange={setIsPickerOpen}>
                  <CategoryModalContent
                    categories={categories}
                    flatCategories={flatCategories}
                    value={field.value || ""}
                    onSelect={(cat) => {
                      const rootId = cat.path[0]?.id
                      if (rootId) setActiveRootId(rootId)
                      handleSelectorChange(cat.id, cat.path)
                      setIsPickerOpen(false)
                    }}
                    locale={locale}
                    isMobile
                  />
                </CategoryPickerDrawerShell>
              ) : (
                <Dialog open={isPickerOpen} onOpenChange={setIsPickerOpen}>
                  <DialogContent className="max-w-2xl max-h-dialog-sm p-0 gap-0 rounded-xl">
                    <DialogHeader className="px-4 py-3 border-b border-border-subtle">
                      <DialogTitle className="text-base font-semibold">
                        {tSell("categoryModal.title")}
                      </DialogTitle>
                    </DialogHeader>
                    <CategoryModalContent
                      categories={categories}
                      flatCategories={flatCategories}
                      value={field.value || ""}
                      onSelect={(cat) => {
                        const rootId = cat.path[0]?.id
                        if (rootId) setActiveRootId(rootId)
                        handleSelectorChange(cat.id, cat.path)
                        setIsPickerOpen(false)
                      }}
                      locale={locale}
                      isMobile={false}
                    />
                  </DialogContent>
                </Dialog>
              )}
            </>
          )}
          </Field>
        )
      }}
    />
  );
}
