"use client"

import { useActionState, useEffect, useMemo, useRef, useState } from "react"
import { Eye, EyeOff as EyeSlash } from "lucide-react";

import { useTranslations } from "next-intl"

import { SubmitButton } from "@/components/auth/submit-button"
import { Field, FieldContent, FieldError, FieldLabel } from "@/components/shared/field"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Link } from "@/i18n/routing"
import { cn } from "@/lib/utils"

type AuthActionState = {
  error?: string
  fieldErrors?: Record<string, string>
  success?: boolean
}

type BoundLoginAction = (
  prevState: AuthActionState,
  formData: FormData
) => Promise<AuthActionState>

interface LoginFormBodyProps {
  action: BoundLoginAction
  onSuccess?: () => void
  onSwitchToSignUp?: () => void
  onNavigateAway?: () => void
  showCreateAccountCta?: boolean
  showLegalText?: boolean
  className?: string
}

function isProbablyValidEmail(value: string) {
  const v = value.trim()
  if (!v) return false
  // Lightweight client-side sanity check; server remains source of truth.
  return /\S+@\S+\.[\S]+/.test(v)
}

export function LoginFormBody({
  action,
  onSuccess,
  onSwitchToSignUp,
  onNavigateAway,
  showCreateAccountCta = true,
  showLegalText = true,
  className,
}: LoginFormBodyProps) {
  const t = useTranslations("Auth")
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const handledSuccess = useRef(false)

  const initialState = useMemo(
    (): AuthActionState => ({ fieldErrors: {}, success: false }),
    []
  )
  const [state, formAction] = useActionState(action, initialState)

  useEffect(() => {
    if (state?.success && !handledSuccess.current) {
      handledSuccess.current = true
      onSuccess?.()
    }
    if (!state?.success) {
      handledSuccess.current = false
    }
  }, [state?.success, onSuccess])

  const emailHasValue = email.trim().length > 0
  const passwordHasValue = password.length > 0
  const emailLooksValid = !emailHasValue ? false : isProbablyValidEmail(email)
  const showClientEmailError = emailHasValue && !emailLooksValid
  const isSubmittable = emailHasValue && passwordHasValue && !showClientEmailError

  useEffect(() => {
    try {
      const savedRememberMe = localStorage.getItem("remember-me") === "true"
      const savedEmail = localStorage.getItem("remembered-email")
      setRememberMe(savedRememberMe)
      if (savedRememberMe && savedEmail) setEmail(savedEmail)
    } catch {
      // ignore
    }
  }, [])

  const onSubmit = () => {
    try {
      localStorage.setItem("remember-me", rememberMe ? "true" : "false")
      if (rememberMe) localStorage.setItem("remembered-email", email)
      else localStorage.removeItem("remembered-email")
    } catch {
      // ignore
    }
  }

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {state?.error && (
        <div
          className="rounded-xl border border-destructive bg-destructive-subtle p-3 text-sm text-destructive"
          data-testid="login-error-section"
          role="alert"
          aria-live="assertive"
        >
          {t(state.error as never)}
        </div>
      )}

      <form
        action={formAction}
        onSubmit={onSubmit}
        className="space-y-4"
        data-testid="login-form"
      >
        <Field
          data-testid="login-email-section"
          data-invalid={showClientEmailError || !!state?.fieldErrors?.email}
        >
          <FieldContent>
            <FieldLabel htmlFor="email">{t("email")}</FieldLabel>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("emailPlaceholder")}
              aria-invalid={showClientEmailError || !!state?.fieldErrors?.email}
              aria-describedby={
                showClientEmailError || state?.fieldErrors?.email ? "email-error" : undefined
              }
              className={cn(
                (showClientEmailError || state?.fieldErrors?.email) && "border-destructive"
              )}
            />
            <FieldError id="email-error">
              {showClientEmailError
                ? t("invalidEmail")
                : state?.fieldErrors?.email
                  ? t(state.fieldErrors.email as never)
                  : null}
            </FieldError>
          </FieldContent>
        </Field>

        <Field data-testid="login-password-section" data-invalid={!!state?.fieldErrors?.password}>
          <FieldContent>
            <div className="flex items-center justify-between gap-2">
              <FieldLabel htmlFor="password">{t("password")}</FieldLabel>
              <Link
                href="/auth/forgot-password"
                className="text-xs text-primary hover:underline min-h-11 flex items-center"
                onClick={onNavigateAway}
              >
                {t("forgotPassword")}
              </Link>
            </div>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                value={password}
                placeholder={t("passwordPlaceholder")}
                aria-invalid={!!state?.fieldErrors?.password}
                aria-describedby={state?.fieldErrors?.password ? "password-error" : undefined}
                onChange={(e) => setPassword(e.target.value)}
                className={cn("pr-12", state?.fieldErrors?.password && "border-destructive")}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-0 top-1/2 -translate-y-1/2 size-11 inline-flex items-center justify-center text-muted-foreground hover:text-foreground rounded-xl transition-colors motion-reduce:transition-none focus-visible:ring-2 focus-visible:ring-focus-ring"
                aria-label={showPassword ? t("hidePassword") : t("showPassword")}
                aria-controls="password"
                aria-pressed={showPassword}
              >
                {showPassword ? (
                  <EyeSlash className="size-4" aria-hidden="true" />
                ) : (
                  <Eye className="size-4" aria-hidden="true" />
                )}
              </button>
            </div>
            <FieldError id="password-error">
              {state?.fieldErrors?.password ? t(state.fieldErrors.password as never) : null}
            </FieldError>
          </FieldContent>
        </Field>

        <div
          className="flex items-center justify-between"
          data-testid="login-remember-section"
        >
          <div className="flex items-center gap-2 min-h-11">
            <Checkbox
              id="remember-me"
              checked={rememberMe}
              onCheckedChange={(checked) => setRememberMe(checked === true)}
            />
            <FieldLabel
              htmlFor="remember-me"
              className="text-sm text-muted-foreground cursor-pointer font-normal"
            >
              {t("rememberMe")}
            </FieldLabel>
          </div>
        </div>

        <div className="pt-1" data-testid="login-submit-section">
          <SubmitButton
            label={t("signIn")}
            pendingLabel={t("signingIn")}
            disabled={!isSubmittable}
          />
        </div>
      </form>

      {showCreateAccountCta && (
        <div data-testid="login-create-account-section">
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <p className="text-xs text-muted-foreground">{t("newToTreido")}</p>
            <div className="h-px flex-1 bg-border" />
          </div>

          {onSwitchToSignUp ? (
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="w-full mt-3"
              onClick={onSwitchToSignUp}
            >
              {t("createAccount")}
            </Button>
          ) : (
            <Button asChild variant="outline" size="lg" className="w-full mt-3">
              <Link href="/auth/sign-up" onClick={onNavigateAway}>
                {t("createAccount")}
              </Link>
            </Button>
          )}
        </div>
      )}

      {showLegalText && (
        <div className="space-y-1.5 text-xs" data-testid="login-legal-section">
          <p className="text-muted-foreground leading-relaxed">{t("byContinuing")}</p>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
            <Link
              href="/terms"
              className="inline-flex min-h-11 items-center text-primary hover:underline"
              onClick={onNavigateAway}
            >
              {t("conditionsOfUse")}
            </Link>
            <span className="text-muted-foreground">{t("and")}</span>
            <Link
              href="/privacy"
              className="inline-flex min-h-11 items-center text-primary hover:underline"
              onClick={onNavigateAway}
            >
              {t("privacyNotice")}
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
