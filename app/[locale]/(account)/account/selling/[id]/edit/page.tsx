import { getTranslations, setRequestLocale } from "next-intl/server"
import { EditProductClient } from "../../edit/edit-product-client"
import { emptyStaticParams } from "@/lib/next/static-params"

// Generate static params for build validation (required by cacheComponents)
export function generateStaticParams() {
  return emptyStaticParams()
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string; locale: string }>
}) {
  const { locale: localeParam } = await params
  const locale = localeParam === "bg" ? "bg" : "en"
  const t = await getTranslations({ locale, namespace: "SellerManagement" })

  return {
    title: `${t("selling.edit.header.title")} | Treido`,
    description: t("selling.edit.header.description"),
  }
}

export default async function EditProductPage({ params }: { params: Promise<{ id: string; locale: string }> }) {
  const { id, locale: localeParam } = await params
  const locale = localeParam === "bg" ? "bg" : "en"

  // Enable static rendering for this locale
  setRequestLocale(locale)

  return <EditProductClient productId={id} locale={locale} />
}
