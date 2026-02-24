"use client";

import { useState, useEffect, useCallback, memo, useMemo } from "react";
import { CircleCheck as CheckCircle, Info, SlidersHorizontal as Sliders, LoaderCircle as SpinnerGap, CircleAlert as WarningCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Field, FieldLabel, FieldDescription, FieldContent } from "@/components/shared/field";
import { cn } from "@/lib/utils";
import type { ProductAttribute } from "@/lib/sell/schema";
import { useTranslations } from "next-intl";
import { useSellForm, useSellFormContext } from "../sell-form-provider";
import { AttributesCustomSection } from "./attributes-field-custom-section";
import { AttributesFieldGrid } from "./attributes-field-grid";
import { EXCLUDED_ATTRIBUTE_NAMES, type CategoryAttribute } from "./attributes-field.types";

function isAttributeFilled(value: string | undefined | null): boolean {
  return value !== undefined && value !== null && value.trim() !== "";
}

interface AttributesFieldProps {
  className?: string;
  compact?: boolean;
}

export function AttributesField({ className, compact = false }: AttributesFieldProps) {
  const { setValue, watch } = useSellForm();
  const { isBg, locale } = useSellFormContext();
  const tSell = useTranslations("Sell");

  const categoryId = watch("categoryId");
  const watchedAttributes = watch("attributes");
  const attributes = useMemo(() => watchedAttributes || [], [watchedAttributes]);

  const [dbAttributes, setDbAttributes] = useState<CategoryAttribute[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [newAttrName, setNewAttrName] = useState("");
  const [newAttrValue, setNewAttrValue] = useState("");
  const [showAllDbAttributes, setShowAllDbAttributes] = useState(false);

  useEffect(() => {
    if (!categoryId) {
      setDbAttributes([]);
      return;
    }

    const fetchAttributes = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/categories/${categoryId}/attributes`);
        if (!response.ok) return;

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
      } catch {
        // Non-blocking: leave specifics empty when the category attributes API fails.
      } finally {
        setIsLoading(false);
      }
    };

    void fetchAttributes();
  }, [categoryId]);

  const handleAttributeChange = useCallback((attr: CategoryAttribute, value: string) => {
    const existing = attributes.find((entry) => entry.attributeId === attr.id);
    let nextAttrs: ProductAttribute[];

    if (existing) {
      if (value) {
        nextAttrs = attributes.map((entry) => entry.attributeId === attr.id ? { ...entry, value } : entry);
      } else {
        nextAttrs = attributes.filter((entry) => entry.attributeId !== attr.id);
      }
    } else if (value) {
      nextAttrs = [...attributes, {
        attributeId: attr.id,
        name: attr.name,
        value,
        isCustom: false,
      }];
    } else {
      nextAttrs = attributes;
    }

    setValue("attributes", nextAttrs, { shouldValidate: true });
  }, [attributes, setValue]);

  const handleAddCustom = useCallback(() => {
    if (!newAttrName.trim() || !newAttrValue.trim()) return;

    const nextAttr: ProductAttribute = {
      attributeId: null,
      name: newAttrName.trim(),
      value: newAttrValue.trim(),
      isCustom: true,
    };

    setValue("attributes", [...attributes, nextAttr], { shouldValidate: true });
    setNewAttrName("");
    setNewAttrValue("");
  }, [newAttrName, newAttrValue, attributes, setValue]);

  const handleRemoveCustom = useCallback((index: number) => {
    const customAttrs = attributes.filter((entry) => entry.isCustom);
    const toRemove = customAttrs[index];
    setValue("attributes", attributes.filter((entry) => entry !== toRemove), { shouldValidate: true });
  }, [attributes, setValue]);

  const customAttrs = useMemo(() => attributes.filter((entry) => entry.isCustom), [attributes]);

  const visibleDbAttrs = useMemo(
    () => dbAttributes
      .filter((attr) => !EXCLUDED_ATTRIBUTE_NAMES.includes(attr.name.toLowerCase())
        && !(attr.name_bg && EXCLUDED_ATTRIBUTE_NAMES.includes(attr.name_bg.toLowerCase())))
      .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)),
    [dbAttributes]
  );

  const dbRequiredAttrs = useMemo(() => visibleDbAttrs.filter((attr) => attr.is_required), [visibleDbAttrs]);
  const dbOptionalAttrs = useMemo(() => visibleDbAttrs.filter((attr) => !attr.is_required), [visibleDbAttrs]);

  const SMART_LIMIT = 6;
  const dbRequiredSmart = useMemo(() => dbRequiredAttrs.slice(0, SMART_LIMIT), [dbRequiredAttrs]);

  const dbRequiredSmartCount = dbRequiredSmart.length;
  const filledDbRequiredSmartCount = useMemo(() => {
    return dbRequiredSmart.reduce((count, attr) => {
      const value = attributes.find((entry) => entry.attributeId === attr.id)?.value || "";
      return count + (isAttributeFilled(value) ? 1 : 0);
    }, 0);
  }, [attributes, dbRequiredSmart]);

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
      {isLoading && (
        <div className="flex items-center justify-center p-8">
          <SpinnerGap className="size-6 animate-spin text-primary" />
        </div>
      )}

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

          <AttributesFieldGrid
            attrs={dbRequiredSmart}
            attributes={attributes}
            compact={compact}
            locale={locale}
            isBg={isBg}
            defaultRequired
            onAttributeChange={handleAttributeChange}
          />
        </div>
      )}

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
              onClick={() => setShowAllDbAttributes((current) => !current)}
              className="h-8 text-xs font-bold text-primary hover:bg-hover active:bg-active"
            >
              {showAllDbAttributes ? tSell("fields.attributes.toggle.hide") : tSell("fields.attributes.toggle.showAll")}
            </Button>
          </div>

          {showAllDbAttributes && (
            <div className="space-y-4 pt-2">
              {dbRequiredAttrs.length > SMART_LIMIT && (
                <AttributesFieldGrid
                  attrs={dbRequiredAttrs.slice(SMART_LIMIT)}
                  attributes={attributes}
                  compact={compact}
                  locale={locale}
                  isBg={isBg}
                  defaultRequired
                  onAttributeChange={handleAttributeChange}
                />
              )}

              {dbOptionalAttrs.length > 0 && (
                <AttributesFieldGrid
                  attrs={dbOptionalAttrs}
                  attributes={attributes}
                  compact={compact}
                  locale={locale}
                  isBg={isBg}
                  defaultRequired={false}
                  onAttributeChange={handleAttributeChange}
                />
              )}
            </div>
          )}
        </div>
      )}

      {!isLoading && dbRequiredSmart.length === 0 && dbAttributes.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-wider">
            <Info className="size-4" />
            {tSell("fields.attributes.helpBuyersHint")}
          </div>

          <AttributesFieldGrid
            attrs={visibleDbAttrs}
            attributes={attributes}
            compact={compact}
            locale={locale}
            isBg={isBg}
            defaultRequired={false}
            onAttributeChange={handleAttributeChange}
          />
        </div>
      )}

      {!isLoading && (
        <AttributesCustomSection
          customAttrs={customAttrs}
          newAttrName={newAttrName}
          newAttrValue={newAttrValue}
          onNameChange={setNewAttrName}
          onValueChange={setNewAttrValue}
          onAdd={handleAddCustom}
          onRemove={handleRemoveCustom}
        />
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
