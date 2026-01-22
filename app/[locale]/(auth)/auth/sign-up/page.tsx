import { SignUpForm } from "../../_components/sign-up-form"
import { checkUsernameAvailability, signUp } from "../../_actions/auth"
import { setRequestLocale } from "next-intl/server"
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

  return {
    title: locale === "bg" ? "Създай акаунт" : "Create Account",
  }
}

export default async function SignUpPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  return (
    <SignUpForm
      locale={locale}
      signUpAction={signUp}
      checkUsernameAvailabilityAction={checkUsernameAvailability}
    />
  )
}
