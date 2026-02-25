import { redirect, validateLocale } from "@/i18n/routing"
import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { createPageMetadata } from "@/lib/seo/metadata"

interface OnboardingPageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({
  params,
}: OnboardingPageProps): Promise<Metadata> {
  const { locale: localeParam } = await params
  const locale = validateLocale(localeParam)
  const t = await getTranslations({ locale, namespace: "Onboarding" })

  return createPageMetadata({
    locale,
    path: "/onboarding",
    title: t("meta.index.title"),
    description: t("meta.index.description"),
  })
}

export default async function OnboardingPage({ params }: OnboardingPageProps) {
  const { locale } = await params
  // Redirect to account type selection as the first step
  redirect({ href: "/onboarding/account-type", locale: validateLocale(locale) })
}
