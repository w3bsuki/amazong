"use client";

import { useState, useMemo, useCallback } from "react";
import { CaretRight, Check, X, MagnifyingGlass, CaretLeft, FolderSimple } from "@phosphor-icons/react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import type { Category, CategoryPathItem } from "../../../_lib/types";

// ============================================================================
// Types
// ============================================================================
interface CategoryModalProps {
  categories: Category[];
  value: string;
  selectedPath?: CategoryPathItem[];
  onChange: (categoryId: string, path: CategoryPathItem[]) => void;
  locale?: string;
  className?: string;
}

interface FlatCategory extends Category {
  path: CategoryPathItem[];
  fullPath: string;
  searchText: string;
}

// ============================================================================
// Shared Sub-Components (DRY)
// ============================================================================

/** Reusable search input for category search */
function CategorySearchInput({
  value,
  onChange,
  locale,
  compact = false,
}: {
  value: string;
  onChange: (val: string) => void;
  locale: string;
  compact?: boolean;
}) {
  return (
    <div className="relative">
      <MagnifyingGlass 
        className={cn(
          "absolute top-1/2 -translate-y-1/2 text-muted-foreground",
          compact ? "left-2.5 size-4" : "left-3.5 size-5 text-muted-foreground/50"
        )} 
        weight="bold" 
      />
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={locale === "bg" ? (compact ? "Търси..." : "Търси категория...") : (compact ? "Search..." : "Search category...")}
        className={cn(
          compact 
            ? "pl-9 h-9 text-sm" 
            : "pl-11 h-12 text-base font-medium rounded-md border-border bg-muted focus:bg-background transition-colors"
        )}
      />
    </div>
  );
}

/** Reusable empty state when no search results */
function CategoryEmptyState({ locale, compact = false }: { locale: string; compact?: boolean }) {
  if (compact) {
    return (
      <div className="py-8 text-center text-muted-foreground">
        <p className="text-sm">
          {locale === "bg" ? "Няма резултати" : "No results"}
        </p>
      </div>
    );
  }

  return (
    <div className="py-12 text-center">
      <div className="size-16 rounded-full bg-surface-subtle flex items-center justify-center mx-auto mb-4">
        <MagnifyingGlass className="size-8 text-muted-foreground/30" />
      </div>
      <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
        {locale === "bg" ? "Няма намерени резултати" : "No results found"}
      </p>
    </div>
  );
}

