"use client"

import { useActionState, useEffect, useMemo, useRef, useState } from "react"

import { useTranslations } from "next-intl"

import { SubmitButton } from "@/components/auth/submit-button"
import { getPasswordStrength } from "@/lib/validation/password-strength"
import {
  SignUpConfirmPasswordField,
  SignUpEmailField,
  SignUpNameField,
  SignUpPasswordField,
  SignUpUsernameField,
} from "@/components/auth/sign-up-form-fields"
import { SignUpFormFooter } from "@/components/auth/sign-up-form-footer"

type AuthActionState = {
  error?: string
  fieldErrors?: Record<string, string>
  success?: boolean
}

type BoundSignUpAction = (
  prevState: AuthActionState,
  formData: FormData
) => Promise<AuthActionState>

type CheckUsernameAvailabilityAction = (username: string) => Promise<{ available: boolean }>

interface SignUpFormBodyProps {
  action: BoundSignUpAction
  checkUsernameAvailabilityAction: CheckUsernameAvailabilityAction
  onSuccess?: () => void
  onSwitchToSignIn?: () => void
  onNavigateAway?: () => void
  showSignInCta?: boolean
  showLegalText?: boolean
  className?: string
}

export function SignUpFormBody({
  action,
  checkUsernameAvailabilityAction,
  onSuccess,
  onSwitchToSignIn,
  onNavigateAway,
  showSignInCta = true,
  showLegalText = true,
  className,
}: SignUpFormBodyProps) {
  const t = useTranslations("Auth")
  const handledSuccess = useRef(false)
  const invalidInputClass = "border-destructive"

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
  }, [username, checkUsernameAvailabilityAction])

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

  const canSubmit =
    name.trim().length >= 2 &&
    username.trim().length >= 3 &&
    email.trim().includes("@") &&
    password.length >= 8 &&
    confirmPassword.length >= 1 &&
    password === confirmPassword

  return (
    <div className={className}>
      <form
        action={formAction}
        className="space-y-4"
        onSubmit={() => {
          try {
            sessionStorage.setItem("lastSignupEmail", email.trim().toLowerCase())
          } catch {
            // Ignore storage access errors
          }
        }}
      >
        {state?.error && (
          <div
            className="rounded-xl border border-destructive bg-destructive-subtle p-3 text-sm text-destructive"
            role="alert"
            aria-live="assertive"
          >
            {t(state.error as never)}
          </div>
        )}

        <SignUpNameField
          t={t}
          fieldErrors={state?.fieldErrors}
          invalidInputClass={invalidInputClass}
          onChange={setName}
        />

        <SignUpUsernameField
          t={t}
          fieldErrors={state?.fieldErrors}
          invalidInputClass={invalidInputClass}
          username={username}
          onChange={setUsername}
          isCheckingUsername={isCheckingUsername}
          usernameAvailable={usernameAvailable}
        />

        <SignUpEmailField
          t={t}
          fieldErrors={state?.fieldErrors}
          invalidInputClass={invalidInputClass}
          onChange={setEmail}
        />

        <SignUpPasswordField
          t={t}
          fieldErrors={state?.fieldErrors}
          invalidInputClass={invalidInputClass}
          password={password}
          showPassword={showPassword}
          onTogglePassword={() => setShowPassword((value) => !value)}
          onChangePassword={setPassword}
          strengthUi={strengthUi}
          strengthLabel={t(strength.labelKey)}
          requirements={requirements}
        />

        <SignUpConfirmPasswordField
          t={t}
          fieldErrors={state?.fieldErrors}
          invalidInputClass={invalidInputClass}
          showConfirmPassword={showConfirmPassword}
          onToggleConfirmPassword={() => setShowConfirmPassword((value) => !value)}
          onChangeConfirmPassword={setConfirmPassword}
        />

        <SubmitButton
          label={t("createYourAccount")}
          pendingLabel={t("creatingAccount")}
          disabled={!canSubmit}
        />
      </form>

      <SignUpFormFooter
        t={t}
        showLegalText={showLegalText}
        showSignInCta={showSignInCta}
        onNavigateAway={onNavigateAway}
        onSwitchToSignIn={onSwitchToSignIn}
      />
    </div>
  )
}
