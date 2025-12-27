import type { Metadata } from "next"

import { routing, validateLocale } from "@/i18n/routing"
import { createClient } from "@/lib/supabase/server"
import { setRequestLocale } from "next-intl/server"

import { getTopSellers } from "./_lib/get-top-sellers"
import SellersEmptyState from "./_components/sellers-empty-state"
import SellersGrid from "./_components/sellers-grid"
import TopSellersHero from "./_components/top-sellers-hero"

export const metadata: Metadata = {
  title: 'Top Sellers | Amazong',
  description: 'Discover top-rated sellers on Amazong. Shop from verified merchants with great reviews.',
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

  const sellersWithStats = await getTopSellers(supabase)

  return (
    <div className="min-h-screen bg-background pb-20 sm:pb-12">
      {/* Hero Banner */}
      <TopSellersHero locale={locale} />

      <div className="container py-6">
        {/* Results count */}
        <p className="text-sm text-muted-foreground mb-4">
          <span className="font-semibold text-foreground">{sellersWithStats.length}</span>{" "}
          {locale === "bg" ? "продавачи" : "sellers"}
        </p>

        {/* Sellers Grid */}
        <SellersGrid sellers={sellersWithStats} locale={locale} />

        {/* Empty state */}
        {sellersWithStats.length === 0 && (
          <SellersEmptyState locale={locale} />
        )}
      </div>
    </div>
  )
}
