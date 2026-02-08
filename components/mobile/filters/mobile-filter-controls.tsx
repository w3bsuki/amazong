"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { useTranslations, useLocale } from "next-intl"
import { useSearchParams, type ReadonlyURLSearchParams } from "next/navigation"
import { cn } from "@/lib/utils"
import { FilterSortBar } from "@/components/mobile/category-nav/filter-sort-bar"
import { FilterHub, type FilterHubMode, type FilterHubSection, type FilterHubSubcategory } from "@/components/shared/filters/filter-hub"
import { FilterChips } from "@/components/shared/filters/filter-chips"
import { BULGARIAN_CITIES } from "@/lib/bulgarian-cities"
import { parseShippingRegion } from "@/lib/shipping"
import type { CategoryAttribute } from "@/lib/data/categories"

interface MobileFilterControlsProps {
  locale: string
  categorySlug?: string
  categoryId?: string
  searchQuery?: string
  attributes?: CategoryAttribute[]
  subcategories?: FilterHubSubcategory[]
  categoryName?: string
  basePath?: string
  stickyTop?: number | string
  sticky?: boolean
  userZone?: string | null
  currentCategory?: { name: string; slug: string } | null
  appliedSearchParams?: URLSearchParams | ReadonlyURLSearchParams
  onApply?: (next: {
    queryString: string
    finalPath: string
    pendingCategorySlug?: string | null
  }) => void
  onRemoveFilter?: (key: string, key2?: string) => void
  onClearAll?: () => void
  className?: string
}

function getCookieValue(name: string): string | null {
  if (typeof document === "undefined") return null
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) {
    return parts.pop()?.split(";").shift() ?? null
  }
  return null
}

export function MobileFilterControls({
  locale,
  categorySlug,
  categoryId,
  searchQuery,
  attributes = [],
  subcategories = [],
  categoryName,
  basePath,
  stickyTop = "var(--app-header-offset)",
  sticky = true,
  userZone,
  currentCategory = null,
  appliedSearchParams,
  onApply,
  onRemoveFilter,
  onClearAll,
  className,
}: MobileFilterControlsProps) {
  const t = useTranslations("SearchFilters")
  const intlLocale = useLocale()
  const routerSearchParams = useSearchParams()
  const resolvedLocale = locale || intlLocale
  const searchParams = appliedSearchParams ?? routerSearchParams

  const [filterHubOpen, setFilterHubOpen] = useState(false)
  const [hubMode, setHubMode] = useState<FilterHubMode>("full")
  const [hubInitialSection, setHubInitialSection] = useState<FilterHubSection | null>(null)

  const cityParam = searchParams.get("city")
  const nearbyParam = searchParams.get("nearby") === "true"
  const hasExplicitLocation = Boolean(cityParam || nearbyParam)

  const cityLabel = useMemo(() => {
    if (!cityParam) return null
    const city = BULGARIAN_CITIES.find((entry) => entry.value === cityParam)
    if (!city) return cityParam
    return resolvedLocale === "bg" ? city.labelBg : city.label
  }, [cityParam, resolvedLocale])

  // Defer client-only cookie read to after mount to avoid hydration mismatch.
  // When `userZone` is provided as a server-prop the cookie fallback is skipped.
  const [clientZone, setClientZone] = useState<string | null>(null)
  useEffect(() => {
    if (userZone == null) {
      setClientZone(getCookieValue("user-zone"))
    }
  }, [userZone])

  const regionFromCookie = useMemo(() => {
    const zone = userZone ?? clientZone
    return parseShippingRegion(zone)
  }, [userZone, clientZone])

  const regionLabel = useMemo(() => {
    if (!regionFromCookie) return null
    if (regionFromCookie === "BG") return t("bulgaria")
    if (regionFromCookie === "UK") return t("unitedKingdom")
    if (regionFromCookie === "EU") return t("europe")
    if (regionFromCookie === "US") return t("usa")
    return t("worldwide")
  }, [regionFromCookie, t])

  const locationChipLabel = useMemo(() => {
    if (hasExplicitLocation) {
      if (cityLabel && nearbyParam) return `${cityLabel} · ${t("nearMe")}`
      if (cityLabel) return cityLabel
      if (nearbyParam) return t("nearMe")
    }
    return regionLabel ?? t("anyLocation")
  }, [hasExplicitLocation, cityLabel, nearbyParam, regionLabel, t])

  const openAllFilters = useCallback(() => {
    setHubMode("full")
    setHubInitialSection(null)
    setFilterHubOpen(true)
  }, [])

  const openLocationFilter = useCallback(() => {
    setHubMode("single")
    setHubInitialSection("location")
    setFilterHubOpen(true)
  }, [])

  const filterChipsProps = {
    ...(currentCategory ? { currentCategory } : {}),
    ...(basePath ? { basePath } : {}),
    ...(appliedSearchParams ? { appliedSearchParams } : {}),
    ...(onRemoveFilter ? { onRemoveFilter } : {}),
    ...(onClearAll ? { onClearAll } : {}),
  }

  const filterHubProps = {
    open: filterHubOpen,
    onOpenChange: setFilterHubOpen,
    locale,
    ...(categorySlug ? { categorySlug } : {}),
    ...(categoryId ? { categoryId } : {}),
    ...(searchQuery ? { searchQuery } : {}),
    attributes,
    ...(basePath ? { basePath } : {}),
    subcategories,
    ...(categoryName ? { categoryName } : {}),
    ...(appliedSearchParams ? { appliedSearchParams } : {}),
    ...(onApply ? { onApply } : {}),
    mode: hubMode,
    initialSection: hubInitialSection,
  }

  return (
    <section className={cn("bg-background", className)}>
      <FilterSortBar
        locale={locale}
        onAllFiltersClick={openAllFilters}
        appliedSearchParams={appliedSearchParams}
        attributes={attributes}
        stickyTop={stickyTop}
        sticky={sticky}
        basePath={basePath}
        locationChipLabel={locationChipLabel}
        locationChipActive={hasExplicitLocation}
        onLocationChipClick={openLocationFilter}
      />

      <div className="bg-background px-inset py-1">
        <FilterChips {...filterChipsProps} />
      </div>

      <FilterHub {...filterHubProps} />
    </section>
  )
}

export type { MobileFilterControlsProps }
