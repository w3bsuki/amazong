import { useMemo } from "react"
import { useTranslations } from "next-intl"

import { SignUpFormBody } from "@/components/auth/sign-up-form-body"
import { AuthCard } from "./auth-card"

type AuthActionState = {
  error?: string
  fieldErrors?: Record<string, string>
  success?: boolean
}

type SignUpAction = (locale: string, prevState: AuthActionState, formData: FormData) => Promise<AuthActionState>
type CheckUsernameAvailabilityAction = (username: string) => Promise<{ available: boolean }>

export function SignUpForm({
  locale,
  signUpAction,
  checkUsernameAvailabilityAction,
}: {
  locale: string
  signUpAction: SignUpAction
  checkUsernameAvailabilityAction: CheckUsernameAvailabilityAction
}) {
  const t = useTranslations("Auth")
  const action = useMemo(() => signUpAction.bind(null, locale), [locale, signUpAction])

  return (
    <AuthCard title={t("createAccountTitle")} description={t("signUpDescription")}>
      <SignUpFormBody
        action={action}
        checkUsernameAvailabilityAction={checkUsernameAvailabilityAction}
      />
    </AuthCard>
  )
}

