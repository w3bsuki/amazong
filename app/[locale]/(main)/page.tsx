import { Suspense } from "react"
import type { Metadata } from "next"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { MobileHomeV4 } from "./_components/mobile-home-v4"
import { 
  getNewestProducts, 
  getBoostedProducts, 
  getDealsProducts,
  getCategoryRowProducts,
  toUI 
} from "@/lib/data/products"
import { getCategoryHierarchy } from "@/lib/data/categories"
import type { UIProduct } from "@/lib/types/products"
import { buildForYouPool } from "@/lib/home-v4-pools"
import { 
  DesktopHome, 
  DesktopHomeSkeleton 
} from "./_components/desktop-home"

const HOME_V4_CATEGORY_POOL_LIMIT = 6
const HOME_V4_POOL_SIZE = 24

function toUiRows(rows: Awaited<ReturnType<typeof getNewestProducts>>): UIProduct[] {
  return rows.map((product) => toUI(product)).filter((product) => Boolean(product.image))
}

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
  const v4CategorySlugs = categoriesWithChildren
    .slice(0, HOME_V4_CATEGORY_POOL_LIMIT)
    .map((category) => category.slug)

  // Fetch initial products for mobile tabs (newest) AND promoted listings
  // Also fetch curated category sections and optional V4 category pools in parallel.
  const [
    newestProducts, 
    boostedProducts,
    dealsProducts,
    fashionProducts,
    electronicsProducts,
    automotiveProducts,
    v4CategoryRows,
  ] = await Promise.all([
    getNewestProducts(HOME_V4_POOL_SIZE),
    getBoostedProducts(HOME_V4_POOL_SIZE), // Promoted listings (client filters expired boosts)
    getDealsProducts(HOME_V4_POOL_SIZE),
    getCategoryRowProducts("fashion", 10),      // Fashion section
    getCategoryRowProducts("electronics", 10),  // Electronics section
    getCategoryRowProducts("automotive", 10),   // Automotive section
    Promise.all(
      v4CategorySlugs.map(async (slug) => ({
        slug,
        rows: await getCategoryRowProducts(slug, HOME_V4_POOL_SIZE),
      }))
    ),
  ])

  const initialProducts = toUiRows(newestProducts)
  const promotedProducts = toUiRows(boostedProducts)
  const dealsUiProducts = toUiRows(dealsProducts)
  const nearbyProducts = initialProducts
    .filter((product) => typeof product.location === "string" && product.location.trim().length > 0)
    .slice(0, HOME_V4_POOL_SIZE)
  const forYouProducts = buildForYouPool(promotedProducts, initialProducts, HOME_V4_POOL_SIZE)
  const v4CategoryProducts = Object.fromEntries(
    v4CategoryRows.map((entry) => [entry.slug, toUiRows(entry.rows).slice(0, HOME_V4_POOL_SIZE)])
  )
  
  // Curated sections data
  const curatedSections = {
    deals: dealsUiProducts.slice(0, 10),
    fashion: toUiRows(fashionProducts),
    electronics: toUiRows(electronicsProducts),
    automotive: toUiRows(automotiveProducts),
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
          <MobileHomeV4
            locale={locale}
            categories={categoriesWithChildren}
            forYouProducts={forYouProducts}
            newestProducts={initialProducts}
            promotedProducts={promotedProducts}
            nearbyProducts={nearbyProducts.length > 0 ? nearbyProducts : initialProducts.slice(0, HOME_V4_POOL_SIZE)}
            dealsProducts={dealsUiProducts}
            categoryProducts={v4CategoryProducts}
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

