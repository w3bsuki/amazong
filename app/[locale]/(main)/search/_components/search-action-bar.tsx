"use client"

import dynamic from "next/dynamic"
import { useSearchParams } from "next/navigation"
import { useTranslations } from "next-intl"
import { useMemo, useState } from "react"
import { ArrowUpDown, MapPin, SlidersHorizontal } from "lucide-react"
import { getActiveFilterCount } from "@/lib/filters/active-filter-count"

const SearchSortSheet = dynamic(() => import("./search-sort-sheet").then((mod) => mod.SearchSortSheet), {
  ssr: false,
})

interface SearchActionBarProps {
  onFilterOpen: () => void
}

export function SearchActionBar({ onFilterOpen }: SearchActionBarProps) {
  const t = useTranslations("SearchFilters")
  const searchParams = useSearchParams()
  const filterCount = getActiveFilterCount(searchParams)
  const [sortOpen, setSortOpen] = useState(false)

  const currentCity = searchParams.get("city")
  const currentNearby = searchParams.get("nearby") === "true"
  const locationLabel = useMemo(() => {
    if (currentNearby) return t("nearMe")
    if (!currentCity) return t("anyLocation")

    return currentCity
  }, [currentCity, currentNearby, t])

  return (
    <>
      <div
        data-testid="mobile-filter-sort-bar"
        className="flex items-center gap-2 border-b border-border-subtle bg-background px-inset py-2"
      >
        <button
          type="button"
          onClick={onFilterOpen}
          data-testid="mobile-location-chip"
          className="inline-flex min-h-(--control-default) min-w-0 flex-1 items-center gap-2 rounded-lg border border-border-subtle bg-background px-3 text-xs font-medium text-foreground tap-transparent hover:bg-hover active:bg-active focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
          aria-label={t("location")}
        >
          <MapPin className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
          <span className="min-w-0 truncate">{locationLabel}</span>
        </button>

        <button
          type="button"
          onClick={() => setSortOpen(true)}
          className="inline-flex shrink-0 min-h-(--control-default) items-center gap-2 rounded-lg border border-border-subtle bg-surface-subtle px-3 text-xs font-medium text-foreground tap-transparent hover:bg-hover active:bg-active focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
          aria-label={t("sortBy")}
        >
          <ArrowUpDown className="size-4 text-muted-foreground" aria-hidden="true" />
          <span>{t("sortBy")}</span>
        </button>

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

      {sortOpen ? (
        <SearchSortSheet open={sortOpen} onOpenChange={setSortOpen} />
      ) : null}
    </>
  )
}
