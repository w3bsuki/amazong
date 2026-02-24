"use client"

import { createClient } from "@/lib/supabase/client"
import { Link } from "@/i18n/routing"
import { useTranslations } from "next-intl"
import { type FormEvent, useEffect, useMemo, useRef, useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Field, FieldContent, FieldError, FieldLabel } from "@/components/shared/field"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Check, Eye, EyeOff as EyeSlash, Lock, LoaderCircle as SpinnerGap } from "lucide-react";

import { useRouter } from "@/i18n/routing"
import { AuthCard } from "../../_components/auth-card"

type ResetPasswordFormData = {
  password: string
  confirmPassword: string
}

type ResetPasswordErrorKey =
  | "passwordSameAsOld"
  | "rateLimitError"
  | "somethingWentWrong"

function mapResetPasswordErrorKey(message: string): ResetPasswordErrorKey {
  const normalizedMessage = message.toLowerCase()

  if (normalizedMessage.includes("same as")) return "passwordSameAsOld"
  if (normalizedMessage.includes("rate limit") || normalizedMessage.includes("too many requests")) {
    return "rateLimitError"
  }

  return "somethingWentWrong"
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
  const redirectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

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

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
    mode: "onChange",
  })

  useEffect(() => {
    return () => {
      if (redirectTimeoutRef.current) {
        clearTimeout(redirectTimeoutRef.current)
      }
    }
  }, [])

  // Check if user has a valid recovery session
  useEffect(() => {
    let isActive = true

    const supabase = createClient()
    const timeoutId = setTimeout(() => {
      // If session check is slow or fails silently, don't trap users on a spinner.
      if (isActive) setIsValidSession(false)
    }, 5000)

    supabase.auth
      .getUser()
      .then(({ data, error }) => {
        if (!isActive) return
        clearTimeout(timeoutId)
        setIsValidSession(!error && Boolean(data.user))
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
          const errorKey = mapResetPasswordErrorKey(error.message)
          setServerError(t(errorKey))
          return
        }

        setIsSuccess(true)

        // Redirect to login after 3 seconds
        if (redirectTimeoutRef.current) {
          clearTimeout(redirectTimeoutRef.current)
        }
        redirectTimeoutRef.current = setTimeout(() => {
          router.push("/auth/login")
        }, 3000)
      } catch {
        setServerError(t("somethingWentWrong"))
      }
    })
  }

  const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    void handleSubmit(onSubmit)(event)
  }

  // Loading state while checking session
  if (isValidSession === null) {
    return (
      <div className="min-h-dvh flex items-center justify-center p-4">
        <div className="w-full max-w-sm text-center">
          <SpinnerGap className="size-8 animate-spin motion-reduce:animate-none mx-auto text-primary" />
          <p className="text-sm text-muted-foreground mt-4">{t("loading")}</p>
        </div>
      </div>
    )
  }

  // Invalid session - link expired or not valid
  if (!isValidSession) {
    return (
      <AuthCard
        title={t("linkExpired")}
        description={t("linkExpiredDescription")}
        showLogo={true}
      >
        <div className="flex flex-col items-center gap-4 py-2">
          <div className="inline-flex size-16 items-center justify-center rounded-full bg-destructive-subtle text-destructive">
            <Lock className="size-8" />
          </div>
          <Button asChild variant="outline" size="default" className="w-full">
            <Link href="/auth/forgot-password">{t("requestNewLink")}</Link>
          </Button>
        </div>
      </AuthCard>
    )
  }

  // Success state
  if (isSuccess) {
    return (
      <AuthCard
        title={t("passwordUpdated")}
        description={t("passwordUpdatedDescription")}
        showLogo={true}
      >
        <div className="flex flex-col items-center gap-4 py-2">
          <div className="inline-flex size-16 items-center justify-center rounded-full bg-success-subtle text-success">
            <Check className="size-8" />
          </div>
          <Button asChild variant="outline" size="default" className="w-full">
            <Link href="/auth/login" className="inline-flex items-center justify-center gap-2">
              <ArrowLeft className="size-4" />
              {t("goToLogin")}
            </Link>
          </Button>
        </div>
      </AuthCard>
    )
  }

  const footer = (
    <Link
      href="/auth/login"
      className="inline-flex min-h-11 items-center gap-2 text-sm text-primary hover:underline"
    >
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
      <form onSubmit={handleFormSubmit} className="space-y-4">
        {serverError && (
          <div className="p-3 text-sm text-destructive bg-destructive-subtle border border-destructive rounded-xl">
            {serverError}
          </div>
        )}

        <Field data-invalid={!!errors.password}>
          <FieldContent>
            <FieldLabel htmlFor="password">{t("newPassword")}</FieldLabel>
            <div className="relative">
              <Input
                {...register("password")}
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="••••••••"
                className="pr-10"
                aria-invalid={!!errors.password}
                aria-describedby={
                  errors.password ? "password-error" : undefined
                }
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-0 top-1/2 -translate-y-1/2 inline-flex size-11 items-center justify-center rounded-xl text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
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
              errors={[errors.password]}
              className="text-xs"
            />
          </FieldContent>
        </Field>

        <Field data-invalid={!!errors.confirmPassword}>
          <FieldContent>
            <FieldLabel htmlFor="confirmPassword">{t("confirmPassword")}</FieldLabel>
            <div className="relative">
              <Input
                {...register("confirmPassword")}
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="••••••••"
                className="pr-10"
                aria-invalid={!!errors.confirmPassword}
                aria-describedby={
                  errors.confirmPassword
                    ? "confirmPassword-error"
                    : undefined
                }
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-0 top-1/2 -translate-y-1/2 inline-flex size-11 items-center justify-center rounded-xl text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
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
              errors={[errors.confirmPassword]}
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
            className="w-full"
            disabled={isPending || !isValid}
          >
            {isPending ? (
              <>
                <SpinnerGap className="size-5 animate-spin motion-reduce:animate-none" />
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
