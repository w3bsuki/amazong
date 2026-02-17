import { useTranslations } from "next-intl";
import { X } from "lucide-react";

import { Link } from "@/i18n/routing";
import { FilterRadioGroup, FilterRadioItem } from "../controls/filter-radio-group";
import type { FilterHubSubcategory } from "../filter-hub";

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

  // We use empty string as the "all" value since RadioGroup requires string values
  const currentValue = pendingCategorySlug ?? "";

  return (
    <div className="-mx-inset">
      <FilterRadioGroup
        value={currentValue}
        onValueChange={(value) => onChangePendingCategorySlug(value || null)}
      >
        {/* "All in category" header with close button */}
        <div className="flex items-center px-inset border-b border-border">
          <FilterRadioItem
            value=""
            className="flex-1 border-b-0"
          >
            {tHub("allInCategory", { category: categoryName || "" })}
          </FilterRadioItem>
          <Link
            href="/categories"
            onClick={onCloseHub}
            className="ml-2 size-8 shrink-0 rounded-full bg-muted flex items-center justify-center transition-colors hover:bg-destructive-subtle hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
            aria-label={t("browseAllCategories")}
            title={t("browseAllCategories")}
          >
            <X size={14} />
          </Link>
        </div>

        {subcategories.map((subcat) => {
          const subcatName = locale === "bg" && subcat.name_bg ? subcat.name_bg : subcat.name;
          return (
            <FilterRadioItem
              key={subcat.id}
              value={subcat.slug}
              fullBleed
            >
              {subcatName}
            </FilterRadioItem>
          );
        })}
      </FilterRadioGroup>
    </div>
  );
}

export type { FilterCategorySectionProps };

