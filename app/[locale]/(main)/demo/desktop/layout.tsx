import { setRequestLocale } from "next-intl/server"

/**
 * Demo Desktop Layout
 * 
 * Uses the main site header with search bar.
 * This demonstrates the ideal desktop marketplace layout.
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
