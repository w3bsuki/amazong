import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { setRequestLocale } from "next-intl/server"
import { validateLocale } from "@/i18n/routing"
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

  return <SellerOrdersClient locale={locale} />
}
