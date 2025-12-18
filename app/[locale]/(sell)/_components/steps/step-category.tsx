"use client";

import { useEffect, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import {
  FolderOpen,
  Package,
  Tag,
  Check,
  Plus,
  X,
} from "@phosphor-icons/react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { CategorySelector } from "../ui/category-modal";
import type { SellFormDataV4 } from "@/lib/sell-form-schema-v4";
import { conditionOptions } from "@/lib/sell-form-schema-v4";
import type { Category } from "../types";

interface StepCategoryProps {
  form: UseFormReturn<SellFormDataV4>;
  categories: Category[];
  locale?: string;
  onValidityChange?: (isValid: boolean) => void;
}

interface CategoryAttribute {
  id: string;
  name: string;
  name_bg?: string | null;
  attribute_type: "text" | "number" | "select" | "multiselect" | "boolean" | "date";
  is_required: boolean;
  options?: string[];
  options_bg?: string[];
  placeholder?: string;
  placeholder_bg?: string;
}

// Compact condition selector - chips style
function ConditionSelector({
  value,
  onChange,
  locale = "en",
}: {
  value: string;
  onChange: (value: string) => void;
  locale?: string;
}) {
  const isBg = locale === "bg";

  return (
    <div className="flex flex-wrap gap-2">
      {conditionOptions.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={cn(
            "h-9 px-3 rounded-full border text-sm font-medium transition-all flex items-center gap-1.5",
            value === option.value
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border bg-background hover:border-primary/50 hover:bg-muted/50"
          )}
        >
          {value === option.value && (
            <Check className="size-3.5" weight="bold" />
          )}
          {isBg ? option.labelBg : option.label}
        </button>
      ))}
    </div>
  );
}

