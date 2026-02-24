import type { Metadata } from "next"
import { Link, validateLocale } from "@/i18n/routing"
import { getTranslations, setRequestLocale } from "next-intl/server"

type NotFoundProps = {
  params?: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: NotFoundProps): Promise<Metadata> {
  const resolved = params ? await params : null
  const locale = validateLocale(resolved?.locale ?? "en")
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: "NotFound" })

  return {
    title: t("metaTitle"),
  }
}

export default async function NotFound({ params }: NotFoundProps) {
  const resolved = params ? await params : null
  const locale = validateLocale(resolved?.locale ?? "en")
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: "NotFound" })

  return (
    <main>
      <h1>{t("title")}</h1>
      <p>{t("description")}</p>
      <nav>
        <Link href="/dashboard">{t("goToHomepage")}</Link>
        <Link href="/dashboard/orders">{t("searchProducts")}</Link>
      </nav>
    </main>
  )
}
