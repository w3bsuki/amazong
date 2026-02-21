"use client"

import { useSearchParams } from "next/navigation"
import { useTranslations } from "next-intl"
import { SlidersHorizontal } from "lucide-react"
import { getActiveFilterCount } from "@/lib/filters/active-filter-count"
import { SortSelect } from "../../_components/search-controls/sort-select"

interface SearchActionBarProps {
  onFilterOpen: () => void
}

export function SearchActionBar({ onFilterOpen }: SearchActionBarProps) {
  const t = useTranslations("SearchFilters")
  const searchParams = useSearchParams()
  const filterCount = getActiveFilterCount(searchParams)

  return (
    <div className="flex items-center gap-2 border-b border-border-subtle bg-background px-inset py-2">
      <div className="flex-1 min-w-0">
        <SortSelect />
      </div>
      <button
        type="button"
        onClick={onFilterOpen}
        className="inline-flex shrink-0 min-h-(--control-default) items-center gap-2 rounded-lg border border-border-subtle bg-surface-subtle px-3 text-xs font-medium text-foreground tap-transparent hover:bg-hover active:bg-active focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
        aria-label={t("filters")}
      >
        <SlidersHorizontal className="size-4 text-muted-foreground" aria-hidden="true" />
        <span>{t("filters")}</span>
        {filterCount > 0 && (
          <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-primary px-1.5 py-0.5 text-2xs font-semibold text-primary-foreground">
            {filterCount}
          </span>
        )}
      </button>
    </div>
  )
}
