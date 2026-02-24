import { validateLocale } from "@/i18n/routing"
import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"

interface OnboardingAccountTypePageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({
  params,
}: OnboardingAccountTypePageProps): Promise<Metadata> {
  const { locale: localeParam } = await params
  const locale = validateLocale(localeParam)
  const t = await getTranslations({ locale, namespace: "Onboarding" })

  return {
    title: t("meta.accountType.title"),
    description: t("meta.accountType.description"),
  }
}

export { default } from "./account-type-page-client"
