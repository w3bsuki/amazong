import { setRequestLocale } from "next-intl/server"

/**
 * Demo Desktop Layout
 * 
 * Layout for desktop demo pages.
 * 
 * Note: This layout is nested inside (main) layout which provides:
 * - SiteHeader (with search, nav, etc.)
 * - SiteFooter
 * - MobileTabBar
 * 
 * For the integrated layout demo (?v=2), the IntegratedDesktopLayout
 * component renders its own SlimTopBar, so you'll see two headers.
 * This is intentional for demo/comparison purposes.
 * 
 * In production, the integrated layout would have its own route group
 * without the main header wrapper.
 */
export default async function DemoDesktopLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  return <>{children}</>
}
