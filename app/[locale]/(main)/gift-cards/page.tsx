import { getTranslations, setRequestLocale } from "next-intl/server"
import { AppBreadcrumb, breadcrumbPresets } from "@/components/navigation/app-breadcrumb"
import { routing } from "@/i18n/routing"

import GiftCardsFeaturedDesigns from "./_components/gift-cards-featured-designs"
import GiftCardsHero from "./_components/gift-cards-hero"
import GiftCardsQuickActions from "./_components/gift-cards-quick-actions"

// Generate static params for all locales - required for Next.js 16 Cache Components
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function GiftCardsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations("GiftCards")

  return (
    <div className="min-h-screen bg-muted pb-12">
      <div className="container pt-4">
        <AppBreadcrumb items={breadcrumbPresets.giftCards} />
      </div>

      <GiftCardsHero t={t} />

      <div className="container py-8">
        <GiftCardsQuickActions t={t} />
        <GiftCardsFeaturedDesigns t={t} />
      </div>
    </div>
  )
}
