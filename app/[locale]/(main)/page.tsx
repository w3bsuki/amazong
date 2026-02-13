import { Suspense } from "react"
import type { Metadata } from "next"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { MobileHome } from "./_components/mobile-home"
import { 
  getNewestProducts, 
  getBoostedProducts, 
  getDealsProducts,
  getCategoryRowProducts,
  toUI 
} from "@/lib/data/products"
import { getCategoryHierarchy } from "@/lib/data/categories"
import { 
  DesktopHome, 
  DesktopHomeSkeleton 
} from "./_components/desktop-home"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Home" })
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
}

// =============================================================================
// Main Page Component
// =============================================================================

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations("Home")

  // Fetch categories with children for mobile subcategory circles.
  // L0 + L1 + L2 only (~3,400 categories, ~60KB gzipped).
  // L3 (~9,700 categories) are lazy-loaded when L2 is clicked.
  const categoriesWithChildren = await getCategoryHierarchy(null, 2)

  // Fetch initial products for mobile tabs (newest) AND promoted listings
  // Also fetch curated category sections in parallel
  const [
    newestProducts, 
    boostedProducts,
    dealsProducts,
    fashionProducts,
    electronicsProducts,
    automotiveProducts,
  ] = await Promise.all([
    getNewestProducts(24),
    getBoostedProducts(24), // Promoted listings (client filters expired boosts)
    getDealsProducts(10),   // Today's Offers section
    getCategoryRowProducts("fashion", 10),      // Fashion section
    getCategoryRowProducts("electronics", 10),  // Electronics section
    getCategoryRowProducts("automotive", 10),   // Automotive section
  ])

  const initialProducts = newestProducts.map(p => toUI(p))
  const promotedProducts = boostedProducts.map(p => toUI(p))
  
  // Curated sections data
  const curatedSections = {
    deals: dealsProducts.map(p => toUI(p)),
    fashion: fashionProducts.map(p => toUI(p)),
    electronics: electronicsProducts.map(p => toUI(p)),
    automotive: automotiveProducts.map(p => toUI(p)),
  }

  return (
    <div className="flex flex-col md:pb-0">
      <h1 className="sr-only">{t("metaTitle")}</h1>

      {/* 
        MOBILE LAYOUT (Demo-style unified header):
        - Unified sticky header: Hamburger + Logo + Search + Category Pills
        - Filter/Sort bar with drawer triggers
        - Product Feed with real data
        - Uses existing MobileTabBar from layout
      */}
      <div className="w-full md:hidden">
        <Suspense fallback={<div className="h-screen w-full bg-background animate-pulse" />}>
          <MobileHome
            initialProducts={initialProducts.slice(0, 12)}
            promotedProducts={promotedProducts}
            curatedSections={curatedSections}
            initialCategories={categoriesWithChildren}
            locale={locale}
          />
        </Suspense>
      </div>

      {/* ================================================================
          DESKTOP: Desktop Home
          - Unified header + content in one seamless container
          - Slim top bar with logo + user actions
          - Category sidebar + filters + product grid
          ================================================================ */}
      <div className="hidden md:block w-full">
        <Suspense fallback={<DesktopHomeSkeleton />}>
          <DesktopHome
            locale={locale}
            categories={categoriesWithChildren}
            initialProducts={initialProducts}
            promotedProducts={promotedProducts}
            curatedSections={curatedSections}
          />
        </Suspense>
      </div>
    </div>
  )
}

