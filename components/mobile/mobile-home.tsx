"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { PageShell } from "@/components/shared/page-shell"
import { MobileSearchOverlay } from "@/components/shared/search/mobile-search-overlay"
import { ProductCard, ProductGrid } from "@/components/shared/product/product-card"
import { useHeader } from "@/components/providers/header-context"
import type { UIProduct } from "@/lib/types/products"
import type { CategoryTreeNode } from "@/lib/category-tree"
import { useTranslations } from "next-intl"
import { Link } from "@/i18n/routing"
import { CaretRight } from "@phosphor-icons/react"

// New drawer-based navigation
import {
  CategoryDrawerProvider,
  CategoryCirclesSimple,
} from "@/components/mobile/category-nav"
import { CategoryBrowseDrawer } from "@/components/mobile/drawers/category-browse-drawer"
import { PromotedListingsStrip } from "@/components/shared/promoted-listings-strip"

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

// =============================================================================
// Fetch Children Helper (for lazy-loading subcategories)
// =============================================================================

async function fetchCategoryChildren(parentId: string): Promise<CategoryTreeNode[]> {
  try {
    const res = await fetch(`/api/categories/${parentId}/children`)
    if (!res.ok) return []
    const data = await res.json()
    return data.children ?? []
  } catch {
    return []
  }
}

// =============================================================================
// Main Component
// =============================================================================

export function MobileHome({
  initialProducts,
  promotedProducts,
  initialCategories,
  locale,
}: MobileHomeProps) {
  const t = useTranslations("Home")
  const tMobile = useTranslations("Home.mobile")
  const tTabs = useTranslations("TabbedProductFeed.tabs")
  const [searchOpen, setSearchOpen] = useState(false)

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

  return (
    <CategoryDrawerProvider rootCategories={initialCategories}>
      <PageShell variant="default" className="pb-4">
        {/* Search Overlay */}
        <MobileSearchOverlay
          hideDefaultTrigger
          externalOpen={searchOpen}
          onOpenChange={setSearchOpen}
        />

        {/* Header is rendered by layout - passes variant="homepage" with category pills */}
        <div className="bg-background border-b border-border-subtle">
          <CategoryCirclesSimple
            categories={initialCategories}
            locale={locale}
          />
        </div>

         {/* Main Content */}
       <div className="pb-4 space-y-4">
        {/* Curated carousels (no sorting UI on Home) */}
        {activePromotedProducts.length > 0 && (
          <PromotedListingsStrip products={activePromotedProducts} />
        )}

        {initialProducts.length > 0 && (
          <section className="pt-1">
            <div className="mb-3 flex items-center justify-between gap-2 px-inset-md">
              <h2 className="min-w-0 truncate text-base font-semibold tracking-tight text-foreground">
                {tTabs("newest")}
              </h2>
              <Link
                href="/search?sort=newest"
                className="inline-flex items-center gap-1 min-h-(--spacing-touch-md) px-1.5 -mr-1 rounded-md text-xs font-medium text-muted-foreground hover:text-foreground active:bg-active active:text-foreground transition-colors"
              >
                {t("sections.seeAll")}
              </Link>
            </div>

            <ProductGrid density="compact" className="px-inset-md pb-2">
              {initialProducts.map((product, index) => (
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
                  {...(product.freeShipping ? { freeShipping: true } : {})}
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
                  appearance="tile"
                  media="square"
                  density="compact"
                  uiVariant="home"
                  radius="xl"
                />
              ))}
            </ProductGrid>
          </section>
        )}

        {/* Final CTA: Browse all listings */}
        <section className="px-inset-md py-3">
          <Link
            href="/search?sort=newest"
            className="inline-flex w-full items-center justify-between gap-3 rounded-xl bg-surface-subtle px-4 py-3 text-sm font-semibold text-foreground border border-border-subtle active:bg-active transition-colors"
          >
            <span className="min-w-0 truncate">{tMobile("allListings")}</span>
            <CaretRight size={18} weight="bold" className="text-muted-foreground shrink-0" aria-hidden="true" />
          </Link>
        </section>
      </div>
        
      {/* Category Browse Drawer - Native app-style category navigation */}
      <CategoryBrowseDrawer
        locale={locale}
        fetchChildren={fetchCategoryChildren}
      />
    </PageShell>
    </CategoryDrawerProvider>
  )
}
