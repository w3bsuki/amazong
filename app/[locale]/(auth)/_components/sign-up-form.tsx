"use client"

import { useActionState, useEffect, useMemo, useState } from "react"
import { useFormStatus } from "react-dom"
import { Check, CheckCircle, Eye, EyeSlash, SpinnerGap, X } from "@phosphor-icons/react"
import { useTranslations } from "next-intl"
import Image from "next/image"

import { Link } from "@/i18n/routing"
import { getPasswordStrength } from "@/lib/validations/auth"
import { checkUsernameAvailability, signUp, type AuthActionState } from "../_actions/auth"

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

export function SignUpForm({ locale }: { locale: string }) {
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

  const [accountType, setAccountType] = useState<"personal" | "business">("personal")

  const initialState = useMemo<AuthActionState>(() => ({ fieldErrors: {}, success: false }), [])
  const [state, formAction] = useActionState(signUp.bind(null, locale), initialState)

  useEffect(() => {
    let timeoutId: NodeJS.Timeout

    const run = async () => {
      const cleaned = username.trim().toLowerCase()
      if (!cleaned || cleaned.length < 3) {
        setUsernameAvailable(null)
        return
      }

      setIsCheckingUsername(true)
      try {
        const res = await checkUsernameAvailability(cleaned)
        setUsernameAvailable(res.available)
      } finally {
        setIsCheckingUsername(false)
      }
    }

    timeoutId = setTimeout(run, 500)
    return () => clearTimeout(timeoutId)
  }, [username])

  const strength = useMemo(() => getPasswordStrength(password), [password])

  const requirements = useMemo(
    () => [
      { label: t("reqMinChars"), met: password.length >= 6 },
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
        <span data-testid="username-availability" aria-label="Checking username availability">
          <span className="sr-only">Checking username availability</span>
          <SpinnerGap className="size-4 animate-spin text-muted-foreground" weight="bold" />
        </span>
      )
    }
    if (usernameAvailable === true) {
      return (
        <span data-testid="username-availability" aria-label="Username available">
          <span className="sr-only">Username available</span>
          <CheckCircle className="size-4 text-success" weight="fill" />
        </span>
      )
    }
    if (usernameAvailable === false) {
      return (
        <span data-testid="username-availability" aria-label="Username unavailable">
          <span className="sr-only">Username unavailable</span>
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
    password.length >= 6 &&
    confirmPassword.length >= 1 &&
    password === confirmPassword

  return (
    <div className="min-h-svh flex items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-sm bg-card rounded-xl border border-border relative">
        <div className="p-6">
          <div className="flex flex-col items-center mb-6">
            <Link href="/" className="mb-3 hover:opacity-80 transition-opacity">
              <Image src="/icon.svg" width={40} height={40} alt="Treido" priority />
            </Link>
            <h1 className="text-xl font-semibold text-foreground">{t("createAccountTitle")}</h1>
            <p className="text-sm text-muted-foreground mt-1 text-center">{t("signUpDescription")}</p>
          </div>

          <form action={formAction} className="space-y-4">
            {state?.error && (
              <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">{state.error}</div>
            )}

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                {t("accountTypeLabel")}
              </label>
              <input type="hidden" name="accountType" value={accountType} />

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setAccountType("personal")}
                  className={
                    accountType === "personal"
                      ? "h-10 rounded-lg border border-primary bg-primary/10 text-foreground text-sm font-medium"
                      : "h-10 rounded-lg border border-input bg-background text-foreground text-sm hover:bg-muted/50"
                  }
                  aria-pressed={accountType === "personal"}
                >
                  {t("accountTypePersonal")}
                </button>
                <button
                  type="button"
                  onClick={() => setAccountType("business")}
                  className={
                    accountType === "business"
                      ? "h-10 rounded-lg border border-primary bg-primary/10 text-foreground text-sm font-medium"
                      : "h-10 rounded-lg border border-input bg-background text-foreground text-sm hover:bg-muted/50"
                  }
                  aria-pressed={accountType === "business"}
                >
                  {t("accountTypeBusiness")}
                </button>
              </div>
              <p className="text-xs text-muted-foreground mt-1.5">{t("accountTypeHint")}</p>
            </div>

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1">
                {t("yourName")}
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                placeholder={t("namePlaceholder")}
                onChange={(e) => setName(e.target.value)}
                className={`w-full h-10 px-3 text-sm text-foreground placeholder:text-muted-foreground bg-background border rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background transition-colors ${state?.fieldErrors?.name ? "border-destructive focus-visible:ring-destructive" : "border-input"}`}
                aria-invalid={!!state?.fieldErrors?.name}
              />
              {state?.fieldErrors?.name && <p className="text-xs text-destructive mt-1">{state.fieldErrors.name}</p>}
            </div>

            <div>
              <label htmlFor="username" className="block text-sm font-medium text-foreground mb-1">
                {t("username")}
              </label>
              <div className="relative">
                <input
                  id="username"
                  name="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                  required
                  placeholder={t("usernamePlaceholder")}
                    className={`w-full h-10 px-3 pr-10 text-sm text-foreground placeholder:text-muted-foreground bg-background border rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background transition-colors ${state?.fieldErrors?.username ? "border-destructive focus-visible:ring-destructive" : "border-input"}`}
                  aria-invalid={!!state?.fieldErrors?.username}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2">{usernameIndicator}</div>
              </div>
              {state?.fieldErrors?.username && <p className="text-xs text-destructive mt-1">{state.fieldErrors.username}</p>}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">
                {t("email")}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder={t("emailPlaceholder")}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full h-10 px-3 text-sm text-foreground placeholder:text-muted-foreground bg-background border rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background transition-colors ${state?.fieldErrors?.email ? "border-destructive focus-visible:ring-destructive" : "border-input"}`}
                aria-invalid={!!state?.fieldErrors?.email}
              />
              {state?.fieldErrors?.email && <p className="text-xs text-destructive mt-1">{state.fieldErrors.email}</p>}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-foreground mb-1">
                {t("password")}
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  placeholder={t("createPasswordPlaceholder")}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                    className={`w-full h-10 px-3 pr-10 text-sm text-foreground placeholder:text-muted-foreground bg-background border rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background transition-colors ${state?.fieldErrors?.password ? "border-destructive focus-visible:ring-destructive" : "border-input"}`}
                  aria-invalid={!!state?.fieldErrors?.password}
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
              {password && (
                <div className="mt-1.5 space-y-1">
                  <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
                    <div className={`h-full transition-all duration-300 rounded-full ${strength.color} ${strength.width}`} />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {t("passwordStrength")}: {t(`strength${strength.label}`)}
                  </p>
                </div>
              )}
              {password && (
                <div className="mt-2 grid grid-cols-2 gap-x-2 gap-y-1">
                  {requirements.map((req, i) => (
                    <div
                      key={i}
                      className={`flex items-center gap-1.5 text-xs transition-colors ${req.met ? "text-success" : "text-muted-foreground"}`}
                    >
                      {req.met ? <Check className="size-3" weight="bold" /> : <X className="size-3" />}
                      <span>{req.label}</span>
                    </div>
                  ))}
                </div>
              )}
              {state?.fieldErrors?.password && <p className="text-xs text-destructive mt-1">{state.fieldErrors.password}</p>}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground mb-1">
                {t("confirmPassword")}
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  placeholder={t("confirmPasswordPlaceholder")}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`w-full h-10 px-3 pr-10 text-sm text-foreground placeholder:text-muted-foreground bg-background border rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background transition-colors ${state?.fieldErrors?.confirmPassword ? "border-destructive focus-visible:ring-destructive" : "border-input"}`}
                  aria-invalid={!!state?.fieldErrors?.confirmPassword}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={showConfirmPassword ? t("hidePassword") : t("showPassword")}
                >
                  {showConfirmPassword ? <EyeSlash className="size-5" /> : <Eye className="size-5" />}
                </button>
              </div>
              {state?.fieldErrors?.confirmPassword && (
                <p className="text-xs text-destructive mt-1">{state.fieldErrors.confirmPassword}</p>
              )}
            </div>

            <SubmitButton label={t("createYourAccount")} pendingLabel={t("creatingAccount")} disabled={!canSubmit} />
          </form>

          <p className="text-xs text-muted-foreground mt-4 leading-relaxed">
            {t("byCreatingAccount")} {" "}
            <Link href="/terms" className="text-primary hover:underline">
              {t("conditionsOfUse")}
            </Link>{" "}
            {t("and")} {" "}
            <Link href="/privacy" className="text-primary hover:underline">
              {t("privacyNotice")}
            </Link>
            .
          </p>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            {t("alreadyHaveAccount")} {" "}
            <Link href="/auth/login" className="text-primary hover:underline font-medium">
              {t("signInArrow")}
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
