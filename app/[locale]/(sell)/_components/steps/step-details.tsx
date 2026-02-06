"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { Controller } from "react-hook-form";
import { Sparkle, CaretRight, Check, Camera, Plus, X } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { conditionOptions } from "@/lib/sell/schema-v4";
import { useSellForm, useSellFormContext } from "../sell-form-provider";
import { useTranslations } from "next-intl";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { ProductAttribute } from "@/lib/sell/schema-v4";

// ============================================================================
// STEP 3: DETAILS - Clean iOS-style form
// Condition + Attributes + Description + Photos
// ============================================================================

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
  sort_order: number;
}

// Helper: Check if attribute value is filled
function isAttributeFilled(value: string | undefined | null): boolean {
  return value !== undefined && value !== null && value.trim() !== "";
}

// Simple selection row - iOS style
function SelectionRow({
  label,
  value,
  placeholder,
  onClick,
  hasError,
  required,
}: {
  label: string;
  value: string | undefined;
  placeholder: string;
  onClick: () => void;
  hasError?: boolean | undefined;
  required?: boolean | undefined;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full flex items-center justify-between h-14 px-4 rounded-xl border transition-all",
        "active:opacity-90",
        hasError
          ? "border-destructive/40 bg-surface-subtle"
          : value
            ? "bg-selected border-selected-border"
            : "border-border bg-card hover:bg-hover"
      )}
    >
      <div className="flex-1 text-left min-w-0">
        <span className="text-tiny font-semibold uppercase tracking-wide text-muted-foreground block">
          {label}{required && <span className="text-destructive ml-0.5">*</span>}
        </span>
        <span className={cn(
          "text-reading font-medium truncate block -mt-0.5",
          value ? "text-foreground" : "text-muted-foreground"
        )}>
          {value || placeholder}
        </span>
      </div>
      <CaretRight className="size-4 text-muted-foreground shrink-0" weight="bold" />
    </button>
  );
}

