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
      className="w-full h-10 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
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

  const initialState = useMemo<AuthActionState>(() => ({ fieldErrors: {}, error: undefined, success: false }), [])
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
    if (isCheckingUsername) return <SpinnerGap className="size-4 animate-spin text-gray-400" weight="bold" />
    if (usernameAvailable === true) return <CheckCircle className="size-4 text-emerald-600" weight="fill" />
    if (usernameAvailable === false) return <X className="size-4 text-red-500" />
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
    <div className="min-h-svh flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-sm bg-white rounded-xl border border-gray-200 relative">
        <div className="p-6">
          <div className="flex flex-col items-center mb-6">
            <Link href="/" className="mb-3 hover:opacity-80 transition-opacity">
              <Image src="/icon.svg" width={40} height={40} alt="AMZN" priority />
            </Link>
            <h1 className="text-xl font-semibold text-gray-900">{t("createAccountTitle")}</h1>
            <p className="text-sm text-gray-500 mt-1 text-center">{t("signUpDescription")}</p>
          </div>

          <form action={formAction} className="space-y-4">
            {state?.error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">{state.error}</div>
            )}

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                {t("yourName")}
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                placeholder={t("namePlaceholder")}
                onChange={(e) => setName(e.target.value)}
                className={`w-full h-10 px-3 text-sm text-gray-900 placeholder:text-gray-400 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-colors ${state?.fieldErrors?.name ? "border-red-400 focus:ring-red-500/40 focus:border-red-500" : "border-gray-300"}`}
                aria-invalid={!!state?.fieldErrors?.name}
              />
              {state?.fieldErrors?.name && <p className="text-xs text-red-500 mt-1">{state.fieldErrors.name}</p>}
            </div>

            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
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
                  placeholder={t("usernamePlaceholder")}
                    className={`w-full h-10 px-3 pr-10 text-sm text-gray-900 placeholder:text-gray-400 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-colors ${state?.fieldErrors?.username ? "border-red-400 focus:ring-red-500/40 focus:border-red-500" : "border-gray-300"}`}
                  aria-invalid={!!state?.fieldErrors?.username}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2">{usernameIndicator}</div>
              </div>
              {state?.fieldErrors?.username && <p className="text-xs text-red-500 mt-1">{state.fieldErrors.username}</p>}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                {t("email")}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder={t("emailPlaceholder")}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full h-10 px-3 text-sm text-gray-900 placeholder:text-gray-400 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-colors ${state?.fieldErrors?.email ? "border-red-400 focus:ring-red-500/40 focus:border-red-500" : "border-gray-300"}`}
                aria-invalid={!!state?.fieldErrors?.email}
              />
              {state?.fieldErrors?.email && <p className="text-xs text-red-500 mt-1">{state.fieldErrors.email}</p>}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                {t("password")}
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder={t("createPasswordPlaceholder")}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                    className={`w-full h-10 px-3 pr-10 text-sm text-gray-900 placeholder:text-gray-400 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-colors ${state?.fieldErrors?.password ? "border-red-400 focus:ring-red-500/40 focus:border-red-500" : "border-gray-300"}`}
                  aria-invalid={!!state?.fieldErrors?.password}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  aria-label={showPassword ? t("hidePassword") : t("showPassword")}
                >
                  {showPassword ? <EyeSlash className="size-5" /> : <Eye className="size-5" />}
                </button>
              </div>
              {password && (
                <div className="mt-1.5 space-y-1">
                  <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div className={`h-full transition-all duration-300 rounded-full ${strength.color} ${strength.width}`} />
                  </div>
                  <p className="text-xs text-gray-600">
                    {t("passwordStrength")}: {t(`strength${strength.label}`)}
                  </p>
                </div>
              )}
              {password && (
                <div className="mt-2 grid grid-cols-2 gap-x-2 gap-y-1">
                  {requirements.map((req, i) => (
                    <div
                      key={i}
                      className={`flex items-center gap-1.5 text-xs transition-colors ${req.met ? "text-emerald-600" : "text-gray-400"}`}
                    >
                      {req.met ? <Check className="size-3" weight="bold" /> : <X className="size-3" />}
                      <span>{req.label}</span>
                    </div>
                  ))}
                </div>
              )}
              {state?.fieldErrors?.password && <p className="text-xs text-red-500 mt-1">{state.fieldErrors.password}</p>}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                {t("confirmPassword")}
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder={t("confirmPasswordPlaceholder")}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`w-full h-10 px-3 pr-10 text-sm text-gray-900 placeholder:text-gray-400 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-colors ${state?.fieldErrors?.confirmPassword ? "border-red-400 focus:ring-red-500/40 focus:border-red-500" : "border-gray-300"}`}
                  aria-invalid={!!state?.fieldErrors?.confirmPassword}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  aria-label={showConfirmPassword ? t("hidePassword") : t("showPassword")}
                >
                  {showConfirmPassword ? <EyeSlash className="size-5" /> : <Eye className="size-5" />}
                </button>
              </div>
              {state?.fieldErrors?.confirmPassword && (
                <p className="text-xs text-red-500 mt-1">{state.fieldErrors.confirmPassword}</p>
              )}
            </div>

            <SubmitButton label={t("createYourAccount")} pendingLabel={t("creatingAccount")} disabled={!canSubmit} />
          </form>

          <p className="text-xs text-gray-600 mt-4 leading-relaxed">
            {t("byCreatingAccount")} {" "}
            <Link href="/terms" className="text-blue-600 hover:underline">
              {t("conditionsOfUse")}
            </Link>{" "}
            {t("and")} {" "}
            <Link href="/privacy" className="text-blue-600 hover:underline">
              {t("privacyNotice")}
            </Link>
            .
          </p>

          <div className="mt-6 text-center text-sm text-gray-600">
            {t("alreadyHaveAccount")} {" "}
            <Link href="/auth/login" className="text-blue-600 hover:underline font-medium">
              {t("signInArrow")}
            </Link>
          </div>
        </div>

        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-xl">
          <div className="flex justify-center gap-4 text-xs text-gray-500">
            <Link href="/terms" className="hover:text-blue-600 transition-colors">
              {t("conditionsOfUse")}
            </Link>
            <Link href="/privacy" className="hover:text-blue-600 transition-colors">
              {t("privacyNotice")}
            </Link>
            <Link href="/help" className="hover:text-blue-600 transition-colors">
              {t("help")}
            </Link>
          </div>
          <p className="text-xs text-center text-gray-400 mt-2">{t("copyright", { year: new Date().getFullYear() })}</p>
        </div>
      </div>
    </div>
  )
}
