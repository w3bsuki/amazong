"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useTranslations } from "next-intl"
import type { CategoryTreeNode } from "@/lib/category-tree"
import type { UIProduct } from "@/lib/types/products"
import { getActiveFilterCount } from "@/lib/filters/active-filter-count"
import { getCategoryName, getCategorySlugKey } from "@/lib/category-display"
import { buildHomeBrowseHref } from "@/lib/home-browse-href"
import { useHeader } from "@/components/providers/header-context"
import { MobileSearchOverlay } from "../../_components/search/mobile-search-overlay"
import { HomeCityPickerSheet } from "./mobile/home-city-picker-sheet"
import { HomeBrowseOptionsSheet } from "./mobile/home-browse-options-sheet"
import { PageShell } from "../../_components/page-shell"
import { FilterHub } from "./filters/filter-hub"
import { useHomeDiscoveryFeed } from "./mobile-home/use-home-discovery-feed"
import type { HomeDiscoveryScope } from "./mobile-home/use-home-discovery-feed"
import { MobileHomeRails } from "./mobile-home/mobile-home-rails"
import { MobileHomeFeed } from "./mobile-home/mobile-home-feed"
import { useMobileHomeCategoryNav } from "./mobile-home/use-mobile-home-category-nav"
import { MobileHomeCategoryPicker } from "./mobile-home/mobile-home-category-picker"
import { useHomeCityStorage } from "./mobile-home/use-home-city-storage"

interface MobileHomeProps {
  locale: string
  categories: CategoryTreeNode[]
  forYouProducts: UIProduct[]
  categoryProducts?: Record<string, UIProduct[]>
}

