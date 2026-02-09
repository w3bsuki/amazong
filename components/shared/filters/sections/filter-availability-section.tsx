"use client";

import { useTranslations } from "next-intl";
import { FilterCheckboxItem } from "../controls/filter-checkbox-item";

interface FilterAvailabilitySectionProps {
  availability: string | null;
  onChange: (availability: string | null) => void;
}

export function FilterAvailabilitySection({ availability, onChange }: FilterAvailabilitySectionProps) {
  const t = useTranslations("SearchFilters");

  const isInStock = availability === "instock";

  return (
    <div className="-mx-inset">
      <FilterCheckboxItem
        checked={isInStock}
        onCheckedChange={(checked) => onChange(checked ? "instock" : null)}
        fullBleed
      >
        {t("inStock")}
      </FilterCheckboxItem>
    </div>
  );
}

export type { FilterAvailabilitySectionProps };
