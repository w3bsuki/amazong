"use client";

import { useState, useEffect, useMemo, type ReactNode } from "react";
import { useForm, FormProvider, useFormContext, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import {
  Camera,
  CaretLeft,
  CaretRight,
  Check,
  X,
  Plus,
  Truck,
  ArrowRight,
  House,
  Eye,
  Share,
  MapPin,
  Handshake,
  ImageSquare,
  Tag,
  Package,
  Sparkle,
  CurrencyDollar,
  CheckCircle,
  WarningCircle,
  CloudArrowUp,
  Lightning,
  Info,
  CaretDown,
  SpinnerGap,
  Star,
  ShieldCheck,
  Timer,
  Percent,
  MagnifyingGlass,
  CaretUp,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { createClient } from "@/lib/supabase/client";

// ============================================================================
// SELL5 - CATEGORY-FIRST SELL FORM
// 
// Flow:
// 1. "What are you selling?" - Category selection with search
// 2. Category-specific attribute fields (dynamic from Supabase)
// 3. Photos & basic details
// 4. Price & shipping
// 5. Review & publish
// ============================================================================

// Types for Supabase data
interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  parent_id: string | null;
  children?: Category[];
}

interface CategoryAttribute {
  id: string;
  category_id: string | null;
  name: string;
  name_bg: string | null;
  attribute_type: string;
  is_required: boolean | null;
  is_filterable: boolean | null;
  options: string[] | null;
  options_bg: string[] | null;
  placeholder: string | null;
  placeholder_bg: string | null;
  sort_order: number | null;
}

// Schema - dynamic attributes stored in attributes JSONB
const sellFormSchema = z.object({
  // Category (required first)
  categoryPath: z.array(z.string()).min(1, "Select a category"),
  
  // Basic details
  title: z.string().min(3, "Title too short").max(80, "Max 80 characters"),
  description: z.string().max(4000).optional(),
  
  // Condition
  condition: z.enum(["new-with-tags", "new-without-tags", "like-new", "good", "fair"]),
  
  // Photos
  photos: z.array(z.string()).min(1, "Add at least 1 photo").max(12),
  
  // Price
  price: z.string().min(1, "Enter a price").refine(v => !isNaN(Number(v)) && Number(v) > 0, "Invalid price"),
  compareAtPrice: z.string().optional(),
  currency: z.enum(["EUR", "BGN", "USD"]).default("EUR"),
  
  // Shipping
  freeShipping: z.boolean().default(false),
  shippingPrice: z.string().optional(),
  city: z.string().min(1, "Select your city"),
  acceptOffers: z.boolean().default(false),
  
  // Dynamic attributes from category
  attributes: z.record(z.unknown()).optional(),
});

type SellFormData = z.infer<typeof sellFormSchema>;

// ============================================================================
// STATIC DATA
// ============================================================================

const CONDITIONS = [
  { 
    value: "new-with-tags", 
    label: "New with tags", 
    shortLabel: "New",
    desc: "Brand new, original tags attached",
    icon: Sparkle,
    color: "text-emerald-600 dark:text-emerald-400",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/30",
    ring: "ring-emerald-500/20",
  },
  { 
    value: "new-without-tags", 
    label: "New without tags", 
    shortLabel: "Unworn",
    desc: "Never used, no original packaging",
    icon: Star,
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/30",
    ring: "ring-blue-500/20",
  },
  { 
    value: "like-new", 
    label: "Excellent", 
    shortLabel: "Excellent",
    desc: "Minimal signs of wear, pristine condition",
    icon: CheckCircle,
    color: "text-violet-600 dark:text-violet-400",
    bgColor: "bg-violet-500/10",
    borderColor: "border-violet-500/30",
    ring: "ring-violet-500/20",
  },
  { 
    value: "good", 
    label: "Good", 
    shortLabel: "Good",
    desc: "Normal wear, fully functional",
    icon: Check,
    color: "text-amber-600 dark:text-amber-400",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/30",
    ring: "ring-amber-500/20",
  },
  { 
    value: "fair", 
    label: "Fair", 
    shortLabel: "Fair",
    desc: "Visible wear, works perfectly",
    icon: Info,
    color: "text-stone-600 dark:text-stone-400",
    bgColor: "bg-stone-500/10",
    borderColor: "border-stone-500/30",
    ring: "ring-stone-500/20",
  },
] as const;

const CITIES = [
  { name: "Sofia", region: "Sofia Region", popular: true },
  { name: "Plovdiv", region: "Plovdiv Region", popular: true },
  { name: "Varna", region: "Varna Region", popular: true },
  { name: "Burgas", region: "Burgas Region", popular: true },
  { name: "Ruse", region: "Ruse Region" },
  { name: "Stara Zagora", region: "Stara Zagora Region" },
];

const CURRENCIES = [
  { value: "EUR", symbol: "€", name: "Euro", flag: "🇪🇺" },
  { value: "BGN", symbol: "лв", name: "Bulgarian Lev", flag: "🇧🇬" },
  { value: "USD", symbol: "$", name: "US Dollar", flag: "🇺🇸" },
];

const TOTAL_STEPS = 5;

// ============================================================================
// DATA FETCHING HOOKS
// ============================================================================

function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    
    async function fetchCategories() {
      const { data, error } = await supabase
        .from("categories")
        .select("id, name, slug, icon, parent_id")
        .order("name");
      
      if (!error && data) {
        setCategories(data as Category[]);
      }
      setLoading(false);
    }
    
    fetchCategories();
  }, []);

  return { categories, loading };
}

function useCategoryAttributes(categoryId: string | null) {
  const [attributes, setAttributes] = useState<CategoryAttribute[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!categoryId) {
      setAttributes([]);
      return;
    }

    const supabase = createClient();
    setLoading(true);
    
    // Capture non-null value for use in async function
    const catId = categoryId;
    
    async function fetchAttributes() {
      const { data, error } = await supabase
        .from("category_attributes")
        .select("*")
        .eq("category_id", catId)
        .order("sort_order");
      
      if (!error && data) {
        setAttributes(data as CategoryAttribute[]);
      }
      setLoading(false);
    }
    
    fetchAttributes();
  }, [categoryId]);

  return { attributes, loading };
}

// ============================================================================
// REUSABLE COMPONENTS
// ============================================================================