/** Reusable search results list */
function CategorySearchResults({
  results,
  selectedValue,
  onSelect,
  locale,
  compact = false,
}: {
  results: FlatCategory[];
  selectedValue: string;
  onSelect: (cat: FlatCategory) => void;
  locale: string;
  compact?: boolean;
}) {
  const getName = (cat: FlatCategory) =>
    locale === "bg" && cat.name_bg ? cat.name_bg : cat.name;

  if (compact) {
    return (
      <div className="space-y-1">
        {results.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => onSelect(cat)}
            className={cn(
              "w-full flex flex-col items-start gap-0.5 px-3 py-2 rounded-md text-left transition-colors",
              "hover:bg-hover",
              selectedValue === cat.id && "bg-selected"
            )}
          >
            <span className="text-sm font-medium">{getName(cat)}</span>
            <span className="text-xs text-muted-foreground truncate w-full">
              {cat.fullPath}
            </span>
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-2">
      {results.map((cat) => (
        <button
          key={cat.id}
          type="button"
          onClick={() => onSelect(cat)}
          className={cn(
            "w-full flex flex-col items-start gap-0.5 px-4 py-2.5 rounded-md border text-left transition-colors",
            selectedValue === cat.id 
              ? "border-selected-border bg-selected shadow-xs" 
              : "border-border bg-background hover:border-hover-border"
          )}
        >
          <span className="text-sm font-bold text-foreground">{getName(cat)}</span>
          <span className="text-2xs font-bold text-muted-foreground uppercase tracking-wider truncate w-full">
            {cat.fullPath}
          </span>
        </button>
      ))}
    </div>
  );
}

// ============================================================================
// Helper Functions
// ============================================================================
function toPathItem(cat: Category): CategoryPathItem {
  return {
    id: cat.id,
    name: cat.name,
    name_bg: cat.name_bg ?? null,
    slug: cat.slug,
  };
}

// ============================================================================
// Main Category Selector (Exported)
// ============================================================================
export function CategorySelector({
  categories,
  value,
  selectedPath,
  onChange,
  locale = "en",
  className,
}: CategoryModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();

  // Flatten categories for search and lookup
  const flatCategories = useMemo(() => {
    const result: FlatCategory[] = [];
    function flatten(cats: Category[], path: CategoryPathItem[] = []) {
      for (const cat of cats) {
        const currentPath = [...path, toPathItem(cat)];
        const fullPath = currentPath
          .map((c) => (locale === "bg" && c.name_bg ? c.name_bg : c.name))
          .join(" › ");
        result.push({
          ...cat,
          path: currentPath,
          fullPath,
          searchText: `${cat.name} ${cat.name_bg || ""} ${cat.slug}`.toLowerCase(),
        });
        if (cat.children?.length) {
          flatten(cat.children, currentPath);
        }
      }
    }
    flatten(categories);
    return result;
  }, [categories, locale]);

  // Find selected category
  const selectedCategory = useMemo(() => {
    if (!value) return null;
    const found = flatCategories.find((c) => c.id === value);
    if (found) return found;

    // If not found in flat list (lazy loaded), use selectedPath if available
    if (selectedPath && selectedPath.length > 0) {
      const last = selectedPath.at(-1);
      if (last && last.id === value) {
        const fullPath = selectedPath
          .map((c) => (locale === "bg" && c.name_bg ? c.name_bg : c.name))
          .join(" › ");
        return {
          ...last,
          parent_id: null,
          path: selectedPath,
          fullPath,
          searchText: "",
        } as FlatCategory;
      }
    }

    return null;
  }, [flatCategories, value, selectedPath, locale]);

  // Smart path display for mobile to save space
  const displayPath = useMemo(() => {
    if (!selectedCategory) return locale === "bg" ? "Изберете..." : "Select...";
    
    const path = selectedCategory.path;
    if (!path || path.length === 0) return selectedCategory.name;

    // On mobile, truncate long paths to show only the most relevant context (last 2 segments)
    if (isMobile && path.length > 2) {
      const lastTwo = path.slice(-2).map(c => (locale === "bg" && c.name_bg ? c.name_bg : c.name));
      return `... › ${lastTwo.join(" › ")}`;
    }
    
    return selectedCategory.fullPath;
  }, [selectedCategory, locale, isMobile]);

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange("", []);
  };

  const handleSelect = useCallback(
    (cat: FlatCategory) => {
      onChange(cat.id, cat.path);
      setIsOpen(false);
    },
    [onChange]
  );

  // ===== TRIGGER BUTTON - Compact, matches input styling =====
  const TriggerButton = (
    <button
      type="button"
      onClick={() => setIsOpen(true)}
      className={cn(
        "relative w-full flex items-center h-12 px-4 rounded-md border transition-all text-left",
        "bg-background border border-border shadow-xs",
        "hover:border-hover-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background",
        "transition-colors",
        className
      )}
    >
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <span className="text-2xs font-bold uppercase tracking-wider text-muted-foreground shrink-0">
          {locale === "bg" ? "Категория:" : "Category:"}
        </span>
        <span className={cn(
          "text-sm font-semibold truncate pr-4",
          selectedCategory ? "text-foreground" : "text-muted-foreground"
        )}>
          {displayPath}
        </span>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {selectedCategory && (
          <div className="size-5 rounded-full bg-selected flex items-center justify-center">
            <Check className="size-3 text-primary" weight="bold" />
          </div>
        )}
        <CaretRight className="size-4 text-muted-foreground" weight="bold" />
      </div>
    </button>
  );

  const contentProps = {
    categories,
    flatCategories,
    value,
    onSelect: handleSelect,
    locale,
  };

  if (isMobile) {
    return (
      <>
        {TriggerButton}
        <Drawer open={isOpen} onOpenChange={setIsOpen} snapPoints={[1]}>
          <DrawerContent className="h-full max-h-full rounded-none">
            <DrawerHeader className="sr-only">
              <DrawerTitle>
                {locale === "bg" ? "Избери категория" : "Select Category"}
              </DrawerTitle>
              <DrawerDescription>
                {locale === "bg" ? "Изберете категория за вашия продукт" : "Choose a category for your product"}
              </DrawerDescription>
            </DrawerHeader>
            <CategoryModalContent {...contentProps} isMobile />
          </DrawerContent>
        </Drawer>
      </>
    );
  }

  return (
    <>
      {TriggerButton}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl max-h-dialog-sm p-0 gap-0 rounded-lg">
          <DialogHeader className="px-4 py-3 border-b">
            <DialogTitle className="text-base font-semibold">
              {locale === "bg" ? "Избери категория" : "Select Category"}
            </DialogTitle>
          </DialogHeader>
          <CategoryModalContent {...contentProps} isMobile={false} />
        </DialogContent>
      </Dialog>
    </>
  );
}

