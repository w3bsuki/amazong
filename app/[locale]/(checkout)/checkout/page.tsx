import type { Metadata } from "next"
import { getTranslations, setRequestLocale } from "next-intl/server"

import { createPageMetadata } from "@/lib/seo/metadata"

import CheckoutPageClient from "../_components/checkout-page-client"
import { createCheckoutSession, getCheckoutFeeQuote } from "../_actions/checkout"

type CheckoutPageProps = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: CheckoutPageProps): Promise<Metadata> {
  const { locale: localeParam } = await params
  const locale = localeParam === "bg" ? "bg" : "en"
  const t = await getTranslations({ locale, namespace: "CheckoutPage" })

  return createPageMetadata({
    locale,
    path: "/checkout",
    title: t("title"),
    description: t("securePayment"),
    robots: {
      index: false,
      follow: true,
    },
  })
}

export default async function Page({ params }: CheckoutPageProps) {
  const { locale: localeParam } = await params
  const locale = localeParam === "bg" ? "bg" : "en"
  setRequestLocale(locale)

  return (
    <CheckoutPageClient
      createCheckoutSessionAction={createCheckoutSession}
      getCheckoutFeeQuoteAction={getCheckoutFeeQuote}
    />
  )
}
