import { Button } from "@/components/ui/button"
import { HeroCarousel } from "@/components/hero-carousel"
import { ProductCard } from "@/components/product-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Link } from "@/i18n/routing"
import { createClient } from "@/lib/supabase/server"

import { WelcomeToast } from "@/components/welcome-toast"
import { getTranslations, getLocale } from "next-intl/server"

export default async function Home() {
  const supabase = await createClient()
  const locale = await getLocale()

  interface Category {
    title: string
    image: string
    link: string
  }

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

  let categories: Category[] = []

  let featuredProducts: Product[] = []

  let deals: Deal[] = []

  try {
    if (supabase) {
      const { data: authData } = await supabase.auth.getUser()
      user = authData?.user || null

      // Fetch Categories
      const { data: categoriesData } = await supabase
        .from('categories')
        .select('*')
        .limit(4)

      if (categoriesData && categoriesData.length > 0) {
        categories = categoriesData.map((c: any) => ({
          title: c.name,
          image: c.image_url,
          link: `/search?category=${c.slug}`
        }))
      }

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
    <main className="flex min-h-screen flex-col items-center bg-slate-50 pb-10">
      <WelcomeToast />
      <HeroCarousel />

      {/* Category Grid - Overlapping the Hero */}
      <div className="w-full max-w-[1600px] px-4 -mt-20 sm:-mt-32 md:-mt-60 z-10 relative mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((category, i) => (
            <Card
              key={i}
              className="bg-white rounded-lg border-slate-200 shadow-md flex flex-col h-[380px] sm:h-[420px] p-5 cursor-pointer transition-colors duration-200"
            >
              <CardHeader className="p-0 mb-3">
                <CardTitle className="text-xl font-bold text-slate-900 leading-tight">{category.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 p-0 flex flex-col">
                <Link href={category.link} className="flex flex-col h-full group">
                  <div className="relative flex-1 w-full mb-3 overflow-hidden rounded">
                    <img
                      src={category.image || "/placeholder.svg"}
                      alt={category.title}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <span className="text-cyan-700 group-hover:text-amber-600 group-hover:underline text-sm font-medium mt-auto transition-colors">
                    {t('sections.seeMore')}
                  </span>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Featured Products Row */}
        <div className="mt-6 bg-white p-5 shadow-sm rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-900">{t('sections.topPicks')}</h2>
            <Link
              href="/search?q=featured"
              className="text-cyan-700 hover:text-amber-600 hover:underline text-sm font-medium transition-colors"
            >
              {t('sections.seeMore')}
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </div>

        {/* Deals of the Day - Horizontal Scroll */}
        <div className="mt-6 bg-white p-5 shadow-sm rounded-lg">
          <div className="flex items-center gap-4 mb-4">
            <h2 className="text-xl font-bold text-slate-900">{t('sections.dealsOfDay')}</h2>
            <Link
              href="/search?q=deals"
              className="text-cyan-700 hover:text-amber-600 hover:underline text-sm font-medium transition-colors"
            >
              {t('sections.seeAllDeals')}
            </Link>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
            {deals.map((deal) => (
              <Link
                key={deal.id}
                href={`/product/${deal.id}`}
                className="min-w-[240px] flex flex-col gap-2 cursor-pointer group"
              >
                <div className="bg-[#f7f7f7] p-4 h-[240px] flex items-center justify-center rounded-sm">
                  <img
                    src={deal.image || "/placeholder.svg"}
                    alt={deal.title}
                    className="max-h-full object-contain mix-blend-multiply"
                  />
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="bg-[#cc0c39] text-white text-xs font-bold px-2 py-1 rounded-[2px]">
                    {Math.round((1 - deal.price / deal.listPrice) * 100)}% off
                  </span>
                  <span className="text-[#cc0c39] font-bold text-xs">{tProduct('deal')}</span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-[21px] font-bold text-[#0F1111]">{formatPrice(deal.price)}</span>
                </div>
                <div className="text-[12px] text-[#565959]">
                  {tProduct('listPrice')}: <span className="line-through">{formatPrice(deal.listPrice)}</span>
                </div>
                <div className="text-[13px] text-[#0F1111] line-clamp-2 group-hover:text-[#c7511f] group-hover:underline">
                  {deal.title}
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* More Categories / Sign In */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {!user && (
            <Card className="bg-white rounded-[4px] border-none shadow-md p-5 flex flex-col justify-center items-start h-[420px]">
              <h3 className="text-[21px] font-bold mb-3 text-[#0F1111]">{t('sections.signIn')}</h3>
              <Link href="/auth/login" className="w-full">
                <Button className="w-full bg-[#f7ca00] hover:bg-[#f2bd00] text-black text-[13px] border-none mb-3 shadow-sm rounded-[8px] h-[29px]">
                  {t('sections.signInSecurely')}
                </Button>
              </Link>
            </Card>
          )}

          <Card className="bg-white rounded-[4px] border-none shadow-md p-5 flex flex-col h-[420px] overflow-hidden">
            <h3 className="text-[21px] font-bold mb-3 text-[#0F1111] truncate">{t('sections.shopByCategory')}</h3>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 flex-1 min-h-0">
              <Link href="/search?q=fashion" className="flex flex-col cursor-pointer hover:opacity-80 group">
                <div className="relative w-full h-[120px] mb-1 overflow-hidden rounded-[2px] bg-gray-100">
                  <img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=300&q=80" alt="Fashion" className="object-cover w-full h-full" />
                </div>
                <span className="text-[12px] text-[#0F1111] group-hover:text-[#c7511f] group-hover:underline leading-tight truncate">{t('sections.fashion')}</span>
              </Link>
              <Link href="/search?q=toys" className="flex flex-col cursor-pointer hover:opacity-80 group">
                <div className="relative w-full h-[120px] mb-1 overflow-hidden rounded-[2px] bg-gray-100">
                  <img src="https://images.unsplash.com/photo-1566576912902-48f5d9307bb1?w=300&q=80" alt="Toys" className="object-cover w-full h-full" />
                </div>
                <span className="text-[12px] text-[#0F1111] group-hover:text-[#c7511f] group-hover:underline leading-tight truncate">{t('sections.toys')}</span>
              </Link>
              <Link href="/search?q=beauty" className="flex flex-col cursor-pointer hover:opacity-80 group">
                <div className="relative w-full h-[120px] mb-1 overflow-hidden rounded-[2px] bg-gray-100">
                  <img src="https://images.unsplash.com/photo-1596462502278-27bfdd403348?w=300&q=80" alt="Beauty" className="object-cover w-full h-full" />
                </div>
                <span className="text-[12px] text-[#0F1111] group-hover:text-[#c7511f] group-hover:underline leading-tight truncate">{t('sections.beauty')}</span>
              </Link>
              <Link href="/search?q=home" className="flex flex-col cursor-pointer hover:opacity-80 group">
                <div className="relative w-full h-[120px] mb-1 overflow-hidden rounded-[2px] bg-gray-100">
                  <img src="https://images.unsplash.com/photo-1513694203232-719a280e022f?w=300&q=80" alt="Home" className="object-cover w-full h-full" />
                </div>
                <span className="text-[12px] text-[#0F1111] group-hover:text-[#c7511f] group-hover:underline leading-tight truncate">{t('sections.home')}</span>
              </Link>
            </div>
            <div className="mt-2 pt-0">
              <Link href="/search" className="text-[#007185] hover:text-[#c7511f] hover:underline text-[13px] font-medium">
                {t('sections.seeMore')}
              </Link>
            </div>
          </Card>

          <Card className="bg-white rounded-[4px] border-none shadow-md p-5 flex flex-col h-[420px]">
            <h3 className="text-[21px] font-bold mb-3 text-[#0F1111]">{t('sections.newArrivals')}</h3>
            <Link href="/search?q=toys" className="flex-1 group overflow-hidden">
              <div className="relative w-full h-full overflow-hidden rounded-[2px] bg-gray-100">
                <img src="https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=600&q=80" alt="New Toys" className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105" />
              </div>
            </Link>
            <div className="mt-auto pt-3">
              <Link
                href="/search?q=toys"
                className="text-[#007185] hover:text-[#c7511f] hover:underline text-[13px] font-medium"
              >
                {t('sections.shopNow')}
              </Link>
            </div>
          </Card>

          <Card className="bg-white rounded-[4px] border-none shadow-md p-5 flex flex-col h-[420px]">
            <h3 className="text-[21px] font-bold mb-3 text-[#0F1111]">{t('sections.fashionTrends')}</h3>
            <Link href="/search?q=fashion" className="flex-1 group overflow-hidden">
              <div className="relative w-full h-full overflow-hidden rounded-[2px] bg-gray-100">
                <img
                  src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80"
                  alt="Fashion Trends"
                  className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                />
              </div>
            </Link>
            <div className="mt-auto pt-3">
              <Link
                href="/search?q=fashion"
                className="text-[#007185] hover:text-[#c7511f] hover:underline text-[13px] font-medium"
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
