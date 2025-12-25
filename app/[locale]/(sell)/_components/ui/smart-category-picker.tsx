"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import {
  MagnifyingGlass,
  CaretRight,
  CaretLeft,
  Clock,
  X,
  Check,
  Fire,
} from "@phosphor-icons/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import type { Category } from "../../_lib/types";

interface SmartCategoryPickerProps {
  categories: Category[];
  value: string;
  onChange: (categoryId: string, path: Category[]) => void;
  locale?: string;
}

interface FlatCategory extends Category {
  path: Category[];
  fullPath: string;
  searchText: string;
}

const RECENT_CATEGORIES_KEY = "sell-recent-categories";
const MAX_RECENT = 5;

// Popular/suggested categories for quick access
const POPULAR_SLUGS = [
  "mens-clothing",
  "womens-clothing",
  "smartphones",
  "sneakers",
  "bags-backpacks",
  "video-games",
];

export function SmartCategoryPicker({
  categories,
  value,
  onChange,
  locale = "en",
}: SmartCategoryPickerProps) {
  const isMobile = useIsMobile();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [navigationPath, setNavigationPath] = useState<Category[]>([]);
  const [recentCategories, setRecentCategories] = useState<FlatCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<FlatCategory | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  // Helper to get localized name
  const getName = useCallback((cat: Category) => 
    locale === "bg" && cat.name_bg ? cat.name_bg : cat.name,
  [locale]);

  // Flatten categories for search
  const flatCategories = useMemo(() => {
    const result: FlatCategory[] = [];

    function flatten(cats: Category[], path: Category[] = []) {
      for (const cat of cats) {
        const currentPath = [...path, cat];
        const fullPath = currentPath.map((c) => 
          locale === "bg" && c.name_bg ? c.name_bg : c.name
        ).join(" › ");

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

  // Search results
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    return flatCategories
      .filter((cat) => cat.searchText.includes(query))
      .slice(0, 20);
  }, [flatCategories, searchQuery]);

  // Current level categories (for navigation)
  const currentLevelCategories = useMemo(() => {
    if (navigationPath.length === 0) {
      return categories;
    }
    const lastInPath = navigationPath[navigationPath.length - 1];
    return lastInPath.children || [];
  }, [categories, navigationPath]);

  // Popular categories
  const popularCategories = useMemo(() => {
    return flatCategories.filter((cat) => POPULAR_SLUGS.includes(cat.slug));
  }, [flatCategories]);

  // Load recent categories from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(RECENT_CATEGORIES_KEY);
      if (stored) {
        const ids: string[] = JSON.parse(stored);
        const recent = ids
          .map((id) => flatCategories.find((c) => c.id === id))
          .filter(Boolean) as FlatCategory[];
        setRecentCategories(recent.slice(0, MAX_RECENT));
      }
    } catch {
      // Ignore localStorage errors
    }
  }, [flatCategories]);

  // Restore selection from value
  useEffect(() => {
    if (!value) {
      if (selectedCategory !== null) setSelectedCategory(null);
      return;
    }

    const found = flatCategories.find((c) => c.id === value) || null;
    if (found?.id !== selectedCategory?.id) {
      setSelectedCategory(found);
    }
  }, [value, flatCategories, selectedCategory]);

  // Save to recent categories
  const saveToRecent = useCallback((cat: FlatCategory) => {
    try {
      const stored = localStorage.getItem(RECENT_CATEGORIES_KEY);
      let ids: string[] = stored ? JSON.parse(stored) : [];
      ids = [cat.id, ...ids.filter((id) => id !== cat.id)].slice(0, MAX_RECENT);
      localStorage.setItem(RECENT_CATEGORIES_KEY, JSON.stringify(ids));
      setRecentCategories(
        ids.map((id) => flatCategories.find((c) => c.id === id)).filter(Boolean) as FlatCategory[]
      );
    } catch {
      // Ignore localStorage errors
    }
  }, [flatCategories]);

  // Handle category selection
  const handleSelect = useCallback((cat: FlatCategory) => {
    setSelectedCategory(cat);
    onChange(cat.id, cat.path);
    saveToRecent(cat);
    setIsOpen(false);
    setSearchQuery("");
    setNavigationPath([]);
  }, [onChange, saveToRecent]);

  // Handle category search result click
  const handleSearchSelect = useCallback((cat: FlatCategory) => {
    handleSelect(cat);
  }, [handleSelect]);

  // Handle navigation into a category
  const handleNavigate = useCallback((cat: Category) => {
    if (cat.children?.length) {
      setNavigationPath((prev) => [...prev, cat]);
    } else {
      // It's a leaf category, select it
      const flatCat = flatCategories.find((c) => c.id === cat.id);
      if (flatCat) {
        handleSelect(flatCat);
      }
    }
  }, [flatCategories, handleSelect]);

  // Handle back navigation
  const handleBack = useCallback(() => {
    setNavigationPath((prev) => prev.slice(0, -1));
  }, []);

  // Clear selection
  const handleClear = useCallback(() => {
    setSelectedCategory(null);
    onChange("", []);
    setNavigationPath([]);
    setSearchQuery("");
  }, [onChange]);

  // Current step for mobile wizard (based on navigation depth)
  const currentStep = navigationPath.length;
  const maxSteps = 4; // L1 -> L2 -> L3 -> L4

  // ===== TRIGGER BUTTON CONTENT =====
  const TriggerInner = (
    <>
      {selectedCategory ? (
        <>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-foreground truncate">
              {getName(selectedCategory)}
            </div>
            <div className="text-xs text-muted-foreground truncate mt-0.5">
              {selectedCategory.path.slice(0, -1).map((c) => getName(c)).join(" › ")}
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Check className="size-4 text-green-600" weight="bold" />
            <span
              role="button"
              tabIndex={0}
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                handleClear();
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.stopPropagation();
                  e.preventDefault();
                  handleClear();
                }
              }}
              className="p-1.5 rounded-lg hover:bg-muted transition-colors cursor-pointer"
              aria-label={locale === "bg" ? "Изчисти избора" : "Clear selection"}
            >
              <X className="size-4 text-muted-foreground" />
            </span>
          </div>
        </>
      ) : (
        <>
          <span className="text-sm text-muted-foreground">
            {locale === "bg" ? "Избери категория..." : "Select a category..."}
          </span>
          <CaretRight className="size-4 text-muted-foreground" />
        </>
      )}
    </>
  );

  const triggerClassName = cn(
    "w-full flex items-center justify-between gap-3 px-4 py-3.5 text-left",
    "bg-background border border-border rounded-xl",
    "hover:border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
    "transition-colors cursor-pointer min-h-[52px]"
  );

  // ===== CATEGORY LIST CONTENT (shared between mobile and desktop) =====
  const CategoryListContent = (
    <>
      {/* Search Input */}
      <div className="relative p-4 border-b border-border">
        <MagnifyingGlass className="absolute left-7 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={locale === "bg" ? "Търси категории..." : "Search categories..."}
          className="pl-10 h-11"
          autoFocus={!isMobile}
        />
      </div>

      <ScrollArea className="h-[400px] md:h-[350px]">
        <div className="p-3">
          {/* Search Results */}
          {searchQuery.trim() ? (
            searchResults.length === 0 ? (
              <div className="py-12 text-center text-muted-foreground">
                <p className="text-sm font-medium mb-1">
                  {locale === "bg" ? "Няма намерени категории" : "No categories found"}
                </p>
                <p className="text-xs">
                  {locale === "bg" ? `за "${searchQuery}"` : `for "${searchQuery}"`}
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
                      "w-full flex flex-col items-start gap-1 px-4 py-3 rounded-xl text-left transition-colors",
                      "hover:bg-muted active:bg-muted/80",
                      value === cat.id && "bg-primary/10"
                    )}
                  >
                    <span className="text-sm font-semibold text-foreground">
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
            <>
              {/* Recent Categories */}
              {recentCategories.length > 0 && navigationPath.length === 0 && (
                <div className="mb-4 pb-4 border-b border-border">
                  <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground mb-3 px-1">
                    <Clock className="size-3.5" />
                    {locale === "bg" ? "Скорошни" : "Recent"}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recentCategories.map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => handleSelect(cat)}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-muted/50 hover:bg-muted text-sm font-medium transition-colors"
                      >
                        {getName(cat)}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Popular Categories */}
              {popularCategories.length > 0 && navigationPath.length === 0 && (
                <div className="mb-4 pb-4 border-b border-border">
                  <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground mb-3 px-1">
                    <Fire className="size-3.5" weight="fill" />
                    {locale === "bg" ? "Популярни" : "Popular"}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {popularCategories.map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => handleSelect(cat)}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-orange-50 hover:bg-orange-100 dark:bg-orange-950/30 dark:hover:bg-orange-950/50 text-sm font-medium text-orange-700 dark:text-orange-400 transition-colors"
                      >
                        {getName(cat)}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Breadcrumb Navigation */}
              {navigationPath.length > 0 && (
                <div className="flex items-center gap-1.5 px-2 py-2.5 mb-3 border-b border-border">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="p-1.5 rounded-lg hover:bg-muted"
                    aria-label={locale === "bg" ? "Назад" : "Back"}
                  >
                    <CaretLeft className="size-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setNavigationPath([])}
                    className="text-xs font-medium text-primary hover:underline"
                  >
                    {locale === "bg" ? "Всички" : "All"}
                  </button>
                  {navigationPath.map((cat, idx) => (
                    <div key={cat.id} className="flex items-center gap-1.5">
                      <CaretRight className="size-3 text-muted-foreground" />
                      <button
                        type="button"
                        onClick={() => setNavigationPath(navigationPath.slice(0, idx + 1))}
                        className={cn(
                          "text-xs",
                          idx === navigationPath.length - 1
                            ? "font-semibold text-foreground"
                            : "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        {getName(cat)}
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* "Select this category" button when navigating */}
              {navigationPath.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    const lastCat = navigationPath[navigationPath.length - 1];
                    const flatCat = flatCategories.find((c) => c.id === lastCat.id);
                    if (flatCat) {
                      handleSelect(flatCat);
                    }
                  }}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-primary/5 hover:bg-primary/10 text-sm font-semibold text-primary transition-colors mb-3"
                >
                  <span>
                    {locale === "bg" ? "Избери" : "Select"} "{getName(navigationPath[navigationPath.length - 1])}"
                  </span>
                  <Check className="size-4" weight="bold" />
                </button>
              )}

              {/* Category List */}
              <div className="space-y-1">
                {currentLevelCategories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleNavigate(cat)}
                    className={cn(
                      "w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm transition-colors",
                      "hover:bg-muted active:bg-muted/80",
                      value === cat.id && "bg-primary/10"
                    )}
                  >
                    <span className="font-medium">{getName(cat)}</span>
                    {cat.children?.length ? (
                      <CaretRight className="size-4 text-muted-foreground" />
                    ) : (
                      value === cat.id && <Check className="size-4 text-primary" weight="bold" />
                    )}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </ScrollArea>
    </>
  );

  // ===== MOBILE WIZARD CONTENT =====
  const MobileWizardContent = (
    <>
      {/* Step Progress Header */}
      <DialogHeader className="px-4 py-3 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {navigationPath.length > 0 && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleBack}
                className="shrink-0"
              >
                <CaretLeft className="size-5" />
              </Button>
            )}
            <div>
              <DialogTitle className="text-base">
                {locale === "bg" ? "Избери категория" : "Select Category"}
              </DialogTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                {navigationPath.length === 0
                  ? locale === "bg" ? "Стъпка 1: Избери основна категория" : "Step 1: Choose main category"
                  : locale === "bg" 
                    ? `Стъпка ${currentStep + 1}: ${getName(navigationPath[navigationPath.length - 1])}`
                    : `Step ${currentStep + 1}: ${getName(navigationPath[navigationPath.length - 1])}`
                }
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(false)}
          >
            <X className="size-5" />
          </Button>
        </div>

        {/* Step Indicator */}
        <div className="flex gap-1.5 mt-3">
          {Array.from({ length: maxSteps }).map((_, i) => (
            <div
              key={i}
              className={cn(
                "h-1 flex-1 rounded-full transition-colors",
                i < currentStep ? "bg-primary" : 
                i === currentStep ? "bg-primary/50" : "bg-muted"
              )}
            />
          ))}
        </div>
      </DialogHeader>

      {/* Search Input */}
      <div className="relative p-4 border-b border-border">
        <MagnifyingGlass className="absolute left-7 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={locale === "bg" ? "Търси категории..." : "Search categories..."}
          className="pl-10 h-12"
        />
      </div>

      {/* Scrollable Content */}
      <ScrollArea className="flex-1">
        <div className="p-4">
          {/* Search Results */}
          {searchQuery.trim() ? (
            searchResults.length === 0 ? (
              <div className="py-12 text-center text-muted-foreground">
                <p className="text-sm font-medium mb-1">
                  {locale === "bg" ? "Няма намерени категории" : "No categories found"}
                </p>
                <p className="text-xs">
                  {locale === "bg" ? `за "${searchQuery}"` : `for "${searchQuery}"`}
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {searchResults.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleSearchSelect(cat)}
                    className={cn(
                      "w-full flex flex-col items-start gap-1.5 px-4 py-4 rounded-xl text-left transition-colors",
                      "bg-muted/30 hover:bg-muted active:bg-muted/80",
                      value === cat.id && "bg-primary/10 ring-1 ring-primary/30"
                    )}
                  >
                    <span className="text-base font-semibold text-foreground">
                      {getName(cat)}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {cat.fullPath}
                    </span>
                  </button>
                ))}
              </div>
            )
          ) : (
            <>
              {/* Recent Categories (only on step 0) */}
              {recentCategories.length > 0 && navigationPath.length === 0 && (
                <div className="mb-5 pb-5 border-b border-border">
                  <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground mb-3">
                    <Clock className="size-3.5" />
                    {locale === "bg" ? "Скорошни" : "Recent"}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recentCategories.map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => handleSelect(cat)}
                        className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-muted/50 hover:bg-muted text-sm font-medium transition-colors"
                      >
                        {getName(cat)}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Popular Categories (only on step 0) */}
              {popularCategories.length > 0 && navigationPath.length === 0 && (
                <div className="mb-5 pb-5 border-b border-border">
                  <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground mb-3">
                    <Fire className="size-3.5" weight="fill" />
                    {locale === "bg" ? "Популярни" : "Popular"}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {popularCategories.map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => handleSelect(cat)}
                        className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-orange-50 hover:bg-orange-100 dark:bg-orange-950/30 dark:hover:bg-orange-950/50 text-sm font-medium text-orange-700 dark:text-orange-400 transition-colors"
                      >
                        {getName(cat)}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* "Select this category" option */}
              {navigationPath.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    const lastCat = navigationPath[navigationPath.length - 1];
                    const flatCat = flatCategories.find((c) => c.id === lastCat.id);
                    if (flatCat) {
                      handleSelect(flatCat);
                    }
                  }}
                  className="w-full flex items-center justify-between px-4 py-4 rounded-xl bg-primary text-primary-foreground text-base font-semibold transition-colors mb-4"
                >
                  <span>
                    {locale === "bg" ? "Избери тази категория" : "Select this category"}
                  </span>
                  <Check className="size-5" weight="bold" />
                </button>
              )}

              {/* Category Options (Step content) */}
              <div className="space-y-2">
                {currentLevelCategories.length === 0 ? (
                  <div className="py-8 text-center text-muted-foreground">
                    <p className="text-sm">
                      {locale === "bg" ? "Няма подкатегории" : "No subcategories"}
                    </p>
                  </div>
                ) : (
                  currentLevelCategories.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => handleNavigate(cat)}
                      className={cn(
                        "w-full flex items-center justify-between px-4 py-4 rounded-xl text-base transition-colors",
                        "bg-muted/30 hover:bg-muted active:bg-muted/80",
                        value === cat.id && "bg-primary/10 ring-1 ring-primary/30"
                      )}
                    >
                      <span className="font-medium">{getName(cat)}</span>
                      {cat.children?.length ? (
                        <CaretRight className="size-5 text-muted-foreground" />
                      ) : (
                        value === cat.id && <Check className="size-5 text-primary" weight="bold" />
                      )}
                    </button>
                  ))
                )}
              </div>
            </>
          )}
        </div>
      </ScrollArea>
    </>
  );

  // ===== RENDER =====
  if (isMobile) {
    return (
      <div>
        {/* Mobile: Trigger opens Dialog */}
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className={triggerClassName}
        >
          {TriggerInner}
        </button>
        
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="h-[90vh] max-h-[90vh] flex flex-col p-0 gap-0">
            {MobileWizardContent}
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  // Desktop: Popover
  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button type="button" className={triggerClassName}>
          {TriggerInner}
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[400px] p-0"
        align="start"
        sideOffset={8}
      >
        {CategoryListContent}
      </PopoverContent>
    </Popover>
  );
}