export function MobileHome({
  locale,
  categories,
  forYouProducts,
  categoryProducts = {},
}: MobileHomeProps) {
  const tCategories = useTranslations("Categories")
  const tMobile = useTranslations("Home.mobile")
  const tV4 = useTranslations("Home.mobile.v4")

  const [searchOpen, setSearchOpen] = useState(false)
  const [categoryPickerOpen, setCategoryPickerOpen] = useState(false)
  const [filterOpen, setFilterOpen] = useState(false)
  const [browseOptionsOpen, setBrowseOptionsOpen] = useState(false)
  const [cityPickerOpen, setCityPickerOpen] = useState(false)
  const [pendingNearbyScope, setPendingNearbyScope] = useState(false)
  const loadMoreRef = useRef<HTMLDivElement | null>(null)
  const initialPools = useMemo(() => ({ forYou: forYouProducts }), [forYouProducts])

  const {
    scope,
    setScope,
    activeCategorySlug,
    setActiveCategorySlug,
    activeSubcategorySlug,
    setActiveSubcategorySlug,
    activeL2Slug,
    setActiveL2Slug,
    filters,
    setFilters,
    city,
    setCity,
    nearby,
    setNearby,
    products,
    isLoading,
    error,
    loadNextPage,
    retry,
  } = useHomeDiscoveryFeed({
    initialPools,
    initialCategoryProducts: categoryProducts,
    initialScope: "forYou",
    limit: 24,
  })

  const { visibleCategoryTabs, overflowCategories, activeCategory, activeSubcategories, activeSubcategory, activeL2Categories } = useMobileHomeCategoryNav({
    categories,
    activeCategorySlug,
    activeSubcategorySlug,
  })
  const cityHydrated = useHomeCityStorage(city, setCity)

  const { setHeaderState } = useHeader()

  useEffect(() => {
    setHeaderState({
      type: "homepage",
      value: {
        activeCategory: activeCategorySlug ?? "all",
        onCategorySelect: () => {},
        onSearchOpen: () => setSearchOpen(true),
        categories,
      },
    })
    return () => setHeaderState(null)
  }, [activeCategorySlug, categories, setHeaderState])

  useEffect(() => {
    const target = loadMoreRef.current
    if (!target || typeof window === "undefined") return

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (!entry?.isIntersecting) return
        loadNextPage()
      },
      { rootMargin: "600px 0px" }
    )

    observer.observe(target)
    return () => observer.disconnect()
  }, [loadNextPage])

  const activeFilterCount = useMemo(() => getActiveFilterCount(filters), [filters])
  const hasActiveFilters = activeFilterCount > 0

  const getCategoryLabel = useCallback((category: CategoryTreeNode) => {
    return tCategories("shortName", {
      slug: getCategorySlugKey(category.slug),
      name: getCategoryName(category, locale),
    })
  }, [locale, tCategories])

  const activeCategoryLabel = activeCategory ? getCategoryLabel(activeCategory) : null
  const activeSubcategoryLabel = activeSubcategory ? getCategoryLabel(activeSubcategory) : null
  const activeL2Category = activeL2Categories.find((category) => category.slug === activeL2Slug) ?? null
  const activeL2Label = activeL2Category ? getCategoryLabel(activeL2Category) : null
  const scopeTitle = tV4(`banner.scopeTitle.${scope}`)

  const fullBrowseHref = buildHomeBrowseHref({ scope, activeCategorySlug, activeSubcategorySlug, activeL2Slug, filters, city, nearby })
  const showBrowseOptionsTrigger = activeSubcategorySlug !== null && activeL2Categories.length > 0

  const handlePrimaryTab = useCallback((slug: string | null) => {
    setActiveCategorySlug(slug)
    setActiveSubcategorySlug(null)
    setActiveL2Slug(null)
  }, [setActiveCategorySlug, setActiveSubcategorySlug, setActiveL2Slug])

  const handleScopeSelect = useCallback((nextScope: HomeDiscoveryScope) => {
    if (nextScope === "nearby" && !city) {
      setPendingNearbyScope(true)
      setCityPickerOpen(true)
      return
    }
    setScope(nextScope)
    setNearby(nextScope === "nearby")
  }, [city, setNearby, setScope])

  const handleOverflowCategoryPick = useCallback((slug: string) => {
    setCategoryPickerOpen(false)
    setActiveCategorySlug(slug)
    setActiveSubcategorySlug(null)
    setActiveL2Slug(null)
  }, [setActiveCategorySlug, setActiveSubcategorySlug, setActiveL2Slug])

  const handleSubcategoryPill = useCallback((slug: string | null) => {
    setActiveSubcategorySlug((previous) => (previous === slug ? null : slug))
    setActiveL2Slug(null)
  }, [setActiveSubcategorySlug, setActiveL2Slug])



  const handleBrowseOptionsSelect = useCallback((slug: string | null) => {
    setActiveL2Slug(slug)
    setBrowseOptionsOpen(false)
  }, [setActiveL2Slug])

  const handleApplyFilters = useCallback((next: { queryString: string }) => {
    const params = new URLSearchParams(next.queryString)
    setFilters(params)
  }, [setFilters])

  const handleCitySelect = useCallback((nextCity: string) => {
    setCity(nextCity)
    setFilters(new URLSearchParams([["city", nextCity], ["nearby", "true"]]))
    if (pendingNearbyScope) {
      setScope("nearby")
      setNearby(true)
      setPendingNearbyScope(false)
    }
  }, [pendingNearbyScope, setCity, setFilters, setNearby, setScope])

  const handleResetAll = useCallback(() => {
    setActiveCategorySlug(null)
    setActiveSubcategorySlug(null)
    setActiveL2Slug(null)
    setScope("forYou")
    setNearby(false)
    setFilters(new URLSearchParams())
  }, [setActiveCategorySlug, setActiveSubcategorySlug, setActiveL2Slug, setScope, setNearby, setFilters])

  useEffect(() => {
    if (showBrowseOptionsTrigger) return
    setBrowseOptionsOpen(false)
  }, [showBrowseOptionsTrigger])

  return (
    <PageShell variant="default" className="pb-4">
      <MobileSearchOverlay
        hideDefaultTrigger
        externalOpen={searchOpen}
        onOpenChange={setSearchOpen}
      />

      <div className="mx-auto w-full max-w-(--breakpoint-md) pb-tabbar-safe">
        <h1 className="sr-only">{tV4("title")}</h1>

        <MobileHomeRails
          tCategories={tCategories}
          tV4={tV4}
          scope={scope}
          activeCategorySlug={activeCategorySlug}
          activeSubcategorySlug={activeSubcategorySlug}
          visibleCategoryTabs={visibleCategoryTabs}
          overflowCategories={overflowCategories}
          activeSubcategories={activeSubcategories}
          activeCategoryLabel={activeCategoryLabel}
          activeSubcategoryLabel={activeSubcategoryLabel}
          activeL2Label={activeL2Label}
          scopeTitle={scopeTitle}
          listingCount={products.length}
          fullBrowseHref={fullBrowseHref}
          showBrowseOptionsTrigger={showBrowseOptionsTrigger}
          hasActiveFilters={hasActiveFilters}
          activeFilterCount={activeFilterCount}
          onPrimaryTab={handlePrimaryTab}
          onScopeSelect={handleScopeSelect}
          onSubcategoryPill={handleSubcategoryPill}
          onCategoryPickerOpen={() => setCategoryPickerOpen(true)}
          onBrowseOptionsOpen={() => setBrowseOptionsOpen(true)}
          onFilterOpen={() => setFilterOpen(true)}
          getCategoryLabel={getCategoryLabel}
        />

        <MobileHomeFeed
          products={products}
          isLoading={isLoading}
          error={error}
          loadMoreRef={loadMoreRef}
          tMobile={tMobile}
          tV4={tV4}
          onResetAll={handleResetAll}
          onRetry={retry}
        />
      </div>

      <MobileHomeCategoryPicker
        categories={categories}
        activeCategorySlug={activeCategorySlug}
        open={categoryPickerOpen}
        onOpenChange={setCategoryPickerOpen}
        onPickCategory={handleOverflowCategoryPick}
        onResetAll={handleResetAll}
        getCategoryLabel={getCategoryLabel}
        tV4={tV4}
      />

      <HomeBrowseOptionsSheet
        open={browseOptionsOpen}
        onOpenChange={setBrowseOptionsOpen}
        locale={locale}
        subcategoryLabel={activeSubcategoryLabel ?? ""}
        categories={activeL2Categories}
        activeSlug={activeL2Slug}
        onSelect={handleBrowseOptionsSelect}
        fullBrowseHref={fullBrowseHref}
      />

      <FilterHub
        open={filterOpen}
        onOpenChange={setFilterOpen}
        locale={locale}
        resultsCount={products.length}
        attributes={[]}
        subcategories={[]}
        appliedSearchParams={filters}
        onApply={handleApplyFilters}
        mode="full"
        initialSection={null}
      />

      <HomeCityPickerSheet
        open={cityPickerOpen}
        locale={locale}
        selectedCity={city}
        onOpenChange={setCityPickerOpen}
        onSelectCity={handleCitySelect}
      />
    </PageShell>
  )
}
