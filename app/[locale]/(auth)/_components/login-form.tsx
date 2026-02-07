"use client"

import { useMemo } from "react"
import { useTranslations } from "next-intl"

import { AuthCard } from "@/components/auth/auth-card"
import { LoginFormBody } from "@/components/auth/login-form-body"
import { Link } from "@/i18n/routing"

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

  const footer = (
    <>
      <div className="flex justify-center gap-2 text-xs text-muted-foreground">
        <Link href="/terms" className="hover:text-primary transition-colors min-h-8 px-2 flex items-center">
          {t("conditionsOfUse")}
        </Link>
        <Link href="/privacy" className="hover:text-primary transition-colors min-h-8 px-2 flex items-center">
          {t("privacyNotice")}
        </Link>
        <Link href="/help" className="hover:text-primary transition-colors min-h-8 px-2 flex items-center">
          {t("help")}
        </Link>
      </div>
      <p className="text-xs text-center text-muted-foreground">{t("copyright", { year: new Date().getFullYear() })}</p>
    </>
  )

  return (
    <AuthCard
      title={t("signIn")}
      description={t("signInDescription")}
      footer={footer}
    >
      <LoginFormBody action={action} />
    </AuthCard>
  )
}

