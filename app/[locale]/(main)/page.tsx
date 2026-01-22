import { Suspense } from "react"
import type { Metadata } from "next"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { routing } from "@/i18n/routing"
import { MobileHome } from "@/components/mobile/mobile-home"
import { getNewestProducts, getBoostedProducts, toUI } from "@/lib/data/products"
import { getCategoryHierarchy } from "@/lib/data/categories"
import { createClient } from "@/lib/supabase/server"
import { 
  DesktopHome, 
  DesktopHomeSkeleton 
} from "@/components/desktop/desktop-home"

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
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

  // Fetch user for wishlist/notifications
  let user = null
  try {
    const supabase = await createClient()
    const { data } = await supabase.auth.getUser()
    user = data.user
  } catch {
    user = null
  }

  // Fetch categories with children for mobile subcategory circles.
  // L0 + L1 + L2 only (~3,400 categories, ~60KB gzipped).
  // L3 (~9,700 categories) are lazy-loaded when L2 is clicked.
  const categoriesWithChildren = await getCategoryHierarchy(null, 2)

  // Fetch initial products for mobile tabs (newest) AND promoted listings
  const [newestProducts, boostedProducts] = await Promise.all([
    getNewestProducts(24),
    getBoostedProducts(10), // Promoted listings for flash deals section
  ])
  const initialProducts = newestProducts.map(p => toUI(p))
  const promotedProducts = boostedProducts.map(p => toUI(p))

  return (
    <div className="flex min-h-screen flex-col bg-background md:pb-0">
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
            initialCategories={categoriesWithChildren}
            locale={locale}
            user={user ? { id: user.id } : null}
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
            user={user}
          />
        </Suspense>
      </div>
    </div>
  )
}
