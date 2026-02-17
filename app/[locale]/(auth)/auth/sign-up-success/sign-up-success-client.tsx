"use client"

import { Link } from "@/i18n/routing"
import { CircleCheck as CheckCircle, Mail as EnvelopeSimple } from "lucide-react";

import { useTranslations } from "next-intl"
import { useCallback, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { AuthCard } from "../../_components/auth-card"

export default function SignUpSuccessClient() {
  const t = useTranslations("Auth")
  const [isResending, setIsResending] = useState(false)

  const handleResend = useCallback(async () => {
    if (isResending) return

    let email: string | null = null
    let locale: string | null = null

    try {
      email = sessionStorage.getItem("lastSignupEmail")
      locale = sessionStorage.getItem("lastSignupLocale")
    } catch {
      email = null
      locale = null
    }

    // If we don't have an email (e.g. direct navigation), fall back to sign-in.
    if (!email) return

    setIsResending(true)
    try {
      const supabase = createClient()
      const origin = window.location.origin
      const resolvedLocale = locale || "en"

      // Resend a signup confirmation email.
      // Note: Supabase may not send emails for existing/confirmed accounts.
      await supabase.auth.resend({
        type: "signup",
        email,
        options: {
          emailRedirectTo: `${origin}/auth/confirm?locale=${encodeURIComponent(resolvedLocale)}&next=${encodeURIComponent("/")}`,
        },
      })
    } catch (e) {
      console.error("Failed to resend confirmation email:", e)
    } finally {
      setIsResending(false)
    }
  }, [isResending])

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
      </div>
    </AuthCard>
  )
}