// Compact attribute input component
function AttributeInput({
  attribute,
  value,
  onChange,
  locale = "en",
}: {
  attribute: CategoryAttribute;
  value: string;
  onChange: (value: string) => void;
  locale?: string;
}) {
  const isBg = locale === "bg";
  const name = isBg && attribute.name_bg ? attribute.name_bg : attribute.name;
  const placeholder = isBg && attribute.placeholder_bg 
    ? attribute.placeholder_bg 
    : attribute.placeholder || "";

  if (attribute.attribute_type === "boolean") {
    const yesLabel = isBg ? "Да" : "Yes";
    const noLabel = isBg ? "Не" : "No";
    return (
      <div className="space-y-1.5">
        <Label className="text-sm font-medium">
          {name}
          {attribute.is_required && <span className="text-destructive ml-0.5">*</span>}
        </Label>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onChange("true")}
            className={cn(
              "h-9 px-3 rounded-lg border text-sm font-medium transition-colors",
              value === "true"
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-background hover:border-primary/50"
            )}
          >
            {yesLabel}
          </button>
          <button
            type="button"
            onClick={() => onChange("false")}
            className={cn(
              "h-9 px-3 rounded-lg border text-sm font-medium transition-colors",
              value === "false"
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-background hover:border-primary/50"
            )}
          >
            {noLabel}
          </button>
        </div>
      </div>
    );
  }

  if (attribute.attribute_type === "date") {
    return (
      <div className="space-y-1.5">
        <Label className="text-sm font-medium">
          {name}
          {attribute.is_required && <span className="text-destructive ml-0.5">*</span>}
        </Label>
        <Input
          type="date"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-10 rounded-lg"
        />
      </div>
    );
  }

  if (attribute.attribute_type === "select" && attribute.options) {
    const options = isBg && attribute.options_bg 
      ? attribute.options_bg 
      : attribute.options;
    
    return (
      <div className="space-y-1.5">
        <Label className="text-sm font-medium">
          {name}
          {attribute.is_required && <span className="text-destructive ml-0.5">*</span>}
        </Label>
        <div className="flex flex-wrap gap-1.5">
          {options.map((opt, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onChange(attribute.options![idx])}
              className={cn(
                "h-8 px-2.5 rounded-md border text-xs font-medium transition-colors",
                value === attribute.options![idx]
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background hover:border-primary/50"
              )}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (attribute.attribute_type === "multiselect" && attribute.options) {
    const options = isBg && attribute.options_bg ? attribute.options_bg : attribute.options;
    const selected = value
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    return (
      <div className="space-y-1.5">
        <Label className="text-sm font-medium">
          {name}
          {attribute.is_required && <span className="text-destructive ml-0.5">*</span>}
        </Label>
        <div className="flex flex-wrap gap-1.5">
          {options.map((opt, idx) => {
            const storeValue = attribute.options![idx];
            const isSelected = selected.includes(storeValue);

            return (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  const next = isSelected
                    ? selected.filter((v) => v !== storeValue)
                    : [...selected, storeValue];
                  onChange(next.join(", "));
                }}
                className={cn(
                  "h-8 px-2.5 rounded-md border text-xs font-medium transition-colors",
                  isSelected
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background hover:border-primary/50"
                )}
              >
                {opt}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-medium">
        {name}
        {attribute.is_required && <span className="text-destructive ml-0.5">*</span>}
      </Label>
      <Input
        type={attribute.attribute_type === "number" ? "number" : "text"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-10 rounded-lg"
      />
    </div>
  );
}

export function StepCategory({
  form,
  categories,
  locale = "en",
  onValidityChange,
}: StepCategoryProps) {
  const isBg = locale === "bg";
  const [categoryAttributes, setCategoryAttributes] = useState<CategoryAttribute[]>([]);
  const [isLoadingAttributes, setIsLoadingAttributes] = useState(false);
  const [customAttributes, setCustomAttributes] = useState<{ name: string; value: string }[]>([]);
  const [newAttrName, setNewAttrName] = useState("");
  const [newAttrValue, setNewAttrValue] = useState("");

  const categoryId = form.watch("categoryId");
  const condition = form.watch("condition");
  const brandName = form.watch("brandName") || "";
  const attributes = form.watch("attributes") || [];

  // Check validity
  const requiredAttributeNames = categoryAttributes
    .filter((a) => a.is_required)
    .map((a) => a.name);
  const requiredAttributesFilled = requiredAttributeNames.every((name) => {
    const v = attributes.find((a) => a.name === name && !a.isCustom)?.value;
    return typeof v === "string" && v.trim().length > 0;
  });
  const isValid = !!categoryId && !!condition && !isLoadingAttributes && requiredAttributesFilled;

  // Notify parent
  useEffect(() => {
    onValidityChange?.(isValid);
  }, [isValid, onValidityChange]);

  // Fetch category attributes when category changes
  useEffect(() => {
    if (!categoryId) {
      setCategoryAttributes([]);
      return;
    }

    const fetchAttributes = async () => {
      setIsLoadingAttributes(true);
      try {
        const response = await fetch(
          `/api/categories/attributes?categoryId=${encodeURIComponent(categoryId)}`
        );
        if (response.ok) {
          const data = await response.json();
          setCategoryAttributes(data.attributes || []);
        }
      } catch (error) {
        console.error("Failed to fetch attributes:", error);
      } finally {
        setIsLoadingAttributes(false);
      }
    };

    fetchAttributes();
  }, [categoryId]);

  // Handle category change
  const handleCategoryChange = (id: string, path: Category[]) => {
    form.setValue("categoryId", id, { shouldValidate: true });
    form.setValue("categoryPath", path.map(c => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
    })), { shouldValidate: true });

    // Clear non-custom attributes when category changes to avoid stale values
    const current = form.getValues("attributes") || [];
    form.setValue(
      "attributes",
      current.filter((a) => a.isCustom),
      { shouldValidate: true }
    );
  };

  // Handle attribute change
  const handleAttributeChange = (
    attr: { id?: string; name: string },
    value: string,
    isCustom = false
  ) => {
    const existing = attributes.filter((a) => a.name !== attr.name);
    if (value && value.trim().length > 0) {
      form.setValue(
        "attributes",
        [
          ...existing,
          {
            attributeId: attr.id ?? null,
            name: attr.name,
            value,
            isCustom,
          },
        ],
        { shouldValidate: true }
      );
    } else {
      form.setValue("attributes", existing, { shouldValidate: true });
    }
  };

  // Get attribute value
  const getAttributeValue = (attrName: string) => {
    return attributes.find(a => a.name === attrName)?.value || "";
  };

  // Add custom attribute
  const addCustomAttribute = () => {
    if (newAttrName && newAttrValue) {
      setCustomAttributes(prev => [...prev, { name: newAttrName, value: newAttrValue }]);
      handleAttributeChange({ name: newAttrName }, newAttrValue, true);
      setNewAttrName("");
      setNewAttrValue("");
    }
  };

  // Remove custom attribute
  const removeCustomAttribute = (index: number) => {
    const attr = customAttributes[index];
    setCustomAttributes(prev => prev.filter((_, i) => i !== index));
    handleAttributeChange({ name: attr.name }, "", true);
  };

  // Get selected category display name
  const categoryPath = form.watch("categoryPath") || [];
  const selectedCategoryName = categoryPath.length > 0
    ? categoryPath.map(c => c.name).join(" › ")
    : "";

  return (
    <div className="flex flex-col gap-5 pb-24">
      {/* Category selector */}
      <section className="space-y-2">
        <Label className="text-sm font-semibold flex items-center gap-1.5">
          <FolderOpen className="size-4 text-primary" weight="fill" />
          {isBg ? "Категория" : "Category"}
          <span className="text-destructive">*</span>
        </Label>
        <CategorySelector
          categories={categories}
          value={categoryId}
          onChange={handleCategoryChange}
          locale={locale}
        />
        {selectedCategoryName && (
          <p className="text-xs text-muted-foreground">
            {selectedCategoryName}
          </p>
        )}
      </section>

      {/* Condition selector */}
      <section className="space-y-2">
        <Label className="text-sm font-semibold flex items-center gap-1.5">
          <Package className="size-4 text-primary" weight="fill" />
          {isBg ? "Състояние" : "Condition"}
          <span className="text-destructive">*</span>
        </Label>
        <ConditionSelector
          value={condition}
          onChange={(val) => form.setValue("condition", val as SellFormDataV4["condition"], { shouldValidate: true })}
          locale={locale}
        />
      </section>

      {/* Brand (optional) */}
      <section className="space-y-1.5">
        <Label htmlFor="brandName" className="text-sm font-semibold">
          {isBg ? "Марка" : "Brand"}
        </Label>
        <Input
          id="brandName"
          value={brandName}
          onChange={(e) => form.setValue("brandName", e.target.value)}
          placeholder={isBg ? "напр. Apple, Nike, Samsung" : "e.g. Apple, Nike, Samsung"}
          className="h-10 rounded-lg"
        />
      </section>

      {/* Category-specific attributes */}
      {categoryAttributes.length > 0 && (
        <section className="space-y-3">
          <Label className="text-sm font-semibold flex items-center gap-1.5">
            <Tag className="size-4 text-primary" weight="fill" />
            {isBg ? "Характеристики" : "Item Specifics"}
          </Label>
          <div className="space-y-3">
            {categoryAttributes.map((attr) => (
              <AttributeInput
                key={attr.id}
                attribute={attr}
                value={getAttributeValue(attr.name)}
                onChange={(val) => handleAttributeChange(attr, val, false)}
                locale={locale}
              />
            ))}
          </div>
        </section>
      )}

      {/* Custom attributes */}
      <section className="space-y-2">
        <Label className="text-sm font-semibold">
          {isBg ? "Допълнителни характеристики" : "Additional Details"}
        </Label>

        {/* Existing custom attributes */}
        {customAttributes.length > 0 && (
          <div className="space-y-1.5 mb-2">
            {customAttributes.map((attr, index) => (
              <div key={index} className="flex items-center gap-2 py-1.5 px-2.5 rounded-md bg-muted text-sm">
                <div className="flex-1 min-w-0">
                  <span className="font-medium">{attr.name}:</span>
                  <span className="text-muted-foreground ml-1.5">{attr.value}</span>
                </div>
                <button
                  type="button"
                  onClick={() => removeCustomAttribute(index)}
                  className="p-1 rounded hover:bg-background text-muted-foreground hover:text-destructive"
                >
                  <X className="size-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Add new attribute */}
        <div className="flex gap-1.5">
          <Input
            value={newAttrName}
            onChange={(e) => setNewAttrName(e.target.value)}
            placeholder={isBg ? "Характеристика" : "Attribute"}
            className="h-9 rounded-lg flex-1 text-sm"
          />
          <Input
            value={newAttrValue}
            onChange={(e) => setNewAttrValue(e.target.value)}
            placeholder={isBg ? "Стойност" : "Value"}
            className="h-9 rounded-lg flex-1 text-sm"
          />
          <button
            type="button"
            onClick={addCustomAttribute}
            disabled={!newAttrName || !newAttrValue}
            className={cn(
              "h-9 w-9 rounded-lg border flex items-center justify-center transition-colors shrink-0",
              newAttrName && newAttrValue
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : "bg-muted text-muted-foreground cursor-not-allowed"
            )}
          >
            <Plus className="size-4" />
          </button>
        </div>
        <p className="text-xs text-muted-foreground">
          {isBg
            ? "Добавете допълнителни детайли като размер, цвят, материал..."
            : "Add extra details like size, color, material..."}
        </p>
      </section>
    </div>
  );
}
