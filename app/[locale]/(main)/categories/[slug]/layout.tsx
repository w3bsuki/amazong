import { setRequestLocale } from "next-intl/server"
import { validateLocale } from "@/i18n/routing"

// =============================================================================
// CATEGORY [SLUG] LAYOUT
//
// Simple pass-through layout for /categories/[slug] routes.
// The parent (main)/layout.tsx already provides the full layout shell
// (SiteHeader, SiteFooter, MobileTabBar, etc.).
//
// This layout only handles locale setup - the page.tsx handles mobile/desktop
// conditional rendering via MobileHomeTabs (contextualMode) on mobile and
// standard desktop layout on lg: screens.
// =============================================================================

export default async function CategorySlugLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale: localeParam } = await params
  const locale = validateLocale(localeParam)
  setRequestLocale(locale)

  return <>{children}</>
}
