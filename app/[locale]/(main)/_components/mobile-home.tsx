"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useTranslations } from "next-intl"
import { Link } from "@/i18n/routing"
import type { UIProduct } from "@/lib/types/products"
import type { CategoryTreeNode } from "@/lib/category-tree"
import { BULGARIAN_CITIES } from "@/lib/bulgarian-cities"
import { useHeader } from "@/components/providers/header-context"
import { useHomeDiscoveryFeed } from "@/hooks/use-home-discovery-feed"
import { MobileProductCard } from "@/components/shared/product/card/mobile"
import { CategoryCirclesSimple } from "@/components/mobile/category-nav"
import { PageShell } from "../../_components/page-shell"
import { MobileSearchOverlay } from "../../_components/search/mobile-search-overlay"
import { HomeSectionHeader } from "./mobile/home-section-header"
import { HomeDiscoveryControls } from "./mobile/home-discovery-controls"
import { HomeCityPickerSheet } from "./mobile/home-city-picker-sheet"
import { PromotedListingsStrip } from "./mobile/promoted-listings-strip"

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
  automotive: "/automotive",
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
  const categoryCirclesRef = useRef<HTMLDivElement | null>(null)
  const loadMoreRef = useRef<HTMLDivElement | null>(null)

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
    sort,
    nearby,
    city,
    products,
    isLoading,
    error,
    setSort,
    setNearby,
    setCity,
    loadNextPage,
    retry,
  } = useHomeDiscoveryFeed({
    initialProducts,
    feedType: "newest",
    preferInitialProducts: true,
    limit: 24,
  })

  const cityLabel = useMemo(() => {
    if (!city) return null
    const option = BULGARIAN_CITIES.find((entry) => entry.value === city)
    if (!option) return city
    return locale === "bg" ? option.labelBg : option.label
  }, [city, locale])

  const curatedRail = useMemo(() => {
    const sections = curatedSections ?? {
      deals: [],
      fashion: [],
      electronics: [],
      automotive: [],
    }

    for (const key of CURATED_RAIL_PRIORITY) {
      const sectionProducts = sections[key]
      if (Array.isArray(sectionProducts) && sectionProducts.length > 0) {
        return { key, products: sectionProducts, href: CURATED_RAIL_HREF[key] }
      }
    }

    return null
  }, [curatedSections])

  // Homepage category navigation is drawer-based; avoid legacy `?tab=` URL state.
  const handleHeaderCategorySelect = useCallback(() => {}, [])

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
        showWishlistAction={false}
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

      <div className="pt-0 pb-4">
        <PromotedListingsStrip
          products={initialActivePromotedProducts}
          showHeader
          includePromoTile
          promotedCta={{
            href: "/search?promoted=true&sort=newest",
            eyebrow: tMobile("promoBannerEyebrow"),
            title: tMobile("promoBannerTitle"),
            subtitle: tMobile("promoBannerSubtitle"),
            actionLabel: tMobile("seeAll"),
          }}
          className="pt-2"
        />

        <section data-testid="home-section-discovery" className="pt-(--spacing-home-section-gap)">
          {products.length > 0 ? (
            <HomeDiscoveryControls
              sort={sort}
              nearby={nearby}
              cityLabel={cityLabel}
              onSortChange={setSort}
              onNearbyToggle={handleNearbyToggle}
              onNearbyConfigure={handleNearbyConfigure}
              className="mb-0"
            />
          ) : null}

          {products.length > 0 ? (
            <>
              <div className="grid grid-cols-2 gap-(--spacing-home-card-gap) px-(--spacing-home-inset) pt-1 pb-1">
                {products.map((product, index) => renderHomeCard(product, index))}
              </div>

              <div ref={loadMoreRef} data-testid="home-discovery-load-more" className="h-10" />
            </>
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
                className="inline-flex min-h-(--spacing-touch-md) items-center rounded-full border border-border-subtle bg-background px-2.5 text-xs font-semibold text-foreground transition-colors hover:bg-hover active:bg-active focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
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
