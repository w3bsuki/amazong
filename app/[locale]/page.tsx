import { Button } from "@/components/ui/button"
import { HeroCarousel } from "@/components/hero-carousel"
import { ProductCard } from "@/components/product-card"
import { Card } from "@/components/ui/card"
import { Link } from "@/i18n/routing"
import { createClient } from "@/lib/supabase/server"
import { CategoryCircles } from "@/components/category-circles"
import { DailyDealsBanner } from "@/components/daily-deals-banner"
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
  const tProduct = await getTranslations('Product')

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

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: locale === 'bg' ? 'BGN' : 'EUR',
    }).format(price)
  }

  return (
    <main className="flex min-h-screen flex-col items-center bg-slate-100 pb-10">
      <WelcomeToast />
      <HeroCarousel locale={locale} />

      {/* Main Content Container - overlaps hero like Amazon */}
      <div className={cn(
        "w-full max-w-[1500px] relative z-10 mb-6",
        // Mobile: No horizontal padding, full bleed categories
        "px-0",
        // Desktop: Horizontal padding
        "sm:px-3",
        // Mobile: Minimal overlap, categories sit right at hero edge
        "-mt-6",
        // Desktop: More overlap for Amazon-style effect
        "sm:-mt-28 md:-mt-32"
      )}>
        
        {/* Category Circles - Horizontal scrollable categories */}
        <div className="mb-2 sm:mb-4">
          <CategoryCircles locale={locale} />
        </div>

        {/* Daily Deals Banner */}
        <div className="mb-4 px-3 sm:px-0">
          <DailyDealsBanner locale={locale} />
        </div>

        {/* Category Grid with Subcategories */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 px-3 sm:px-0">
          {/* Computers Card */}
          <div className="bg-white rounded border border-slate-200 p-2 sm:p-3">
            <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-1.5 sm:mb-2">
              {locale === "bg" ? "Компютри" : "Computers"}
            </h3>
            <div className="grid grid-cols-2 gap-1 sm:gap-1.5">
              <Link href="/search?category=laptops" className="group">
                <div className="h-[55px] sm:h-[85px] rounded overflow-hidden bg-slate-100">
                  <img src="https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300&q=80" alt="Laptops" className="object-cover w-full h-full" />
                </div>
                <span className="text-[10px] sm:text-xs text-slate-700 group-hover:text-blue-600 block mt-0.5">{locale === "bg" ? "Лаптопи" : "Laptops"}</span>
              </Link>
              <Link href="/search?category=desktops" className="group">
                <div className="h-[55px] sm:h-[85px] rounded overflow-hidden bg-slate-100">
                  <img src="https://images.unsplash.com/photo-1593062096033-9a26b09da705?w=300&q=80" alt="Desktops" className="object-cover w-full h-full" />
                </div>
                <span className="text-[10px] sm:text-xs text-slate-700 group-hover:text-blue-600 block mt-0.5">{locale === "bg" ? "Настолни" : "Desktops"}</span>
              </Link>
              <Link href="/search?category=monitors" className="group">
                <div className="h-[55px] sm:h-[85px] rounded overflow-hidden bg-slate-100">
                  <img src="https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=300&q=80" alt="Monitors" className="object-cover w-full h-full" />
                </div>
                <span className="text-[10px] sm:text-xs text-slate-700 group-hover:text-blue-600 block mt-0.5">{locale === "bg" ? "Монитори" : "Monitors"}</span>
              </Link>
              <Link href="/search?category=accessories" className="group">
                <div className="h-[55px] sm:h-[85px] rounded overflow-hidden bg-slate-100">
                  <img src="https://images.unsplash.com/photo-1625723044792-44de16ccb4e9?w=300&q=80" alt="Accessories" className="object-cover w-full h-full" />
                </div>
                <span className="text-[10px] sm:text-xs text-slate-700 group-hover:text-blue-600 block mt-0.5">{locale === "bg" ? "Аксесоари" : "Accessories"}</span>
              </Link>
            </div>
            <Link href="/search?category=computers" className="text-blue-600 hover:underline text-[10px] sm:text-xs mt-1.5 block">
              {t('sections.seeMore')}
            </Link>
          </div>

          {/* Home & Kitchen Card */}
          <div className="bg-white rounded border border-slate-200 p-2 sm:p-3">
            <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-1.5 sm:mb-2">
              {locale === "bg" ? "Дом и кухня" : "Home"}
            </h3>
            <div className="grid grid-cols-2 gap-1 sm:gap-1.5">
              <Link href="/search?category=kitchen" className="group">
                <div className="h-[55px] sm:h-[85px] rounded overflow-hidden bg-slate-100">
                  <img src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&q=80" alt="Kitchen" className="object-cover w-full h-full" />
                </div>
                <span className="text-[10px] sm:text-xs text-slate-700 group-hover:text-blue-600 block mt-0.5">{locale === "bg" ? "Кухня" : "Kitchen"}</span>
              </Link>
              <Link href="/search?category=furniture" className="group">
                <div className="h-[55px] sm:h-[85px] rounded overflow-hidden bg-slate-100">
                  <img src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=300&q=80" alt="Furniture" className="object-cover w-full h-full" />
                </div>
                <span className="text-[10px] sm:text-xs text-slate-700 group-hover:text-blue-600 block mt-0.5">{locale === "bg" ? "Мебели" : "Furniture"}</span>
              </Link>
              <Link href="/search?category=bedding" className="group">
                <div className="h-[55px] sm:h-[85px] rounded overflow-hidden bg-slate-100">
                  <img src="https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=300&q=80" alt="Bedding" className="object-cover w-full h-full" />
                </div>
                <span className="text-[10px] sm:text-xs text-slate-700 group-hover:text-blue-600 block mt-0.5">{locale === "bg" ? "Спално бельо" : "Bedding"}</span>
              </Link>
              <Link href="/search?category=decor" className="group">
                <div className="h-[55px] sm:h-[85px] rounded overflow-hidden bg-slate-100">
                  <img src="https://images.unsplash.com/photo-1513694203232-719a280e022f?w=300&q=80" alt="Decor" className="object-cover w-full h-full" />
                </div>
                <span className="text-[10px] sm:text-xs text-slate-700 group-hover:text-blue-600 block mt-0.5">{locale === "bg" ? "Декорация" : "Decor"}</span>
              </Link>
            </div>
            <Link href="/search?category=home" className="text-blue-600 hover:underline text-[10px] sm:text-xs mt-1.5 block">
              {t('sections.seeMore')}
            </Link>
          </div>

          {/* Fashion Card */}
          <div className="bg-white rounded border border-slate-200 p-2 sm:p-3">
            <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-1.5 sm:mb-2">
              {locale === "bg" ? "Мода" : "Fashion"}
            </h3>
            <div className="grid grid-cols-2 gap-1 sm:gap-1.5">
              <Link href="/search?category=women" className="group">
                <div className="h-[55px] sm:h-[85px] rounded overflow-hidden bg-slate-100">
                  <img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=300&q=80" alt="Women" className="object-cover w-full h-full" />
                </div>
                <span className="text-[10px] sm:text-xs text-slate-700 group-hover:text-blue-600 block mt-0.5">{locale === "bg" ? "Дамски" : "Women"}</span>
              </Link>
              <Link href="/search?category=men" className="group">
                <div className="h-[55px] sm:h-[85px] rounded overflow-hidden bg-slate-100">
                  <img src="https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=300&q=80" alt="Men" className="object-cover w-full h-full" />
                </div>
                <span className="text-[10px] sm:text-xs text-slate-700 group-hover:text-blue-600 block mt-0.5">{locale === "bg" ? "Мъжки" : "Men"}</span>
              </Link>
              <Link href="/search?category=shoes" className="group">
                <div className="h-[55px] sm:h-[85px] rounded overflow-hidden bg-slate-100">
                  <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&q=80" alt="Shoes" className="object-cover w-full h-full" />
                </div>
                <span className="text-[10px] sm:text-xs text-slate-700 group-hover:text-blue-600 block mt-0.5">{locale === "bg" ? "Обувки" : "Shoes"}</span>
              </Link>
              <Link href="/search?category=bags" className="group">
                <div className="h-[55px] sm:h-[85px] rounded overflow-hidden bg-slate-100">
                  <img src="https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=300&q=80" alt="Bags" className="object-cover w-full h-full" />
                </div>
                <span className="text-[10px] sm:text-xs text-slate-700 group-hover:text-blue-600 block mt-0.5">{locale === "bg" ? "Чанти" : "Bags"}</span>
              </Link>
            </div>
            <Link href="/search?category=fashion" className="text-blue-600 hover:underline text-[10px] sm:text-xs mt-1.5 block">
              {t('sections.seeMore')}
            </Link>
          </div>

          {/* Beauty Card */}
          <div className="bg-white rounded border border-slate-200 p-2 sm:p-3">
            <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-1.5 sm:mb-2">
              {locale === "bg" ? "Красота" : "Beauty"}
            </h3>
            <div className="grid grid-cols-2 gap-1 sm:gap-1.5">
              <Link href="/search?category=skincare" className="group">
                <div className="h-[55px] sm:h-[85px] rounded overflow-hidden bg-slate-100">
                  <img src="https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=300&q=80" alt="Skincare" className="object-cover w-full h-full" />
                </div>
                <span className="text-[10px] sm:text-xs text-slate-700 group-hover:text-blue-600 block mt-0.5">{locale === "bg" ? "Грижа" : "Skincare"}</span>
              </Link>
              <Link href="/search?category=makeup" className="group">
                <div className="h-[55px] sm:h-[85px] rounded overflow-hidden bg-slate-100">
                  <img src="https://images.unsplash.com/photo-1596462502278-27bfdd403348?w=300&q=80" alt="Makeup" className="object-cover w-full h-full" />
                </div>
                <span className="text-[10px] sm:text-xs text-slate-700 group-hover:text-blue-600 block mt-0.5">{locale === "bg" ? "Грим" : "Makeup"}</span>
              </Link>
              <Link href="/search?category=haircare" className="group">
                <div className="h-[55px] sm:h-[85px] rounded overflow-hidden bg-slate-100">
                  <img src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=300&q=80" alt="Haircare" className="object-cover w-full h-full" />
                </div>
                <span className="text-[10px] sm:text-xs text-slate-700 group-hover:text-blue-600 block mt-0.5">{locale === "bg" ? "Коса" : "Haircare"}</span>
              </Link>
              <Link href="/search?category=fragrance" className="group">
                <div className="h-[55px] sm:h-[85px] rounded overflow-hidden bg-slate-100">
                  <img src="https://images.unsplash.com/photo-1541643600914-78b084683601?w=300&q=80" alt="Fragrance" className="object-cover w-full h-full" />
                </div>
                <span className="text-[10px] sm:text-xs text-slate-700 group-hover:text-blue-600 block mt-0.5">{locale === "bg" ? "Парфюми" : "Fragrance"}</span>
              </Link>
            </div>
            <Link href="/search?category=beauty" className="text-blue-600 hover:underline text-[10px] sm:text-xs mt-1.5 block">
              {t('sections.seeMore')}
            </Link>
          </div>
        </div>

        {/* Featured Products Row */}
        <div className="mt-4 sm:mt-6 bg-white p-3 sm:p-6 rounded border border-slate-200 mx-3 sm:mx-0">
          <div className="flex items-center justify-between mb-3 sm:mb-5">
            <h2 className="text-base sm:text-xl font-bold text-slate-900">{t('sections.topPicks')}</h2>
            <Link
              href="/search?q=featured"
              className="text-blue-600 hover:text-blue-700 text-xs sm:text-sm font-medium transition-colors"
            >
              {t('sections.seeMore')}
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-2 sm:gap-5">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </div>

        {/* Deals of the Day - Horizontal Scroll */}
        <div className="mt-4 sm:mt-6 bg-white p-3 sm:p-6 rounded border border-slate-200 mx-3 sm:mx-0">
          <div className="flex items-center gap-2 sm:gap-4 mb-3 sm:mb-5">
            <h2 className="text-base sm:text-xl font-bold text-slate-900">{t('sections.dealsOfDay')}</h2>
            <Link
              href="/search?q=deals"
              className="text-blue-600 hover:text-blue-700 text-xs sm:text-sm font-medium transition-colors"
            >
              {t('sections.seeAllDeals')}
            </Link>
          </div>
          <div className="flex gap-2 sm:gap-5 overflow-x-auto pb-2 sm:pb-4 no-scrollbar snap-x-mandatory -mx-3 px-3 sm:mx-0 sm:px-0">
            {deals.map((deal) => (
              <Link
                key={deal.id}
                href={`/product/${deal.id}`}
                className="min-w-[140px] sm:min-w-[240px] flex flex-col gap-1.5 sm:gap-2 cursor-pointer group border border-transparent hover:border-blue-400 rounded p-1.5 sm:p-2 transition-colors snap-start tap-transparent active-scale"
              >
                <div className="bg-slate-50 p-1.5 sm:p-4 h-32 sm:h-60 flex items-center justify-center rounded">
                  <img
                    src={deal.image || "/placeholder.svg"}
                    alt={deal.title}
                    className="max-h-full object-contain mix-blend-multiply "
                  />
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2 mt-0.5 sm:mt-2">
                  <span className="bg-rose-600 text-white text-[9px] sm:text-xs font-bold px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-md">
                    {Math.round((1 - deal.price / deal.listPrice) * 100)}% off
                  </span>
                  <span className="text-rose-600 font-bold text-[9px] sm:text-xs">{tProduct('deal')}</span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-sm sm:text-xl font-bold text-slate-900">{formatPrice(deal.price)}</span>
                </div>
                <div className="text-[9px] sm:text-xs text-slate-500">
                  {tProduct('listPrice')}: <span className="line-through">{formatPrice(deal.listPrice)}</span>
                </div>
                <div className="text-[10px] sm:text-sm text-slate-800 line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {deal.title}
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* More Categories / Sign In */}
        <div className="mt-4 sm:mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 px-3 sm:px-0">
          {!user && (
            <Card className="bg-white rounded border border-slate-200 p-6 flex flex-col justify-center items-start h-[420px]">
              <h3 className="text-xl font-bold mb-4 text-slate-900">{t('sections.signIn')}</h3>
              <p className="text-sm text-slate-600 mb-4">Sign in for personalized recommendations and faster checkout.</p>
              <Link href="/auth/login" className="w-full">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium border-none rounded h-11 transition-colors">
                  {t('sections.signInSecurely')}
                </Button>
              </Link>
            </Card>
          )}

          <Card className="bg-white rounded border border-slate-200 p-5 flex flex-col h-[420px] overflow-hidden">
            <h3 className="text-xl font-bold mb-3 text-slate-900 truncate">{t('sections.shopByCategory')}</h3>
            <div className="grid grid-cols-2 gap-x-4 gap-y-3 flex-1 min-h-0">
              <Link href="/search?q=fashion" className="flex flex-col cursor-pointer group">
                <div className="relative w-full h-[120px] mb-1.5 overflow-hidden rounded-lg bg-slate-100">
                  <img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=300&q=80" alt="Fashion" className="object-cover w-full h-full " />
                </div>
                <span className="text-xs text-slate-700 group-hover:text-blue-600 transition-colors leading-tight truncate">{t('sections.fashion')}</span>
              </Link>
              <Link href="/search?q=toys" className="flex flex-col cursor-pointer group">
                <div className="relative w-full h-[120px] mb-1.5 overflow-hidden rounded-lg bg-slate-100">
                  <img src="https://images.unsplash.com/photo-1566576912902-48f5d9307bb1?w=300&q=80" alt="Toys" className="object-cover w-full h-full " />
                </div>
                <span className="text-xs text-slate-700 group-hover:text-blue-600 transition-colors leading-tight truncate">{t('sections.toys')}</span>
              </Link>
              <Link href="/search?q=beauty" className="flex flex-col cursor-pointer group">
                <div className="relative w-full h-[120px] mb-1.5 overflow-hidden rounded-lg bg-slate-100">
                  <img src="https://images.unsplash.com/photo-1596462502278-27bfdd403348?w=300&q=80" alt="Beauty" className="object-cover w-full h-full " />
                </div>
                <span className="text-xs text-slate-700 group-hover:text-blue-600 transition-colors leading-tight truncate">{t('sections.beauty')}</span>
              </Link>
              <Link href="/search?q=home" className="flex flex-col cursor-pointer group">
                <div className="relative w-full h-[120px] mb-1.5 overflow-hidden rounded-lg bg-slate-100">
                  <img src="https://images.unsplash.com/photo-1513694203232-719a280e022f?w=300&q=80" alt="Home" className="object-cover w-full h-full " />
                </div>
                <span className="text-xs text-slate-700 group-hover:text-blue-600 transition-colors leading-tight truncate">{t('sections.home')}</span>
              </Link>
            </div>
            <div className="mt-3 pt-0">
              <Link href="/search" className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors">
                {t('sections.seeMore')}
              </Link>
            </div>
          </Card>

          <Card className="bg-white rounded border border-slate-200 p-5 flex flex-col h-[420px]">
            <h3 className="text-xl font-bold mb-3 text-slate-900">{t('sections.newArrivals')}</h3>
            <Link href="/search?q=toys" className="flex-1 group overflow-hidden">
              <div className="relative w-full h-full overflow-hidden rounded-lg bg-slate-100">
                <img src="https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=600&q=80" alt="New Toys" className="object-cover w-full h-full " />
              </div>
            </Link>
            <div className="mt-auto pt-3">
              <Link
                href="/search?q=toys"
                className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
              >
                {t('sections.shopNow')}
              </Link>
            </div>
          </Card>

          <Card className="bg-white rounded border border-slate-200 p-5 flex flex-col h-[420px]">
            <h3 className="text-xl font-bold mb-3 text-slate-900">{t('sections.fashionTrends')}</h3>
            <Link href="/search?q=fashion" className="flex-1 group overflow-hidden">
              <div className="relative w-full h-full overflow-hidden rounded-lg bg-slate-100">
                <img
                  src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80"
                  alt="Fashion Trends"
                  className="object-cover w-full h-full "
                />
              </div>
            </Link>
            <div className="mt-auto pt-3">
              <Link
                href="/search?q=fashion"
                className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
              >
                {t('sections.seeMore')}
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </main>
  )
}
