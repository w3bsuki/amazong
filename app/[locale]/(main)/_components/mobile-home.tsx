"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { ChevronRight as CaretRight, Ellipsis as DotsThree, Funnel as FunnelSimple } from "lucide-react";

import { useTranslations } from "next-intl"

import { Link } from "@/i18n/routing"
import type { CategoryTreeNode } from "@/lib/category-tree"
import type { UIProduct } from "@/lib/types/products"
import { cn } from "@/lib/utils"
import { getActiveFilterCount } from "@/lib/filters/active-filter-count"
import { getCategoryName, getCategorySlugKey } from "@/lib/category-display"
import { buildHomeBrowseHref } from "@/lib/home-browse-href"
import { getCategoryIcon } from "./category/category-icons"
import { MobileProductCard } from "@/components/shared/product/card/mobile"
import { useHeader } from "@/components/providers/header-context"
import { MobileSearchOverlay } from "../../_components/search/mobile-search-overlay"
import { HomeCityPickerSheet } from "./mobile/home-city-picker-sheet"
import { HomeBrowseOptionsSheet } from "./mobile/home-browse-options-sheet"
import { PageShell } from "../../_components/page-shell"
import {
  ACTION_CHIP_CLASS,
  getPillClass,
  getPrimaryTabClass,
} from "../_lib/mobile-rail-class-recipes"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { FilterHub } from "@/components/shared/filters/filter-hub"
import { useHomeDiscoveryFeed } from "@/hooks/use-home-discovery-feed"
import type { HomeDiscoveryScope } from "@/hooks/use-home-discovery-feed"

// =============================================================================
// Types
// =============================================================================

interface MobileHomeProps {
  locale: string
  categories: CategoryTreeNode[]
  forYouProducts: UIProduct[]
  categoryProducts?: Record<string, UIProduct[]>
}

interface CategoryChildrenResponse {
  children?: CategoryTreeNode[]
}

// =============================================================================
// Config
// =============================================================================

const MAX_VISIBLE_CATEGORY_TABS = 5
const HOME_CITY_STORAGE_KEY = "treido_user_city"

const DISCOVERY_SCOPES: readonly HomeDiscoveryScope[] = [
  "forYou",
  "newest",
  "promoted",
  "nearby",
  "deals",
]

function renderProductCard(product: UIProduct, index: number) {
  return (
    <MobileProductCard
      key={`${product.id}-${index}`}
      id={product.id}
      title={product.title}
      price={product.price}
      createdAt={product.createdAt ?? null}
      originalPrice={product.listPrice ?? null}
      image={product.image}
      rating={product.rating}
      reviews={product.reviews}
      {...(product.freeShipping === true ? { freeShipping: true } : {})}
      {...(product.isBoosted ? { isBoosted: true } : {})}
      {...(product.boostExpiresAt ? { boostExpiresAt: product.boostExpiresAt } : {})}
      index={index}
      slug={product.slug ?? null}
      username={product.storeSlug ?? null}
      sellerId={product.sellerId ?? null}
      {...(product.sellerName || product.storeSlug
        ? { sellerName: product.sellerName || product.storeSlug || "" }
        : {})}
      sellerAvatarUrl={product.sellerAvatarUrl || null}
      sellerTier={product.sellerTier ?? "basic"}
      sellerVerified={Boolean(product.sellerVerified)}
      {...(product.condition ? { condition: product.condition } : {})}
      {...(product.categoryPath ? { categoryPath: product.categoryPath } : {})}
      {...(product.location ? { location: product.location } : {})}
      titleLines={1}
      layout="feed"
    />
  )
}

