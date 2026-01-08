import { setRequestLocale } from "next-intl/server"
import { validateLocale } from "@/i18n/routing"

// =============================================================================
// CATEGORIES LAYOUT
// 
// Simple wrapper - MobileHomeTabs in page.tsx handles all the tab navigation
// client-side (no page flashes, instant category switching like homepage)
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

  return (
    <div className="min-h-(--categories-layout-min-h) bg-background">
      {/* Main Content Area - MobileHomeTabs handles tabs internally */}
      <main id="main-content" className="min-w-0 overflow-x-hidden">
        {children}
      </main>
    </div>
  )
}
