import { Button } from "@/components/ui/button"
import type { useTranslations } from "next-intl"
import { Link } from "@/i18n/routing"

type AuthTranslator = ReturnType<typeof useTranslations>

export function SignUpFormFooter({
  t,
  showLegalText,
  showSignInCta,
  onNavigateAway,
  onSwitchToSignIn,
}: {
  t: AuthTranslator
  showLegalText: boolean
  showSignInCta: boolean
  onNavigateAway: (() => void) | undefined
  onSwitchToSignIn: (() => void) | undefined
}) {
  return (
    <>
      {showLegalText && (
        <div className="mt-4 space-y-1.5 text-xs">
          <p className="leading-relaxed text-muted-foreground">{t("byCreatingAccount")}</p>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
            <Link
              href="/terms"
              className="inline-flex min-h-11 items-center text-primary hover:underline"
              onClick={onNavigateAway}
            >
              {t("conditionsOfUse")}
            </Link>
            <span className="text-muted-foreground">{t("and")}</span>
            <Link
              href="/privacy"
              className="inline-flex min-h-11 items-center text-primary hover:underline"
              onClick={onNavigateAway}
            >
              {t("privacyNotice")}
            </Link>
          </div>
        </div>
      )}

      {showSignInCta && (
        <div className="mt-6 text-center text-sm text-muted-foreground">
          {t("alreadyHaveAccount")}{" "}
          {onSwitchToSignIn ? (
            <Button
              type="button"
              variant="link"
              className="min-h-11 p-0 font-medium text-primary hover:underline"
              onClick={onSwitchToSignIn}
            >
              {t("signInArrow")}
            </Button>
          ) : (
            <Link
              href="/auth/login"
              className="inline-flex min-h-11 items-center font-medium text-primary hover:underline"
              onClick={onNavigateAway}
            >
              {t("signInArrow")}
            </Link>
          )}
        </div>
      )}
    </>
  )
}

