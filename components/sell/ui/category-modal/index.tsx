"use client";

import { useState, useMemo, useCallback } from "react";
import { CaretRight, Check, X, MagnifyingGlass, CaretLeft } from "@phosphor-icons/react";
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
  DrawerClose,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import type { Category } from "@/components/sell/types";

interface CategoryModalProps {
  categories: Category[];
  value: string;
  onChange: (categoryId: string, path: Category[]) => void;
  locale?: string;
  className?: string;
}

interface FlatCategory extends Category {
  path: Category[];
  fullPath: string;
  searchText: string;
}

// ============================================================================
// Main Category Selector (Exported)
// ============================================================================
export function CategorySelector({
  categories,
  value,
  onChange,
  locale = "en",
  className,
}: CategoryModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();

  // Flatten categories for search and lookup
  const flatCategories = useMemo(() => {
    const result: FlatCategory[] = [];
    function flatten(cats: Category[], path: Category[] = []) {
      for (const cat of cats) {
        const currentPath = [...path, cat];
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
    return flatCategories.find((c) => c.id === value) || null;
  }, [flatCategories, value]);

  const getName = (cat: Category) =>
    locale === "bg" && cat.name_bg ? cat.name_bg : cat.name;

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
        "w-full flex items-center justify-between gap-2 h-10 px-3 text-left",
        "bg-background border border-input rounded-lg",
        "hover:border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        "transition-colors",
        className
      )}
    >
      {selectedCategory ? (
        <>
          <div className="flex-1 min-w-0">
            <span className="text-sm font-medium truncate block">
              {getName(selectedCategory)}
            </span>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <Check className="size-4 text-primary" weight="bold" />
            <span
              role="button"
              tabIndex={0}
              onClick={handleClear}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") handleClear(e as unknown as React.MouseEvent);
              }}
              className="p-1 rounded hover:bg-muted"
              aria-label={locale === "bg" ? "Изчисти" : "Clear"}
            >
              <X className="size-3.5 text-muted-foreground" />
            </span>
          </div>
        </>
      ) : (
        <>
          <span className="text-sm text-muted-foreground">
            {locale === "bg" ? "Избери категория..." : "Select category..."}
          </span>
          <CaretRight className="size-4 text-muted-foreground" />
        </>
      )}
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
          <DrawerContent className="p-0 h-[80vh] overflow-hidden">
            <div className="flex h-full min-h-0 flex-col">
              <DrawerHeader className="px-4 py-3 border-b">
                <div className="flex items-center justify-between gap-2">
                  <DrawerTitle className="text-base font-semibold">
                    {locale === "bg" ? "Избери категория" : "Select Category"}
                  </DrawerTitle>
                  <DrawerClose asChild>
                    <button
                      type="button"
                      className={cn(
                        "inline-flex items-center justify-center rounded-md p-2",
                        "hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      )}
                      aria-label={locale === "bg" ? "Затвори" : "Close"}
                    >
                      <X className="size-4" />
                    </button>
                  </DrawerClose>
                </div>
              </DrawerHeader>
              <CategoryModalContent {...contentProps} isMobile />
            </div>
          </DrawerContent>
        </Drawer>
      </>
    );
  }

  return (
    <>
      {TriggerButton}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-7xl w-full h-[90vh] p-0 gap-0 flex flex-col">
          <DialogHeader className="px-6 py-4 border-b shrink-0">
            <DialogTitle className="text-lg font-semibold">
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

  const getName = (cat: Category) =>
    locale === "bg" && cat.name_bg ? cat.name_bg : cat.name;

  const selectCategory = useCallback(
    (cat: Category) => {
      const path = [...navigationPath, cat];
      const fullPath = path.map(getName).join(" › ");
      const flat: FlatCategory = {
        ...cat,
        path,
        fullPath,
        searchText: `${cat.name} ${cat.name_bg || ""} ${cat.slug}`.toLowerCase(),
      };
      onSelect(flat);
    },
    [getName, navigationPath, onSelect]
  );

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
      if (loadingChildrenById[cat.id]) return existing;

      setLoadingChildrenById((prev) => ({ ...prev, [cat.id]: true }));
      try {
        const res = await fetch(
          `/api/categories?parent=${encodeURIComponent(cat.slug)}&depth=1`,
          { method: "GET" }
        );
        if (!res.ok) return [];
        const data = await res.json();
        const children = (data?.categories ?? []) as Category[];
        setChildrenById((prev) => ({ ...prev, [cat.id]: children }));
        return children;
      } catch {
        return [];
      } finally {
        setLoadingChildrenById((prev) => ({ ...prev, [cat.id]: false }));
      }
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
      const lastInPath = navigationPath[navigationPath.length - 1];
      return getChildren(lastInPath);
    } else {
      return getChildren(activeL1);
    }
  }, [categories, navigationPath, activeL1, isMobile, getChildren]);

  // Navigation handlers
  const handleNavigate = useCallback(async (cat: Category) => {
    const knownChildren = getChildren(cat);

    if (knownChildren.length > 0) {
      setNavigationPath((prev) => [...prev, cat]);
      return;
    }

    const loadedChildren = await ensureChildrenLoaded(cat);
    if (loadedChildren.length > 0) {
      setNavigationPath((prev) => [...prev, cat]);
      return;
    }

    // Leaf (or no children): select even if not present in the initial flat list.
    selectCategory(cat);
  }, [ensureChildrenLoaded, getChildren, selectCategory]);

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

    // Leaf (or no children): select even if not present in the initial flat list.
    selectCategory(cat);
  }, [ensureChildrenLoaded, getChildren, selectCategory]);

  const handleBack = useCallback(() => {
    setNavigationPath((prev) => prev.slice(0, -1));
  }, []);

  const handleSearchSelect = useCallback((cat: FlatCategory) => {
    onSelect(cat);
  }, [onSelect]);

  // ===== MOBILE LAYOUT =====
  if (isMobile) {
    const currentStep = navigationPath.length + 1;
    return (
      <div className="flex flex-col min-h-0 flex-1">
        {/* Search */}
        <div className="px-3 py-2 border-b shrink-0">
          <div className="relative">
            <MagnifyingGlass className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={locale === "bg" ? "Търси..." : "Search..."}
              className="pl-9 h-9 text-sm"
            />
          </div>
        </div>

        {/* Step indicator */}
        {!searchQuery.trim() && (
          <div className="px-3 py-2 border-b bg-muted/30 shrink-0">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">
                {locale === "bg" ? "Стъпка" : "Step"} {currentStep}
              </span>
              <span className="font-medium text-foreground">
                {locale === "bg" ? "Ниво" : "Level"} {Math.max(0, currentStep - 1)}
              </span>
            </div>
          </div>
        )}

        {/* Breadcrumb - compact */}
        {navigationPath.length > 0 && !searchQuery && (
          <div className="flex items-center gap-1.5 px-3 py-2 border-b bg-muted/50 overflow-x-auto shrink-0">
            <button
              type="button"
              onClick={handleBack}
              className="p-1.5 rounded hover:bg-background shrink-0"
            >
              <CaretLeft className="size-4" />
            </button>
            <div className="flex items-center gap-1 text-xs overflow-hidden">
              {navigationPath.map((cat, idx) => (
                <div key={cat.id} className="flex items-center gap-1 shrink-0">
                  {idx > 0 && <span className="text-muted-foreground">›</span>}
                  <button
                    type="button"
                    onClick={() => setNavigationPath(navigationPath.slice(0, idx + 1))}
                    className={cn(
                      "truncate max-w-20",
                      idx === navigationPath.length - 1
                        ? "font-medium text-foreground"
                        : "text-muted-foreground"
                    )}
                  >
                    {getName(cat)}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Content */}
        <ScrollArea className="flex-1 min-h-0">
          <div className="p-3">
            {searchQuery.trim() ? (
              searchResults.length === 0 ? (
                <div className="py-8 text-center text-muted-foreground">
                  <p className="text-sm">
                    {locale === "bg" ? "Няма резултати" : "No results"}
                  </p>
                </div>
              ) : (
                <div className="space-y-1">
                  {searchResults.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => handleSearchSelect(cat)}
                      className={cn(
                        "w-full flex flex-col items-start gap-0.5 px-3 py-2 rounded-lg text-left transition-colors",
                        "hover:bg-muted",
                        value === cat.id && "bg-primary/10"
                      )}
                    >
                      <span className="text-sm font-medium">
                        {getName(cat)}
                      </span>
                      <span className="text-xs text-muted-foreground truncate w-full">
                        {cat.fullPath}
                      </span>
                    </button>
                  ))}
                </div>
              )
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {currentCategories.map((cat) => (
                  <CategoryCard
                    key={cat.id}
                    category={cat}
                    isSelected={value === cat.id}
                    hasChildren={getChildren(cat).length > 0}
                    onClick={() => handleNavigate(cat)}
                    locale={locale}
                    size="sm"
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
    <div className="flex flex-1 min-h-0">
      {/* Left Panel - L1 Categories */}
      <div className="w-72 border-r bg-muted/30 flex flex-col shrink-0">
        <ScrollArea className="flex-1">
          <div className="p-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveL1(cat)}
                className={cn(
                  "w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-colors",
                  activeL1?.id === cat.id
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-foreground hover:bg-muted"
                )}
              >
                <span className="truncate">{getName(cat)}</span>
                {getChildren(cat).length > 0 ? (
                  <CaretRight className="size-4 text-muted-foreground shrink-0" />
                ) : null}
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Right Panel - Subcategories */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Search */}
        <div className="px-4 py-3 border-b">
          <div className="relative">
            <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={locale === "bg" ? "Търси категории..." : "Search categories..."}
              className="pl-10 h-10"
            />
          </div>
        </div>

        {/* Breadcrumb for selected L1 */}
        {activeL1 && !searchQuery.trim() && (
          <div className="px-4 py-2 border-b bg-muted/30">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">
                {locale === "bg" ? "Категория:" : "Category:"}
              </span>
              <span className="font-medium text-foreground">
                {getName(activeL1)}
              </span>
            </div>
          </div>
        )}

        {/* Content */}
        <ScrollArea className="flex-1">
          <div className="p-4">
            {searchQuery.trim() ? (
              searchResults.length === 0 ? (
                <div className="py-12 text-center text-muted-foreground">
                  <p className="text-sm">
                    {locale === "bg" ? "Няма резултати за" : "No results for"} &ldquo;{searchQuery}&rdquo;
                  </p>
                </div>
              ) : (
                <div className="space-y-1">
                  {searchResults.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => handleSearchSelect(cat)}
                      className={cn(
                        "w-full flex flex-col items-start gap-1 px-4 py-3 rounded-lg text-left transition-colors",
                        "hover:bg-muted",
                        value === cat.id && "bg-primary/10 border border-primary/20"
                      )}
                    >
                      <span className="text-sm font-medium text-foreground">
                        {getName(cat)}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {cat.fullPath}
                      </span>
                    </button>
                  ))}
                </div>
              )
            ) : currentCategories.length === 0 ? (
              <div className="py-12 text-center text-muted-foreground">
                <p className="text-sm">
                  {locale === "bg" ? "Изберете категория от ляво" : "Select a category from the left"}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
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
                    size="default"
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
// Category Card Component - Clean, touch-friendly design
// ============================================================================
interface CategoryCardProps {
  category: Category;
  isSelected: boolean;
  hasChildren: boolean;
  onClick: () => void;
  locale: string;
  size?: "sm" | "default";
}

function CategoryCard({
  category,
  isSelected,
  hasChildren,
  onClick,
  locale,
  size = "default",
}: CategoryCardProps) {
  const name = locale === "bg" && category.name_bg ? category.name_bg : category.name;

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative flex items-center justify-between w-full rounded-lg border text-left transition-all",
        "hover:bg-muted/50 hover:border-primary/40",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        isSelected 
          ? "border-primary bg-primary/5 shadow-sm" 
          : "border-border",
        size === "sm" 
          ? "gap-2 px-3 py-2.5 min-h-11"
          : "gap-3 px-5 py-4 min-h-14"
      )}
    >
      <span className={cn(
        "font-medium text-foreground break-words",
        size === "sm" ? "text-sm" : "text-base"
      )}>
        {name}
      </span>
      {hasChildren ? (
        <CaretRight className={cn("text-muted-foreground shrink-0", size === "sm" ? "size-4" : "size-5")} />
      ) : isSelected ? (
        <Check className={cn("text-primary shrink-0", size === "sm" ? "size-4" : "size-5")} weight="bold" />
      ) : null}
    </button>
  );
}

export default CategorySelector;
