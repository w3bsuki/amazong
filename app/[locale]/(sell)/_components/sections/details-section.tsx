"use client";

import { useCallback, useEffect, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import {
  Sparkle,
  TextB,
  TextItalic,
  List,
  Package,
  Info,
  Plus,
  X,
} from "@phosphor-icons/react";
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
import { cn } from "@/lib/utils";
import { CategorySelector } from "../ui/category-modal";
import { BrandPicker } from "../ui/brand-picker";
import type { SellFormDataV4, ProductAttribute } from "@/lib/sell-form-schema-v4";
import { conditionOptions } from "@/lib/sell-form-schema-v4";
import type { Category } from "../types";

interface Brand {
  id: string;
  name: string;
  slug: string;
  logo_url?: string | null;
  is_verified?: boolean;
}

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

interface DetailsSectionProps {
  form: UseFormReturn<SellFormDataV4>;
  categories: Category[];
  brands?: Brand[];
  locale?: string;
  onCategoryChange?: (categoryId: string, path: Category[]) => void;
}

// ============================================================================
// Rich Textarea Component
// ============================================================================
function RichTextarea({
  value,
  onChange,
  placeholder,
  maxLength = 2000,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  maxLength?: number;
}) {
  const charCount = value?.length || 0;

  return (
    <div className="rounded-xl border border-border/60 shadow-xs focus-within:border-primary/50 focus-within:ring-4 focus-within:ring-primary/5 transition-all overflow-hidden bg-background">
      <div className="flex items-center gap-0.5 border-b border-border/40 bg-muted/30 px-2 py-1.5">
        <button
          type="button"
          className="rounded-md p-1.5 text-muted-foreground hover:bg-background hover:text-foreground transition-colors"
          title="Bold"
        >
          <TextB className="h-4 w-4" weight="bold" />
        </button>
        <button
          type="button"
          className="rounded-md p-1.5 text-muted-foreground hover:bg-background hover:text-foreground transition-colors"
          title="Italic"
        >
          <TextItalic className="h-4 w-4" weight="bold" />
        </button>
        <button
          type="button"
          className="rounded-md p-1.5 text-muted-foreground hover:bg-background hover:text-foreground transition-colors"
          title="List"
        >
          <List className="h-4 w-4" weight="bold" />
        </button>
        <div className="flex-1" />
        <div className="px-2 py-1 rounded bg-background/50 border border-border/40">
          <Sparkle className="h-3.5 w-3.5 text-primary" weight="bold" />
        </div>
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        className="block w-full resize-none border-0 bg-transparent px-4 py-3 text-sm font-medium placeholder:text-muted-foreground/40 focus:ring-0 focus:outline-none min-h-40 leading-relaxed"
      />
      <div className="flex items-center justify-end border-t border-border/30 bg-muted/10 px-3 py-1.5">
        <span className={cn(
          "text-[10px] font-bold tabular-nums",
          charCount > maxLength * 0.9 ? "text-destructive" : "text-muted-foreground/50"
        )}>
          {charCount}/{maxLength}
        </span>
      </div>
    </div>
  );
}
  );
}

