"use client"

import { useActionState } from "react"
import { ArrowLeft, Check } from "lucide-react";

import { useTranslations } from "next-intl"

import { SubmitButton } from "@/components/auth/submit-button"
import { Field, FieldContent, FieldError, FieldLabel } from "@/components/shared/field"
import { Input } from "@/components/ui/input"
import { Link } from "@/i18n/routing"
import { cn } from "@/lib/utils"
import { AuthCard } from "./auth-card"

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
    const successFooter = (
      <Link href="/auth/login" className="inline-flex min-h-11 items-center gap-2 text-sm text-primary hover:underline">
        <ArrowLeft className="size-4" />
        {t("backToLogin")}
      </Link>
    )

    return (
      <AuthCard
        title={t("checkYourEmailTitle")}
        description={t("resetLinkSent")}
        footer={successFooter}
      >
        <div className="flex items-center justify-center py-1">
          <div className="inline-flex size-16 items-center justify-center rounded-full bg-primary-subtle text-primary">
            <Check className="size-8" />
          </div>
        </div>
      </AuthCard>
    )
  }

  const footer = (
    <Link href="/auth/login" className="inline-flex min-h-11 items-center gap-2 text-sm text-primary hover:underline">
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
          <div className="rounded-xl border border-destructive bg-destructive-subtle p-3 text-sm text-destructive">
            {t(state.error as never)}
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
                  "border-destructive",
              )}
            />
            <FieldError id="email-error">
              {state?.fieldErrors?.email ? t(state.fieldErrors.email as never) : null}
            </FieldError>
          </FieldContent>
        </Field>

        <SubmitButton label={t("sendResetLink")} pendingLabel={t("sending")} />
      </form>
    </AuthCard>
  )
}
