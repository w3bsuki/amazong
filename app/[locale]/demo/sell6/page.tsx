"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useForm, FormProvider, useFormContext, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import {
  Camera,
  CaretLeft,
  CaretRight,
  Check,
  X,
  Plus,
  Tag,
  Truck,
  Sparkle,
  Package,
  CurrencyDollar,
  Star,
  ShieldCheck,
  CheckCircle,
  SpinnerGap,
  MagnifyingGlass,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";

// ============================================================================
// DEMO SELL 6 - Godlike Mobile Sell Form (iOS-first)
// Best of: photo-first UX + category search + premium cards + strong hierarchy
// ============================================================================

interface Category {
  id: string;
  name: string;
  name_bg: string | null;
  slug: string;
  parent_id: string | null;
  display_order?: number | null;
  icon?: string | null;
  children: Category[];
}

interface CategoryAttribute {
  id: string;
  category_id: string | null;
  name: string;
  name_bg: string | null;
  attribute_type: "text" | "number" | "select" | "multiselect" | "boolean" | "date" | "textarea";
  is_required: boolean | null;
  options: string[] | null;
  options_bg: string[] | null;
  placeholder: string | null;
  placeholder_bg: string | null;
  sort_order: number | null;
}

interface CategoryPathItem {
  id: string;
  name: string;
  name_bg: string | null;
  slug: string;
}

const EMPTY_CATEGORY_PATH: CategoryPathItem[] = [];

type SellFormData = {
  categoryId: string;
  categoryPath: CategoryPathItem[];
  attributes: Record<string, unknown>;
  photos: string[];
  title: string;
  condition: "new-with-tags" | "new-without-tags" | "like-new" | "good" | "fair";
  description?: string;
  quantity: number;
  listingType: "fixed" | "auction";
  price: string;
  compareAtPrice?: string;
  currency: "EUR" | "BGN" | "USD";
  freeShipping: boolean;
  shippingPrice?: string;
  city: string;
  acceptOffers: boolean;
  auctionDurationDays: "3" | "5" | "7" | undefined;
};

const CONDITIONS = [
  {
    value: "new-with-tags",
    labelKey: "conditions.newWithTags.label",
    descKey: "conditions.newWithTags.desc",
    icon: Sparkle,
    tone: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-500/10",
    ring: "ring-emerald-500/20",
  },
  {
    value: "new-without-tags",
    labelKey: "conditions.newWithoutTags.label",
    descKey: "conditions.newWithoutTags.desc",
    icon: CheckCircle,
    tone: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-500/10",
    ring: "ring-blue-500/20",
  },
  {
    value: "like-new",
    labelKey: "conditions.likeNew.label",
    descKey: "conditions.likeNew.desc",
    icon: Star,
    tone: "text-violet-600 dark:text-violet-400",
    bg: "bg-violet-500/10",
    ring: "ring-violet-500/20",
  },
  {
    value: "good",
    labelKey: "conditions.good.label",
    descKey: "conditions.good.desc",
    icon: ShieldCheck,
    tone: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-500/10",
    ring: "ring-amber-500/20",
  },
  {
    value: "fair",
    labelKey: "conditions.fair.label",
    descKey: "conditions.fair.desc",
    icon: Check,
    tone: "text-stone-600 dark:text-stone-400",
    bg: "bg-stone-500/10",
    ring: "ring-stone-500/20",
  },
] as const;

const CURRENCIES = [
  { value: "EUR", symbol: "€" },
  { value: "BGN", symbol: "лв" },
  { value: "USD", symbol: "$" },
] as const;

const CITIES = ["Sofia", "Plovdiv", "Varna", "Burgas", "Ruse", "Stara Zagora", "Pleven", "Sliven", "Dobrich", "Shumen"];

const AUCTION_DURATIONS = [
  { value: "3", labelKey: "pricing.auctionDuration3" },
  { value: "5", labelKey: "pricing.auctionDuration5" },
  { value: "7", labelKey: "pricing.auctionDuration7" },
] as const;

const TOTAL_STEPS = 6;

function getCategoryLabel(category: Category, isBg: boolean) {
  return isBg && category.name_bg ? category.name_bg : category.name;
}

function toPathItem(category: Category): CategoryPathItem {
  return {
    id: category.id,
    name: category.name,
    name_bg: category.name_bg,
    slug: category.slug,
  };
}

function getAttributeLabel(attribute: CategoryAttribute, isBg: boolean) {
  if (isBg && attribute.name_bg) return attribute.name_bg;
  return attribute.name;
}

function getAttributePlaceholder(attribute: CategoryAttribute, isBg: boolean) {
  if (isBg && attribute.placeholder_bg) return attribute.placeholder_bg;
  return attribute.placeholder;
}

function getAttributeOptions(attribute: CategoryAttribute, isBg: boolean) {
  if (isBg && attribute.options_bg && attribute.options_bg.length > 0) return attribute.options_bg;
  return attribute.options || [];
}

function useCategoryTree() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function fetchCategories() {
      try {
        const response = await fetch("/api/categories/sell-tree", { cache: "no-store" });
        if (!response.ok) throw new Error("Failed to load categories");
        const data = await response.json();
        if (!active) return;
        setCategories((data?.categories || []) as Category[]);
      } catch {
        if (!active) return;
        setCategories([]);
      } finally {
        if (active) setLoading(false);
      }
    }

    fetchCategories();
    return () => {
      active = false;
    };
  }, []);

  return { categories, loading };
}

function normalizeAttributes(raw: unknown): CategoryAttribute[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((attr) => ({
    id: String((attr as Record<string, unknown>).id ?? ""),
    category_id: String((attr as Record<string, unknown>).category_id ?? ""),
    name: String((attr as Record<string, unknown>).name ?? ""),
    name_bg: typeof (attr as Record<string, unknown>).name_bg === "string"
      ? String((attr as Record<string, unknown>).name_bg)
      : typeof (attr as Record<string, unknown>).nameBg === "string"
        ? String((attr as Record<string, unknown>).nameBg)
        : null,
    attribute_type: ((attr as Record<string, unknown>).attribute_type ?? (attr as Record<string, unknown>).type ?? "text") as CategoryAttribute["attribute_type"],
    is_required: Boolean((attr as Record<string, unknown>).is_required ?? (attr as Record<string, unknown>).required),
    options: ((attr as Record<string, unknown>).options ?? undefined) as string[] | null,
    options_bg: ((attr as Record<string, unknown>).options_bg ?? (attr as Record<string, unknown>).optionsBg ?? undefined) as string[] | null,
    placeholder: ((attr as Record<string, unknown>).placeholder ?? undefined) as string | null,
    placeholder_bg: ((attr as Record<string, unknown>).placeholder_bg ?? (attr as Record<string, unknown>).placeholderBg ?? undefined) as string | null,
    sort_order: Number((attr as Record<string, unknown>).sort_order ?? (attr as Record<string, unknown>).sortOrder ?? 0),
  }));
}

