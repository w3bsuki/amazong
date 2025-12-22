import { cookies } from "next/headers"
import { ProductCarouselSection, type CarouselProduct } from "@/components/shared/product/product-carousel-section"
import { getProductsByCategorySlug, toUI, type Product, type ShippingZone } from "@/lib/data/products"
import { getCategoryIconForSlug } from "@/lib/category-icons"

interface CategoryCarouselProps {
  locale: string
  categorySlug: string
  title: string
}

/**
 * Server component: Category Carousel
 * Shows a single category as a horizontal carousel section.
 * UI is identical across categories (reuses ProductCarouselSection).
 */
export async function CategoryCarousel({ locale, categorySlug, title }: CategoryCarouselProps) {
  const cookieStore = await cookies()
  const userZone = (cookieStore.get("user-zone")?.value || "WW") as ShippingZone

  const products = await getProductsByCategorySlug(categorySlug, 18, userZone)

  const transformForUI = (items: Product[]): CarouselProduct[] =>
    items.map((p) => {
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

  const Icon = getCategoryIconForSlug(categorySlug)

  return (
    <ProductCarouselSection
      title={title}
      products={transformForUI(products)}
      ctaText={locale === "bg" ? "Виж всички" : "See all"}
      ctaHref={`/categories/${categorySlug}`}
      emptyMessage={locale === "bg" ? "Няма обяви в тази категория" : "No listings in this category"}
      icon={<Icon size={20} weight="duotone" />}
    />
  )
}
