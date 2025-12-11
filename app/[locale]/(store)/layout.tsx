import { setRequestLocale } from "next-intl/server"
import { connection } from "next/server"
import { routing } from "@/i18n/routing"
import { MobileTabBar } from "@/components/mobile-tab-bar"

// Generate static params for all supported locales
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

/**
 * Store Layout
 * 
 * Clean layout for store profiles (Instagram-style):
 * - No site header - profile header handles navigation
 * - Mobile tab bar preserved for app navigation
 */
export default async function StoreLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  await connection()
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Main Content */}
      <main id="main-content" className="flex-1 pb-20 md:pb-0">
        {children}
      </main>

      {/* Mobile Tab Bar - Keep for navigation */}
      <MobileTabBar />
    </div>
  )
}
