"use client"

import { createClient } from "@/lib/supabase/client"
import { Link } from "@/i18n/routing"
import { useLocale } from "next-intl"
import { useState, useTransition, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { SpinnerGap, Check, Lock, ArrowLeft, Eye, EyeSlash } from "@phosphor-icons/react"
import { useRouter } from "next/navigation"

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>

export default function ResetPasswordPage() {
  const [serverError, setServerError] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [isValidSession, setIsValidSession] = useState<boolean | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const locale = useLocale()
  const router = useRouter()

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
    mode: "onChange",
  })

  const { isValid } = form.formState

  // Check if user has a valid recovery session
  useEffect(() => {
    const checkSession = async () => {
      const supabase = createClient()
      const {
        data: { session },
      } = await supabase.auth.getSession()

      // User should have a session from clicking the recovery link
      if (session) {
        setIsValidSession(true)
      } else {
        setIsValidSession(false)
      }
    }

    checkSession()
  }, [])

  const onSubmit = async (data: ResetPasswordFormData) => {
    const supabase = createClient()
    setServerError(null)

    startTransition(async () => {
      try {
        const { error } = await supabase.auth.updateUser({
          password: data.password,
        })

        if (error) {
          if (error.message.includes("same as")) {
            setServerError(
              locale === "bg"
                ? "Новата парола трябва да е различна от текущата."
                : "New password must be different from your current password.",
            )
          } else {
            setServerError(error.message)
          }
          return
        }

        setIsSuccess(true)

        // Redirect to login after 3 seconds
        setTimeout(() => {
          router.push(`/${locale}/auth/login`)
        }, 3000)
      } catch {
        setServerError(locale === "bg" ? "Нещо се обърка. Моля, опитайте отново." : "Something went wrong. Please try again.")
      }
    })
  }

  // Loading state while checking session
  if (isValidSession === null) {
    return (
      <div className="w-full max-w-sm mx-auto text-center">
        <SpinnerGap className="size-8 animate-spin mx-auto text-blue-600" />
        <p className="text-sm text-gray-600 mt-4">{locale === "bg" ? "Зареждане..." : "Loading..."}</p>
      </div>
    )
  }

  // Invalid session - link expired or not valid
  if (!isValidSession) {
    return (
      <div className="w-full max-w-sm mx-auto text-center">
        <div className="flex flex-col items-center gap-4 mb-6">
          <div className="size-16 bg-red-100 rounded-full flex items-center justify-center">
            <Lock className="size-8 text-red-600" weight="bold" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">{locale === "bg" ? "Линкът е изтекъл" : "Link expired"}</h1>
          <p className="text-sm text-gray-600">
            {locale === "bg" ? "Линкът за възстановяване на паролата е изтекъл или е невалиден." : "The password reset link has expired or is invalid."}
          </p>
        </div>
        <Link href="/auth/forgot-password" className="inline-flex items-center gap-2 text-sm text-blue-600 hover:underline">
          {locale === "bg" ? "Заявете нов линк" : "Request a new link"}
        </Link>
      </div>
    )
  }

  // Success state
  if (isSuccess) {
    return (
      <div className="w-full max-w-sm mx-auto text-center">
        <div className="flex flex-col items-center gap-4 mb-6">
          <div className="size-16 bg-green-100 rounded-full flex items-center justify-center">
            <Check className="size-8 text-green-600" weight="bold" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">{locale === "bg" ? "Паролата е променена!" : "Password updated!"}</h1>
          <p className="text-sm text-gray-600">
            {locale === "bg"
              ? "Вашата парола беше успешно променена. Пренасочване към вход..."
              : "Your password has been successfully updated. Redirecting to login..."}
          </p>
        </div>
        <Link href="/auth/login" className="inline-flex items-center gap-2 text-sm text-blue-600 hover:underline">
          <ArrowLeft className="size-4" />
          {locale === "bg" ? "Към вход" : "Go to login"}
        </Link>
      </div>
    )
  }

  // Reset password form
  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="text-center mb-8">
        <div className="size-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Lock className="size-6 text-blue-600" weight="bold" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">{locale === "bg" ? "Нова парола" : "Set new password"}</h1>
        <p className="text-sm text-gray-600 mt-2">{locale === "bg" ? "Въведете новата си парола по-долу." : "Enter your new password below."}</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {serverError && <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">{serverError}</div>}

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  {locale === "bg" ? "Нова парола" : "New password"}
                </label>
                <FormControl>
                  <div className="relative">
                    <input
                      {...field}
                      id="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      placeholder="••••••••"
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <EyeSlash className="size-5" /> : <Eye className="size-5" />}
                    </button>
                  </div>
                </FormControl>
                <FormMessage className="text-xs text-red-500 mt-1" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  {locale === "bg" ? "Потвърдете паролата" : "Confirm password"}
                </label>
                <FormControl>
                  <div className="relative">
                    <input
                      {...field}
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      autoComplete="new-password"
                      placeholder="••••••••"
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showConfirmPassword ? <EyeSlash className="size-5" /> : <Eye className="size-5" />}
                    </button>
                  </div>
                </FormControl>
                <FormMessage className="text-xs text-red-500 mt-1" />
              </FormItem>
            )}
          />

          {/* Password requirements hint */}
          <div className="text-xs text-gray-500 space-y-1">
            <p>{locale === "bg" ? "Паролата трябва да съдържа:" : "Password must contain:"}</p>
            <ul className="list-disc list-inside space-y-0.5 ml-2">
              <li>{locale === "bg" ? "Минимум 8 символа" : "At least 8 characters"}</li>
              <li>{locale === "bg" ? "Една главна буква" : "One uppercase letter"}</li>
              <li>{locale === "bg" ? "Една малка буква" : "One lowercase letter"}</li>
              <li>{locale === "bg" ? "Една цифра" : "One number"}</li>
            </ul>
          </div>

          <button
            type="submit"
            disabled={isPending || !isValid}
            className="w-full py-2.5 px-4 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {isPending ? (
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
        </form>
      </Form>

      <div className="mt-6 text-center">
        <Link href="/auth/login" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800">
          <ArrowLeft className="size-4" />
          {locale === "bg" ? "Обратно към вход" : "Back to login"}
        </Link>
      </div>
    </div>
  )
}
