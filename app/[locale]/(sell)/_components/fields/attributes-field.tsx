"use client";

import { useState, useEffect, useCallback, memo, useMemo } from "react";
import { ChevronRight as CaretRight, CircleCheck as CheckCircle, Info, Plus, SlidersHorizontal as Sliders, LoaderCircle as SpinnerGap, CircleAlert as WarningCircle, X } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Field, FieldLabel, FieldDescription, FieldContent } from "@/components/shared/field";
import { cn } from "@/lib/utils";
import type { ProductAttribute } from "@/lib/sell/schema";
import { useTranslations } from "next-intl";
import { useSellForm, useSellFormContext } from "../sell-form-provider";
import { SelectDrawer } from "../ui/select-drawer";

// ============================================================================
// Types
// ============================================================================
interface CategoryAttribute {
  id: string;
  name: string;
  name_bg?: string | null;
  attribute_type: "text" | "number" | "select" | "multiselect" | "boolean" | "date";
  is_required: boolean;
  is_filterable: boolean;
  options?: string[];
  options_bg?: string[];
  placeholder?: string;
  placeholder_bg?: string;
  sort_order: number;
}

const EXCLUDED_ATTRIBUTE_NAMES = ["condition", "състояние", "състояние на продукта"];

// ============================================================================
// Helper: Check if attribute value is filled
// ============================================================================
function isAttributeFilled(value: string | undefined | null): boolean {
  return value !== undefined && value !== null && value.trim() !== "";
}

// ============================================================================
// ATTRIBUTES FIELD - Database-driven category attributes
// Single source of truth: category_attributes table via /api/categories/:id/attributes
// ============================================================================

interface AttributesFieldProps {
  className?: string;
  compact?: boolean;
}

/**
 * Attribute selection with Drawer support on mobile
 */
