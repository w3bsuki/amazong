import { Button } from "@/components/ui/button"
import { HeroCarousel } from "@/components/hero-carousel"
import { Link } from "@/i18n/routing"
import { createClient } from "@/lib/supabase/server"
import { CategoryCircles } from "@/components/category-circles"
import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { getShippingFilter, parseShippingRegion } from '@/lib/shipping'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === 'bg' ? 'Начало' : 'Home',
    description: locale === 'bg' 
      ? 'Добре дошли в AMZN - вашият онлайн магазин за електроника, мода, дом и много други.'
      : 'Welcome to AMZN - your online store for electronics, fashion, home and much more.',
  };
}
import { PromoCard } from "@/components/promo-card"
import { TrendingProductsSection } from "@/components/trending-products-section"
import { DealsSection } from "@/components/deals-section"
import { FeaturedProductsSection } from "@/components/featured-products-section"
import { getTranslations, getLocale } from "next-intl/server"

export default async function Home() {
  const supabase = await createClient()
  const locale = await getLocale()

  interface Product {
    id: string
    title: string
    price: number
    listPrice?: number
    image: string
    rating?: number
    reviews?: number
    reviews_count?: number
    isPrime?: boolean
    isBoosted?: boolean
    sellerTier?: 'basic' | 'premium' | 'business'
    createdAt?: string
  }

  interface Deal {
    id: string
    title: string
    price: number
    listPrice: number
    list_price?: number
    image: string
    categorySlug?: string
  }

  let user = null
  const t = await getTranslations('Home')

  let newestProducts: Product[] = []
  let promoProducts: Product[] = []
  let bestSellersProducts: Product[] = []
  let featuredProducts: Product[] = []

  let allDeals: Deal[] = []
  let techDeals: Deal[] = []
  let homeDeals: Deal[] = []
  let fashionDeals: Deal[] = []

  try {
    if (supabase) {
      const { data: authData } = await supabase.auth.getUser()
      user = authData?.user || null

      // Get user's shipping zone from cookie (set by proxy/middleware)
      const cookieStore = await cookies()
      const userZone = parseShippingRegion(cookieStore.get('user-zone')?.value)
      const shippingFilter = getShippingFilter(userZone)

      // Fetch Deals (products where list_price > price) with category info - filtered by shipping zone
      const { data: dealsData } = await supabase
        .from('products')
        .select('*, categories(slug)')
        .not('list_price', 'is', null)
        .gt('list_price', 0)
        .or(shippingFilter) // Only show products that ship to user's zone
        .limit(30)

      if (dealsData && dealsData.length > 0) {
        // Filter in JS to be safe if DB constraint isn't perfect
        const validDeals = dealsData.filter((p: any) => p.list_price > p.price)
        
        // Map deals with category info
        const mappedDeals = validDeals.map((p: any) => ({
          id: p.id,
          title: p.title,
          price: p.price,
          listPrice: p.list_price,
          image: p.images?.[0] || "/placeholder.svg",
          categorySlug: p.categories?.slug || null
        }))
        
        // All deals
        allDeals = mappedDeals
        
        // Filter by category
        // Tech: electronics, computers, gaming, smart-home
        techDeals = mappedDeals.filter((d: Deal) => 
          ['electronics', 'computers', 'gaming', 'smart-home', 'phones-tablets', 'audio'].includes(d.categorySlug || '')
        )
        
        // Home: home, kitchen, furniture, bedding, decor
        homeDeals = mappedDeals.filter((d: Deal) => 
          ['home', 'home-kitchen', 'kitchen', 'furniture', 'bedding', 'decor', 'garden'].includes(d.categorySlug || '')
        )
        
        // Fashion: fashion, women, men, shoes, bags
        fashionDeals = mappedDeals.filter((d: Deal) => 
          ['fashion', 'women', 'men', 'shoes', 'bags', 'accessories'].includes(d.categorySlug || '')
        )
      }

      // === TRENDING SECTION DATA ===
      
      // 1. Newest Products - sorted by created_at DESC, filtered by shipping zone
      const { data: newestData } = await supabase
        .from('products')
        .select('*')
        .or(shippingFilter)
        .order('created_at', { ascending: false })
        .limit(12)

      if (newestData && newestData.length > 0) {
        newestProducts = newestData.map((p: any) => ({
          id: p.id,
          title: p.title,
          price: p.price,
          listPrice: p.list_price || undefined,
          rating: p.rating || 0,
          reviews: p.review_count || 0,
          image: p.images?.[0] || "/placeholder.svg",
          isPrime: p.is_prime,
          createdAt: p.created_at
        }))
      }

      // 2. Promo Products - products with discounts (list_price > price), filtered by shipping zone
      const { data: promoData } = await supabase
        .from('products')
        .select('*')
        .not('list_price', 'is', null)
        .gt('list_price', 0)
        .or(shippingFilter)
        .limit(12)

      if (promoData && promoData.length > 0) {
        const validPromos = promoData.filter((p: any) => p.list_price > p.price)
        promoProducts = validPromos.map((p: any) => ({
          id: p.id,
          title: p.title,
          price: p.price,
          listPrice: p.list_price,
          rating: p.rating || 0,
          reviews: p.review_count || 0,
          image: p.images?.[0] || "/placeholder.svg",
          isPrime: p.is_prime
        }))
      }

      // 3. Best Sellers - sorted by review_count DESC (popularity indicator), filtered by shipping zone
      const { data: bestSellersData } = await supabase
        .from('products')
        .select('*')
        .or(shippingFilter)
        .order('review_count', { ascending: false })
        .limit(12)

      if (bestSellersData && bestSellersData.length > 0) {
        bestSellersProducts = bestSellersData.map((p: any) => ({
          id: p.id,
          title: p.title,
          price: p.price,
          listPrice: p.list_price || undefined,
          rating: p.rating || 0,
          reviews: p.review_count || 0,
          image: p.images?.[0] || "/placeholder.svg",
          isPrime: p.is_prime
        }))
      }

      // 4. Featured Products - Boosted listings + products from premium/business sellers
      // For complex queries, we filter in JS after fetching
      const { data: featuredDataRaw } = await supabase
        .from('products')
        .select(`
          *,
          sellers (
            id,
            tier,
            business_name,
            rating
          )
        `)
        .or('is_boosted.eq.true,is_featured.eq.true')
        .gte('rating', 4.0)
        .order('is_boosted', { ascending: false })
        .order('rating', { ascending: false })
        .limit(50) // Fetch more, then filter by shipping

      // Filter by shipping zone
      const featuredData = featuredDataRaw?.filter((p: any) => {
        if (userZone === 'BG') return p.ships_to_bulgaria || p.ships_to_europe || p.ships_to_worldwide
        if (userZone === 'EU') return p.ships_to_europe || p.ships_to_worldwide
        if (userZone === 'US') return p.ships_to_usa || p.ships_to_worldwide
        return p.ships_to_worldwide
      }).slice(0, 12)

      if (featuredData && featuredData.length > 0) {
        featuredProducts = featuredData.map((p: any) => ({
          id: p.id,
          title: p.title,
          price: p.price,
          listPrice: p.list_price || undefined,
          rating: p.rating || 0,
          reviews: p.review_count || 0,
          image: p.images?.[0] || "/placeholder.svg",
          isPrime: p.is_prime,
          isBoosted: p.is_boosted
        }))
      } else {
        // Fallback: If no featured products, show highest rated products filtered by shipping zone
        const { data: topRatedData } = await supabase
          .from('products')
          .select('*')
          .or(shippingFilter)
          .gte('rating', 4.0)
          .order('rating', { ascending: false })
          .order('review_count', { ascending: false })
          .limit(12)

        if (topRatedData && topRatedData.length > 0) {
          featuredProducts = topRatedData.map((p: any) => ({
            id: p.id,
            title: p.title,
            price: p.price,
            listPrice: p.list_price || undefined,
            rating: p.rating || 0,
            reviews: p.review_count || 0,
            image: p.images?.[0] || "/placeholder.svg",
            isPrime: p.is_prime
          }))
        }
      }
    }
  } catch (e) {
    console.error("Supabase error:", e)
  }

  return (
    <main className="flex min-h-screen flex-col items-center bg-muted pb-20">
      <HeroCarousel locale={locale} />

      {/* Main Content Container - overlaps hero like Amazon */}
      <div className="container relative z-10 mb-6 -mt-6 sm:-mt-28 md:-mt-32">
        
        {/* 1. Category Circles - Horizontal scrollable categories */}
        <div className="mt-3 sm:mt-4">
          <CategoryCircles locale={locale} />
        </div>

        {/* 2. Category Grid with Subcategories - Scrollable on mobile */}
        <div className="flex gap-2 overflow-x-auto snap-x snap-mandatory pb-2 px-1 mt-3 sm:mt-4 sm:px-0 sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:gap-4 sm:overflow-visible sm:pb-0 no-scrollbar">
          {/* Computers Card */}
          <div className="w-[60vw] min-w-[60vw] shrink-0 snap-start sm:w-auto sm:min-w-0 bg-card rounded-lg border border-border p-2.5 sm:p-3">
            <h3 className="text-sm sm:text-base font-bold text-foreground mb-2 sm:mb-2.5">
              {locale === "bg" ? "Компютри" : "Computers"}
            </h3>
            <div className="grid grid-cols-2 gap-2">
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
            <Link href="/search?category=computers" className="text-brand-blue hover:underline text-xs mt-2.5 min-h-10 flex items-center font-medium">
              {t('sections.seeMore')}
            </Link>
          </div>

          {/* Home & Kitchen Card */}
          <div className="w-[60vw] min-w-[60vw] shrink-0 snap-start sm:w-auto sm:min-w-0 bg-card rounded-lg border border-border p-2.5 sm:p-3">
            <h3 className="text-sm sm:text-base font-bold text-foreground mb-2 sm:mb-2.5">
              {locale === "bg" ? "Дом и кухня" : "Home"}
            </h3>
            <div className="grid grid-cols-2 gap-2">
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
            <Link href="/search?category=home" className="text-brand-blue hover:underline text-xs mt-2.5 min-h-10 flex items-center font-medium">
              {t('sections.seeMore')}
            </Link>
          </div>

          {/* Fashion Card */}
          <div className="w-[60vw] min-w-[60vw] shrink-0 snap-start sm:w-auto sm:min-w-0 bg-card rounded-lg border border-border p-2.5 sm:p-3">
            <h3 className="text-sm sm:text-base font-bold text-foreground mb-2 sm:mb-2.5">
              {locale === "bg" ? "Мода" : "Fashion"}
            </h3>
            <div className="grid grid-cols-2 gap-2">
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
            <Link href="/search?category=fashion" className="text-brand-blue hover:underline text-xs mt-2.5 min-h-10 flex items-center font-medium">
              {t('sections.seeMore')}
            </Link>
          </div>

          {/* Beauty Card */}
          <div className="w-[60vw] min-w-[60vw] shrink-0 snap-start sm:w-auto sm:min-w-0 bg-card rounded-lg border border-border p-2.5 sm:p-3 mr-1 sm:mr-0">
            <h3 className="text-sm sm:text-base font-bold text-foreground mb-2 sm:mb-2.5">
              {locale === "bg" ? "Красота" : "Beauty"}
            </h3>
            <div className="grid grid-cols-2 gap-2">
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
            <Link href="/search?category=beauty" className="text-brand-blue hover:underline text-xs mt-2.5 min-h-10 flex items-center font-medium">
              {t('sections.seeMore')}
            </Link>
          </div>
        </div>

        {/* 3. Trending Products - Behavior-Based Tabs (Newest, Promo, Best Sellers) */}
        <div className="mt-4 sm:mt-6 mx-1 sm:mx-0">
          <TrendingProductsSection
            title={locale === "bg" ? "Открийте популярни продукти" : "Explore trending picks"}
            newestProducts={newestProducts}
            promoProducts={promoProducts}
            bestSellersProducts={bestSellersProducts}
            ctaText={locale === "bg" ? "Виж всички" : "Shop all"}
            ctaHref="/search"
          />
        </div>

        {/* 3.5. Featured/Recommended Products - Boosted listings + Premium sellers */}
        {featuredProducts.length > 0 && (
          <div className="mt-4 sm:mt-6 mx-1 sm:mx-0">
            <FeaturedProductsSection
              title={locale === "bg" ? "Препоръчани продукти" : "Recommended Products"}
              subtitle={locale === "bg" ? "Топ продавачи и промотирани обяви" : "From top sellers & boosted listings"}
              products={featuredProducts}
              ctaText={locale === "bg" ? "Виж всички" : "View all"}
              ctaHref="/search?featured=true"
            />
          </div>
        )}

        {/* 4. Promo Cards - Special offers */}
        <div className="flex gap-2 overflow-x-auto snap-x snap-mandatory pb-2 px-1 mt-4 sm:mt-6 sm:px-0 sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:gap-3 sm:overflow-visible sm:pb-0 no-scrollbar">
          <div className="w-[45vw] min-w-[45vw] shrink-0 snap-start sm:w-auto sm:min-w-0">
            <PromoCard
              bgImage="https://images.unsplash.com/photo-1491933382434-500287f9b54b?w=800&q=80"
              dealText={locale === "bg" ? "Спести до" : "Save up to"}
              highlight="$200"
              subtitle={locale === "bg" ? "Apple устройства*" : "Apple devices*"}
              href="/search?category=electronics&brand=apple"
            />
          </div>
          <div className="w-[45vw] min-w-[45vw] shrink-0 snap-start sm:w-auto sm:min-w-0">
            <PromoCard
              bgImage="https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=800&q=80"
              dealText={locale === "bg" ? "До" : "Up to"}
              highlight="50%"
              subtitle={locale === "bg" ? "избрани играчки*" : "select toys*"}
              href="/todays-deals?category=toys"
              badge={locale === "bg" ? "🔥 Гореща" : "🔥 Hot"}
            />
          </div>
          <div className="w-[45vw] min-w-[45vw] shrink-0 snap-start sm:w-auto sm:min-w-0">
            <PromoCard
              bgImage="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80"
              dealText={locale === "bg" ? "До" : "Up to"}
              highlight="40%"
              subtitle={locale === "bg" ? "електроника*" : "electronics*"}
              href="/search?category=electronics"
            />
          </div>
          <div className="w-[45vw] min-w-[45vw] shrink-0 snap-start sm:w-auto sm:min-w-0 mr-1 sm:mr-0">
            <PromoCard
              bgImage="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80"
              dealText={locale === "bg" ? "До" : "Up to"}
              highlight="30%"
              subtitle={locale === "bg" ? "мода*" : "fashion*"}
              href="/search?category=fashion"
            />
          </div>
        </div>

        {/* 5. Deals of the Day - Target Style Tabbed Section with Category Filtering */}
        <div className="mt-4 sm:mt-6 mx-1 sm:mx-0">
          <DealsSection
            title={locale === "bg" ? "Оферти на деня" : "Deals of the Day"}
            tabs={[
              {
                id: "all",
                label: locale === "bg" ? "Всички" : "All Deals",
                deals: allDeals,
              },
              {
                id: "electronics",
                label: locale === "bg" ? "Техника" : "Tech",
                deals: techDeals.length > 0 ? techDeals : allDeals.slice(0, 4),
              },
              {
                id: "home",
                label: locale === "bg" ? "За дома" : "Home",
                deals: homeDeals.length > 0 ? homeDeals : allDeals.slice(0, 4),
              },
              {
                id: "fashion",
                label: locale === "bg" ? "Мода" : "Fashion",
                deals: fashionDeals.length > 0 ? fashionDeals : allDeals.slice(0, 4),
              },
            ]}
            ctaText={locale === "bg" ? "Виж всички" : "Shop all"}
            ctaHref="/todays-deals"
          />
        </div>

        {/* 6. More Ways to Shop - Horizontal scroll on mobile, Bento grid on desktop */}
        <div className="mt-4 sm:mt-6 px-1 sm:px-0">
          {/* Section Title */}
          <h2 className="text-lg sm:text-xl font-bold text-foreground mb-3 sm:mb-4">
            {locale === "bg" ? "Още начини за пазаруване" : "More ways to shop"}
          </h2>
          
          {/* Mobile: Horizontal scroll with exactly 2 visible | Desktop: Bento grid */}
          <div className="
            flex gap-2 overflow-x-auto snap-x snap-mandatory scroll-pl-0 pb-3 no-scrollbar
            sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:gap-4 sm:overflow-visible sm:pb-0
          ">
            {/* New Arrivals Card - Large Feature */}
            <Link 
              href="/search?sort=newest" 
              className="group relative w-[42vw] min-w-[42vw] h-44 shrink-0 snap-start rounded-lg overflow-hidden sm:w-auto sm:min-w-0 sm:col-span-2 lg:col-span-1 lg:row-span-2 sm:h-auto sm:min-h-80 lg:min-h-full"
            >
              <img 
                src="https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=800&q=80" 
                alt={locale === "bg" ? "Нови продукти" : "New Arrivals"}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-black/20" />
              <div className="relative h-full flex flex-col justify-end p-3 sm:p-6">
                <span className="inline-block bg-white/20 text-white text-xs font-medium px-2 py-0.5 sm:py-1 rounded-full w-fit mb-1.5 sm:mb-2 backdrop-blur-sm">
                  {locale === "bg" ? "Ново" : "New"}
                </span>
                <h3 className="text-base sm:text-2xl lg:text-3xl font-bold text-white mb-0.5 sm:mb-1 line-clamp-2">
                  {locale === "bg" ? "Нови продукти в играчките" : "New in toys"}
                </h3>
                <p className="text-white/80 text-xs sm:text-base mb-1.5 sm:mb-3 line-clamp-1 sm:line-clamp-2">
                  {locale === "bg" ? "Открийте най-новите играчки" : "Discover the latest toys"}
                </p>
                <span className="text-white font-medium text-xs sm:text-sm group-hover:underline">
                  {t('sections.shopNow')} →
                </span>
              </div>
            </Link>

            {/* Fashion Trends Card */}
            <Link 
              href="/search?category=fashion" 
              className="group relative w-[42vw] min-w-[42vw] h-44 shrink-0 snap-start rounded-lg overflow-hidden bg-header-bg sm:w-auto sm:min-w-0 sm:h-auto sm:min-h-60"
            >
              <img 
                src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80" 
                alt={locale === "bg" ? "Модни тенденции" : "Fashion Trends"}
                className="absolute inset-0 w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />
              <div className="relative h-full flex flex-col justify-end p-3 sm:p-5">
                <h3 className="text-base sm:text-xl font-bold text-white mb-0.5 sm:mb-1 line-clamp-1">
                  {locale === "bg" ? "Модни тенденции" : "Fashion trends"}
                </h3>
                <p className="text-white/70 text-xs sm:text-sm mb-1 sm:mb-2 line-clamp-1">
                  {locale === "bg" ? "Открийте стила на сезона" : "Discover this season's styles"}
                </p>
                <span className="text-white font-medium text-xs sm:text-sm group-hover:underline">
                  {t('sections.seeMore')} →
                </span>
              </div>
            </Link>

            {/* Holiday Gifts Card */}
            <Link 
              href="/gift-cards" 
              className="group relative w-[42vw] min-w-[42vw] h-44 shrink-0 snap-start rounded-lg overflow-hidden sm:w-auto sm:min-w-0 sm:h-auto sm:min-h-60"
            >
              <img 
                src="https://images.unsplash.com/photo-1512389142860-9c449e58a814?w=600&q=80" 
                alt={locale === "bg" ? "Празнични подаръци" : "Holiday Gifts"}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-black/20" />
              <div className="relative h-full flex flex-col justify-end p-3 sm:p-5">
                <h3 className="text-base sm:text-xl font-bold text-white mb-0.5 sm:mb-1 line-clamp-1">
                  {locale === "bg" ? "Празнични подаръци" : "Holiday gifts"}
                </h3>
                <p className="text-white/70 text-xs sm:text-sm mb-1 sm:mb-2 line-clamp-1">
                  {locale === "bg" ? "Намерете перфектния подарък" : "Find the perfect gift"}
                </p>
                <span className="text-white font-medium text-xs sm:text-sm group-hover:underline">
                  {t('sections.shopNow')} →
                </span>
              </div>
            </Link>

            {/* Home Essentials Card */}
            <Link 
              href="/search?category=home" 
              className="group relative w-[42vw] min-w-[42vw] h-44 shrink-0 snap-start rounded-lg overflow-hidden sm:w-auto sm:min-w-0 sm:h-auto sm:min-h-60"
            >
              <img 
                src="https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&q=80" 
                alt={locale === "bg" ? "За дома" : "Home Essentials"}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-black/20" />
              <div className="relative h-full flex flex-col justify-end p-3 sm:p-5">
                <h3 className="text-base sm:text-xl font-bold text-white mb-0.5 sm:mb-1 line-clamp-1">
                  {locale === "bg" ? "За уютен дом" : "Home essentials"}
                </h3>
                <p className="text-white/70 text-xs sm:text-sm mb-1 sm:mb-2 line-clamp-1">
                  {locale === "bg" ? "Всичко за домашния комфорт" : "Everything for home comfort"}
                </p>
                <span className="text-white font-medium text-xs sm:text-sm group-hover:underline">
                  {t('sections.seeMore')} →
                </span>
              </div>
            </Link>

            {/* Beauty Card */}
            <Link 
              href="/search?category=beauty" 
              className="group relative w-[42vw] min-w-[42vw] h-44 shrink-0 snap-start rounded-lg overflow-hidden sm:w-auto sm:min-w-0 sm:h-auto sm:min-h-60"
            >
              <img 
                src="https://images.unsplash.com/photo-1596462502278-27bfdd403348?w=600&q=80" 
                alt={locale === "bg" ? "Красота" : "Beauty"}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-black/20" />
              <div className="relative h-full flex flex-col justify-end p-3 sm:p-5">
                <h3 className="text-base sm:text-xl font-bold text-white mb-0.5 sm:mb-1 line-clamp-1">
                  {locale === "bg" ? "Красота и грижа" : "Beauty favorites"}
                </h3>
                <p className="text-white/70 text-xs sm:text-sm mb-1 sm:mb-2 line-clamp-1">
                  {locale === "bg" ? "Топ продукти за красота" : "Top beauty picks"}
                </p>
                <span className="text-white font-medium text-xs sm:text-sm group-hover:underline">
                  {t('sections.seeMore')} →
                </span>
              </div>
            </Link>
          </div>
        </div>

        {/* Sign In CTA - Only for non-logged in users */}
        {!user && (
          <div className="mt-4 sm:mt-6 px-1 sm:px-0">
            <div className="bg-primary rounded-lg p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-center sm:text-left">
                <h3 className="text-lg sm:text-xl font-bold text-primary-foreground mb-1">
                  {locale === "bg" ? "Влез в акаунта си" : "Sign in for the best experience"}
                </h3>
                <p className="text-primary-foreground/80 text-sm">
                  {locale === "bg" ? "Персонализирани препоръки и по-бързо пазаруване" : "Personalized recommendations and faster checkout"}
                </p>
              </div>
              <Link href="/auth/login">
                <Button className="min-h-11 px-6 bg-white hover:bg-muted text-primary text-sm font-semibold rounded-full">
                  {t('sections.signInSecurely')}
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
