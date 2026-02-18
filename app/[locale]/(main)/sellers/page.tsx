import type { Metadata } from "next"

import { validateLocale } from "@/i18n/routing"
import { Link } from "@/i18n/routing"
import { createClient } from "@/lib/supabase/server"
import { setRequestLocale } from "next-intl/server"
import { getTranslations } from "next-intl/server"
import { Button } from "@/components/ui/button"

import { getTopSellers } from "./_lib/get-top-sellers"
import SellersDirectoryClient from "./_components/sellers-directory-client"
import { AppBreadcrumb, type BreadcrumbItemData } from "../../_components/navigation/app-breadcrumb"
import { PageShell } from "../../_components/page-shell"

function TopSellersHero({
  breadcrumbItems,
  breadcrumbAriaLabel,
  breadcrumbHomeLabel,
  title,
  subtitle,
}: {
  breadcrumbItems: readonly BreadcrumbItemData[]
  breadcrumbAriaLabel: string
  breadcrumbHomeLabel: string
  title: string
  subtitle: string
}) {
  return (
    <div className="bg-rating text-foreground py-6 sm:py-10">
      <div className="container">
        <div className="[&_nav]:border-foreground/20 [&_nav]:mb-2 [&_a]:text-foreground/80 [&_a:hover]:text-foreground [&_span[aria-current]]:text-foreground [&_svg]:text-foreground/50">
          <AppBreadcrumb
            items={breadcrumbItems}
            ariaLabel={breadcrumbAriaLabel}
            homeLabel={breadcrumbHomeLabel}
          />
        </div>

        <div className="flex items-center gap-3 mb-2">
          <div className="size-12 sm:size-14 bg-foreground/10 rounded-full flex items-center justify-center">
            <svg className="size-6 sm:size-7 text-foreground" fill="currentColor" viewBox="0 0 256 256">
              <path d="M232,64H208V48a24,24,0,0,0-24-24H72A24,24,0,0,0,48,48V64H24A16,16,0,0,0,8,80v24a56.06,56.06,0,0,0,48.44,55.47A39.8,39.8,0,0,0,72,176v32H64a8,8,0,0,0,0,16H192a8,8,0,0,0,0-16h-8V176a39.8,39.8,0,0,0,15.56-16.53A56.06,56.06,0,0,0,248,104V80A16,16,0,0,0,232,64Zm-64,80a24,24,0,0,1-24,24H112a24,24,0,0,1-24-24V48a8,8,0,0,1,8-8H168a8,8,0,0,1,8,8Z" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl sm:text-4xl font-bold tracking-tight">{title}</h1>
            <p className="text-foreground/80 text-sm sm:text-base mt-1">{subtitle}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function SellersEmptyState({
  title,
  description,
  cta,
}: {
  title: string
  description: string
  cta: string
}) {
  return (
    <div className="text-center py-12">
      <div className="size-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
        <svg className="size-8 text-muted-foreground" fill="currentColor" viewBox="0 0 256 256">
          <path d="M232,64H208V48a24,24,0,0,0-24-24H72A24,24,0,0,0,48,48V64H24A16,16,0,0,0,8,80v24a56.06,56.06,0,0,0,48.44,55.47A39.8,39.8,0,0,0,72,176v32H64a8,8,0,0,0,0,16H192a8,8,0,0,0,0-16h-8V176a39.8,39.8,0,0,0,15.56-16.53A56.06,56.06,0,0,0,248,104V80A16,16,0,0,0,232,64Z" />
        </svg>
      </div>
      <h3 className="text-lg font-semibold tracking-tight text-foreground mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm mb-4">{description}</p>
      <Link href="/sell">
        <Button>{cta}</Button>
      </Link>
    </div>
  )
}

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
    <PageShell variant="muted" className="pb-20 sm:pb-12">
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
          <SellersEmptyState
            title={t("empty.title")}
            description={t("empty.description")}
            cta={t("empty.cta")}
          />
        )}
      </div>
    </PageShell>
  )
}


