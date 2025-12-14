"use client"

import { createClient } from "@/lib/supabase/client"
import { Link } from "@/i18n/routing"
import { useLocale } from "next-intl"
import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { SpinnerGap, Check, Envelope, ArrowLeft } from "@phosphor-icons/react"

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
})

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>

export default function ForgotPasswordPage() {
  const [serverError, setServerError] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isPending, startTransition] = useTransition()
  const locale = useLocale()

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
    mode: "onChange",
  })

  const { isValid } = form.formState

  const onSubmit = async (data: ForgotPasswordFormData) => {
    const supabase = createClient()
    setServerError(null)

    startTransition(async () => {
      try {
        const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
          redirectTo: `${window.location.origin}/${locale}/auth/reset-password`,
        })

        if (error) {
          setServerError(error.message)
          return
        }

        setIsSuccess(true)
      } catch {
        setServerError("Something went wrong. Please try again.")
      }
    })
  }

  if (isSuccess) {
    return (
      <div className="w-full max-w-sm mx-auto text-center">
        <div className="flex flex-col items-center gap-4 mb-6">
          <div className="size-16 bg-green-100 rounded-full flex items-center justify-center">
            <Check className="size-8 text-green-600" weight="bold" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            {locale === 'bg' ? 'Проверете имейла си' : 'Check your email'}
          </h1>
          <p className="text-sm text-gray-600">
            {locale === 'bg' 
              ? 'Изпратихме ви линк за възстановяване на паролата.' 
              : 'We sent you a password reset link.'}
          </p>
        </div>
        <Link
          href="/auth/login"
          className="inline-flex items-center gap-2 text-sm text-blue-600 hover:underline"
        >
          <ArrowLeft className="size-4" />
          {locale === 'bg' ? 'Обратно към вход' : 'Back to login'}
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
        <h1 className="text-2xl font-bold text-gray-900">
          {locale === 'bg' ? 'Забравена парола' : 'Forgot password'}
        </h1>
        <p className="text-sm text-gray-600 mt-2">
          {locale === 'bg' 
            ? 'Въведете имейла си и ще ви изпратим линк за възстановяване.' 
            : "Enter your email and we'll send you a reset link."}
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {serverError && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
              {serverError}
            </div>
          )}

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  {locale === 'bg' ? 'Имейл адрес' : 'Email address'}
                </label>
                <FormControl>
                  <input
                    {...field}
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </FormControl>
                <FormMessage className="text-xs text-red-500 mt-1" />
              </FormItem>
            )}
          />

          <button
            type="submit"
            disabled={isPending || !isValid}
            className="w-full py-2.5 px-4 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {isPending ? (
              <>
                <SpinnerGap className="size-5 animate-spin" weight="bold" />
                {locale === 'bg' ? 'Изпращане...' : 'Sending...'}
              </>
            ) : (
              locale === 'bg' ? 'Изпрати линк' : 'Send reset link'
            )}
          </button>
        </form>
      </Form>

      <div className="mt-6 text-center">
        <Link
          href="/auth/login"
          className="inline-flex items-center gap-2 text-sm text-blue-600 hover:underline"
        >
          <ArrowLeft className="size-4" />
          {locale === 'bg' ? 'Обратно към вход' : 'Back to login'}
        </Link>
      </div>
    </div>
  )
}
