import { Suspense } from "react"
import { setRequestLocale } from "next-intl/server"
import { routing } from "@/i18n/routing"
import { getNewestProducts, toUI } from "@/lib/data/products"
import { getCategoryHierarchy } from "@/lib/data/categories"
import { createClient } from "@/lib/supabase/server"
import { 
  IntegratedDesktopLayout, 
  IntegratedDesktopLayoutSkeleton 
} from "@/components/desktop/integrated-desktop-layout"

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

/**
 * Desktop V2 Demo Page
 * 
 * STANDALONE integrated desktop layout demo.
 * 
 * This page demonstrates the new unified header + content approach:
 * - Slim top bar with logo + user actions
 * - Search bar integrated into the content area
 * - Categories sidebar + filters in one unified container
 * - No visual break between header and content
 * 
 * Access: /demo/desktop-v2
 * 
 * Compare with:
 * - /demo/desktop - current version with separate header
 * - /demo/desktop?v=2 - same layout but nested under main header (double header)
 */
export default async function DesktopV2Page({ 
  params,
}: { 
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  const categoriesWithChildren = await getCategoryHierarchy(null, 2)
  const newestProducts = await getNewestProducts(24)
  const initialProducts = newestProducts.map(p => toUI(p))

  // Get user for personalization
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <>
      {/* Mobile fallback */}
      <div className="md:hidden p-4 text-center text-muted-foreground min-h-screen flex items-center justify-center bg-muted/30">
        <div>
          <p className="text-lg font-medium text-foreground mb-2">Desktop V2 Demo</p>
          <p>This demo is desktop-only. Please view on a larger screen.</p>
          <p className="text-xs mt-2">Integrated header + content layout</p>
        </div>
      </div>

      {/* Desktop: Integrated layout */}
      <div className="hidden md:block w-full">
        <Suspense fallback={<IntegratedDesktopLayoutSkeleton />}>
          <IntegratedDesktopLayout
            locale={locale}
            categories={categoriesWithChildren}
            initialProducts={initialProducts}
            user={user}
          />
        </Suspense>
      </div>
    </>
  )
}
