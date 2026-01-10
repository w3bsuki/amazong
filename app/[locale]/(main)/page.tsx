import { Suspense } from "react"
import type { Metadata } from "next"
import { setRequestLocale } from "next-intl/server"
import { routing } from "@/i18n/routing"
import { DesktopCategoryRail } from "@/components/desktop/desktop-category-rail"

// Desktop-only components
import { MarketplaceHero } from "@/components/desktop/marketplace-hero"

import { SignInCTA } from "@/components/sections/sign-in-cta"

// New components
import { TabbedProductFeed, TabbedProductFeedSkeleton } from "@/components/sections/tabbed-product-feed"
import { MobileHomeTabs } from "@/components/mobile/mobile-home-tabs"
import { TrustBar } from "@/components/shared/trust-bar"

// Local sections
import { PromoCards } from "./_components/promo-cards"
import { MoreWaysToShop } from "./_components/more-ways-to-shop"

// Local components
import { SignInCtaSkeleton } from "./_components/sign-in-cta-skeleton"
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
  const newestProducts = await getNewestProducts(12)
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
            initialProducts={initialProducts}
            initialCategories={categoriesWithChildren}
          />
        </Suspense>
      </div>

      {/* ================================================================
          DESKTOP: Clean Product-First Layout
          - Integrated Hero with Category Quick Entry
          - Main Product Feed
          ================================================================ */}
      <div className="hidden md:block w-full">

        {/* Hero Section - Integrated Banner */}
        <div className="w-full bg-background pt-6 pb-8">
          <div className="container">
            <MarketplaceHero
              locale={locale}
              categories={categoriesWithChildren}
            />

            <div className="mt-8 rounded-md border bg-card p-4 shadow-sm dark:bg-card">
              <DesktopCategoryRail
                locale={locale}
                categories={categoriesWithChildren}
                showTitle={false}
                className="max-w-full"
              />
            </div>

            {/* Trust Bar - Below hero, above product feed */}
            <div className="mt-6">
              <TrustBar locale={locale} variant="desktop" />
            </div>
          </div>
        </div>

        {/* Main Product Feed - High signal, no tabs */}
        <div className="w-full bg-background pb-12">
          <div className="container">
            <Suspense fallback={<TabbedProductFeedSkeleton />}>
              <TabbedProductFeed locale={locale} />
            </Suspense>

            {/* Promo + discovery */}
            <div className="mt-16">
              <PromoCards locale={locale} />
            </div>
            <MoreWaysToShop locale={locale} />
          </div>
        </div>

        {/* Sign In CTA */}
        <div className="w-full bg-background pb-20">
          <div className="container">
            <Suspense fallback={<SignInCtaSkeleton />}>
              <SignInCTA />
            </Suspense>
          </div>
        </div>
      </div>
    </main>
  )
}
