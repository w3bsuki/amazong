"use client"

import { useActionState, useEffect, useMemo, useState } from "react"
import { Check, CheckCircle, Eye, EyeSlash, SpinnerGap, X } from "@phosphor-icons/react"
import { useTranslations } from "next-intl"

import { AuthCard } from "@/components/auth/auth-card"
import { SubmitButton } from "@/components/auth/submit-button"
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from "@/components/shared/field"
import { Input } from "@/components/ui/input"
import { Link } from "@/i18n/routing"
import { cn } from "@/lib/utils"
import { getPasswordStrength } from "@/lib/validation/password-strength"

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

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [password, setPassword] = useState("")

  const [username, setUsername] = useState("")
  const [isCheckingUsername, setIsCheckingUsername] = useState(false)
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null)

  const initialState = useMemo<AuthActionState>(() => ({ fieldErrors: {}, success: false }), [])
  const [state, formAction] = useActionState(signUpAction.bind(null, locale), initialState)

  useEffect(() => {
    let cancelled = false
    const timeoutId: ReturnType<typeof setTimeout> = setTimeout(async () => {
      const cleaned = username.trim().toLowerCase()
      if (!cleaned || cleaned.length < 3) {
        if (!cancelled) setUsernameAvailable(null)
        return
      }

      if (!cancelled) setIsCheckingUsername(true)
      try {
        const res = await checkUsernameAvailabilityAction(cleaned)
        if (!cancelled) setUsernameAvailable(res.available)
      } finally {
        if (!cancelled) setIsCheckingUsername(false)
      }
    }, 500)

    return () => {
      cancelled = true
      clearTimeout(timeoutId)
    }
  }, [username])

  const strength = useMemo(() => getPasswordStrength(password), [password])
  const strengthUi = useMemo(() => {
    if (strength.score <= 2) {
      return { color: "bg-destructive", width: "w-1/4" }
    }
    if (strength.score <= 4) {
      return { color: "bg-status-warning", width: "w-2/4" }
    }
    if (strength.score <= 5) {
      return { color: "bg-status-success", width: "w-3/4" }
    }
    return { color: "bg-status-success", width: "w-full" }
  }, [strength.score])

  const requirements = useMemo(
    () => [
      { label: t("reqMinChars"), met: password.length >= 8 },
      { label: t("reqUppercase"), met: /[A-Z]/.test(password) },
      { label: t("reqLowercase"), met: /[a-z]/.test(password) },
      { label: t("reqNumber"), met: /[0-9]/.test(password) },
    ],
    [password, t]
  )

  const usernameIndicator = (() => {
    if (!username || username.trim().length < 3) return null
    if (isCheckingUsername) {
      return (
        <span data-testid="username-availability" role="status" aria-live="polite">
          <span className="sr-only">{t("usernameAvailabilityChecking")}</span>
          <SpinnerGap className="size-4 animate-spin text-muted-foreground" weight="bold" />
        </span>
      )
    }
    if (usernameAvailable === true) {
      return (
        <span data-testid="username-availability" role="status" aria-live="polite">
          <span className="sr-only">{t("usernameAvailabilityAvailable")}</span>
          <CheckCircle className="size-4 text-success" weight="fill" />
        </span>
      )
    }
    if (usernameAvailable === false) {
      return (
        <span data-testid="username-availability" role="status" aria-live="polite">
          <span className="sr-only">{t("usernameAvailabilityUnavailable")}</span>
          <X className="size-4 text-destructive" />
        </span>
      )
    }
    return null
  })()

  const canSubmit =
    name.trim().length >= 2 &&
    username.trim().length >= 3 &&
    email.trim().includes("@") &&
    password.length >= 8 &&
    confirmPassword.length >= 1 &&
    password === confirmPassword

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
      <p className="text-xs text-center text-muted-foreground/70">{t("copyright", { year: new Date().getFullYear() })}</p>
    </>
  )

  return (
    <AuthCard
      title={t("createAccountTitle")}
      description={t("signUpDescription")}
      footer={footer}
    >
      <form
        action={formAction}
        className="space-y-4"
        onSubmit={() => {
          try {
            sessionStorage.setItem("lastSignupEmail", email.trim().toLowerCase())
            sessionStorage.setItem("lastSignupLocale", locale)
          } catch {
            // Ignore storage access errors
          }
        }}
      >
        {state?.error && (
          <div className="rounded-xl border border-destructive bg-destructive-subtle p-3 text-sm text-destructive">
            {t(state.error as never)}
          </div>
        )}

        {/* Name Field */}
        <Field data-invalid={!!state?.fieldErrors?.name}>
          <FieldContent>
            <FieldLabel htmlFor="name">{t("yourName")}</FieldLabel>
            <Input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              required
              placeholder={t("namePlaceholder")}
              onChange={(e) => setName(e.target.value)}
              aria-invalid={!!state?.fieldErrors?.name}
              aria-describedby={state?.fieldErrors?.name ? "name-error" : undefined}
              className={cn(
                state?.fieldErrors?.name &&
                  "border-destructive",
              )}
            />
            <FieldError id="name-error">
              {state?.fieldErrors?.name ? t(state.fieldErrors.name as never) : null}
            </FieldError>
          </FieldContent>
        </Field>

        {/* Username Field */}
        <Field data-invalid={!!state?.fieldErrors?.username}>
          <FieldContent>
            <FieldLabel htmlFor="username">{t("username")}</FieldLabel>
            <div className="relative">
              <Input
                id="username"
                name="username"
                type="text"
                value={username}
                onChange={(e) =>
                  setUsername(
                    e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""),
                  )
                }
                autoComplete="username"
                required
                placeholder={t("usernamePlaceholder")}
                aria-invalid={!!state?.fieldErrors?.username}
                aria-describedby={
                  state?.fieldErrors?.username ? "username-error" : undefined
                }
                className={cn(
                  "pr-10",
                  state?.fieldErrors?.username &&
                    "border-destructive",
                )}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {usernameIndicator}
              </div>
            </div>
            <FieldError id="username-error">
              {state?.fieldErrors?.username ? t(state.fieldErrors.username as never) : null}
            </FieldError>
          </FieldContent>
        </Field>

        {/* Email Field */}
        <Field data-invalid={!!state?.fieldErrors?.email}>
          <FieldContent>
            <FieldLabel htmlFor="email">{t("email")}</FieldLabel>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder={t("emailPlaceholder")}
              onChange={(e) => setEmail(e.target.value)}
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

        {/* Password Field */}
        <Field data-invalid={!!state?.fieldErrors?.password}>
          <FieldContent>
            <FieldLabel htmlFor="password">{t("password")}</FieldLabel>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                placeholder={t("createPasswordPlaceholder")}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                aria-invalid={!!state?.fieldErrors?.password}
                aria-describedby={
                  state?.fieldErrors?.password ? "password-error" : undefined
                }
                className={cn(
                  "pr-12",
                  state?.fieldErrors?.password &&
                    "border-destructive",
                )}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-0 top-1/2 -translate-y-1/2 size-11 inline-flex items-center justify-center text-muted-foreground hover:text-foreground rounded-xl transition-colors focus-visible:ring-2 focus-visible:ring-focus-ring"
                aria-label={showPassword ? t("hidePassword") : t("showPassword")}
              >
                {showPassword ? (
                  <EyeSlash className="size-5" />
                ) : (
                  <Eye className="size-5" />
                )}
              </button>
            </div>
          {password && (
            <div className="mt-1.5 space-y-1">
              <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
                <div className={`h-full transition-all duration-300 rounded-full ${strengthUi.color} ${strengthUi.width}`} />
              </div>
              <p className="text-xs text-muted-foreground">
                {t("passwordStrength")}: {t(strength.labelKey)}
              </p>
            </div>
          )}
          {password && (
            <div className="mt-2 grid grid-cols-2 gap-x-2 gap-y-1">
              {requirements.map((req, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-1.5 text-xs transition-colors ${req.met ? "text-foreground" : "text-muted-foreground"}`}
                >
                  {req.met ? <Check className="size-3" weight="bold" /> : <X className="size-3" />}
                  <span>{req.label}</span>
                </div>
              ))}
            </div>
          )}
            <FieldError id="password-error" className="mt-1">
              {state?.fieldErrors?.password ? t(state.fieldErrors.password as never) : null}
            </FieldError>
          </FieldContent>
        </Field>

        {/* Confirm Password Field */}
        <Field data-invalid={!!state?.fieldErrors?.confirmPassword}>
          <FieldContent>
            <FieldLabel htmlFor="confirmPassword">{t("confirmPassword")}</FieldLabel>
            <div className="relative">
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                placeholder={t("confirmPasswordPlaceholder")}
                onChange={(e) => setConfirmPassword(e.target.value)}
                aria-invalid={!!state?.fieldErrors?.confirmPassword}
                aria-describedby={
                  state?.fieldErrors?.confirmPassword
                    ? "confirmPassword-error"
                    : undefined
                }
                className={cn(
                  "pr-12",
                  state?.fieldErrors?.confirmPassword &&
                    "border-destructive",
                )}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((v) => !v)}
                className="absolute right-0 top-1/2 -translate-y-1/2 size-11 inline-flex items-center justify-center text-muted-foreground hover:text-foreground rounded-xl transition-colors focus-visible:ring-2 focus-visible:ring-focus-ring"
                aria-label={showConfirmPassword ? t("hidePassword") : t("showPassword")}
              >
                {showConfirmPassword ? (
                  <EyeSlash className="size-5" />
                ) : (
                  <Eye className="size-5" />
                )}
              </button>
            </div>
            <FieldError id="confirmPassword-error">
              {state?.fieldErrors?.confirmPassword
                ? t(state.fieldErrors.confirmPassword as never)
                : null}
            </FieldError>
          </FieldContent>
        </Field>

        <SubmitButton label={t("createYourAccount")} pendingLabel={t("creatingAccount")} disabled={!canSubmit} />
      </form>

      <p className="text-xs text-muted-foreground mt-4 leading-relaxed">
        {t("byCreatingAccount")}{" "}
        <Link href="/terms" className="text-primary hover:underline">
          {t("conditionsOfUse")}
        </Link>{" "}
        {t("and")}{" "}
        <Link href="/privacy" className="text-primary hover:underline">
          {t("privacyNotice")}
        </Link>
        .
      </p>

      <div className="mt-6 text-center text-sm text-muted-foreground">
        {t("alreadyHaveAccount")}{" "}
        <Link href="/auth/login" className="text-primary hover:underline font-medium">
          {t("signInArrow")}
        </Link>
      </div>
    </AuthCard>
  )
}
