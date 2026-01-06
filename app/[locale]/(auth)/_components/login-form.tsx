"use client"

import { useActionState, useEffect, useMemo, useState } from "react"
import { useFormStatus } from "react-dom"
import { Eye, EyeSlash, SpinnerGap } from "@phosphor-icons/react"
import { useTranslations } from "next-intl"

import { AuthCard } from "@/components/auth/auth-card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Link } from "@/i18n/routing"
import { cn } from "@/lib/utils"
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
    <Button
      type="submit"
      size="lg"
      className="w-full"
      disabled={pending || disabled}
    >
      {pending ? (
        <span className="inline-flex items-center gap-2">
          <SpinnerGap className="size-5 animate-spin" weight="bold" />
          {pendingLabel}
        </span>
      ) : (
        label
      )}
    </Button>
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
    (): AuthActionState => ({ fieldErrors: {}, success: false }),
    [],
  )
  const [state, formAction] = useActionState(login.bind(null, locale, redirectPath), initialState)

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
      <p className="text-xs text-center text-muted-foreground/70">{t("copyright", { year: new Date().getFullYear() })}</p>
    </>
  )

  return (
    <AuthCard
      title={t("signIn")}
      description={t("signInDescription")}
      footer={footer}
    >
      <form action={formAction} onSubmit={onSubmit} className="space-y-4">
        {state?.error && (
          <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
            {state.error}
          </div>
        )}

        {/* Email Field */}
        <div className="space-y-1">
          <Label htmlFor="email">{t("emailOrPhone")}</Label>
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
            aria-describedby={showClientEmailError || state?.fieldErrors?.email ? "email-error" : undefined}
            className={cn(
              (showClientEmailError || state?.fieldErrors?.email) && "border-destructive focus-visible:ring-destructive/20"
            )}
          />
          {(showClientEmailError || state?.fieldErrors?.email) && (
            <p id="email-error" className="text-xs text-destructive" role="alert">
              {state?.fieldErrors?.email ?? t("invalidEmail")}
            </p>
          )}
        </div>

        {/* Password Field */}
        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <Label htmlFor="password">{t("password")}</Label>
            <Link href="/auth/forgot-password" className="text-xs text-primary hover:underline min-h-7 flex items-center">
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
              onChange={(e) => setPassword(e.target.value)}
              className={cn(
                "pr-10",
                state?.fieldErrors?.password && "border-destructive focus-visible:ring-destructive/20"
              )}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-1 top-1/2 -translate-y-1/2 size-8 flex items-center justify-center text-muted-foreground hover:text-foreground rounded-md transition-colors"
              aria-label={showPassword ? t("hidePassword") : t("showPassword")}
            >
              {showPassword ? <EyeSlash className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
          {state?.fieldErrors?.password && (
            <p className="text-xs text-destructive">{state.fieldErrors.password}</p>
          )}
        </div>

        {/* Remember Me */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 min-h-9">
            <Checkbox
              id="remember-me"
              checked={rememberMe}
              onCheckedChange={(checked) => setRememberMe(checked === true)}
            />
            <Label
              htmlFor="remember-me"
              className="text-sm text-muted-foreground cursor-pointer font-normal"
            >
              {t("rememberMe")}
            </Label>
          </div>
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
        {t("byContinuing")}{" "}
        <Link href="/terms" className="text-primary hover:underline">
          {t("conditionsOfUse")}
        </Link>{" "}
        {t("and")}{" "}
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
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="w-full"
          >
            {t("createAccount")}
          </Button>
        </Link>
      </div>
    </AuthCard>
  )
}

