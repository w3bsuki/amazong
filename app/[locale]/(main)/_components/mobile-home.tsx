"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { CaretRight } from "@phosphor-icons/react"
import { useTranslations } from "next-intl"
import { Link } from "@/i18n/routing"
import type { UIProduct } from "@/lib/types/products"
import type { CategoryTreeNode } from "@/lib/category-tree"
import { BULGARIAN_CITIES } from "@/lib/bulgarian-cities"
import { useHeader } from "@/components/providers/header-context"
import { useHomeFeedTabs } from "@/hooks/use-home-feed-tabs"
import { useCategoryCounts } from "@/hooks/use-category-counts"
import { MobileProductCard } from "@/components/shared/product/card/mobile"
import { CategoryCirclesSimple } from "@/components/mobile/category-nav"
import { PageShell } from "../../_components/page-shell"
import { MobileSearchOverlay } from "../../_components/search/mobile-search-overlay"
import { HomeSectionHeader } from "./mobile/home-section-header"
import { HomeStickyCategoryPills } from "./mobile/home-sticky-category-pills"
import { HomeFeedControls } from "./mobile/home-feed-controls"
import { HomeCityPickerSheet } from "./mobile/home-city-picker-sheet"

// =============================================================================
// Types
// =============================================================================

interface CuratedSections {
  deals: UIProduct[]
  fashion: UIProduct[]
  electronics: UIProduct[]
  automotive: UIProduct[]
}

interface MobileHomeProps {
  initialProducts: UIProduct[]
  promotedProducts?: UIProduct[]
  curatedSections?: CuratedSections
  initialCategories: CategoryTreeNode[]
  locale: string
  user?: { id: string } | null
}

type CuratedRailKey = keyof CuratedSections

const CURATED_RAIL_PRIORITY: CuratedRailKey[] = ["fashion", "electronics", "automotive", "deals"]

const CURATED_RAIL_HREF: Record<CuratedRailKey, string> = {
  fashion: "/categories/fashion",
  electronics: "/categories/electronics",
  automotive: "/categories/automotive",
  deals: "/todays-deals",
}

const HOME_CITY_STORAGE_KEY = "treido_user_city"

// =============================================================================
// Main Component
// =============================================================================

