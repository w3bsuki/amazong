"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { ArrowLeft, ChevronRight, SlidersHorizontal as FiltersIcon } from "lucide-react"
import { Link } from "@/i18n/routing"
import dynamic from "next/dynamic"
import { useTranslations } from "next-intl"
import type { CategoryTreeNode } from "@/lib/data/categories/types"
import type { UIProduct } from "@/lib/types/products"
import { getActiveFilterCount } from "@/lib/filters/active-filter-count"
import { getCategoryName, getCategorySlugKey } from "@/lib/data/categories/display"
import { useCategoryCounts } from "@/hooks/use-category-counts"
import { useHeader } from "@/components/providers/header-context"
import {
  SmartRail,
  type SmartRailAction,
  type SmartRailPill,
} from "@/components/mobile/chrome/smart-rail"
import { DiscoveryRail } from "@/components/mobile/chrome/discovery-rail"
import { PageShell } from "../../_components/page-shell"
import { useHomeDiscoveryFeed, type HomeDiscoveryScope } from "./mobile-home/use-home-discovery-feed"
import { MobileHomeFeed } from "./mobile-home/mobile-home-feed"
import { useMobileHomeCategoryNav } from "./mobile-home/use-mobile-home-category-nav"
import { useHomeCityStorage } from "./mobile-home/use-home-city-storage"
import { MobileHomeBrowseOptionsSheet } from "./mobile-home/mobile-home-browse-options-sheet"
import { MobileHomeCategoryIconGrid } from "./mobile-home/mobile-home-category-icon-grid"
import { useMobileHomeL2Options } from "./mobile-home/use-mobile-home-l2-options"

interface MobileHomeProps {
  locale: string
  categories: CategoryTreeNode[]
  forYouProducts: UIProduct[]
  categoryProducts?: Record<string, UIProduct[]>
}

const MobileSearchOverlay = dynamic(
  () =>
    import("@/components/layout/header/search/mobile-search-overlay").then(
      (mod) => mod.MobileSearchOverlay
    ),
  { ssr: false }
)

const FilterHub = dynamic(() => import("./filters/filter-hub").then((mod) => mod.FilterHub), {
  ssr: false,
})

const HomeCityPickerSheet = dynamic(
  () => import("./mobile/home-city-picker-sheet").then((mod) => mod.HomeCityPickerSheet),
  { ssr: false }
)

