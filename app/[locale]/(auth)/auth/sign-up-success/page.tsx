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
  const t = await getTranslations({ locale, namespace: "Auth" })

  return {
    title: t("signUpSuccessTitle"),
    description: t("signUpSuccessDescription"),
  }
}

export { default } from "./sign-up-success-client"
