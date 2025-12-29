"use client";

import { ChevronRight, Info } from "lucide-react";
import { cn } from "@/lib/utils";

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
      {/* Section Header */}
      <div className="flex items-center gap-1.5 mb-2">
        <Info className="size-3.5 text-muted-foreground" />
        <span className="text-xs font-medium text-muted-foreground">
          {t.keyDetails}
        </span>
      </div>

      <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-4 px-4 snap-x pb-1">
        {visibleSpecs.map((attr, index) => (
          <div
            key={index}
            className="flex flex-col px-3 py-1.5 bg-muted/50 border border-border/50 rounded-lg shrink-0 snap-start min-w-[90px] max-w-[130px]"
          >
            <span className="text-[10px] text-muted-foreground leading-tight">
              {attr.label}
            </span>
            <span className="text-xs text-foreground font-medium truncate mt-0.5 leading-tight">
              {attr.value}
            </span>
          </div>
        ))}

        {/* See All Pill */}
        {hasMore && (
          <button
            type="button"
            onClick={onSeeAll}
            className="flex flex-col items-center justify-center gap-0.5 px-3 py-1.5 bg-primary/10 border border-primary/30 rounded-lg shrink-0 snap-start hover:bg-primary/15 active:bg-primary/20 min-w-[70px]"
          >
            <ChevronRight className="size-4 text-primary" />
            <span className="text-[10px] text-primary font-medium">
              {t.seeAll}
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
