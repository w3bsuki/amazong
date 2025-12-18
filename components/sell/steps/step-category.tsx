"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
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
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { CategorySelector } from "@/components/sell/ui/category-modal";
import type { SellFormDataV4 } from "@/lib/sell-form-schema-v4";
import { conditionOptions } from "@/lib/sell-form-schema-v4";
import type { Category } from "@/components/sell/types";
import { splitSpecificsByTier } from "@/lib/sell-specifics-policy";

interface StepCategoryProps {
  form: UseFormReturn<SellFormDataV4>;
  categories: Category[];
  sellerId?: string;
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

function SelectAttributePicker({
  name,
  isRequired,
  placeholder,
  optionPairs,
  value,
  onChange,
  isBg,
}: {
  name: string;
  isRequired: boolean;
  placeholder: string;
  optionPairs: { label: string; value: string }[];
  value: string;
  onChange: (value: string) => void;
  isBg: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return optionPairs;
    return optionPairs.filter((p) => p.label.toLowerCase().includes(q));
  }, [optionPairs, query]);

  const selectedPair = optionPairs.find((p) => p.value === value);
  const selectedLabel = selectedPair?.label;

  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-medium">
        {name}
        {isRequired && <span className="text-destructive ml-0.5">*</span>}
      </Label>

      <Drawer open={open} onOpenChange={setOpen}>
        <Button
          type="button"
          variant="outline"
          onClick={() => setOpen(true)}
          className={cn(
            "h-10 w-full justify-between rounded-lg",
            value ? "text-foreground" : "text-muted-foreground"
          )}
        >
          <span className="truncate">
            {selectedLabel || placeholder || (isBg ? "Избери..." : "Select...")}
          </span>
          <span className="text-xs text-muted-foreground">{optionPairs.length}</span>
        </Button>

        <DrawerContent className="max-h-[85vh]">
          <DrawerHeader>
            <div className="flex items-center justify-between gap-3">
              <DrawerTitle className="text-base">{name}</DrawerTitle>
              <DrawerClose asChild>
                <Button type="button" variant="ghost" size="icon" className="h-9 w-9">
                  <X className="size-5" />
                </Button>
              </DrawerClose>
            </div>
            <div className="pt-2">
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={isBg ? "Търси..." : "Search..."}
                className="h-10"
              />
            </div>
          </DrawerHeader>

          <div className="px-4 pb-4">
            <ScrollArea className="h-[50vh] pr-3">
              <div className="space-y-1">
                {filtered.length === 0 ? (
                  <p className="py-6 text-center text-sm text-muted-foreground">
                    {isBg ? "Няма резултати" : "No results"}
                  </p>
                ) : (
                  filtered.map((opt) => {
                    const isSelected = opt.value === value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => {
                          onChange(opt.value);
                          setOpen(false);
                        }}
                        className={cn(
                          "w-full text-left px-3 py-2.5 rounded-lg border transition-colors flex items-center justify-between gap-3",
                          isSelected
                            ? "border-primary bg-primary/10"
                            : "border-border hover:bg-muted/50"
                        )}
                      >
                        <span className="text-sm">{opt.label}</span>
                        {isSelected && <Check className="size-4 text-primary" weight="bold" />}
                      </button>
                    );
                  })
                )}
              </div>
            </ScrollArea>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}

