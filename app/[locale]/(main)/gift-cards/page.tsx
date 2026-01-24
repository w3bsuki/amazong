import { getTranslations, setRequestLocale } from "next-intl/server"
import { AppBreadcrumb, breadcrumbPresets } from "@/components/navigation/app-breadcrumb"
import { routing, validateLocale } from "@/i18n/routing"
import type { Metadata } from "next"

import GiftCardsFeaturedDesigns from "./_components/gift-cards-featured-designs"
import GiftCardsHero from "./_components/gift-cards-hero"
import GiftCardsQuickActions from "./_components/gift-cards-quick-actions"

// Generate static params for all locales - required for Next.js 16 Cache Components
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale: localeParam } = await params
  const locale = validateLocale(localeParam)
  setRequestLocale(locale)
  const t = await getTranslations("GiftCards")

  return {
    title: t("title"),
    description: t("metaDescription"),
  }
}

export default async function GiftCardsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: localeParam } = await params
  const locale = validateLocale(localeParam)
  setRequestLocale(locale)
  const t = await getTranslations("GiftCards")
  const tBreadcrumbs = await getTranslations("Breadcrumbs")

  return (
    <div className="min-h-screen bg-muted pb-12">
      <div className="container pt-4">
        <AppBreadcrumb
          items={breadcrumbPresets(tBreadcrumbs).giftCards}
          ariaLabel={tBreadcrumbs("ariaLabel")}
          homeLabel={tBreadcrumbs("homeLabel")}
        />
      </div>

      <GiftCardsHero t={t} />

      <div className="container py-8">
        <GiftCardsQuickActions t={t} />
        <GiftCardsFeaturedDesigns t={t} />
      </div>
    </div>
  )
}
