"use client"

import { createClient } from "@/lib/supabase/client"
import { Link } from "@/i18n/routing"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import { useState, useTransition, useMemo } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { signUpSchema, type SignUpFormData, getPasswordStrength } from "@/lib/validations/auth"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Eye, EyeSlash, SpinnerGap, Check, X, CheckCircle } from "@phosphor-icons/react"

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

function PasswordStrength({ password, t }: { password: string; t: (key: string) => string }) {
  const strength = useMemo(() => getPasswordStrength(password), [password])
  if (!password) return null
  
  const colorMap = {
    'Weak': 'bg-red-500',
    'Fair': 'bg-amber-500',
    'Good': 'bg-emerald-500',
    'Strong': 'bg-emerald-600',
  }
  
  const textColorMap = {
    'Weak': 'text-red-600',
    'Fair': 'text-amber-600',
    'Good': 'text-emerald-600',
    'Strong': 'text-emerald-700',
  }
  
  return (
    <div className="mt-1.5 space-y-1">
      <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
        <div className={`h-full transition-all duration-300 rounded-full ${colorMap[strength.label as keyof typeof colorMap]} ${strength.width}`} />
      </div>
      <p className={`text-xs ${textColorMap[strength.label as keyof typeof textColorMap]}`}>
        {t('passwordStrength')}: {t(`strength${strength.label}`)}
      </p>
    </div>
  )
}

