import { Suspense } from "react"
import { HeroCarousel } from "@/components/hero-carousel"
import { PromoBannerStrip } from "@/components/promo-banner-strip"
import { Link } from "@/i18n/routing"
import { CategoryCircles } from "@/components/category-circles"
import type { Metadata } from 'next'
import { PromoCard } from "@/components/promo-card"
import { getTranslations } from "next-intl/server"

// Async sections using cached data
import { TrendingSection, FeaturedSection, DealsWrapper, SignInCTA } from "@/components/sections"

// Skeleton fallbacks
import { 
  TrendingSectionSkeleton, 
  DealsSectionSkeleton, 
  FeaturedSectionSkeleton 
} from "@/components/skeletons"
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

function CategoryCards({ locale, t }: { locale: string; t: (key: string) => string }) {
  return (
    <div className="pt-2 pb-1">
      {/* Section Header */}
      <div className="flex items-center justify-between px-3 mb-1.5 md:px-4 md:mb-2">
        <h2 className="text-sm font-semibold text-foreground md:text-base">
          {locale === "bg" ? "Разгледай по категория" : "Shop by Department"}
        </h2>
        <Link 
          href="/categories" 
          className="text-xs text-brand-blue hover:underline md:text-sm"
        >
          {locale === "bg" ? "Виж всички" : "See all"}
        </Link>
      </div>
      
      {/* Scrollable container on mobile, grid on desktop */}
      <div className="flex gap-2.5 overflow-x-auto snap-x snap-mandatory pb-2 px-3 no-scrollbar scroll-pl-3 md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-4 md:overflow-visible md:pb-0 md:px-4">
        
        {/* Computers Card */}
        <div className="w-[70%] min-w-[70%] sm:w-[48%] sm:min-w-[48%] shrink-0 snap-start md:w-auto md:min-w-0 bg-card rounded-lg p-3 border border-border/50 md:border-border md:p-3 shadow-sm">
          <h3 className="text-sm sm:text-base font-semibold text-foreground mb-2 sm:mb-2.5">
            {locale === "bg" ? "Компютри" : "Computers"}
          </h3>
          <div className="grid grid-cols-2 gap-2 md:gap-2">
            <Link href="/search?category=laptops" className="group">
              <div className="aspect-square rounded-lg overflow-hidden bg-secondary">
                <img src="https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300&q=80" alt="Laptops" className="size-full object-cover" />
              </div>
              <span className="text-xs text-foreground group-hover:text-link group-hover:underline block mt-1.5 font-medium">{locale === "bg" ? "Лаптопи" : "Laptops"}</span>
            </Link>
            <Link href="/search?category=desktops" className="group">
              <div className="aspect-square rounded-lg overflow-hidden bg-secondary">
                <img src="https://images.unsplash.com/photo-1593062096033-9a26b09da705?w=300&q=80" alt="Desktops" className="size-full object-cover" />
              </div>
              <span className="text-xs text-foreground group-hover:text-link group-hover:underline block mt-1.5 font-medium">{locale === "bg" ? "Настолни" : "Desktops"}</span>
            </Link>
            <Link href="/search?category=monitors" className="group">
              <div className="aspect-square rounded-lg overflow-hidden bg-secondary">
                <img src="https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=300&q=80" alt="Monitors" className="size-full object-cover" />
              </div>
              <span className="text-xs text-foreground group-hover:text-link group-hover:underline block mt-1.5 font-medium">{locale === "bg" ? "Монитори" : "Monitors"}</span>
            </Link>
            <Link href="/search?category=accessories" className="group">
              <div className="aspect-square rounded-lg overflow-hidden bg-secondary">
                <img src="https://images.unsplash.com/photo-1625723044792-44de16ccb4e9?w=300&q=80" alt="Accessories" className="size-full object-cover" />
              </div>
              <span className="text-xs text-foreground group-hover:text-link group-hover:underline block mt-1.5 font-medium">{locale === "bg" ? "Аксесоари" : "Accessories"}</span>
            </Link>
          </div>
          <Link href="/search?category=computers" className="text-brand-blue hover:underline text-xs mt-2 sm:mt-2.5 min-h-8 sm:min-h-10 flex items-center font-medium">
            {t('sections.seeMore')}
          </Link>
        </div>

        {/* Home & Kitchen Card */}
        <div className="w-[70%] min-w-[70%] sm:w-[48%] sm:min-w-[48%] shrink-0 snap-start md:w-auto md:min-w-0 bg-card rounded-lg p-3 border border-border/50 md:border-border md:p-3 shadow-sm">
          <h3 className="text-sm sm:text-base font-semibold text-foreground mb-2 sm:mb-2.5">
            {locale === "bg" ? "Дом и кухня" : "Home"}
          </h3>
          <div className="grid grid-cols-2 gap-2 md:gap-2">
            <Link href="/search?category=kitchen" className="group">
              <div className="aspect-square rounded-lg overflow-hidden bg-secondary">
                <img src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&q=80" alt="Kitchen" className="size-full object-cover" />
              </div>
              <span className="text-xs text-foreground group-hover:text-link group-hover:underline block mt-1.5 font-medium">{locale === "bg" ? "Кухня" : "Kitchen"}</span>
            </Link>
            <Link href="/search?category=furniture" className="group">
              <div className="aspect-square rounded-lg overflow-hidden bg-secondary">
                <img src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=300&q=80" alt="Furniture" className="size-full object-cover" />
              </div>
              <span className="text-xs text-foreground group-hover:text-link group-hover:underline block mt-1.5 font-medium">{locale === "bg" ? "Мебели" : "Furniture"}</span>
            </Link>
            <Link href="/search?category=bedding" className="group">
              <div className="aspect-square rounded-lg overflow-hidden bg-secondary">
                <img src="https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=300&q=80" alt="Bedding" className="size-full object-cover" />
              </div>
              <span className="text-xs text-foreground group-hover:text-link group-hover:underline block mt-1.5 font-medium">{locale === "bg" ? "Спално бельо" : "Bedding"}</span>
            </Link>
            <Link href="/search?category=decor" className="group">
              <div className="aspect-square rounded-lg overflow-hidden bg-secondary">
                <img src="https://images.unsplash.com/photo-1513694203232-719a280e022f?w=300&q=80" alt="Decor" className="size-full object-cover" />
              </div>
              <span className="text-xs text-foreground group-hover:text-link group-hover:underline block mt-1.5 font-medium">{locale === "bg" ? "Декорация" : "Decor"}</span>
            </Link>
          </div>
          <Link href="/search?category=home" className="text-brand-blue hover:underline text-xs mt-2 sm:mt-2.5 min-h-8 sm:min-h-10 flex items-center font-medium">
            {t('sections.seeMore')}
          </Link>
        </div>

        {/* Fashion Card */}
        <div className="w-[70%] min-w-[70%] sm:w-[48%] sm:min-w-[48%] shrink-0 snap-start md:w-auto md:min-w-0 bg-card rounded-lg p-3 border border-border/50 md:border-border md:p-3 shadow-sm">
          <h3 className="text-sm sm:text-base font-semibold text-foreground mb-2 sm:mb-2.5">
            {locale === "bg" ? "Мода" : "Fashion"}
          </h3>
          <div className="grid grid-cols-2 gap-2 md:gap-2">
            <Link href="/search?category=women" className="group">
              <div className="aspect-square rounded-lg overflow-hidden bg-secondary">
                <img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=300&q=80" alt="Women" className="size-full object-cover" />
              </div>
              <span className="text-xs text-foreground group-hover:text-link group-hover:underline block mt-1.5 font-medium">{locale === "bg" ? "Дамски" : "Women"}</span>
            </Link>
            <Link href="/search?category=men" className="group">
              <div className="aspect-square rounded-lg overflow-hidden bg-secondary">
                <img src="https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=300&q=80" alt="Men" className="size-full object-cover" />
              </div>
              <span className="text-xs text-foreground group-hover:text-link group-hover:underline block mt-1.5 font-medium">{locale === "bg" ? "Мъжки" : "Men"}</span>
            </Link>
            <Link href="/search?category=shoes" className="group">
              <div className="aspect-square rounded-lg overflow-hidden bg-secondary">
                <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&q=80" alt="Shoes" className="size-full object-cover" />
              </div>
              <span className="text-xs text-foreground group-hover:text-link group-hover:underline block mt-1.5 font-medium">{locale === "bg" ? "Обувки" : "Shoes"}</span>
            </Link>
            <Link href="/search?category=bags" className="group">
              <div className="aspect-square rounded-lg overflow-hidden bg-secondary">
                <img src="https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=300&q=80" alt="Bags" className="size-full object-cover" />
              </div>
              <span className="text-xs text-foreground group-hover:text-link group-hover:underline block mt-1.5 font-medium">{locale === "bg" ? "Чанти" : "Bags"}</span>
            </Link>
          </div>
          <Link href="/search?category=fashion" className="text-brand-blue hover:underline text-xs mt-2 sm:mt-2.5 min-h-8 sm:min-h-10 flex items-center font-medium">
            {t('sections.seeMore')}
          </Link>
        </div>

        {/* Beauty Card */}
        <div className="w-[70%] min-w-[70%] sm:w-[48%] sm:min-w-[48%] shrink-0 snap-start md:w-auto md:min-w-0 bg-card rounded-lg p-3 border border-border/50 md:border-border md:p-3 shadow-sm mr-3 md:mr-0">
          <h3 className="text-sm sm:text-base font-semibold text-foreground mb-2 sm:mb-2.5">
            {locale === "bg" ? "Красота" : "Beauty"}
          </h3>
          <div className="grid grid-cols-2 gap-2 md:gap-2">
            <Link href="/search?category=skincare" className="group">
              <div className="aspect-square rounded-lg overflow-hidden bg-secondary">
                <img src="https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=300&q=80" alt="Skincare" className="size-full object-cover" />
              </div>
              <span className="text-xs text-foreground group-hover:text-link group-hover:underline block mt-1.5 font-medium">{locale === "bg" ? "Грижа" : "Skincare"}</span>
            </Link>
            <Link href="/search?category=makeup" className="group">
              <div className="aspect-square rounded-lg overflow-hidden bg-secondary">
                <img src="https://images.unsplash.com/photo-1596462502278-27bfdd403348?w=300&q=80" alt="Makeup" className="size-full object-cover" />
              </div>
              <span className="text-xs text-foreground group-hover:text-link group-hover:underline block mt-1.5 font-medium">{locale === "bg" ? "Грим" : "Makeup"}</span>
            </Link>
            <Link href="/search?category=haircare" className="group">
              <div className="aspect-square rounded-lg overflow-hidden bg-secondary">
                <img src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=300&q=80" alt="Haircare" className="size-full object-cover" />
              </div>
              <span className="text-xs text-foreground group-hover:text-link group-hover:underline block mt-1.5 font-medium">{locale === "bg" ? "Коса" : "Haircare"}</span>
            </Link>
            <Link href="/search?category=fragrance" className="group">
              <div className="aspect-square rounded-lg overflow-hidden bg-secondary">
                <img src="https://images.unsplash.com/photo-1541643600914-78b084683601?w=300&q=80" alt="Fragrance" className="size-full object-cover" />
              </div>
              <span className="text-xs text-foreground group-hover:text-link group-hover:underline block mt-1.5 font-medium">{locale === "bg" ? "Парфюми" : "Fragrance"}</span>
            </Link>
          </div>
          <Link href="/search?category=beauty" className="text-brand-blue hover:underline text-xs mt-2 sm:mt-2.5 min-h-8 sm:min-h-10 flex items-center font-medium">
            {t('sections.seeMore')}
          </Link>
        </div>
      </div>
    </div>
  )
}

