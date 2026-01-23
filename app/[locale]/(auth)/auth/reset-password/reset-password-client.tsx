"use client"

import { createClient } from "@/lib/supabase/client"
import { Link } from "@/i18n/routing"
import { useTranslations } from "next-intl"
import { useMemo, useState, useTransition, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { AuthCard } from "@/components/auth/auth-card"
import { Field, FieldContent, FieldError, FieldLabel } from "@/components/shared/field"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { SpinnerGap, Check, Lock, ArrowLeft, Eye, EyeSlash } from "@phosphor-icons/react"
import { useRouter } from "@/i18n/routing"

type ResetPasswordFormData = {
  password: string
  confirmPassword: string
}

export default function ResetPasswordPage() {
  const t = useTranslations("Auth")
  const [serverError, setServerError] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [isValidSession, setIsValidSession] = useState<boolean | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const router = useRouter()

  const resetPasswordSchema = useMemo(
    () =>
      z
        .object({
          password: z
            .string()
            .min(8, t("reqMinChars"))
            .regex(/[A-Z]/, t("reqUppercase"))
            .regex(/[a-z]/, t("reqLowercase"))
            .regex(/[0-9]/, t("reqNumber")),
          confirmPassword: z.string(),
        })
        .refine((data) => data.password === data.confirmPassword, {
          message: t("passwordsDoNotMatch"),
          path: ["confirmPassword"],
        }),
    [t],
  )

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
    mode: "onChange",
  })

  const { isValid } = form.formState

  // Check if user has a valid recovery session
  useEffect(() => {
    let isActive = true

    const supabase = createClient()
    const timeoutId = setTimeout(() => {
      // If session check is slow or fails silently, don't trap users on a spinner.
      if (isActive) setIsValidSession(false)
    }, 5000)

    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (!isActive) return
        clearTimeout(timeoutId)
        setIsValidSession(!!data.session)
      })
      .catch(() => {
        if (!isActive) return
        clearTimeout(timeoutId)
        setIsValidSession(false)
      })

    return () => {
      isActive = false
      clearTimeout(timeoutId)
    }
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
            setServerError(t("passwordSameAsOld"))
          } else {
            setServerError(error.message)
          }
          return
        }

        setIsSuccess(true)

        // Redirect to login after 3 seconds
        setTimeout(() => {
          router.push("/auth/login")
        }, 3000)
      } catch {
        setServerError(t("somethingWentWrong"))
      }
    })
  }

  // Loading state while checking session
  if (isValidSession === null) {
    return (
      <div className="min-h-svh flex items-center justify-center bg-muted/30 p-4">
        <div className="w-full max-w-sm text-center">
          <SpinnerGap className="size-8 animate-spin mx-auto text-primary" />
          <p className="text-sm text-muted-foreground mt-4">{t("loading")}</p>
        </div>
      </div>
    )
  }

  // Invalid session - link expired or not valid
  if (!isValidSession) {
    return (
      <div className="min-h-svh flex items-center justify-center bg-muted/30 p-4">
        <div className="w-full max-w-sm text-center">
          <div className="flex flex-col items-center gap-4 mb-6">
            <div className="size-16 bg-destructive/15 rounded-full flex items-center justify-center">
              <Lock className="size-8 text-destructive" weight="bold" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">{t("linkExpired")}</h1>
            <p className="text-sm text-muted-foreground">
              {t("linkExpiredDescription")}
            </p>
          </div>
          <Link href="/auth/forgot-password" className="inline-flex items-center gap-2 text-sm text-primary hover:underline">
            {t("requestNewLink")}
          </Link>
        </div>
      </div>
    )
  }

  // Success state
  if (isSuccess) {
    return (
      <div className="min-h-svh flex items-center justify-center bg-muted/30 p-4">
        <div className="w-full max-w-sm text-center">
          <div className="flex flex-col items-center gap-4 mb-6">
            <div className="size-16 bg-success/15 rounded-full flex items-center justify-center">
              <Check className="size-8 text-success" weight="bold" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">{t("passwordUpdated")}</h1>
            <p className="text-sm text-muted-foreground">
              {t("passwordUpdatedDescription")}
            </p>
          </div>
          <Link href="/auth/login" className="inline-flex items-center gap-2 text-sm text-primary hover:underline">
            <ArrowLeft className="size-4" />
            {t("goToLogin")}
          </Link>
        </div>
      </div>
    )
  }

  const footer = (
    <Link href="/auth/login" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
      <ArrowLeft className="size-4" />
      {t("backToLogin")}
    </Link>
  )

  // Reset password form
  return (
    <AuthCard
      title={t("setNewPassword")}
      description={t("setNewPasswordDescription")}
      footer={footer}
      showLogo={true}
    >
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {serverError && (
          <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
            {serverError}
          </div>
        )}

        <Field data-invalid={!!form.formState.errors.password}>
          <FieldContent>
            <FieldLabel htmlFor="password">{t("newPassword")}</FieldLabel>
            <div className="relative">
              <Input
                {...form.register("password")}
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="••••••••"
                className="pr-10"
                aria-invalid={!!form.formState.errors.password}
                aria-describedby={
                  form.formState.errors.password ? "password-error" : undefined
                }
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label={showPassword ? t("hidePassword") : t("showPassword")}
              >
                {showPassword ? (
                  <EyeSlash className="size-5" />
                ) : (
                  <Eye className="size-5" />
                )}
              </button>
            </div>
            <FieldError
              id="password-error"
              errors={[form.formState.errors.password]}
              className="text-xs"
            />
          </FieldContent>
        </Field>

        <Field data-invalid={!!form.formState.errors.confirmPassword}>
          <FieldContent>
            <FieldLabel htmlFor="confirmPassword">{t("confirmPassword")}</FieldLabel>
            <div className="relative">
              <Input
                {...form.register("confirmPassword")}
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="••••••••"
                className="pr-10"
                aria-invalid={!!form.formState.errors.confirmPassword}
                aria-describedby={
                  form.formState.errors.confirmPassword
                    ? "confirmPassword-error"
                    : undefined
                }
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label={showConfirmPassword ? t("hidePassword") : t("showPassword")}
              >
                {showConfirmPassword ? (
                  <EyeSlash className="size-5" />
                ) : (
                  <Eye className="size-5" />
                )}
              </button>
            </div>
            <FieldError
              id="confirmPassword-error"
              errors={[form.formState.errors.confirmPassword]}
              className="text-xs"
            />
          </FieldContent>
        </Field>

          {/* Password requirements hint */}
          <div className="text-xs text-muted-foreground space-y-1">
            <p>{t("passwordMustContain")}</p>
            <ul className="list-disc list-inside space-y-0.5 ml-2">
              <li>{t("atLeast8Chars")}</li>
              <li>{t("oneUppercase")}</li>
              <li>{t("oneLowercase")}</li>
              <li>{t("oneNumber")}</li>
            </ul>
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full h-10"
            disabled={isPending || !isValid}
          >
            {isPending ? (
              <>
                <SpinnerGap className="size-5 animate-spin" weight="bold" />
                {t("updating")}
              </>
            ) : (
              t("updatePassword")
            )}
          </Button>
      </form>
    </AuthCard>
  )
}
