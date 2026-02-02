"use client";

import { useTranslations } from "next-intl";
import { X } from "@phosphor-icons/react";
import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import type { FilterHubSubcategory } from "./filter-hub";

interface FilterCategorySectionProps {
  locale: string;
  categoryName?: string;
  pendingCategorySlug: string | null;
  onChangePendingCategorySlug: (slug: string | null) => void;
  subcategories: FilterHubSubcategory[];
  onCloseHub: () => void;
}

export function FilterCategorySection({
  locale,
  categoryName,
  pendingCategorySlug,
  onChangePendingCategorySlug,
  subcategories,
  onCloseHub,
}: FilterCategorySectionProps) {
  const t = useTranslations("SearchFilters");
  const tHub = useTranslations("FilterHub");

  return (
    <div className="-mx-inset divide-y divide-border">
      <div className="flex items-center px-inset">
        <button
          type="button"
          onClick={() => onChangePendingCategorySlug(null)}
          className={cn(
            "flex-1 flex items-center gap-3 h-10 transition-colors text-left",
            pendingCategorySlug === null ? "bg-selected text-foreground font-medium" : "text-foreground active:bg-active"
          )}
          aria-pressed={pendingCategorySlug === null}
        >
          <div
            className={cn(
              "size-5 rounded-full border flex items-center justify-center transition-colors shrink-0",
              pendingCategorySlug === null ? "bg-primary border-primary" : "border-input"
            )}
          >
            {pendingCategorySlug === null && <div className="size-2 rounded-full bg-primary-foreground" />}
          </div>
          <span className="text-sm">{tHub("allInCategory", { category: categoryName || "" })}</span>
        </button>
        <Link
          href="/categories"
          onClick={onCloseHub}
          className="size-8 flex items-center justify-center rounded-full bg-muted hover:bg-destructive-subtle hover:text-destructive transition-colors shrink-0 ml-2"
          aria-label={t("browseAllCategories")}
          title={t("browseAllCategories")}
        >
          <X size={14} weight="bold" />
        </Link>
      </div>

      {subcategories.map((subcat) => {
        const isActive = pendingCategorySlug === subcat.slug;
        const subcatName = locale === "bg" && subcat.name_bg ? subcat.name_bg : subcat.name;

        return (
          <button
            key={subcat.id}
            type="button"
            onClick={() => onChangePendingCategorySlug(isActive ? null : subcat.slug)}
            className={cn(
              "w-full flex items-center gap-3 px-inset h-10 transition-colors text-left",
              isActive ? "bg-selected text-foreground font-medium" : "text-foreground active:bg-active"
            )}
            aria-pressed={isActive}
          >
            <div
              className={cn(
                "size-5 rounded-full border flex items-center justify-center transition-colors shrink-0",
                isActive ? "bg-primary border-primary" : "border-input"
              )}
            >
              {isActive && <div className="size-2 rounded-full bg-primary-foreground" />}
            </div>
            <span className="text-sm">{subcatName}</span>
          </button>
        );
      })}
    </div>
  );
}

export type { FilterCategorySectionProps };

