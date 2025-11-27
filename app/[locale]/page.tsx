import { Button } from "@/components/ui/button"
import { HeroCarousel } from "@/components/hero-carousel"
import { Link } from "@/i18n/routing"
import { createClient } from "@/lib/supabase/server"
import { CategoryCircles } from "@/components/category-circles"
import { DailyDealsBanner } from "@/components/daily-deals-banner"
import { PromoCard } from "@/components/promo-card"
import { TabbedProductSection } from "@/components/tabbed-product-section"
import { DealsSection } from "@/components/deals-section"
import { cn } from "@/lib/utils"

import { WelcomeToast } from "@/components/welcome-toast"
import { getTranslations, getLocale } from "next-intl/server"

export default async function Home() {
  const supabase = await createClient()
  const locale = await getLocale()

  interface Product {
    id: string
    title: string
    price: number
    image: string
    rating?: number
    reviews?: number
    reviews_count?: number
    isPrime?: boolean
  }

  interface Deal {
    id: string
    title: string
    price: number
    listPrice: number
    list_price?: number
    image: string
  }

  let user = null
  const t = await getTranslations('Home')

  let featuredProducts: Product[] = []

  let deals: Deal[] = []

  try {
    if (supabase) {
      const { data: authData } = await supabase.auth.getUser()
      user = authData?.user || null

      // Fetch Featured Products (random or specific logic)
      const { data: productsData } = await supabase
        .from('products')
        .select('*')
        .limit(4)

      if (productsData && productsData.length > 0) {
        featuredProducts = productsData.map((p: any) => ({
          id: p.id,
          title: p.title,
          price: p.price,
          rating: p.rating || 0,
          reviews: p.review_count || 0,
          image: p.images?.[0] || "/placeholder.svg",
          isPrime: p.is_prime
        }))
      }

      // Fetch Deals (products where list_price > price)
      const { data: dealsData } = await supabase
        .from('products')
        .select('*')
        .not('list_price', 'is', null)
        .gt('list_price', 0) // Ensure list_price is valid
        .limit(10)

      if (dealsData && dealsData.length > 0) {
        // Filter in JS to be safe if DB constraint isn't perfect, or rely on query
        const validDeals = dealsData.filter((p: any) => p.list_price > p.price)
        if (validDeals.length > 0) {
          deals = validDeals.map((p: any) => ({
            id: p.id,
            title: p.title,
            price: p.price,
            listPrice: p.list_price,
            image: p.images?.[0] || "/placeholder.svg"
          }))
        }
      }
    }
  } catch (e) {
    console.error("Supabase error:", e)
  }

  return (
    <main className="flex min-h-screen flex-col items-center bg-muted pb-20">
      <WelcomeToast />
      <HeroCarousel locale={locale} />

      {/* Main Content Container - overlaps hero like Amazon */}
      <div className="container relative z-10 mb-6 -mt-6 sm:-mt-28 md:-mt-32">
        
        {/* Category Circles - Horizontal scrollable categories */}
        <div className="mb-2 sm:mb-4">
          <CategoryCircles locale={locale} />
        </div>

        {/* Daily Deals Banner */}
        <div className="mb-4 px-1 sm:px-0">
          <DailyDealsBanner locale={locale} />
        </div>

        {/* Category Grid with Subcategories */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-1.5 sm:gap-4 px-1 sm:px-0">
          {/* Computers Card */}
          <div className="bg-card rounded-lg border border-border p-2.5 sm:p-3">
            <h3 className="text-sm sm:text-base font-bold text-foreground mb-2 sm:mb-2.5">
              {locale === "bg" ? "Компютри" : "Computers"}
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <Link href="/search?category=laptops" className="group touch-action-manipulation active:scale-95 transition-transform">
                <div className="aspect-square rounded-lg overflow-hidden bg-secondary">
                  <img src="https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300&q=80" alt="Laptops" className="size-full object-cover" />
                </div>
                <span className="text-[11px] sm:text-xs text-foreground group-hover:text-primary block mt-1.5 font-medium">{locale === "bg" ? "Лаптопи" : "Laptops"}</span>
              </Link>
              <Link href="/search?category=desktops" className="group touch-action-manipulation active:scale-95 transition-transform">
                <div className="aspect-square rounded-lg overflow-hidden bg-secondary">
                  <img src="https://images.unsplash.com/photo-1593062096033-9a26b09da705?w=300&q=80" alt="Desktops" className="size-full object-cover" />
                </div>
                <span className="text-[11px] sm:text-xs text-foreground group-hover:text-primary block mt-1.5 font-medium">{locale === "bg" ? "Настолни" : "Desktops"}</span>
              </Link>
              <Link href="/search?category=monitors" className="group touch-action-manipulation active:scale-95 transition-transform">
                <div className="aspect-square rounded-lg overflow-hidden bg-secondary">
                  <img src="https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=300&q=80" alt="Monitors" className="size-full object-cover" />
                </div>
                <span className="text-[11px] sm:text-xs text-foreground group-hover:text-primary block mt-1.5 font-medium">{locale === "bg" ? "Монитори" : "Monitors"}</span>
              </Link>
              <Link href="/search?category=accessories" className="group touch-action-manipulation active:scale-95 transition-transform">
                <div className="aspect-square rounded-lg overflow-hidden bg-secondary">
                  <img src="https://images.unsplash.com/photo-1625723044792-44de16ccb4e9?w=300&q=80" alt="Accessories" className="size-full object-cover" />
                </div>
                <span className="text-[11px] sm:text-xs text-foreground group-hover:text-primary block mt-1.5 font-medium">{locale === "bg" ? "Аксесоари" : "Accessories"}</span>
              </Link>
            </div>
            <Link href="/search?category=computers" className="text-brand-blue hover:underline text-xs mt-2.5 min-h-10 flex items-center font-medium">
              {t('sections.seeMore')}
            </Link>
          </div>

          {/* Home & Kitchen Card */}
          <div className="bg-card rounded-lg border border-border p-2.5 sm:p-3">
            <h3 className="text-sm sm:text-base font-bold text-foreground mb-2 sm:mb-2.5">
              {locale === "bg" ? "Дом и кухня" : "Home"}
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <Link href="/search?category=kitchen" className="group touch-action-manipulation active:scale-95 transition-transform">
                <div className="aspect-square rounded-lg overflow-hidden bg-secondary">
                  <img src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&q=80" alt="Kitchen" className="size-full object-cover" />
                </div>
                <span className="text-[11px] sm:text-xs text-foreground group-hover:text-primary block mt-1.5 font-medium">{locale === "bg" ? "Кухня" : "Kitchen"}</span>
              </Link>
              <Link href="/search?category=furniture" className="group touch-action-manipulation active:scale-95 transition-transform">
                <div className="aspect-square rounded-lg overflow-hidden bg-secondary">
                  <img src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=300&q=80" alt="Furniture" className="size-full object-cover" />
                </div>
                <span className="text-[11px] sm:text-xs text-foreground group-hover:text-primary block mt-1.5 font-medium">{locale === "bg" ? "Мебели" : "Furniture"}</span>
              </Link>
              <Link href="/search?category=bedding" className="group touch-action-manipulation active:scale-95 transition-transform">
                <div className="aspect-square rounded-lg overflow-hidden bg-secondary">
                  <img src="https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=300&q=80" alt="Bedding" className="size-full object-cover" />
                </div>
                <span className="text-[11px] sm:text-xs text-foreground group-hover:text-primary block mt-1.5 font-medium">{locale === "bg" ? "Спално бельо" : "Bedding"}</span>
              </Link>
              <Link href="/search?category=decor" className="group touch-action-manipulation active:scale-95 transition-transform">
                <div className="aspect-square rounded-lg overflow-hidden bg-secondary">
                  <img src="https://images.unsplash.com/photo-1513694203232-719a280e022f?w=300&q=80" alt="Decor" className="size-full object-cover" />
                </div>
                <span className="text-[11px] sm:text-xs text-foreground group-hover:text-primary block mt-1.5 font-medium">{locale === "bg" ? "Декорация" : "Decor"}</span>
              </Link>
            </div>
            <Link href="/search?category=home" className="text-brand-blue hover:underline text-xs mt-2.5 min-h-10 flex items-center font-medium">
              {t('sections.seeMore')}
            </Link>
          </div>

          {/* Fashion Card */}
          <div className="bg-card rounded-lg border border-border p-2.5 sm:p-3">
            <h3 className="text-sm sm:text-base font-bold text-foreground mb-2 sm:mb-2.5">
              {locale === "bg" ? "Мода" : "Fashion"}
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <Link href="/search?category=women" className="group touch-action-manipulation active:scale-95 transition-transform">
                <div className="aspect-square rounded-lg overflow-hidden bg-secondary">
                  <img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=300&q=80" alt="Women" className="size-full object-cover" />
                </div>
                <span className="text-[11px] sm:text-xs text-foreground group-hover:text-primary block mt-1.5 font-medium">{locale === "bg" ? "Дамски" : "Women"}</span>
              </Link>
              <Link href="/search?category=men" className="group touch-action-manipulation active:scale-95 transition-transform">
                <div className="aspect-square rounded-lg overflow-hidden bg-secondary">
                  <img src="https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=300&q=80" alt="Men" className="size-full object-cover" />
                </div>
                <span className="text-[11px] sm:text-xs text-foreground group-hover:text-primary block mt-1.5 font-medium">{locale === "bg" ? "Мъжки" : "Men"}</span>
              </Link>
              <Link href="/search?category=shoes" className="group touch-action-manipulation active:scale-95 transition-transform">
                <div className="aspect-square rounded-lg overflow-hidden bg-secondary">
                  <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&q=80" alt="Shoes" className="size-full object-cover" />
                </div>
                <span className="text-[11px] sm:text-xs text-foreground group-hover:text-primary block mt-1.5 font-medium">{locale === "bg" ? "Обувки" : "Shoes"}</span>
              </Link>
              <Link href="/search?category=bags" className="group touch-action-manipulation active:scale-95 transition-transform">
                <div className="aspect-square rounded-lg overflow-hidden bg-secondary">
                  <img src="https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=300&q=80" alt="Bags" className="size-full object-cover" />
                </div>
                <span className="text-[11px] sm:text-xs text-foreground group-hover:text-primary block mt-1.5 font-medium">{locale === "bg" ? "Чанти" : "Bags"}</span>
              </Link>
            </div>
            <Link href="/search?category=fashion" className="text-brand-blue hover:underline text-xs mt-2.5 min-h-10 flex items-center font-medium">
              {t('sections.seeMore')}
            </Link>
          </div>

          {/* Beauty Card */}
          <div className="bg-card rounded-lg border border-border p-2.5 sm:p-3">
            <h3 className="text-sm sm:text-base font-bold text-foreground mb-2 sm:mb-2.5">
              {locale === "bg" ? "Красота" : "Beauty"}
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <Link href="/search?category=skincare" className="group touch-action-manipulation active:scale-95 transition-transform">
                <div className="aspect-square rounded-lg overflow-hidden bg-secondary">
                  <img src="https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=300&q=80" alt="Skincare" className="size-full object-cover" />
                </div>
                <span className="text-[11px] sm:text-xs text-foreground group-hover:text-primary block mt-1.5 font-medium">{locale === "bg" ? "Грижа" : "Skincare"}</span>
              </Link>
              <Link href="/search?category=makeup" className="group touch-action-manipulation active:scale-95 transition-transform">
                <div className="aspect-square rounded-lg overflow-hidden bg-secondary">
                  <img src="https://images.unsplash.com/photo-1596462502278-27bfdd403348?w=300&q=80" alt="Makeup" className="size-full object-cover" />
                </div>
                <span className="text-[11px] sm:text-xs text-foreground group-hover:text-primary block mt-1.5 font-medium">{locale === "bg" ? "Грим" : "Makeup"}</span>
              </Link>
              <Link href="/search?category=haircare" className="group touch-action-manipulation active:scale-95 transition-transform">
                <div className="aspect-square rounded-lg overflow-hidden bg-secondary">
                  <img src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=300&q=80" alt="Haircare" className="size-full object-cover" />
                </div>
                <span className="text-[11px] sm:text-xs text-foreground group-hover:text-primary block mt-1.5 font-medium">{locale === "bg" ? "Коса" : "Haircare"}</span>
              </Link>
              <Link href="/search?category=fragrance" className="group touch-action-manipulation active:scale-95 transition-transform">
                <div className="aspect-square rounded-lg overflow-hidden bg-secondary">
                  <img src="https://images.unsplash.com/photo-1541643600914-78b084683601?w=300&q=80" alt="Fragrance" className="size-full object-cover" />
                </div>
                <span className="text-[11px] sm:text-xs text-foreground group-hover:text-primary block mt-1.5 font-medium">{locale === "bg" ? "Парфюми" : "Fragrance"}</span>
              </Link>
            </div>
            <Link href="/search?category=beauty" className="text-brand-blue hover:underline text-xs mt-2.5 min-h-10 flex items-center font-medium">
              {t('sections.seeMore')}
            </Link>
          </div>
        </div>

        {/* Promo Cards Grid - Target Style */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-1.5 sm:gap-3 px-1 sm:px-0 mt-4">
          <PromoCard
            bgImage="https://images.unsplash.com/photo-1491933382434-500287f9b54b?w=800&q=80"
            dealText={locale === "bg" ? "Спести до" : "Save up to"}
            highlight="$200"
            subtitle={locale === "bg" ? "Apple устройства*" : "Apple devices*"}
            href="/search?category=electronics&brand=apple"
          />
          <PromoCard
            bgImage="https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=800&q=80"
            dealText={locale === "bg" ? "До" : "Up to"}
            highlight="50%"
            subtitle={locale === "bg" ? "избрани играчки*" : "select toys*"}
            href="/todays-deals?category=toys"
            badge={locale === "bg" ? "🔥 Гореща" : "🔥 Hot"}
          />
          <PromoCard
            bgImage="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80"
            dealText={locale === "bg" ? "До" : "Up to"}
            highlight="40%"
            subtitle={locale === "bg" ? "електроника*" : "electronics*"}
            href="/search?category=electronics"
          />
          <PromoCard
            bgImage="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80"
            dealText={locale === "bg" ? "До" : "Up to"}
            highlight="30%"
            subtitle={locale === "bg" ? "мода*" : "fashion*"}
            href="/search?category=fashion"
          />
        </div>

        {/* Trending Products - Target-Style Tabbed Section */}
        <div className="mt-4 sm:mt-6 mx-1 sm:mx-0">
          <TabbedProductSection
            title={locale === "bg" ? "Открийте популярни продукти" : "Explore trending picks"}
            tabs={[
              {
                id: "featured",
                label: locale === "bg" ? "Избрани" : "Featured",
                products: featuredProducts,
              },
              {
                id: "electronics",
                label: locale === "bg" ? "Техника" : "Tech",
                products: featuredProducts, // In production, fetch different products
              },
              {
                id: "home",
                label: locale === "bg" ? "За дома" : "Home",
                products: featuredProducts,
              },
              {
                id: "fashion",
                label: locale === "bg" ? "Мода" : "Fashion",
                products: featuredProducts,
              },
            ]}
            ctaText={locale === "bg" ? "Виж всички" : "Shop all"}
            ctaHref="/search?q=featured"
            variant="featured"
          />
        </div>

        {/* Deals of the Day - Target Style Tabbed Section */}
        <div className="mt-4 sm:mt-6 mx-1 sm:mx-0">
          <DealsSection
            title={locale === "bg" ? "Оферти на деня" : "Deals of the Day"}
            tabs={[
              {
                id: "all",
                label: locale === "bg" ? "Всички" : "All Deals",
                deals: deals,
              },
              {
                id: "electronics",
                label: locale === "bg" ? "Техника" : "Tech",
                deals: deals, // In production, filter by category
              },
              {
                id: "home",
                label: locale === "bg" ? "За дома" : "Home",
                deals: deals,
              },
              {
                id: "fashion",
                label: locale === "bg" ? "Мода" : "Fashion",
                deals: deals,
              },
            ]}
            ctaText={locale === "bg" ? "Виж всички" : "Shop all"}
            ctaHref="/todays-deals"
          />
        </div>

        {/* Featured Categories - Target Style with circular images */}
        <div className="mt-6 sm:mt-8 px-1 sm:px-0">
          <div className="bg-card rounded-lg border border-border p-4 sm:p-6">
            {/* Section Header */}
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-xl font-bold text-foreground">
                {locale === "bg" ? "Избрани категории" : "Featured categories"}
              </h2>
              <Link 
                href="/search" 
                className="text-brand-blue hover:text-brand-blue/80 text-sm font-medium hover:underline transition-colors min-h-10 flex items-center"
              >
                {t('sections.seeMore')}
              </Link>
            </div>
            
            {/* Category Grid - Target style circular images */}
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-9 gap-3 sm:gap-4 md:gap-5">
              {[
                { name: locale === "bg" ? "Ново" : "New Arrivals", image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=200&q=80", href: "/search?sort=newest" },
                { name: locale === "bg" ? "Празници" : "Holiday", image: "https://images.unsplash.com/photo-1512389142860-9c449e58a814?w=200&q=80", href: "/search?category=holiday" },
                { name: locale === "bg" ? "Подаръци" : "Gifts", image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=200&q=80", href: "/gift-cards" },
                { name: locale === "bg" ? "Играчки" : "Toys", image: "https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=200&q=80", href: "/search?category=toys" },
                { name: locale === "bg" ? "Техника" : "Electronics", image: "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=200&q=80", href: "/search?category=electronics" },
                { name: locale === "bg" ? "Дамско" : "Women's", image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=200&q=80", href: "/search?category=women" },
                { name: locale === "bg" ? "Мъжко" : "Men's", image: "https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=200&q=80", href: "/search?category=men" },
                { name: locale === "bg" ? "Детско" : "Kids'", image: "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=200&q=80", href: "/search?category=kids" },
                { name: locale === "bg" ? "Бебета" : "Baby", image: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=200&q=80", href: "/search?category=baby" },
                { name: locale === "bg" ? "Дом" : "Home", image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=200&q=80", href: "/search?category=home" },
                { name: locale === "bg" ? "Кухня" : "Kitchen", image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200&q=80", href: "/search?category=kitchen" },
                { name: locale === "bg" ? "Apple" : "Apple", image: "https://images.unsplash.com/photo-1491933382434-500287f9b54b?w=200&q=80", href: "/search?brand=apple" },
                { name: locale === "bg" ? "Красота" : "Beauty", image: "https://images.unsplash.com/photo-1596462502278-27bfdd403348?w=200&q=80", href: "/search?category=beauty" },
                { name: locale === "bg" ? "Здраве" : "Health", image: "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=200&q=80", href: "/search?category=health" },
                { name: locale === "bg" ? "Храна" : "Grocery", image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=200&q=80", href: "/search?category=grocery" },
                { name: locale === "bg" ? "Домашно" : "Essentials", image: "https://images.unsplash.com/photo-1563453392212-326f5e854473?w=200&q=80", href: "/search?category=essentials" },
                { name: locale === "bg" ? "Спорт" : "Sports", image: "https://images.unsplash.com/photo-1461896836934-afa09e87b19e?w=200&q=80", href: "/search?category=sports" },
                { name: locale === "bg" ? "Разпродажба" : "Clearance", image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=200&q=80", href: "/todays-deals", highlight: true },
              ].map((cat, idx) => (
                <Link 
                  key={idx} 
                  href={cat.href}
                  className="group flex flex-col items-center gap-1.5 sm:gap-2 touch-action-manipulation active:scale-95 transition-transform"
                >
                  <div className={cn(
                    "relative size-14 sm:size-16 md:size-20 rounded-full overflow-hidden",
                    "border-2 border-border group-hover:border-primary transition-all duration-200",
                    cat.highlight && "bg-brand-warning border-brand-warning group-hover:border-brand-warning"
                  )}>
                    {!cat.highlight ? (
                      <img 
                        src={cat.image} 
                        alt={cat.name}
                        className="size-full object-cover"
                      />
                    ) : (
                      <div className="size-full flex items-center justify-center bg-brand-warning">
                        <span className="text-brand-deal font-black text-[9px] sm:text-[10px] md:text-xs text-center leading-tight px-1">
                          {cat.name}
                        </span>
                      </div>
                    )}
                  </div>
                  {!cat.highlight && (
                    <span className="text-[10px] sm:text-xs text-foreground group-hover:text-primary font-medium text-center transition-colors line-clamp-1">
                      {cat.name}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* More Ways to Shop - Horizontal scroll on mobile, Bento grid on desktop */}
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
              className="group relative w-[42vw] min-w-[42vw] h-44 shrink-0 snap-start rounded-lg overflow-hidden bg-linear-to-br from-rose-500 to-rose-600 sm:w-auto sm:min-w-0 sm:col-span-2 lg:col-span-1 lg:row-span-2 sm:h-auto sm:min-h-80 lg:min-h-full"
            >
              <img 
                src="https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=800&q=80" 
                alt={locale === "bg" ? "Нови продукти" : "New Arrivals"}
                className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-60"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
              <div className="relative h-full flex flex-col justify-end p-3 sm:p-6">
                <span className="inline-block bg-white/20 text-white text-[10px] sm:text-xs font-medium px-2 py-0.5 sm:py-1 rounded-full w-fit mb-1.5 sm:mb-2 backdrop-blur-sm">
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
                <p className="text-white/70 text-[11px] sm:text-sm mb-1 sm:mb-2 line-clamp-1">
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
              className="group relative w-[42vw] min-w-[42vw] h-44 shrink-0 snap-start rounded-lg overflow-hidden bg-brand-success sm:w-auto sm:min-w-0 sm:h-auto sm:min-h-60"
            >
              <img 
                src="https://images.unsplash.com/photo-1512389142860-9c449e58a814?w=600&q=80" 
                alt={locale === "bg" ? "Празнични подаръци" : "Holiday Gifts"}
                className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-50"
              />
              <div className="absolute inset-0 bg-linear-to-t from-foreground/80 via-transparent to-transparent" />
              <div className="relative h-full flex flex-col justify-end p-3 sm:p-5">
                <h3 className="text-base sm:text-xl font-bold text-white mb-0.5 sm:mb-1 line-clamp-1">
                  {locale === "bg" ? "Празнични подаръци" : "Holiday gifts"}
                </h3>
                <p className="text-white/70 text-[11px] sm:text-sm mb-1 sm:mb-2 line-clamp-1">
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
              className="group relative w-[42vw] min-w-[42vw] h-44 shrink-0 snap-start rounded-lg overflow-hidden bg-brand-warning sm:w-auto sm:min-w-0 sm:h-auto sm:min-h-60"
            >
              <img 
                src="https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&q=80" 
                alt={locale === "bg" ? "За дома" : "Home Essentials"}
                className="absolute inset-0 w-full h-full object-cover mix-blend-multiply opacity-60"
              />
              <div className="absolute inset-0 bg-linear-to-t from-foreground/70 via-transparent to-transparent" />
              <div className="relative h-full flex flex-col justify-end p-3 sm:p-5">
                <h3 className="text-base sm:text-xl font-bold text-white mb-0.5 sm:mb-1 line-clamp-1">
                  {locale === "bg" ? "За уютен дом" : "Home essentials"}
                </h3>
                <p className="text-white/70 text-[11px] sm:text-sm mb-1 sm:mb-2 line-clamp-1">
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
              className="group relative w-[42vw] min-w-[42vw] h-44 shrink-0 snap-start rounded-lg overflow-hidden bg-primary sm:w-auto sm:min-w-0 sm:h-auto sm:min-h-60"
            >
              <img 
                src="https://images.unsplash.com/photo-1596462502278-27bfdd403348?w=600&q=80" 
                alt={locale === "bg" ? "Красота" : "Beauty"}
                className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-60"
              />
              <div className="absolute inset-0 bg-linear-to-t from-foreground/70 via-transparent to-transparent" />
              <div className="relative h-full flex flex-col justify-end p-3 sm:p-5">
                <h3 className="text-base sm:text-xl font-bold text-white mb-0.5 sm:mb-1 line-clamp-1">
                  {locale === "bg" ? "Красота и грижа" : "Beauty favorites"}
                </h3>
                <p className="text-white/70 text-[11px] sm:text-sm mb-1 sm:mb-2 line-clamp-1">
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
            <div className="bg-linear-to-r from-primary to-primary/90 rounded-lg p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-center sm:text-left">
                <h3 className="text-lg sm:text-xl font-bold text-primary-foreground mb-1">
                  {locale === "bg" ? "Влез в акаунта си" : "Sign in for the best experience"}
                </h3>
                <p className="text-primary-foreground/80 text-sm">
                  {locale === "bg" ? "Персонализирани препоръки и по-бързо пазаруване" : "Personalized recommendations and faster checkout"}
                </p>
              </div>
              <Link href="/auth/login">
                <Button className="min-h-12 px-8 bg-white hover:bg-muted text-primary text-sm font-semibold rounded-full touch-action-manipulation active:scale-95 transition-transform">
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
