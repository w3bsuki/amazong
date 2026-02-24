import { validateLocale } from "@/i18n/routing"
import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"

interface OnboardingInterestsPageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({
  params,
}: OnboardingInterestsPageProps): Promise<Metadata> {
  const { locale: localeParam } = await params
  const locale = validateLocale(localeParam)
  const t = await getTranslations({ locale, namespace: "Onboarding" })

  return {
    title: t("meta.interests.title"),
    description: t("meta.interests.description"),
  }
}

export { default } from "./interests-page-client"
