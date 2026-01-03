import { routing, validateLocale } from "@/i18n/routing"
import { setRequestLocale } from "next-intl/server"
import { getCategoryHierarchy } from "@/lib/data/categories"
import { getNewestProducts, toUI } from "@/lib/data/products"
import { MobileHomeTabs } from "@/components/mobile/mobile-home-tabs"

// =============================================================================
// CATEGORIES INDEX PAGE — Browse All Categories
// 
// Uses MobileHomeTabs with l0Style="pills" for:
// - Quick L0 category pills at the top (NOT tabs like homepage)
// - Same category circles as homepage for L1/L2 navigation
// - Filter + Sort toolbar (MobileFilters + SortSelect)
// - Same instant client-side navigation as homepage
// 
// This is NOT a static grid - it's a full shopping/browsing experience.
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
  // L0 + L1 + L2 in one call (L3 lazy-loaded when L2 is clicked).
  const categoriesWithChildren = await getCategoryHierarchy(null, 2)

  // Fetch initial products for the feed
  const newestProducts = await getNewestProducts(12)
  const initialProducts = newestProducts.map(p => toUI(p))

  return (
    <MobileHomeTabs 
      initialProducts={initialProducts} 
      initialCategories={categoriesWithChildren}
      showBanner={false}
      l0Style="pills"
      locale={locale}
    />
  )
}
