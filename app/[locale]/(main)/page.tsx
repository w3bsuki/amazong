import { Suspense } from "react"
import type { Metadata } from "next"
import { setRequestLocale } from "next-intl/server"
import { routing } from "@/i18n/routing"
import { StartSellingBanner } from "@/components/sections/start-selling-banner"
import { CategoryRail } from "@/components/shared/category-rail"
import { DesktopCategoryRail } from "@/components/desktop/desktop-category-rail"

import { DesktopFeaturedCategoryRail } from "@/components/desktop/desktop-featured-category-rail"

// Desktop-only components
import { DesktopHeroCTA } from "@/components/desktop/desktop-hero-cta"

// Async sections using cached data
import { 
  SignInCTA, 
  NewestListings, 
  NewestListingsSectionSkeleton,
} from "@/components/sections"

// New components
import { TabbedProductFeed, TabbedProductFeedSkeleton } from "@/components/sections/tabbed-product-feed"

// Local sections
import { PromoCards } from "./_components/promo-cards"
import { MoreWaysToShop } from "./_components/more-ways-to-shop"

// Local components
import { SignInCtaSkeleton } from "./_components/sign-in-cta-skeleton"

import { createStaticClient } from "@/lib/supabase/server"

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale)
  return {
    title: locale === 'bg' ? 'Начало' : 'Home',
    description: locale === 'bg' 
      ? 'Добре дошли в AMZN - вашият онлайн магазин за електроника, мода, дом и много други.'
      : 'Welcome to AMZN - your online store for electronics, fashion, home and much more.',
  };
}

// =============================================================================
// Main Page Component
// =============================================================================

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  const isBg = locale === "bg"

  // Fetch top categories for the quick pills
  const supabase = createStaticClient()
  const { data: categories } = await supabase
    .from('categories')
    .select('id, name, name_bg, slug')
    .is('parent_id', null)
    .order('display_order', { ascending: true })
    .limit(8)

  return (
    <main className="flex min-h-screen flex-col bg-background pb-20">
      {/* 
        MOBILE LAYOUT (optimized for conversion - Vinted/OLX pattern):
        1. Header (compact)
        2. Category Circles (quick navigation)
        3. CTA Banner (seller/buyer actions)
        4. Най-нови обяви (infinite scroll - THE MAIN CONTENT)
      */}
      <div className="w-full md:hidden space-y-1">
        {/* Category Circles - First thing after header */}
        <div className="pt-1">
          <CategoryRail locale={locale} />
        </div>
        
        {/* Start Selling CTA - Promote seller signup */}
        <StartSellingBanner locale={locale} />
        
        {/* Newest Listings with Infinite Scroll */}
        <Suspense fallback={<NewestListingsSectionSkeleton />}>
          <NewestListings categories={categories || []} />
        </Suspense>
        
        {/* Sign In CTA - At the end on mobile */}
        <div className="px-3 pb-4">
          <Suspense fallback={<SignInCtaSkeleton />}>
            <SignInCTA />
          </Suspense>
        </div>
      </div>

      {/* ================================================================
          DESKTOP: Clean Product-First Layout
          - Simplified Hero
          - No duplicate category rails
          - Main Product Feed
          ================================================================ */}
      <div className="hidden md:block w-full">
        
        {/* Hero Section - Compact Banner */}
        <div className="w-full bg-background pt-6 pb-8">
          <div className="container px-4 lg:px-6">
            <DesktopHeroCTA locale={locale} />
          </div>
        </div>

        {/* Main Product Feed - High signal, no tabs */}
        <div className="w-full bg-background pb-12">
          <div className="container px-4 lg:px-6">
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
          <div className="container px-4 lg:px-6">
            <Suspense fallback={<SignInCtaSkeleton />}>
              <SignInCTA />
            </Suspense>
          </div>
        </div>
      </div>
    </main>
  )
}
