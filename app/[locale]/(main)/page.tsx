import { Suspense } from "react"
import { Link } from "@/i18n/routing"
import Image from "next/image"
import { CategoryCircles } from "@/components/category/category-circles"
import { StartSellingBanner } from "@/components/sections/start-selling-banner"
import type { Metadata } from 'next'
import { PromoCard } from "@/components/promo/promo-card"
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

// Skeleton fallbacks
import { Skeleton } from "@/components/ui/skeleton"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === 'bg' ? 'Начало' : 'Home',
    description: locale === 'bg' 
      ? 'Добре дошли в AMZN - вашият онлайн магазин за електроника, мода, дом и много други.'
      : 'Welcome to AMZN - your online store for electronics, fashion, home and much more.',
  };
}

// =============================================================================
// Static Components - No data fetching, rendered immediately
// =============================================================================

function PromoCards({ locale }: { locale: string }) {
  return (
    <div className="flex gap-2 overflow-x-auto snap-x snap-mandatory pb-2 px-3 mt-4 sm:mt-6 sm:px-0 sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:gap-3 sm:overflow-visible sm:pb-0 no-scrollbar scroll-pl-3">
      <div className="w-[65%] min-w-[65%] shrink-0 snap-start sm:w-auto sm:min-w-0">
        <PromoCard
          bgImage="https://images.unsplash.com/photo-1491933382434-500287f9b54b?w=800&q=80"
          dealText={locale === "bg" ? "Спести до" : "Save up to"}
          highlight="$200"
          subtitle={locale === "bg" ? "Apple устройства*" : "Apple devices*"}
          href="/search?category=electronics&brand=apple"
        />
      </div>
      <div className="w-[65%] min-w-[65%] shrink-0 snap-start sm:w-auto sm:min-w-0">
        <PromoCard
          bgImage="https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=800&q=80"
          dealText={locale === "bg" ? "До" : "Up to"}
          highlight="50%"
          subtitle={locale === "bg" ? "избрани играчки*" : "select toys*"}
          href="/todays-deals?category=toys"
          badge={locale === "bg" ? "🔥 Гореща" : "🔥 Hot"}
        />
      </div>
      <div className="w-[65%] min-w-[65%] shrink-0 snap-start sm:w-auto sm:min-w-0">
        <PromoCard
          bgImage="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80"
          dealText={locale === "bg" ? "До" : "Up to"}
          highlight="40%"
          subtitle={locale === "bg" ? "електроника*" : "electronics*"}
          href="/search?category=electronics"
        />
      </div>
      <div className="w-[65%] min-w-[65%] shrink-0 snap-start sm:w-auto sm:min-w-0 mr-1 sm:mr-0">
        <PromoCard
          bgImage="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80"
          dealText={locale === "bg" ? "До" : "Up to"}
          highlight="30%"
          subtitle={locale === "bg" ? "мода*" : "fashion*"}
          href="/search?category=fashion"
        />
      </div>
    </div>
  )
}

function MoreWaysToShop({ locale }: { locale: string }) {
  const cards = [
    {
      href: "/search?sort=newest",
      image: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=400&q=80",
      title: locale === "bg" ? "Нови продукти" : "New Arrivals",
      badge: locale === "bg" ? "Ново" : "New",
    },
    {
      href: "/search?category=fashion",
      image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&q=80",
      title: locale === "bg" ? "Мода" : "Fashion",
    },
    {
      href: "/gift-cards",
      image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=400&q=80",
      title: locale === "bg" ? "Подаръци" : "Gifts",
    },
    {
      href: "/search?category=home",
      image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=400&q=80",
      title: locale === "bg" ? "За дома" : "Home",
    },
  ]

  return (
    <div className="mt-1.5 px-3 sm:mt-0 sm:px-0">
      <h2 className="text-base font-semibold text-foreground mb-1.5 sm:text-lg sm:mb-3">
        {locale === "bg" ? "Още начини за пазаруване" : "More ways to shop"}
      </h2>
      
      {/* Mobile: 2x2 grid | Desktop: 4-col grid */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-4">
        {cards.map((card) => (
          <Link 
            key={card.href}
            href={card.href} 
            className="group relative aspect-4/3 rounded-lg overflow-hidden"
          >
            <Image 
              src={card.image} 
              alt={card.title}
              fill
              className="absolute inset-0 size-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/70 to-black/10" />
            {card.badge && (
              <span className="absolute top-2 left-2 bg-white/20 backdrop-blur-sm text-white text-[10px] font-medium px-1.5 py-0.5 rounded-full">
                {card.badge}
              </span>
            )}
            <div className="absolute bottom-2 left-2 right-2">
              <h3 className="text-sm font-semibold text-white line-clamp-1 group-hover:underline">
                {card.title}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

// Minimal skeleton for SignIn CTA
function SignInCtaSkeleton() {
  return (
    <div className="bg-primary/50 rounded-lg p-4 sm:p-6">
      <Skeleton className="h-6 w-64 bg-primary-foreground/20 mb-2" />
      <Skeleton className="h-4 w-48 bg-primary-foreground/20" />
    </div>
  )
}

// =============================================================================
// Main Page Component
// =============================================================================

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params

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
          <NewestListings />
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