function useCategoryAttributes(categoryId: string | null) {
  const [attributes, setAttributes] = useState<CategoryAttribute[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;
    if (!categoryId) {
      setAttributes([]);
      setLoading(false);
      return () => {
        active = false;
      };
    }

    setLoading(true);
    const category = categoryId;

    async function fetchAttributes() {
      try {
        const response = await fetch(`/api/categories/${encodeURIComponent(category)}/attributes`, {
          cache: "no-store",
        });
        if (!response.ok) throw new Error("Failed to load attributes");
        const data = await response.json();
        const rawAttributes = (data && typeof data === "object" && "attributes" in data)
          ? (data as { attributes?: unknown }).attributes
          : data;
        if (!active) return;
        setAttributes(normalizeAttributes(rawAttributes));
      } catch {
        if (!active) return;
        setAttributes([]);
      } finally {
        if (active) setLoading(false);
      }
    }

    fetchAttributes();
    return () => {
      active = false;
    };
  }, [categoryId]);

  return { attributes, loading };
}

function createSchema(t: ReturnType<typeof useTranslations>) {
  return z.object({
    categoryId: z.string().min(1, t("validation.categoryRequired")),
    categoryPath: z
      .array(
        z.object({
          id: z.string(),
          name: z.string(),
          name_bg: z.string().nullable(),
          slug: z.string(),
        })
      )
      .optional(),
    attributes: z.record(z.unknown()).optional(),
    photos: z.array(z.string()).min(1, t("validation.photosRequired")).max(12),
    title: z
      .string()
      .min(5, t("validation.titleMin"))
      .max(80, t("validation.titleMax")),
    condition: z.enum(["new-with-tags", "new-without-tags", "like-new", "good", "fair"], {
      required_error: t("validation.conditionRequired"),
    }),
    description: z.string().max(4000).optional(),
    quantity: z.number().min(1),
    listingType: z.enum(["fixed", "auction"]).default("fixed"),
    price: z
      .string()
      .min(1, t("validation.priceRequired"))
      .refine((v) => !Number.isNaN(Number(v)) && Number(v) > 0, t("validation.priceInvalid")),
    compareAtPrice: z.string().optional(),
    currency: z.enum(["EUR", "BGN", "USD"]).default("EUR"),
    freeShipping: z.boolean().default(false),
    shippingPrice: z.string().optional(),
    city: z.string().min(1, t("validation.cityRequired")),
    acceptOffers: z.boolean().default(false),
    auctionDurationDays: z.enum(["3", "5", "7"]).optional(),
  }).superRefine((data, ctx) => {
    if (data.listingType === "auction" && !data.auctionDurationDays) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["auctionDurationDays"],
        message: t("validation.auctionDurationRequired"),
      });
    }
  });
}

function SectionHeader({
  title,
  subtitle,
  icon: Icon,
}: {
  title: string;
  subtitle?: string;
  icon?: React.ElementType;
}) {
  return (
    <div className="space-y-1">
      <div className="flex items-start gap-2">
        {Icon && <Icon className="size-5 text-muted-foreground mt-0.5" weight="bold" />}
        <div className="min-w-0">
          <h2 className="text-base font-semibold tracking-tight text-foreground">{title}</h2>
          {subtitle && <p className="text-sm text-muted-foreground leading-relaxed">{subtitle}</p>}
        </div>
      </div>
    </div>
  );
}

function FormField({
  label,
  error,
  hint,
  required,
  children,
}: {
  label: string;
  error?: string | undefined;
  hint?: string | undefined;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline justify-between">
        <label className="text-sm font-medium text-foreground">
          {label}
          {required && <span className="text-destructive ml-0.5">*</span>}
        </label>
        {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
      </div>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

function SelectionRow({
  value,
  placeholder,
  onClick,
  hasError,
}: {
  value?: string | undefined;
  placeholder: string;
  onClick: () => void;
  hasError?: boolean;
}) {
  const errorBorderClass = "border-destructive/60";

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full flex items-center justify-between h-12 px-4 rounded-xl border text-left transition-all",
        "bg-card shadow-sm hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30",
        "active:bg-muted/50",
        hasError ? errorBorderClass : "border-border"
      )}
    >
      <span className={cn("text-sm truncate", value ? "text-foreground font-semibold" : "text-muted-foreground")}>
        {value || placeholder}
      </span>
      <CaretRight className="size-4 text-muted-foreground/60 shrink-0" weight="bold" />
    </button>
  );
}

function ListCard({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="rounded-2xl bg-muted/30 overflow-hidden">
      {children}
    </div>
  );
}

function ListRow({
  title,
  description,
  leading,
  trailing,
  onClick,
  selected,
}: {
  title: string;
  description?: string;
  leading?: ReactNode;
  trailing?: ReactNode;
  onClick?: () => void;
  selected?: boolean;
}) {
  const isButton = typeof onClick === "function";
  const Comp = isButton ? "button" : "div";

  return (
    <Comp
      type={isButton ? "button" : undefined}
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 px-4 py-3 text-left",
        "transition-colors",
        isButton && "hover:bg-muted/40 active:bg-muted/60",
        selected && "bg-primary/5"
      )}
    >
      {leading && <div className="shrink-0">{leading}</div>}
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold text-foreground truncate">{title}</div>
        {description && <div className="text-xs text-muted-foreground truncate mt-0.5">{description}</div>}
      </div>
      {trailing && <div className="shrink-0">{trailing}</div>}
    </Comp>
  );
}

