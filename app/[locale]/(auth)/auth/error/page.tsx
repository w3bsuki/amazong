import { Link } from "@/i18n/routing"
import { getTranslations } from "next-intl/server"
import { WarningCircle, ArrowLeft } from "@phosphor-icons/react/dist/ssr"

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
    <div className="min-h-dvh flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-card rounded-md border border-border relative">
        <div className="p-6">
          {/* Header */}
          <div className="flex flex-col items-center mb-6">
            {/* Error Icon */}
            <div className="size-14 bg-destructive/15 rounded-full flex items-center justify-center mb-3">
              <WarningCircle className="size-8 text-destructive" weight="fill" />
            </div>
            
            <h1 className="text-xl font-semibold text-foreground">
              {t('errorTitle')}
            </h1>
            <p className="text-sm text-muted-foreground mt-1 text-center">
              {t('errorSubtitle')}
            </p>
          </div>

          {/* Error Details */}
          <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-left mb-6">
            <p className="text-sm text-destructive">
              {getErrorMessage(params.error, params.error_description)}
            </p>
            {params.error && (
              <p className="text-xs text-muted-foreground mt-2">
                {t('errorCode')}: {params.error}
              </p>
            )}
          </div>

          {/* Buttons */}
          <div className="space-y-3">
            <Link href="/auth/login" className="block">
              <button className="
                w-full h-10 
                bg-primary hover:bg-interactive-hover
                text-primary-foreground text-sm font-medium rounded-md 
                transition-colors
                flex items-center justify-center
              ">
                {t('tryAgain')}
              </button>
            </Link>
            <Link href="/" className="block">
              <button className="
                w-full h-10 
                bg-background border border-border 
                text-foreground text-sm font-medium rounded-md 
                hover:bg-muted
                transition-colors 
                flex items-center justify-center gap-1.5
              ">
                <ArrowLeft className="size-4" />
                {t('backToHome')}
              </button>
            </Link>
          </div>

          <p className="text-xs text-center text-muted-foreground mt-4">
            {t('needHelp')}{" "}
            <Link href="/help" className="text-primary hover:underline">{t('contactSupport')}</Link>
          </p>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-muted border-t border-border rounded-b-md">
          <div className="flex justify-center gap-4 text-xs text-muted-foreground">
            <Link href="/terms" className="hover:text-primary transition-colors">{t('conditionsOfUse')}</Link>
            <Link href="/privacy" className="hover:text-primary transition-colors">{t('privacyNotice')}</Link>
            <Link href="/help" className="hover:text-primary transition-colors">{t('help')}</Link>
          </div>
          <p className="text-xs text-center text-muted-foreground/70 mt-2">
            {t('copyright', { year: new Date().getFullYear() })}
          </p>
        </div>
      </div>
    </div>
  )
}
