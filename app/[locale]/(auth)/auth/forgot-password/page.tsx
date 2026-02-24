import { ForgotPasswordForm } from "../../_components/forgot-password-form"
import { requestPasswordReset } from "../../_actions/auth"
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
    title: t("forgotPasswordTitle"),
    description: t("forgotPasswordDescription"),
  }
}

export default async function ForgotPasswordPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  return <ForgotPasswordForm locale={locale} requestPasswordResetAction={requestPasswordReset} />
}
