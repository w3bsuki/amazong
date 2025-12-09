"use client";

import { forwardRef, KeyboardEvent } from "react";
import { CaretRight, Check } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import type { Category } from "@/components/sell/types";

interface CategoryOptionProps {
  category: Category;
  isSelected: boolean;
  hasChildren: boolean;
  onClick: () => void;
  /** Optional keyboard handler for arrow navigation */
  onKeyDown?: (e: KeyboardEvent<HTMLButtonElement>) => void;
  /** Whether this option is currently focused (for roving tabindex) */
  isFocused?: boolean;
}

/**
 * Individual category option button with selection state
 * Uses touch-friendly sizing from design tokens
 * Supports keyboard navigation (Enter/Space to select)
 */
export const CategoryOption = forwardRef<HTMLButtonElement, CategoryOptionProps>(
  function CategoryOption(
    {
      category,
      isSelected,
      hasChildren,
      onClick,
      onKeyDown,
      isFocused = false,
    },
    ref
  ) {
    const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
      // Enter or Space to select
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onClick();
      }
      // Pass through for arrow key navigation
      onKeyDown?.(e);
    };

    return (
      <button
        ref={ref}
        type="button"
        role="option"
        onClick={onClick}
        onKeyDown={handleKeyDown}
        tabIndex={isFocused ? 0 : -1}
        aria-selected={isSelected}
        className={cn(
          // Base styles with touch-friendly sizing
          "flex items-center justify-between w-full px-4 min-h-touch rounded-xl border transition-all text-left",
          // Focus styles for keyboard navigation
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          // State variants
          isSelected
            ? "border-foreground bg-foreground/5 ring-1 ring-foreground/20"
            : "border-border hover:border-muted-foreground/30 hover:bg-muted/50 active:bg-muted"
        )}
      >
        <span className="font-medium text-sm py-3">{category.name}</span>
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
);
