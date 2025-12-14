import { getPromoProducts, getBestSellers, getNewestProducts, toUI, type Product, type ShippingZone } from '@/lib/data/products'
import { TrendingProductsSection } from '@/components/trending-products-section'
import { getLocale } from 'next-intl/server'
import { cookies } from 'next/headers'

/**
 * Async server component that fetches trending products data.
 * Filters by user's selected shipping zone (from header dropdown).
 * v2 - Fixed to use getNewestProducts instead of getFeaturedProducts
 */
export async function TrendingSection() {
  const locale = await getLocale()
  
  // Read user's shipping zone from cookie (set by header "Доставка до" dropdown)
  const cookieStore = await cookies()
  const userZone = (cookieStore.get('user-zone')?.value || 'WW') as ShippingZone
  
  // Fetch extra to have enough after other UI slicing
  const [newestProducts, promoProducts, bestSellersProducts] = await Promise.all([
    getNewestProducts(36, userZone),
    getPromoProducts(36, userZone),
    getBestSellers(36, userZone),
  ])

  // DB already applied zone filtering; just slice for layout
  const zonedNewest = newestProducts.slice(0, 12)
  const zonedPromo = promoProducts.slice(0, 12)
  const zonedBestSellers = bestSellersProducts.slice(0, 12)
  
  // Transform raw DB products to UI format using the toUI helper
  const transformForUI = (products: Product[]) => 
    products.map(p => ({
      ...toUI(p),
      createdAt: p.created_at ?? undefined,
    }))
  
  return (
    <TrendingProductsSection
      title={locale === "bg" ? "Промотирани" : "Promoted"}
      newestProducts={transformForUI(zonedNewest)}
      promoProducts={transformForUI(zonedPromo)}
      bestSellersProducts={transformForUI(zonedBestSellers)}
      ctaText={locale === "bg" ? "Виж всички" : "Shop all"}
      ctaHref="/search?sort=newest"
      bannerTone="trust"
    />
  )
}
