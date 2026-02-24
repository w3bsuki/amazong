import { WelcomeClient } from "../../_components/welcome-client"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { validateLocale } from "@/i18n/routing"
import type { Metadata } from "next"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale: localeParam } = await params
  const locale = validateLocale(localeParam)
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: "Onboarding" })

  return {
    title: t("accountType.title"),
    description: t("accountType.subtitle"),
  }
}

export default async function WelcomePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  return <WelcomeClient locale={locale} />
}
