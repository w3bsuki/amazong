import { Suspense } from "react"
import { setRequestLocale } from "next-intl/server"
import { routing } from "@/i18n/routing"
import { getNewestProducts, toUI } from "@/lib/data/products"
import { getCategoryHierarchy } from "@/lib/data/categories"
import { UnifiedDesktopFeed, UnifiedDesktopFeedSkeleton } from "./_components/unified-desktop-feed-v2"

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function DemoDesktopPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  const categoriesWithChildren = await getCategoryHierarchy(null, 2)
  const newestProducts = await getNewestProducts(24)
  const initialProducts = newestProducts.map(p => toUI(p))

  return (
    <main className="flex min-h-screen flex-col bg-muted/30 pb-20">
      {/* 
        DESKTOP LAYOUT - Clean & Fast
        - Compact sidebar with categories + filters
        - Search bar in content header row
        - Product grid with sort/view controls
      */}
      <div className="hidden md:block w-full">
        <Suspense fallback={<UnifiedDesktopFeedSkeleton />}>
          <UnifiedDesktopFeed
            locale={locale}
            categories={categoriesWithChildren}
            initialTab="newest"
            initialProducts={initialProducts}
          />
        </Suspense>
      </div>

      {/* Mobile fallback */}
      <div className="md:hidden p-4 text-center text-muted-foreground">
        This demo is desktop-only. Please view on a larger screen.
      </div>
    </main>
  )
}
