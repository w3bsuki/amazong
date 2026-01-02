import { setRequestLocale } from "next-intl/server"
import { validateLocale } from "@/i18n/routing"
import { MobileCategoryTabs } from "@/components/category/mobile-category-tabs"
import { getRootCategoriesWithChildren } from "@/lib/data/categories"
import { getCategoryRootSlugMap } from "./_lib/categories-data"

// =============================================================================
// CATEGORIES LAYOUT
// 
// Wraps /categories and /categories/[slug] pages with:
// - Horizontal category tabs for quick navigation (mobile)
// - Consistent background styling
// =============================================================================

export default async function CategoriesLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale: localeParam } = await params
  const locale = validateLocale(localeParam)
  setRequestLocale(locale)

  // Fetch categories for the horizontal tab bar
  const categoriesWithChildren = await getRootCategoriesWithChildren()
  const rootCategories = categoriesWithChildren.map(c => c.category)
  
  // Build slug-to-root map for highlighting the correct tab when viewing subcategories
  const rootSlugBySlug = await getCategoryRootSlugMap()

  return (
    <div className="min-h-[calc(100vh-52px-50px)] bg-background">
      {/* Mobile Category Tabs - Horizontal scrollable tabs */}
      <div className="lg:hidden">
        <MobileCategoryTabs 
          categories={rootCategories} 
          locale={locale} 
          rootSlugBySlug={rootSlugBySlug}
        />
      </div>

      {/* Main Content Area */}
      <div className="min-w-0 overflow-x-hidden">
        {children}
      </div>
    </div>
  )
}