function MultiSelectAttributePicker({
  name,
  isRequired,
  placeholder,
  optionPairs,
  value,
  onChange,
  isBg,
}: {
  name: string;
  isRequired: boolean;
  placeholder: string;
  optionPairs: { label: string; value: string }[];
  value: string;
  onChange: (value: string) => void;
  isBg: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const selectedValues = useMemo(
    () =>
      value
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    [value]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return optionPairs;
    return optionPairs.filter((p) => p.label.toLowerCase().includes(q));
  }, [optionPairs, query]);

  const selectedLabels = useMemo(
    () =>
      selectedValues
        .map((sv) => optionPairs.find((p) => p.value === sv)?.label ?? sv)
        .filter(Boolean),
    [optionPairs, selectedValues]
  );

  const summary = selectedLabels.length
    ? selectedLabels.slice(0, 2).join(", ") + (selectedLabels.length > 2 ? ` +${selectedLabels.length - 2}` : "")
    : (placeholder || (isBg ? "Избери..." : "Select..."));

  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-medium">
        {name}
        {isRequired && <span className="text-destructive ml-0.5">*</span>}
      </Label>

      <Drawer open={open} onOpenChange={setOpen}>
        <Button
          type="button"
          variant="outline"
          onClick={() => setOpen(true)}
          className={cn(
            "h-10 w-full justify-between rounded-lg",
            selectedValues.length ? "text-foreground" : "text-muted-foreground"
          )}
        >
          <span className="truncate">{summary}</span>
          <span className="text-xs text-muted-foreground">{selectedValues.length}</span>
        </Button>

        <DrawerContent className="max-h-[85vh]">
          <DrawerHeader>
            <div className="flex items-center justify-between gap-3">
              <DrawerTitle className="text-base">{name}</DrawerTitle>
              <DrawerClose asChild>
                <Button type="button" variant="ghost" size="icon" className="h-9 w-9">
                  <X className="size-5" />
                </Button>
              </DrawerClose>
            </div>
            <div className="pt-2">
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={isBg ? "Търси..." : "Search..."}
                className="h-10"
              />
            </div>
          </DrawerHeader>

          <div className="px-4 pb-4 space-y-3">
            <ScrollArea className="h-[46vh] pr-3">
              <div className="space-y-1">
                {filtered.length === 0 ? (
                  <p className="py-6 text-center text-sm text-muted-foreground">
                    {isBg ? "Няма резултати" : "No results"}
                  </p>
                ) : (
                  filtered.map((opt) => {
                    const isSelected = selectedValues.includes(opt.value);
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => {
                          const next = isSelected
                            ? selectedValues.filter((v) => v !== opt.value)
                            : [...selectedValues, opt.value];
                          onChange(next.join(", "));
                        }}
                        className={cn(
                          "w-full text-left px-3 py-2.5 rounded-lg border transition-colors flex items-center justify-between gap-3",
                          isSelected
                            ? "border-primary bg-primary/10"
                            : "border-border hover:bg-muted/50"
                        )}
                      >
                        <span className="text-sm">{opt.label}</span>
                        {isSelected && <Check className="size-4 text-primary" weight="bold" />}
                      </button>
                    );
                  })
                )}
              </div>
            </ScrollArea>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1 h-11"
                onClick={() => {
                  onChange("");
                }}
              >
                {isBg ? "Изчисти" : "Clear"}
              </Button>
              <DrawerClose asChild>
                <Button type="button" className="flex-1 h-11">
                  {isBg ? "Готово" : "Done"}
                </Button>
              </DrawerClose>
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
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

  const optionPairs = useMemo(() => {
    const storeOptions = attribute.options ?? [];
    if (storeOptions.length === 0) return [] as { label: string; value: string }[];

    const displayOptions = isBg && attribute.options_bg ? attribute.options_bg : storeOptions;
    return storeOptions.map((storeValue, idx) => ({
      value: storeValue,
      label: displayOptions[idx] ?? storeValue,
    }));
  }, [attribute.options, attribute.options_bg, isBg]);

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

  if (attribute.attribute_type === "select" && optionPairs.length > 0) {
    return (
      <SelectAttributePicker
        name={name}
        isRequired={attribute.is_required}
        placeholder={placeholder}
        optionPairs={optionPairs}
        value={value}
        onChange={onChange}
        isBg={isBg}
      />
    );
  }

  if (attribute.attribute_type === "multiselect" && optionPairs.length > 0) {
    return (
      <MultiSelectAttributePicker
        name={name}
        isRequired={attribute.is_required}
        placeholder={placeholder}
        optionPairs={optionPairs}
        value={value}
        onChange={onChange}
        isBg={isBg}
      />
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
  sellerId,
  locale = "en",
  onValidityChange,
}: StepCategoryProps) {
  const isBg = locale === "bg";
  const [categoryAttributes, setCategoryAttributes] = useState<CategoryAttribute[]>([]);
  const [isLoadingAttributes, setIsLoadingAttributes] = useState(false);
  const [showOptionalSpecifics, setShowOptionalSpecifics] = useState(false);
  const [recentBrands, setRecentBrands] = useState<string[]>([]);
  const [customAttributes, setCustomAttributes] = useState<{ name: string; value: string }[]>([]);
  const [newAttrName, setNewAttrName] = useState("");
  const [newAttrValue, setNewAttrValue] = useState("");

  const categoryId = form.watch("categoryId");
  const condition = form.watch("condition");
  const brandName = form.watch("brandName") || "";
  const watchedAttributes = form.watch("attributes");
  const attributes = useMemo(() => watchedAttributes ?? [], [watchedAttributes]);

  const categoryPath = form.watch("categoryPath") || [];
  const l0Slug = categoryPath?.[0]?.slug;

  const isAutomotiveDomain = useMemo(() => {
    const s = (l0Slug || "").toLowerCase();
    return ["auto", "automotive", "car", "cars", "vehicle", "vehicles", "motor", "motors"].some((p) => s.includes(p));
  }, [l0Slug]);

  const normalizeKey = useCallback((text: string) => {
    return (text || "")
      .toLowerCase()
      .normalize("NFKD")
      .replace(/\p{Diacritic}/gu, "")
      // Keep ALL unicode letters/numbers (so BG/Cyrillic doesn't collapse to empty)
      .replace(/[^\p{Letter}\p{Number}\s]/gu, " ")
      .replace(/\s+/g, " ")
      .trim();
  }, []);

  const sanitizeCategoryAttributes = useCallback(
    (attrs: CategoryAttribute[]) => {
      if (!attrs || attrs.length === 0) return [] as CategoryAttribute[];

      // 1) Drop obvious redundant attrs (ex: Type only allows “Car”)
      const filtered = attrs.filter((a) => {
        const displayName = (isBg && a.name_bg ? a.name_bg : a.name) || a.name;
        const key = normalizeKey(displayName);

        if (!isAutomotiveDomain) return true;

        // Remove leaf taxonomy echo like “Type: Car” when it’s a single-choice.
        if (key === "type" || key === "tip" || key === "тип") {
          const opts = a.options ?? [];
          const normalizedOpts = opts.map((o) => normalizeKey(o)).filter(Boolean);
          const unique = Array.from(new Set(normalizedOpts));
          if (unique.length <= 1) return false;
          if (unique.length > 0 && unique.every((o) => o === "car" || o === "cars" || o === "automobile" || o === "vehicle")) return false;
        }

        return true;
      });

      // 2) Deduplicate by a canonical key (handles inherited/global duplicates and minor name variants)
      const bestByKey = new Map<string, CategoryAttribute>();

      const canonicalize = (a: CategoryAttribute) => {
        const displayName = (isBg && a.name_bg ? a.name_bg : a.name) || a.name;
        const rawKey = normalizeKey(displayName) || normalizeKey(a.name || "");
        const k = rawKey || `id:${a.id}`;

        if (isAutomotiveDomain) {
          // Unify Make/Brand/Марка into one field to avoid duplicates.
          if (k.includes("марка") || k.includes("make") || k.includes("manufacturer") || k.includes("производител") || k === "brand") {
            return "vehicle_make";
          }
          if (k === "year" || k.includes("година")) return "vehicle_year";
          if (k.includes("engine size") || k.includes("displacement") || k.includes("кубатура") || k === "cc" || k.includes("куб")) {
            return "vehicle_engine_size";
          }
        }

        return k;
      };

      const score = (a: CategoryAttribute) => {
        // Prefer required + structured fields (and those with options)
        let s = 0;
        if (a.is_required) s += 50;
        if (a.attribute_type === "select" || a.attribute_type === "multiselect") s += 12;
        if (a.attribute_type === "number" || a.attribute_type === "date") s += 8;
        if ((a.options?.length ?? 0) > 0) s += 6;
        const nameKey = normalizeKey(a.name || "");
        // Prefer stable internal names over localized labels for storage
        if (nameKey) s += Math.max(0, 8 - nameKey.length / 6);
        return s;
      };

      for (const a of filtered) {
        const k = canonicalize(a);
        if (!k) continue;
        const existing = bestByKey.get(k);
        if (!existing) {
          bestByKey.set(k, a);
          continue;
        }
        if (score(a) > score(existing)) bestByKey.set(k, a);
      }

      return Array.from(bestByKey.values());
    },
    [isAutomotiveDomain, isBg, normalizeKey]
  );

  const applyAutomotiveMinimums = useCallback(
    (attrs: CategoryAttribute[]) => {
      if (!isAutomotiveDomain) return attrs;

      const norm = (t: string) => t.toLowerCase().trim();
      const has = (name: string, keywords: string[]) => {
        const n = norm(name);
        return keywords.some((k) => n.includes(norm(k)));
      };

      // Mark high-signal car fields as required *when they exist*.
      // This prevents “0 info” automotive listings without needing DB changes.
      const mustHave: string[][] = [
        ["brand", "марка", "make", "manufacturer", "производител"],
        ["model", "модел"],
        ["year", "година"],
        ["fuel", "fuel type", "гориво", "вид гориво"],
        ["transmission", "gearbox", "скорости", "трансмисия"],
        ["mileage", "km", "kilometers", "пробег", "километри"],
      ];

      return attrs.map((a) => {
        if (a.is_required) return a;
        const n = a.name || "";
        const shouldRequire = mustHave.some((keys) => has(n, keys));
        return shouldRequire ? { ...a, is_required: true } : a;
      });
    },
    [isAutomotiveDomain]
  );

  // Load recent brands per seller (best-effort)
  useEffect(() => {
    if (!sellerId) return;
    try {
      const raw = localStorage.getItem(`sell-recent-brands-${sellerId}`);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        setRecentBrands(
          parsed
            .filter((v) => typeof v === "string")
            .map((v) => v.trim())
            .filter(Boolean)
            .slice(0, 8)
        );
      }
    } catch {
      // ignore
    }
  }, [sellerId]);

  const saveRecentBrand = (name: string) => {
    const n = name.trim();
    if (!sellerId || !n) return;
    try {
      setRecentBrands((prev) => {
        const next = [n, ...prev]
          .map((v) => v.trim())
          .filter(Boolean)
          .filter(
            (v, idx, arr) =>
              arr.findIndex((x) => x.toLowerCase() === v.toLowerCase()) === idx
          )
          .slice(0, 8);
        localStorage.setItem(`sell-recent-brands-${sellerId}`, JSON.stringify(next));
        return next;
      });
    } catch {
      // ignore
    }
  };

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

    // Reset optional visibility on category change
    setShowOptionalSpecifics(false);

    const fetchAttributes = async () => {
      setIsLoadingAttributes(true);
      try {
        const baseUrl = `/api/categories/attributes?categoryId=${encodeURIComponent(categoryId)}&includeParents=true`;

        const fetchJson = async (url: string) => {
          const res = await fetch(url);
          if (!res.ok) return null;
          return res.json();
        };

        const base = await fetchJson(baseUrl);
        let attrs: CategoryAttribute[] = (base?.attributes || []) as CategoryAttribute[];

        // Some installs store automotive specifics as global (category_id NULL).
        // Keep this as an automotive-only fallback to avoid adding unrelated noise elsewhere.
        if (isAutomotiveDomain && attrs.length < 4) {
          const globalInherited = await fetchJson(`${baseUrl}&includeGlobal=true`);
          const globalInheritedAttrs = (globalInherited?.attributes || []) as CategoryAttribute[];
          if (globalInheritedAttrs.length > attrs.length) attrs = globalInheritedAttrs;
        }

        const sanitized = sanitizeCategoryAttributes(attrs);
        setCategoryAttributes(applyAutomotiveMinimums(sanitized));
      } catch (error) {
        console.error("Failed to fetch attributes:", error);
      } finally {
        setIsLoadingAttributes(false);
      }
    };

    fetchAttributes();
  }, [applyAutomotiveMinimums, categoryId, isAutomotiveDomain, sanitizeCategoryAttributes]);

  // Handle category change
  const handleCategoryChange = (id: string, path: Category[]) => {
    form.setValue("categoryId", id, { shouldValidate: true });
    form.setValue("categoryPath", path.map(c => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
    })), { shouldValidate: true });

    // Clear non-custom attributes when category changes to avoid stale specifics
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
  const selectedCategoryName = categoryPath.length > 0
    ? categoryPath.map(c => c.name).join(" › ")
    : "";

  const brandAttr = useMemo(() => {
    return categoryAttributes.find((a) => {
      const n = (a.name || "").trim().toLowerCase();
      return n === "brand" || n === "марка";
    });
  }, [categoryAttributes]);

  const {
    required: requiredSpecifics,
    recommended: recommendedSpecifics,
    optional: optionalSpecifics,
  } = useMemo(() => {
    const split = splitSpecificsByTier({
      l0Slug,
      attributes: categoryAttributes,
      maxRecommended: 6,
    });

    if (!brandAttr) return split;

    const isBrand = (a: CategoryAttribute) => a.id === brandAttr.id || a.name === brandAttr.name;
    return {
      required: split.required.filter((a) => !isBrand(a)),
      recommended: split.recommended.filter((a) => !isBrand(a)),
      optional: split.optional.filter((a) => !isBrand(a)),
    };
  }, [brandAttr, categoryAttributes, l0Slug]);

  const setBrandValue = (val: string) => {
    form.setValue("brandName", val, { shouldValidate: true });
    if (brandAttr) {
      handleAttributeChange({ id: brandAttr.id, name: brandAttr.name }, val, false);
    }
  };

  const missingBits = useMemo(() => {
    const bits: string[] = [];
    if (!categoryId) bits.push(isBg ? "Изберете категория" : "Choose a category");
    if (!condition) bits.push(isBg ? "Изберете състояние" : "Choose condition");
    if (isLoadingAttributes) bits.push(isBg ? "Зареждане на характеристики…" : "Loading specifics…");
    if (categoryId && !isLoadingAttributes && !requiredAttributesFilled) {
      bits.push(isBg ? "Попълнете задължителните характеристики" : "Fill required specifics");
    }
    if (brandAttr?.is_required) {
      const attrVal = attributes.find((a) => a.name === brandAttr.name && !a.isCustom)?.value;
      const v = (brandName || attrVal || "").trim();
      if (!v) bits.push(isBg ? "Добавете марка" : "Add a brand");
    }
    return bits;
  }, [attributes, brandAttr?.is_required, brandAttr?.name, brandName, categoryId, condition, isBg, isLoadingAttributes, requiredAttributesFilled]);

  return (
    <div className="flex flex-col gap-5 pb-24">
      {/* Quick inline guidance */}
      {!isValid && missingBits.length > 0 && (
        <div className="rounded-xl border border-border bg-muted/40 px-4 py-3">
          <p className="text-sm font-semibold">{isBg ? "За да продължите:" : "To continue:"}</p>
          <p className="text-xs text-muted-foreground mt-1">{missingBits.join(" • ")}</p>
        </div>
      )}

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

      {/* Brand (smart) */}
      <section className="space-y-2">
        <div className="flex items-center justify-between gap-3">
          <Label htmlFor="brandName" className="text-sm font-semibold">
            {isBg ? "Марка" : "Brand"}
            {brandAttr?.is_required ? (
              <span className="text-destructive ml-1">*</span>
            ) : (
              <span className="text-muted-foreground font-normal ml-1.5">
                ({isBg ? "по избор" : "optional"})
              </span>
            )}
          </Label>
          {/* Quick unbranded option */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-9 rounded-full"
            onClick={() => {
              const val = isBg ? "Без марка" : "Unbranded";
              setBrandValue(val);
              saveRecentBrand(val);
            }}
          >
            {isBg ? "Без марка" : "Unbranded"}
          </Button>
        </div>

        {recentBrands.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {recentBrands.map((b) => (
              <Button
                key={b}
                type="button"
                variant="secondary"
                size="sm"
                className="h-9 rounded-full"
                onClick={() => setBrandValue(b)}
              >
                {b}
              </Button>
            ))}
          </div>
        )}

        <Input
          id="brandName"
          value={brandName}
          onChange={(e) => setBrandValue(e.target.value)}
          onBlur={() => saveRecentBrand(brandName)}
          placeholder={isBg ? "напр. Nike, Adidas, Puma" : "e.g. Nike, Adidas, Puma"}
          className="h-10 rounded-lg"
        />
      </section>

      {/* Category-specific attributes */}
      {(requiredSpecifics.length > 0 || recommendedSpecifics.length > 0 || optionalSpecifics.length > 0) && (
        <section className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <Label className="text-sm font-semibold flex items-center gap-1.5">
              <Tag className="size-4 text-primary" weight="fill" />
              {isBg ? "Характеристики" : "Item Specifics"}
            </Label>
            {optionalSpecifics.length > 0 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-9 rounded-full"
                onClick={() => setShowOptionalSpecifics((v) => !v)}
              >
                {showOptionalSpecifics
                  ? (isBg ? "Скрий" : "Hide")
                  : (isBg ? "Още (по избор)" : "More (optional)")}
              </Button>
            )}
          </div>

          {requiredSpecifics.length > 0 && (
            <div className="space-y-3">
              {requiredSpecifics.map((attr) => (
                <AttributeInput
                  key={attr.id}
                  attribute={attr}
                  value={getAttributeValue(attr.name)}
                  onChange={(val) => handleAttributeChange(attr, val, false)}
                  locale={locale}
                />
              ))}
            </div>
          )}

          {recommendedSpecifics.length > 0 && (
            <div className="space-y-3">
              <p className="text-xs text-muted-foreground">
                {isBg ? "Препоръчани" : "Recommended"}
              </p>
              {recommendedSpecifics.map((attr) => (
                <AttributeInput
                  key={attr.id}
                  attribute={attr}
                  value={getAttributeValue(attr.name)}
                  onChange={(val) => handleAttributeChange(attr, val, false)}
                  locale={locale}
                />
              ))}
            </div>
          )}

          {showOptionalSpecifics && optionalSpecifics.length > 0 && (
            <div className="space-y-3">
              {optionalSpecifics.map((attr) => (
                <AttributeInput
                  key={attr.id}
                  attribute={attr}
                  value={getAttributeValue(attr.name)}
                  onChange={(val) => handleAttributeChange(attr, val, false)}
                  locale={locale}
                />
              ))}
            </div>
          )}
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
