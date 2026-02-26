import type { Metadata } from "next"
import { getTranslations, setRequestLocale } from "next-intl/server"

import { redirect } from "@/i18n/routing"
import { createClient } from "@/lib/supabase/server"
import { createPageMetadata } from "@/lib/seo/metadata"

import CheckoutSuccessPageClient from "../../_components/checkout-success-page-client"
import { verifyAndCreateOrder } from "../../_actions/checkout"

type CheckoutSuccessPageProps = {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ session_id?: string }>
}

export async function generateMetadata({ params }: CheckoutSuccessPageProps): Promise<Metadata> {
  const { locale: localeParam } = await params
  const locale = localeParam === "bg" ? "bg" : "en"
  const t = await getTranslations({ locale, namespace: "CheckoutSuccessPage" })

  return createPageMetadata({
    locale,
    path: "/checkout/success",
    title: t("paymentSuccessful"),
    description: t("thankYou"),
    robots: {
      index: false,
      follow: true,
    },
  })
}

export default async function Page({ params, searchParams }: CheckoutSuccessPageProps) {
  const [{ locale: localeParam }, { session_id: sessionId }] = await Promise.all([
    params,
    searchParams,
  ])

  const locale = localeParam === "bg" ? "bg" : "en"
  setRequestLocale(locale)

  const supabase = await createClient()
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    const next = encodeURIComponent(
      sessionId
        ? `/checkout/success?session_id=${encodeURIComponent(sessionId)}`
        : "/checkout/success"
    )
    return redirect({
      href: `/auth/login?next=${next}`,
      locale,
    })
  }

  return <CheckoutSuccessPageClient verifyAndCreateOrderAction={verifyAndCreateOrder} />
}
