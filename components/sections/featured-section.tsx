import { getProducts, toUI } from '@/lib/data/products'
import { FeaturedProductsSection } from '@/components/featured-products-section'
import { getLocale } from 'next-intl/server'

/**
 * Async server component that fetches featured/recommended products.
 * Falls back to bestsellers if no featured products exist.
 */
export async function FeaturedSection() {
  const locale = await getLocale()
  
  // Try featured first, fall back to bestsellers
  let products = await getProducts('featured', 12)
  
  if (products.length === 0) {
    products = await getProducts('bestsellers', 12)
  }
  
  // Don't render if no products
  if (products.length === 0) {
    return null
  }
  
  // Transform to UI format
  const transformedProducts = products.map(toUI)
  
  return (
    <FeaturedProductsSection
      title={locale === "bg" ? "Препоръчани продукти" : "Recommended Products"}
      subtitle={locale === "bg" ? "Топ продавачи и промотирани обяви" : "From top sellers & boosted listings"}
      products={transformedProducts}
      ctaText={locale === "bg" ? "Виж всички" : "View all"}
      ctaHref="/search?featured=true"
    />
  )
}
