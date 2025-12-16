import { getGlobalDeals, toUI, type Product, type ShippingZone } from '@/lib/data/products'
import { ProductCarouselSection, type CarouselProduct } from '@/components/product-carousel-section'
import { getLocale } from 'next-intl/server'
import { cookies } from 'next/headers'

/**
 * Server component: Deals/Discounts Carousel
 * Shows products with discounts (list_price > price) in horizontal carousel
 */
export async function DealsCarousel() {
  const locale = await getLocale()
  const cookieStore = await cookies()
  const userZone = (cookieStore.get('user-zone')?.value || 'WW') as ShippingZone

  const products = await getGlobalDeals(18, userZone)

  const transformForUI = (products: Product[]): CarouselProduct[] =>
    products.map((p) => {
      const ui = toUI(p)
      return {
        id: ui.id,
        title: ui.title,
        price: ui.price,
        listPrice: ui.listPrice,
        image: ui.image,
        rating: ui.rating,
        reviews: ui.reviews,
        slug: ui.slug,
        storeSlug: ui.storeSlug,
        location: ui.location,
      }
    })

  return (
    <ProductCarouselSection
      title={locale === 'bg' ? 'Оферти на деня' : 'Deals of the Day'}
      products={transformForUI(products)}
      ctaText={locale === 'bg' ? 'Виж всички' : 'See all'}
      ctaHref="/todays-deals"
      emptyMessage={locale === 'bg' ? 'Няма налични оферти' : 'No deals available'}
    />
  )
}
