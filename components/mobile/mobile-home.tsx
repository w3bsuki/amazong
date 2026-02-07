"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { PageShell } from "@/components/shared/page-shell"
import { MobileSearchOverlay } from "@/components/shared/search/mobile-search-overlay"
import { ProductCard } from "@/components/shared/product/product-card"
import { useHeader } from "@/components/providers/header-context"
import type { UIProduct } from "@/lib/types/products"
import type { CategoryTreeNode } from "@/lib/category-tree"
import { useTranslations } from "next-intl"
import { Link } from "@/i18n/routing"
import { CaretRight, Lightning } from "@phosphor-icons/react"
import { HomeSectionHeader } from "@/components/mobile/home-section-header"

import { CategoryCirclesSimple } from "@/components/mobile/category-nav"
import { PromotedListingsStrip } from "@/components/shared/promoted-listings-strip"
import { HomeStickyCategoryPills } from "@/components/mobile/home-sticky-category-pills"

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

interface HomeCardConfig {
  appearance: "card" | "tile"
  media: "square" | "portrait" | "landscape"
  titleLines: 1 | 2
  showCategoryBadge: boolean
  radius: "xl" | "2xl"
  maxOverlayBadges: number
}

const CURATED_RAIL_PRIORITY: CuratedRailKey[] = ["fashion", "electronics", "automotive", "deals"]

