"use client";

import { useState, useEffect, useCallback, memo, useMemo } from "react";
import { Sliders, Plus, X, Info, SpinnerGap, WarningCircle, CheckCircle } from "@phosphor-icons/react";
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
import { Field, FieldLabel, FieldDescription, FieldContent } from "@/components/ui/field";
import { cn } from "@/lib/utils";
import type { ProductAttribute } from "@/lib/sell-form-schema-v4";
import { useSellForm, useSellFormContext } from "../sell-form-provider";
import { 
  getCategoryConfigFromPath,
  isAttributeFilled
} from "@/lib/category-attribute-config";

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

// ============================================================================
// ATTRIBUTES FIELD - Dynamic category-aware attributes
// Shows required attributes based on category (e.g., Make/Model for vehicles)
// ============================================================================

interface AttributesFieldProps {
  /** Custom class name for the field wrapper */
  className?: string;
  /** Use compact layout */
  compact?: boolean;
}

export function AttributesField({ className, compact = false }: AttributesFieldProps) {
  const { setValue, watch } = useSellForm();
  const { isBg } = useSellFormContext();

  // Watch form values - memoize to prevent unnecessary re-renders
  const categoryId = watch("categoryId");
  const categoryPath = watch("categoryPath");
  const watchedAttributes = watch("attributes");
  const attributes = useMemo(() => watchedAttributes || [], [watchedAttributes]);

  // Get category-specific config based on selected category path
  const categoryConfig = useMemo(() => {
    return getCategoryConfigFromPath(categoryPath);
  }, [categoryPath]);

  // Local state for DB-based attributes
  const [dbAttributes, setDbAttributes] = useState<CategoryAttribute[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [newAttrName, setNewAttrName] = useState("");
  const [newAttrValue, setNewAttrValue] = useState("");

  // Fetch category attributes from database when category changes
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
          setDbAttributes(data || []);
        }
      } catch (error) {
        console.error("Failed to fetch category attributes:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAttributes();
  }, [categoryId]);

  // Handle predefined attribute change (from DB)
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

  // Handle config-based attribute change (from category config)
  const handleConfigAttributeChange = useCallback((attrKey: string, value: string) => {
    const existing = attributes.find(a => a.name === attrKey);
    let newAttrs: ProductAttribute[];

    if (existing) {
      if (value) {
        newAttrs = attributes.map(a => 
          a.name === attrKey ? { ...a, value } : a
        );
      } else {
        newAttrs = attributes.filter(a => a.name !== attrKey);
      }
    } else if (value) {
      newAttrs = [...attributes, {
        attributeId: null,
        name: attrKey,
        value,
        isCustom: false,
      }];
    } else {
      newAttrs = attributes;
    }

    setValue("attributes", newAttrs, { shouldValidate: true });
  }, [attributes, setValue]);

  // Get current value for a config-based attribute
  const getConfigAttrValue = useCallback((attrKey: string) => {
    const attr = attributes.find(a => a.name === attrKey);
    return attr?.value || "";
  }, [attributes]);

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

  // Helper functions for localization
  const getName = useCallback((attr: CategoryAttribute) => 
    isBg && attr.name_bg ? attr.name_bg : attr.name, [isBg]);

  const getPlaceholder = useCallback((attr: CategoryAttribute) =>
    isBg && attr.placeholder_bg ? attr.placeholder_bg : attr.placeholder, [isBg]);

  const customAttrs = useMemo(() => attributes.filter(a => a.isCustom), [attributes]);

  // Check completion status for required attributes
  const requiredAttrsCount = categoryConfig?.requiredAttributes?.length || 0;
  const filledRequiredCount = useMemo(() => {
    return categoryConfig?.requiredAttributes?.filter(
      attr => isAttributeFilled(getConfigAttrValue(attr.key))
    ).length || 0;
  }, [categoryConfig, getConfigAttrValue]);

  // If no category selected
  if (!categoryId) {
    return (
      <div className={cn("rounded-xl border border-dashed border-border bg-muted/30 p-4", className)}>
        <p className="text-sm text-muted-foreground text-center">
          {isBg ? "Изберете категория, за да видите спецификациите" : "Select a category to see item specifics"}
        </p>
      </div>
    );
  }

  const content = (
    <FieldContent className={cn("space-y-5", !compact && "p-5")}>
          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center p-8">
              <SpinnerGap className="size-6 animate-spin text-primary" />
            </div>
          )}

          {/* Category-Specific Required Attributes (from config) */}
          {!isLoading && categoryConfig && categoryConfig.requiredAttributes.length > 0 && (
            <div className="space-y-4">
              {/* Header with completion indicator */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  {filledRequiredCount === requiredAttrsCount ? (
                    <CheckCircle className="size-4 text-primary" weight="fill" />
                  ) : (
                    <WarningCircle className="size-4 text-muted-foreground" weight="fill" />
                  )}
                  <span className="text-foreground">
                    {isBg ? "Задължителни характеристики" : "Required specifications"}
                  </span>
                </div>
                <span className="text-sm text-muted-foreground tabular-nums">
                  {filledRequiredCount}/{requiredAttrsCount}
                </span>
              </div>
              
              {/* Required attributes grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {categoryConfig.requiredAttributes.map((attr) => {
                  const currentValue = getConfigAttrValue(attr.key);
                  const label = isBg ? attr.name.bg : attr.name.en;
                  const placeholder = attr.placeholder 
                    ? (isBg ? attr.placeholder.bg : attr.placeholder.en)
                    : undefined;
                  
                  return (
                    <div key={attr.key}>
                      <Label className="block text-sm font-medium text-foreground mb-1.5">
                        {label}
                        <span className="text-destructive ml-1">*</span>
                      </Label>
                      
                      {attr.type === "select" && attr.options?.length ? (
                        <Select
                          value={currentValue || undefined}
                          onValueChange={(value) => handleConfigAttributeChange(attr.key, value)}
                        >
                          <SelectTrigger className="w-full h-11">
                            <SelectValue placeholder={`${isBg ? "Избери" : "Select"}...`} />
                          </SelectTrigger>
                          <SelectContent>
                            {attr.options.map((opt) => (
                              <SelectItem key={opt.value} value={opt.value}>
                                {isBg ? opt.label.bg : opt.label.en}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <Input
                          value={currentValue}
                          onChange={(e) => handleConfigAttributeChange(attr.key, e.target.value)}
                          placeholder={placeholder || `${isBg ? "Въведи" : "Enter"}...`}
                          type={attr.type === "number" ? "number" : "text"}
                          className="h-11"
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Optional attributes from config */}
          {!isLoading && categoryConfig?.optionalAttributes && categoryConfig.optionalAttributes.length > 0 && (
            <div className="space-y-4 pt-2">
              <Label className="text-sm font-medium text-muted-foreground">
                {isBg ? "Препоръчителни (по желание)" : "Recommended (optional)"}
              </Label>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {categoryConfig.optionalAttributes.map((attr) => {
                  const currentValue = getConfigAttrValue(attr.key);
                  const label = isBg ? attr.name.bg : attr.name.en;
                  const placeholder = attr.placeholder 
                    ? (isBg ? attr.placeholder.bg : attr.placeholder.en)
                    : undefined;
                  
                  return (
                    <div key={attr.key}>
                      <Label className="block text-sm font-medium text-foreground mb-1.5">
                        {label}
                      </Label>
                      
                      {attr.type === "select" && attr.options?.length ? (
                        <Select
                          value={currentValue || undefined}
                          onValueChange={(value) => handleConfigAttributeChange(attr.key, value)}
                        >
                          <SelectTrigger className="w-full h-11">
                            <SelectValue placeholder={`${isBg ? "Избери" : "Select"}...`} />
                          </SelectTrigger>
                          <SelectContent>
                            {attr.options.map((opt) => (
                              <SelectItem key={opt.value} value={opt.value}>
                                {isBg ? opt.label.bg : opt.label.en}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <Input
                          value={currentValue}
                          onChange={(e) => handleConfigAttributeChange(attr.key, e.target.value)}
                          placeholder={placeholder || `${isBg ? "Въведи" : "Enter"}...`}
                          type={attr.type === "number" ? "number" : "text"}
                          className="h-11"
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Database-based Predefined Attributes (fallback when no config) */}
          {!isLoading && !categoryConfig && dbAttributes.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Info className="size-4" />
                {isBg ? "Спецификациите помагат на купувачите да намерят обявата ви" : "Item specifics help buyers find your listing"}
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {dbAttributes.map((attr) => {
                  const currentValue = attributes.find(a => a.attributeId === attr.id)?.value || "";
                  
                  return (
                    <div key={attr.id}>
                      <Label className="block text-sm font-medium text-foreground mb-1.5">
                        {getName(attr)}
                        {attr.is_required && <span className="text-destructive ml-1">*</span>}
                      </Label>
                      
                      {attr.attribute_type === "select" && attr.options?.length ? (
                        <Select
                          value={currentValue || undefined}
                          onValueChange={(value) => handleAttributeChange(attr, value)}
                        >
                          <SelectTrigger className="w-full h-11">
                            <SelectValue placeholder={`${isBg ? "Избери" : "Select"} ${getName(attr)}`} />
                          </SelectTrigger>
                          <SelectContent>
                            {attr.options.map((opt, i) => (
                              <SelectItem key={opt} value={opt}>
                                {isBg && attr.options_bg?.[i] ? attr.options_bg[i] : opt}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <Input
                          value={currentValue}
                          onChange={(e) => handleAttributeChange(attr, e.target.value)}
                          placeholder={getPlaceholder(attr) || `${isBg ? "Въведи" : "Enter"} ${getName(attr)}`}
                          type={attr.attribute_type === "number" ? "number" : "text"}
                          className="h-11"
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Custom Attributes */}
          {!isLoading && (
            <div className="space-y-3">
              <Label className="text-sm font-medium">
                {isBg ? "Допълнителни характеристики" : "Custom Attributes"}
              </Label>
              
              {/* Existing Custom Attributes */}
              {customAttrs.length > 0 && (
                <div className="space-y-2">
                  {customAttrs.map((attr, index) => (
                    <div key={index} className="flex items-center gap-2 rounded-md border border-border bg-muted/50 p-3">
                      <div className="min-w-0 flex-1 grid grid-cols-1 gap-0.5 sm:grid-cols-2 sm:gap-2">
                        <span className="truncate text-sm font-medium">{attr.name}</span>
                        <span className="truncate text-sm text-muted-foreground">{attr.value}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveCustom(index)}
                        className="p-1.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                        aria-label={isBg ? "Премахни" : "Remove"}
                      >
                        <X className="size-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Add New Custom Attribute */}
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
                <div className="col-span-2 sm:col-span-1 space-y-1.5">
                  <Label className="text-sm font-medium">{isBg ? "Име" : "Name"}</Label>
                  <Input
                    value={newAttrName}
                    onChange={(e) => setNewAttrName(e.target.value)}
                    placeholder={isBg ? "напр. Материал" : "e.g., Material"}
                    className="h-11"
                  />
                </div>
                <div className="col-span-2 sm:col-span-1 space-y-1.5">
                  <Label className="text-sm font-medium">{isBg ? "Стойност" : "Value"}</Label>
                  <Input
                    value={newAttrValue}
                    onChange={(e) => setNewAttrValue(e.target.value)}
                    placeholder={isBg ? "напр. Памук" : "e.g., Cotton"}
                    className="h-11"
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={handleAddCustom}
                  disabled={!newAttrName.trim() || !newAttrValue.trim()}
                  className="col-span-2 justify-self-end h-11 w-11 shrink-0 sm:col-span-1"
                  aria-label={isBg ? "Добави характеристика" : "Add attribute"}
                >
                  <Plus className="size-4" />
                </Button>
              </div>
            </div>
          )}
    </FieldContent>
  );

  return (
    <Field className={className}>
      {!compact ? (
        <div className="rounded-xl border border-border bg-background overflow-hidden shadow-xs">
          {/* Header */}
          <div className="p-5 pb-4 border-b border-border/50 bg-muted/10">
            <div className="flex items-center gap-3.5">
              <div className="flex size-10 items-center justify-center rounded-md bg-background border border-border shadow-xs">
                <Sliders className="size-5 text-muted-foreground" weight="bold" />
              </div>
              <div>
                <FieldLabel className="text-sm font-bold tracking-tight text-foreground">
                  {isBg ? "Характеристики" : "Item Specifics"}
                </FieldLabel>
                <FieldDescription className="text-xs font-medium text-muted-foreground mt-0.5">
                  {isBg
                    ? "Добавете детайли, за да помогнете на купувачите да намерят продукта"
                    : "Add details to help buyers find your product"}
                </FieldDescription>
              </div>
            </div>
          </div>

          {content}
        </div>
      ) : (
        <>
          <div className="flex items-center gap-2 mb-2">
            <Sliders className="size-4 text-muted-foreground" weight="bold" />
            <FieldLabel className="text-sm font-medium">
              {isBg ? "Характеристики" : "Item specifics"}
            </FieldLabel>
          </div>
          {content}
        </>
      )}
    </Field>
  );
}

/**
 * Memoized AttributesField - Dynamic attributes and custom item specifics.
 * Optimized to prevent unnecessary re-renders when unrelated form state changes.
 * @see useSellForm - Hook for form state access
 * @see useSellFormContext - Hook for context access
 */
export const MemoizedAttributesField = memo(AttributesField);
