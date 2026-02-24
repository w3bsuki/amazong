import type { Metadata } from "next"
import { Link, validateLocale } from "@/i18n/routing"
import { getTranslations, setRequestLocale } from "next-intl/server"

export type LocaleNotFoundParams = {
  params?: Promise<{ locale: string }>
}

export async function buildSimpleNotFoundMetadata({
  params,
}: LocaleNotFoundParams): Promise<Metadata> {
  const resolved = params ? await params : null
  const locale = validateLocale(resolved?.locale ?? "en")
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: "NotFound" })

  return {
    title: t("metaTitle"),
  }
}

export async function renderSimpleNotFoundPage(
  options: LocaleNotFoundParams & {
    homeHref: string
    secondaryHref: string
  }
) {
  const resolved = options.params ? await options.params : null
  const locale = validateLocale(resolved?.locale ?? "en")
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: "NotFound" })

  return (
    <main>
      <h1>{t("title")}</h1>
      <p>{t("description")}</p>
      <nav>
        <Link href={options.homeHref}>{t("goToHomepage")}</Link>
        <Link href={options.secondaryHref}>{t("searchProducts")}</Link>
      </nav>
    </main>
  )
}
