"use client"

import { useActionState, useEffect, useMemo, useState } from "react"
import { useFormStatus } from "react-dom"
import { Eye, EyeSlash, SpinnerGap } from "@phosphor-icons/react"
import { useTranslations } from "next-intl"
import Image from "next/image"

import { Link } from "@/i18n/routing"
import { login } from "../_actions/auth"
import type { AuthActionState } from "../_actions/auth"

function SubmitButton({
  label,
  pendingLabel,
}: {
  label: string
  pendingLabel: string
}) {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
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
    <div className="min-h-svh flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-sm bg-white rounded-xl border border-gray-200 relative">
        <div className="p-6">
          <div className="flex flex-col items-center mb-6">
            <Link href="/" className="mb-4 hover:opacity-80 transition-opacity">
              <Image src="/icon.svg" width={40} height={40} alt="AMZN" priority />
            </Link>
            <h1 className="text-xl font-semibold text-gray-900">{t("signIn")}</h1>
            <p className="text-sm text-gray-500 mt-1 text-center">{t("signInDescription")}</p>
          </div>

          <form action={formAction} onSubmit={onSubmit} className="space-y-4">
            {state?.error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">{state.error}</div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
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
                aria-invalid={!!state?.fieldErrors?.email}
                className={`w-full h-10 px-3 text-sm text-gray-900 placeholder:text-gray-400 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-colors ${state?.fieldErrors?.email ? "border-red-400 focus:ring-red-500/40 focus:border-red-500" : "border-gray-300"}`}
              />
              {state?.fieldErrors?.email && <p className="text-xs text-red-500 mt-1">{state.fieldErrors.email}</p>}
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label htmlFor="password" className="text-sm font-medium text-gray-700">
                  {t("password")}
                </label>
                <Link href="/auth/forgot-password" className="text-xs text-blue-600 hover:underline">
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
                  className={`w-full h-10 px-3 pr-10 text-sm text-gray-900 placeholder:text-gray-400 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-colors ${state?.fieldErrors?.password ? "border-red-400 focus:ring-red-500/40 focus:border-red-500" : "border-gray-300"}`}
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
              {state?.fieldErrors?.password && <p className="text-xs text-red-500 mt-1">{state.fieldErrors.password}</p>}
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-gray-600">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="size-4 rounded border-gray-300"
                />
                {t("rememberMe")}
              </label>
            </div>

            <div className="pt-1">
              <SubmitButton label={t("signIn")} pendingLabel={t("signingIn")} />
            </div>
          </form>

          <p className="text-xs text-gray-600 mt-4 leading-relaxed">
            {t("byContinuing")} {" "}
            <Link href="/terms" className="text-blue-600 hover:underline">
              {t("conditionsOfUse")}
            </Link>{" "}
            {t("and")} {" "}
            <Link href="/privacy" className="text-blue-600 hover:underline">
              {t("privacyNotice")}
            </Link>
            .
          </p>

          <div className="mt-6">
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-gray-200" />
              <p className="text-xs text-gray-500">{t("newToAmazon")}</p>
              <div className="h-px flex-1 bg-gray-200" />
            </div>

            <Link href="/auth/sign-up" className="block mt-3">
              <button
                type="button"
                className="w-full h-10 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center"
              >
                {t("createAccount")}
              </button>
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

