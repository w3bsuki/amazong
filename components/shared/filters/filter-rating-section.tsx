"use client";

import { useTranslations } from "next-intl";
import { Star } from "@phosphor-icons/react";
import { Checkbox } from "@/components/ui/checkbox";
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
              "w-full flex items-center gap-3 px-inset h-11 transition-colors text-left",
              isActive ? "bg-selected text-foreground font-medium" : "text-foreground active:bg-active"
            )}
            aria-pressed={isActive}
          >
            <Checkbox
              checked={isActive}
              onCheckedChange={() => onChange(isActive ? null : value)}
              className="pointer-events-none shrink-0"
              aria-hidden="true"
              tabIndex={-1}
            />
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

