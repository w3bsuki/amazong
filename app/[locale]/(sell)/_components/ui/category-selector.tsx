"use client"


import { useState, useMemo, useCallback } from "react";
import { ChevronRight as CaretRight, Check } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-is-mobile";
import { useTranslations } from "next-intl";
import { CategoryModalContent } from "./category-selector-modal-content";
import { CategoryPickerDrawerShell, flattenCategories } from "./category-selector-shared";
import type { CategorySelectorProps, FlatCategory } from "./category-selector.types";

export function CategorySelector({
  categories,
  value,
  selectedPath,
  onChange,
  locale = "en",
  className,
}: CategorySelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();
  const tSell = useTranslations("Sell");

  const flatCategories = useMemo(() => {
    return flattenCategories(categories, locale);
  }, [categories, locale]);

  const selectedCategory = useMemo(() => {
    if (!value) return null;

    const found = flatCategories.find((cat) => cat.id === value);
    if (found) return found;

    if (selectedPath && selectedPath.length > 0) {
      const normalizedPath = selectedPath.length > 2 ? selectedPath.slice(-2) : selectedPath;
      const last = normalizedPath.at(-1);
      if (last && last.id === value) {
        const fullPath = normalizedPath
          .map((item) => (locale === "bg" && item.name_bg ? item.name_bg : item.name))
          .join(" › ");

        return {
          ...last,
          parent_id: null,
          path: normalizedPath,
          fullPath,
          searchText: "",
        } as FlatCategory;
      }
    }

    return null;
  }, [flatCategories, value, selectedPath, locale]);

  const displayPath = useMemo(() => {
    if (!selectedCategory) return tSell("categoryModal.selectPlaceholder");

    const path = selectedCategory.path;
    if (!path || path.length === 0) return selectedCategory.name;

    return selectedCategory.fullPath;
  }, [selectedCategory, tSell]);

  const handleSelect = useCallback((cat: FlatCategory) => {
    onChange(cat.id, cat.path);
    setIsOpen(false);
  }, [onChange]);

  const triggerButton = (
    <button
      type="button"
      onClick={() => setIsOpen(true)}
      className={cn(
        "relative w-full flex items-center h-12 px-4 rounded-md border text-left",
        "bg-background border border-border shadow-xs",
        "hover:border-hover-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background",
        "transition-colors",
        className
      )}
    >
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <span className="text-2xs font-bold uppercase tracking-wider text-muted-foreground shrink-0">
          {tSell("categoryModal.categoryLabel")}
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
            <Check className="size-3 text-primary" />
          </div>
        )}
        <CaretRight className="size-4 text-muted-foreground" />
      </div>
    </button>
  );

  if (isMobile) {
    return (
      <>
        {triggerButton}
        <CategoryPickerDrawerShell open={isOpen} onOpenChange={setIsOpen}>
          <CategoryModalContent
            categories={categories}
            flatCategories={flatCategories}
            value={value}
            onSelect={handleSelect}
            locale={locale}
            isMobile
          />
        </CategoryPickerDrawerShell>
      </>
    );
  }

  return (
    <>
      {triggerButton}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl max-h-dialog-sm p-0 gap-0 rounded-lg">
          <DialogHeader className="px-4 py-3 border-b">
            <DialogTitle className="text-base font-semibold">
              {tSell("categoryModal.title")}
            </DialogTitle>
          </DialogHeader>
          <CategoryModalContent
            categories={categories}
            flatCategories={flatCategories}
            value={value}
            onSelect={handleSelect}
            locale={locale}
            isMobile={false}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
