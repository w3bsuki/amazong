import { getGlobalDeals, toCarouselProducts, type ShippingZone } from '@/lib/data/products'
import { ProductCarouselSection } from '@/components/shared/product/product-carousel-section'
import { getLocale } from 'next-intl/server'
import { cookies } from 'next/headers'
import { Tag } from '@phosphor-icons/react/dist/ssr'

/**
 * Server component: Deals/Discounts Carousel
 * Shows products with discounts (list_price > price) in horizontal carousel
 */
export async function DealsCarousel() {
  const locale = await getLocale()
  const cookieStore = await cookies()
  const userZone = (cookieStore.get('user-zone')?.value || 'WW') as ShippingZone

  const products = await getGlobalDeals(18, userZone)

  return (
    <ProductCarouselSection
      title={locale === 'bg' ? 'Оферти на деня' : 'Deals of the Day'}
      products={toCarouselProducts(products)}
      ctaText={locale === 'bg' ? 'Виж всички' : 'See all'}
      ctaHref="/todays-deals"
      emptyMessage={locale === 'bg' ? 'Няма налични оферти' : 'No deals available'}
      icon={<Tag size={20} weight="fill" />}
    />
  )
}
