import { getProducts, toUI, type ShippingZone } from '@/lib/data/products'
import { FeaturedProductsSection } from '@/components/featured-products-section'
import { getLocale } from 'next-intl/server'
import { cookies } from 'next/headers'

/**
 * Async server component that fetches featured/recommended products.
 * Falls back to bestsellers if no featured products exist.
 * Filters by user's selected shipping zone (from header dropdown).
 */
export async function FeaturedSection() {
  const locale = await getLocale()
  
  // Read user's shipping zone from cookie (set by header "Доставка до" dropdown)
  const cookieStore = await cookies()
  const userZone = (cookieStore.get('user-zone')?.value || 'WW') as ShippingZone
  
  // Fetch extra to have enough after other UI slicing
  let products = await getProducts('featured', 36, userZone)
  
  if (products.length === 0) {
    products = await getProducts('bestsellers', 36, userZone)
  }
  
  // DB already applied zone filtering; just slice for layout
  const zonedProducts = products.slice(0, 12)
  
  // Don't render if no products after filtering
  if (zonedProducts.length === 0) {
    return null
  }
  
  // Transform to UI format
  const transformedProducts = zonedProducts.map(toUI)
  
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
