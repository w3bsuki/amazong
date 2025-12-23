import { Suspense } from "react"
import type { Metadata } from "next"
import { setRequestLocale } from "next-intl/server"
import { routing } from "@/i18n/routing"
import { StartSellingBanner } from "@/components/sections/start-selling-banner"
import { MobileCategoryRail, DesktopCategoryRail } from "@/components/mobile/mobile-category-rail"

// Desktop-only components
import { DesktopHeroCTA } from "@/components/desktop/desktop-hero-cta"
import { TabbedProductFeed, TabbedProductFeedSkeleton } from "@/components/sections/tabbed-product-feed"

// Async sections using cached data
import { 
  SignInCTA, 
  NewestListings, 
  NewestListingsSectionSkeleton,
  CategoryCarousel,
} from "@/components/sections"

// Local components
import { SignInCtaSkeleton } from "./_components/sign-in-cta-skeleton"
import { PromoCards } from "./_components/promo-cards"
import { MoreWaysToShop } from "./_components/more-ways-to-shop"

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

  // Fetch top categories for the quick pills
  const supabase = createStaticClient()
  const { data: categories } = await supabase
    .from('categories')
    .select('id, name, name_bg, slug')
    .is('parent_id', null)
    .order('display_order', { ascending: true })
    .limit(8)

  return (
    <main className="flex min-h-screen flex-col items-center bg-background md:bg-muted pb-20">
      {/* 
        MOBILE LAYOUT (optimized for conversion - Vinted/OLX pattern):
        1. Header (compact)
        2. Category Circles (quick navigation)
        3. CTA Banner (seller/buyer actions)
        4. Най-нови обяви (infinite scroll - THE MAIN CONTENT)
        
        DESKTOP LAYOUT (10/10 UX - Tabbed Product Feed):
        1. Hero CTA Banner
        2. Category Circles
        3. Tabbed Product Feed (All/Newest/Promoted/Deals)
        4. Promo Cards
        5. More Ways to Shop
        6. Sign In CTA
      */}
      
      {/* ================================================================
          MOBILE: Ultra-compact layout for maximum information density
          ================================================================ */}
      <div className="w-full md:hidden space-y-1">
        {/* Category Circles - First thing after header */}
        <div className="pt-1">
          <MobileCategoryRail locale={locale} />
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
          DESKTOP: Optimized layout with proper spacing tokens
          - Uses consistent gap-6 (24px) between sections
          - Proper container padding (px-4 default, px-6 lg)
          - Semantic sectioning with proper ARIA
          ================================================================ */}
      <div className="hidden md:block w-full">
        {/* Hero CTA Banner - top section */}
        <div className="container px-4 lg:px-6 pt-5">
          <DesktopHeroCTA locale={locale} />
        </div>

        {/* Main Content Container - consistent vertical rhythm */}
        <div className="container px-4 lg:px-6 relative z-10 pb-8 space-y-6">
          {/* Category Navigation - Cards layout with chevrons */}
          <div className="pt-6">
            <DesktopCategoryRail locale={locale} />
          </div>

          {/* Main Product Feed - Single container with tabs */}
          <Suspense fallback={<TabbedProductFeedSkeleton />}>
            <TabbedProductFeed locale={locale} />
          </Suspense>

          {/* Category Sections - identical carousel containers */}
          <CategoryCarousel
            locale={locale}
            categorySlug="fashion"
            title={locale === "bg" ? "Мода" : "Fashion"}
          />
          <CategoryCarousel
            locale={locale}
            categorySlug="pets"
            title={locale === "bg" ? "Домашни любимци" : "Pets"}
          />
          <CategoryCarousel
            locale={locale}
            categorySlug="automotive"
            title={locale === "bg" ? "Автомобили" : "Automotive"}
          />
          <CategoryCarousel
            locale={locale}
            categorySlug="gaming"
            title={locale === "bg" ? "Гейминг" : "Gaming"}
          />
          <CategoryCarousel
            locale={locale}
            categorySlug="electronics"
            title={locale === "bg" ? "Електроника" : "Electronics"}
          />

          {/* Promo Cards Grid */}
          <PromoCards locale={locale} />

          {/* More Ways to Shop */}
          <MoreWaysToShop locale={locale} />

          {/* Sign In CTA */}
          <Suspense fallback={<SignInCtaSkeleton />}>
            <SignInCTA />
          </Suspense>
        </div>
      </div>
    </main>
  )
}

