"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { ArrowLeft, ChevronRight, SlidersHorizontal as FiltersIcon } from "lucide-react"
import { Link } from "@/i18n/routing"
import { useTranslations } from "next-intl"
import type { CategoryTreeNode } from "@/lib/data/categories/types"
import type { UIProduct } from "@/lib/types/products"
import { getActiveFilterCount } from "@/lib/filters/active-filter-count"
import { getCategoryName, getCategorySlugKey } from "@/lib/data/categories/display"
import { useHeader } from "@/components/providers/header-context"
import { useCategoryDrawerOptional } from "@/components/mobile/category-nav/category-drawer-context"
import {
  SmartRail,
  type SmartRailAction,
  type SmartRailPill,
} from "@/components/mobile/chrome/smart-rail"
import { MobileSearchOverlay } from "../../_components/search/mobile-search-overlay"
import { HomeCityPickerSheet } from "./mobile/home-city-picker-sheet"
import { PageShell } from "../../_components/page-shell"
import { FilterHub } from "./filters/filter-hub"
import { useHomeDiscoveryFeed } from "./mobile-home/use-home-discovery-feed"
import type { HomeDiscoveryScope } from "./mobile-home/use-home-discovery-feed"
import { MobileHomeFeed } from "./mobile-home/mobile-home-feed"
import { useMobileHomeCategoryNav } from "./mobile-home/use-mobile-home-category-nav"
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
  const [filterOpen, setFilterOpen] = useState(false)
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
    filtersKey,
    setFilters,
    city,
    setCity,
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

  const {
    activeCategory,
    activeSubcategories,
    activeSubcategory,
  } = useMobileHomeCategoryNav({
    categories,
    activeCategorySlug,
    activeSubcategorySlug,
  })
  useHomeCityStorage(city, setCity)

  const categoryDrawer = useCategoryDrawerOptional()
  const { setHeaderState } = useHeader()

  useEffect(() => {
    return () => setHeaderState(null)
  }, [setHeaderState])

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

  const handlePrimaryTab = useCallback((slug: string | null) => {
    setActiveCategorySlug(slug)
    setActiveSubcategorySlug(null)
    setActiveL2Slug(null)
  }, [setActiveCategorySlug, setActiveSubcategorySlug, setActiveL2Slug])

  const handleHeaderCategorySelect = useCallback((slug: string) => {
    handlePrimaryTab(slug === "all" ? null : slug)
  }, [handlePrimaryTab])

  useEffect(() => {
    setHeaderState({
      type: "homepage",
      value: {
        activeCategory: activeCategorySlug ?? "all",
        onCategorySelect: handleHeaderCategorySelect,
        onSearchOpen: () => setSearchOpen(true),
        categories,
      },
    })
  }, [activeCategorySlug, categories, handleHeaderCategorySelect, setHeaderState])

  const handleScopeSelect = useCallback((nextScope: HomeDiscoveryScope) => {
    if (nextScope === "nearby" && !city) {
      setPendingNearbyScope(true)
      setCityPickerOpen(true)
      return
    }
    setScope(nextScope)
    setNearby(nextScope === "nearby")
  }, [city, setNearby, setScope])

  const handleSubcategoryPill = useCallback((slug: string | null) => {
    setActiveSubcategorySlug((previous) => (previous === slug ? null : slug))
    setActiveL2Slug(null)
  }, [setActiveSubcategorySlug, setActiveL2Slug])

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

  const railAriaLabel = tV4("quickJump.label")
  const feedTransitionState = isLoading && products.length === 0 ? "loading" : products.length === 0 ? "empty" : "results"
  const feedTransitionKey = [
    scope,
    activeCategorySlug ?? "all",
    activeSubcategorySlug ?? "all",
    activeL2Slug ?? "all",
    filtersKey,
    feedTransitionState,
  ].join("|")

  const railLeadingAction: SmartRailAction | undefined = activeCategorySlug
    ? {
        label: tV4("actions.reset"),
        icon: <ArrowLeft size={18} aria-hidden="true" />,
        onSelect: () => handlePrimaryTab(null),
        testId: "home-v4-rail-back",
      }
    : categoryDrawer
      ? {
          label: tCategories("title"),
          variant: "pill",
          onSelect: () => categoryDrawer.openRoot(),
          ariaLabel: tV4("actions.openCategories"),
          testId: "home-v4-rail-open-categories",
        }
      : undefined

  const railTrailingAction: SmartRailAction = {
    label: tV4("actions.filter"),
    icon: <FiltersIcon size={18} aria-hidden="true" />,
    active: hasActiveFilters,
    badgeCount: activeFilterCount,
    onSelect: () => setFilterOpen(true),
    testId: "home-v4-filter-trigger",
  }

  const railPills: SmartRailPill[] = useMemo(() => {
    if (!activeCategorySlug) {
      const scopes: Array<{ id: HomeDiscoveryScope; testId: string }> = [
        { id: "forYou", testId: "home-v4-scope-forYou" },
        { id: "newest", testId: "home-v4-scope-newest" },
        { id: "promoted", testId: "home-v4-scope-promoted" },
        { id: "nearby", testId: "home-v4-scope-nearby" },
        { id: "deals", testId: "home-v4-scope-deals" },
      ]

      return scopes.map(({ id, testId }) => ({
        id,
        label: tV4(`scopes.${id}`),
        active: scope === id,
        onSelect: () => handleScopeSelect(id),
        testId,
      }))
    }

    return [
      {
        id: "all",
        label: tV4("actions.all"),
        active: activeSubcategorySlug === null,
        onSelect: () => handleSubcategoryPill(null),
        testId: "home-v4-subcategory-all",
      },
      ...activeSubcategories.map((subcategory) => ({
        id: subcategory.slug,
        label: getCategoryLabel(subcategory),
        active: activeSubcategorySlug === subcategory.slug,
        onSelect: () => handleSubcategoryPill(subcategory.slug),
        testId: `home-v4-subcategory-${subcategory.slug}`,
      })),
    ]
  }, [
    activeCategorySlug,
    activeSubcategories,
    activeSubcategorySlug,
    getCategoryLabel,
    handleScopeSelect,
    handleSubcategoryPill,
    scope,
    tV4,
  ])

  return (
    <PageShell variant="default" className="pb-4">
      <MobileSearchOverlay
        hideDefaultTrigger
        externalOpen={searchOpen}
        onOpenChange={setSearchOpen}
      />

      <div className="mx-auto w-full max-w-(--breakpoint-md) pb-tabbar-safe">
        <SmartRail
          ariaLabel={railAriaLabel}
          pills={railPills}
          leadingAction={railLeadingAction}
          trailingAction={railTrailingAction}
          sticky={true}
          stickyTop="var(--offset-mobile-primary-rail)"
          testId="home-v4-smart-rail"
        />

        {/* Section header — visible when a category is active */}
        {activeCategorySlug && activeCategory && (
          <div className="flex items-center justify-between px-inset pt-2.5 pb-1">
            <h2 className="min-w-0 truncate text-sm font-semibold text-foreground">
              {getCategoryLabel(activeSubcategory ?? activeCategory)}
            </h2>
            <Link
              href={`/categories/${(activeSubcategory ?? activeCategory).slug}`}
              className="inline-flex shrink-0 items-center gap-0.5 text-xs font-medium text-muted-foreground tap-transparent transition-colors duration-fast ease-smooth hover:text-foreground active:text-foreground"
            >
              {tV4("actions.seeAll")}
              <ChevronRight size={14} aria-hidden="true" />
            </Link>
          </div>
        )}

        <div key={feedTransitionKey} className="motion-safe:animate-content-fade-in">
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
      </div>

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
