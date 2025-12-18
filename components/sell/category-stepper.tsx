"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import {
  CaretRight,
  Check,
  MagnifyingGlass,
  X,
  ArrowLeft,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

// Types
export interface Category {
  id: string;
  name: string;
  name_bg?: string | null;
  slug: string;
  parent_id: string | null;
  display_order?: number | null;
  children?: Category[];
}

interface CategoryStepperProps {
  categories: Category[];
  value: string; // Selected category ID
  onChange: (categoryId: string, path: Category[]) => void;
  onCategorySelect?: (category: Category) => void;
}

// ============================================================================
// Category Option Card
// ============================================================================
function CategoryOption({
  category,
  isSelected,
  hasChildren,
  onClick,
}: {
  category: Category;
  isSelected: boolean;
  hasChildren: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center justify-between w-full px-4 py-3 rounded-xl border transition-all text-left",
        isSelected
          ? "border-foreground bg-foreground/5 ring-1 ring-foreground/20"
          : "border-border hover:border-muted-foreground/30 hover:bg-muted/50"
      )}
    >
      <span className="font-medium text-sm">{category.name}</span>
      <div className="flex items-center gap-2">
        {isSelected && !hasChildren && (
          <Check className="h-4 w-4 text-foreground" weight="bold" />
        )}
        {hasChildren && (
          <CaretRight className="h-4 w-4 text-muted-foreground" />
        )}
      </div>
    </button>
  );
}

