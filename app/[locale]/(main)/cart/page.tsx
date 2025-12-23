import { routing } from "@/i18n/routing"
import { setRequestLocale } from "next-intl/server"
import CartPageClient from "./_components/cart-page-client"

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function CartPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  return <CartPageClient />
}
