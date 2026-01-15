import { Suspense } from "react"
import type { Metadata } from "next"
import { setRequestLocale } from "next-intl/server"
import { routing } from "@/i18n/routing"
import { MarketplaceHero } from "@/components/desktop/marketplace-hero"
import { TabbedProductFeed, TabbedProductFeedSkeleton } from "@/components/sections/tabbed-product-feed"
import { MobileHomeTabs } from "@/components/mobile/mobile-home-tabs"
import { getNewestProducts, toUI } from "@/lib/data/products"
import { getCategoryHierarchy } from "@/lib/data/categories"

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale)
  return {
    title: locale === 'bg' ? 'Начало' : 'Home',
    description: locale === 'bg'
      ? 'Добре дошли в Treido - вашият онлайн магазин за електроника, мода, дом и много други.'
      : 'Welcome to Treido - your online store for electronics, fashion, home and much more.',
  };
}

// =============================================================================
// Main Page Component
// =============================================================================

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  // Fetch categories with children for mobile subcategory circles.
  // L0 + L1 + L2 only (~3,400 categories, ~60KB gzipped).
  // L3 (~9,700 categories) are lazy-loaded when L2 is clicked.
  const categoriesWithChildren = await getCategoryHierarchy(null, 2)

  // Fetch initial products for mobile tabs
  const newestProducts = await getNewestProducts(24)
  const initialProducts = newestProducts.map(p => toUI(p))

  return (
    <main className="flex min-h-screen flex-col bg-background pb-20">
      {/* 
        MOBILE LAYOUT (Temu-style Tabs):
        1. Sticky Tabs (Categories)
        2. Subcategory Circles (when category selected)
        3. Product Feed (Infinite Scroll)
      */}
      <div className="w-full md:hidden">
        <Suspense fallback={<div className="h-screen w-full bg-background animate-pulse" />}>
          <MobileHomeTabs
            initialProducts={initialProducts.slice(0, 12)}
            initialCategories={categoriesWithChildren}
          />
        </Suspense>
      </div>

      {/* ================================================================
          DESKTOP: Clean Product-First Layout
          - Slim Hero Banner
          - Unified Discovery Section (Categories + Filters + Products)
          ================================================================ */}
      <div className="hidden md:block w-full">
        {/* Unified Discovery Container - Everything in one visual block */}
        <div className="w-full bg-background py-5">
          <div className="container space-y-5">
            {/* Product Feed with integrated hero + category circles + filters */}
            <Suspense fallback={<TabbedProductFeedSkeleton />}>
              <TabbedProductFeed
                locale={locale}
                categories={categoriesWithChildren}
                initialTab="newest"
                initialProducts={initialProducts}
              >
                <MarketplaceHero locale={locale} />
              </TabbedProductFeed>
            </Suspense>
          </div>
        </div>
      </div>
    </main>
  )
}
