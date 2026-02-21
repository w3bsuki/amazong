import { useMemo } from "react"
import { useTranslations } from "next-intl"

import { LoginFormBody } from "@/components/auth/login-form-body"
import { AuthCard } from "./auth-card"

type AuthActionState = {
  error?: string
  fieldErrors?: Record<string, string>
  success?: boolean
}

type LoginAction = (
  locale: string,
  redirectPath: string | null | undefined,
  prevState: AuthActionState,
  formData: FormData
) => Promise<AuthActionState>

export function LoginForm({
  locale,
  redirectPath,
  loginAction,
}: {
  locale: string
  redirectPath?: string | null
  loginAction: LoginAction
}) {
  const t = useTranslations("Auth")

  const action = useMemo(
    () => loginAction.bind(null, locale, redirectPath),
    [locale, loginAction, redirectPath]
  )

  return (
    <AuthCard title={t("signIn")} description={t("signInDescription")}>
      <LoginFormBody action={action} redirectPath={redirectPath ?? null} />
    </AuthCard>
  )
}