export function MobileHome({
  initialProducts,
  promotedProducts,
  curatedSections,
  initialCategories,
  locale,
}: MobileHomeProps) {
  const t = useTranslations("Home")
  const tMobile = useTranslations("Home.mobile")
  const [searchOpen, setSearchOpen] = useState(false)
  const [cityPickerOpen, setCityPickerOpen] = useState(false)
  const [cityHydrated, setCityHydrated] = useState(false)
  const [showStickyCategoryPills, setShowStickyCategoryPills] = useState(false)
  const categoryCirclesRef = useRef<HTMLDivElement | null>(null)
  const { counts: categoryCounts } = useCategoryCounts()

  const initialActivePromotedProducts = useMemo(() => {
    const source = promotedProducts ?? []
    const now = Date.now()
    return source.filter((product) => {
      if (!product.isBoosted) return false
      if (!product.boostExpiresAt) return false
      const expiresAt = Date.parse(product.boostExpiresAt)
      return Number.isFinite(expiresAt) && expiresAt > now
    })
  }, [promotedProducts])

  const {
    activeTab,
    sort,
    nearby,
    city,
    products,
    isLoading,
    error,
    setActiveTab,
    setSort,
    setNearby,
    setCity,
    retry,
    buildSearchHref,
  } = useHomeFeedTabs({
    initialNewestProducts: initialProducts,
    initialPromotedProducts: initialActivePromotedProducts,
  })

  const visibleProducts = useMemo(() => {
    if (activeTab !== "promoted") return products.slice(0, 12)
    const now = Date.now()
    const activePromoted = products.filter((product) => {
      if (!product.isBoosted) return false
      if (!product.boostExpiresAt) return false
      const expiresAt = Date.parse(product.boostExpiresAt)
      return Number.isFinite(expiresAt) && expiresAt > now
    })
    return activePromoted.slice(0, 12)
  }, [activeTab, products])
  const cityLabel = useMemo(() => {
    if (!city) return null
    const option = BULGARIAN_CITIES.find((entry) => entry.value === city)
    if (!option) return city
    return locale === "bg" ? option.labelBg : option.label
  }, [city, locale])
  const discoveryTitle = activeTab === "promoted"
    ? tMobile("feed.discoveryHeader.promoted")
    : tMobile("feed.discoveryHeader.all")
  const discoveryHref = useMemo(
    () => buildSearchHref({ tab: activeTab, sort, nearby, city }),
    [activeTab, buildSearchHref, city, nearby, sort]
  )

  const curatedRail = useMemo(() => {
    const sections = curatedSections ?? {
      deals: [],
      fashion: [],
      electronics: [],
      automotive: [],
    }

    for (const key of CURATED_RAIL_PRIORITY) {
      const products = sections[key]
      if (Array.isArray(products) && products.length > 0) {
        return { key, products, href: CURATED_RAIL_HREF[key] }
      }
    }

    return null
  }, [curatedSections])

  // Homepage category navigation is drawer-based; avoid legacy `?tab=` URL state.
  const handleHeaderCategorySelect = useCallback((_slug: string) => {}, [])

  const renderHomeCard = useCallback(
    (product: UIProduct, index: number) => (
      <MobileProductCard
        key={product.id}
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
        {...((product.sellerName || product.storeSlug)
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
    ),
    []
  )

  const handleNearbyToggle = useCallback(() => {
    if (nearby) {
      setNearby(false)
      return
    }
    if (city) {
      setNearby(true)
      return
    }
    setCityPickerOpen(true)
  }, [city, nearby, setNearby])

  const handleNearbyConfigure = useCallback(() => {
    setCityPickerOpen(true)
  }, [])

  const handleCitySelect = useCallback(
    (nextCity: string) => {
      setCity(nextCity)
      setNearby(true)
    },
    [setCity, setNearby]
  )

  const { setHomepageHeader } = useHeader()

  useEffect(() => {
    setHomepageHeader({
      activeCategory: "all",
      onCategorySelect: handleHeaderCategorySelect,
      onSearchOpen: () => setSearchOpen(true),
      categories: initialCategories,
    })
    return () => setHomepageHeader(null)
  }, [handleHeaderCategorySelect, initialCategories, setHomepageHeader])

  useEffect(() => {
    const target = categoryCirclesRef.current
    if (!target || typeof window === "undefined") return

    let rafId = 0

    const updateStickyVisibility = () => {
      rafId = 0
      const rect = target.getBoundingClientRect()
      const shouldShow = rect.bottom <= 0
      setShowStickyCategoryPills((prev) => (prev === shouldShow ? prev : shouldShow))
    }

    const queueUpdate = () => {
      if (rafId !== 0) return
      rafId = window.requestAnimationFrame(updateStickyVisibility)
    }

    updateStickyVisibility()
    window.addEventListener("scroll", queueUpdate, { passive: true })
    window.addEventListener("resize", queueUpdate)

    return () => {
      window.removeEventListener("scroll", queueUpdate)
      window.removeEventListener("resize", queueUpdate)
      if (rafId !== 0) {
        window.cancelAnimationFrame(rafId)
      }
    }
  }, [])

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

  return (
    <PageShell variant="default" className="pb-4">
      <MobileSearchOverlay
        hideDefaultTrigger
        externalOpen={searchOpen}
        onOpenChange={setSearchOpen}
      />

      <div ref={categoryCirclesRef} data-testid="home-category-circles" className="bg-background">
        <CategoryCirclesSimple
          categories={initialCategories}
          locale={locale}
          maxVisible={7}
        />
      </div>

      <HomeStickyCategoryPills
        visible={showStickyCategoryPills}
        categories={initialCategories}
        locale={locale}
        categoryCounts={categoryCounts}
      />

      <div className="space-y-2 pt-0 pb-4">
        <section className="px-(--spacing-home-inset)">
          <Link
            href="/sell"
            data-testid="home-start-selling-cta"
            className="block w-full rounded-xl border border-primary bg-primary px-4 py-3 tap-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <div className="flex min-h-(--control-primary) items-center gap-3">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold tracking-tight text-primary-foreground">
                  {tMobile("sellBannerTitle")}
                </p>
                <p className="mt-0.5 text-xs font-medium text-primary-foreground">
                  {tMobile("sellBannerSubtitle")}
                </p>
              </div>

              <CaretRight
                size={18}
                weight="bold"
                aria-hidden="true"
                className="shrink-0 text-primary-foreground"
              />
              <span className="sr-only">{tMobile("sellBannerAction")}</span>
            </div>
          </Link>
        </section>

        <section className="pt-0.5">
          <HomeFeedControls
            tab={activeTab}
            sort={sort}
            nearby={nearby}
            cityLabel={cityLabel}
            onTabChange={setActiveTab}
            onSortChange={setSort}
            onNearbyToggle={handleNearbyToggle}
            onNearbyConfigure={handleNearbyConfigure}
          />
        </section>

        <section data-testid="home-section-discovery" className="pt-0.5">
          {visibleProducts.length > 0 ? (
            <>
              <div className="px-(--spacing-home-inset) pb-1">
                <div className="flex items-center justify-between gap-2">
                  <h2
                    data-testid="home-discovery-header-title"
                    className="min-w-0 truncate text-xl font-semibold tracking-tight text-home-section-title"
                  >
                    {discoveryTitle}
                  </h2>
                  <Link
                    href={discoveryHref}
                    data-testid="home-discovery-header-see-all"
                    aria-label={tMobile("feed.seeAllAria")}
                    className="inline-flex min-h-(--spacing-touch-md) shrink-0 items-center rounded-md px-1 -mr-1 text-home-section-action transition-colors hover:text-home-section-title active:bg-active active:text-home-section-title"
                  >
                    <span className="sr-only">{tMobile("seeAll")}</span>
                    <CaretRight size={16} weight="bold" aria-hidden="true" />
                  </Link>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-(--spacing-home-card-gap) px-(--spacing-home-inset) pb-1">
                {visibleProducts.map((product, index) => renderHomeCard(product, index))}
              </div>
            </>
          ) : activeTab === "promoted" ? (
            <div className="px-(--spacing-home-inset)">
              <div
                data-testid="home-discovery-empty-promoted"
                className="rounded-xl border border-border-subtle bg-surface-subtle px-3 py-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs text-muted-foreground">{tMobile("feed.empty.promoted")}</p>
                  <button
                    type="button"
                    data-testid="home-promoted-empty-switch-all"
                    onClick={() => {
                      setActiveTab("all")
                      setSort("newest")
                    }}
                    className="inline-flex min-h-(--spacing-touch-md) items-center rounded-full border border-border-subtle bg-background px-2.5 text-xs font-semibold text-foreground transition-colors hover:bg-hover active:bg-active"
                  >
                    {tMobile("feed.empty.switchToAll")}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="px-(--spacing-home-inset)">
              <div className="rounded-xl border border-border-subtle bg-surface-subtle px-3 py-2">
                <p
                  data-testid="home-discovery-empty-all"
                  className="text-xs text-muted-foreground"
                >
                  {tMobile("feed.empty.all")}
                </p>
              </div>
            </div>
          )}
        </section>

        {isLoading && (
          <div className="px-(--spacing-home-inset)">
            <div className="rounded-xl border border-border-subtle bg-surface-subtle px-3 py-2">
              <p className="text-xs text-muted-foreground">{tMobile("feed.loading")}</p>
            </div>
          </div>
        )}

        {error && (
          <div className="px-(--spacing-home-inset)">
            <div className="flex items-center justify-between gap-2 rounded-xl border border-border-subtle bg-surface-subtle px-3 py-2">
              <p className="text-xs text-muted-foreground">{tMobile("feed.error")}</p>
              <button
                type="button"
                data-testid="home-feed-retry"
                onClick={retry}
                className="inline-flex min-h-(--spacing-touch-md) items-center rounded-full border border-border-subtle bg-background px-2.5 text-xs font-semibold text-foreground transition-colors hover:bg-hover active:bg-active"
              >
                {tMobile("feed.retry")}
              </button>
            </div>
          </div>
        )}

        {curatedRail && (
          <section data-testid="home-section-curated-rail" className="pt-(--spacing-home-section-gap)">
            <HomeSectionHeader
              title={t(`sections.${curatedRail.key}`)}
              href={curatedRail.href}
              actionLabel={tMobile("seeAll")}
            />

            <div className="overflow-x-auto scroll-smooth no-scrollbar">
              <div className="flex snap-x snap-mandatory gap-(--spacing-home-card-gap) px-(--spacing-home-inset) pb-1.5">
                {curatedRail.products.slice(0, 10).map((product, index) => (
                  <div
                    key={product.id}
                    className="w-(--spacing-home-card-column-w) shrink-0 snap-start"
                  >
                    {renderHomeCard(product, index)}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>

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
