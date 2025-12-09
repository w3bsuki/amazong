"use client"

import { createClient } from "@/lib/supabase/client"
import { Link } from "@/i18n/routing"
import { useTranslations, useLocale } from "next-intl"
import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { loginSchema, type LoginFormData } from "@/lib/validations/auth"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Eye, EyeSlash, SpinnerGap, Check } from "@phosphor-icons/react"

function LoadingOverlay({ isVisible, message }: { isVisible: boolean; message: string }) {
  if (!isVisible) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        <SpinnerGap className="size-10 text-blue-500 animate-spin" weight="bold" />
        <p className="text-sm text-gray-500">{message}</p>
      </div>
    </div>
  )
}

function SuccessOverlay({ isVisible }: { isVisible: boolean }) {
  if (!isVisible) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-3 animate-in fade-in zoom-in duration-200">
        <div className="size-14 bg-green-100 rounded-full flex items-center justify-center">
          <Check className="size-7 text-green-600" weight="bold" />
        </div>
        <p className="text-sm text-gray-500">Redirecting...</p>
      </div>
    </div>
  )
}

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isPending, startTransition] = useTransition()
  const t = useTranslations('Auth')
  const locale = useLocale()

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
    mode: "onChange",
  })

  const { isValid, errors } = form.formState

  const onSubmit = async (data: LoginFormData) => {
    const supabase = createClient()
    setServerError(null)

    startTransition(async () => {
      try {
        const { error } = await supabase.auth.signInWithPassword({
          email: data.email,
          password: data.password,
        })
        
        if (error) {
          if (error.message.includes("Invalid login credentials")) {
            setServerError(t('invalidCredentials'))
          } else if (error.message.includes("Email not confirmed")) {
            setServerError(t('emailNotConfirmed'))
          } else {
            setServerError(error.message)
          }
          return
        }
        
        setIsSuccess(true)
        setTimeout(() => window.location.replace(`/${locale}/`), 600)
      } catch {
        setServerError(t('error'))
      }
    })
  }

  return (
    <>
      <LoadingOverlay isVisible={isPending && !isSuccess} message={t('signingIn')} />
      <SuccessOverlay isVisible={isSuccess} />
      
      <div className="min-h-svh flex items-center justify-center bg-gray-50 p-4">
        <div className="w-full max-w-sm bg-white rounded-xl border border-gray-200 relative">
          <div className="p-6">
            {/* Logo & Header */}
            <div className="flex flex-col items-center mb-6">
              <Link href="/" className="mb-4 hover:opacity-80 transition-opacity">
                <svg width="40" height="40" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="48" height="48" rx="8" fill="#3B82F6"/>
                  <path d="M14 24C14 18.477 18.477 14 24 14C29.523 14 34 18.477 34 24C34 29.523 29.523 34 24 34" stroke="white" strokeWidth="3" strokeLinecap="round"/>
                  <path d="M24 34C24 31.239 21.761 29 19 29C16.239 29 14 31.239 14 34" stroke="white" strokeWidth="3" strokeLinecap="round"/>
                </svg>
              </Link>
              <h1 className="text-xl font-semibold text-gray-900">
                {t('signIn')}
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                {t('signInDescription')}
              </p>
            </div>

            {/* Form */}
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">
                        {t('emailOrPhone')}
                      </label>
                      <FormControl>
                        <input
                          {...field}
                          type="email"
                          autoComplete="email"
                          autoFocus
                          placeholder={t('emailPlaceholder')}
                          className={`
                            w-full h-10 px-3 text-sm text-gray-900 placeholder:text-gray-400
                            bg-white border rounded-lg
                            focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500
                            transition-colors
                            ${errors.email ? 'border-red-400 focus:ring-red-500/40 focus:border-red-500' : 'border-gray-300'}
                          `}
                        />
                      </FormControl>
                      <FormMessage className="text-xs text-red-500" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <div className="flex justify-between items-center">
                        <label className="text-sm font-medium text-gray-700">
                          {t('password')}
                        </label>
                        <Link href="/auth/forgot-password" className="text-xs text-blue-600 hover:underline">
                          {t('forgotPassword')}
                        </Link>
                      </div>
                      <FormControl>
                        <div className="relative">
                          <input
                            {...field}
                            type={showPassword ? "text" : "password"}
                            autoComplete="current-password"
                            placeholder="••••••••"
                            className={`
                              w-full h-10 px-3 pr-10 text-sm text-gray-900 placeholder:text-gray-400
                              bg-white border rounded-lg
                              focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500
                              transition-colors
                              ${errors.password ? 'border-red-400 focus:ring-red-500/40 focus:border-red-500' : 'border-gray-300'}
                            `}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                          >
                            {showPassword ? <EyeSlash className="size-4" /> : <Eye className="size-4" />}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage className="text-xs text-red-500" />
                    </FormItem>
                  )}
                />

                {/* Server Error */}
                {serverError && (
                  <div className="p-2.5 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                    {serverError}
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isPending || !isValid}
                  className="
                    w-full h-10 
                    bg-blue-600 hover:bg-blue-700
                    disabled:bg-gray-300 disabled:cursor-not-allowed
                    text-white text-sm font-medium rounded-lg 
                    transition-colors
                    flex items-center justify-center gap-2
                  "
                >
                  {isPending ? (
                    <>
                      <SpinnerGap className="size-4 animate-spin" weight="bold" />
                      {t('signingIn')}
                    </>
                  ) : (
                    t('signIn')
                  )}
                </button>

                {/* Terms */}
                <p className="text-xs text-center text-gray-500 leading-relaxed">
                  {t('byContinuing')}{" "}
                  <Link href="/terms" className="text-blue-600 hover:underline">{t('conditionsOfUse')}</Link>
                  {" "}{t('and')}{" "}
                  <Link href="/privacy" className="text-blue-600 hover:underline">{t('privacyNotice')}</Link>.
                </p>
              </form>
            </Form>

            {/* Divider */}
            <div className="flex items-center my-5">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="px-3 text-xs text-gray-400">{t('newToAmazon')}</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            {/* Create Account Button */}
            <Link href="/auth/sign-up" className="block">
              <button className="
                w-full h-10 
                bg-white border border-gray-300 
                text-gray-700 text-sm font-medium rounded-lg 
                hover:bg-gray-50
                transition-colors 
                flex items-center justify-center
              ">
                {t('createAccount')}
              </button>
            </Link>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <div className="flex justify-center gap-4 text-xs text-gray-500">
              <Link href="/terms" className="hover:text-blue-600 transition-colors">{t('conditionsOfUse')}</Link>
              <Link href="/privacy" className="hover:text-blue-600 transition-colors">{t('privacyNotice')}</Link>
              <Link href="/help" className="hover:text-blue-600 transition-colors">{t('help')}</Link>
            </div>
            <p className="text-xs text-center text-gray-400 mt-2">
              {t('copyright', { year: new Date().getFullYear() })}
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
