"use client"

import { useActionState } from "react"
import { ArrowLeft, Check, Envelope } from "@phosphor-icons/react"
import { useTranslations } from "next-intl"

import { AuthCard } from "@/components/auth/auth-card"
import { SubmitButton } from "@/components/auth/submit-button"
import { Field, FieldContent, FieldError, FieldLabel } from "@/components/shared/field"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Link } from "@/i18n/routing"
import { cn } from "@/lib/utils"

type AuthActionState = {
  error?: string
  fieldErrors?: Record<string, string>
  success?: boolean
}

type RequestPasswordResetAction = (locale: string, prevState: AuthActionState, formData: FormData) => Promise<AuthActionState>

export function ForgotPasswordForm({
  locale,
  requestPasswordResetAction,
}: {
  locale: string
  requestPasswordResetAction: RequestPasswordResetAction
}) {
  const t = useTranslations("Auth")
  const initialState: AuthActionState = { fieldErrors: {}, success: false }
  const [state, formAction] = useActionState(requestPasswordResetAction.bind(null, locale), initialState)

  if (state?.success) {
    return (
      <div className="min-h-dvh flex items-center justify-center p-4">
        <div className="w-full max-w-sm text-center">
          <div className="flex flex-col items-center gap-4 mb-6">
            <div className="size-16 bg-success/10 rounded-full flex items-center justify-center">
              <Check className="size-8 text-success" weight="bold" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">{t("checkYourEmailTitle")}</h1>
            <p className="text-sm text-muted-foreground">
              {t("resetLinkSent")}
            </p>
          </div>
          <Link href="/auth/login" className="inline-flex items-center gap-2 text-sm text-primary hover:underline">
            <ArrowLeft className="size-4" />
            {t("backToLogin")}
          </Link>
        </div>
      </div>
    )
  }

  const footer = (
    <Link href="/auth/login" className="inline-flex items-center gap-2 text-sm text-primary hover:underline">
      <ArrowLeft className="size-4" />
      {t("backToLogin")}
    </Link>
  )

  return (
    <AuthCard
      title={t("forgotPasswordTitle")}
      description={t("forgotPasswordDescription")}
      footer={footer}
      showLogo={true}
    >
      <form action={formAction} className="space-y-4">
        {state?.error && (
          <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
            {state.error}
          </div>
        )}

        <Field data-invalid={!!state?.fieldErrors?.email}>
          <FieldContent>
            <FieldLabel htmlFor="email">{t("emailAddress")}</FieldLabel>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder={t("emailPlaceholder")}
              aria-invalid={!!state?.fieldErrors?.email}
              aria-describedby={state?.fieldErrors?.email ? "email-error" : undefined}
              className={cn(
                state?.fieldErrors?.email &&
                  "border-destructive focus-visible:ring-destructive/20",
              )}
            />
            <FieldError id="email-error">{state?.fieldErrors?.email}</FieldError>
          </FieldContent>
        </Field>

        <SubmitButton label={t("sendResetLink")} pendingLabel={t("sending")} />
      </form>
    </AuthCard>
  )
}