function StepCategory({
  categories,
  loading,
  isBg,
  onCategoryChange,
}: {
  categories: Category[];
  loading: boolean;
  isBg: boolean;
  onCategoryChange: () => void;
}) {
  const t = useTranslations("DemoSell6");
  const { watch, setValue, formState: { errors } } = useFormContext<SellFormData>();
  const categoryPath = watch("categoryPath") ?? EMPTY_CATEGORY_PATH;
  const categoryId = watch("categoryId") || "";

  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const categoryTree = categories;

  const flatCategories = useMemo(() => {
    const result: Array<{ category: Category; path: CategoryPathItem[] }> = [];
    const walk = (nodes: Category[], path: CategoryPathItem[] = []) => {
      for (const node of nodes) {
        const nextPath = [...path, toPathItem(node)];
        result.push({ category: node, path: nextPath });
        if (node.children?.length) {
          walk(node.children, nextPath);
        }
      }
    };
    walk(categoryTree);
    return result;
  }, [categoryTree]);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.trim().toLowerCase();
    return flatCategories
      .filter(({ category }) => getCategoryLabel(category, isBg).toLowerCase().includes(query))
      .slice(0, 16);
  }, [flatCategories, isBg, searchQuery]);

  const getCurrentCategories = () => {
    if (categoryPath.length === 0) return categoryTree;
    let current = categoryTree;
    for (const item of categoryPath) {
      const found = current.find((c) => c.id === item.id);
      if (!found || !found.children?.length) return [];
      current = found.children;
    }
    return current;
  };

  const getBreadcrumb = () => categoryPath.map((item) => (isBg && item.name_bg ? item.name_bg : item.name));

  const currentCategories = getCurrentCategories();
  const breadcrumb = getBreadcrumb();
  const hasError = !!errors.categoryId;

  const selectedLabel = (() => {
    if (!categoryId) return "";
    const leaf = categoryPath.at(-1);
    if (!leaf) return "";
    return isBg && leaf.name_bg ? leaf.name_bg : leaf.name;
  })();

  const selectedBreadcrumb = (() => {
    if (!categoryId || breadcrumb.length === 0) return "";
    return breadcrumb.join(" › ");
  })();

  const clearLeafSelection = () => {
    setValue("categoryId", "", { shouldValidate: true });
    setValue("attributes", {});
    onCategoryChange();
  };

  const selectCategory = (cat: Category) => {
    const nextPath = [...categoryPath, toPathItem(cat)];
    const hasChildren = Boolean(cat.children && cat.children.length > 0);

    setValue("categoryPath", nextPath, { shouldValidate: false });

    if (hasChildren) {
      clearLeafSelection();
      return;
    }

    setValue("categoryId", cat.id, { shouldValidate: true });
    setValue("attributes", {});
    onCategoryChange();
  };

  const selectFromSearch = (entry: { category: Category; path: CategoryPathItem[] }) => {
    const hasChildren = Boolean(entry.category.children && entry.category.children.length > 0);
    setValue("categoryPath", entry.path, { shouldValidate: false });
    if (hasChildren) {
      clearLeafSelection();
    } else {
      setValue("categoryId", entry.category.id, { shouldValidate: true });
      setValue("attributes", {});
      onCategoryChange();
    }
    setSearchQuery("");
    setIsSearching(false);
  };

  const goBackLevel = () => {
    if (categoryPath.length === 0) return;
    const nextPath = categoryPath.slice(0, -1);
    setValue("categoryPath", nextPath, { shouldValidate: false });
    clearLeafSelection();
  };

  const clearSelection = () => {
    setValue("categoryPath", [], { shouldValidate: false });
    clearLeafSelection();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <SpinnerGap className="size-7 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <SectionHeader
        icon={Package}
        title={t("category.title")}
        subtitle={t("category.subtitle")}
      />

      <div className={cn(
        "rounded-2xl bg-muted/30 transition-colors",
        "focus-within:ring-2 focus-within:ring-primary/30",
        isSearching ? "ring-1 ring-primary/20" : ""
      )}>
        <div className="flex items-center h-12 px-4 gap-3">
          <MagnifyingGlass className="size-4 text-muted-foreground shrink-0" />
          <Input
            type="text"
            value={searchQuery}
            onChange={(event) => {
              setSearchQuery(event.target.value);
              setIsSearching(event.target.value.length > 0);
            }}
            onFocus={() => searchQuery && setIsSearching(true)}
            placeholder={t("category.searchPlaceholder")}
            className="border-none bg-transparent h-full text-sm font-medium placeholder:text-muted-foreground/60 focus-visible:ring-0 p-0"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setIsSearching(false);
              }}
              className="size-8 flex items-center justify-center rounded-lg hover:bg-muted transition-colors"
              aria-label={t("category.clearSearch")}
            >
              <X className="size-4" />
            </button>
          )}
        </div>
      </div>

      {isSearching && (
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-1">
            {t("category.searchResults")}
          </p>
          {searchResults.length === 0 && (
            <div className="px-3 py-6 text-sm text-muted-foreground text-center">
              {t("category.noResults")}
            </div>
          )}
          {searchResults.length > 0 && (
            <ListCard>
              {searchResults.map((entry, index) => {
                const hasChildren = Boolean(entry.category.children && entry.category.children.length > 0);
                const pathLabel = entry.path
                  .slice(0, -1)
                  .map((p) => (isBg && p.name_bg ? p.name_bg : p.name))
                  .join(" › ");
                return (
                  <div key={entry.category.id}>
                    <ListRow
                      title={getCategoryLabel(entry.category, isBg)}
                      {...(pathLabel ? { description: pathLabel } : {})}
                      leading={<span className="text-base">{entry.category.icon || "•"}</span>}
                      trailing={
                        hasChildren
                          ? <CaretRight className="size-4 text-muted-foreground/50" weight="bold" />
                          : <span className="text-xs font-semibold text-muted-foreground">{t("category.select")}</span>
                      }
                      onClick={() => selectFromSearch(entry)}
                    />
                    {index < searchResults.length - 1 && <div className="h-px bg-border" />}
                  </div>
                );
              })}
            </ListCard>
          )}
        </div>
      )}

      {!isSearching && (
        <div className="space-y-3">
          {selectedBreadcrumb && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-primary/10 border border-primary/30">
              <span className="text-sm font-semibold text-primary flex-1 truncate">
                {selectedBreadcrumb}
              </span>
              <button
                type="button"
                onClick={clearSelection}
                className="size-7 rounded-full bg-primary/15 flex items-center justify-center hover:bg-primary/20"
                aria-label={t("category.clearSelection")}
              >
                <X className="size-3 text-primary" weight="bold" />
              </button>
            </div>
          )}

          {categoryPath.length > 0 && (
            <button
              type="button"
              onClick={goBackLevel}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-xl border border-border bg-card text-sm font-medium text-foreground hover:bg-muted"
            >
              <CaretLeft className="size-4" weight="bold" />
              {t("category.backLevel")}
            </button>
          )}

          {currentCategories.length > 0 ? (
            <div className="space-y-2">
              {categoryPath.length > 0 && (
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-1">
                  {t("category.selectSubcategory")}
                </p>
              )}
              <ListCard>
                {currentCategories.map((cat, index) => {
                  const hasChildren = Boolean(cat.children && cat.children.length > 0);
                  const isSelected = categoryId === cat.id;
                  return (
                    <div key={cat.id}>
                      <ListRow
                        title={getCategoryLabel(cat, isBg)}
                        leading={<span className="text-base">{cat.icon || "•"}</span>}
                        trailing={
                          isSelected
                            ? <Check className="size-4 text-primary" weight="bold" />
                            : hasChildren
                              ? <CaretRight className="size-4 text-muted-foreground/50" weight="bold" />
                              : <span className="text-xs font-semibold text-muted-foreground">{t("category.select")}</span>
                        }
                        onClick={() => selectCategory(cat)}
                        selected={isSelected}
                      />
                      {index < currentCategories.length - 1 && <div className="h-px bg-border" />}
                    </div>
                  );
                })}
              </ListCard>
            </div>
          ) : categoryPath.length > 0 ? (
            <div className={cn(
              "flex items-center justify-between gap-3 p-3 rounded-xl border",
              categoryId
                ? "bg-emerald-500/10 border-emerald-500/30"
                : "bg-muted/40 border-border"
            )}>
              <div className="flex items-center gap-2">
                {categoryId
                  ? <Check className="size-4 text-emerald-600 dark:text-emerald-400" weight="bold" />
                  : <span className="size-4 rounded-full bg-muted-foreground/30" aria-hidden="true" />
                }
                <span className={cn(
                  "text-sm font-medium",
                  categoryId
                    ? "text-emerald-700 dark:text-emerald-300"
                    : "text-muted-foreground"
                )}>
                  {categoryId ? t("category.ready") : t("category.chooseLeaf")}
                </span>
              </div>
              {categoryId && selectedLabel && (
                <span className="text-xs font-semibold text-foreground truncate max-w-40">
                  {selectedLabel}
                </span>
              )}
            </div>
          ) : null}
        </div>
      )}

      {hasError && (
        <div className="flex items-center gap-2.5 p-3 rounded-xl bg-destructive/5 border border-destructive/20">
          <span className="text-sm font-medium text-destructive">
            {t("validation.categoryRequired")}
          </span>
        </div>
      )}
    </div>
  );
}

