"use client"

import { Link } from "@/i18n/routing"
import { CheckCircle, EnvelopeSimple } from "@phosphor-icons/react"
import { useTranslations } from "next-intl"
import { useCallback, useState } from "react"
import { createClient } from "@/lib/supabase/client"

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
    <div className="min-h-dvh flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-card rounded-md border border-border relative">
        <div className="p-6">
          <div className="flex flex-col items-center mb-6">
            <div className="size-14 bg-success/15 rounded-full flex items-center justify-center mb-3">
              <CheckCircle className="size-8 text-success" weight="fill" />
            </div>

            <h1 className="text-xl font-semibold text-foreground">
              {t("signUpSuccessTitle")}
            </h1>
            <p className="text-sm text-muted-foreground mt-1 text-center">
              {t("signUpSuccessDescription")}
            </p>
          </div>

          <div className="flex items-start gap-3 p-4 bg-primary/10 border border-primary/20 rounded-md text-left mb-6">
            <EnvelopeSimple
              className="size-5 text-primary shrink-0 mt-0.5"
              weight="duotone"
            />
            <div>
              <p className="text-sm font-medium text-foreground mb-0.5">
                {t("checkYourEmail")}
              </p>
              <p className="text-xs text-muted-foreground">
                {t("confirmEmailInstructions")}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <Link
              href="/auth/login"
              className="w-full h-10 bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium rounded-md transition-colors flex items-center justify-center"
            >
              {t("goToSignIn")}
            </Link>
            <Link
              href="/"
              className="w-full h-10 bg-background border border-border text-foreground text-sm font-medium rounded-md hover:bg-muted transition-colors flex items-center justify-center"
            >
              {t("backToHome")}
            </Link>
          </div>

          <p className="text-xs text-center text-muted-foreground mt-4">
            {t("didNotReceiveEmail")} {" "}
            <button
              type="button"
              className="text-primary hover:underline disabled:opacity-60"
              onClick={handleResend}
              disabled={isResending}
            >
              {t("resendEmail")}
            </button>
          </p>
        </div>

        <div className="px-6 py-4 bg-muted border-t border-border rounded-b-md">
          <div className="flex justify-center gap-4 text-xs text-muted-foreground">
            <Link href="/terms" className="hover:text-primary transition-colors">
              {t("conditionsOfUse")}
            </Link>
            <Link href="/privacy" className="hover:text-primary transition-colors">
              {t("privacyNotice")}
            </Link>
            <Link href="/help" className="hover:text-primary transition-colors">
              {t("help")}
            </Link>
          </div>
          <p className="text-xs text-center text-muted-foreground/70 mt-2">
            {t("copyright", { year: new Date().getFullYear() })}
          </p>
        </div>
      </div>
    </div>
  )
}
