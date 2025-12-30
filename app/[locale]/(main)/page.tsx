import { Suspense } from "react"
import type { Metadata } from "next"
import { setRequestLocale } from "next-intl/server"
import { routing } from "@/i18n/routing"
import { StartSellingBanner } from "@/components/sections/start-selling-banner"
import { MobileCategoryRail } from "@/components/shared/category-rail"
import { DesktopCategoryRail } from "@/components/desktop/desktop-category-rail"

// Desktop-only components
import { DesktopHeroCTA } from "@/components/desktop/desktop-hero-cta"
import { MarketplaceHero } from "@/components/desktop/marketplace-hero"

// Async sections using cached data
import { 
  NewestListings, 
  NewestListingsSectionSkeleton,
} from "@/components/sections"

import { SignInCTA } from "@/components/sections/sign-in-cta"

// New components
import { TabbedProductFeed, TabbedProductFeedSkeleton } from "@/components/sections/tabbed-product-feed"
import { MobileHomeTabs } from "@/components/mobile/mobile-home-tabs"

// Local sections
import { PromoCards } from "./_components/promo-cards"
import { MoreWaysToShop } from "./_components/more-ways-to-shop"

// Local components
import { SignInCtaSkeleton } from "./_components/sign-in-cta-skeleton"

import { createStaticClient } from "@/lib/supabase/server"
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

  // Fetch categories with L1 children using server-side cache
  // This prevents the client from making additional /api/categories calls
  const [categoriesWithChildren, newestProducts] = await Promise.all([
    getCategoryHierarchy(null, 2), // depth=2 for L0+L1+L2
    getNewestProducts(12)
  ])
  
  // Shallow categories for desktop hero (just need slugs/names)
  const categories = categoriesWithChildren.map(c => ({
    id: c.id,
    name: c.name,
    name_bg: c.name_bg,
    slug: c.slug
  }))

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
        <MobileHomeTabs 
          initialProducts={initialProducts} 
          initialCategories={categoriesWithChildren} 
        />
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
              categories={categories || []}
            />
            
            {/* Category Rail - Clean & Aligned */}
            <div className="mt-8">
              <DesktopCategoryRail
                locale={locale}
                showTitle={false}
                className="max-w-full"
              />
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
