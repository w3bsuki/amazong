"use client"

import { useCallback, useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"
import { useTranslations } from "next-intl"
import { SlidersHorizontal } from "lucide-react"

import { useRouter } from "@/i18n/routing"
import { SmartRail, type SmartRailAction, type SmartRailPill } from "@/components/mobile/chrome/smart-rail"
import { FilterHub, type FilterHubSubcategory } from "../../_components/filters/filter-hub"
import type { CategoryAttribute } from "@/lib/data/categories"

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

function buildSortParams(searchParams: URLSearchParams, nextSort: string | null): URLSearchParams {
  const next = new URLSearchParams(searchParams.toString())
  next.delete("page")

  if (!nextSort || nextSort === "rating") {
    next.delete("sort")
  } else {
    next.set("sort", nextSort)
  }

  return next
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
  const router = useRouter()
  const searchParams = useSearchParams()

  const [filterOpen, setFilterOpen] = useState(false)

  const currentSort = searchParams.get("sort")
  const relevanceActive = !currentSort || currentSort === "rating"

  const replaceUrl = useCallback(
    (nextParams: URLSearchParams) => {
      const queryString = nextParams.toString()
      router.replace(queryString ? `${basePath}?${queryString}` : basePath)
    },
    [basePath, router],
  )

  const setSort = useCallback(
    (nextSort: string | null) => {
      const next = buildSortParams(new URLSearchParams(searchParams.toString()), nextSort)
      replaceUrl(next)
    },
    [replaceUrl, searchParams],
  )

  const pills = useMemo<SmartRailPill[]>(
    () => [
      {
        id: "relevance",
        label: t("relevance"),
        active: relevanceActive,
        onSelect: () => setSort(null),
      },
      {
        id: "price-asc",
        label: t("priceAscShort"),
        active: currentSort === "price-asc",
        onSelect: () => setSort("price-asc"),
      },
      {
        id: "price-desc",
        label: t("priceDescShort"),
        active: currentSort === "price-desc",
        onSelect: () => setSort("price-desc"),
      },
      {
        id: "newest",
        label: t("newShort"),
        active: currentSort === "newest",
        onSelect: () => setSort("newest"),
      },
    ],
    [currentSort, relevanceActive, setSort, t],
  )

  const leadingAction = useMemo<SmartRailAction | undefined>(() => {
    if (!sellersHref) return undefined

    return {
      label: t("sellersMode"),
      href: sellersHref,
      variant: "chip",
    }
  }, [sellersHref, t])

  return (
    <>
      <SmartRail
        ariaLabel={t("sortBy")}
        pills={pills}
        leadingAction={leadingAction}
        trailingAction={{
          label: t("filters"),
          icon: <SlidersHorizontal className="size-4" aria-hidden="true" />,
          onSelect: () => setFilterOpen(true),
          ariaLabel: t("filters"),
          variant: "chip",
        }}
        stickyTop="var(--offset-mobile-primary-rail)"
        sticky={true}
        testId="mobile-search-smart-rail"
      />

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
    </>
  )
}

export type { MobileSearchSmartRailProps }

