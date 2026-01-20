"use client"

import { useActionState, useEffect, useMemo, useState } from "react"
import { useFormStatus } from "react-dom"
import { Check, CheckCircle, Eye, EyeSlash, SpinnerGap, X } from "@phosphor-icons/react"
import { useTranslations } from "next-intl"

import { AuthCard } from "@/components/auth/auth-card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Link } from "@/i18n/routing"
import { cn } from "@/lib/utils"
import { getPasswordStrength } from "@/lib/validations/password-strength"
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
    <Button
      type="submit"
      size="lg"
      className="w-full h-10"
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
    let cancelled = false
    const timeoutId: ReturnType<typeof setTimeout> = setTimeout(async () => {
      const cleaned = username.trim().toLowerCase()
      if (!cleaned || cleaned.length < 3) {
        if (!cancelled) setUsernameAvailable(null)
        return
      }

      if (!cancelled) setIsCheckingUsername(true)
      try {
        const res = await checkUsernameAvailability(cleaned)
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
          <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
            {state.error}
          </div>
        )}

        {/* Account Type Selection */}
        <div className="space-y-2">
          <Label>{t("accountTypeLabel")}</Label>
          <input type="hidden" name="accountType" value={accountType} />

          <div className="grid grid-cols-2 gap-2">
            <Button
              type="button"
              variant={accountType === "personal" ? "default" : "outline"}
              size="lg"
              className={cn(
                "h-10",
                accountType === "personal" && "bg-primary/10 text-foreground border-primary hover:bg-primary/20"
              )}
              onClick={() => setAccountType("personal")}
              aria-pressed={accountType === "personal"}
            >
              {t("accountTypePersonal")}
            </Button>
            <Button
              type="button"
              variant={accountType === "business" ? "default" : "outline"}
              size="lg"
              className={cn(
                "h-10",
                accountType === "business" && "bg-primary/10 text-foreground border-primary hover:bg-primary/20"
              )}
              onClick={() => setAccountType("business")}
              aria-pressed={accountType === "business"}
            >
              {t("accountTypeBusiness")}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">{t("accountTypeHint")}</p>
        </div>

        {/* Name Field */}
        <div className="space-y-1">
          <Label htmlFor="name">{t("yourName")}</Label>
          <Input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            required
            placeholder={t("namePlaceholder")}
            onChange={(e) => setName(e.target.value)}
            aria-invalid={!!state?.fieldErrors?.name}
            className={cn(state?.fieldErrors?.name && "border-destructive focus-visible:ring-destructive/20")}
          />
          {state?.fieldErrors?.name && (
            <p className="text-xs text-destructive">{state.fieldErrors.name}</p>
          )}
        </div>

        {/* Username Field */}
        <div className="space-y-1">
          <Label htmlFor="username">{t("username")}</Label>
          <div className="relative">
            <Input
              id="username"
              name="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
              autoComplete="username"
              required
              placeholder={t("usernamePlaceholder")}
              aria-invalid={!!state?.fieldErrors?.username}
              className={cn(
                "pr-10",
                state?.fieldErrors?.username && "border-destructive focus-visible:ring-destructive/20"
              )}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2">{usernameIndicator}</div>
          </div>
          {state?.fieldErrors?.username && (
            <p className="text-xs text-destructive">{state.fieldErrors.username}</p>
          )}
        </div>

        {/* Email Field */}
        <div className="space-y-1">
          <Label htmlFor="email">{t("email")}</Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder={t("emailPlaceholder")}
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={!!state?.fieldErrors?.email}
            className={cn(state?.fieldErrors?.email && "border-destructive focus-visible:ring-destructive/20")}
          />
          {state?.fieldErrors?.email && (
            <p className="text-xs text-destructive">{state.fieldErrors.email}</p>
          )}
        </div>

        {/* Password Field */}
        <div className="space-y-1">
          <Label htmlFor="password">{t("password")}</Label>
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
              className={cn(
                "pr-10",
                state?.fieldErrors?.password && "border-destructive focus-visible:ring-destructive/20"
              )}
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
          {state?.fieldErrors?.password && (
            <p className="text-xs text-destructive mt-1">{state.fieldErrors.password}</p>
          )}
        </div>

        {/* Confirm Password Field */}
        <div className="space-y-1">
          <Label htmlFor="confirmPassword">{t("confirmPassword")}</Label>
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
              className={cn(
                "pr-10",
                state?.fieldErrors?.confirmPassword && "border-destructive focus-visible:ring-destructive/20"
              )}
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
            <p className="text-xs text-destructive">{state.fieldErrors.confirmPassword}</p>
          )}
        </div>

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
