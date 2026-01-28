"use client";

import { useCallback, useMemo } from "react";
import { useSellForm, useSellFormContext } from "../sell-form-provider";
import { CategorySelector } from "../ui/category-modal";
import type { CategoryPathItem } from "../../_lib/types";

// ============================================================================
// STEP 2: CATEGORY - Full-screen category picker
// Category determines ALL subsequent fields.
// User picks: Electronics → Mobile → iPhone → attributes load.
// ============================================================================

export function StepCategory() {
  const { watch, setValue } = useSellForm();
  const { isBg, categories, setCurrentStep } = useSellFormContext();
  
  const categoryId = watch("categoryId") || "";
  const rawCategoryPath = watch("categoryPath") || [];
  
  // Normalize categoryPath to match CategoryPathItem type (name_bg: string | null, not undefined)
  const categoryPath: CategoryPathItem[] = useMemo(() => 
    rawCategoryPath.map(item => ({
      id: item.id,
      name: item.name,
      name_bg: item.name_bg ?? null,
      slug: item.slug,
    })), 
    [rawCategoryPath]
  );

  const handleCategoryChange = useCallback((newCategoryId: string, path: CategoryPathItem[]) => {
    setValue("categoryId", newCategoryId, { shouldValidate: true });
    setValue("categoryPath", path, { shouldValidate: false });
    
    // Auto-advance to next step when a leaf category is selected
    if (newCategoryId && path.length > 0) {
      // Small delay to show the selection before advancing
      setTimeout(() => {
        setCurrentStep(3);
      }, 300);
    }
  }, [setValue, setCurrentStep]);

  return (
    <div className="space-y-6">
      {/* Section header */}
      <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            {isBg ? "Изберете категория" : "Choose a category"}
          </h2>
          <p className="text-sm text-muted-foreground">
            {isBg 
              ? "Категорията определя какви детайли ще попълните" 
              : "The category determines what details you'll fill in"}
          </p>
        </div>

      <div className="space-y-4">
        <CategorySelector
          categories={categories}
          value={categoryId}
          selectedPath={categoryPath}
          onChange={handleCategoryChange}
          locale={isBg ? "bg" : "en"}
        />
        
        {/* Show current path if selected */}
        {categoryPath.length > 0 && (
          <div className="p-4 rounded-xl bg-selected border border-selected-border">
            <p className="text-xs font-bold uppercase tracking-wider text-primary mb-1">
              {isBg ? "Избрана категория" : "Selected category"}
            </p>
            <p className="text-sm font-semibold text-foreground">
              {categoryPath.map(c => isBg && c.name_bg ? c.name_bg : c.name).join(" › ")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
