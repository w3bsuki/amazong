import { Button } from "@/components/ui/button"
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
      default: return t('errorGeneric')
    }
  }

  return (
    <div className="min-h-svh flex flex-col bg-muted/30">
      {/* Header */}
      <header className="py-6 flex justify-center">
        <Link href="/" className="text-heading-2 tracking-tight hover:opacity-70 transition-opacity">
          AMZN
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-start justify-center px-4 pb-12">
        <div className="w-full max-w-[350px]">
          <div className="bg-card border border-border rounded-sm p-6 shadow-sm text-center">
            {/* Error Icon */}
            <div className="mx-auto size-14 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
              <WarningCircle className="size-8 text-destructive" weight="fill" />
            </div>
            
            <h1 className="text-heading-3 mb-2">{t('errorTitle')}</h1>
            <p className="text-body-sm text-muted-foreground mb-6">{t('errorSubtitle')}</p>

            {/* Error Details */}
            <div className="p-4 bg-destructive/5 border border-destructive/20 rounded-sm text-left mb-6">
              <p className="text-caption text-destructive">
                {getErrorMessage(params.error, params.error_description)}
              </p>
              {params.error && (
                <p className="text-meta text-muted-foreground mt-2">
                  {t('errorCode')}: {params.error}
                </p>
              )}
            </div>

            <div className="space-y-3">
              <Link href="/auth/login" className="block">
                <Button className="w-full h-9 text-body-sm font-medium">
                  {t('tryAgain')}
                </Button>
              </Link>
              <Link href="/" className="block">
                <Button variant="outline" className="w-full h-9 text-body-sm font-medium">
                  <ArrowLeft className="size-4 mr-1.5" />
                  {t('backToHome')}
                </Button>
              </Link>
            </div>

            <p className="text-meta text-muted-foreground mt-4">
              {t('needHelp')}{" "}
              <Link href="/help" className="text-primary hover:underline">{t('contactSupport')}</Link>
            </p>
          </div>

          {/* Footer */}
          <footer className="mt-6 text-center space-y-2">
            <div className="flex justify-center gap-4 text-caption">
              <Link href="/terms" className="text-primary hover:underline">{t('conditionsOfUse')}</Link>
              <Link href="/privacy" className="text-primary hover:underline">{t('privacyNotice')}</Link>
              <Link href="/help" className="text-primary hover:underline">{t('help')}</Link>
            </div>
            <p className="text-meta">
              {t('copyright', { year: new Date().getFullYear() })}
            </p>
          </footer>
        </div>
      </main>
    </div>
  )
}
