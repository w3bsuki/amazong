"use client"

import { useMemo, useState } from "react"
import dynamic from "next/dynamic"
import { useTranslations } from "next-intl"

import { SmartRail, type SmartRailPill } from "@/components/mobile/chrome/smart-rail"
import type { FilterHubSubcategory } from "../../_components/filters/filter-hub"
import { SearchActionBar } from "./search-action-bar"
import type { CategoryAttribute } from "@/lib/data/categories"

const FilterHub = dynamic(
  () => import("../../_components/filters/filter-hub").then((mod) => mod.FilterHub),
  { ssr: false },
)

interface MobileSearchSmartRailProps {
  locale: string
  query: string
  basePath?: string
  categorySlug?: string | null
  categoryId?: string | undefined
  categoryName?: string | undefined
  attributes?: CategoryAttribute[]
  subcategories?: FilterHubSubcategory[]
  sellersHref?: string
}

export function MobileSearchSmartRail({
  locale,
  query,
  basePath = "/search",
  categorySlug,
  categoryId,
  categoryName,
  attributes = [],
  subcategories = [],
  sellersHref,
}: MobileSearchSmartRailProps) {
  const t = useTranslations("SearchFilters")

  const [filterOpen, setFilterOpen] = useState(false)

  // Subcategory pills (only show when we have subcategories)
  const pills = useMemo<SmartRailPill[]>(() => {
    return subcategories.map((sub) => ({
      id: sub.id,
      label: sub.name,
      href: `${basePath}?category=${sub.slug}`,
    }))
  }, [subcategories, basePath])

  const leadingAction = useMemo(() => {
    if (!sellersHref) return

    return {
      label: t("sellersMode"),
      href: sellersHref,
      variant: "chip" as const,
    }
  }, [sellersHref, t])

  const showPillRail = pills.length > 0 || leadingAction

  return (
    <>
      {showPillRail && (
        <SmartRail
          ariaLabel={t("subcategories")}
          pills={pills}
          leadingAction={leadingAction}
          stickyTop="var(--offset-mobile-primary-rail)"
          sticky={true}
          testId="mobile-search-smart-rail"
        />
      )}

      <SearchActionBar onFilterOpen={() => setFilterOpen(true)} />

      {filterOpen ? (
        <FilterHub
          open={filterOpen}
          onOpenChange={setFilterOpen}
          locale={locale}
          attributes={attributes}
          {...(categorySlug ? { categorySlug } : {})}
          {...(categoryId ? { categoryId } : {})}
          {...(query.trim().length > 0 ? { searchQuery: query } : {})}
          subcategories={subcategories}
          {...(categoryName ? { categoryName } : {})}
          basePath={basePath}
          mode="full"
          initialSection={null}
        />
      ) : null}
    </>
  )
}

export type { MobileSearchSmartRailProps }

