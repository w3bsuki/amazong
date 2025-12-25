"use client";

import { ArrowLeft, CaretRight } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import type { Category } from "../../../_lib/types";

interface CategoryBreadcrumbProps {
  path: Category[];
  onNavigate: (index: number) => void;
}

/**
 * Breadcrumb navigation for category hierarchy
 */
export function CategoryBreadcrumb({ path, onNavigate }: CategoryBreadcrumbProps) {
  if (path.length === 0) return null;

  return (
    <div className="flex items-center gap-1 flex-wrap mb-4 pb-4 border-b border-border/50">
      <button
        type="button"
        onClick={() => onNavigate(-1)}
        className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors min-h-touch-xs"
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
              "text-sm transition-colors min-h-touch-xs px-1",
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