function StepAttributes({
  categoryAttributes,
  loading,
  isBg,
}: {
  categoryAttributes: CategoryAttribute[];
  loading: boolean;
  isBg: boolean;
}) {
  const t = useTranslations("DemoSell6");

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <SpinnerGap className="size-7 text-primary animate-spin" />
      </div>
    );
  }

  if (categoryAttributes.length === 0) {
    return (
      <div className="space-y-4">
        <SectionHeader
          icon={Tag}
          title={t("attributes.title")}
          subtitle={t("attributes.subtitle")}
        />
        <div className="rounded-2xl border border-border bg-muted/40 p-4 text-sm text-muted-foreground">
          {t("attributes.empty")}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <SectionHeader
        icon={Tag}
        title={t("attributes.title")}
        subtitle={t("attributes.subtitle")}
      />

      <div className="space-y-5">
        {categoryAttributes.map((attribute) => (
          <AttributeField
            key={attribute.id}
            attribute={attribute}
            isBg={isBg}
          />
        ))}
      </div>
    </div>
  );
}

function AttributeField({
  attribute,
  isBg,
}: {
  attribute: CategoryAttribute;
  isBg: boolean;
}) {
  const t = useTranslations("DemoSell6");
  const { control } = useFormContext<SellFormData>();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const label = getAttributeLabel(attribute, isBg);
  const placeholder = getAttributePlaceholder(attribute, isBg) || t("attributes.placeholder", { field: label });
  const options = getAttributeOptions(attribute, isBg);
  const isRequired = attribute.is_required ?? false;

  if (attribute.attribute_type === "select" && options.length <= 6) {
    return (
      <Controller
        name={`attributes.${attribute.name}` as const}
        control={control}
        rules={{
          validate: (val) => {
            if (!isRequired) return true;
            return val ? true : t("validation.attributeRequired", { field: label });
          },
        }}
        render={({ field, fieldState }) => (
          <FormField label={label} error={fieldState.error?.message} required={isRequired}>
            <div className="flex flex-wrap gap-2">
              {options.map((option) => {
                const isSelected = field.value === option;
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => field.onChange(option)}
                    className={cn(
                      "px-3 py-2 rounded-xl text-sm font-semibold transition-all",
                      "active:scale-95",
                      isSelected
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "bg-muted/60 text-foreground hover:bg-muted"
                    )}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </FormField>
        )}
      />
    );
  }

  if (attribute.attribute_type === "select" && options.length > 6) {
    return (
      <Controller
        name={`attributes.${attribute.name}` as const}
        control={control}
        rules={{
          validate: (val) => {
            if (!isRequired) return true;
            return val ? true : t("validation.attributeRequired", { field: label });
          },
        }}
        render={({ field, fieldState }) => (
          <>
            <FormField label={label} error={fieldState.error?.message} required={isRequired}>
              <SelectionRow
                value={field.value as string | undefined}
                placeholder={placeholder}
                onClick={() => setDrawerOpen(true)}
                hasError={!!fieldState.error}
              />
            </FormField>

            <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
              <DrawerContent aria-label={label}>
                <DrawerHeader className="border-b">
                  <DrawerTitle>{label}</DrawerTitle>
                  <DrawerDescription>{t("attributes.selectHint")}</DrawerDescription>
                </DrawerHeader>
                <ScrollArea className="max-h-96">
                  <div className="p-2">
                    {options.map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => {
                          field.onChange(option);
                          setDrawerOpen(false);
                        }}
                        className={cn(
                          "w-full flex items-center justify-between px-4 py-3 rounded-xl text-left transition-colors",
                          "hover:bg-muted/60",
                          field.value === option && "bg-muted"
                        )}
                      >
                        <span className="text-sm font-semibold text-foreground">{option}</span>
                        {field.value === option && <Check className="size-4 text-primary" weight="bold" />}
                      </button>
                    ))}
                  </div>
                </ScrollArea>
              </DrawerContent>
            </Drawer>
          </>
        )}
      />
    );
  }

  const inputMode = attribute.attribute_type === "number" ? "decimal" : "text";

  return (
    <Controller
      name={`attributes.${attribute.name}` as const}
      control={control}
      rules={{
        validate: (val) => {
          if (!isRequired) return true;
          if (Array.isArray(val)) {
            return val.length > 0 || t("validation.attributeRequired", { field: label });
          }
          return val ? true : t("validation.attributeRequired", { field: label });
        },
      }}
      render={({ field, fieldState }) => (
        <FormField label={label} error={fieldState.error?.message} required={isRequired}>
          {attribute.attribute_type === "textarea" ? (
            <Textarea
              {...field}
              value={(field.value as string | undefined) || ""}
              placeholder={placeholder}
              rows={3}
              className="min-h-20 rounded-xl resize-none"
            />
          ) : attribute.attribute_type === "boolean" ? (
            <div className="flex items-center justify-between rounded-2xl border border-border bg-card p-4">
              <span className="text-sm font-semibold text-foreground">{label}</span>
              <Switch
                checked={Boolean(field.value)}
                onCheckedChange={(val) => field.onChange(val)}
              />
            </div>
          ) : attribute.attribute_type === "date" ? (
            <Input
              {...field}
              type="date"
              value={(field.value as string | undefined) || ""}
              placeholder={placeholder}
              className="h-12 rounded-xl"
            />
          ) : attribute.attribute_type === "multiselect" ? (
            <div className="flex flex-wrap gap-2">
              {options.map((option) => {
                const current = Array.isArray(field.value) ? field.value : [];
                const isSelected = current.includes(option);
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => {
                      const next = isSelected
                        ? current.filter((item) => item !== option)
                        : [...current, option];
                      field.onChange(next);
                    }}
                    className={cn(
                      "px-3 py-2 rounded-xl text-sm font-semibold transition-all",
                      "active:scale-95",
                      isSelected
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "bg-muted/60 text-foreground hover:bg-muted"
                    )}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          ) : (
            <Input
              {...field}
              value={(field.value as string | undefined) || ""}
              placeholder={placeholder}
              inputMode={inputMode}
              className="h-12 rounded-xl"
            />
          )}
        </FormField>
      )}
    />
  );
}

function StepPhotos() {
  const t = useTranslations("DemoSell6");
  const { watch, setValue, formState: { errors } } = useFormContext<SellFormData>();
  const photos = watch("photos") || [];

  const addDemoPhoto = () => {
    if (photos.length >= 12) return;
    const seed = Math.floor(Math.random() * 1000) + photos.length;
    const next = `https://picsum.photos/seed/${seed}/600/600`;
    setValue("photos", [...photos, next], { shouldValidate: true });
  };

  const removePhoto = (index: number) => {
    setValue("photos", photos.filter((_, i) => i !== index), { shouldValidate: true });
  };

  return (
    <div className="space-y-5">
      <SectionHeader
        icon={Camera}
        title={t("photos.title")}
        subtitle={t("photos.subtitle")}
      />

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{t("photos.helper")}</p>
        <Badge variant="outline" className="text-xs bg-card">
          {t("photos.count", { count: photos.length })}
        </Badge>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {photos.length < 12 && (
          <button
            type="button"
            onClick={addDemoPhoto}
            className={cn(
              "aspect-square rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-2 transition-all",
              "hover:bg-muted/40 active:scale-95 active:opacity-90",
              errors.photos ? "border-destructive/70" : "border-border"
            )}
          >
            <Camera className="size-6 text-muted-foreground" />
            <span className="text-xs font-semibold text-muted-foreground">{t("photos.add")}</span>
          </button>
        )}

        {photos.map((photo, index) => (
          <div key={`${photo}-${index}`} className="relative aspect-square rounded-2xl overflow-hidden bg-muted">
            <Image
              src={photo}
              alt={t("photos.photoAlt", { index: index + 1 })}
              width={600}
              height={600}
              className="w-full h-full object-cover"
              unoptimized
            />
            {index === 0 && (
              <div className="absolute bottom-1 left-1 px-2 py-0.5 rounded-full text-2xs font-semibold bg-foreground text-background">
                {t("photos.cover")}
              </div>
            )}
            <button
              type="button"
              onClick={() => removePhoto(index)}
              className="absolute top-1 right-1 size-7 rounded-full bg-background/90 shadow-sm flex items-center justify-center"
              aria-label={t("photos.remove")}
            >
              <X className="size-4" weight="bold" />
            </button>
          </div>
        ))}
      </div>

      {errors.photos?.message && <p className="text-xs text-destructive">{errors.photos.message}</p>}

      <div className="rounded-2xl border border-border bg-muted/40 p-4 text-xs text-muted-foreground leading-relaxed">
        {t("photos.tip")}
      </div>
    </div>
  );
}

function StepDetails() {
  const t = useTranslations("DemoSell6");
  const { control, watch, setValue, formState: { errors } } = useFormContext<SellFormData>();
  const title = watch("title") || "";
  const condition = watch("condition");
  const description = watch("description") || "";
  const quantity = watch("quantity");

  return (
    <div className="space-y-5">
      <SectionHeader
        icon={Sparkle}
        title={t("details.title")}
        subtitle={t("details.subtitle")}
      />

      <Controller
        name="title"
        control={control}
        render={({ field, fieldState }) => (
          <FormField
            label={t("details.titleLabel")}
            hint={t("details.titleCount", { count: title.length })}
            error={fieldState.error?.message}
            required
          >
            <Input
              {...field}
              value={field.value || ""}
              placeholder={t("details.titlePlaceholder")}
              maxLength={80}
              className={cn("h-12 rounded-xl", fieldState.error ? "border-destructive" : "")}
            />
          </FormField>
        )}
      />

      <FormField label={t("details.conditionLabel")} error={errors.condition?.message} required>
        <div className="grid grid-cols-1 gap-3">
          {CONDITIONS.map((item) => {
            const isSelected = item.value === condition;
            const Icon = item.icon;
            return (
              <button
                key={item.value}
                type="button"
                onClick={() => setValue("condition", item.value, { shouldValidate: true })}
                className={cn(
                  "w-full flex items-start gap-3 p-4 rounded-2xl border text-left transition-all",
                  "hover:bg-muted/40 active:scale-95 active:opacity-90",
                  isSelected ? "border-primary/40 bg-primary/5" : "border-border"
                )}
              >
                <div className={cn("size-10 rounded-xl flex items-center justify-center", item.bg)}>
                  <Icon className={cn("size-5", item.tone)} weight={isSelected ? "fill" : "regular"} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-foreground">
                    {t(item.labelKey)}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">{t(item.descKey)}</div>
                </div>
                {isSelected && <Check className="size-4 text-primary" weight="bold" />}
              </button>
            );
          })}
        </div>
      </FormField>

      <Controller
        name="description"
        control={control}
        render={({ field }) => (
          <FormField
            label={t("details.descriptionLabel")}
            hint={t("details.descriptionCount", { count: description.length })}
          >
            <Textarea
              {...field}
              placeholder={t("details.descriptionPlaceholder")}
              rows={4}
              maxLength={4000}
              className="min-h-24 rounded-xl resize-none"
            />
          </FormField>
        )}
      />

      <FormField label={t("details.quantityLabel")}>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setValue("quantity", Math.max(1, (quantity || 1) - 1))}
            className="size-10 rounded-xl border border-border bg-card shadow-sm hover:bg-muted flex items-center justify-center active:scale-95"
            aria-label={t("details.decrease")}
          >
            <CaretLeft className="size-4" weight="bold" />
          </button>
          <div className="min-w-16 text-center text-sm font-semibold tabular-nums">
            {quantity || 1}
          </div>
          <button
            type="button"
            onClick={() => setValue("quantity", Math.min(99, (quantity || 1) + 1))}
            className="size-10 rounded-xl border border-border bg-card shadow-sm hover:bg-muted flex items-center justify-center active:scale-95"
            aria-label={t("details.increase")}
          >
            <Plus className="size-4" weight="bold" />
          </button>
        </div>
      </FormField>
    </div>
  );
}

