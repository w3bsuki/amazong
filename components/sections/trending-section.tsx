import { getNewestProducts, getPromoProducts, getBestSellers } from '@/lib/data/products'
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
  
  // Transform to expected format for the client component
  const transformForUI = (products: Awaited<ReturnType<typeof getNewestProducts>>) => 
    products.map(p => ({
      id: p.id,
      title: p.title,
      price: p.price,
      listPrice: p.listPrice,
      image: p.image,
      rating: p.rating,
      reviews: p.reviews,
      isPrime: p.isPrime,
      createdAt: p.createdAt,
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
