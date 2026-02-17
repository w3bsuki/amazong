import { Link } from "@/i18n/routing"
import { getTranslations } from "next-intl/server"
import { WarningCircle, ArrowLeft } from "@/lib/icons/phosphor"
import { Button } from "@/components/ui/button"
import { AuthCard } from "../../_components/auth-card"

export default async function AuthErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; error_description?: string }>
}) {
  const params = await searchParams
  const t = await getTranslations('Auth')

  const getErrorMessage = (error?: string, description?: string) => {
    if (description) return description
    switch (error) {
      case 'access_denied': return t('errorAccessDenied')
      case 'invalid_request': return t('errorInvalidRequest')
      case 'unauthorized_client': return t('errorUnauthorized')
      case 'server_error': return t('errorServer')
      case 'verification_failed': return t('errorVerificationFailed')
      case 'invalid_code': return t('errorInvalidCode')
      default: return t('errorGeneric')
    }
  }

  return (
    <AuthCard title={t("errorTitle")} description={t("errorSubtitle")}>
      <div className="space-y-5">
        <div className="flex items-center justify-center">
          <div className="inline-flex size-14 items-center justify-center rounded-full bg-destructive-subtle text-destructive">
            <WarningCircle className="size-8" weight="fill" />
          </div>
        </div>

        <div className="rounded-xl border border-destructive bg-destructive-subtle p-4 text-left">
          <p className="text-sm text-destructive">{getErrorMessage(params.error, params.error_description)}</p>
          {params.error && (
            <p className="mt-2 text-xs text-muted-foreground">
              {t("errorCode")}: {params.error}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Button asChild size="default" className="w-full">
            <Link href="/auth/login">{t("tryAgain")}</Link>
          </Button>
          <Button asChild variant="outline" size="default" className="w-full">
            <Link href="/" className="inline-flex items-center justify-center gap-1.5">
              <ArrowLeft className="size-4" />
              {t("backToHome")}
            </Link>
          </Button>
        </div>

        <p className="text-xs text-center text-muted-foreground">
          {t("needHelp")}{" "}
          <Link href="/customer-service" className="inline-flex min-h-11 items-center text-primary hover:underline">
            {t("contactSupport")}
          </Link>
        </p>
      </div>
    </AuthCard>
  )
}