export function StepDetails() {
  const { control, watch, setValue } = useSellForm();
  const { isBg } = useSellFormContext();
  const tSell = useTranslations("Sell")

  // Drawer states
  const [conditionOpen, setConditionOpen] = useState(false);
  const [attrDrawerOpen, setAttrDrawerOpen] = useState<string | null>(null);

  // Watch values
  const condition = watch("condition");
  const categoryId = watch("categoryId");
  const categoryPath = watch("categoryPath");
  const description = watch("description") || "";
  const watchedAttributes = watch("attributes");
  const attributes = useMemo(() => watchedAttributes || [], [watchedAttributes]);
  const images = watch("images") || [];

  // Get condition label
  const selectedCondition = conditionOptions.find(c => c.value === condition);
  const conditionLabel = selectedCondition
    ? tSell(selectedCondition.labelKey as never)
    : undefined;

  // DB attributes state
  const [dbAttributes, setDbAttributes] = useState<CategoryAttribute[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch attributes when category changes
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
          const attrs = data.attributes || data;
          if (Array.isArray(attrs)) {
            const normalized = attrs.map((attr: Record<string, unknown>) => ({
              id: String(attr.id),
              name: String(attr.name ?? ""),
              name_bg: attr.name_bg ?? attr.nameBg ?? null,
              attribute_type: (attr.attribute_type ?? attr.type ?? "text") as CategoryAttribute["attribute_type"],
              is_required: Boolean(attr.is_required ?? attr.required),
              options: (attr.options ?? undefined) as string[] | undefined,
              options_bg: (attr.options_bg ?? attr.optionsBg ?? undefined) as string[] | undefined,
              placeholder: (attr.placeholder ?? undefined) as string | undefined,
              placeholder_bg: (attr.placeholder_bg ?? attr.placeholderBg ?? undefined) as string | undefined,
              sort_order: Number(attr.sort_order ?? attr.sortOrder ?? 0),
            })) as CategoryAttribute[];
            // Filter out condition attribute
            setDbAttributes(normalized.filter(a =>
              !["condition", "състояние"].includes(a.name.toLowerCase())
            ).sort((a, b) => a.sort_order - b.sort_order));
          }
        }
      } catch {
        // silent
      } finally {
        setIsLoading(false);
      }
    };
    fetchAttributes();
  }, [categoryId]);

  // Required attributes (max 6)
  const requiredAttrs = useMemo(() =>
    dbAttributes.filter(a => a.is_required).slice(0, 6),
    [dbAttributes]
  );

  // Get attribute value
  const getAttrValue = useCallback((attrId: string) => {
    return attributes.find(a => a.attributeId === attrId)?.value || "";
  }, [attributes]);

  // Get attribute display value
  const getAttrDisplayValue = useCallback((attr: CategoryAttribute) => {
    const val = getAttrValue(attr.id);
    if (!val) return undefined;
    if (attr.attribute_type === "select" && attr.options) {
      const idx = attr.options.indexOf(val);
      if (isBg && attr.options_bg?.[idx]) return attr.options_bg[idx];
    }
    return val;
  }, [getAttrValue, isBg]);

  // Handle attribute change
  const handleAttrChange = useCallback((attr: CategoryAttribute, value: string) => {
    const existing = attributes.find(a => a.attributeId === attr.id);
    let newAttrs: ProductAttribute[];
    if (existing) {
      newAttrs = value
        ? attributes.map(a => a.attributeId === attr.id ? { ...a, value } : a)
        : attributes.filter(a => a.attributeId !== attr.id);
    } else if (value) {
      newAttrs = [...attributes, { attributeId: attr.id, name: attr.name, value, isCustom: false }];
    } else {
      newAttrs = attributes;
    }
    setValue("attributes", newAttrs, { shouldValidate: true });
  }, [attributes, setValue]);

  // Photo handlers (simplified)
  const addDemoPhoto = useCallback(() => {
    if (images.length >= 12) return;
    const id = Math.floor(Math.random() * 1000);
    setValue("images", [...images, {
      url: `https://picsum.photos/seed/${id}/600/600`,
      isPrimary: images.length === 0,
    }], { shouldValidate: true });
  }, [images, setValue]);

  const removePhoto = useCallback((index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    if (newImages.length > 0 && !newImages.some(img => img.isPrimary)) {
      const first = newImages[0];
      if (first) {
        newImages[0] = { url: first.url, isPrimary: true, thumbnailUrl: first.thumbnailUrl };
      }
    }
    setValue("images", newImages, { shouldValidate: true });
  }, [images, setValue]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          {isBg ? "Детайли за продукта" : "Product details"}
        </h2>
        <p className="text-reading text-muted-foreground">
          {isBg
            ? "Добавете информация, която помага на купувачите"
            : "Add information that helps buyers find your item"}
        </p>
      </div>

      {/* Condition - SelectionRow */}
      <Controller
        name="condition"
        control={control}
        render={({ fieldState }) => (
          <SelectionRow
            label={isBg ? "Състояние" : "Condition"}
            value={conditionLabel}
            placeholder={isBg ? "Изберете състояние" : "Select condition"}
            onClick={() => setConditionOpen(true)}
            hasError={fieldState.invalid}
            required
          />
        )}
      />

      {/* Required Attributes - iOS grouped list style */}
      {!isLoading && requiredAttrs.length > 0 && (
        <div className="space-y-2">
          <span className="text-tiny font-semibold uppercase tracking-wide text-muted-foreground px-1">
            {isBg ? "Основни характеристики" : "Main specifics"}
            <span className="ml-1.5 text-muted-foreground">
              {requiredAttrs.filter(a => isAttributeFilled(getAttrValue(a.id))).length}/{requiredAttrs.length}
            </span>
          </span>
          <div className="bg-card rounded-xl border border-border divide-y divide-border/60 overflow-hidden">
            {requiredAttrs.map((attr) => {
              const name = isBg && attr.name_bg ? attr.name_bg : attr.name;
              const displayValue = getAttrDisplayValue(attr);

              if (attr.attribute_type === "select" && attr.options?.length) {
                return (
                  <button
                    key={attr.id}
                    type="button"
                    onClick={() => setAttrDrawerOpen(attr.id)}
                    className="w-full flex items-center justify-between h-14 px-4 active:bg-active transition-colors"
                  >
                    <span className="text-reading text-foreground">{name}</span>
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        "text-reading",
                        displayValue ? "text-foreground font-medium" : "text-muted-foreground"
                      )}>
                        {displayValue || (isBg ? "Избери" : "Select")}
                      </span>
                      <CaretRight className="size-4 text-muted-foreground" weight="bold" />
                    </div>
                  </button>
                );
              }

              // Text/number input inline
              return (
                <div key={attr.id} className="flex items-center justify-between h-14 px-4">
                  <span className="text-reading text-foreground shrink-0">{name}</span>
                  <Input
                    value={getAttrValue(attr.id)}
                    onChange={(e) => handleAttrChange(attr, e.target.value)}
                    placeholder={isBg ? "Въведи..." : "Enter..."}
                    type={attr.attribute_type === "number" ? "number" : "text"}
                    className="border-none bg-transparent h-full p-0 text-reading text-right font-medium focus-visible:ring-0 w-32 placeholder:text-muted-foreground"
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Description - iOS card style */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <span className="text-tiny font-semibold uppercase tracking-wide text-muted-foreground">
            {isBg ? "Описание" : "Description"}
          </span>
          <span className="text-tiny font-medium tabular-nums text-muted-foreground">
            {description.length}/2000
          </span>
        </div>
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <div className="bg-card rounded-xl border border-border overflow-hidden focus-within:border-ring focus-within:ring-2 focus-within:ring-ring transition-colors">
              <Textarea
                {...field}
                placeholder={isBg
                  ? "Опишете продукта: марка, размер, защо продавате..."
                  : "Describe your item: brand, size, why you're selling..."}
                rows={4}
                maxLength={2000}
                className="border-none bg-transparent resize-none text-reading px-4 py-3 focus-visible:ring-0 placeholder:text-muted-foreground"
              />
            </div>
          )}
        />
      </div>

      {/* Additional Photos - Simple grid */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <span className="text-tiny font-semibold uppercase tracking-wide text-muted-foreground">
            {isBg ? "Снимки" : "Photos"}
          </span>
          <span className="text-tiny font-medium tabular-nums text-muted-foreground">
            {images.length}/12
          </span>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {images.length < 12 && (
               <button
                 type="button"
                 onClick={addDemoPhoto}
                 className="aspect-square rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center gap-1 hover:border-hover-border hover:bg-hover transition-colors active:scale-95"
               >
                 <Camera className="size-5 text-muted-foreground" />
                 <span className="text-2xs font-medium text-muted-foreground">
                   {isBg ? "Добави" : "Add"}
                 </span>
              </button>
          )}
          {images.map((img, i) => (
            <div key={`${img.url}-${i}`} className="aspect-square rounded-xl bg-muted relative overflow-hidden group ring-1 ring-border/50">
              <img src={img.url} alt="" className="w-full h-full object-cover" />
              {i === 0 && (
                <div className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded text-2xs font-bold bg-surface-overlay text-overlay-text">
                  {isBg ? "Корица" : "Cover"}
                </div>
              )}
              <button
                type="button"
                onClick={() => removePhoto(i)}
                className="absolute top-1 right-1 size-6 flex items-center justify-center rounded-full bg-surface-overlay text-overlay-text opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="size-3" weight="bold" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Condition Drawer */}
      <Drawer open={conditionOpen} onOpenChange={setConditionOpen}>
        <DrawerContent className="max-h-dialog flex flex-col">
          <DrawerHeader className="border-b border-border pb-4">
            <DrawerTitle className="text-lg font-bold">
              {isBg ? "Състояние на продукта" : "Item condition"}
            </DrawerTitle>
          </DrawerHeader>
          <ScrollArea className="flex-1 min-h-0">
            <div className="p-4 space-y-1.5">
              {conditionOptions.map((opt) => {
                const isSelected = condition === opt.value;
                const label = tSell(opt.labelKey as never);
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      setValue("condition", opt.value, { shouldValidate: true });
                      setConditionOpen(false);
                    }}
                    className={cn(
                      "w-full flex items-center justify-between h-14 px-4 rounded-xl transition-colors",
                      "active:opacity-90",
                      isSelected
                        ? "bg-selected border border-selected-border"
                        : "bg-surface-subtle hover:bg-hover"
                    )}
                  >
                    <span className={cn(
                      "text-reading",
                      isSelected ? "font-bold text-foreground" : "font-medium text-foreground"
                    )}>
                      {label}
                    </span>
                    {isSelected && (
                      <div className="size-6 rounded-full bg-checked flex items-center justify-center">
                        <Check className="size-3.5 text-checked-foreground" weight="bold" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </ScrollArea>
        </DrawerContent>
      </Drawer>

      {/* Attribute Select Drawers */}
      {requiredAttrs.filter(a => a.attribute_type === "select" && a.options?.length).map((attr) => {
        const name = isBg && attr.name_bg ? attr.name_bg : attr.name;
        const currentValue = getAttrValue(attr.id);
        return (
          <Drawer key={attr.id} open={attrDrawerOpen === attr.id} onOpenChange={(open) => setAttrDrawerOpen(open ? attr.id : null)}>
            <DrawerContent className="max-h-dialog flex flex-col">
              <DrawerHeader className="border-b border-border pb-4">
                <DrawerTitle className="text-lg font-bold">{name}</DrawerTitle>
              </DrawerHeader>
              <ScrollArea className="flex-1 min-h-0">
                <div className="p-4 space-y-1.5">
                  {attr.options?.map((opt, idx) => {
                    const isSelected = currentValue === opt;
                    const displayLabel = isBg && attr.options_bg?.[idx] ? attr.options_bg[idx] : opt;
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => {
                          handleAttrChange(attr, opt);
                          setAttrDrawerOpen(null);
                        }}
                        className={cn(
                          "w-full flex items-center justify-between h-14 px-4 rounded-xl transition-colors",
                          "active:opacity-90",
                          isSelected
                            ? "bg-selected border border-selected-border"
                            : "bg-surface-subtle hover:bg-hover"
                        )}
                      >
                        <span className={cn(
                          "text-reading",
                          isSelected ? "font-bold text-foreground" : "font-medium text-foreground"
                        )}>
                          {displayLabel}
                        </span>
                        {isSelected && (
                          <div className="size-6 rounded-full bg-checked flex items-center justify-center">
                            <Check className="size-3.5 text-checked-foreground" weight="bold" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </ScrollArea>
            </DrawerContent>
          </Drawer>
        );
      })}
    </div>
  );
}
