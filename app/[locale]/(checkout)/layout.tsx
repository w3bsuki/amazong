import { CheckoutHeader } from "@/components/checkout-header"
import { CheckoutFooter } from "@/components/checkout-footer"
import { setRequestLocale } from "next-intl/server"
import { routing } from "@/i18n/routing"

// Generate static params for all supported locales
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
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
    <div className="min-h-screen flex flex-col bg-muted">
      <CheckoutHeader />
      <main className="flex-1">
        {children}
      </main>
      <CheckoutFooter />
    </div>
  )
}
