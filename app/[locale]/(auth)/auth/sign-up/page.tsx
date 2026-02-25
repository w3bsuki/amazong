import { SignUpForm } from "../../_components/sign-up-form"
import { checkUsernameAvailability, signUp } from "../../_actions/auth"
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
    titleKey: "createAccountTitle",
    path: "/auth/sign-up",
  })
}

export default async function SignUpPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const locale = await resolveRouteLocale(params)
  return (
    <SignUpForm
      locale={locale}
      signUpAction={signUp}
      checkUsernameAvailabilityAction={checkUsernameAvailability}
    />
  )
}