function SectionTitle({ 
  children, 
  subtitle,
  icon: Icon,
  badge,
}: { 
  children: ReactNode; 
  subtitle?: string;
  icon?: React.ElementType;
  badge?: string;
}) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-3 mb-1">
        {Icon && (
          <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Icon className="size-5 text-primary" weight="bold" />
          </div>
        )}
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold tracking-tight text-foreground">
              {children}
            </h2>
            {badge && (
              <Badge variant="secondary" className="text-2xs font-bold px-2 py-0.5 rounded-md">
                {badge}
              </Badge>
            )}
          </div>
          {subtitle && (
            <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>
          )}
        </div>
      </div>
    </div>
  );
}

function SelectionCard({
  label,
  value,
  placeholder,
  onClick,
  hasError,
  icon: Icon,
  required,
}: {
  label: string;
  value?: string | undefined;
  placeholder: string;
  onClick: () => void;
  hasError?: boolean;
  icon?: React.ElementType;
  required?: boolean;
}) {
  const hasValue = !!value;
  
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3.5 min-h-16 px-4 py-3 rounded-2xl border text-left transition-all",
        "active:scale-[0.98]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30",
        hasError 
          ? "border-destructive/50 bg-destructive/5" 
          : hasValue 
            ? "border-primary/30 bg-primary/5" 
            : "border-border bg-card hover:bg-muted/30"
      )}
    >
      {Icon && (
        <div className={cn(
          "size-11 rounded-xl flex items-center justify-center shrink-0 transition-colors",
          hasValue ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"
        )}>
          <Icon className="size-5" weight={hasValue ? "fill" : "regular"} />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            {label}
          </span>
          {required && <span className="text-destructive text-xs">*</span>}
        </div>
        <span className={cn(
          "text-base font-semibold truncate block mt-0.5",
          hasValue ? "text-foreground" : "text-muted-foreground/50"
        )}>
          {value || placeholder}
        </span>
      </div>
      <CaretRight className={cn(
        "size-5 shrink-0 transition-colors",
        hasValue ? "text-primary/50" : "text-muted-foreground/30"
      )} weight="bold" />
    </button>
  );
}

function TogglePill({
  label,
  sublabel,
  checked,
  onChange,
  icon: Icon,
  checkedBgColor,
}: {
  label: string;
  sublabel?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  icon?: React.ElementType;
  checkedBgColor?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={cn(
        "w-full flex items-center gap-3.5 p-4 rounded-2xl border transition-all",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30",
        "active:scale-[0.98]",
        checked 
          ? "border-primary/40 bg-primary/5" 
          : "border-border bg-card hover:bg-muted/30"
      )}
    >
      {Icon && (
        <div className={cn(
          "size-11 rounded-xl flex items-center justify-center shrink-0 transition-all",
          checked 
            ? checkedBgColor || "bg-primary/15 text-primary" 
            : "bg-muted text-muted-foreground"
        )}>
          <Icon className="size-5" weight={checked ? "fill" : "regular"} />
        </div>
      )}
      <div className="flex-1 text-left min-w-0">
        <span className="text-base font-semibold block text-foreground">
          {label}
        </span>
        {sublabel && (
          <span className="text-sm text-muted-foreground line-clamp-1">{sublabel}</span>
        )}
      </div>
      <Switch 
        checked={checked} 
        onCheckedChange={onChange}
        className="shrink-0 scale-110"
      />
    </button>
  );
}

