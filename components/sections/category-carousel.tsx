import { cookies } from "next/headers"
import { type CarouselProduct } from "@/components/shared/product/product-carousel-section"
import { getProductsByCategorySlug, toUI, type Product, type ShippingZone } from "@/lib/data/products"
import { getCategoryIconForSlug } from "@/lib/category-icons"
import { MEGA_MENU_CONFIG } from "@/config/mega-menu-config"
import { getChildCategories, getCategoryBySlug } from "@/lib/data/categories"
import { CategoryCarouselClient } from "./category-carousel-client"

interface CategoryCarouselProps {
  locale: string
  categorySlug: string
  title: string
}

/**
 * Server component: Category Carousel
 * Shows a single category as a horizontal carousel section with subcategory tabs.
 */
export async function CategoryCarousel({ locale, categorySlug, title }: CategoryCarouselProps) {
  const cookieStore = await cookies()
  const userZone = (cookieStore.get("user-zone")?.value || "WW") as ShippingZone

  // Fetch initial products for the main category
  const products = await getProductsByCategorySlug(categorySlug, 18, userZone)

  // Get category ID to fetch children
  const category = await getCategoryBySlug(categorySlug)
  
  let tabs: { id: string; label: string }[] = []
  
  if (category) {
    // Get featured subcategories from config
    const config = MEGA_MENU_CONFIG[categorySlug]
    const featuredSlugs = config?.featured || []

    // Fetch all child categories to get their names/labels
    const allChildren = await getChildCategories(category.id)
    
    // Filter and format tabs
    tabs = [
      { id: "all", label: locale === "bg" ? "Всички" : "All" },
      ...allChildren
        .filter(cat => featuredSlugs.includes(cat.slug))
        .map(cat => ({
          id: cat.slug,
          label: locale === "bg" ? (cat.name_bg || cat.name) : cat.name
        }))
    ]
  }

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
    <CategoryCarouselClient
      locale={locale}
      categorySlug={categorySlug}
      title={title}
      initialProducts={transformForUI(products)}
      tabs={tabs}
      icon={<Icon size={20} weight="duotone" />}
    />
  )
}
