import { getNewestProducts, toCarouselProducts, type ShippingZone } from '@/lib/data/products'
import { ProductCarouselSection } from '@/components/shared/product/product-carousel-section'
import { getLocale } from 'next-intl/server'
import { cookies } from 'next/headers'
import { TrendUp } from '@phosphor-icons/react/dist/ssr'

/**
 * Server component: Newest Products Carousel
 * Fetches newest listings and displays in horizontal carousel
 */
export async function NewestCarousel() {
  const locale = await getLocale()
  const cookieStore = await cookies()
  const userZone = (cookieStore.get('user-zone')?.value || 'WW') as ShippingZone

  const products = await getNewestProducts(18, userZone)

  return (
    <ProductCarouselSection
      title={locale === 'bg' ? 'Най-нови обяви' : 'Newest Listings'}
      products={toCarouselProducts(products)}
      ctaText={locale === 'bg' ? 'Виж всички' : 'See all'}
      ctaHref="/search?sort=newest"
      emptyMessage={locale === 'bg' ? 'Няма нови обяви' : 'No new listings'}
      icon={<TrendUp size={20} weight="bold" />}
    />
  )
}
