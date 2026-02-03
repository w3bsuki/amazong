import { locales } from "@/i18n/routing"

import { ProductQuickViewRouteOverlay } from "@/app/[locale]/(main)/_components/product-quick-view-route-overlay"

// Generate static params for build validation (required by cacheComponents)
// This is an intercepted route for modals - products are dynamically fetched
export function generateStaticParams() {
  return locales.map((locale) => ({ locale, username: "__placeholder__", productSlug: "__placeholder__" }))
}

export default async function ProductQuickViewModalPage({
  params,
}: {
  params: Promise<{ locale: string; username: string; productSlug: string }>
}) {
  const { locale, username, productSlug } = await params

  return <ProductQuickViewRouteOverlay locale={locale} username={username} productSlug={productSlug} />
}
