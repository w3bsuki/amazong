import { setRequestLocale } from "next-intl/server"
import { routing } from "@/i18n/routing"
import { SellerOrdersClient } from "./client"

// Generate static params for all supported locales
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export const metadata = {
  title: "Your Orders | Seller Dashboard",
  description: "Manage incoming orders, track shipments, and communicate with buyers",
}

export default async function SellerOrdersPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  return <SellerOrdersClient locale={locale} />
}
