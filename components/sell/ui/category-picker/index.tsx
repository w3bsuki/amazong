"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { CaretRight, Check } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Category } from "@/components/sell/types";
import { CategorySearch } from "./category-search";
import { CategoryBreadcrumb } from "./category-breadcrumb";
import { CategoryOption } from "./category-option";

interface CategoryPickerProps {
  categories: Category[];
  value: string;
  onChange: (categoryId: string, path: Category[]) => void;
  onCategorySelect?: (category: Category) => void;
  className?: string;
}

/**
 * Modular category picker with search and step-by-step navigation
 * Supports unlimited nesting levels
 */
export function CategoryPicker({
  categories,
  value,
  onChange,
  onCategorySelect,
  className,
}: CategoryPickerProps) {
  // Navigation state
  const [selectedPath, setSelectedPath] = useState<Category[]>([]);
  const [search, setSearch] = useState("");

  // Get current level categories based on navigation path
  const currentCategories = useMemo(() => {
    if (selectedPath.length === 0) {
      return categories;
    }
    const lastCategory = selectedPath[selectedPath.length - 1];
    return lastCategory.children || [];
  }, [categories, selectedPath]);

  // Flatten all categories for search functionality
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

  // Filter categories by search query
  const filteredCategories = useMemo(() => {
    if (!search.trim()) return null;
    const s = search.toLowerCase();
    return allCategories.filter(
      ({ category, path }) =>
        category.name.toLowerCase().includes(s) ||
        path.map((c) => c.name).join(" ").toLowerCase().includes(s)
    );
  }, [allCategories, search]);

  // Initialize path from existing value
  useEffect(() => {
    if (value && selectedPath.length === 0) {
      const found = allCategories.find(({ category }) => category.id === value);
      if (found) {
        setSelectedPath(found.path.slice(0, -1));
      }
    }
  }, [value, allCategories, selectedPath.length]);

  // Handle category selection
  const handleSelect = useCallback(
    (category: Category, fromSearch = false, searchPath?: Category[]) => {
      const hasChildren = category.children && category.children.length > 0;

      if (hasChildren) {
        // Navigate into subcategory
        if (fromSearch && searchPath) {
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
        // Select leaf category
        const fullPath = fromSearch && searchPath 
          ? searchPath 
          : [...selectedPath, category];
        
        onChange(category.id, fullPath);
        onCategorySelect?.(category);
        setSearch("");
        setSelectedPath(fullPath.slice(0, -1));
      }
    },
    [selectedPath, onChange, onCategorySelect]
  );

  // Navigate breadcrumb
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

  // Level labels for UX
  const getLevelLabel = (depth: number) => {
    const labels = ["Category", "Subcategory", "Type", "Style"];
    return labels[depth] || `Level ${depth + 1}`;
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Selected category display */}
      {selectedCategory && (
        <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50 border border-border">
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-green-600" weight="bold" />
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
            className="h-8 px-3 text-xs"
          >
            Change
          </Button>
        </div>
      )}

      {/* Category selection UI */}
      {!selectedCategory && (
        <div className="rounded-xl border border-border bg-background p-4">
          {/* Search */}
          <CategorySearch value={search} onChange={setSearch} />

          {/* Search Results */}
          {filteredCategories && (
            <div className="space-y-2 max-h-72 overflow-y-auto overscroll-contain">
              {filteredCategories.length > 0 ? (
                filteredCategories.slice(0, 20).map(({ category, path }) => {
                  const hasChildren = category.children && category.children.length > 0;
                  return (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() => handleSelect(category, true, path)}
                      className="flex items-center justify-between w-full px-3 py-2.5 rounded-lg hover:bg-muted/50 transition-colors text-left min-h-touch-sm"
                    >
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{category.name}</span>
                        {path.length > 1 && (
                          <span className="text-xs text-muted-foreground">
                            {path.slice(0, -1).map((c) => c.name).join(" › ")}
                          </span>
                        )}
                      </div>
                      {hasChildren ? (
                        <CaretRight className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <span className="text-xs text-muted-foreground">Select</span>
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
              <CategoryBreadcrumb path={selectedPath} onNavigate={handleNavigate} />

              <div className="mb-3">
                <h4 className="text-sm font-medium text-muted-foreground">
                  {selectedPath.length === 0
                    ? "Select a category"
                    : `Choose ${getLevelLabel(selectedPath.length).toLowerCase()}`}
                </h4>
              </div>

              {/* Category options grid - responsive columns with keyboard navigation */}
              <div 
                role="listbox"
                aria-label="Category options"
                className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-72 overflow-y-auto overscroll-contain"
                onKeyDown={(e) => {
                  const focusedElement = document.activeElement as HTMLButtonElement;
                  const buttons = Array.from(
                    e.currentTarget.querySelectorAll('button[role="option"]')
                  ) as HTMLButtonElement[];
                  const currentIndex = buttons.indexOf(focusedElement);

                  // Arrow key navigation
                  if (e.key === "ArrowDown" || e.key === "ArrowRight") {
                    e.preventDefault();
                    const nextIndex = (currentIndex + 1) % buttons.length;
                    buttons[nextIndex]?.focus();
                  } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
                    e.preventDefault();
                    const prevIndex = (currentIndex - 1 + buttons.length) % buttons.length;
                    buttons[prevIndex]?.focus();
                  } else if (e.key === "Escape" && selectedPath.length > 0) {
                    // Go back one level on Escape
                    e.preventDefault();
                    handleNavigate(selectedPath.length - 2);
                  } else if (e.key === "Home") {
                    e.preventDefault();
                    buttons[0]?.focus();
                  } else if (e.key === "End") {
                    e.preventDefault();
                    buttons[buttons.length - 1]?.focus();
                  }
                }}
              >
                {currentCategories.map((category, index) => {
                  const hasChildren = !!(category.children && category.children.length > 0);
                  const isSelected = value === category.id;

                  return (
                    <CategoryOption
                      key={category.id}
                      category={category}
                      isSelected={isSelected}
                      hasChildren={hasChildren}
                      onClick={() => handleSelect(category)}
                      isFocused={index === 0}
                    />
                  );
                })}
              </div>

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

// Re-export type for convenience
export type { Category };
