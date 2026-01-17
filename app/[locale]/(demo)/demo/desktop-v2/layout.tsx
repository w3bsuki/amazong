import { setRequestLocale } from "next-intl/server"
import { routing } from "@/i18n/routing"

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

/**
 * Desktop V2 Layout
 * 
 * Standalone layout for the integrated desktop demo.
 * NO main site header - the IntegratedDesktopLayout provides its own.
 * This gives a pure view of the new unified header + content design.
 */
export default async function DesktopV2Layout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <div className="min-h-screen bg-background">
      {children}
    </div>
  )
}
