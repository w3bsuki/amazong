"use client";

import { useTranslations } from "next-intl";
import { Check } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

interface FilterAvailabilitySectionProps {
  availability: string | null;
  onChange: (availability: string | null) => void;
}

export function FilterAvailabilitySection({ availability, onChange }: FilterAvailabilitySectionProps) {
  const t = useTranslations("SearchFilters");

  const isInStock = availability === "instock";

  return (
    <div className="-mx-inset">
      <button
        type="button"
        onClick={() => onChange(isInStock ? null : "instock")}
        className={cn(
          "w-full flex items-center gap-3 px-inset h-10 transition-colors text-left",
          isInStock ? "bg-selected text-foreground font-medium" : "text-foreground active:bg-active"
        )}
        aria-pressed={isInStock}
      >
        <div
          className={cn(
            "size-5 rounded border flex items-center justify-center transition-colors",
            isInStock ? "bg-primary border-primary" : "border-input"
          )}
        >
          {isInStock && <Check size={12} weight="bold" className="text-primary-foreground" />}
        </div>
        <span className="text-sm">{t("inStock")}</span>
      </button>
    </div>
  );
}

export type { FilterAvailabilitySectionProps };

