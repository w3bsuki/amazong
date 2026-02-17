import { createClient } from "@/lib/supabase/server"
import { setRequestLocale } from "next-intl/server"
import { redirect, validateLocale } from "@/i18n/routing"
import {
  canSellerRateBuyer,
  getOrderConversation,
  getSellerOrders,
  getSellerOrderStats,
  updateOrderItemStatus,
} from "@/app/actions/orders"
import { submitBuyerFeedback } from "@/app/actions/buyer-feedback"
import { SellerOrdersClient } from "./seller-orders-client"

export const metadata = {
  title: "Your Orders | Seller Dashboard",
  description: "Manage incoming orders, track shipments, and communicate with buyers",
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
