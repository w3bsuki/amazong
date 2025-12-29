"use client"

import { useActionState, useEffect, useMemo, useState } from "react"
import { useFormStatus } from "react-dom"
import { Eye, EyeSlash, SpinnerGap } from "@phosphor-icons/react"
import { useTranslations } from "next-intl"
import Image from "next/image"

import { Link } from "@/i18n/routing"
import { login } from "../_actions/auth"
import type { AuthActionState } from "../_actions/auth"

function isProbablyValidEmail(value: string) {
  const v = value.trim()
  if (!v) return false
  // Lightweight client-side sanity check; server remains source of truth.
  return /\S+@\S+\.[\S]+/.test(v)
}

function SubmitButton({
  label,
  pendingLabel,
  disabled,
}: {
  label: string
  pendingLabel: string
  disabled?: boolean
}) {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending || disabled}
      className="w-full h-10 bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
    >
      {pending ? (
        <span className="inline-flex items-center gap-2">
          <SpinnerGap className="size-5 animate-spin" weight="bold" />
          {pendingLabel}
        </span>
      ) : (
        label
      )}
    </button>
  )
}

export function LoginForm({
  locale,
  redirectPath,
}: {
  locale: string
  redirectPath?: string | null
}) {
  const t = useTranslations("Auth")
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const initialState = useMemo(
    (): AuthActionState => ({ fieldErrors: {}, error: undefined, success: false }),
    [],
  )
  const [state, formAction] = useActionState(login.bind(null, locale, redirectPath), initialState)

  const emailHasValue = email.trim().length > 0
  const passwordHasValue = password.length > 0
  const emailLooksValid = !emailHasValue ? false : isProbablyValidEmail(email)
  const showClientEmailError = emailHasValue && !emailLooksValid
  const isSubmittable = emailHasValue && passwordHasValue && !showClientEmailError

  const clientInvalidEmailMessage =
    locale === "bg" ? "Моля, въведете валиден имейл адрес." : "Please enter a valid email address."

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
    <div className="min-h-svh flex items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-sm bg-card rounded-xl border border-border relative">
        <div className="p-6">
          <div className="flex flex-col items-center mb-6">
            <Link href="/" className="mb-4 hover:opacity-80 transition-opacity">
              <Image src="/icon.svg" width={40} height={40} alt="Treido" priority />
            </Link>
            <h1 className="text-xl font-semibold text-foreground">{t("signIn")}</h1>
            <p className="text-sm text-muted-foreground mt-1 text-center">{t("signInDescription")}</p>
          </div>

          <form action={formAction} onSubmit={onSubmit} className="space-y-4">
            {state?.error && (
              <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">{state.error}</div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">
                {t("emailOrPhone")}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("emailPlaceholder")}
                aria-invalid={showClientEmailError || !!state?.fieldErrors?.email}
                aria-describedby={showClientEmailError || state?.fieldErrors?.email ? "email-error" : undefined}
                className={`w-full h-10 px-3 text-sm text-foreground placeholder:text-muted-foreground bg-background border rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background transition-colors ${showClientEmailError || state?.fieldErrors?.email ? "border-destructive focus-visible:ring-destructive" : "border-input"}`}
              />
              {(showClientEmailError || state?.fieldErrors?.email) && (
                <p id="email-error" className="text-xs text-destructive mt-1" role="alert">
                  {state?.fieldErrors?.email ?? clientInvalidEmailMessage}
                </p>
              )}
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label htmlFor="password" className="text-sm font-medium text-foreground">
                  {t("password")}
                </label>
                <Link href="/auth/forgot-password" className="text-xs text-primary hover:underline">
                  {t("forgotPassword")}
                </Link>
              </div>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  placeholder={t("passwordPlaceholder")}
                  aria-invalid={!!state?.fieldErrors?.password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full h-10 px-3 pr-10 text-sm text-foreground placeholder:text-muted-foreground bg-background border rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background transition-colors ${state?.fieldErrors?.password ? "border-destructive focus-visible:ring-destructive" : "border-input"}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={showPassword ? t("hidePassword") : t("showPassword")}
                >
                  {showPassword ? <EyeSlash className="size-5" /> : <Eye className="size-5" />}
                </button>
              </div>
              {state?.fieldErrors?.password && <p className="text-xs text-destructive mt-1">{state.fieldErrors.password}</p>}
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-muted-foreground">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="size-4 rounded border-input accent-primary"
                />
                {t("rememberMe")}
              </label>
            </div>

            <div className="pt-1">
              <SubmitButton
                label={t("signIn")}
                pendingLabel={t("signingIn")}
                disabled={!isSubmittable}
              />
            </div>
          </form>

          <p className="text-xs text-muted-foreground mt-4 leading-relaxed">
            {t("byContinuing")} {" "}
            <Link href="/terms" className="text-primary hover:underline">
              {t("conditionsOfUse")}
            </Link>{" "}
            {t("and")} {" "}
            <Link href="/privacy" className="text-primary hover:underline">
              {t("privacyNotice")}
            </Link>
            .
          </p>

          <div className="mt-6">
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-border" />
              <p className="text-xs text-muted-foreground">{t("newToAmazon")}</p>
              <div className="h-px flex-1 bg-border" />
            </div>

            <Link href="/auth/sign-up" className="block mt-3">
              <button
                type="button"
                className="w-full h-10 bg-background border border-input text-foreground text-sm font-medium rounded-lg hover:bg-muted/50 transition-colors flex items-center justify-center"
              >
                {t("createAccount")}
              </button>
            </Link>
          </div>
        </div>

        <div className="px-6 py-4 bg-muted/30 border-t border-border rounded-b-xl">
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
          <p className="text-xs text-center text-muted-foreground/70 mt-2">{t("copyright", { year: new Date().getFullYear() })}</p>
        </div>
      </div>
    </div>
  )
}

