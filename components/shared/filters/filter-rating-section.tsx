"use client";

import { useTranslations } from "next-intl";
import { Check, Star } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

interface FilterRatingSectionProps {
  minRating: string | null;
  onChange: (minRating: string | null) => void;
}

export function FilterRatingSection({ minRating, onChange }: FilterRatingSectionProps) {
  const t = useTranslations("SearchFilters");

  return (
    <div className="-mx-inset divide-y divide-border">
      {[4, 3, 2, 1].map((stars) => {
        const value = stars.toString();
        const isActive = minRating === value;
        return (
          <button
            key={stars}
            type="button"
            onClick={() => onChange(isActive ? null : value)}
            className={cn(
              "w-full flex items-center gap-3 px-inset h-10 transition-colors text-left",
              isActive ? "bg-selected text-foreground font-medium" : "text-foreground active:bg-active"
            )}
            aria-pressed={isActive}
          >
            <div
              className={cn(
                "size-5 rounded border flex items-center justify-center transition-colors shrink-0",
                isActive ? "bg-primary border-primary" : "border-input"
              )}
            >
              {isActive && <Check size={12} weight="bold" className="text-primary-foreground" />}
            </div>
            <div className="flex text-rating">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={18} weight={i < stars ? "fill" : "regular"} />
              ))}
            </div>
            <span className="text-sm">{t("andUp")}</span>
          </button>
        );
      })}
    </div>
  );
}

export type { FilterRatingSectionProps };

