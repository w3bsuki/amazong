import { validateLocale } from "@/i18n/routing"
import { getTranslations, setRequestLocale } from "next-intl/server"
import CartPageClient from "./_components/cart-page-client"
import type { Metadata } from "next"
import { createPageMetadata } from "@/lib/seo/metadata"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale: localeParam } = await params
  const locale = validateLocale(localeParam)
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: "Cart" })
  const title = t("title")
  return createPageMetadata({
    locale,
    path: "/cart",
    title,
    description: title,
  })
}

export default async function CartPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  return <CartPageClient />
}

