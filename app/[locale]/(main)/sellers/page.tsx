import type { Metadata } from "next"

import { routing, validateLocale } from "@/i18n/routing"
import { createClient } from "@/lib/supabase/server"
import { setRequestLocale } from "next-intl/server"
import { getTranslations } from "next-intl/server"

import { getTopSellers } from "./_lib/get-top-sellers"
import SellersEmptyState from "./_components/sellers-empty-state"
import SellersDirectoryClient from "./_components/sellers-directory-client"
import TopSellersHero from "./_components/top-sellers-hero"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale: localeParam } = await params
  const locale = validateLocale(localeParam)
  const t = await getTranslations({ locale, namespace: "SellersDirectory" })

  return {
    title: t("title"),
    description: t("description"),
  }
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function SellersPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale: localeParam } = await params
  const locale = validateLocale(localeParam)
  setRequestLocale(locale)
  const supabase = await createClient()
  const t = await getTranslations({ locale, namespace: "SellersDirectory" })
  const tBreadcrumbs = await getTranslations("Breadcrumbs")

  const sellersWithStats = await getTopSellers(supabase)

  return (
    <div className="min-h-screen bg-background pb-20 sm:pb-12">
      {/* Hero Banner */}
      <TopSellersHero
        breadcrumbItems={[{ label: t("breadcrumbLabel") }]}
        breadcrumbAriaLabel={tBreadcrumbs("ariaLabel")}
        breadcrumbHomeLabel={tBreadcrumbs("homeLabel")}
        title={t("heroTitle")}
        subtitle={t("heroSubtitle")}
      />

      <div className="container py-6">
        {/* Results count */}
        <p className="text-sm text-muted-foreground mb-4">
          {t("count", { count: sellersWithStats.length })}
        </p>

        {/* Sellers Grid */}
        <SellersDirectoryClient sellers={sellersWithStats} />

        {/* Empty state */}
        {sellersWithStats.length === 0 && (
          <SellersEmptyState locale={locale} />
        )}
      </div>
    </div>
  )
}
