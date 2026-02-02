import { Suspense } from "react"
import { setRequestLocale } from "next-intl/server"
import { locales } from "@/i18n/routing"
import { EditProductClient } from "../../edit/edit-product-client"
import { Skeleton } from "@/components/ui/skeleton"

// Generate static params for build validation (required by cacheComponents)
export function generateStaticParams() {
  return locales.map((locale) => ({ locale, id: "__placeholder__" }))
}

export default async function EditProductPage({ params }: { params: Promise<{ id: string; locale: string }> }) {
  const { id, locale: localeParam } = await params
  const locale = localeParam === "bg" ? "bg" : "en"

  // Enable static rendering for this locale
  setRequestLocale(locale)

  return (
    <Suspense
      fallback={
        <div className="py-4 sm:py-6">
          <Skeleton className="h-8 w-64 mb-4" />
          <Skeleton className="h-(--spacing-scroll-xl) w-full" />
        </div>
      }
    >
      <EditProductClient productId={id} locale={locale} />
    </Suspense>
  )
}
