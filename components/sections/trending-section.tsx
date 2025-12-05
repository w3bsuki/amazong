import { getNewestProducts, getPromoProducts, getBestSellers, toUI, type Product } from '@/lib/data/products'
import { TrendingProductsSection } from '@/components/trending-products-section'
import { getLocale } from 'next-intl/server'

/**
 * Async server component that fetches trending products data.
 * Uses cached data functions - zone filtering happens client-side.
 */
export async function TrendingSection() {
  const locale = await getLocale()
  
  // Fetch all data in parallel using cached functions
  const [newestProducts, promoProducts, bestSellersProducts] = await Promise.all([
    getNewestProducts(12),
    getPromoProducts(12),
    getBestSellers(12),
  ])
  
  // Transform raw DB products to UI format using the toUI helper
  const transformForUI = (products: Product[]) => 
    products.map(p => ({
      ...toUI(p),
      createdAt: p.created_at ?? undefined,
    }))
  
  return (
    <TrendingProductsSection
      title={locale === "bg" ? "Открийте популярни продукти" : "Explore trending picks"}
      newestProducts={transformForUI(newestProducts)}
      promoProducts={transformForUI(promoProducts)}
      bestSellersProducts={transformForUI(bestSellersProducts)}
      ctaText={locale === "bg" ? "Виж всички" : "Shop all"}
      ctaHref="/search"
    />
  )
}
