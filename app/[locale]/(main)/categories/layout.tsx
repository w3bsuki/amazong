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

  // NOTE: Removed overflow-x-hidden from main - it can interfere with sticky
  // positioning of tabs in MobileHomeTabs. The page content should handle
  // any overflow needs locally.
  return (
    children
  )
}
