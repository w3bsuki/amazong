"use client";

import { ChevronRight, Info } from "lucide-react";

interface Attribute {
  label: string;
  value: string;
}

interface MobileQuickSpecsProps {
  attributes: Attribute[] | null;
  maxVisible?: number;
  onSeeAll?: () => void;
  locale?: string;
}

/**
 * MobileQuickSpecs - Readable attribute pills
 * 
 * Design principles:
 * - Larger text (text-xs = 12px) for readability
 * - More padding, cleaner look
 * - Neutral colors with good contrast
 */
export function MobileQuickSpecs({
  attributes,
  maxVisible = 6,
  onSeeAll,
  locale = "en",
}: MobileQuickSpecsProps) {
  const t = {
    seeAll: locale === "bg" ? "Виж всички" : "All specs",
    keyDetails: locale === "bg" ? "Основни характеристики" : "Key Details",
  };

  if (!attributes || attributes.length === 0) return null;

  const visibleSpecs = attributes.slice(0, maxVisible);
  const hasMore = attributes.length > maxVisible;

  return (
    <div className="py-2">
      {/* Section header */}
      <div className="flex items-center gap-1.5 mb-2.5">
        <Info className="size-4 text-muted-foreground" />
        <span className="text-xs font-semibold text-muted-foreground">{t.keyDetails}</span>
      </div>

      {/* Scrollable specs row */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-3 px-3 pb-1">
        {visibleSpecs.map((attr, index) => (
          <div
            key={index}
            className="flex flex-col px-2.5 py-2 bg-muted rounded-md shrink-0 min-w-24"
          >
            <span className="text-2xs text-muted-foreground leading-tight truncate">{attr.label}</span>
            <span className="text-xs text-foreground font-medium truncate mt-0.5 leading-tight">{attr.value}</span>
          </div>
        ))}

        {/* See all button */}
        {hasMore && (
          <button
            type="button"
            onClick={onSeeAll}
            className="flex flex-col items-center justify-center gap-0.5 px-3 py-2 bg-primary/10 rounded-md shrink-0 hover:bg-primary/15 active:bg-primary/20 min-w-16 min-h-touch"
          >
            <ChevronRight className="size-4 text-primary" />
            <span className="text-xs text-primary font-medium">{t.seeAll}</span>
          </button>
        )}
      </div>
    </div>
  );
}