export function MobileHome({
  locale,
  categories,
  forYouProducts,
  categoryProducts = {},
}: MobileHomeProps) {
  const tCategories = useTranslations("Categories")
  const tMobile = useTranslations("Home.mobile")
  const tV4 = useTranslations("Home.mobile.v4")
  const tCommon = useTranslations("Common")

  const [searchOpen, setSearchOpen] = useState(false)
  const [filterOpen, setFilterOpen] = useState(false)
  const [cityPickerOpen, setCityPickerOpen] = useState(false)
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
  const { counts: categoryCounts } = useCategoryCounts({ enabled: true })

  const {
    rootCategoryChips,
    activeCategory,
    activeSubcategories,
    popularLeafChips,
    activeSubcategory,
  } = useMobileHomeCategoryNav({
    categories,
    activeCategorySlug,
    activeSubcategorySlug,
    categoryCounts,
  })
  useHomeCityStorage(city, setCity)

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

  const handleSubcategoryPill = useCallback((slug: string | null) => {
    setActiveSubcategorySlug((previous) => (previous === slug ? null : slug))
    setActiveL2Slug(null)
  }, [setActiveSubcategorySlug, setActiveL2Slug])

  const handleScopeChange = useCallback((nextScope: HomeDiscoveryScope) => {
    setScope(nextScope)
    if (nextScope === "nearby" && !city) {
      setCityPickerOpen(true)
    }
  }, [city, setScope])

  const handleApplyFilters = useCallback((next: { queryString: string }) => {
    const params = new URLSearchParams(next.queryString)
    setFilters(params)
  }, [setFilters])

  const handleCitySelect = useCallback((nextCity: string) => {
    setCity(nextCity)
    setFilters(new URLSearchParams([["city", nextCity], ["nearby", "true"]]))
    setScope("nearby")
    setNearby(true)
  }, [setCity, setFilters, setNearby, setScope])

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
        variant: "icon",
        ariaLabel: tV4("actions.reset"),
      }
    : undefined

  const railTrailingAction: SmartRailAction = {
    label: tV4("actions.filter"),
    icon: <FiltersIcon size={18} aria-hidden="true" />,
    active: hasActiveFilters,
    badgeCount: activeFilterCount,
    onSelect: () => setFilterOpen(true),
    testId: "home-v4-filter-trigger",
    variant: "icon",
    ariaLabel: tV4("actions.filter"),
  }

  const railPills: SmartRailPill[] = useMemo(() => {
    if (!activeCategorySlug) {
      return [
        {
          id: "all",
          label: tV4("actions.all"),
          active: true,
          onSelect: () => handlePrimaryTab(null),
          testId: "home-v4-root-all",
        },
        ...rootCategoryChips.map((category) => ({
          id: category.slug,
          label: getCategoryLabel(category),
          active: false,
          onSelect: () => handlePrimaryTab(category.slug),
          testId: `home-v4-root-${category.slug}`,
        })),
      ]
    }

    const leafPills = popularLeafChips.length > 0 ? popularLeafChips : activeSubcategories

    return [
      {
        id: "all",
        label: tV4("actions.all"),
        active: activeSubcategorySlug === null,
        onSelect: () => handleSubcategoryPill(null),
        testId: "home-v4-subcategory-all",
      },
      ...leafPills.map((subcategory) => ({
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
    handlePrimaryTab,
    handleSubcategoryPill,
    popularLeafChips,
    rootCategoryChips,
    tV4,
  ])

  const [browseOptionsOpen, setBrowseOptionsOpen] = useState(false)

  useEffect(() => {
    setBrowseOptionsOpen(false)
  }, [activeSubcategory?.slug])

  const { options: l2Options, isLoading: isLoadingL2Options } = useMobileHomeL2Options({
    activeSubcategory,
    activeL2Slug,
    setActiveL2Slug,
  })

  const browseOptionsAction: SmartRailAction | undefined =
    activeSubcategory && l2Options.length > 0
      ? {
          label: tV4("actions.browseOptions"),
          active: Boolean(activeL2Slug),
          onSelect: () => setBrowseOptionsOpen(true),
          ariaLabel: tV4("actions.browseOptions"),
          testId: "home-v4-browse-options-trigger",
        }
      : undefined

  return (
    <PageShell variant="default" className="pb-4">
      {searchOpen ? (
        <MobileSearchOverlay
          hideDefaultTrigger
          externalOpen={searchOpen}
          onOpenChange={setSearchOpen}
        />
      ) : null}

      <div className="mx-auto w-full max-w-screen-md pb-tabbar-safe">
        {!activeCategorySlug ? (
          <>
            <MobileHomeCategoryIconGrid
              title={tCategories("title")}
              seeAllLabel={tV4("actions.seeAll")}
              categories={categories}
              getCategoryLabel={getCategoryLabel}
              onSelectCategory={(slug) => handlePrimaryTab(slug)}
              testId="home-v4-category-icon-grid"
            />

            {/* Discovery scope tabs (with filter) */}
            <DiscoveryRail
              activeScope={scope}
              onScopeChange={handleScopeChange}
              t={tV4}
              trailingAction={{
                label: tV4("actions.filter"),
                icon: <FiltersIcon size={18} aria-hidden="true" />,
                active: hasActiveFilters,
                badgeCount: activeFilterCount,
                onSelect: () => setFilterOpen(true),
                testId: "home-v4-filter-trigger",
              }}
              className="border-t border-border"
              testId="home-v4-scope"
            />
          </>
        ) : (
          <div className="space-y-1">
            {/* Smart rail: categories/subcategories + actions */}
            <SmartRail
              ariaLabel={railAriaLabel}
              pills={railPills}
              filterAction={browseOptionsAction}
              leadingAction={railLeadingAction}
              trailingAction={railTrailingAction}
              sticky={true}
              stickyTop="var(--offset-mobile-primary-rail)"
              className="border-b-0 py-0"
              testId="home-v4-secondary-rail"
            />

            {/* Discovery scope tabs */}
            <DiscoveryRail
              activeScope={scope}
              onScopeChange={handleScopeChange}
              t={tV4}
              testId="home-v4-scope"
            />
          </div>
        )}

        {/* Section header — visible when a category is active */}
        {activeCategorySlug && activeCategory && (
          <div className="flex items-center justify-between px-4 pt-2 pb-1">
            <h2 className="min-w-0 truncate text-reading font-semibold text-foreground">
              {getCategoryLabel(activeSubcategory ?? activeCategory)}
            </h2>
            <Link
              href={activeSubcategory
                ? `/categories/${activeCategory.slug}/${activeSubcategory.slug}`
                : `/categories/${activeCategory.slug}`}
              className="inline-flex shrink-0 items-center gap-0.5 text-xs font-medium text-muted-foreground tap-transparent transition-colors hover:text-foreground active:text-foreground"
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

      {browseOptionsOpen && activeSubcategory ? (
        <MobileHomeBrowseOptionsSheet
          open={browseOptionsOpen}
          onOpenChange={setBrowseOptionsOpen}
          title={tV4("browseSheet.title")}
          description={tV4("browseSheet.description")}
          closeLabel={tCommon("close")}
          loadingLabel={tCommon("loading")}
          allLabel={tV4("browseSheet.allInSubcategory", {
            subcategory: getCategoryLabel(activeSubcategory),
          })}
          options={l2Options}
          isLoading={isLoadingL2Options}
          onSelectAll={() => {
            setActiveL2Slug(null)
            setBrowseOptionsOpen(false)
          }}
          onSelectOption={(slug) => {
            setActiveL2Slug(slug)
            setBrowseOptionsOpen(false)
          }}
          getOptionLabel={getCategoryLabel}
        />
      ) : null}

      {filterOpen ? (
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
      ) : null}

      {cityPickerOpen ? (
        <HomeCityPickerSheet
          open={cityPickerOpen}
          locale={locale}
          selectedCity={city}
          onOpenChange={setCityPickerOpen}
          onSelectCity={handleCitySelect}
        />
      ) : null}
    </PageShell>
  )
}
