import { validateLocale } from "@/i18n/routing"
import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"

interface OnboardingCompletePageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({
  params,
}: OnboardingCompletePageProps): Promise<Metadata> {
  const { locale: localeParam } = await params
  const locale = validateLocale(localeParam)
  const t = await getTranslations({ locale, namespace: "Onboarding" })

  return {
    title: t("meta.complete.title"),
    description: t("meta.complete.description"),
  }
}

export { default } from "./complete-page-client"