// ============================================================================
// Breadcrumb Path Display
// ============================================================================
function CategoryBreadcrumb({
  path,
  onNavigate,
}: {
  path: Category[];
  onNavigate: (index: number) => void;
}) {
  if (path.length === 0) return null;

  return (
    <div className="flex items-center gap-1 flex-wrap mb-4 pb-4 border-b border-border/50">
      <button
        type="button"
        onClick={() => onNavigate(-1)}
        className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        <span>All categories</span>
      </button>
      {path.map((cat, index) => (
        <div key={cat.id} className="flex items-center">
          <CaretRight className="h-3 w-3 text-muted-foreground/50 mx-1" />
          <button
            type="button"
            onClick={() => onNavigate(index)}
            className={cn(
              "text-sm transition-colors",
              index === path.length - 1
                ? "text-foreground font-medium"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {cat.name}
          </button>
        </div>
      ))}
    </div>
  );
}

// ============================================================================
// Main Category Stepper Component
// ============================================================================
export function CategoryStepper({
  categories,
  value,
  onChange,
  onCategorySelect,
}: CategoryStepperProps) {
  // State for navigation
  const [selectedPath, setSelectedPath] = useState<Category[]>([]);
  const [search, setSearch] = useState("");

  // Get current level categories based on path
  const currentCategories = useMemo(() => {
    if (selectedPath.length === 0) {
      return categories;
    }
    const lastCategory = selectedPath[selectedPath.length - 1];
    return lastCategory.children || [];
  }, [categories, selectedPath]);

  // Flatten all categories for search
  const allCategories = useMemo(() => {
    const flatten = (
      cats: Category[],
      path: Category[] = []
    ): { category: Category; path: Category[] }[] => {
      const result: { category: Category; path: Category[] }[] = [];
      for (const cat of cats) {
        const currentPath = [...path, cat];
        result.push({ category: cat, path: currentPath });
        if (cat.children?.length) {
          result.push(...flatten(cat.children, currentPath));
        }
      }
      return result;
    };
    return flatten(categories);
  }, [categories]);

  // Filter categories by search
  const filteredCategories = useMemo(() => {
    if (!search.trim()) return null;
    const s = search.toLowerCase();
    return allCategories.filter(
      ({ category, path }) =>
        category.name.toLowerCase().includes(s) ||
        path.map((c) => c.name).join(" ").toLowerCase().includes(s)
    );
  }, [allCategories, search]);

  // Initialize path from value if provided
  useEffect(() => {
    if (value && selectedPath.length === 0) {
      const found = allCategories.find(({ category }) => category.id === value);
      if (found) {
        // Set the path excluding the selected category itself
        setSelectedPath(found.path.slice(0, -1));
      }
    }
  }, [value, allCategories, selectedPath.length]);

  // Handle category selection
  const handleSelect = useCallback(
    (category: Category, fromSearch = false, searchPath?: Category[]) => {
      const hasChildren = category.children && category.children.length > 0;

      if (hasChildren) {
        // Navigate into this category
        if (fromSearch && searchPath) {
          // Set path up to and including this category
          const pathUpToCategory = searchPath.slice(
            0,
            searchPath.indexOf(category) + 1
          );
          setSelectedPath(pathUpToCategory);
        } else {
          setSelectedPath([...selectedPath, category]);
        }
        setSearch("");
      } else {
        // This is a leaf category - select it
        const fullPath = fromSearch && searchPath 
          ? searchPath 
          : [...selectedPath, category];
        
        onChange(category.id, fullPath);
        onCategorySelect?.(category);
        setSearch("");
        
        // Update the path to show parent
        setSelectedPath(fullPath.slice(0, -1));
      }
    },
    [selectedPath, onChange, onCategorySelect]
  );

  // Navigate back to a specific point in the path
  const handleNavigate = useCallback((index: number) => {
    if (index < 0) {
      setSelectedPath([]);
    } else {
      setSelectedPath(selectedPath.slice(0, index + 1));
    }
  }, [selectedPath]);

  // Get currently selected category info
  const selectedCategory = useMemo(() => {
    if (!value) return null;
    return allCategories.find(({ category }) => category.id === value);
  }, [value, allCategories]);

  // Determine level labels
  const getLevelLabel = (depth: number) => {
    const labels = ["Category", "Subcategory", "Type", "Style"];
    return labels[depth] || `Level ${depth + 1}`;
  };

  return (
    <div className="space-y-4">
      {/* Selected category display (when one is selected) */}
      {selectedCategory && (
        <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50 border border-border">
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-success" weight="bold" />
            <span className="text-sm">
              {selectedCategory.path.map((c) => c.name).join(" › ")}
            </span>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              onChange("", []);
              setSelectedPath([]);
            }}
            className="h-7 px-2 text-xs"
          >
            Change
          </Button>
        </div>
      )}

      {/* Category selection UI (when no category selected or changing) */}
      {!selectedCategory && (
        <div className="rounded-xl border border-border bg-background p-4">
          {/* Search */}
          <div className="relative mb-4">
            <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search all categories..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-10 rounded-lg"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 hover:bg-muted rounded"
              >
                <X className="h-3.5 w-3.5 text-muted-foreground" />
              </button>
            )}
          </div>

          {/* Search Results */}
          {filteredCategories && (
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {filteredCategories.length > 0 ? (
                filteredCategories.slice(0, 20).map(({ category, path }) => {
                  const hasChildren =
                    category.children && category.children.length > 0;
                  return (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() => handleSelect(category, true, path)}
                      className="flex items-center justify-between w-full px-3 py-2.5 rounded-lg hover:bg-muted/50 transition-colors text-left"
                    >
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">
                          {category.name}
                        </span>
                        {path.length > 1 && (
                          <span className="text-xs text-muted-foreground">
                            {path
                              .slice(0, -1)
                              .map((c) => c.name)
                              .join(" › ")}
                          </span>
                        )}
                      </div>
                      {hasChildren ? (
                        <CaretRight className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <span className="text-xs text-muted-foreground">
                          Select
                        </span>
                      )}
                    </button>
                  );
                })
              ) : (
                <p className="text-sm text-muted-foreground text-center py-6">
                  No categories found for &ldquo;{search}&rdquo;
                </p>
              )}
            </div>
          )}

          {/* Step-by-step selection */}
          {!filteredCategories && (
            <>
              {/* Breadcrumb navigation */}
              <CategoryBreadcrumb
                path={selectedPath}
                onNavigate={handleNavigate}
              />

              {/* Current level label */}
              <div className="mb-3">
                <h4 className="text-sm font-medium text-muted-foreground">
                  {selectedPath.length === 0
                    ? "Select a category"
                    : `Choose ${getLevelLabel(selectedPath.length).toLowerCase()}`}
                </h4>
              </div>

              {/* Category options grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[280px] overflow-y-auto">
                {currentCategories.map((category) => {
                  const hasChildren = !!(
                    category.children && category.children.length > 0
                  );
                  const isSelected = value === category.id;

                  return (
                    <CategoryOption
                      key={category.id}
                      category={category}
                      isSelected={isSelected}
                      hasChildren={hasChildren}
                      onClick={() => handleSelect(category)}
                    />
                  );
                })}
              </div>

              {/* Empty state */}
              {currentCategories.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-6">
                  No subcategories available
                </p>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
