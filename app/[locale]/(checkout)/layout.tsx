import { CheckoutHeader } from "./_components/checkout-header"
import { CheckoutFooter } from "./_components/checkout-footer"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { routing } from "@/i18n/routing"
import { PageShell } from "@/components/shared/page-shell"
import type { Metadata } from "next"

// Generate static params for all supported locales
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: "CheckoutPage" })

  return {
    title: t("title"),
  }
}

/**
 * Checkout Layout
 * 
 * Minimal, distraction-free layout following e-commerce best practices:
 * - Simplified header with logo and progress indicator only
 * - No navigation, search, or footer
 * - Focuses user attention on completing the purchase
 * 
 * Used by Amazon, eBay, Walmart, Target, and other major retailers
 * to reduce cart abandonment and increase conversion rates.
 */
export default async function CheckoutLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  
  // Enable static rendering - required for Next.js 16+ with cacheComponents
  setRequestLocale(locale)

  return (
    <PageShell variant="muted" className="flex flex-col">
      <CheckoutHeader />
      <main className="flex-1">
        {children}
      </main>
      <CheckoutFooter />
    </PageShell>
  )
}