// ============================================================================
// Item Specifics / Attributes Section
// ============================================================================
function ItemSpecificsSection({
  categoryId,
  attributes,
  onChange,
  locale = "en",
}: {
  categoryId: string;
  attributes: ProductAttribute[];
  onChange: (attrs: ProductAttribute[]) => void;
  locale?: string;
}) {
  const [categoryAttributes, setCategoryAttributes] = useState<CategoryAttribute[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [newAttrName, setNewAttrName] = useState("");
  const [newAttrValue, setNewAttrValue] = useState("");
  const isBg = locale === "bg";
  void isBg; // Used for localization in placeholder text

  // Fetch category attributes when category changes
  useEffect(() => {
    if (!categoryId) {
      setCategoryAttributes([]);
      return;
    }

    const fetchAttributes = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/categories/${categoryId}/attributes`);
        if (response.ok) {
          const data = await response.json();
          setCategoryAttributes(data || []);
        }
      } catch (error) {
        console.error("Failed to fetch category attributes:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAttributes();
  }, [categoryId]);

  // Handle predefined attribute change
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

    onChange(newAttrs);
  }, [attributes, onChange]);

  // Add custom attribute
  const handleAddCustom = useCallback(() => {
    if (!newAttrName.trim() || !newAttrValue.trim()) return;

    const newAttr: ProductAttribute = {
      attributeId: null,
      name: newAttrName.trim(),
      value: newAttrValue.trim(),
      isCustom: true,
    };

    onChange([...attributes, newAttr]);
    setNewAttrName("");
    setNewAttrValue("");
  }, [newAttrName, newAttrValue, attributes, onChange]);

  // Remove custom attribute
  const handleRemoveCustom = useCallback((index: number) => {
    const customs = attributes.filter(a => a.isCustom);
    const customToRemove = customs[index];
    onChange(attributes.filter(a => a !== customToRemove));
  }, [attributes, onChange]);

  const getName = (attr: CategoryAttribute) => 
    locale === "bg" && attr.name_bg ? attr.name_bg : attr.name;

  const getPlaceholder = (attr: CategoryAttribute) =>
    locale === "bg" && attr.placeholder_bg ? attr.placeholder_bg : attr.placeholder;

  if (!categoryId) {
    return (
      <div className="p-4 rounded-lg bg-muted/50 border border-dashed border-border">
        <p className="text-sm text-muted-foreground text-center">
          Select a category to see item specifics
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-4 rounded-lg bg-muted/50">
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-muted rounded w-1/4" />
          <div className="h-10 bg-muted rounded" />
          <div className="h-10 bg-muted rounded" />
        </div>
      </div>
    );
  }

  const customAttrs = attributes.filter(a => a.isCustom);

  return (
    <div className="space-y-4">
      {/* Predefined Attributes */}
      {categoryAttributes.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <Info className="h-3.5 w-3.5" />
            Item Specifics help buyers find your listing
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {categoryAttributes.map((attr) => {
              const currentValue = attributes.find(a => a.attributeId === attr.id)?.value || "";
              
              return (
                <div key={attr.id}>
                  <label className="block text-xs font-medium text-foreground mb-1.5">
                    {getName(attr)}
                    {attr.is_required && <span className="text-destructive ml-1">*</span>}
                  </label>
                  
                  {attr.attribute_type === "select" && attr.options?.length ? (
                    <Select
                      value={currentValue || undefined}
                      onValueChange={(value) => handleAttributeChange(attr, value)}
                    >
                      <SelectTrigger className="w-full h-10 rounded-lg">
                        <SelectValue placeholder={`Select ${getName(attr)}`} />
                      </SelectTrigger>
                      <SelectContent>
                        {attr.options.map((opt, i) => (
                          <SelectItem key={opt} value={opt}>
                            {locale === "bg" && attr.options_bg?.[i] ? attr.options_bg[i] : opt}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input
                      value={currentValue}
                      onChange={(e) => handleAttributeChange(attr, e.target.value)}
                      placeholder={getPlaceholder(attr) || `Enter ${getName(attr)}`}
                      type={attr.attribute_type === "number" ? "number" : "text"}
                      className="rounded-lg h-10"
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Custom Attributes */}
      <div className="border-t border-border pt-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium text-muted-foreground">
            Custom details (optional)
          </span>
        </div>

        {/* Existing Custom */}
        {customAttrs.length > 0 && (
          <div className="space-y-2 mb-3">
            {customAttrs.map((attr, idx) => (
              <div key={idx} className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
                <span className="text-sm font-medium text-foreground min-w-[100px]">
                  {attr.name}:
                </span>
                <span className="text-sm text-muted-foreground flex-1">
                  {attr.value}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemoveCustom(idx)}
                  className="p-1 rounded hover:bg-muted"
                >
                  <X className="h-3.5 w-3.5 text-muted-foreground" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Add New Custom */}
        <div className="flex gap-2">
          <Input
            value={newAttrName}
            onChange={(e) => setNewAttrName(e.target.value)}
            placeholder="Detail name"
            className="rounded-lg h-9 text-sm flex-1"
          />
          <Input
            value={newAttrValue}
            onChange={(e) => setNewAttrValue(e.target.value)}
            placeholder="Value"
            className="rounded-lg h-9 text-sm flex-1"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddCustom}
            disabled={!newAttrName.trim() || !newAttrValue.trim()}
            className="h-9 px-3"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Main Details Section
// ============================================================================
export function DetailsSection({
  form,
  categories,
  brands = [],
  locale = "en",
  onCategoryChange,
}: DetailsSectionProps) {
  const isBg = locale === "bg";
  const title = form.watch("title");
  const description = form.watch("description") || "";
  const categoryId = form.watch("categoryId");
  const categorySlug = form.watch("categorySlug");
  const condition = form.watch("condition");
  const attributes = form.watch("attributes") || [];
  const brandId = form.watch("brandId");
  const brandName = form.watch("brandName");

  // Handle category change
  const handleCategoryChange = useCallback((newCategoryId: string, path: Category[]) => {
    form.setValue("categoryId", newCategoryId, { shouldValidate: true });
    form.setValue("categorySlug", path[path.length - 1]?.slug || "", { shouldValidate: true });
    form.setValue("categoryPath", path, { shouldValidate: false });
    onCategoryChange?.(newCategoryId, path);
  }, [form, onCategoryChange]);

  // Handle brand change
  const handleBrandChange = useCallback((newBrandId: string | null, brandName: string) => {
    form.setValue("brandId", newBrandId, { shouldValidate: true });
    form.setValue("brandName", brandName, { shouldValidate: false });
  }, [form]);

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-2">
        <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 shadow-xs">
          <Package className="size-5 text-primary" weight="bold" />
        </div>
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">
            {isBg ? "Детайли за продукта" : "Product Details"}
          </h3>
          <p className="text-[11px] font-medium text-muted-foreground/70">
            {isBg ? "Заглавие, категория и състояние" : "Title, category and condition"}
          </p>
        </div>
      </div>

      <div className="grid gap-6 p-5 rounded-2xl border border-border bg-background shadow-xs">
        {/* Title */}
        <div className="space-y-2">
          <Label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80 ml-1">
            {isBg ? "Заглавие" : "Title"}
            <span className="text-destructive ml-1">*</span>
          </Label>
          <Input
            {...form.register("title")}
            placeholder={isBg ? "Напр. iPhone 15 Pro Max 256GB" : "e.g. iPhone 15 Pro Max 256GB"}
            className="h-12 text-base font-medium rounded-xl border-border/60 focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all"
          />
          <div className="flex justify-between px-1">
            <p className="text-[10px] text-muted-foreground/60 font-medium">
              {isBg ? "Минимум 10 знака" : "Minimum 10 characters"}
            </p>
            <p className={cn(
              "text-[10px] font-bold tabular-nums",
              (title?.length || 0) > 80 ? "text-destructive" : "text-muted-foreground/60"
            )}>
              {title?.length || 0}/80
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Category */}
          <div className="space-y-2">
            <Label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80 ml-1">
              {isBg ? "Категория" : "Category"}
              <span className="text-destructive ml-1">*</span>
            </Label>
            <CategorySelector
              categories={categories}
              selectedId={categoryId}
              onSelect={handleCategoryChange}
              locale={locale}
              trigger={
                <Button
                  type="button"
                  variant="outline"
                  className={cn(
                    "w-full h-12 justify-between px-4 rounded-xl border-border/60 font-medium transition-all hover:bg-muted/30",
                    !categoryId && "text-muted-foreground/60"
                  )}
                >
                  <span className="truncate">
                    {categoryId 
                      ? (form.watch("categoryPath")?.map(p => isBg && p.name_bg ? p.name_bg : p.name).join(" > ") || "Category selected")
                      : (isBg ? "Изберете категория" : "Select category")}
                  </span>
                  <List className="size-4 shrink-0 opacity-50" />
                </Button>
              }
            />
          </div>

          {/* Condition */}
          <div className="space-y-2">
            <Label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80 ml-1">
              {isBg ? "Състояние" : "Condition"}
              <span className="text-destructive ml-1">*</span>
            </Label>
            <Select
              value={condition}
              onValueChange={(val) => form.setValue("condition", val as any, { shouldValidate: true })}
            >
              <SelectTrigger className="h-12 rounded-xl border-border/60 font-medium focus:ring-4 focus:ring-primary/5">
                <SelectValue placeholder={isBg ? "Изберете състояние" : "Select condition"} />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                {conditionOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value} className="rounded-lg py-2.5">
                    <div className="flex flex-col gap-0.5">
                      <span className="font-bold text-sm">{isBg ? opt.labelBg : opt.label}</span>
                      <span className="text-[10px] text-muted-foreground leading-tight">
                        {isBg ? opt.descriptionBg : opt.description}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Brand */}
        <div className="space-y-2">
          <Label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80 ml-1">
            {isBg ? "Марка" : "Brand"}
            <span className="text-muted-foreground/40 ml-1">(optional)</span>
          </Label>
          <BrandPicker
            selectedId={brandId}
            selectedName={brandName}
            onSelect={handleBrandChange}
            locale={locale}
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80 ml-1">
            {isBg ? "Описание" : "Description"}
            <span className="text-destructive ml-1">*</span>
          </Label>
          <RichTextarea
            value={description}
            onChange={(val) => form.setValue("description", val, { shouldValidate: true })}
            placeholder={isBg ? "Опишете вашия продукт подробно..." : "Describe your product in detail..."}
          />
        </div>

        {/* Dynamic Attributes */}
        {categoryId && (
          <div className="pt-4 border-t border-border/50">
            <ItemSpecificsSection
              categoryId={categoryId}
              attributes={attributes}
              onChange={(newAttrs) => form.setValue("attributes", newAttrs, { shouldValidate: true })}
              locale={locale}
            />
          </div>
        )}
      </div>
    </div>
  );
}    const opt = conditionOptions.find(o => o.value === value);
    return locale === "bg" ? opt?.labelBg : opt?.label;
  };

  const titleError = form.formState.errors.title?.message;
  const categoryError = form.formState.errors.categoryId?.message;
  const isBg = locale === "bg";

  return (
    <section className="rounded-xl border border-border bg-background overflow-hidden shadow-xs">
      <div className="p-5 pb-4 border-b border-border/50 bg-muted/10">
        <div className="flex items-center gap-3.5">
          <div className="flex size-10 items-center justify-center rounded-md bg-background border border-border shadow-xs">
            <Package className="size-5 text-muted-foreground" weight="bold" />
          </div>
          <div>
            <h3 className="text-sm font-bold tracking-tight text-foreground">
              {isBg ? "Детайли за артикула" : "Item details"}
            </h3>
            <p className="text-xs font-medium text-muted-foreground">
              {isBg ? "Помогнете на купувачите да намерят артикула" : "Help buyers find and understand your item"}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-6 px-5 pb-6">
        {/* Title */}
        <div>
          <Label htmlFor="title" className="text-sm font-medium mb-2 block">
            {isBg ? "Заглавие" : "Title"} <span className="text-destructive">*</span>
          </Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => form.setValue("title", e.target.value, { shouldValidate: true })}
            placeholder={isBg ? "напр. Apple Watch Series 9, 45mm, Midnight Aluminum" : "e.g., Apple Watch Series 9, 45mm, Midnight Aluminum"}
            maxLength={80}
            className={cn(
              "rounded-lg h-11",
              titleError && "border-destructive focus:border-destructive focus:ring-destructive/20"
            )}
          />
          <div className="flex items-center justify-between mt-2">
            <span className={cn(
              "text-xs",
              titleError ? "text-destructive" : "text-muted-foreground"
            )}>
              {titleError || `${title?.length || 0} / 80 ${isBg ? "символа" : "characters"}`}
            </span>
          </div>
        </div>

        {/* Category */}
        <div>
          <Label className="text-sm font-medium mb-2 block">
            {isBg ? "Категория" : "Category"} <span className="text-destructive">*</span>
          </Label>
          <CategorySelector
            categories={categories}
            value={categoryId}
            onChange={handleCategoryChange}
            locale={locale}
          />
          {categoryError && (
            <p className="mt-2 text-xs text-destructive">{categoryError}</p>
          )}
        </div>

        {/* Brand */}
        {brands.length > 0 && (
          <div>
            <Label className="text-sm font-medium mb-2 block">
              {isBg ? "Марка" : "Brand"}
              <span className="text-muted-foreground font-normal ml-1.5">
                ({isBg ? "по избор" : "optional"})
              </span>
            </Label>
            <BrandPicker
              brands={brands}
              value={brandId || null}
              onChange={handleBrandChange}
              allowCustom={true}
            />
          </div>
        )}

        {/* Condition */}
        <div>
          <Label className="text-sm font-medium mb-3 block">
            {isBg ? "Състояние" : "Condition"} <span className="text-destructive">*</span>
          </Label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {conditionOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => form.setValue("condition", opt.value, { shouldValidate: true })}
                className={cn(
                  "flex flex-col items-start p-3.5 rounded-lg border-2 text-left transition-colors min-h-touch touch-action-manipulation",
                  condition === opt.value
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/40"
                )}
              >
                <span className={cn(
                  "text-sm font-semibold",
                  condition === opt.value ? "text-primary" : "text-foreground"
                )}>
                  {isBg ? opt.labelBg : opt.label}
                </span>
                <span className="text-xs text-muted-foreground mt-1 line-clamp-2">
                  {opt.description}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Description */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <Label className="text-sm font-medium">
              {isBg ? "Описание" : "Description"}
              <span className="text-muted-foreground font-normal ml-1.5">
                ({isBg ? "препоръчително" : "recommended"})
              </span>
            </Label>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 text-xs gap-1.5 text-primary hover:text-primary hover:bg-primary/10"
            >
              <Sparkle className="size-3.5" weight="fill" />
              {isBg ? "Генерирай с AI" : "Generate with AI"}
            </Button>
          </div>
          <RichTextarea
            value={description}
            onChange={(val) => form.setValue("description", val, { shouldValidate: true })}
            placeholder={isBg 
              ? "Опишете артикула подробно. Включете марка, модел, размер, цвят и евентуални дефекти..."
              : "Describe your item in detail. Include brand, model, size, color, and any flaws or special features..."
            }
            maxLength={2000}
          />
        </div>

        {/* Item Specifics */}
        <div>
          <Label className="text-sm font-medium mb-3 block">
            {isBg ? "Специфики на артикула" : "Item Specifics"}
          </Label>
          <ItemSpecificsSection
            categoryId={categoryId}
            attributes={attributes}
            onChange={handleAttributesChange}
            locale={locale}
          />
        </div>
      </div>
    </section>
  );
}
