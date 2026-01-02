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
    <div className="min-h-[calc(100vh-52px-50px)] bg-background">
      {/* Main Content Area - MobileHomeTabs handles tabs internally */}
      <div className="min-w-0 overflow-x-hidden">
        {children}
      </div>
    </div>
  )
}
