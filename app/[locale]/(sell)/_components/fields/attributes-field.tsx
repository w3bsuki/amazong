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
import { Field, FieldLabel, FieldDescription, FieldContent } from "@/components/common/field";
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

  // Some categories use a dedicated Brand/Make field instead of an attribute.
  // Keep them in sync without forcing duplicate inputs.
  const brandName = watch("brandName");

  // Local state for DB-based attributes
  const [dbAttributes, setDbAttributes] = useState<CategoryAttribute[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [newAttrName, setNewAttrName] = useState("");
  const [newAttrValue, setNewAttrValue] = useState("");
  const [showAllDbAttributes, setShowAllDbAttributes] = useState(false);

  // Fetch category attributes from database when category changes
  useEffect(() => {
    if (!categoryId) {
      setDbAttributes([]);
      return;
    }

    const fetchAttributes = async () => {
      setIsLoading(true);
      try {
        // Note: our API is implemented as `/api/categories/[slug]/attributes` (accepts slug OR UUID).
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

          // The `[slug]/attributes` endpoint returns a formatted shape (e.g. `nameBg`, `sortOrder`).
          // Normalize to the internal `CategoryAttribute` shape used by this field.
          const normalized = (maybeAttributes as any[]).map((attr) => ({
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

  // DB attributes split: required + optional
  const dbRequiredAttrs = useMemo(
    () => dbAttributes.filter((a) => a.is_required).sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)),
    [dbAttributes]
  );
  const dbOptionalAttrs = useMemo(
    () => dbAttributes.filter((a) => !a.is_required).sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)),
    [dbAttributes]
  );

  // "Smart + main" subset: cap required fields to keep the form light.
  // Most categories already mark core fields as required in DB; we just avoid showing dozens at once.
  const SMART_REQUIRED_LIMIT = 6;
  const dbRequiredSmart = useMemo(
    () => dbRequiredAttrs.slice(0, SMART_REQUIRED_LIMIT),
    [dbRequiredAttrs]
  );

  // Check completion status for required attributes
  const requiredAttrsCount = categoryConfig?.requiredAttributes?.length || 0;
  const filledRequiredCount = useMemo(() => {
    return categoryConfig?.requiredAttributes?.filter(
      attr => isAttributeFilled(getConfigAttrValue(attr.key))
    ).length || 0;
  }, [categoryConfig, getConfigAttrValue]);

  // Patch compatibility: older configs use snake_case keys, but DB indexes and UI expect consistent keys.
  // Normalize the handful of known fields so the UI shows/reads the correct values.
  const normalizeConfigKey = useCallback((key: string) => {
    switch (key) {
      case "fuel_type":
        return "fuelType";
      case "engine_size":
        return "engineSize";
      default:
        return key;
    }
  }, []);

  // Completion for DB-required smart fields
  const dbRequiredSmartCount = dbRequiredSmart.length;
  const filledDbRequiredSmartCount = useMemo(() => {
    return dbRequiredSmart.reduce((acc, attr) => {
      const v = attributes.find((a) => a.attributeId === attr.id)?.value || "";
      return acc + (isAttributeFilled(v) ? 1 : 0);
    }, 0);
  }, [attributes, dbRequiredSmart]);

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

          {/* Primary: Database-driven (smart + main) required attributes */}
          {!isLoading && dbRequiredSmart.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-sm font-bold">
                  {filledDbRequiredSmartCount === dbRequiredSmartCount ? (
                    <CheckCircle className="size-4 text-primary" weight="fill" />
                  ) : (
                    <WarningCircle className="size-4 text-muted-foreground" weight="fill" />
                  )}
                  <span className="text-foreground uppercase tracking-wider text-[11px]">
                    {isBg ? "Основни характеристики" : "Main specifics"}
                  </span>
                </div>
                <span className="text-xs font-bold text-muted-foreground tabular-nums bg-muted/50 px-2 py-0.5 rounded-full">
                  {filledDbRequiredSmartCount}/{dbRequiredSmartCount}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {dbRequiredSmart.map((attr) => {
                  const currentValue = attributes.find((a) => a.attributeId === attr.id)?.value || "";
                  return (
                    <div key={attr.id} className="space-y-1.5">
                      <Label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider">
                        {getName(attr)}
                        <span className="text-destructive ml-1">*</span>
                      </Label>

                      {attr.attribute_type === "select" && attr.options?.length ? (
                        <Select
                          value={currentValue || undefined}
                          onValueChange={(value) => handleAttributeChange(attr, value)}
                        >
                          <SelectTrigger className="w-full h-12 rounded-xl border-border font-medium">
                            <SelectValue placeholder={`${isBg ? "Избери" : "Select"} ${getName(attr)}`} />
                          </SelectTrigger>
                          <SelectContent>
                            {attr.options.map((opt, i) => (
                              <SelectItem key={opt} value={opt} className="font-medium">
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
                          className="h-12 rounded-xl border-border font-medium"
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Optional DB attributes: hidden by default */}
          {!isLoading && (dbOptionalAttrs.length > 0 || dbRequiredAttrs.length > dbRequiredSmart.length) && (
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <Label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                  {isBg ? "Още детайли (по желание)" : "More details (optional)"}
                </Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAllDbAttributes((v) => !v)}
                  className="h-8 text-xs font-bold text-primary hover:bg-primary/5"
                >
                  {showAllDbAttributes
                    ? (isBg ? "Скрий" : "Hide")
                    : (isBg ? "Покажи всички" : "Show all")}
                </Button>
              </div>

              {showAllDbAttributes && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  {/* Remaining required beyond the smart cap */}
                  {dbRequiredAttrs.slice(SMART_REQUIRED_LIMIT).map((attr) => {
                    const currentValue = attributes.find((a) => a.attributeId === attr.id)?.value || "";
                    return (
                      <div key={attr.id} className="space-y-1.5">
                        <Label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider">
                          {getName(attr)}
                          <span className="text-destructive ml-1">*</span>
                        </Label>
                        {attr.attribute_type === "select" && attr.options?.length ? (
                          <Select
                            value={currentValue || undefined}
                            onValueChange={(value) => handleAttributeChange(attr, value)}
                          >
                            <SelectTrigger className="w-full h-12 rounded-xl border-border font-medium">
                              <SelectValue placeholder={`${isBg ? "Избери" : "Select"} ${getName(attr)}`} />
                            </SelectTrigger>
                            <SelectContent>
                              {attr.options.map((opt, i) => (
                                <SelectItem key={opt} value={opt} className="font-medium">
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
                            className="h-12 rounded-xl border-border font-medium"
                          />
                        )}
                      </div>
                    );
                  })}

                  {/* Optional attributes */}
                  {dbOptionalAttrs.map((attr) => {
                    const currentValue = attributes.find((a) => a.attributeId === attr.id)?.value || "";
                    return (
                      <div key={attr.id} className="space-y-1.5">
                        <Label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider">
                          {getName(attr)}
                        </Label>
                        {attr.attribute_type === "select" && attr.options?.length ? (
                          <Select
                            value={currentValue || undefined}
                            onValueChange={(value) => handleAttributeChange(attr, value)}
                          >
                            <SelectTrigger className="w-full h-12 rounded-xl border-border font-medium">
                              <SelectValue placeholder={`${isBg ? "Избери" : "Select"} ${getName(attr)}`} />
                            </SelectTrigger>
                            <SelectContent>
                              {attr.options.map((opt, i) => (
                                <SelectItem key={opt} value={opt} className="font-medium">
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
                            className="h-12 rounded-xl border-border font-medium"
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Category-Specific Required Attributes (from config) */}
          {!isLoading && dbRequiredSmart.length === 0 && categoryConfig && categoryConfig.requiredAttributes.length > 0 && (
            <div className="space-y-4">
              {/* Header with completion indicator */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-sm font-bold">
                  {filledRequiredCount === requiredAttrsCount ? (
                    <CheckCircle className="size-4 text-primary" weight="fill" />
                  ) : (
                    <WarningCircle className="size-4 text-muted-foreground" weight="fill" />
                  )}
                  <span className="text-foreground uppercase tracking-wider text-[11px]">
                    {isBg ? "Задължителни характеристики" : "Required specifications"}
                  </span>
                </div>
                <span className="text-xs font-bold text-muted-foreground tabular-nums bg-muted/50 px-2 py-0.5 rounded-full">
                  {filledRequiredCount}/{requiredAttrsCount}
                </span>
              </div>
              
              {/* Required attributes grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {categoryConfig.requiredAttributes.map((attr) => {
                  const key = normalizeConfigKey(attr.key);
                  // Special-case: if the category renames Brand to Make, prefer `brandName` for Make.
                  const currentValue = key === "make" && brandName ? brandName : getConfigAttrValue(key);
                  const label = isBg ? attr.name.bg : attr.name.en;
                  const placeholder = attr.placeholder 
                    ? (isBg ? attr.placeholder.bg : attr.placeholder.en)
                    : undefined;
                  
                  return (
                    <div key={attr.key} className="space-y-1.5">
                      <Label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider">
                        {label}
                        <span className="text-destructive ml-1">*</span>
                      </Label>
                      
                      {attr.type === "select" && attr.options?.length ? (
                        <Select
                          value={currentValue || undefined}
                          onValueChange={(value) => {
                            if (key === "make") {
                              setValue("brandName", value, { shouldValidate: false, shouldDirty: true });
                              return;
                            }
                            handleConfigAttributeChange(key, value);
                          }}
                        >
                          <SelectTrigger className="w-full h-12 rounded-xl border-border font-medium">
                            <SelectValue placeholder={`${isBg ? "Избери" : "Select"}...`} />
                          </SelectTrigger>
                          <SelectContent>
                            {attr.options.map((opt) => (
                              <SelectItem key={opt.value} value={opt.value} className="font-medium">
                                {isBg ? opt.label.bg : opt.label.en}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <Input
                          value={currentValue}
                          onChange={(e) => {
                            if (key === "make") {
                              setValue("brandName", e.target.value, { shouldValidate: false, shouldDirty: true });
                              return;
                            }
                            handleConfigAttributeChange(key, e.target.value);
                          }}
                          placeholder={placeholder || `${isBg ? "Въведи" : "Enter"}...`}
                          type={attr.type === "number" ? "number" : "text"}
                          className="h-12 rounded-xl border-border font-medium"
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Optional attributes from config */}
          {!isLoading && dbRequiredSmart.length === 0 && categoryConfig?.optionalAttributes && categoryConfig.optionalAttributes.length > 0 && (
            <div className="space-y-4 pt-2">
              <Label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                {isBg ? "Препоръчителни (по желание)" : "Recommended (optional)"}
              </Label>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {categoryConfig.optionalAttributes.map((attr) => {
                  const key = normalizeConfigKey(attr.key);
                  const currentValue = key === "make" && brandName ? brandName : getConfigAttrValue(key);
                  const label = isBg ? attr.name.bg : attr.name.en;
                  const placeholder = attr.placeholder 
                    ? (isBg ? attr.placeholder.bg : attr.placeholder.en)
                    : undefined;
                  
                  return (
                    <div key={attr.key} className="space-y-1.5">
                      <Label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider">
                        {label}
                      </Label>
                      
                      {attr.type === "select" && attr.options?.length ? (
                        <Select
                          value={currentValue || undefined}
                          onValueChange={(value) => {
                            if (key === "make") {
                              setValue("brandName", value, { shouldValidate: false, shouldDirty: true });
                              return;
                            }
                            handleConfigAttributeChange(key, value);
                          }}
                        >
                          <SelectTrigger className="w-full h-12 rounded-xl border-border font-medium">
                            <SelectValue placeholder={`${isBg ? "Избери" : "Select"}...`} />
                          </SelectTrigger>
                          <SelectContent>
                            {attr.options.map((opt) => (
                              <SelectItem key={opt.value} value={opt.value} className="font-medium">
                                {isBg ? opt.label.bg : opt.label.en}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <Input
                          value={currentValue}
                          onChange={(e) => {
                            if (key === "make") {
                              setValue("brandName", e.target.value, { shouldValidate: false, shouldDirty: true });
                              return;
                            }
                            handleConfigAttributeChange(key, e.target.value);
                          }}
                          placeholder={placeholder || `${isBg ? "Въведи" : "Enter"}...`}
                          type={attr.type === "number" ? "number" : "text"}
                          className="h-12 rounded-xl border-border font-medium"
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Database-based Predefined Attributes (fallback when no config) */}
          {!isLoading && dbRequiredSmart.length === 0 && !categoryConfig && dbAttributes.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                <Info className="size-4" weight="bold" />
                {isBg ? "Спецификациите помагат на купувачите" : "Item specifics help buyers"}
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {dbAttributes.map((attr) => {
                  const currentValue = attributes.find(a => a.attributeId === attr.id)?.value || "";
                  
                  return (
                    <div key={attr.id} className="space-y-1.5">
                      <Label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider">
                        {getName(attr)}
                        {attr.is_required && <span className="text-destructive ml-1">*</span>}
                      </Label>
                      
                      {attr.attribute_type === "select" && attr.options?.length ? (
                        <Select
                          value={currentValue || undefined}
                          onValueChange={(value) => handleAttributeChange(attr, value)}
                        >
                          <SelectTrigger className="w-full h-12 rounded-xl border-border font-medium">
                            <SelectValue placeholder={`${isBg ? "Избери" : "Select"} ${getName(attr)}`} />
                          </SelectTrigger>
                          <SelectContent>
                            {attr.options.map((opt, i) => (
                              <SelectItem key={opt} value={opt} className="font-medium">
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
                          className="h-12 rounded-xl border-border font-medium"
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
            <div className="space-y-4 pt-4 border-t border-border/50">
              <Label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                {isBg ? "Допълнителни характеристики" : "Custom Attributes"}
              </Label>
              
              {/* Existing Custom Attributes */}
              {customAttrs.length > 0 && (
                <div className="grid gap-2">
                  {customAttrs.map((attr, index) => (
                    <div key={index} className="flex items-center gap-3 rounded-xl border border-border bg-muted/30 p-3">
                      <div className="min-w-0 flex-1 flex items-center gap-2">
                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider shrink-0">{attr.name}:</span>
                        <span className="truncate text-sm font-bold text-foreground">{attr.value}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveCustom(index)}
                        className="size-8 flex items-center justify-center rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                        aria-label={isBg ? "Премахни" : "Remove"}
                      >
                        <X className="size-4" weight="bold" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Add New Custom Attribute */}
              <div className="flex flex-col gap-3 p-4 rounded-2xl bg-muted/20 border border-dashed border-border">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{isBg ? "Име" : "Name"}</Label>
                    <Input
                      value={newAttrName}
                      onChange={(e) => setNewAttrName(e.target.value)}
                      placeholder={isBg ? "напр. Материал" : "e.g., Material"}
                      className="h-10 rounded-lg border-border font-medium text-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{isBg ? "Стойност" : "Value"}</Label>
                    <Input
                      value={newAttrValue}
                      onChange={(e) => setNewAttrValue(e.target.value)}
                      placeholder={isBg ? "напр. Памук" : "e.g., Cotton"}
                      className="h-10 rounded-lg border-border font-medium text-sm"
                    />
                  </div>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddCustom}
                  disabled={!newAttrName.trim() || !newAttrValue.trim()}
                  className="h-10 rounded-xl border-primary/20 text-primary font-bold text-xs uppercase tracking-widest hover:bg-primary/5"
                >
                  <Plus className="size-3.5 mr-2" weight="bold" />
                  {isBg ? "Добави характеристика" : "Add attribute"}
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