function StepPricing() {
  const t = useTranslations("DemoSell6");
  const { control, watch, setValue, formState: { errors } } = useFormContext<SellFormData>();
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const [cityOpen, setCityOpen] = useState(false);
  const [auctionDurationOpen, setAuctionDurationOpen] = useState(false);

  const price = watch("price") || "";
  const currency = watch("currency");
  const freeShipping = watch("freeShipping");
  const city = watch("city");
  const listingType = watch("listingType");
  const auctionDurationDays = watch("auctionDurationDays");

  const currencyLabel = CURRENCIES.find((item) => item.value === currency)?.value || currency;

  return (
    <div className="space-y-5">
      <SectionHeader
        icon={Tag}
        title={t("pricing.title")}
        subtitle={t("pricing.subtitle")}
      />

      <FormField label={t("pricing.listingTypeLabel")}>
        <ToggleGroup
          type="single"
          value={listingType}
          onValueChange={(val) => {
            if (!val) return;
            const next = val as SellFormData["listingType"];
            setValue("listingType", next, { shouldValidate: false });
            if (next !== "auction") {
              setValue("auctionDurationDays", undefined, { shouldValidate: true });
            }
          }}
          variant="outline"
          className="w-full"
        >
          <ToggleGroupItem value="fixed" className="flex-1">
            {t("pricing.listingTypeFixed")}
          </ToggleGroupItem>
          <ToggleGroupItem value="auction" className="flex-1">
            {t("pricing.listingTypeAuction")}
          </ToggleGroupItem>
        </ToggleGroup>
        <p className="text-xs text-muted-foreground mt-2">
          {listingType === "auction" ? t("pricing.listingTypeAuctionHint") : t("pricing.listingTypeFixedHint")}
        </p>
      </FormField>

      {listingType === "auction" && (
        <FormField
          label={t("pricing.auctionDurationLabel")}
          error={errors.auctionDurationDays?.message}
          required
        >
          <SelectionRow
            value={auctionDurationDays ? t(`pricing.auctionDuration${auctionDurationDays}` as const) : undefined}
            placeholder={t("pricing.auctionDurationPlaceholder")}
            onClick={() => setAuctionDurationOpen(true)}
            hasError={!!errors.auctionDurationDays}
          />
        </FormField>
      )}

      <Controller
        name="price"
        control={control}
        render={({ field, fieldState }) => (
          <FormField
            label={listingType === "auction" ? t("pricing.startingBidLabel") : t("pricing.priceLabel")}
            error={fieldState.error?.message}
            required
          >
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <Input
                  {...field}
                  value={field.value || ""}
                  placeholder={listingType === "auction" ? t("pricing.startingBidPlaceholder") : t("pricing.pricePlaceholder")}
                  inputMode="decimal"
                  className={cn("h-12 rounded-xl", fieldState.error ? "border-destructive" : "")}
                />
              </div>
              <button
                type="button"
                onClick={() => setCurrencyOpen(true)}
                className="h-12 px-3 rounded-xl border border-border bg-card text-sm font-semibold shadow-sm hover:bg-muted"
              >
                {currencyLabel}
              </button>
            </div>
          </FormField>
        )}
      />

      <Controller
        name="compareAtPrice"
        control={control}
        render={({ field }) => (
          <FormField label={t("pricing.compareAtLabel")} hint={t("pricing.compareHint")}>
            <Input
              {...field}
              value={field.value || ""}
              placeholder={t("pricing.comparePlaceholder")}
              inputMode="decimal"
              className="h-12 rounded-xl"
            />
          </FormField>
        )}
      />

      <FormField label={t("pricing.shippingLabel")}
        hint={freeShipping ? t("pricing.freeShippingHint") : undefined}
      >
        <div className="space-y-3">
          <div className="flex items-center justify-between rounded-2xl border border-border bg-card p-4">
            <div>
              <div className="text-sm font-semibold text-foreground">{t("pricing.freeShipping")}</div>
              <div className="text-xs text-muted-foreground">{t("pricing.freeShippingDesc")}</div>
            </div>
            <Switch checked={freeShipping} onCheckedChange={(value) => setValue("freeShipping", value)} />
          </div>

          {!freeShipping && (
            <Controller
              name="shippingPrice"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  value={field.value || ""}
                  placeholder={t("pricing.shippingPlaceholder")}
                  inputMode="decimal"
                  className="h-12 rounded-xl"
                />
              )}
            />
          )}
        </div>
      </FormField>

      <FormField label={t("pricing.cityLabel")} error={errors.city?.message} required>
        <SelectionRow
          value={city || undefined}
          placeholder={t("pricing.cityPlaceholder")}
          onClick={() => setCityOpen(true)}
          hasError={!!errors.city}
        />
      </FormField>

      <FormField label={t("pricing.offersLabel")}
        hint={t("pricing.offersHint")}
      >
        <div className="flex items-center justify-between rounded-2xl border border-border bg-card p-4">
          <div>
            <div className="text-sm font-semibold text-foreground">{t("pricing.acceptOffers")}</div>
            <div className="text-xs text-muted-foreground">{t("pricing.acceptOffersDesc")}</div>
          </div>
          <Switch
            checked={watch("acceptOffers")}
            onCheckedChange={(value) => setValue("acceptOffers", value)}
          />
        </div>
      </FormField>

      <Drawer open={currencyOpen} onOpenChange={setCurrencyOpen}>
        <DrawerContent aria-label={t("pricing.currencyTitle")}> 
          <DrawerHeader className="border-b">
            <DrawerTitle>{t("pricing.currencyTitle")}</DrawerTitle>
            <DrawerDescription>{t("pricing.currencySubtitle")}</DrawerDescription>
          </DrawerHeader>
          <div className="p-4 space-y-2">
            {CURRENCIES.map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => {
                  setValue("currency", item.value);
                  setCurrencyOpen(false);
                }}
                className={cn(
                  "w-full flex items-center justify-between px-4 py-3 rounded-xl border text-left",
                  currency === item.value ? "border-primary/40 bg-primary/5" : "border-border"
                )}
              >
                <span className="text-sm font-semibold text-foreground">{item.value}</span>
                <span className="text-sm text-muted-foreground">{item.symbol}</span>
              </button>
            ))}
          </div>
        </DrawerContent>
      </Drawer>

      <Drawer open={cityOpen} onOpenChange={setCityOpen}>
        <DrawerContent aria-label={t("pricing.cityTitle")}>
          <DrawerHeader className="border-b">
            <DrawerTitle>{t("pricing.cityTitle")}</DrawerTitle>
            <DrawerDescription>{t("pricing.citySubtitle")}</DrawerDescription>
          </DrawerHeader>
          <ScrollArea className="max-h-96">
            <div className="p-2">
              {CITIES.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => {
                    setValue("city", item, { shouldValidate: true });
                    setCityOpen(false);
                  }}
                  className={cn(
                    "w-full flex items-center justify-between px-4 py-3 rounded-xl text-left transition-colors",
                    "hover:bg-muted/60",
                    city === item && "bg-muted"
                  )}
                >
                  <span className="text-sm font-semibold text-foreground">{item}</span>
                  {city === item && <Check className="size-4 text-primary" weight="bold" />}
                </button>
              ))}
            </div>
          </ScrollArea>
        </DrawerContent>
      </Drawer>

      <Drawer open={auctionDurationOpen} onOpenChange={setAuctionDurationOpen}>
        <DrawerContent aria-label={t("pricing.auctionDurationTitle")}>
          <DrawerHeader className="border-b">
            <DrawerTitle>{t("pricing.auctionDurationTitle")}</DrawerTitle>
            <DrawerDescription>{t("pricing.auctionDurationSubtitle")}</DrawerDescription>
          </DrawerHeader>
          <div className="p-2">
            {AUCTION_DURATIONS.map((item, index) => (
              <div key={item.value}>
                <button
                  type="button"
                  onClick={() => {
                    setValue("auctionDurationDays", item.value, { shouldValidate: true });
                    setAuctionDurationOpen(false);
                  }}
                  className={cn(
                    "w-full flex items-center justify-between px-4 py-3 text-left transition-colors rounded-xl",
                    "hover:bg-muted/60",
                    auctionDurationDays === item.value && "bg-muted"
                  )}
                >
                  <span className="text-sm font-semibold text-foreground">{t(item.labelKey)}</span>
                  {auctionDurationDays === item.value && <Check className="size-4 text-primary" weight="bold" />}
                </button>
                {index < AUCTION_DURATIONS.length - 1 && <div className="h-px bg-border my-0.5" />}
              </div>
            ))}
          </div>
        </DrawerContent>
      </Drawer>

      {price && (
        <div className="rounded-2xl border border-border bg-muted/40 p-4 text-sm text-muted-foreground flex items-center gap-2">
          <CurrencyDollar className="size-4 text-primary" weight="bold" />
          {t("pricing.priceHint", { value: price, currency: currencyLabel })}
        </div>
      )}
    </div>
  );
}