const CURATED_RAIL_HREF: Record<CuratedRailKey, string> = {
  fashion: "/categories/fashion",
  electronics: "/categories/electronics",
  automotive: "/categories/automotive",
  deals: "/todays-deals",
}

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
  const [showStickyCategoryPills, setShowStickyCategoryPills] = useState(false)
  const categoryCirclesRef = useRef<HTMLDivElement | null>(null)

  // Homepage category navigation is drawer-based; avoid legacy `?tab=` URL state.
  const handleHeaderCategorySelect = useCallback((_slug: string) => {}, [])

  const activePromotedProducts = useMemo(() => {
    const now = Date.now()
    return (promotedProducts ?? []).filter((p) => {
      if (!p.isBoosted) return false
      if (!p.boostExpiresAt) return false
      const expiresAt = Date.parse(p.boostExpiresAt)
      return Number.isFinite(expiresAt) && expiresAt > now
    })
  }, [promotedProducts])

  const promotedRail = useMemo(() => activePromotedProducts.slice(0, 10), [activePromotedProducts])

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

  const renderHomeCard = useCallback(
    (product: UIProduct, index: number, config: HomeCardConfig) => (
      <ProductCard
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
        sellerEmailVerified={Boolean(product.sellerEmailVerified)}
        sellerPhoneVerified={Boolean(product.sellerPhoneVerified)}
        sellerIdVerified={Boolean(product.sellerIdVerified)}
        {...(product.condition ? { condition: product.condition } : {})}
        {...(product.brand ? { brand: product.brand } : {})}
        {...(product.categorySlug ? { categorySlug: product.categorySlug } : {})}
        {...(product.categoryRootSlug ? { categoryRootSlug: product.categoryRootSlug } : {})}
        {...(product.categoryPath ? { categoryPath: product.categoryPath } : {})}
        {...(product.make ? { make: product.make } : {})}
        {...(product.model ? { model: product.model } : {})}
        {...(product.year ? { year: product.year } : {})}
        {...(product.location ? { location: product.location } : {})}
        {...(product.attributes ? { attributes: product.attributes } : {})}
        appearance={config.appearance}
        media={config.media}
        density="compact"
        titleLines={config.titleLines}
        uiVariant="home"
        showCategoryBadge={config.showCategoryBadge}
        radius={config.radius}
        maxOverlayBadges={config.maxOverlayBadges}
      />
    ),
    []
  )

  // Get header context to provide dynamic state to layout's header
  const { setHomepageHeader } = useHeader()

  // Provide homepage header state to layout via context
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
      // Show only after circles are fully out of viewport.
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

  return (
    <PageShell variant="default" className="pb-4">
      {/* Search Overlay */}
      <MobileSearchOverlay
        hideDefaultTrigger
        externalOpen={searchOpen}
        onOpenChange={setSearchOpen}
      />

      {/* Header is rendered by layout - passes variant="homepage" with category pills */}
      <div
        ref={categoryCirclesRef}
        data-testid="home-category-circles"
        className="bg-background border-b border-border-subtle"
      >
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
      />

      {/* Main Content */}
      <div className="pt-0 pb-4 space-y-(--spacing-home-section-gap)">
        <section
          data-testid="home-section-promoted-banner"
          className="px-(--spacing-home-inset) pt-(--spacing-home-section-gap)"
        >
          <div className="rounded-2xl border border-border-subtle bg-foreground px-3.5 py-3 shadow-2xs">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0 flex items-start gap-2.5">
                <span className="mt-0.5 inline-flex size-(--control-xs) shrink-0 items-center justify-center rounded-full bg-background text-foreground">
                  <Lightning size={12} weight="fill" aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <p className="text-2xs font-medium text-background">
                    {tMobile("promoBannerEyebrow")}
                  </p>
                  <p className="truncate text-sm font-semibold text-background">
                    {tMobile("promoBannerTitle")}
                  </p>
                  <p className="truncate text-xs text-background">
                    {tMobile("promoBannerSubtitle")}
                  </p>
                </div>
              </div>
              <Link
                href="/search?promoted=true&sort=newest"
                className="inline-flex min-h-(--spacing-touch-sm) shrink-0 items-center gap-1 rounded-full border border-background bg-background px-2.5 text-xs font-semibold text-foreground transition-colors hover:bg-background active:bg-background"
              >
                {tMobile("promoBannerCta")}
                <CaretRight size={12} weight="bold" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>

        {promotedRail.length > 0 && (
          <PromotedListingsStrip
            products={promotedRail}
            layout="strip"
            maxItems={10}
            showHeader={false}
            showQuickScopes={false}
          />
        )}

        {initialProducts.length > 0 && (
          <section data-testid="home-section-newest" className="pt-(--spacing-home-section-gap)">
            <div
              data-testid="home-section-for-you-banner"
              className="px-(--spacing-home-inset)"
            >
              <div className="rounded-2xl border border-border-subtle bg-background px-3.5 py-3 shadow-2xs">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0 flex items-start gap-2.5">
                    <span className="mt-0.5 inline-flex size-(--control-xs) shrink-0 items-center justify-center rounded-full bg-foreground text-background">
                      <Lightning size={12} weight="fill" aria-hidden="true" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-2xs font-medium text-muted-foreground">
                        {tMobile("forYouBannerEyebrow")}
                      </p>
                      <p className="truncate text-sm font-semibold text-foreground">
                        {tMobile("forYouBannerTitle")}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {tMobile("forYouBannerSubtitle")}
                      </p>
                    </div>
                  </div>
                  <Link
                    href="/search?sort=newest"
                    className="inline-flex min-h-(--spacing-touch-sm) shrink-0 items-center gap-1 rounded-full border border-border-subtle bg-background px-2.5 text-xs font-semibold text-foreground transition-colors hover:bg-hover active:bg-active"
                  >
                    {tMobile("forYouBannerCta")}
                    <CaretRight size={12} weight="bold" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </div>

            <div className="mt-2 px-(--spacing-home-inset)">
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                <Link
                  href="/search?sort=newest"
                  className="inline-flex min-h-(--spacing-touch-sm) shrink-0 items-center rounded-full border border-foreground bg-foreground px-3 text-xs font-semibold text-background transition-colors hover:bg-foreground active:bg-foreground"
                >
                  {tMobile("sort.newest")}
                </Link>
                <Link
                  href="/search?sort=price-asc"
                  className="inline-flex min-h-(--spacing-touch-sm) shrink-0 items-center rounded-full border border-border-subtle bg-background px-3 text-xs font-medium text-muted-foreground transition-colors hover:bg-hover hover:text-foreground active:bg-active active:text-foreground"
                >
                  {tMobile("sort.priceLow")}
                </Link>
                <Link
                  href="/search?sort=price-desc"
                  className="inline-flex min-h-(--spacing-touch-sm) shrink-0 items-center rounded-full border border-border-subtle bg-background px-3 text-xs font-medium text-muted-foreground transition-colors hover:bg-hover hover:text-foreground active:bg-active active:text-foreground"
                >
                  {tMobile("sort.priceHigh")}
                </Link>
                <Link
                  href="/search?nearby=true"
                  className="inline-flex min-h-(--spacing-touch-sm) shrink-0 items-center rounded-full border border-border-subtle bg-background px-3 text-xs font-medium text-muted-foreground transition-colors hover:bg-hover hover:text-foreground active:bg-active active:text-foreground"
                >
                  {tMobile("sort.nearby")}
                </Link>
              </div>
            </div>

            <div className="mt-2 grid grid-cols-2 gap-(--spacing-home-card-gap) px-(--spacing-home-inset) pb-1">
              {initialProducts.map((product, index) =>
                renderHomeCard(product, index, {
                  appearance: "card",
                  media: "portrait",
                  titleLines: 2,
                  showCategoryBadge: true,
                  radius: "2xl",
                  maxOverlayBadges: 2,
                })
              )}
            </div>
          </section>
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
                    className="w-(--spacing-home-curated-card-w) shrink-0 snap-start"
                  >
                    {renderHomeCard(product, index, {
                      appearance: "card",
                      media: "landscape",
                      titleLines: 2,
                      showCategoryBadge: true,
                      radius: "2xl",
                      maxOverlayBadges: 2,
                    })}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Final CTA: Browse all listings */}
        <section className="px-(--spacing-home-inset) pt-1">
          <Link
            href="/search?sort=newest"
            className="inline-flex min-h-(--spacing-touch-md) w-full items-center justify-between gap-3 rounded-xl border border-border-subtle bg-background px-4 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-hover active:bg-active"
          >
            <span className="min-w-0 truncate">{tMobile("allListings")}</span>
            <CaretRight size={18} weight="bold" className="text-muted-foreground shrink-0" aria-hidden="true" />
          </Link>
        </section>
      </div>
    </PageShell>
  )
}