function PasswordRequirements({ password, t }: { password: string; t: (key: string) => string }) {
  const requirements = useMemo(() => [
    { label: t('reqMinChars'), met: password.length >= 6 },
    { label: t('reqUppercase'), met: /[A-Z]/.test(password) },
    { label: t('reqLowercase'), met: /[a-z]/.test(password) },
    { label: t('reqNumber'), met: /[0-9]/.test(password) },
  ], [password, t])

  if (!password) return null

  return (
    <div className="mt-2 grid grid-cols-2 gap-x-2 gap-y-1">
      {requirements.map((req, i) => (
        <div key={i} className={`flex items-center gap-1.5 text-xs transition-colors ${req.met ? "text-emerald-600" : "text-gray-400"}`}>
          {req.met ? <Check className="size-3" weight="bold" /> : <X className="size-3" />}
          <span>{req.label}</span>
        </div>
      ))}
    </div>
  )
}

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [isCheckingUsername, setIsCheckingUsername] = useState(false)
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null)
  const router = useRouter()
  const t = useTranslations('Auth')

  const form = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { name: "", username: "", email: "", password: "", confirmPassword: "" },
    mode: "onChange",
  })

  const { isValid, errors } = form.formState
  const watchedPassword = form.watch("password")
  const watchedConfirmPassword = form.watch("confirmPassword")

  // Check username availability with debounce
  const checkUsername = async (username: string) => {
    if (!username || username.length < 3) {
      setUsernameAvailable(null)
      return
    }
    
    setIsCheckingUsername(true)
    try {
      const supabase = createClient()
      const { data } = await supabase
        .from("profiles")
        .select("id")
        .ilike("username", username)
        .maybeSingle()
      
      setUsernameAvailable(!data)
    } catch {
      setUsernameAvailable(null)
    } finally {
      setIsCheckingUsername(false)
    }
  }

  // Debounced username check
  const debouncedCheckUsername = useMemo(() => {
    let timeoutId: NodeJS.Timeout
    return (username: string) => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => checkUsername(username), 500)
    }
  }, [])

  const onSubmit = async (data: SignUpFormData) => {
    const supabase = createClient()
    setServerError(null)

    // Final username check
    const { data: existingUser } = await supabase
      .from("profiles")
      .select("id")
      .ilike("username", data.username)
      .maybeSingle()
    
    if (existingUser) {
      setServerError(t('usernameAlreadyTaken') || "This username is already taken")
      return
    }

    startTransition(async () => {
      try {
        // Use the proper site URL for email redirects (production)
        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin
        
        const { error, data: authData } = await supabase.auth.signUp({
          email: data.email,
          password: data.password,
          options: {
            emailRedirectTo: `${siteUrl}/auth/confirm`,
            data: { 
              full_name: data.name,
              username: data.username.toLowerCase(),
            },
          },
        })

        if (error) {
          if (error.message.includes("already registered")) {
            setServerError(t('emailAlreadyRegistered'))
          } else if (error.message.includes("rate limit")) {
            setServerError(t('rateLimitError'))
          } else {
            setServerError(error.message)
          }
          return
        }

        // If user was created, update their profile with username
        // This handles the case where email confirmation is disabled
        if (authData?.user?.id) {
          await supabase
            .from("profiles")
            .update({ 
              username: data.username.toLowerCase(),
              display_name: data.name,
            })
            .eq("id", authData.user.id)
        }

        setIsSuccess(true)
        setTimeout(() => router.push("/auth/sign-up-success"), 600)
      } catch {
        setServerError(t('error'))
      }
    })
  }

  return (
    <>
      <LoadingOverlay isVisible={isPending && !isSuccess} message={t('creatingAccount')} />
      <SuccessOverlay isVisible={isSuccess} />
      
      <div className="min-h-svh flex items-center justify-center bg-gray-50 p-4 py-6">
        <div className="w-full max-w-sm bg-white rounded-xl border border-gray-200 relative">
          <div className="p-6">
            {/* Logo & Header */}
            <div className="flex flex-col items-center mb-5">
              <Link href="/" className="mb-3 hover:opacity-80 transition-opacity">
                <svg width="40" height="40" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="48" height="48" rx="8" fill="#3B82F6"/>
                  <path d="M14 24C14 18.477 18.477 14 24 14C29.523 14 34 18.477 34 24C34 29.523 29.523 34 24 34" stroke="white" strokeWidth="3" strokeLinecap="round"/>
                  <path d="M24 34C24 31.239 21.761 29 19 29C16.239 29 14 31.239 14 34" stroke="white" strokeWidth="3" strokeLinecap="round"/>
                </svg>
              </Link>
              <h1 className="text-xl font-semibold text-gray-900">
                {t('createAccountTitle')}
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                {t('signUpDescription')}
              </p>
            </div>

            {/* Form */}
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">
                        {t('yourName')}
                      </label>
                      <FormControl>
                        <div className="relative">
                          <input
                            {...field}
                            type="text"
                            autoComplete="name"
                            autoFocus
                            placeholder={t('namePlaceholder')}
                            className={`
                              w-full h-10 px-3 pr-9 text-sm text-gray-900 placeholder:text-gray-400
                              bg-white border rounded-lg
                              focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500
                              transition-colors
                              ${errors.name ? 'border-red-400 focus:ring-red-500/40 focus:border-red-500' : 'border-gray-300'}
                            `}
                          />
                          {!errors.name && field.value && field.value.length >= 2 && (
                            <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-emerald-500" weight="fill" />
                          )}
                        </div>
                      </FormControl>
                      <FormMessage className="text-xs text-red-500" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">
                        {t('username') || 'Username'}
                      </label>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">@</span>
                          <input
                            {...field}
                            type="text"
                            autoComplete="username"
                            placeholder={t('usernamePlaceholder') || 'your_username'}
                            onChange={(e) => {
                              const value = e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '')
                              field.onChange(value)
                              debouncedCheckUsername(value)
                            }}
                            className={`
                              w-full h-10 pl-7 pr-9 text-sm text-gray-900 placeholder:text-gray-400
                              bg-white border rounded-lg
                              focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500
                              transition-colors
                              ${errors.username ? 'border-red-400 focus:ring-red-500/40 focus:border-red-500' 
                                : usernameAvailable === false ? 'border-red-400' 
                                : usernameAvailable === true ? 'border-emerald-400' 
                                : 'border-gray-300'}
                            `}
                          />
                          {isCheckingUsername && (
                            <SpinnerGap className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-gray-400 animate-spin" />
                          )}
                          {!isCheckingUsername && !errors.username && usernameAvailable === true && (
                            <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-emerald-500" weight="fill" />
                          )}
                          {!isCheckingUsername && usernameAvailable === false && (
                            <X className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-red-500" />
                          )}
                        </div>
                      </FormControl>
                      <FormMessage className="text-xs text-red-500" />
                      {usernameAvailable === false && !errors.username && (
                        <p className="text-xs text-red-500">{t('usernameAlreadyTaken') || 'This username is already taken'}</p>
                      )}
                      {field.value && field.value.length >= 3 && usernameAvailable === true && !errors.username && (
                        <p className="text-xs text-emerald-600">amazong.com/u/{field.value}</p>
                      )}
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">
                        {t('email')}
                      </label>
                      <FormControl>
                        <div className="relative">
                          <input
                            {...field}
                            type="email"
                            autoComplete="email"
                            placeholder={t('emailPlaceholder')}
                            className={`
                              w-full h-10 px-3 pr-9 text-sm text-gray-900 placeholder:text-gray-400
                              bg-white border rounded-lg
                              focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500
                              transition-colors
                              ${errors.email ? 'border-red-400 focus:ring-red-500/40 focus:border-red-500' : 'border-gray-300'}
                            `}
                          />
                          {!errors.email && field.value && field.value.includes('@') && (
                            <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-emerald-500" weight="fill" />
                          )}
                        </div>
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
                      <label className="text-sm font-medium text-gray-700">
                        {t('password')}
                      </label>
                      <FormControl>
                        <div className="relative">
                          <input
                            {...field}
                            type={showPassword ? "text" : "password"}
                            autoComplete="new-password"
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
                      <PasswordStrength password={watchedPassword} t={t} />
                      <PasswordRequirements password={watchedPassword} t={t} />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">
                        {t('confirmPassword')}
                      </label>
                      <FormControl>
                        <div className="relative">
                          <input
                            {...field}
                            type={showConfirmPassword ? "text" : "password"}
                            autoComplete="new-password"
                            placeholder="••••••••"
                            className={`
                              w-full h-10 px-3 pr-10 text-sm text-gray-900 placeholder:text-gray-400
                              bg-white border rounded-lg
                              focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500
                              transition-colors
                              ${errors.confirmPassword 
                                ? 'border-red-400 focus:ring-red-500/40 focus:border-red-500' 
                                : watchedConfirmPassword && watchedConfirmPassword === watchedPassword && watchedPassword
                                  ? 'border-emerald-400 focus:ring-emerald-500/40 focus:border-emerald-500'
                                  : 'border-gray-300'
                              }
                            `}
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                          >
                            {showConfirmPassword ? <EyeSlash className="size-4" /> : <Eye className="size-4" />}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage className="text-xs text-red-500" />
                      {!errors.confirmPassword && watchedConfirmPassword && watchedConfirmPassword === watchedPassword && watchedPassword && (
                        <p className="text-xs text-emerald-600 flex items-center gap-1">
                          <CheckCircle className="size-3" weight="fill" />
                          {t('passwordsMatch')}
                        </p>
                      )}
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
                    w-full h-10 mt-1
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
                      {t('creatingAccount')}
                    </>
                  ) : (
                    t('createYourAccount')
                  )}
                </button>

                {/* Terms */}
                <p className="text-xs text-center text-gray-500 leading-relaxed">
                  {t('byCreatingAccount')}{" "}
                  <Link href="/terms" className="text-blue-600 hover:underline">{t('conditionsOfUse')}</Link>
                  {" "}{t('and')}{" "}
                  <Link href="/privacy" className="text-blue-600 hover:underline">{t('privacyNotice')}</Link>.
                </p>
              </form>
            </Form>

            {/* Divider */}
            <div className="flex items-center my-4">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="px-3 text-xs text-gray-400">{t('alreadyHaveAccount')}</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            {/* Sign In Button */}
            <Link href="/auth/login" className="block">
              <button className="
                w-full h-10 
                bg-white border border-gray-300 
                text-gray-700 text-sm font-medium rounded-lg 
                hover:bg-gray-50
                transition-colors 
                flex items-center justify-center
              ">
                {t('signInArrow')}
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
