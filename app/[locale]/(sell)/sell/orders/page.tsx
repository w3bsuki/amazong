import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { setRequestLocale } from "next-intl/server"
import { validateLocale } from "@/i18n/routing"
import {
  canSellerRateBuyer,
  getOrderConversation,
  getSellerOrders,
  getSellerOrderStats,
  updateOrderItemStatus,
} from "@/app/actions/orders"
import { submitBuyerFeedback } from "@/app/actions/buyer-feedback"
import { SellerOrdersClient } from "./client"

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
    redirect(`/${locale}/auth/login`)
  }

  return (
    <SellerOrdersClient
      locale={locale}
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
