import { getFeaturedProducts, toCarouselProducts, type ShippingZone } from '@/lib/data/products'
import { ProductCarouselSection } from '@/components/shared/product/product-carousel-section'
import { getLocale } from 'next-intl/server'
import { cookies } from 'next/headers'
import { Sparkle } from '@phosphor-icons/react/dist/ssr'

/**
 * Server component: Promoted Products Carousel
 * Shows boosted/promoted products in horizontal carousel
 */
export async function PromotedCarousel() {
  const locale = await getLocale()
  const cookieStore = await cookies()
  const userZone = (cookieStore.get('user-zone')?.value || 'WW') as ShippingZone

  // Featured = boosted products
  const products = await getFeaturedProducts(18, userZone)

  return (
    <ProductCarouselSection
      title={locale === 'bg' ? 'Промотирани' : 'Promoted'}
      products={toCarouselProducts(products, { isBoosted: true })}
      ctaText={locale === 'bg' ? 'Виж всички' : 'See all'}
      ctaHref="/search?promoted=true"
      emptyMessage={locale === 'bg' ? 'Няма промотирани обяви' : 'No promoted listings'}
      variant="highlighted"
      icon={<Sparkle size={20} weight="fill" />}
    />
  )
}
