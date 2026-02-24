import type { Metadata } from "next"
import { getTranslations, setRequestLocale } from "next-intl/server"

import { redirect } from "@/i18n/routing"
import { createClient } from "@/lib/supabase/server"

import CheckoutPageClient from "../_components/checkout-page-client"
import { createCheckoutSession, getCheckoutFeeQuote } from "../_actions/checkout"

type CheckoutPageProps = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: CheckoutPageProps): Promise<Metadata> {
  const { locale: localeParam } = await params
  const locale = localeParam === "bg" ? "bg" : "en"
  const t = await getTranslations({ locale, namespace: "CheckoutPage" })

  return {
    title: t("title"),
    description: t("securePayment"),
  }
}

export default async function Page({ params }: CheckoutPageProps) {
  const { locale: localeParam } = await params
  const locale = localeParam === "bg" ? "bg" : "en"
  setRequestLocale(locale)

  const supabase = await createClient()
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect({
      href: { pathname: "/auth/login", query: { next: "/checkout" } },
      locale,
    })
  }

  return (
    <CheckoutPageClient
      createCheckoutSessionAction={createCheckoutSession}
      getCheckoutFeeQuoteAction={getCheckoutFeeQuote}
    />
  )
}
