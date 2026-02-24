import type { Metadata } from "next"
import { getTranslations, setRequestLocale } from "next-intl/server"

import { redirect } from "@/i18n/routing"
import { createClient } from "@/lib/supabase/server"

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

  return {
    title: t("paymentSuccessful"),
    description: t("thankYou"),
  }
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
    redirect({
      href: {
        pathname: "/auth/login",
        query: {
          next: sessionId
            ? `/checkout/success?session_id=${encodeURIComponent(sessionId)}`
            : "/checkout",
        },
      },
      locale,
    })
  }

  return <CheckoutSuccessPageClient verifyAndCreateOrderAction={verifyAndCreateOrder} />
}
