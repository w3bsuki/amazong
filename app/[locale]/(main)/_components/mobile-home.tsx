"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { ArrowLeft, ChevronRight, LayoutGrid, SlidersHorizontal as FiltersIcon } from "lucide-react"
import { Link } from "@/i18n/routing"
import dynamic from "next/dynamic"
import { useTranslations } from "next-intl"
import type { CategoryTreeNode } from "@/lib/data/categories/types"
import type { UIProduct } from "@/lib/types/products"
import { getActiveFilterCount } from "@/lib/filters/active-filter-count"
import { getCategoryName, getCategorySlugKey } from "@/lib/data/categories/display"
import { useCategoryCounts } from "@/hooks/use-category-counts"
import { useHeader } from "@/components/providers/header-context"
import { useCategoryDrawerOptional } from "@/components/mobile/category-nav/category-drawer-context"
import { getCategoryIcon } from "@/components/shared/category-icons"
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
  }, [setActiveCategorySlug, setActiveSubcategorySlug])

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
  }, [setActiveSubcategorySlug])

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
    setScope("forYou")
    setNearby(false)
    setFilters(new URLSearchParams())
  }, [setActiveCategorySlug, setActiveSubcategorySlug, setScope, setNearby, setFilters])

  const railAriaLabel = tV4("quickJump.label")
  const feedTransitionState = isLoading && products.length === 0 ? "loading" : products.length === 0 ? "empty" : "results"
  const feedTransitionKey = [
    scope,
    activeCategorySlug ?? "all",
    activeSubcategorySlug ?? "all",
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
      return []
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
    handleSubcategoryPill,
    popularLeafChips,
    tV4,
  ])

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
        {/* Category circles — homepage browse section */}
        {!activeCategorySlug && rootCategoryChips.length > 0 && (
          <section className="border-b border-border-subtle pt-3" data-testid="home-v4-categories-section">
            {/* Circles */}
            <div className="flex gap-3 overflow-x-auto scrollbar-hide px-4 py-1 pb-4" data-testid="home-v4-categories-row">
              {categoryDrawer && (
                <button
                  type="button"
                  onClick={() => categoryDrawer.openRoot()}
                  className="flex shrink-0 group tap-transparent outline-none"
                  aria-label={tCategories("title")}
                  data-testid="home-v4-category-drawer-btn"
                >
                  <span className="flex size-12 items-center justify-center rounded-full bg-secondary group-hover:bg-accent transition-all ring-1 ring-offset-2 ring-offset-background ring-border group-hover:ring-foreground">
                    <LayoutGrid size={20} className="text-foreground" strokeWidth={1.5} aria-hidden="true" />
                  </span>
                </button>
              )}
              {rootCategoryChips.map((category) => {
                const label = getCategoryLabel(category)
                return (
                  <button
                    key={category.slug}
                    type="button"
                    onClick={() => handlePrimaryTab(category.slug)}
                    className="flex shrink-0 group tap-transparent outline-none"
                    aria-label={label}
                    data-testid={`home-v4-category-icon-${category.slug}`}
                  >
                    <span className="flex size-12 items-center justify-center rounded-full bg-secondary group-hover:bg-accent transition-all ring-1 ring-offset-2 ring-offset-background ring-border group-hover:ring-foreground">
                      {getCategoryIcon(category.slug, { size: 20, className: "text-foreground", strokeWidth: 1.5 })}
                    </span>
                  </button>
                )
              })}
            </div>
          </section>
        )}

        {/* SmartRail — visible when drilling into a category */}
        {activeCategorySlug && (
          <SmartRail
            ariaLabel={railAriaLabel}
            pills={railPills}
            leadingAction={railLeadingAction}
            trailingAction={railTrailingAction}
            sticky={true}
            stickyTop="var(--offset-mobile-primary-rail)"
            testId="home-v4-smart-rail"
          />
        )}

        {/* Discovery scope tabs */}
        <DiscoveryRail
          activeScope={scope}
          onScopeChange={handleScopeChange}
          t={tV4}
          testId="home-v4-discovery-rail"
        />

        {/* Section header — visible when a category is active */}
        {activeCategorySlug && activeCategory && (
          <div className="flex items-center justify-between px-4 pt-3 pb-2">
            <h2 className="min-w-0 truncate text-sm font-bold text-foreground">
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
