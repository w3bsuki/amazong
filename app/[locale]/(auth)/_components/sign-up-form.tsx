"use client"

import { useMemo } from "react"
import { useTranslations } from "next-intl"

import { AuthCard } from "@/components/auth/auth-card"
import { SignUpFormBody } from "@/components/auth/sign-up-form-body"
import { Link } from "@/i18n/routing"

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

  const footer = (
    <>
      <div className="flex justify-center gap-4 text-xs text-muted-foreground">
        <Link href="/terms" className="hover:text-primary transition-colors">
          {t("conditionsOfUse")}
        </Link>
        <Link href="/privacy" className="hover:text-primary transition-colors">
          {t("privacyNotice")}
        </Link>
        <Link href="/help" className="hover:text-primary transition-colors">
          {t("help")}
        </Link>
      </div>
      <p className="text-xs text-center text-muted-foreground">{t("copyright", { year: new Date().getFullYear() })}</p>
    </>
  )

  return (
    <AuthCard
      title={t("createAccountTitle")}
      description={t("signUpDescription")}
      footer={footer}
    >
      <SignUpFormBody
        action={action}
        checkUsernameAvailabilityAction={checkUsernameAvailabilityAction}
      />
    </AuthCard>
  )
}