function AttributeSelect({
  label,
  value,
  options,
  optionsBg,
  onChange,
  placeholder,
  compact,
  locale,
}: {
  label: string;
  value: string;
  options: string[];
  optionsBg?: string[];
  onChange: (val: string) => void;
  placeholder?: string;
  compact: boolean;
  locale: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const tSell = useTranslations("Sell")
  const isBg = locale === "bg"

  const normalizedOptions = useMemo(() => {
    return options.map((opt, idx) => ({
      value: opt,
      label: (isBg && optionsBg?.[idx]) ? optionsBg[idx] : opt
    }));
  }, [options, optionsBg, isBg]);

  const displayValue = useMemo(() => {
    if (!value) return null;
    return normalizedOptions.find(opt => opt.value === value)?.label || value;
  }, [value, normalizedOptions]);

  if (compact) {
    return (
      <>
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="relative w-full flex items-center h-12 px-4 rounded-md border border-border bg-background hover:border-hover-border transition-colors text-left shadow-xs"
        >
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <span className="text-2xs font-bold uppercase tracking-wider text-muted-foreground shrink-0">
              {label}:
            </span>
            <span className={cn(
              "text-sm font-semibold truncate",
              displayValue ? "text-foreground" : "text-muted-foreground"
            )}>
              {displayValue || placeholder || tSell("fields.attributes.placeholders.selectEllipsis")}
            </span>
          </div>
          <CaretRight className="size-4 text-muted-foreground shrink-0 ml-2" />
        </button>
        <SelectDrawer
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title={label}
          options={options}
          {...(optionsBg ? { optionsBg } : {})}
          value={value}
          onChange={onChange}
          locale={locale}
        />
      </>
    );
  }

  return (
    <Select value={value || undefined} onValueChange={onChange}>
      <SelectTrigger className="w-full h-(--control-primary) rounded-md border-border font-medium">
        <SelectValue placeholder={placeholder || tSell("fields.attributes.placeholders.selectEllipsis")} />
      </SelectTrigger>
      <SelectContent>
        {normalizedOptions.map((opt) => (
          <SelectItem key={opt.value} value={opt.value} className="font-medium">
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export function AttributesField({ className, compact = false }: AttributesFieldProps) {
  const { setValue, watch } = useSellForm();
  const { isBg, locale } = useSellFormContext();
  const tSell = useTranslations("Sell")

  const categoryId = watch("categoryId");
  const watchedAttributes = watch("attributes");
  const attributes = useMemo(() => watchedAttributes || [], [watchedAttributes]);

  // DB-based attributes state
  const [dbAttributes, setDbAttributes] = useState<CategoryAttribute[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [newAttrName, setNewAttrName] = useState("");
  const [newAttrValue, setNewAttrValue] = useState("");
  const [showAllDbAttributes, setShowAllDbAttributes] = useState(false);

  // Fetch attributes from database when category changes
  useEffect(() => {
    if (!categoryId) {
      setDbAttributes([]);
      return;
    }

    const fetchAttributes = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/categories/${categoryId}/attributes`);
        if (response.ok) {
          const data = await response.json();
          const maybeAttributes = (data && typeof data === "object" && "attributes" in data)
            ? (data as { attributes?: unknown }).attributes
            : data;

          if (!Array.isArray(maybeAttributes)) {
            setDbAttributes([]);
            return;
          }

          const normalized = (maybeAttributes as Array<Record<string, unknown>>).map((attr) => ({
            id: String(attr.id),
            name: String(attr.name ?? ""),
            name_bg: attr.name_bg ?? attr.nameBg ?? null,
            attribute_type: (attr.attribute_type ?? attr.type ?? "text") as CategoryAttribute["attribute_type"],
            is_required: Boolean(attr.is_required ?? attr.required),
            is_filterable: Boolean(attr.is_filterable ?? attr.filterable),
            options: (attr.options ?? undefined) as string[] | undefined,
            options_bg: (attr.options_bg ?? attr.optionsBg ?? undefined) as string[] | undefined,
            placeholder: (attr.placeholder ?? undefined) as string | undefined,
            placeholder_bg: (attr.placeholder_bg ?? attr.placeholderBg ?? undefined) as string | undefined,
            sort_order: Number(attr.sort_order ?? attr.sortOrder ?? 0),
          })) as CategoryAttribute[];

          setDbAttributes(normalized);
        }
      } catch (error) {
        console.error("Failed to fetch category attributes:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAttributes();
  }, [categoryId]);

  // Handle attribute change
  const handleAttributeChange = useCallback((attr: CategoryAttribute, value: string) => {
    const existing = attributes.find(a => a.attributeId === attr.id);
    let newAttrs: ProductAttribute[];

    if (existing) {
      if (value) {
        newAttrs = attributes.map(a =>
          a.attributeId === attr.id ? { ...a, value } : a
        );
      } else {
        newAttrs = attributes.filter(a => a.attributeId !== attr.id);
      }
    } else if (value) {
      newAttrs = [...attributes, {
        attributeId: attr.id,
        name: attr.name,
        value,
        isCustom: false,
      }];
    } else {
      newAttrs = attributes;
    }

    setValue("attributes", newAttrs, { shouldValidate: true });
  }, [attributes, setValue]);

  // Add custom attribute
  const handleAddCustom = useCallback(() => {
    if (!newAttrName.trim() || !newAttrValue.trim()) return;

    const newAttr: ProductAttribute = {
      attributeId: null,
      name: newAttrName.trim(),
      value: newAttrValue.trim(),
      isCustom: true,
    };

    setValue("attributes", [...attributes, newAttr], { shouldValidate: true });
    setNewAttrName("");
    setNewAttrValue("");
  }, [newAttrName, newAttrValue, attributes, setValue]);

  // Remove custom attribute
  const handleRemoveCustom = useCallback((index: number) => {
    const customs = attributes.filter(a => a.isCustom);
    const customToRemove = customs[index];
    setValue("attributes", attributes.filter(a => a !== customToRemove), { shouldValidate: true });
  }, [attributes, setValue]);

  // Localization helpers
  const getName = useCallback((attr: CategoryAttribute) =>
    isBg && attr.name_bg ? attr.name_bg : attr.name, [isBg]);

  const getPlaceholder = useCallback((attr: CategoryAttribute) =>
    isBg && attr.placeholder_bg ? attr.placeholder_bg : attr.placeholder, [isBg]);

  const customAttrs = useMemo(() => attributes.filter(a => a.isCustom), [attributes]);

  const dbRequiredAttrs = useMemo(
    () => dbAttributes
      .filter(a => a.is_required)
      .filter(a => !EXCLUDED_ATTRIBUTE_NAMES.includes(a.name.toLowerCase()) && 
                   !(a.name_bg && EXCLUDED_ATTRIBUTE_NAMES.includes(a.name_bg.toLowerCase())))
      .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)),
    [dbAttributes]
  );

  const dbOptionalAttrs = useMemo(
    () => dbAttributes
      .filter(a => !a.is_required)
      .filter(a => !EXCLUDED_ATTRIBUTE_NAMES.includes(a.name.toLowerCase()) && 
                   !(a.name_bg && EXCLUDED_ATTRIBUTE_NAMES.includes(a.name_bg.toLowerCase())))
      .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)),
    [dbAttributes]
  );

  // Cap required fields at 6 for cleaner UX
  const SMART_LIMIT = 6;
  const dbRequiredSmart = useMemo(() => dbRequiredAttrs.slice(0, SMART_LIMIT), [dbRequiredAttrs]);

  // Completion tracking
  const dbRequiredSmartCount = dbRequiredSmart.length;
  const filledDbRequiredSmartCount = useMemo(() => {
    return dbRequiredSmart.reduce((acc, attr) => {
      const v = attributes.find(a => a.attributeId === attr.id)?.value || "";
      return acc + (isAttributeFilled(v) ? 1 : 0);
    }, 0);
  }, [attributes, dbRequiredSmart]);

  // No category selected
  if (!categoryId) {
    return (
      <div className={cn("rounded-md border border-dashed border-border bg-surface-subtle p-4", className)}>
          <p className="text-sm text-muted-foreground text-center">
          {tSell("fields.attributes.noCategorySelected")}
          </p>
        </div>
      );
  }

  const content = (
    <FieldContent className={cn("space-y-5", !compact && "p-5")}>
      {/* Loading */}
      {isLoading && (
        <div className="flex items-center justify-center p-8">
          <SpinnerGap className="size-6 animate-spin text-primary" />
        </div>
      )}

      {/* Required attributes (smart subset) */}
      {!isLoading && dbRequiredSmart.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-sm font-bold">
              {filledDbRequiredSmartCount === dbRequiredSmartCount ? (
                <CheckCircle className="size-4 text-primary" />
              ) : (
                <WarningCircle className="size-4 text-muted-foreground" />
              )}
              <span className="text-foreground uppercase tracking-wider text-xs">
                {tSell("steps.details.mainSpecificsLabel")}
              </span>
            </div>
            <span className="text-xs font-bold text-muted-foreground tabular-nums bg-surface-subtle px-2 py-0.5 rounded-full">
              {filledDbRequiredSmartCount}/{dbRequiredSmartCount}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {dbRequiredSmart.map((attr) => {
              const currentValue = attributes.find(a => a.attributeId === attr.id)?.value || "";
              return (
                <div key={attr.id} className="space-y-1.5">
                  {!compact && (
                    <Label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider">
                      {getName(attr)}
                      <span className="text-destructive ml-1">*</span>
                    </Label>
                  )}
                  {attr.attribute_type === "select" && attr.options?.length ? (
                    <AttributeSelect
                      label={getName(attr)}
                      value={currentValue}
                      options={attr.options}
                      {...(attr.options_bg ? { optionsBg: attr.options_bg } : {})}
                      onChange={(value) => handleAttributeChange(attr, value)}
                      placeholder={tSell("fields.attributes.placeholders.selectWithLabel", { label: getName(attr) })}
                      compact={compact}
                      locale={locale}
                    />
                  ) : (
                    <div className={cn(
                      "relative flex items-center h-12 px-4 rounded-md border transition-colors",
                      "bg-background border-border shadow-xs focus-within:border-ring focus-within:ring-2 focus-within:ring-ring"
                    )}>
                      <label className="text-2xs font-bold uppercase tracking-wider text-muted-foreground shrink-0 mr-2">
                        {getName(attr)}:
                        <span className="text-destructive ml-1">*</span>
                      </label>
                      <Input
                        value={currentValue}
                        onChange={(e) => handleAttributeChange(attr, e.target.value)}
                        placeholder={getPlaceholder(attr) || tSell("fields.attributes.placeholders.enterWithLabel", { label: getName(attr) })}
                        type={attr.attribute_type === "number" ? "number" : "text"}
                        className="h-auto p-0 border-none bg-transparent shadow-none focus-visible:ring-0 text-sm font-semibold flex-1 min-w-0"
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Optional attributes (expandable) */}
      {!isLoading && (dbOptionalAttrs.length > 0 || dbRequiredAttrs.length > SMART_LIMIT) && (
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-2">
            <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              {tSell("fields.attributes.moreDetailsOptional")}
            </Label>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowAllDbAttributes(v => !v)}
              className="h-8 text-xs font-bold text-primary hover:bg-hover active:bg-active"
            >
              {showAllDbAttributes ? tSell("fields.attributes.toggle.hide") : tSell("fields.attributes.toggle.showAll")}
            </Button>
          </div>

          {showAllDbAttributes && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {/* Remaining required beyond smart cap */}
              {dbRequiredAttrs.slice(SMART_LIMIT).map((attr) => {
                const currentValue = attributes.find(a => a.attributeId === attr.id)?.value || "";
                return (
                  <div key={attr.id} className="space-y-1.5">
                    {!compact && (
                      <Label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider">
                        {getName(attr)}
                        <span className="text-destructive ml-1">*</span>
                      </Label>
                    )}
                    {attr.attribute_type === "select" && attr.options?.length ? (
                      <AttributeSelect
                        label={getName(attr)}
                        value={currentValue}
                        options={attr.options}
                        {...(attr.options_bg ? { optionsBg: attr.options_bg } : {})}
                        onChange={(value) => handleAttributeChange(attr, value)}
                        placeholder={tSell("fields.attributes.placeholders.selectWithLabel", { label: getName(attr) })}
                        compact={compact}
                        locale={locale}
                      />
                    ) : (
                      <div className={cn(
                        "relative flex items-center h-12 px-4 rounded-md border transition-colors",
                        "bg-background border-border shadow-xs focus-within:border-ring focus-within:ring-2 focus-within:ring-ring"
                      )}>
                        <label className="text-2xs font-bold uppercase tracking-wider text-muted-foreground shrink-0 mr-2">
                          {getName(attr)}:
                          <span className="text-destructive ml-1">*</span>
                        </label>
                        <Input
                          value={currentValue}
                          onChange={(e) => handleAttributeChange(attr, e.target.value)}
                          placeholder={getPlaceholder(attr) || tSell("fields.attributes.placeholders.enterWithLabel", { label: getName(attr) })}
                          type={attr.attribute_type === "number" ? "number" : "text"}
                          className="h-auto p-0 border-none bg-transparent shadow-none focus-visible:ring-0 text-sm font-semibold flex-1 min-w-0"
                        />
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Optional attributes */}
              {dbOptionalAttrs.map((attr) => {
                const currentValue = attributes.find(a => a.attributeId === attr.id)?.value || "";
                return (
                  <div key={attr.id} className="space-y-1.5">
                    {!compact && (
                      <Label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider">
                        {getName(attr)}
                      </Label>
                    )}
                    {attr.attribute_type === "select" && attr.options?.length ? (
                      <AttributeSelect
                        label={getName(attr)}
                        value={currentValue}
                        options={attr.options}
                        {...(attr.options_bg ? { optionsBg: attr.options_bg } : {})}
                        onChange={(value) => handleAttributeChange(attr, value)}
                        placeholder={tSell("fields.attributes.placeholders.selectWithLabel", { label: getName(attr) })}
                        compact={compact}
                        locale={locale}
                      />
                    ) : (
                      <div className={cn(
                        "relative flex items-center h-12 px-4 rounded-md border transition-colors",
                        "bg-background border-border shadow-xs focus-within:border-ring focus-within:ring-2 focus-within:ring-ring"
                      )}>
                        <label className="text-2xs font-bold uppercase tracking-wider text-muted-foreground shrink-0 mr-2">
                          {getName(attr)}:
                        </label>
                        <Input
                          value={currentValue}
                          onChange={(e) => handleAttributeChange(attr, e.target.value)}
                          placeholder={getPlaceholder(attr) || tSell("fields.attributes.placeholders.enterWithLabel", { label: getName(attr) })}
                          type={attr.attribute_type === "number" ? "number" : "text"}
                          className="h-auto p-0 border-none bg-transparent shadow-none focus-visible:ring-0 text-sm font-semibold flex-1 min-w-0"
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Fallback: category has DB attributes but no required ones */}
      {!isLoading && dbRequiredSmart.length === 0 && dbAttributes.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-wider">
            <Info className="size-4" />
            {tSell("fields.attributes.helpBuyersHint")}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {dbAttributes.map((attr) => {
              const currentValue = attributes.find(a => a.attributeId === attr.id)?.value || "";
              return (
                <div key={attr.id} className="space-y-1.5">
                  {!compact && (
                    <Label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider">
                      {getName(attr)}
                      {attr.is_required && <span className="text-destructive ml-1">*</span>}
                    </Label>
                  )}
                  {attr.attribute_type === "select" && attr.options?.length ? (
                    <AttributeSelect
                      label={getName(attr)}
                      value={currentValue}
                      options={attr.options}
                      {...(attr.options_bg ? { optionsBg: attr.options_bg } : {})}
                      onChange={(value) => handleAttributeChange(attr, value)}
                      placeholder={getPlaceholder(attr) || tSell("fields.attributes.placeholders.selectWithLabel", { label: getName(attr) })}
                      compact={compact}
                      locale={locale}
                    />
                  ) : (
                    <div className={cn(
                      "relative flex items-center h-12 px-4 rounded-md border transition-colors",
                      "bg-background border-border shadow-xs focus-within:border-ring focus-within:ring-2 focus-within:ring-ring"
                    )}>
                      <label className="text-2xs font-bold uppercase tracking-wider text-muted-foreground shrink-0 mr-2">
                        {getName(attr)}:
                        {attr.is_required && <span className="text-destructive ml-1">*</span>}
                      </label>
                      <Input
                        value={currentValue}
                        onChange={(e) => handleAttributeChange(attr, e.target.value)}
                        placeholder={getPlaceholder(attr) || tSell("fields.attributes.placeholders.enterWithLabel", { label: getName(attr) })}
                        type={attr.attribute_type === "number" ? "number" : "text"}
                        className="h-auto p-0 border-none bg-transparent shadow-none focus-visible:ring-0 text-sm font-semibold flex-1 min-w-0"
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Custom attributes */}
      {!isLoading && (
        <div className="space-y-4 pt-4 border-t border-border-subtle">
          <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            {tSell("fields.attributes.custom.title")}
          </Label>

          {customAttrs.length > 0 && (
            <div className="grid gap-2">
              {customAttrs.map((attr, index) => (
                <div key={index} className="flex items-center gap-3 rounded-md border border-border bg-surface-subtle p-3">
                  <div className="min-w-0 flex-1 flex items-center gap-2">
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider shrink-0">{attr.name}:</span>
                    <span className="truncate text-sm font-bold text-foreground">{attr.value}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveCustom(index)}
                    className="size-8 flex items-center justify-center rounded-lg hover:bg-destructive-subtle text-muted-foreground hover:text-destructive transition-colors"
                    aria-label={tSell("fields.attributes.custom.removeAriaLabel")}
                  >
                    <X className="size-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex flex-col gap-3 p-4 rounded-md bg-surface-subtle border border-dashed border-border">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-2xs font-bold text-muted-foreground uppercase tracking-wider">{tSell("fields.attributes.custom.nameLabel")}</Label>
                <Input
                  value={newAttrName}
                  onChange={(e) => setNewAttrName(e.target.value)}
                  placeholder={tSell("fields.attributes.custom.namePlaceholder")}
                  className="h-10 rounded-lg border-border font-medium text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-2xs font-bold text-muted-foreground uppercase tracking-wider">{tSell("fields.attributes.custom.valueLabel")}</Label>
                <Input
                  value={newAttrValue}
                  onChange={(e) => setNewAttrValue(e.target.value)}
                  placeholder={tSell("fields.attributes.custom.valuePlaceholder")}
                  className="h-10 rounded-lg border-border font-medium text-sm"
                />
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={handleAddCustom}
              disabled={!newAttrName.trim() || !newAttrValue.trim()}
              className="h-10 rounded-md border-selected-border text-primary font-bold text-xs uppercase tracking-widest hover:bg-hover active:bg-active"
            >
              <Plus className="size-3.5 mr-2" />
              {tSell("fields.attributes.custom.addButton")}
            </Button>
          </div>
        </div>
      )}
    </FieldContent>
  );

  return (
    <Field className={className}>
      {!compact ? (
        <div className="rounded-md border border-border bg-background overflow-hidden shadow-xs">
          <div className="p-4 pb-3 border-b border-border-subtle bg-surface-subtle">
            <div className="flex items-center gap-3.5">
              <div className="flex size-10 items-center justify-center rounded-md bg-background border border-border shadow-xs">
                <Sliders className="size-5 text-muted-foreground" />
              </div>
              <div>
                <FieldLabel className="text-sm font-bold tracking-tight text-foreground">
                  {tSell("fields.attributes.sectionTitle")}
                </FieldLabel>
                <FieldDescription className="text-xs font-medium text-muted-foreground mt-0.5">
                  {tSell("fields.attributes.sectionDescription")}
                </FieldDescription>
              </div>
            </div>
          </div>
          {content}
        </div>
      ) : (
        content
      )}
    </Field>
  );
}

export default memo(AttributesField);

