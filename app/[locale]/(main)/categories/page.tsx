import { routing, validateLocale } from "@/i18n/routing"
import { setRequestLocale } from "next-intl/server"
import { getCategoryHierarchy } from "@/lib/data/categories"
import { getNewestProducts, toUI } from "@/lib/data/products"
import { MobileHomeTabs } from "@/components/mobile/mobile-home-tabs"

// =============================================================================
// CATEGORIES INDEX PAGE — Browse All Categories
// 
// Uses same MobileHomeTabs as homepage for instant client-side navigation.
// No page flashes - all category switching is client-side state.
// =============================================================================

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function CategoriesPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale: localeParam } = await params
  const locale = validateLocale(localeParam)
  setRequestLocale(locale)

  // Fetch categories WITH children for subcategory circles + pills.
  // L0 + L1 + L2 + L3 in one call (keeps tabs fully server-driven).
  const categoriesWithChildren = await getCategoryHierarchy(null, 3)

  // Fetch initial products
  const newestProducts = await getNewestProducts(12)
  const initialProducts = newestProducts.map(p => toUI(p))

  return (
    <MobileHomeTabs 
      initialProducts={initialProducts} 
      initialCategories={categoriesWithChildren}
      showBanner={false}
    />
  )
}
