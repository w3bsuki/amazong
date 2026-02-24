import { ForgotPasswordForm } from "../../_components/forgot-password-form"
import { requestPasswordReset } from "../../_actions/auth"
import type { Metadata } from "next"
import { buildRouteMetadata, resolveRouteLocale } from "../_lib/route-locale-metadata"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  return buildRouteMetadata({
    params,
    namespace: "Auth",
    titleKey: "forgotPasswordTitle",
    descriptionKey: "forgotPasswordDescription",
  })
}

export default async function ForgotPasswordPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const locale = await resolveRouteLocale(params)
  return <ForgotPasswordForm locale={locale} requestPasswordResetAction={requestPasswordReset} />
}