// ============================================================================
// Modal Content (Shared between Mobile/Desktop)
// ============================================================================
interface CategoryModalContentProps {
  categories: Category[];
  flatCategories: FlatCategory[];
  value: string;
  onSelect: (cat: FlatCategory) => void;
  locale: string;
  isMobile: boolean;
}

function CategoryModalContent({
  categories,
  flatCategories,
  value,
  onSelect,
  locale,
  isMobile,
}: CategoryModalContentProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [navigationPath, setNavigationPath] = useState<Category[]>([]);
  const [activeL1, setActiveL1] = useState<Category | null>(categories[0] || null);
  const [childrenById, setChildrenById] = useState<Record<string, Category[]>>({});
  const [loadingChildrenById, setLoadingChildrenById] = useState<Record<string, boolean>>({});

  const MAX_DEPTH = 4; // L0 -> L1 -> L2 -> L3 -> L4 (supports 647 L4 categories)
  const stepLabels = locale === "bg"
    ? ["Ниво 0", "Ниво 1", "Ниво 2", "Ниво 3", "Ниво 4"]
    : ["Level 0", "Level 1", "Level 2", "Level 3", "Level 4"];
  const lastNavigationItem = navigationPath.at(-1)

  const getName = (cat: Category) =>
    locale === "bg" && cat.name_bg ? cat.name_bg : cat.name;

  const getChildren = useCallback(
    (cat: Category | null): Category[] => {
      if (!cat) return [];
      return childrenById[cat.id] ?? cat.children ?? [];
    },
    [childrenById]
  );

  const ensureChildrenLoaded = useCallback(
    async (cat: Category): Promise<Category[]> => {
      const existing = getChildren(cat);
      if (existing.length > 0) return existing;
      
      // Skip if already loading
      if (loadingChildrenById[cat.id]) return [];
      
      // Lazy-load children from API for deeper levels (L4+)
      setLoadingChildrenById(prev => ({ ...prev, [cat.id]: true }));
      try {
        const res = await fetch(`/api/categories/${encodeURIComponent(cat.id)}/children`);
        if (res.ok) {
          const data = await res.json();
          const children = (data.children || []) as Category[];
          if (children.length > 0) {
            setChildrenById(prev => ({ ...prev, [cat.id]: children }));
            return children;
          }
        }
      } catch {
        // Silently fail - treat as leaf category
      } finally {
        setLoadingChildrenById(prev => ({ ...prev, [cat.id]: false }));
      }
      return [];
    },
    [getChildren, loadingChildrenById]
  );

  // Search results
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    return flatCategories
      .filter((cat) => cat.searchText.includes(query))
      .slice(0, 12);
  }, [flatCategories, searchQuery]);

  // Current level categories
  const currentCategories = useMemo(() => {
    if (isMobile) {
      if (navigationPath.length === 0) return categories;
      const lastInPath = navigationPath.at(-1);
      if (!lastInPath) return categories;
      return getChildren(lastInPath);
    } else {
      return getChildren(activeL1);
    }
  }, [categories, navigationPath, activeL1, isMobile, getChildren]);

  // Helper to construct FlatCategory for lazy-loaded categories
  const constructFlatCategory = useCallback(
    (cat: Category, path: Category[]): FlatCategory => {
      const pathItems = [...path, cat].map(toPathItem);
      const fullPath = pathItems
        .map((c) => (locale === "bg" && c.name_bg ? c.name_bg : c.name))
        .join(" › ");
      return {
        ...cat,
        path: pathItems,
        fullPath,
        searchText: `${cat.name} ${cat.name_bg || ""} ${cat.slug}`.toLowerCase(),
      };
    },
    [locale]
  );

  // Navigation handlers
  const handleNavigate = useCallback(async (cat: Category) => {
    const depth = navigationPath.length;
    const knownChildren = getChildren(cat);

    // If we're already at max depth, treat selection as final.
    if (depth >= MAX_DEPTH) {
      // First try to find in flatCategories (for pre-loaded items)
      let flatCat = flatCategories.find((c) => c.id === cat.id);
      // If not found (lazy-loaded), construct it from the navigation path
      if (!flatCat) {
        flatCat = constructFlatCategory(cat, navigationPath);
      }
      onSelect(flatCat);
      return;
    }

    if (knownChildren.length > 0) {
      setNavigationPath((prev) => [...prev, cat]);
      return;
    }

    // Lazy-load children when not preloaded (keeps payload small; L3 can be huge).
    const loadedChildren = await ensureChildrenLoaded(cat);
    if (loadedChildren.length > 0) {
      setNavigationPath((prev) => [...prev, cat]);
      return;
    }

    // Leaf category - first try flatCategories, then construct
    let flatCat = flatCategories.find((c) => c.id === cat.id);
    if (!flatCat) {
      flatCat = constructFlatCategory(cat, navigationPath);
    }
    onSelect(flatCat);
  }, [MAX_DEPTH, constructFlatCategory, ensureChildrenLoaded, flatCategories, getChildren, navigationPath, onSelect]);

  const handleDesktopNavigate = useCallback(async (cat: Category) => {
    const knownChildren = getChildren(cat);
    if (knownChildren.length > 0) {
      setActiveL1(cat);
      return;
    }

    const loadedChildren = await ensureChildrenLoaded(cat);
    if (loadedChildren.length > 0) {
      setActiveL1(cat);
      return;
    }

    // Leaf category - first try flatCategories, then construct
    let flatCat = flatCategories.find((c) => c.id === cat.id);
    if (!flatCat) {
      // For desktop, the path is just [activeL1, cat] if activeL1 is set
      const path = activeL1 ? [activeL1] : [];
      flatCat = constructFlatCategory(cat, path);
    }
    onSelect(flatCat);
  }, [activeL1, constructFlatCategory, ensureChildrenLoaded, flatCategories, getChildren, onSelect]);

  const handleBack = useCallback(() => {
    setNavigationPath((prev) => prev.slice(0, -1));
  }, []);

  const handleSearchSelect = useCallback((cat: FlatCategory) => {
    onSelect(cat);
  }, [onSelect]);

  // ===== MOBILE LAYOUT =====
  if (isMobile) {
    const currentStep = Math.min(navigationPath.length, MAX_DEPTH) + 1;
    return (
      <div className="flex flex-col min-h-0 flex-1 bg-background">
        {/* Header: Search + Step/Breadcrumb combined */}
        <div className="flex flex-col border-b border-border/50 bg-background shrink-0">
          {/* Search Row */}
          <div className="px-4 py-3">
            <CategorySearchInput value={searchQuery} onChange={setSearchQuery} locale={locale} />
          </div>

          {/* Step & Breadcrumb Row */}
          {!searchQuery.trim() && (
            <div className="px-4 py-2.5 bg-surface-subtle flex items-center justify-between gap-4 border-t border-border/50">
              <div className="flex items-center gap-3 min-w-0">
                {navigationPath.length > 0 ? (
                  <button
                    type="button"
                    onClick={handleBack}
                    className="size-8 flex items-center justify-center rounded-lg bg-background border border-border shadow-xs shrink-0 transition-colors hover:bg-hover active:bg-active"
                  >
                    <CaretLeft className="size-4" weight="bold" />
                  </button>
                ) : (
                  <div className="size-8 flex items-center justify-center rounded-lg bg-selected border border-selected-border shrink-0">
                    <FolderSimple className="size-4 text-primary" weight="bold" />
                  </div>
                )}
                
                <div className="flex flex-col min-w-0">
                  <span className="text-2xs font-bold text-muted-foreground uppercase tracking-widest leading-none mb-1">
                    {locale === "bg" ? "Стъпка" : "Step"} {currentStep}/{MAX_DEPTH + 1}
                  </span>
                  <h3 className="text-xs font-bold text-foreground uppercase tracking-wider truncate">
                    {navigationPath.length > 0 
                      ? (lastNavigationItem ? getName(lastNavigationItem) : stepLabels[0])
                      : stepLabels[0]
                    }
                  </h3>
                </div>
              </div>

              <div className="shrink-0 px-2 py-1 rounded-md bg-background border border-border shadow-xs">
                <span className="text-2xs font-bold text-primary uppercase tracking-tighter">
                  {stepLabels[Math.min(currentStep - 1, stepLabels.length - 1)]}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <ScrollArea className="flex-1 min-h-0">
          <div className="p-4">
            {searchQuery.trim() ? (
              searchResults.length === 0 ? (
                <CategoryEmptyState locale={locale} />
              ) : (
                <CategorySearchResults
                  results={searchResults}
                  selectedValue={value}
                  onSelect={handleSearchSelect}
                  locale={locale}
                />
              )
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {currentCategories.map((cat) => (
                  <CategoryCard
                    key={cat.id}
                    category={cat}
                    isSelected={value === cat.id}
                    hasChildren={getChildren(cat).length > 0}
                    onClick={() => handleNavigate(cat)}
                    locale={locale}
                  />
                ))}
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    );
  }

  // ===== DESKTOP LAYOUT (Two-Panel) =====
  return (
    <div className="flex h-(--spacing-scroll-lg)">
      {/* Left Panel - L1 Categories */}
      <div className="w-48 border-r bg-surface-subtle">
        <ScrollArea className="h-full">
          <div className="p-1.5">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveL1(cat)}
                className={cn(
                  "w-full flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors",
                  activeL1?.id === cat.id
                    ? "bg-selected text-primary font-medium"
                    : "text-foreground hover:bg-hover"
                )}
              >
                <span className="truncate">{getName(cat)}</span>
                {getChildren(cat).length > 0 ? (
                  <CaretRight className="size-3.5 text-muted-foreground shrink-0" />
                ) : null}
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Right Panel - Subcategories */}
      <div className="flex-1 flex flex-col">
        {/* Search */}
        <div className="px-3 py-2 border-b">
          <CategorySearchInput value={searchQuery} onChange={setSearchQuery} locale={locale} compact />
        </div>

        {/* Content */}
        <ScrollArea className="flex-1">
          <div className="p-3">
            {searchQuery.trim() ? (
              searchResults.length === 0 ? (
                <CategoryEmptyState locale={locale} compact />
              ) : (
                <CategorySearchResults
                  results={searchResults}
                  selectedValue={value}
                  onSelect={handleSearchSelect}
                  locale={locale}
                  compact
                />
              )
            ) : (
              <div className="grid grid-cols-3 gap-2">
                {currentCategories.map((cat) => (
                  <CategoryCard
                    key={cat.id}
                    category={cat}
                    isSelected={value === cat.id}
                    hasChildren={getChildren(cat).length > 0}
                    onClick={() => {
                      void handleDesktopNavigate(cat);
                    }}
                    locale={locale}
                  />
                ))}
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}

// ============================================================================
// Category Card Component - Compact, clean design
// ============================================================================
interface CategoryCardProps {
  category: Category;
  isSelected: boolean;
  hasChildren: boolean;
  onClick: () => void;
  locale: string;
}

function CategoryCard({
  category,
  isSelected,
  hasChildren,
  onClick,
  locale,
}: CategoryCardProps) {
  const name = locale === "bg" && category.name_bg ? category.name_bg : category.name;

  return (
      <button
        type="button"
        onClick={onClick}
        className={cn(
          "relative flex items-center justify-between gap-3 w-full px-4 py-2.5 rounded-md border text-left transition-colors min-h-12 touch-action-manipulation",
          "hover:border-hover-border active:bg-active",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background",
          isSelected 
            ? "border-selected-border bg-selected shadow-xs" 
            : "border-border bg-background shadow-xs"
        )}
      >
      <span className="text-sm font-bold text-foreground line-clamp-2 flex-1 leading-tight">
        {name}
      </span>
        <div className="shrink-0">
          {hasChildren ? (
            <div className="size-5 rounded-full bg-surface-subtle flex items-center justify-center">
              <CaretRight className="size-3 text-muted-foreground" weight="bold" />
            </div>
          ) : isSelected ? (
            <div className="size-5 rounded-full bg-primary flex items-center justify-center">
              <Check className="size-2.5 text-primary-foreground" weight="bold" />
            </div>
          ) : (
            <div className="size-5 rounded-full border border-border/50" />
          )}
        </div>
    </button>
  );
}
