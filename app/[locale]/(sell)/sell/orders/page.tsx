import { createClient } from "@/lib/supabase/server"
import { setRequestLocale } from "next-intl/server"
import { redirect, validateLocale } from "@/i18n/routing"
import type { Metadata } from "next"
import { createPageMetadata } from "@/lib/seo/metadata"
import { getOrderConversation, getSellerOrders, getSellerOrderStats } from "../../../../actions/orders-reads"
import { canSellerRateBuyer } from "../../../../actions/orders-rating"
import { updateOrderItemStatus } from "../../../../actions/orders-status"
import { submitBuyerFeedback } from "../../../../actions/buyer-feedback"
import { SellerOrdersClient } from "./seller-orders-client"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale: localeParam } = await params
  const locale = validateLocale(localeParam)

  const title = locale === "bg" ? "Поръчки от купувачи" : "Seller Orders"
  const description =
    locale === "bg"
      ? "Управлявайте входящи поръчки, доставки и комуникация с купувачи."
      : "Manage incoming orders, track shipments, and communicate with buyers."

  return createPageMetadata({
    locale,
    path: "/sell/orders",
    title,
    description,
    robots: {
      index: false,
      follow: true,
    },
  })
}

export default async function SellerOrdersPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale: localeParam } = await params
  const locale = validateLocale(localeParam)
  setRequestLocale(locale)

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect({ href: "/auth/login", locale })
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("username")
    .eq("id", user.id)
    .maybeSingle()

  return (
    <SellerOrdersClient
      locale={locale}
      sellerUsername={profile?.username ?? null}
      actions={{
        getSellerOrders,
        getSellerOrderStats,
        getOrderConversation,
        updateOrderItemStatus,
        canSellerRateBuyer,
        submitBuyerFeedback,
      }}
    />
  )
}
