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
    <div className="py-3">
      {/* Section Header */}
      <div className="flex items-center gap-1.5 mb-2.5">
        <Info className="w-3.5 h-3.5 text-muted-foreground" />
        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          {t.keyDetails}
        </span>
      </div>

      <div className="flex gap-2 overflow-x-auto scrollbar-hide scroll-pl-0 -mx-4 px-4 snap-x snap-mandatory pb-1">
        {visibleSpecs.map((attr, index) => (
          <div
            key={index}
            className="flex flex-col px-3.5 py-2 bg-[var(--color-spec-pill-bg)] border border-[var(--color-spec-pill-border)] rounded-xl shrink-0 snap-start min-w-[100px] max-w-[150px]"
          >
            <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide leading-tight">
              {attr.label}
            </span>
            <span className="text-xs text-[var(--color-spec-pill-text)] font-bold truncate mt-0.5 leading-tight">
              {attr.value}
            </span>
          </div>
        ))}

        {/* See All Pill */}
        {hasMore && (
          <button
            type="button"
            onClick={onSeeAll}
            className="flex flex-col items-center justify-center gap-0.5 px-4 py-2 bg-[var(--color-link)]/10 border border-[var(--color-link)]/30 rounded-xl shrink-0 snap-start hover:bg-[var(--color-link)]/15 active:bg-[var(--color-link)]/20 transition-colors touch-action-manipulation min-w-[80px]"
          >
            <ChevronRight className="w-4 h-4 text-[var(--color-link)]" />
            <span className="text-[10px] text-[var(--color-link)] font-bold uppercase tracking-wide">
              {t.seeAll}
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
