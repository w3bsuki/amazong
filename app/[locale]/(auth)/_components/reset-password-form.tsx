"use client"

import { useActionState, useEffect, useMemo, useState } from "react"
import { useFormStatus } from "react-dom"
import { ArrowLeft, Eye, EyeSlash, Lock, SpinnerGap } from "@phosphor-icons/react"

import { Link } from "@/i18n/routing"
import { createClient } from "@/lib/supabase/client"
import { resetPassword, type AuthActionState } from "../_actions/auth"

function SubmitButton({ locale }: { locale: string }) {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full py-2.5 px-4 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
    >
      {pending ? (
        <>
          <SpinnerGap className="size-5 animate-spin" weight="bold" />
          {locale === "bg" ? "Запазване..." : "Updating..."}
        </>
      ) : locale === "bg" ? (
        "Запази новата парола"
      ) : (
        "Update password"
      )}
    </button>
  )
}

export function ResetPasswordForm({ locale }: { locale: string }) {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isValidSession, setIsValidSession] = useState<boolean | null>(null)

  const initialState = useMemo<AuthActionState>(() => ({ fieldErrors: {}, error: undefined, success: false }), [])
  const [state, formAction] = useActionState(resetPassword.bind(null, locale), initialState)

  useEffect(() => {
    const checkSession = async () => {
      const supabase = createClient()
      const { data } = await supabase.auth.getSession()
      setIsValidSession(!!data.session)
    }

    checkSession()
  }, [])

  if (isValidSession === null) {
    return (
      <div className="w-full max-w-sm mx-auto text-center">
        <SpinnerGap className="size-8 animate-spin mx-auto text-blue-600" />
        <p className="text-sm text-gray-600 mt-4">{locale === "bg" ? "Зареждане..." : "Loading..."}</p>
      </div>
    )
  }

  if (!isValidSession) {
    return (
      <div className="w-full max-w-sm mx-auto text-center">
        <div className="flex flex-col items-center gap-4 mb-6">
          <div className="size-16 bg-red-100 rounded-full flex items-center justify-center">
            <Lock className="size-8 text-red-600" weight="bold" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">{locale === "bg" ? "Линкът е изтекъл" : "Link expired"}</h1>
          <p className="text-sm text-gray-600">
            {locale === "bg"
              ? "Линкът за възстановяване на паролата е изтекъл или е невалиден."
              : "The password reset link has expired or is invalid."}
          </p>
        </div>
        <Link href="/auth/forgot-password" className="inline-flex items-center gap-2 text-sm text-blue-600 hover:underline">
          {locale === "bg" ? "Заявете нов линк" : "Request a new link"}
        </Link>
      </div>
    )
  }

  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="text-center mb-8">
        <div className="size-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Lock className="size-6 text-blue-600" weight="bold" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">{locale === "bg" ? "Нова парола" : "Set new password"}</h1>
        <p className="text-sm text-gray-600 mt-2">
          {locale === "bg" ? "Въведете новата си парола по-долу." : "Enter your new password below."}
        </p>
      </div>

      <form action={formAction} className="space-y-4">
        {state?.error && (
          <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">{state.error}</div>
        )}

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            {locale === "bg" ? "Нова парола" : "New password"}
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="••••••••"
              aria-invalid={!!state?.fieldErrors?.password}
              className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeSlash className="size-5" /> : <Eye className="size-5" />}
            </button>
          </div>
          {state?.fieldErrors?.password && <p className="text-xs text-red-500 mt-1">{state.fieldErrors.password}</p>}
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
            {locale === "bg" ? "Потвърдете паролата" : "Confirm password"}
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="••••••••"
              aria-invalid={!!state?.fieldErrors?.confirmPassword}
              className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showConfirmPassword ? <EyeSlash className="size-5" /> : <Eye className="size-5" />}
            </button>
          </div>
          {state?.fieldErrors?.confirmPassword && (
            <p className="text-xs text-red-500 mt-1">{state.fieldErrors.confirmPassword}</p>
          )}
        </div>

        <div className="text-xs text-gray-500 space-y-1">
          <p>{locale === "bg" ? "Паролата трябва да съдържа:" : "Password must contain:"}</p>
          <ul className="list-disc list-inside space-y-0.5 ml-2">
            <li>{locale === "bg" ? "Минимум 8 символа" : "At least 8 characters"}</li>
            <li>{locale === "bg" ? "Една главна буква" : "One uppercase letter"}</li>
            <li>{locale === "bg" ? "Една малка буква" : "One lowercase letter"}</li>
            <li>{locale === "bg" ? "Една цифра" : "One number"}</li>
          </ul>
        </div>

        <SubmitButton locale={locale} />
      </form>

      <div className="mt-6 text-center">
        <Link href="/auth/login" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800">
          <ArrowLeft className="size-4" />
          {locale === "bg" ? "Обратно към вход" : "Back to login"}
        </Link>
      </div>
    </div>
  )
}