function StepReview({
  categories,
  isBg,
}: {
  categories: Category[];
  isBg: boolean;
}) {
  const t = useTranslations("DemoSell6");
  const { watch } = useFormContext<SellFormData>();
  const values = watch();
  const condition = CONDITIONS.find((item) => item.value === values.condition);

  const categoryBreadcrumb = useMemo(() => {
    const path = values.categoryPath ?? [];
    return path
      .map((item) => (isBg && item.name_bg ? item.name_bg : item.name))
      .join(" › ");
  }, [isBg, values.categoryPath]);

  const listingTypeLabel = values.listingType === "auction"
    ? t("pricing.listingTypeAuction")
    : t("pricing.listingTypeFixed");

  return (
    <div className="space-y-5">
      <SectionHeader
        icon={CheckCircle}
        title={t("review.title")}
        subtitle={t("review.subtitle")}
      />

      <div className="rounded-2xl border border-border bg-card p-4 space-y-2">
        <div className="text-sm font-semibold text-foreground">{values.title || t("review.missingTitle")}</div>
        <div className="text-xs text-muted-foreground">
          {categoryBreadcrumb || t("review.missingCategory")}
        </div>
        <div className="text-xs text-muted-foreground">
          {condition ? t(condition.labelKey) : t("review.missingCondition")}
        </div>
        <div className="text-xs text-muted-foreground">
          {t("review.listingType")}: <span className="font-medium text-foreground">{listingTypeLabel}</span>
          {values.listingType === "auction" && values.auctionDurationDays && (
            <>
              {" "}• {t("review.auctionDuration")}: <span className="font-medium text-foreground">{t(`pricing.auctionDuration${values.auctionDurationDays}` as const)}</span>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-border bg-muted/40 p-4">
          <div className="text-xs text-muted-foreground">{t("review.price")}</div>
          <div className="text-sm font-semibold text-foreground">
            {values.price ? `${values.price} ${values.currency}` : t("review.missingPrice")}
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-muted/40 p-4">
          <div className="text-xs text-muted-foreground">{t("review.location")}</div>
          <div className="text-sm font-semibold text-foreground">
            {values.city || t("review.missingCity")}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-muted/40 p-4 text-xs text-muted-foreground">
        {t("review.previewNote")}
      </div>
    </div>
  );
}

export default function DemoSell6Page() {
  const t = useTranslations("DemoSell6");
  const locale = useLocale();
  const isBg = locale === "bg";
  const schema = useMemo(() => createSchema(t), [t]);

  const methods = useForm<SellFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      categoryId: "",
      categoryPath: [],
      attributes: {},
      photos: [],
      title: "",
      condition: "like-new",
      description: "",
      quantity: 1,
        listingType: "fixed",
      price: "",
      compareAtPrice: "",
      currency: "EUR",
      freeShipping: true,
      shippingPrice: "",
      city: "",
      acceptOffers: true,
        auctionDurationDays: undefined,
    },
    mode: "onChange",
  });

  const { categories, loading: categoriesLoading } = useCategoryTree();
  const leafCategoryId = methods.watch("categoryId") || null;
  const { attributes: categoryAttributes, loading: attributesLoading } = useCategoryAttributes(leafCategoryId);
  const requiredAttributeFields = useMemo(() => (
    categoryAttributes
      .filter((attr) => attr.is_required)
      .map((attr) => `attributes.${attr.name}`)
  ), [categoryAttributes]) as Array<`attributes.${string}`>;

  const [currentStep, setCurrentStep] = useState(0);

  const stepLabels = [
    t("steps.category"),
    t("steps.attributes"),
    t("steps.photos"),
    t("steps.details"),
    t("steps.pricing"),
    t("steps.review"),
  ];

  const currentLabel = stepLabels[currentStep] ?? "";

  const stepFields: Record<number, Array<keyof SellFormData>> = {
    0: ["categoryId"],
    1: [],
    2: ["photos"],
    3: ["title", "condition"],
    4: ["listingType", "price", "city", "auctionDurationDays"],
    5: [],
  };

  const progress = Math.round(((currentStep + 1) / TOTAL_STEPS) * 100);

  const handleNext = async () => {
    if (currentStep === 1 && attributesLoading) {
      return;
    }

    if (currentStep === 1 && requiredAttributeFields.length > 0) {
      const isValid = await methods.trigger(requiredAttributeFields as Parameters<typeof methods.trigger>[0]);
      if (!isValid) return;
      setCurrentStep((prev) => Math.min(prev + 1, TOTAL_STEPS - 1));
      return;
    }

    const fields = stepFields[currentStep] || [];
    const isValid = await methods.trigger(fields);
    if (!isValid) return;
    setCurrentStep((prev) => Math.min(prev + 1, TOTAL_STEPS - 1));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const onSubmit = methods.handleSubmit(() => {
    // Demo only
  });

  return (
    <FormProvider {...methods}>
      <div className="min-h-screen bg-background">
        <header className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border">
          <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
            <button
              type="button"
              onClick={handleBack}
              className="size-10 rounded-full border border-border bg-card shadow-sm flex items-center justify-center disabled:opacity-40 active:scale-95"
              disabled={currentStep === 0}
              aria-label={t("nav.back")}
            >
              <CaretLeft className="size-4" weight="bold" />
            </button>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-foreground">{t("nav.title")}</div>
              <div className="text-xs text-muted-foreground truncate">
                {t("nav.step", { step: currentStep + 1, total: TOTAL_STEPS, label: currentLabel })}
              </div>
            </div>
            <Badge variant="secondary" className="text-xs bg-muted/30">
              {progress}%
            </Badge>
          </div>
          <div className="h-1 w-full bg-muted">
            <div className="h-1 bg-primary transition-all" style={{ width: `${progress}%` }} />
          </div>
        </header>

        <form onSubmit={onSubmit} className="max-w-2xl mx-auto px-4 py-6 pb-32">
          <div className="space-y-6">
            {currentStep === 0 && (
              <StepCategory
                categories={categories}
                loading={categoriesLoading}
                isBg={isBg}
                onCategoryChange={() => methods.clearErrors("attributes")}
              />
            )}
            {currentStep === 1 && (
              <StepAttributes
                categoryAttributes={categoryAttributes}
                loading={attributesLoading}
                isBg={isBg}
              />
            )}
            {currentStep === 2 && <StepPhotos />}
            {currentStep === 3 && <StepDetails />}
            {currentStep === 4 && <StepPricing />}
            {currentStep === 5 && <StepReview categories={categories} isBg={isBg} />}
          </div>
        </form>

        <div className="sticky bottom-0 z-10 bg-background/95 backdrop-blur border-t border-border">
          <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
            <Button
              type="button"
              variant="ghost"
              className="flex-1 h-12 rounded-xl"
              onClick={handleBack}
              disabled={currentStep === 0}
            >
              {t("actions.back")}
            </Button>
            {currentStep < TOTAL_STEPS - 1 ? (
              <Button type="button" className="flex-1 h-12 rounded-xl" onClick={handleNext}>
                {t("actions.next")}
              </Button>
            ) : (
              <Button type="submit" className="flex-1 h-12 rounded-xl">
                {t("actions.publish")}
              </Button>
            )}
          </div>
        </div>
      </div>
    </FormProvider>
  );
}
