import { Suspense } from "react"
import { setRequestLocale } from "next-intl/server"
import { routing } from "@/i18n/routing"
import { getNewestProducts, toUI } from "@/lib/data/products"
import { getCategoryHierarchy } from "@/lib/data/categories"
import { UnifiedDesktopFeed, UnifiedDesktopFeedSkeleton } from "./_components/unified-desktop-feed-v2"
import { IntegratedDesktopLayout, IntegratedDesktopLayoutSkeleton } from "./_components/integrated-desktop-layout"
import { createClient } from "@/lib/supabase/server"

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function DemoDesktopPage({ 
  params, 
  searchParams 
}: { 
  params: Promise<{ locale: string }>
  searchParams: Promise<{ v?: string }>
}) {
  const { locale } = await params
  const { v: version } = await searchParams
  setRequestLocale(locale)

  const categoriesWithChildren = await getCategoryHierarchy(null, 2)
  const newestProducts = await getNewestProducts(24)
  const initialProducts = newestProducts.map(p => toUI(p))

  // Get user for the integrated layout
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Version selector: ?v=2 for new integrated layout
  const useIntegratedLayout = version === "2"

  return (
    <>
      {/* 
        DESKTOP LAYOUT DEMO
        
        Two versions available:
        - Default (?v=1 or no param): Current unified feed with separate header
        - New (?v=2): Integrated header + content layout
        
        Access via:
        - /demo/desktop - current version
        - /demo/desktop?v=2 - new integrated version
      */}
      
      {/* Mobile fallback */}
      <div className="md:hidden p-4 text-center text-muted-foreground min-h-screen flex items-center justify-center bg-muted/30">
        <div>
          <p className="text-lg font-medium text-foreground mb-2">Desktop Demo</p>
          <p>This demo is desktop-only. Please view on a larger screen.</p>
        </div>
      </div>

      {/* Desktop content */}
      <div className="hidden md:block w-full">
        {useIntegratedLayout ? (
          // NEW: Integrated layout with unified header
          <Suspense fallback={<IntegratedDesktopLayoutSkeleton />}>
            <IntegratedDesktopLayout
              locale={locale}
              categories={categoriesWithChildren}
              initialProducts={initialProducts}
              user={user}
            />
          </Suspense>
        ) : (
          // CURRENT: Separate header + feed layout
          <main className="flex min-h-screen flex-col pb-20">
            <Suspense fallback={<UnifiedDesktopFeedSkeleton />}>
              <UnifiedDesktopFeed
                locale={locale}
                categories={categoriesWithChildren}
                initialTab="newest"
                initialProducts={initialProducts}
              />
            </Suspense>
          </main>
        )}
      </div>
    </>
  )
}
