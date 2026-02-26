import type { Metadata } from "next"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { MobileHome } from "./_components/mobile-home"
import { createPageMetadata } from "@/lib/seo/metadata"
import { 
  getNewestProducts, 
  getBoostedProducts, 
  getCategoryRowProducts,
  toUI 
} from "@/lib/data/products"
import { getCategoryHierarchy } from "@/lib/data/categories"
import type { UIProduct } from "@/lib/types/products"
import { buildForYouPool } from "@/lib/home-pools"
import { DesktopHomeSlot } from "./_components/desktop-home-slot"

const HOME_CATEGORY_POOL_LIMIT = 6
const HOME_POOL_SIZE = 24

function toUiRows(rows: Awaited<ReturnType<typeof getNewestProducts>>): UIProduct[] {
  return rows.map((product) => toUI(product)).filter((product) => Boolean(product.image))
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Home" })
  return createPageMetadata({
    locale,
    path: "",
    title: t("metaTitle"),
    description: t("metaDescription"),
  })
}

// =============================================================================
// Main Page Component
// =============================================================================

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations("Home")

  // Keep the initial home payload small on mobile:
  // - Load only L0 roots in the HTML payload.
  // - Deeper levels are fetched lazily on interaction.
  const rootCategories = await getCategoryHierarchy(null, 0)
  const categorySlugs = rootCategories
    .slice(0, HOME_CATEGORY_POOL_LIMIT)
    .map((category) => category.slug)

  // Fetch initial products and category pools in parallel.
  const [
    newestProducts, 
    boostedProducts,
    categoryRows,
  ] = await Promise.all([
    getNewestProducts(HOME_POOL_SIZE),
    getBoostedProducts(HOME_POOL_SIZE), // Promoted listings (client filters expired boosts)
    Promise.all(
      categorySlugs.map(async (slug) => ({
        slug,
        rows: await getCategoryRowProducts(slug, HOME_POOL_SIZE),
      }))
    ),
  ])

  const initialProducts = toUiRows(newestProducts)
  const promotedProducts = toUiRows(boostedProducts)
  const forYouProducts = buildForYouPool(promotedProducts, initialProducts, HOME_POOL_SIZE)
  const categoryProducts = Object.fromEntries(
    categoryRows.map((entry) => [entry.slug, toUiRows(entry.rows).slice(0, HOME_POOL_SIZE)])
  )

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
        <MobileHome
          locale={locale}
          categories={rootCategories}
          forYouProducts={forYouProducts}
          categoryProducts={categoryProducts}
        />
      </div>

      {/* ================================================================
          DESKTOP: Desktop Home
          - Unified header + content in one seamless container
          - Slim top bar with logo + user actions
          - Category sidebar + filters + product grid
          ================================================================ */}
      <div className="hidden md:block w-full">
        <DesktopHomeSlot
          locale={locale}
          categories={rootCategories}
          initialProducts={initialProducts}
          promotedProducts={promotedProducts}
        />
      </div>
    </div>
  )
}

