import { AppBreadcrumb, breadcrumbPresets } from "@/components/navigation/app-breadcrumb"
import { routing, validateLocale } from "@/i18n/routing"
import { Lightning as Zap } from "@phosphor-icons/react/dist/ssr"
import { getTranslations, setRequestLocale } from "next-intl/server"
import TodaysDealsPageClient from "./_components/todays-deals-page-client"

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function TodaysDealsPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale: localeParam } = await params
  const locale = validateLocale(localeParam)
  setRequestLocale(locale)
  const t = await getTranslations("TodaysDeals")
  const title = t("title")

  return (
    <div className="min-h-screen bg-background pb-20 sm:pb-12">
      {/* Hero Banner */}
      <div className="bg-brand-deal text-white py-6 sm:py-10">
        <div className="container">
          {/* Breadcrumb */}
          <div className="[&_nav]:border-white/20 [&_nav]:mb-2 [&_a]:text-white/80 [&_a:hover]:text-white [&_span[aria-current]]:text-white [&_svg]:text-white/50">
            <AppBreadcrumb
              items={breadcrumbPresets.todaysDeals}
              homeLabel={locale === "bg" ? "Начало" : "Treido"}
            />
          </div>

          <div className="flex items-center gap-3 mb-2">
            <div className="size-12 sm:size-14 bg-white/10 rounded-full flex items-center justify-center">
              <Zap className="size-6 sm:size-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-4xl font-bold">{title}</h1>
              <p className="text-white/80 text-sm sm:text-base mt-1">
                {locale === "bg"
                  ? "Спести до 70% на хиляди продукти"
                  : "Save up to 70% on thousands of items"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container -mt-4 sm:-mt-6">
        <TodaysDealsPageClient
          locale={locale}
          tabLabels={{
            allDeals: t("allDeals"),
            available: t("available"),
            upcoming: t("upcoming"),
            watchlist: t("watchlist"),
          }}
        />
      </div>
    </div>
  )
}
