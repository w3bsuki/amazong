import { validateLocale } from "@/i18n/routing"
import { setRequestLocale, getTranslations } from "next-intl/server"
import WishlistPageClient from "./_components/wishlist-page-client"
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
  const t = await getTranslations("Wishlist")

  return createPageMetadata({
    locale,
    path: "/wishlist",
    title: t("heading"),
    description: t("description"),
  })
}

export default async function WishlistPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  return <WishlistPageClient />
}

