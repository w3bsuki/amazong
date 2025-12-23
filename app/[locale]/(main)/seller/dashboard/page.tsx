import { routing } from "@/i18n/routing"
import { setRequestLocale } from "next-intl/server"

import SellerDashboardClient from "./_components/seller-dashboard-client"

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function SellerDashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  return <SellerDashboardClient />
}