// Inline chips for small option sets (≤6 options)
function ChipSelector({
  options,
  value,
  onChange,
  label,
  required,
}: {
  options: string[];
  value: string | undefined;
  onChange: (val: string) => void;
  label: string;
  required?: boolean;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1.5 px-1">
        <span className="text-sm font-bold text-foreground">{label}</span>
        {required && <span className="text-destructive text-xs">*</span>}
      </div>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const isSelected = value === opt;
          return (
            <button
              key={opt}
              type="button"
              onClick={() => onChange(opt)}
              className={cn(
                "px-4 py-2.5 rounded-xl text-sm font-semibold transition-all",
                "active:scale-[0.97]",
                isSelected
                  ? "bg-primary text-primary-foreground ring-2 ring-primary/30"
                  : "bg-muted/60 text-foreground hover:bg-muted"
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

// ============================================================================
// STEP 1: CATEGORY SELECTION
// ============================================================================

function StepCategory() {
  const { watch, setValue, formState: { errors } } = useFormContext<SellFormData>();
  const { categories, loading } = useCategories();
  const categoryPath = watch("categoryPath") || [];
  
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  
  // Build category tree
  const categoryTree = useMemo((): Category[] => {
    const roots = categories.filter(c => c.parent_id === null);
    
    function buildTree(parentId: string | null): Category[] {
      return categories
        .filter(c => c.parent_id === parentId)
        .map(c => ({
          ...c,
          children: buildTree(c.id),
        }));
    }
    
    return roots.map(r => ({
      ...r,
      children: buildTree(r.id),
    }));
  }, [categories]);

  // Search results
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    
    const query = searchQuery.toLowerCase();
    return categories
      .filter(c => c.name.toLowerCase().includes(query))
      .slice(0, 15);
  }, [categories, searchQuery]);

  // Get current level categories to display
  const getCurrentLevelCategories = (): Category[] => {
    if (categoryPath.length === 0) {
      return categoryTree;
    }
    
    let current = categoryTree;
    for (const id of categoryPath) {
      const found = current.find(c => c.id === id);
      if (found?.children && found.children.length > 0) {
        current = found.children;
      } else {
        return [];
      }
    }
    return current;
  };

  // Get full path names for breadcrumb
  const getBreadcrumb = (): string[] => {
    const names: string[] = [];
    let current = categoryTree;
    
    for (const id of categoryPath) {
      const found = current.find(c => c.id === id);
      if (found) {
        names.push(found.name);
        current = found.children || [];
      }
    }
    return names;
  };

  const currentCategories = getCurrentLevelCategories();
  const breadcrumb = getBreadcrumb();
  const hasError = !!errors.categoryPath;

  const selectCategory = (cat: Category) => {
    const newPath = [...categoryPath, cat.id];
    setValue("categoryPath", newPath, { shouldValidate: true });
    setSearchQuery("");
    setIsSearching(false);
  };

  const selectFromSearch = (cat: Category) => {
    // Build path from root to this category
    const path: string[] = [];
    let currentCat: Category | undefined = cat;
    
    // Find all ancestors
    while (currentCat) {
      path.unshift(currentCat.id);
      if (currentCat.parent_id) {
        const parent = categories.find(c => c.id === currentCat!.parent_id);
        if (parent) {
          currentCat = parent;
        } else {
          break;
        }
      } else {
        break;
      }
    }
    
    setValue("categoryPath", path, { shouldValidate: true });
    setSearchQuery("");
    setIsSearching(false);
  };

  const finalCategory = categoryPath.length > 0 
    ? categories.find(c => c.id === categoryPath[categoryPath.length - 1])
    : null;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <SpinnerGap className="size-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <SectionTitle 
        icon={Package}
        subtitle="We'll show you relevant fields based on your category"
      >
        What are you selling?
      </SectionTitle>

      {/* Search input */}
      <div className={cn(
        "relative rounded-2xl border bg-card overflow-hidden transition-all",
        "focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary/50",
        isSearching ? "border-primary/50" : "border-border"
      )}>
        <div className="flex items-center h-14 px-4 gap-3">
          <MagnifyingGlass className="size-5 text-muted-foreground shrink-0" />
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsSearching(e.target.value.length > 0);
            }}
            onFocus={() => searchQuery && setIsSearching(true)}
            placeholder="Search all categories..."
            className="border-none bg-transparent h-full text-base font-medium placeholder:text-muted-foreground/40 focus-visible:ring-0 p-0"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setIsSearching(false);
              }}
              className="size-8 flex items-center justify-center rounded-lg hover:bg-muted transition-colors"
            >
              <X className="size-4" />
            </button>
          )}
        </div>
      </div>

      {/* Search results */}
      {isSearching && searchResults.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground px-1">
            Search results
          </p>
          {searchResults.map((cat) => {
            // Get parent path for context
            let parentNames: string[] = [];
            let current = cat;
            while (current.parent_id) {
              const parent = categories.find(c => c.id === current.parent_id);
              if (parent) {
                parentNames.unshift(parent.name);
                current = parent;
              } else break;
            }
            
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => selectFromSearch(cat)}
                className={cn(
                  "w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left",
                  "active:scale-[0.98] border-transparent bg-muted/40 hover:bg-muted/60"
                )}
              >
                <span className="text-xl shrink-0">{cat.icon || "📦"}</span>
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-semibold text-foreground block">
                    {cat.name}
                  </span>
                  {parentNames.length > 0 && (
                    <span className="text-xs text-muted-foreground">
                      {parentNames.join(" › ")}
                    </span>
                  )}
                </div>
                <CaretRight className="size-4 text-muted-foreground/40" weight="bold" />
              </button>
            );
          })}
        </div>
      )}

      {/* Category list */}
      {!isSearching && (
        <div className="space-y-2">
          {/* Selected category chip */}
          {categoryPath.length > 0 && finalCategory && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-primary/10 border border-primary/30 mb-3">
              <span className="text-lg">{finalCategory.icon || "📦"}</span>
              <span className="text-sm font-bold text-primary flex-1">{breadcrumb.join(" › ")}</span>
              <button
                type="button"
                onClick={() => setValue("categoryPath", [])}
                className="size-6 rounded-md bg-primary/20 flex items-center justify-center hover:bg-primary/30"
              >
                <X className="size-3 text-primary" weight="bold" />
              </button>
            </div>
          )}

          {/* Show subcategories or "done" state */}
          {currentCategories.length > 0 ? (
            <div className="space-y-1.5">
              {categoryPath.length > 0 && (
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground px-1 mb-2">
                  Select subcategory
                </p>
              )}
              {currentCategories.map((cat) => {
                const hasChildren = cat.children && cat.children.length > 0;
                
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => selectCategory(cat)}
                    className={cn(
                      "w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left",
                      "active:scale-[0.98] border-transparent bg-muted/40 hover:bg-muted/60"
                    )}
                  >
                    <span className="text-xl shrink-0">{cat.icon || "📦"}</span>
                    <span className="text-sm font-semibold text-foreground flex-1">
                      {cat.name}
                    </span>
                    {hasChildren && (
                      <CaretRight className="size-4 text-muted-foreground/40" weight="bold" />
                    )}
                  </button>
                );
              })}
            </div>
          ) : categoryPath.length > 0 ? (
            // No more subcategories - just show checkmark inline, user can continue
            <div className="flex items-center gap-2 p-3 rounded-xl bg-success/10 border border-success/30">
              <Check className="size-5 text-success" weight="bold" />
              <span className="text-sm font-medium text-success">Ready to continue</span>
            </div>
          ) : null}
        </div>
      )}

      {hasError && (
        <div className="flex items-center gap-2.5 p-3 rounded-xl bg-destructive/5 border border-destructive/20">
          <WarningCircle className="size-5 text-destructive shrink-0" weight="fill" />
          <span className="text-sm font-medium text-destructive">
            Please select a category to continue
          </span>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// STEP 2: DYNAMIC ATTRIBUTES
// ============================================================================

function StepAttributes() {
  const { watch, setValue } = useFormContext<SellFormData>();
  const categoryPath = watch("categoryPath") || [];
  const attributes = watch("attributes") || {};
  
  // Get the deepest category ID
  const leafCategoryId: string | null = categoryPath.length > 0 
    ? categoryPath[categoryPath.length - 1] ?? null
    : null;
  
  const { attributes: categoryAttributes, loading } = useCategoryAttributes(leafCategoryId);
  
  // Also fetch parent category attributes
  const [allAttributes, setAllAttributes] = useState<CategoryAttribute[]>([]);
  
  useEffect(() => {
    if (categoryAttributes.length > 0) {
      setAllAttributes(categoryAttributes);
    }
  }, [categoryAttributes]);

  const updateAttribute = (name: string, value: unknown) => {
    setValue("attributes", {
      ...attributes,
      [name]: value,
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <SpinnerGap className="size-8 text-primary animate-spin" />
      </div>
    );
  }

  if (allAttributes.length === 0) {
    return (
      <div className="space-y-5">
        <SectionTitle 
          icon={Tag}
          subtitle="Add details about your item"
        >
          Item details
        </SectionTitle>
        
        <div className="p-6 rounded-2xl bg-muted/30 border border-border/50 text-center">
          <p className="text-sm text-muted-foreground">
            No specific attributes for this category. Continue to add basic details.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <SectionTitle 
        icon={Tag}
        subtitle="Help buyers find your item with specific details"
      >
        Category details
      </SectionTitle>

      <div className="space-y-5">
        {allAttributes.map((attr) => (
          <AttributeField
            key={attr.id}
            attribute={attr}
            value={attributes[attr.name]}
            onChange={(val) => updateAttribute(attr.name, val)}
          />
        ))}
      </div>
    </div>
  );
}

// Dynamic attribute field renderer
function AttributeField({
  attribute,
  value,
  onChange,
}: {
  attribute: CategoryAttribute;
  value: unknown;
  onChange: (val: unknown) => void;
}) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  
  // Use name as label (title case)
  const label = attribute.name.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  const isRequired = attribute.is_required ?? false;

  // For select with ≤6 options, use inline chips
  if (attribute.attribute_type === "select" && attribute.options && attribute.options.length <= 6) {
    return (
      <ChipSelector
        options={attribute.options}
        value={value as string | undefined}
        onChange={onChange}
        label={label}
        required={isRequired}
      />
    );
  }

  // For select with >6 options, use drawer
  if (attribute.attribute_type === "select" && attribute.options && attribute.options.length > 6) {
    return (
      <>
        <SelectionCard
          label={label}
          value={value as string | undefined}
          placeholder={attribute.placeholder || `Select ${label.toLowerCase()}`}
          onClick={() => setDrawerOpen(true)}
          required={isRequired}
          icon={Tag}
        />
        
        <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
          <DrawerContent className="max-h-[85vh]">
            <DrawerHeader className="border-b border-border/50 pb-4">
              <DrawerTitle className="text-xl font-bold">Select {label}</DrawerTitle>
            </DrawerHeader>
            <ScrollArea className="flex-1 max-h-[60vh]">
              <div className="p-4 space-y-2">
                {attribute.options.map((opt) => {
                  const isSelected = value === opt;
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => {
                        onChange(opt);
                        setDrawerOpen(false);
                      }}
                      className={cn(
                        "w-full flex items-center gap-3.5 p-4 rounded-2xl border transition-all text-left",
                        "active:scale-[0.98]",
                        isSelected 
                          ? "border-primary bg-primary/5 ring-2 ring-primary/20" 
                          : "border-transparent bg-muted/40 hover:bg-muted/60"
                      )}
                    >
                      <span className={cn(
                        "text-base flex-1",
                        isSelected ? "font-bold" : "font-semibold"
                      )}>
                        {opt}
                      </span>
                      {isSelected && (
                        <div className="size-7 rounded-full bg-primary flex items-center justify-center">
                          <Check className="size-4 text-primary-foreground" weight="bold" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </ScrollArea>
          </DrawerContent>
        </Drawer>
      </>
    );
  }

  // Boolean type
  if (attribute.attribute_type === "boolean") {
    return (
      <TogglePill
        label={label}
        checked={value as boolean || false}
        onChange={onChange}
        icon={Check}
      />
    );
  }

  // Number type
  if (attribute.attribute_type === "number") {
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-1.5 px-1">
          <span className="text-sm font-bold text-foreground">{label}</span>
          {isRequired && <span className="text-destructive text-xs">*</span>}
        </div>
        <Input
          type="number"
          value={value as string || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={attribute.placeholder || ""}
          className="h-14 rounded-2xl text-base font-medium"
        />
      </div>
    );
  }

  // Text type (default)
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1.5 px-1">
        <span className="text-sm font-bold text-foreground">{label}</span>
        {isRequired && <span className="text-destructive text-xs">*</span>}
      </div>
      <Input
        type="text"
        value={value as string || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={attribute.placeholder || ""}
        className="h-14 rounded-2xl text-base font-medium"
      />
    </div>
  );
}

// ============================================================================
// STEP 3: PHOTOS & BASIC DETAILS
// ============================================================================

function StepPhotosDetails() {
  const { control, watch, setValue, formState: { errors } } = useFormContext<SellFormData>();
  const photos = watch("photos") || [];
  const title = watch("title") || "";
  const condition = watch("condition");
  const description = watch("description") || "";
  
  const [isUploading, setIsUploading] = useState(false);
  const [uploadingCount, setUploadingCount] = useState(0);
  const [conditionOpen, setConditionOpen] = useState(false);
  
  const selectedCondition = CONDITIONS.find(c => c.value === condition);

  const addDemoPhoto = (count: number = 1) => {
    if (photos.length >= 12 || isUploading) return;
    
    const toAdd = Math.min(count, 12 - photos.length);
    setIsUploading(true);
    setUploadingCount(toAdd);
    
    setTimeout(() => {
      const newPhotos = [...photos];
      for (let i = 0; i < toAdd; i++) {
        const randomId = Math.floor(Math.random() * 1000) + i;
        newPhotos.push(`https://picsum.photos/seed/${randomId}/800/800`);
      }
      setValue("photos", newPhotos, { shouldValidate: true });
      setIsUploading(false);
      setUploadingCount(0);
    }, 600);
  };

  const removePhoto = (index: number) => {
    setValue("photos", photos.filter((_, i) => i !== index), { shouldValidate: true });
  };

  const hasPhotos = photos.length > 0;
  const hasPhotoError = !!errors.photos;

  return (
    <div className="space-y-6">
      {/* Photos section */}
      <div className="space-y-4">
        <SectionTitle 
          icon={Camera}
          subtitle="Great photos sell faster"
        >
          Add photos
        </SectionTitle>

        {/* Photo count */}
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <div className={cn(
              "size-8 rounded-lg flex items-center justify-center text-sm font-bold",
              hasPhotos ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
            )}>
              {photos.length}
            </div>
            <span className="text-sm text-muted-foreground">of 12 photos</span>
          </div>
          {photos.length >= 3 && (
            <Badge variant="outline" className="text-success border-success/30 bg-success/5 gap-1">
              <Check className="size-3" weight="bold" />
              Great coverage
            </Badge>
          )}
        </div>

        {/* Upload area or grid */}
        {!hasPhotos ? (
          <button
            type="button"
            onClick={() => addDemoPhoto(1)}
            disabled={isUploading}
            className={cn(
              "w-full aspect-[4/3] rounded-3xl border-2 border-dashed flex flex-col items-center justify-center gap-4 transition-all",
              "hover:bg-muted/20 active:scale-[0.99]",
              isUploading ? "opacity-70 cursor-wait" : "",
              hasPhotoError ? "border-destructive/50 bg-destructive/5" : "border-border/60 bg-muted/10"
            )}
          >
            {isUploading ? (
              <>
                <div className="size-20 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <SpinnerGap className="size-10 text-primary animate-spin" />
                </div>
                <span className="text-base font-semibold text-foreground">Uploading...</span>
              </>
            ) : (
              <>
                <div className="size-20 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Camera className="size-10 text-primary" weight="fill" />
                </div>
                <div className="text-center space-y-1">
                  <span className="text-lg font-bold text-foreground block">Tap to add photos</span>
                  <span className="text-sm text-muted-foreground">JPG, PNG or WebP up to 10MB</span>
                </div>
              </>
            )}
          </button>
        ) : (
          <div className="grid grid-cols-3 gap-2.5">
            {photos.map((photo, index) => (
              <div
                key={`${photo}-${index}`}
                className="relative aspect-square rounded-2xl overflow-hidden bg-muted group ring-1 ring-border/50"
              >
                <img src={photo} alt={`Photo ${index + 1}`} className="w-full h-full object-cover" />
                {index === 0 && (
                  <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded-lg text-2xs font-bold bg-foreground/90 text-background backdrop-blur-sm">
                    Cover
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => removePhoto(index)}
                  className="absolute top-2 right-2 size-8 flex items-center justify-center rounded-full bg-background/90 text-foreground/70 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="size-4" weight="bold" />
                </button>
              </div>
            ))}
            {photos.length < 12 && (
              <button
                type="button"
                onClick={() => addDemoPhoto(1)}
                disabled={isUploading}
                className="aspect-square rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-1.5 border-border/60 hover:border-primary/40 active:scale-[0.97]"
              >
                {isUploading ? (
                  <SpinnerGap className="size-7 text-primary animate-spin" />
                ) : (
                  <>
                    <Plus className="size-7 text-muted-foreground" weight="bold" />
                    <span className="text-xs font-semibold text-muted-foreground">Add</span>
                  </>
                )}
              </button>
            )}
          </div>
        )}

        {hasPhotoError && (
          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-destructive/5 border border-destructive/20">
            <WarningCircle className="size-5 text-destructive shrink-0" weight="fill" />
            <span className="text-sm font-medium text-destructive">{errors.photos?.message}</span>
          </div>
        )}
      </div>

      {/* Title */}
      <Controller
        name="title"
        control={control}
        render={({ field, fieldState }) => (
          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <label className="text-sm font-bold text-foreground">
                Title <span className="text-destructive">*</span>
              </label>
              <span className={cn(
                "text-xs font-bold tabular-nums",
                title.length > 70 ? "text-warning" : "text-muted-foreground"
              )}>
                {title.length}/80
              </span>
            </div>
            <Input
              {...field}
              value={field.value || ""}
              placeholder="e.g. Nike Air Max 90 - Size 42"
              maxLength={80}
              className={cn(
                "h-14 rounded-2xl text-base font-medium",
                fieldState.error && "border-destructive/50"
              )}
            />
            {fieldState.error && (
              <p className="text-sm text-destructive flex items-center gap-2 px-1">
                <WarningCircle className="size-4" weight="fill" />
                {fieldState.error.message}
              </p>
            )}
          </div>
        )}
      />

      {/* Condition */}
      <SelectionCard
        label="Condition"
        value={selectedCondition?.label}
        placeholder="Select condition"
        onClick={() => setConditionOpen(true)}
        hasError={!!errors.condition}
        icon={Sparkle}
        required
      />

      {/* Description */}
      <Controller
        name="description"
        control={control}
        render={({ field }) => (
          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <label className="text-sm font-bold text-foreground">
                Description <span className="text-xs font-medium text-muted-foreground">(optional)</span>
              </label>
              <span className="text-xs font-medium tabular-nums text-muted-foreground">
                {description.length}/4000
              </span>
            </div>
            <Textarea
              {...field}
              placeholder="Tell buyers about your item..."
              rows={4}
              maxLength={4000}
              className="resize-none text-base rounded-2xl"
            />
          </div>
        )}
      />

      {/* Condition Drawer */}
      <Drawer open={conditionOpen} onOpenChange={setConditionOpen}>
        <DrawerContent className="max-h-[90vh]">
          <DrawerHeader className="border-b border-border/50 pb-4">
            <DrawerTitle className="text-xl font-bold">Item condition</DrawerTitle>
            <DrawerDescription>Be accurate — it builds trust with buyers</DrawerDescription>
          </DrawerHeader>
          <ScrollArea className="flex-1 max-h-[65vh]">
            <div className="p-4 space-y-3">
              {CONDITIONS.map((cond) => {
                const isSelected = condition === cond.value;
                const Icon = cond.icon;
                return (
                  <button
                    key={cond.value}
                    type="button"
                    onClick={() => {
                      setValue("condition", cond.value, { shouldValidate: true });
                      setConditionOpen(false);
                    }}
                    className={cn(
                      "w-full flex items-start gap-4 p-4 rounded-2xl border transition-all text-left",
                      "active:scale-[0.98]",
                      isSelected 
                        ? `${cond.borderColor} ${cond.bgColor} ring-2 ${cond.ring}` 
                        : "border-transparent bg-muted/40 hover:bg-muted/60"
                    )}
                  >
                    <div className={cn(
                      "size-12 rounded-xl flex items-center justify-center shrink-0",
                      isSelected ? cond.bgColor : "bg-muted"
                    )}>
                      <Icon className={cn("size-6", isSelected ? cond.color : "text-muted-foreground")} weight={isSelected ? "fill" : "regular"} />
                    </div>
                    <div className="flex-1 min-w-0 py-0.5">
                      <div className={cn("text-base font-bold", isSelected ? cond.color : "text-foreground")}>
                        {cond.label}
                      </div>
                      <p className="text-sm text-muted-foreground mt-0.5">{cond.desc}</p>
                    </div>
                    {isSelected && (
                      <div className={cn("size-7 rounded-full flex items-center justify-center shrink-0", cond.bgColor)}>
                        <Check className={cn("size-4", cond.color)} weight="bold" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </ScrollArea>
        </DrawerContent>
      </Drawer>
    </div>
  );
}

// ============================================================================
// STEP 4: PRICE & SHIPPING
// ============================================================================

function StepPrice() {
  const { control, watch, setValue, formState: { errors } } = useFormContext<SellFormData>();
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const [cityOpen, setCityOpen] = useState(false);
  
  const price = watch("price") || "";
  const currency = watch("currency") || "EUR";
  const city = watch("city");
  const freeShipping = watch("freeShipping");
  const acceptOffers = watch("acceptOffers");
  const compareAtPrice = watch("compareAtPrice") || "";
  
  const currencyData = CURRENCIES.find(c => c.value === currency);
  const numPrice = parseFloat(price) || 0;
  const numComparePrice = parseFloat(compareAtPrice) || 0;
  const hasSavings = numComparePrice > numPrice && numPrice > 0;
  const savingsPercent = hasSavings ? Math.round((1 - numPrice / numComparePrice) * 100) : 0;

  return (
    <div className="space-y-5">
      <SectionTitle 
        icon={CurrencyDollar}
        subtitle="Set a competitive price"
      >
        Price & shipping
      </SectionTitle>

      {/* Price input */}
      <Controller
        name="price"
        control={control}
        render={({ field, fieldState }) => (
          <div className="space-y-3">
            <label className="text-sm font-bold text-foreground px-1">
              Your price <span className="text-destructive">*</span>
            </label>
            
            <div className={cn(
              "rounded-2xl border bg-card overflow-hidden transition-all",
              "focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary/50",
              fieldState.error ? "border-destructive/50 bg-destructive/5" : "border-border"
            )}>
              <div className="flex items-center h-16 px-4">
                <span className="text-2xl font-bold text-muted-foreground mr-2">
                  {currencyData?.symbol}
                </span>
                <Input
                  type="text"
                  inputMode="decimal"
                  value={field.value || ""}
                  onChange={(e) => field.onChange(e.target.value)}
                  placeholder="0.00"
                  className="border-none bg-transparent h-full text-3xl font-bold p-0 focus-visible:ring-0 flex-1"
                />
                <button
                  type="button"
                  onClick={() => setCurrencyOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-muted/60 hover:bg-muted transition-colors"
                >
                  <span className="text-sm font-bold">{currency}</span>
                  <CaretDown className="size-3.5 text-muted-foreground" />
                </button>
              </div>
            </div>

            {fieldState.error && (
              <p className="text-sm text-destructive flex items-center gap-2 px-1">
                <WarningCircle className="size-4" weight="fill" />
                {fieldState.error.message}
              </p>
            )}
          </div>
        )}
      />

      {/* Compare at price */}
      <div className="space-y-2">
        <label className="text-sm font-bold text-foreground px-1 flex items-center gap-2">
          Compare at price
          <Badge variant="outline" className="text-2xs px-1.5 py-0 h-5 rounded font-medium">Optional</Badge>
        </label>
        <div className="flex items-center h-14 px-4 rounded-2xl border bg-card">
          <span className="text-base font-bold text-muted-foreground mr-2">{currencyData?.symbol}</span>
          <Input
            type="text"
            inputMode="decimal"
            value={compareAtPrice}
            onChange={(e) => setValue("compareAtPrice", e.target.value)}
            placeholder="Original price"
            className="border-none bg-transparent h-full text-lg font-semibold p-0 focus-visible:ring-0 flex-1"
          />
        </div>
        {hasSavings && (
          <div className="flex items-center gap-2 px-1 text-success">
            <Percent className="size-4" weight="fill" />
            <span className="text-sm font-bold">Buyers save {savingsPercent}%</span>
          </div>
        )}
      </div>

      {/* City selector */}
      <SelectionCard
        label="Ships from"
        value={city}
        placeholder="Select your city"
        onClick={() => setCityOpen(true)}
        hasError={!!errors.city}
        icon={MapPin}
        required
      />

      {/* Toggle options */}
      <div className="space-y-3 pt-1">
        <TogglePill
          label="Free shipping"
          sublabel="Attract more buyers with free delivery"
          checked={freeShipping}
          onChange={(checked) => setValue("freeShipping", checked)}
          icon={Truck}
          checkedBgColor="bg-shipping-free/15 text-shipping-free"
        />
        
        <TogglePill
          label="Accept offers"
          sublabel="Let buyers negotiate the price"
          checked={acceptOffers}
          onChange={(checked) => setValue("acceptOffers", checked)}
          icon={Handshake}
          checkedBgColor="bg-primary/15 text-primary"
        />
      </div>

      {/* Currency Drawer */}
      <Drawer open={currencyOpen} onOpenChange={setCurrencyOpen}>
        <DrawerContent>
          <DrawerHeader className="border-b border-border/50 pb-4">
            <DrawerTitle className="text-xl font-bold">Select currency</DrawerTitle>
          </DrawerHeader>
          <div className="p-4 space-y-2">
            {CURRENCIES.map((curr) => {
              const isSelected = currency === curr.value;
              return (
                <button
                  key={curr.value}
                  type="button"
                  onClick={() => {
                    setValue("currency", curr.value as "EUR" | "BGN" | "USD");
                    setCurrencyOpen(false);
                  }}
                  className={cn(
                    "w-full flex items-center gap-4 p-4 rounded-2xl border transition-all",
                    "active:scale-[0.98]",
                    isSelected 
                      ? "border-primary bg-primary/5 ring-2 ring-primary/20" 
                      : "border-transparent bg-muted/40 hover:bg-muted/60"
                  )}
                >
                  <span className="text-2xl">{curr.flag}</span>
                  <div className="flex-1 text-left">
                    <span className={cn("text-base block", isSelected ? "font-bold" : "font-semibold")}>
                      {curr.name}
                    </span>
                    <span className="text-sm text-muted-foreground">{curr.symbol} ({curr.value})</span>
                  </div>
                  {isSelected && (
                    <div className="size-7 rounded-full bg-primary flex items-center justify-center">
                      <Check className="size-4 text-primary-foreground" weight="bold" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </DrawerContent>
      </Drawer>

      {/* City Drawer */}
      <Drawer open={cityOpen} onOpenChange={setCityOpen}>
        <DrawerContent className="max-h-[85vh]">
          <DrawerHeader className="border-b border-border/50 pb-4">
            <DrawerTitle className="text-xl font-bold">Select city</DrawerTitle>
            <DrawerDescription>Where will you ship from?</DrawerDescription>
          </DrawerHeader>
          <ScrollArea className="flex-1 max-h-[60vh]">
            <div className="p-4 space-y-2">
              {CITIES.map((c) => {
                const isSelected = city === c.name;
                return (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => {
                      setValue("city", c.name, { shouldValidate: true });
                      setCityOpen(false);
                    }}
                    className={cn(
                      "w-full flex items-center gap-3.5 p-4 rounded-2xl border transition-all text-left",
                      "active:scale-[0.98]",
                      isSelected 
                        ? "border-primary bg-primary/5 ring-2 ring-primary/20" 
                        : "border-transparent bg-muted/40 hover:bg-muted/60"
                    )}
                  >
                    <MapPin className={cn("size-5", isSelected ? "text-primary" : "text-muted-foreground")} weight={isSelected ? "fill" : "regular"} />
                    <div className="flex-1">
                      <span className={cn("text-base block", isSelected ? "font-bold" : "font-semibold")}>{c.name}</span>
                      <span className="text-xs text-muted-foreground">{c.region}</span>
                    </div>
                    {isSelected && (
                      <div className="size-7 rounded-full bg-primary flex items-center justify-center">
                        <Check className="size-4 text-primary-foreground" weight="bold" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </ScrollArea>
        </DrawerContent>
      </Drawer>
    </div>
  );
}

// ============================================================================
// STEP 5: REVIEW
// ============================================================================

function StepReview({ 
  onEdit, 
  categories 
}: { 
  onEdit: (step: number) => void;
  categories: Category[];
}) {
  const { watch } = useFormContext<SellFormData>();
  const data = watch();
  
  const selectedCondition = CONDITIONS.find(c => c.value === data.condition);
  const currencyData = CURRENCIES.find(c => c.value === data.currency);

  // Get category names from path
  const getCategoryName = () => {
    if (!data.categoryPath?.length) return null;
    const leafId = data.categoryPath[data.categoryPath.length - 1];
    const cat = categories.find(c => c.id === leafId);
    return cat;
  };
  
  const finalCategory = getCategoryName();
  const numPrice = parseFloat(data.price) || 0;
  const numComparePrice = parseFloat(data.compareAtPrice || "") || 0;
  const hasSavings = numComparePrice > numPrice && numPrice > 0;

  return (
    <div className="space-y-5">
      <SectionTitle 
        icon={Eye}
        subtitle="Review your listing before publishing"
      >
        Almost done!
      </SectionTitle>

      {/* Preview card */}
      <div className="rounded-3xl border border-border bg-card overflow-hidden ring-1 ring-border/50">
        {/* Image section */}
        <div className="aspect-square bg-muted relative">
          {data.photos?.[0] ? (
            <img src={data.photos[0]} alt="Preview" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ImageSquare className="size-20 text-muted-foreground/20" />
            </div>
          )}
          
          {data.photos && data.photos.length > 1 && (
            <div className="absolute bottom-3 right-3 px-3 py-1.5 rounded-xl bg-foreground/80 backdrop-blur-sm text-background text-sm font-bold flex items-center gap-1.5">
              <Camera className="size-4" />
              {data.photos.length}
            </div>
          )}

          <button
            type="button"
            onClick={() => onEdit(3)}
            className="absolute top-3 right-3 size-10 rounded-xl bg-background/90 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors shadow-sm"
          >
            <Camera className="size-5" weight="bold" />
          </button>

          {selectedCondition && (
            <div className={cn(
              "absolute top-3 left-3 px-3 py-1.5 rounded-xl text-sm font-bold backdrop-blur-sm flex items-center gap-1.5",
              selectedCondition.bgColor,
              selectedCondition.color
            )}>
              <selectedCondition.icon className="size-4" weight="fill" />
              {selectedCondition.shortLabel}
            </div>
          )}
        </div>

        {/* Content section */}
        <div className="p-4 space-y-4">
          <div className="space-y-2">
            {finalCategory && (
              <Badge variant="secondary" className="text-xs font-bold">
                {finalCategory.icon} {finalCategory.name}
              </Badge>
            )}
            <h3 className="text-lg font-bold text-foreground leading-tight">
              {data.title || "Untitled listing"}
            </h3>
          </div>

          <div className="flex items-baseline gap-2.5 flex-wrap">
            <span className="text-2xl font-bold text-foreground">
              {currencyData?.symbol}{numPrice.toFixed(2)}
            </span>
            {hasSavings && (
              <>
                <span className="text-lg text-muted-foreground line-through">
                  {currencyData?.symbol}{numComparePrice.toFixed(2)}
                </span>
                <Badge className="bg-success/10 text-success border-success/30 text-sm font-bold">
                  -{Math.round((1 - numPrice / numComparePrice) * 100)}% OFF
                </Badge>
              </>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {data.freeShipping && (
              <Badge variant="outline" className="text-shipping-free border-shipping-free/30 bg-shipping-free/5 gap-1.5 font-semibold">
                <Truck className="size-3.5" weight="fill" />
                Free shipping
              </Badge>
            )}
            {data.acceptOffers && (
              <Badge variant="outline" className="text-primary border-primary/30 bg-primary/5 gap-1.5 font-semibold">
                <Handshake className="size-3.5" weight="fill" />
                Offers accepted
              </Badge>
            )}
            {data.city && (
              <Badge variant="outline" className="text-muted-foreground gap-1.5 font-medium">
                <MapPin className="size-3.5" />
                {data.city}
              </Badge>
            )}
          </div>

          {data.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
              {data.description}
            </p>
          )}
        </div>
      </div>

      {/* Quick edit buttons */}
      <div className="grid grid-cols-4 gap-2">
        {[
          { step: 1, icon: Package, label: "Category" },
          { step: 2, icon: Tag, label: "Details" },
          { step: 3, icon: Camera, label: "Photos" },
          { step: 4, icon: CurrencyDollar, label: "Price" },
        ].map(({ step, icon: Icon, label }) => (
          <button
            key={step}
            type="button"
            onClick={() => onEdit(step)}
            className="flex flex-col items-center gap-2 p-3 rounded-2xl border border-border bg-card hover:bg-muted/30 transition-all active:scale-[0.97]"
          >
            <div className="size-9 rounded-xl bg-muted flex items-center justify-center">
              <Icon className="size-4 text-muted-foreground" />
            </div>
            <span className="text-2xs font-semibold text-muted-foreground">{label}</span>
          </button>
        ))}
      </div>

      {/* Trust indicators */}
      <div className="p-4 rounded-2xl bg-muted/30 border border-border/50 space-y-3">
        <div className="flex items-center gap-3">
          <ShieldCheck className="size-5 text-primary" weight="fill" />
          <span className="text-sm font-semibold text-foreground">Buyer Protection included</span>
        </div>
        <div className="flex items-center gap-3">
          <Timer className="size-5 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Listing active for 30 days</span>
        </div>
      </div>

      <p className="text-xs text-muted-foreground text-center px-4 leading-relaxed">
        By publishing, you agree to our{" "}
        <Link href="/terms" className="underline underline-offset-2 hover:text-foreground font-medium">
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link href="/seller-policy" className="underline underline-offset-2 hover:text-foreground font-medium">
          Seller Policy
        </Link>
      </p>
    </div>
  );
}

// ============================================================================
// STEPPER
// ============================================================================

function Stepper({
  children,
  currentStep,
  totalSteps,
  onBack,
  onNext,
  onSubmit,
  isSubmitting,
}: {
  children: ReactNode;
  currentStep: number;
  totalSteps: number;
  onBack: () => void;
  onNext: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}) {
  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === totalSteps;

  const progressPercent = (currentStep / totalSteps) * 100;

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-border/40 pt-safe">
        <div className="flex items-center h-14 px-4">
          <div className="w-12">
            {!isFirstStep && (
              <button
                type="button"
                onClick={onBack}
                className="size-10 -ml-2 flex items-center justify-center rounded-xl hover:bg-muted transition-colors"
              >
                <CaretLeft className="size-5" weight="bold" />
              </button>
            )}
          </div>
          
          <div className="flex-1 flex items-center justify-center gap-2">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div
                key={i}
                className={cn(
                  "transition-all duration-300 rounded-full",
                  i + 1 === currentStep 
                    ? "w-8 h-2 bg-primary" 
                    : i + 1 < currentStep
                      ? "w-2 h-2 bg-primary/50"
                      : "w-2 h-2 bg-border"
                )}
              />
            ))}
          </div>
          
          <div className="w-12 flex justify-end">
            <Link 
              href="/demo"
              className="size-10 flex items-center justify-center rounded-xl hover:bg-muted transition-colors"
            >
              <X className="size-5" />
            </Link>
          </div>
        </div>

        <div className="h-0.5 bg-border/50">
          <div 
            className="h-full bg-primary transition-all duration-500 ease-out" 
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-lg px-4 py-6">
          {children}
        </div>
      </main>

      {/* Footer CTA */}
      <footer className="sticky bottom-0 bg-background/95 backdrop-blur-md border-t border-border/40 px-4 pt-4 pb-safe">
        <div className="mx-auto max-w-lg pb-4">
          {isLastStep ? (
            <Button
              type="button"
              onClick={onSubmit}
              disabled={isSubmitting}
              size="lg"
              className="w-full h-14 rounded-2xl text-base font-bold gap-2.5"
            >
              {isSubmitting ? (
                <>
                  <SpinnerGap className="size-5 animate-spin" />
                  Publishing...
                </>
              ) : (
                <>
                  <CloudArrowUp className="size-5" weight="bold" />
                  Publish listing
                </>
              )}
            </Button>
          ) : (
            <Button
              type="button"
              onClick={onNext}
              size="lg"
              className="w-full h-14 rounded-2xl text-base font-bold gap-2.5"
            >
              Continue
              <ArrowRight className="size-5" weight="bold" />
            </Button>
          )}
        </div>
      </footer>
    </div>
  );
}

// ============================================================================
// SUCCESS SCREEN
// ============================================================================

function SuccessScreen({ 
  data,
  onNewListing 
}: { 
  data: SellFormData;
  onNewListing: () => void;
}) {
  const currencyData = CURRENCIES.find(c => c.value === data.currency);
  const numPrice = parseFloat(data.price) || 0;

  return (
    <div className="min-h-dvh bg-background flex flex-col pt-safe">
      <header className="flex items-center justify-end h-14 px-4 border-b border-border/40">
        <Link 
          href="/demo"
          className="size-10 flex items-center justify-center rounded-xl hover:bg-muted transition-colors"
        >
          <X className="size-5" />
        </Link>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
        <div className="w-full max-w-sm text-center space-y-8">
          <div className="size-28 rounded-3xl bg-success/10 flex items-center justify-center mx-auto">
            <CheckCircle className="size-16 text-success" weight="fill" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-foreground">Listed successfully!</h1>
            <p className="text-base text-muted-foreground">Your item is now live</p>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-2xl bg-muted/30 border border-border/50 text-left">
            {data.photos?.[0] ? (
              <img src={data.photos[0]} alt="Preview" className="size-18 rounded-xl object-cover" />
            ) : (
              <div className="size-18 rounded-xl bg-muted flex items-center justify-center">
                <ImageSquare className="size-8 text-muted-foreground/30" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="font-bold text-foreground truncate text-base">{data.title || "Your listing"}</p>
              <p className="text-xl font-bold text-primary mt-0.5">
                {currencyData?.symbol}{numPrice.toFixed(2)}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <Button size="lg" className="w-full h-14 rounded-2xl text-base font-bold gap-2.5" asChild>
              <Link href="/demo">
                <Eye className="size-5" />
                View listing
              </Link>
            </Button>

            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" size="lg" className="h-12 rounded-xl font-semibold gap-2">
                <Share className="size-5" />
                Share
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="h-12 rounded-xl font-semibold gap-2"
                onClick={onNewListing}
              >
                <Plus className="size-5" />
                New listing
              </Button>
            </div>

            <Button variant="ghost" className="w-full text-muted-foreground hover:text-foreground gap-2" asChild>
              <Link href="/demo">
                <House className="size-5" />
                Back to home
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// MAIN PAGE
// ============================================================================

export default function DemoSell5Page() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [submittedData, setSubmittedData] = useState<SellFormData | null>(null);
  
  const { categories } = useCategories();

  const methods = useForm<SellFormData>({
    resolver: zodResolver(sellFormSchema),
    defaultValues: {
      categoryPath: [],
      title: "",
      description: "",
      condition: "like-new",
      photos: [],
      price: "",
      currency: "EUR",
      freeShipping: false,
      shippingPrice: "",
      city: "",
      acceptOffers: false,
      attributes: {},
    },
    mode: "onChange",
  });

  const handleNext = async () => {
    const fieldsMap: Record<number, (keyof SellFormData)[]> = {
      1: ["categoryPath"],
      2: [], // Dynamic attributes - optional validation
      3: ["photos", "title", "condition"],
      4: ["price", "city"],
    };
    
    const fields = fieldsMap[currentStep] || [];
    const isValid = fields.length > 0 ? await methods.trigger(fields) : true;
    
    if (isValid && currentStep < TOTAL_STEPS) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    const isValid = await methods.trigger();
    if (!isValid) return;

    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setSubmittedData(methods.getValues());
    setShowSuccess(true);
  };

  const handleNewListing = () => {
    methods.reset();
    setCurrentStep(1);
    setShowSuccess(false);
    setSubmittedData(null);
  };

  const handleEditStep = (step: number) => {
    setCurrentStep(step);
  };

  if (showSuccess && submittedData) {
    return <SuccessScreen data={submittedData} onNewListing={handleNewListing} />;
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1: return <StepCategory />;
      case 2: return <StepAttributes />;
      case 3: return <StepPhotosDetails />;
      case 4: return <StepPrice />;
      case 5: return <StepReview onEdit={handleEditStep} categories={categories} />;
      default: return null;
    }
  };

  return (
    <FormProvider {...methods}>
      <Stepper
        currentStep={currentStep}
        totalSteps={TOTAL_STEPS}
        onBack={handleBack}
        onNext={handleNext}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      >
        {renderStep()}
      </Stepper>
    </FormProvider>
  );
}
