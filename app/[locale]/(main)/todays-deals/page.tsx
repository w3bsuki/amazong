import { setRequestLocale, getTranslations } from "next-intl/server"
import { Zap } from "lucide-react";

import type { Metadata } from 'next'
import { validateLocale } from "@/i18n/routing"
import { createPageMetadata } from "@/lib/seo/metadata"
import { AppBreadcrumb, breadcrumbPresets } from "../../_components/navigation/app-breadcrumb"
import { getProducts, toUI } from "@/lib/data/products"
import { MobileProductCard } from "@/components/shared/product/card/mobile"
import { PageShell } from "../../_components/page-shell"
import { cookies } from "next/headers"
import { parseShippingRegion } from "@/lib/shipping"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: localeParam } = await params
  const locale = validateLocale(localeParam)
  setRequestLocale(locale)
  const t = await getTranslations('TodaysDeals')
  
  return createPageMetadata({
    locale,
    path: "/todays-deals",
    title: t('title'),
    description: t('metaDescription'),
  })
}

export default async function TodaysDealsPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale: localeParam } = await params
  const locale = validateLocale(localeParam)
  setRequestLocale(locale)
  
  const t = await getTranslations('TodaysDeals')
  const tBreadcrumbs = await getTranslations("Breadcrumbs")

  const cookieStore = await cookies()
  const zone = parseShippingRegion(cookieStore.get("user-zone")?.value)

  const products = await getProducts("deals", 48, zone)
  const dealItems = products
    .map(toUI)
    .filter((p) => typeof p.storeSlug === "string" && p.storeSlug.length > 0)
  
  return (
    <PageShell variant="muted">
      <div className="container pt-6">
        <AppBreadcrumb
          items={breadcrumbPresets(tBreadcrumbs).todaysDeals}
          ariaLabel={tBreadcrumbs("ariaLabel")}
          homeLabel={tBreadcrumbs("homeLabel")}
        />
      </div>

      <section className="mt-4 border-y border-border bg-surface-subtle">
        <div className="container py-6 sm:py-8 flex items-start gap-4">
          <div className="size-12 sm:size-14 shrink-0 rounded-full bg-deal text-deal-foreground flex items-center justify-center">
            <Zap className="size-6 sm:size-7" />
          </div>
          <div className="min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">{t("title")}</h1>
            <p className="text-muted-foreground mt-1">{t("heroSubtitle")}</p>
          </div>
        </div>
      </section>

      <div className="container py-6">
        <p className="text-sm text-muted-foreground mb-4">
          {dealItems.length} {t("dealsFound")}
        </p>

        {dealItems.length === 0 ? (
          <div className="rounded-lg border border-border bg-card p-8 text-center">
            <p className="text-sm font-medium text-foreground">{t("noDealsInCategory")}</p>
            <p className="mt-1 text-sm text-muted-foreground">{t("checkBackLater")}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
            {dealItems.map((product, index) => (
              <MobileProductCard
                key={product.id}
                id={product.id}
                title={product.title}
                price={product.price}
                originalPrice={product.listPrice ?? null}
                isOnSale={Boolean(product.isOnSale)}
                createdAt={product.createdAt ?? null}
                image={product.image}
                rating={product.rating}
                reviews={product.reviews}
                slug={product.slug ?? null}
                username={product.storeSlug ?? null}
                sellerId={product.sellerId ?? null}
                sellerName={product.sellerName ?? undefined}
                sellerAvatarUrl={product.sellerAvatarUrl ?? null}
                sellerVerified={Boolean(product.sellerVerified)}
                freeShipping={Boolean(product.freeShipping)}
                {...(typeof product.salePercent === "number" ? { salePercent: product.salePercent } : {})}
                {...(product.categoryPath ? { categoryPath: product.categoryPath } : {})}
                index={index}
                layout="feed"
              />
            ))}
          </div>
        )}
      </div>
    </PageShell>
  )
}

