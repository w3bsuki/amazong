"use client"

import { Link } from "@/i18n/routing"
import { CircleCheck as CheckCircle, Mail as EnvelopeSimple } from "lucide-react";

import { useLocale, useTranslations } from "next-intl"
import { useCallback, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { AuthCard } from "../../_components/auth-card"

export default function SignUpSuccessClient() {
  const t = useTranslations("Auth")
  const locale = useLocale()
  const [isResending, setIsResending] = useState(false)
  const [resendFeedback, setResendFeedback] = useState<"success" | "error" | null>(null)

  const handleResend = useCallback(async () => {
    if (isResending) return

    setResendFeedback(null)

    let email: string | null = null
    let storedLocale: string | null = null

    try {
      email = sessionStorage.getItem("lastSignupEmail")
      storedLocale = sessionStorage.getItem("lastSignupLocale")
    } catch {
      email = null
      storedLocale = null
    }

    // If we don't have an email (e.g. direct navigation), fall back to sign-in.
    if (!email) {
      setResendFeedback("error")
      return
    }

    setIsResending(true)
    try {
      const supabase = createClient()
      const origin = window.location.origin
      const resolvedLocale = storedLocale || locale

      // Resend a signup confirmation email.
      // Note: Supabase may not send emails for existing/confirmed accounts.
      const { error } = await supabase.auth.resend({
        type: "signup",
        email,
        options: {
          emailRedirectTo: `${origin}/auth/confirm?locale=${encodeURIComponent(resolvedLocale)}&next=${encodeURIComponent("/")}`,
        },
      })

      setResendFeedback(error ? "error" : "success")
    } catch (e) {
      void e
      setResendFeedback("error")
    } finally {
      setIsResending(false)
    }
  }, [isResending, locale])

  return (
    <AuthCard
      title={t("signUpSuccessTitle")}
      description={t("signUpSuccessDescription")}
      showLogo={false}
    >
      <div className="space-y-5">
        <div className="flex items-center justify-center">
          <div className="inline-flex size-14 items-center justify-center rounded-full bg-success-subtle text-success">
            <CheckCircle className="size-8" />
          </div>
        </div>

        <div className="flex items-start gap-3 rounded-xl border border-selected-border bg-selected p-4 text-left">
          <EnvelopeSimple className="mt-0.5 size-5 shrink-0 text-primary" />
          <div>
            <p className="text-sm font-medium text-foreground">{t("checkYourEmail")}</p>
            <p className="text-xs text-muted-foreground">{t("confirmEmailInstructions")}</p>
          </div>
        </div>

        <div className="space-y-2">
          <Button asChild size="default" className="w-full">
            <Link href="/auth/login">{t("goToSignIn")}</Link>
          </Button>
          <Button asChild variant="outline" size="default" className="w-full">
            <Link href="/">{t("backToHome")}</Link>
          </Button>
        </div>

        <p className="text-xs text-center text-muted-foreground">
          {t("didNotReceiveEmail")}{" "}
          <button
            type="button"
            className="inline-flex min-h-11 items-center text-primary hover:underline disabled:opacity-60"
            onClick={handleResend}
            disabled={isResending}
          >
            {t("resendEmail")}
          </button>
        </p>

        {resendFeedback === "success" ? (
          <p className="text-xs text-center text-success">{t("checkYourEmail")}</p>
        ) : null}

        {resendFeedback === "error" ? (
          <p className="text-xs text-center text-destructive">{t("somethingWentWrong")}</p>
        ) : null}
      </div>
    </AuthCard>
  )
}
