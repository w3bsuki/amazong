"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { PageShell } from "../../_components/page-shell"
import { MobileSearchOverlay } from "../../_components/search/mobile-search-overlay"
import { MobileProductCard } from "@/components/shared/product/card/mobile"
import { useHeader } from "@/components/providers/header-context"
import type { UIProduct } from "@/lib/types/products"
import type { CategoryTreeNode } from "@/lib/category-tree"
import { useTranslations } from "next-intl"
import { Link } from "@/i18n/routing"
import { CaretRight } from "@phosphor-icons/react"
import { HomeSectionHeader } from "./mobile/home-section-header"
import { cn } from "@/lib/utils"

import { CategoryCirclesSimple } from "@/components/mobile/category-nav"
import { PromotedListingsStrip } from "./mobile/promoted-listings-strip"
import { HomeStickyCategoryPills } from "./mobile/home-sticky-category-pills"

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

interface HomeBannerConfig {
  testId: string
  href: string
  title: string
  cta: string
  variant: "promoted" | "forYou"
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

  const renderHomeBanner = useCallback(
    ({ testId, href, title, cta, variant }: HomeBannerConfig) => (
      <div
        data-testid={testId}
        className={cn(
          "w-full border-y",
          variant === "promoted"
            ? "border-foreground bg-foreground"
            : "border-border-subtle bg-surface-subtle"
        )}
      >
        <Link
          href={href}
          className={cn(
            "group block tap-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring",
            variant === "promoted"
              ? "hover:bg-foreground active:opacity-95"
              : "hover:bg-hover active:bg-active"
          )}
        >
          <div className="flex min-h-(--control-primary) items-center gap-3 px-(--spacing-home-inset)">
            <span
              aria-hidden="true"
              className={cn(
                "h-5 w-0.5 shrink-0 rounded-full",
                variant === "promoted" ? "bg-background/75" : "bg-foreground/35"
              )}
            />
            <p
              className={cn(
                "min-w-0 flex-1 truncate text-base font-semibold leading-tight tracking-tight",
                variant === "promoted" ? "text-background" : "text-foreground"
              )}
            >
              {title}
            </p>
            <span
              className={cn(
                "inline-flex shrink-0 items-center text-sm font-semibold transition-colors",
                variant === "promoted"
                  ? "text-background/90 group-hover:text-background"
                  : "text-muted-foreground group-hover:text-foreground"
              )}
            >
              <span>{cta}</span>
            </span>
          </div>
        </Link>
      </div>
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
        className="bg-background"
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
      <div className="pt-0 pb-4 space-y-2">
        <section
          data-testid="home-section-promoted-banner"
          className="pt-1.5"
        >
          {renderHomeBanner({
            testId: "home-section-promoted-banner-link",
            href: "/search?promoted=true&sort=newest",
            title: tMobile("promoBannerTitle"),
            cta: tMobile("promoBannerCta"),
            variant: "promoted",
          })}
        </section>

        {promotedRail.length > 0 && (
          <PromotedListingsStrip
            products={promotedRail}
            layout="strip"
            maxItems={10}
            showHeader={false}
            showQuickScopes={false}
            className="pt-1.5"
          />
        )}

        {initialProducts.length > 0 && (
          <section data-testid="home-section-newest" className="pt-1">
            {renderHomeBanner({
              testId: "home-section-for-you-banner",
              href: "/search?sort=newest",
              title: tMobile("forYouBannerTitle"),
              cta: tMobile("forYouBannerCta"),
              variant: "forYou",
            })}

            <div className="mt-2 grid grid-cols-2 gap-(--spacing-home-card-gap) px-(--spacing-home-inset) pb-1">
              {initialProducts.map((product, index) =>
                renderHomeCard(product, index)
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
                    className="w-(--spacing-home-card-column-w) shrink-0 snap-start"
                  >
                    {renderHomeCard(product, index)}
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

