import { validateLocale } from "@/i18n/routing"
import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { createPageMetadata } from "@/lib/seo/metadata"

interface OnboardingBusinessProfilePageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({
  params,
}: OnboardingBusinessProfilePageProps): Promise<Metadata> {
  const { locale: localeParam } = await params
  const locale = validateLocale(localeParam)
  const t = await getTranslations({ locale, namespace: "Onboarding" })

  return createPageMetadata({
    locale,
    path: "/onboarding/business-profile",
    title: t("meta.businessProfile.title"),
    description: t("meta.businessProfile.description"),
  })
}

export { default } from "./business-profile-page-client"
