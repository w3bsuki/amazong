import { getNewestProducts, toUI, type Product, type ShippingZone } from '@/lib/data/products'
import { ProductCarouselSection, type CarouselProduct } from '@/components/shared/product/product-carousel-section'
import { getLocale } from 'next-intl/server'
import { cookies } from 'next/headers'

/**
 * Server component: Newest Products Carousel
 * Fetches newest listings and displays in horizontal carousel
 */
export async function NewestCarousel() {
  const locale = await getLocale()
  const cookieStore = await cookies()
  const userZone = (cookieStore.get('user-zone')?.value || 'WW') as ShippingZone

  const products = await getNewestProducts(18, userZone)

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
      title={locale === 'bg' ? 'Най-нови обяви' : 'Newest Listings'}
      products={transformForUI(products)}
      ctaText={locale === 'bg' ? 'Виж всички' : 'See all'}
      ctaHref="/search?sort=newest"
      emptyMessage={locale === 'bg' ? 'Няма нови обяви' : 'No new listings'}
    />
  )
}