// =============================================================================
// Component
// =============================================================================

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
  const [cityHydrated, setCityHydrated] = useState(false)
  const [childrenByParentId, setChildrenByParentId] = useState<Record<string, CategoryTreeNode[]>>({})
  const loadMoreRef = useRef<HTMLDivElement | null>(null)
  const loadingParentIdsRef = useRef<Set<string>>(new Set())
  const childrenByParentIdRef = useRef(childrenByParentId)
  childrenByParentIdRef.current = childrenByParentId
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

  useEffect(() => {
    if (typeof window === "undefined") return
    try {
      const savedCity = localStorage.getItem(HOME_CITY_STORAGE_KEY)
      if (savedCity && savedCity.length > 0) {
        setCity(savedCity)
      }
    } catch {
      // Ignore storage access failures.
    } finally {
      setCityHydrated(true)
    }
  }, [setCity])

  useEffect(() => {
    if (!cityHydrated || typeof window === "undefined") return
    try {
      if (city) {
        localStorage.setItem(HOME_CITY_STORAGE_KEY, city)
      } else {
        localStorage.removeItem(HOME_CITY_STORAGE_KEY)
      }
    } catch {
      // Ignore storage access failures.
    }
  }, [city, cityHydrated])

  const fetchChildrenByParentId = useCallback(async (parentId: string) => {
    if (!parentId) return

    if (Object.prototype.hasOwnProperty.call(childrenByParentIdRef.current, parentId)) return
    if (loadingParentIdsRef.current.has(parentId)) return

    loadingParentIdsRef.current.add(parentId)
    try {
      const response = await fetch(`/api/categories/${encodeURIComponent(parentId)}/children`, {
        method: "GET",
        credentials: "same-origin",
      })

      if (!response.ok) {
        setChildrenByParentId((previous) =>
          Object.prototype.hasOwnProperty.call(previous, parentId)
            ? previous
            : { ...previous, [parentId]: [] }
        )
        return
      }

      const payload = (await response.json()) as CategoryChildrenResponse
      const children = Array.isArray(payload.children) ? payload.children : []

      setChildrenByParentId((previous) =>
        Object.prototype.hasOwnProperty.call(previous, parentId)
          ? previous
          : { ...previous, [parentId]: children }
      )
    } catch {
      setChildrenByParentId((previous) =>
        Object.prototype.hasOwnProperty.call(previous, parentId)
          ? previous
          : { ...previous, [parentId]: [] }
      )
    } finally {
      loadingParentIdsRef.current.delete(parentId)
    }
  }, [])

  const visibleCategoryTabs = useMemo(
    () => categories.slice(0, MAX_VISIBLE_CATEGORY_TABS),
    [categories]
  )
  const overflowCategories = useMemo(
    () => categories.slice(MAX_VISIBLE_CATEGORY_TABS),
    [categories]
  )

  const activeCategory = useMemo(
    () => categories.find((category) => category.slug === activeCategorySlug) ?? null,
    [activeCategorySlug, categories]
  )
  const activeSubcategories = useMemo(() => {
    if (!activeCategory) return []
    if (Object.prototype.hasOwnProperty.call(childrenByParentId, activeCategory.id)) {
      return childrenByParentId[activeCategory.id] ?? []
    }
    return activeCategory.children ?? []
  }, [activeCategory, childrenByParentId])
  const activeSubcategory = activeSubcategories.find((sub) => sub.slug === activeSubcategorySlug) ?? null
  const activeL2Categories = useMemo(() => {
    if (!activeSubcategory) return []
    if (Object.prototype.hasOwnProperty.call(childrenByParentId, activeSubcategory.id)) {
      return childrenByParentId[activeSubcategory.id] ?? []
    }
    return activeSubcategory.children ?? []
  }, [activeSubcategory, childrenByParentId])

  useEffect(() => {
    if (!activeCategory) return

    if (Object.prototype.hasOwnProperty.call(childrenByParentIdRef.current, activeCategory.id)) return

    const seededChildren = activeCategory.children ?? []
    if (seededChildren.length > 0) {
      setChildrenByParentId((previous) =>
        Object.prototype.hasOwnProperty.call(previous, activeCategory.id)
          ? previous
          : { ...previous, [activeCategory.id]: seededChildren }
      )
      return
    }

    void fetchChildrenByParentId(activeCategory.id)
  }, [activeCategory, fetchChildrenByParentId])

  useEffect(() => {
    if (!activeSubcategory) return

    if (Object.prototype.hasOwnProperty.call(childrenByParentIdRef.current, activeSubcategory.id)) return

    const seededChildren = activeSubcategory.children ?? []
    if (seededChildren.length > 0) {
      setChildrenByParentId((previous) =>
        Object.prototype.hasOwnProperty.call(previous, activeSubcategory.id)
          ? previous
          : { ...previous, [activeSubcategory.id]: seededChildren }
      )
      return
    }

    void fetchChildrenByParentId(activeSubcategory.id)
  }, [activeSubcategory, fetchChildrenByParentId])

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
  const contextTitle = activeCategoryLabel && activeSubcategoryLabel && activeL2Label
    ? tV4("banner.categoryPathDeepTitle", {
      parent: activeCategoryLabel,
      child: activeSubcategoryLabel,
      leaf: activeL2Label,
    })
    : activeCategoryLabel && activeSubcategoryLabel
      ? tV4("banner.categoryPathTitle", {
        parent: activeCategoryLabel,
        child: activeSubcategoryLabel,
      })
      : activeSubcategoryLabel ?? activeCategoryLabel ?? tV4(`banner.scopeTitle.${scope}`)

  const fullBrowseHref = buildHomeBrowseHref({
    scope,
    activeCategorySlug,
    activeSubcategorySlug,
    activeL2Slug,
    filters,
    city,
    nearby,
  })
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

  const handleL2Select = useCallback((slug: string | null) => {
    setActiveL2Slug(slug)
  }, [setActiveL2Slug])

  const handleBrowseOptionsSelect = useCallback((slug: string | null) => {
    handleL2Select(slug)
    setBrowseOptionsOpen(false)
  }, [handleL2Select])

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

        <div
          data-testid="home-v4-rails"
          className="sticky top-(--offset-mobile-primary-rail) z-30 border-b border-border-subtle bg-background"
        >
          <nav
            data-testid="home-v4-primary-rail"
            className="overflow-x-auto no-scrollbar"
            aria-label={tV4("aria.primaryCategories")}
          >
            <div className="flex w-max min-w-full items-stretch">
              <button
                type="button"
                aria-pressed={activeCategorySlug === null}
                onClick={() => handlePrimaryTab(null)}
                className={getPrimaryTabClass(activeCategorySlug === null)}
              >
                {getCategoryIcon("categories", {
                  size: 16,
                  weight: activeCategorySlug === null ? "fill" : "regular",
                  className: "shrink-0",
                })}
                <span>{tCategories("all")}</span>
                {activeCategorySlug === null && (
                  <span
                    className="absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-foreground"
                    aria-hidden="true"
                  />
                )}
              </button>

              {visibleCategoryTabs.map((category) => {
                const active = activeCategorySlug === category.slug
                return (
                  <button
                    key={category.slug}
                    type="button"
                    aria-pressed={active}
                    onClick={() => handlePrimaryTab(category.slug)}
                    className={getPrimaryTabClass(active)}
                  >
                    {getCategoryIcon(category.slug, {
                      size: 16,
                      weight: active ? "fill" : "regular",
                      className: "shrink-0",
                    })}
                    <span className="whitespace-nowrap">{getCategoryLabel(category)}</span>
                    {active && (
                      <span
                        className="absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-foreground"
                        aria-hidden="true"
                      />
                    )}
                  </button>
                )
              })}

              {overflowCategories.length > 0 && (
                <button
                  type="button"
                  data-testid="home-v4-more-categories-trigger"
                  onClick={() => setCategoryPickerOpen(true)}
                  aria-label={tV4("actions.moreCategories")}
                  className={getPrimaryTabClass(false, {
                    className: "border-l border-border-subtle",
                  })}
                >
                  <DotsThree size={18} className="shrink-0" />
                  <span>{tV4("actions.moreCategories")}</span>
                </button>
              )}
            </div>
          </nav>

          <section
            data-testid="home-v4-secondary-rail"
            className="border-t border-border-subtle bg-surface-glass backdrop-blur-sm"
          >
            <div className="overflow-x-auto no-scrollbar">
              <div className="flex w-max items-center gap-1.5 px-inset py-1">
                {activeCategorySlug === null ? (
                  DISCOVERY_SCOPES.map((entry) => {
                    const active = scope === entry
                    return (
                      <button
                        key={entry}
                        type="button"
                        data-testid={`home-v4-scope-${entry}`}
                        aria-pressed={active}
                        onClick={() => handleScopeSelect(entry)}
                        className={getPillClass(active)}
                      >
                        {tV4(`scopes.${entry}`)}
                      </button>
                    )
                  })
                ) : (
                  <>
                    <button
                      type="button"
                      aria-pressed={activeSubcategorySlug === null}
                      onClick={() => handleSubcategoryPill(null)}
                      className={getPillClass(activeSubcategorySlug === null)}
                    >
                      {tCategories("all")}
                    </button>
                    {activeSubcategories.map((subcategory) => {
                      const active = activeSubcategorySlug === subcategory.slug
                      return (
                        <button
                          key={subcategory.slug}
                          type="button"
                          aria-pressed={active}
                          onClick={() => handleSubcategoryPill(subcategory.slug)}
                          className={getPillClass(active)}
                        >
                          {getCategoryLabel(subcategory)}
                        </button>
                      )
                    })}
                  </>
                )}

                <div aria-hidden="true" className="mx-0.5 h-5 w-px shrink-0 bg-border-subtle" />

                {showBrowseOptionsTrigger && (
                  <button
                    type="button"
                    data-testid="home-v4-browse-options-trigger"
                    onClick={() => setBrowseOptionsOpen(true)}
                    className={ACTION_CHIP_CLASS}
                  >
                    <DotsThree size={14} aria-hidden="true" />
                    <span>{tV4("actions.browseOptions")}</span>
                  </button>
                )}

                <button
                  type="button"
                  data-testid="home-v4-filter-trigger"
                  aria-pressed={hasActiveFilters}
                  onClick={() => setFilterOpen(true)}
                  className={cn(ACTION_CHIP_CLASS, hasActiveFilters && "border-foreground")}
                >
                  <FunnelSimple size={14} aria-hidden="true" />
                  <span>{tV4("actions.filter")}</span>
                  {hasActiveFilters && (
                    <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-foreground px-1.5 py-0.5 text-2xs font-semibold text-background">
                      {activeFilterCount}
                    </span>
                  )}
                </button>

              </div>
            </div>
          </section>
        </div>

        <section data-testid="home-v4-context-banner" className="px-inset pb-1 pt-0.5">
          <Link
            href={fullBrowseHref}
            className="flex min-h-(--control-compact) items-center justify-between gap-2 rounded-lg border border-border-subtle bg-surface-subtle px-3 text-foreground tap-transparent transition-colors duration-fast ease-smooth hover:bg-hover active:bg-active focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-1"
          >
            <h2 data-testid="home-v4-context-title" className="min-w-0 truncate text-xs font-semibold">
              {contextTitle}
            </h2>
            <CaretRight size={14} className="shrink-0 text-muted-foreground" aria-hidden="true" />
          </Link>
        </section>

        <section data-testid="home-v4-feed" className="pt-1">
          {products.length > 0 ? (
            <>
              <div className="grid grid-cols-2 gap-(--spacing-home-card-gap) px-inset pb-1">
                {products.map((product, index) => renderProductCard(product, index))}
              </div>
              <div ref={loadMoreRef} data-testid="home-v4-load-more" className="h-10" />
            </>
          ) : (
            <div className="flex flex-col items-center justify-center px-6 py-14">
              <p className="text-sm text-muted-foreground">{tMobile("feed.empty.all")}</p>
              <button
                type="button"
                onClick={handleResetAll}
                className="mt-3 inline-flex min-h-(--control-default) items-center rounded-full border border-border-subtle bg-surface-subtle px-3 text-xs font-semibold text-foreground tap-transparent transition-colors duration-fast ease-smooth hover:bg-hover active:bg-active focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-1"
              >
                {tV4("actions.reset")}
              </button>
            </div>
          )}
        </section>

        {isLoading && (
          <div className="px-3 pb-2">
            <div className="rounded-xl border border-border-subtle bg-surface-subtle px-3 py-2">
              <p className="text-xs text-muted-foreground">{tMobile("feed.loading")}</p>
            </div>
          </div>
        )}

        {error && (
          <div className="px-3 pb-2">
            <div className="flex items-center justify-between gap-2 rounded-xl border border-border-subtle bg-surface-subtle px-3 py-2">
              <p className="text-xs text-muted-foreground">{tMobile("feed.error")}</p>
              <button
                type="button"
                onClick={retry}
                className="inline-flex min-h-(--control-default) items-center rounded-full border border-border-subtle bg-background px-3 text-xs font-semibold text-foreground transition-colors hover:bg-hover active:bg-active focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                {tMobile("feed.retry")}
              </button>
            </div>
          </div>
        )}
      </div>

      <Sheet open={categoryPickerOpen} onOpenChange={setCategoryPickerOpen}>
        <SheetContent
          side="bottom"
          data-testid="home-v4-category-picker"
          className="max-h-dialog overflow-hidden rounded-t-2xl p-0"
        >
          <SheetHeader className="border-b border-border-subtle px-4 pr-14">
            <SheetTitle>{tV4("picker.title")}</SheetTitle>
            <SheetDescription>{tV4("picker.description")}</SheetDescription>
          </SheetHeader>

          <div className="overflow-y-auto px-4 py-3">
            <div className="mb-3 flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setCategoryPickerOpen(false)
                  handleResetAll()
                }}
                className={ACTION_CHIP_CLASS}
              >
                {tV4("actions.reset")}
              </button>
              <Link
                href="/categories"
                onClick={() => setCategoryPickerOpen(false)}
                className={ACTION_CHIP_CLASS}
              >
                {tV4("actions.openCategories")}
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-2 pb-2">
              {categories.map((category) => {
                const active = activeCategorySlug === category.slug
                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => handleOverflowCategoryPick(category.slug)}
                    aria-pressed={active}
                    className={cn(
                      "inline-flex min-h-(--control-default) items-center justify-center rounded-xl border px-3 text-xs font-semibold tap-transparent transition-colors duration-fast ease-smooth hover:bg-hover active:bg-active focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-1",
                      active
                        ? "border-foreground bg-foreground text-background"
                        : "border-border-subtle bg-surface-subtle text-foreground"
                    )}
                  >
                    <span className="truncate">{getCategoryLabel(category)}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </SheetContent>
      </Sheet>

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
