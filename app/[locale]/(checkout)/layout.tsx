import { CheckoutHeader } from "./_components/checkout-header"
import { CheckoutFooter } from "./_components/checkout-footer"
import { CheckoutStepProvider } from "./_components/checkout-step-context"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { PageShell } from "../_components/page-shell"
import { CartProviders } from "../_providers/cart-providers"
import { FullRouteIntlProvider } from "../_providers/route-intl-provider"
import type { Metadata } from "next"
import { localeStaticParams } from "@/lib/next/static-params"
import { createPageMetadata } from "@/lib/seo/metadata"

// Generate static params for all supported locales
export function generateStaticParams() {
  return localeStaticParams()
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: "CheckoutPage" })

  const title = t("title")
  return createPageMetadata({
    locale,
    path: "/checkout",
    title,
    description: title,
    robots: {
      index: false,
      follow: true,
    },
  })
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
    <FullRouteIntlProvider locale={locale}>
      <CartProviders>
        <PageShell variant="muted" className="flex flex-col">
          <CheckoutStepProvider>
            <CheckoutHeader />
            <main className="flex-1">{children}</main>
          </CheckoutStepProvider>
          <CheckoutFooter />
        </PageShell>
      </CartProviders>
    </FullRouteIntlProvider>
  )
}

