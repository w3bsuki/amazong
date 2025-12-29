"use client"

import { Link } from "@/i18n/routing"
import { CheckCircle, EnvelopeSimple } from "@phosphor-icons/react"
import { useTranslations } from "next-intl"

export default function SignUpSuccessClient() {
  const t = useTranslations("Auth")

  return (
    <div className="min-h-svh flex items-center justify-center bg-muted p-4">
      <div className="w-full max-w-sm bg-card rounded-xl border border-border relative">
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

          <div className="flex items-start gap-3 p-4 bg-primary/10 border border-primary/20 rounded-lg text-left mb-6">
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
              className="w-full h-10 bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium rounded-lg transition-colors flex items-center justify-center"
            >
              {t("goToSignIn")}
            </Link>
            <Link
              href="/"
              className="w-full h-10 bg-background border border-border text-foreground text-sm font-medium rounded-lg hover:bg-muted transition-colors flex items-center justify-center"
            >
              {t("backToHome")}
            </Link>
          </div>

          <p className="text-xs text-center text-muted-foreground mt-4">
            {t("didNotReceiveEmail")} {" "}
            <button type="button" className="text-primary hover:underline">
              {t("resendEmail")}
            </button>
          </p>
        </div>

        <div className="px-6 py-4 bg-muted border-t border-border rounded-b-xl">
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
