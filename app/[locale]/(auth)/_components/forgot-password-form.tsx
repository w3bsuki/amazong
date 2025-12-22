"use client"

import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { ArrowLeft, Check, Envelope, SpinnerGap } from "@phosphor-icons/react"

import { Link } from "@/i18n/routing"
import { requestPasswordReset, type AuthActionState } from "../_actions/auth"

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
          {locale === "bg" ? "Изпращане..." : "Sending..."}
        </>
      ) : locale === "bg" ? (
        "Изпрати линк"
      ) : (
        "Send reset link"
      )}
    </button>
  )
}

export function ForgotPasswordForm({ locale }: { locale: string }) {
  const initialState: AuthActionState = { fieldErrors: {}, error: undefined, success: false }
  const [state, formAction] = useActionState(requestPasswordReset.bind(null, locale), initialState)

  if (state?.success) {
    return (
      <div className="w-full max-w-sm mx-auto text-center">
        <div className="flex flex-col items-center gap-4 mb-6">
          <div className="size-16 bg-green-100 rounded-full flex items-center justify-center">
            <Check className="size-8 text-green-600" weight="bold" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">{locale === "bg" ? "Проверете имейла си" : "Check your email"}</h1>
          <p className="text-sm text-gray-600">
            {locale === "bg" ? "Изпратихме ви линк за възстановяване на паролата." : "We sent you a password reset link."}
          </p>
        </div>
        <Link href="/auth/login" className="inline-flex items-center gap-2 text-sm text-blue-600 hover:underline">
          <ArrowLeft className="size-4" />
          {locale === "bg" ? "Обратно към вход" : "Back to login"}
        </Link>
      </div>
    )
  }

  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="text-center mb-8">
        <div className="size-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Envelope className="size-6 text-blue-600" weight="bold" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">{locale === "bg" ? "Забравена парола" : "Forgot password"}</h1>
        <p className="text-sm text-gray-600 mt-2">
          {locale === "bg"
            ? "Въведете имейла си и ще ви изпратим линк за възстановяване."
            : "Enter your email and we'll send you a reset link."}
        </p>
      </div>

      <form action={formAction} className="space-y-4">
        {state?.error && (
          <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">{state.error}</div>
        )}

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            {locale === "bg" ? "Имейл адрес" : "Email address"}
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            aria-invalid={!!state?.fieldErrors?.email}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          {state?.fieldErrors?.email && <p className="text-xs text-red-500 mt-1">{state.fieldErrors.email}</p>}
        </div>

        <SubmitButton locale={locale} />
      </form>

      <div className="mt-6 text-center">
        <Link href="/auth/login" className="inline-flex items-center gap-2 text-sm text-blue-600 hover:underline">
          <ArrowLeft className="size-4" />
          {locale === "bg" ? "Обратно към вход" : "Back to login"}
        </Link>
      </div>
    </div>
  )
}