function PromoCards({ locale }: { locale: string }) {
  return (
    <div className="flex gap-2.5 overflow-x-auto snap-x snap-mandatory pb-2 px-3 mt-4 md:mt-6 md:px-0 md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-3 md:overflow-visible md:pb-0 no-scrollbar scroll-pl-3">
      <div className="w-[65%] min-w-[65%] sm:w-[44%] sm:min-w-[44%] shrink-0 snap-start md:w-auto md:min-w-0">
        <PromoCard
          bgImage="https://images.unsplash.com/photo-1491933382434-500287f9b54b?w=800&q=80"
          dealText={locale === "bg" ? "Спести до" : "Save up to"}
          highlight="$200"
          subtitle={locale === "bg" ? "Apple устройства*" : "Apple devices*"}
          href="/search?category=electronics&brand=apple"
        />
      </div>
      <div className="w-[65%] min-w-[65%] sm:w-[44%] sm:min-w-[44%] shrink-0 snap-start md:w-auto md:min-w-0">
        <PromoCard
          bgImage="https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=800&q=80"
          dealText={locale === "bg" ? "До" : "Up to"}
          highlight="50%"
          subtitle={locale === "bg" ? "избрани играчки*" : "select toys*"}
          href="/todays-deals?category=toys"
          badge={locale === "bg" ? "🔥 Гореща" : "🔥 Hot"}
        />
      </div>
      <div className="w-[65%] min-w-[65%] sm:w-[44%] sm:min-w-[44%] shrink-0 snap-start md:w-auto md:min-w-0">
        <PromoCard
          bgImage="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80"
          dealText={locale === "bg" ? "До" : "Up to"}
          highlight="40%"
          subtitle={locale === "bg" ? "електроника*" : "electronics*"}
          href="/search?category=electronics"
        />
      </div>
      <div className="w-[65%] min-w-[65%] sm:w-[44%] sm:min-w-[44%] shrink-0 snap-start md:w-auto md:min-w-0 mr-3 md:mr-0">
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
      image: "https://images.unsplash.com/photo-1512389142860-9c449e58a814?w=400&q=80",
      title: locale === "bg" ? "Подаръци" : "Gifts",
    },
    {
      href: "/search?category=home",
      image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=400&q=80",
      title: locale === "bg" ? "За дома" : "Home",
    },
  ]

  return (
    <div className="mt-2 px-3 md:mt-4 md:px-0">
      <h2 className="text-sm font-semibold text-foreground mb-1.5 md:text-base md:mb-3">
        {locale === "bg" ? "Още начини за пазаруване" : "More ways to shop"}
      </h2>
      
      {/* Mobile: 2x2 grid | Desktop: 4-col grid */}
      <div className="grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-4">
        {cards.map((card) => (
          <Link 
            key={card.href}
            href={card.href} 
            className="group relative aspect-4/3 rounded-lg overflow-hidden"
          >
            <img 
              src={card.image} 
              alt={card.title}
              className="absolute inset-0 size-full object-cover"
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
  // Get locale from URL params instead of getLocale() to avoid uncached data warning
  // The [locale] segment already contains this information
  const { locale } = await params
  const t = await getTranslations('Home')

  return (
    <main className="flex min-h-screen flex-col items-center bg-background pb-20">
      {/* 
        MOBILE: Category circles first (right under search), then promo banner
        DESKTOP: Full hero carousel 
      */}
      
      {/* Category Circles - First thing after header on mobile */}
      <div className="w-full md:hidden">
        <CategoryCircles locale={locale} />
      </div>
      
      {/* Promo Banner - After circles on mobile */}
      <div className="w-full md:hidden">
        <PromoBannerStrip locale={locale} />
      </div>
      
      {/* Desktop: Full hero carousel */}
      <div className="hidden md:block w-full">
        <HeroCarousel locale={locale} />
      </div>

      {/* Main Content Container */}
      <div className="w-full px-0 md:container relative z-10 pb-6">
        
        {/* Desktop: Category Circles after hero */}
        <div className="hidden md:block mt-4">
          <CategoryCircles locale={locale} />
        </div>

        {/* 2. Trending/Popular Products - Async with Suspense (first product section) */}
        <div className="mt-3 sm:mt-6">
          <Suspense fallback={<TrendingSectionSkeleton />}>
            <TrendingSection />
          </Suspense>
        </div>

        {/* 3. Shop by Department Cards - Horizontally scrollable on mobile, grid on desktop */}
        <div className="mt-4 sm:mt-6">
          <CategoryCards locale={locale} t={(key) => t(key)} />
        </div>

        {/* 4. Featured/Recommended Products - Async with Suspense */}
        <div className="mt-4 sm:mt-6">
          <Suspense fallback={<FeaturedSectionSkeleton />}>
            <FeaturedSection />
          </Suspense>
        </div>

        {/* 5. Promo Cards - Static, no data fetching */}
        <PromoCards locale={locale} />

        {/* 6. Deals of the Day - Async with Suspense */}
        <div className="mt-3 sm:mt-6">
          <Suspense fallback={<DealsSectionSkeleton />}>
            <DealsWrapper />
          </Suspense>
        </div>

        {/* 7. More Ways to Shop - Static, no data fetching */}
        <MoreWaysToShop locale={locale} />

        {/* 8. Sign In CTA - Async with Suspense (only section needing auth) */}
        <div className="mt-3 sm:mt-6 px-2 md:px-0">
          <Suspense fallback={<SignInCtaSkeleton />}>
            <SignInCTA />
          </Suspense>
        </div>
      </div>
    </main>
  )
}

