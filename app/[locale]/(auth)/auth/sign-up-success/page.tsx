import { Button } from "@/components/ui/button"
import { Link } from "@/i18n/routing"
import { getTranslations } from "next-intl/server"
import { connection } from "next/server"
import { CheckCircle, EnvelopeSimple } from "@phosphor-icons/react/dist/ssr"

export default async function SignUpSuccessPage() {
  await connection()
  const t = await getTranslations('Auth')

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
            {/* Success Icon */}
            <div className="mx-auto size-14 bg-emerald-500/10 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="size-8 text-emerald-600" weight="fill" />
            </div>
            
            <h1 className="text-heading-3 mb-2">{t('signUpSuccessTitle')}</h1>
            <p className="text-body-sm text-muted-foreground mb-6">{t('signUpSuccessDescription')}</p>

            {/* Email Notice */}
            <div className="flex items-start gap-3 p-4 bg-muted/50 border border-border rounded-sm text-left mb-6">
              <EnvelopeSimple className="size-5 text-primary shrink-0 mt-0.5" weight="duotone" />
              <div>
                <p className="text-label mb-0.5">{t('checkYourEmail')}</p>
                <p className="text-caption text-muted-foreground">{t('confirmEmailInstructions')}</p>
              </div>
            </div>

            <div className="space-y-3">
              <Link href="/auth/login" className="block">
                <Button className="w-full h-9 text-body-sm font-medium">
                  {t('goToSignIn')}
                </Button>
              </Link>
              <Link href="/" className="block">
                <Button variant="outline" className="w-full h-9 text-body-sm font-medium">
                  {t('backToHome')}
                </Button>
              </Link>
            </div>

            <p className="text-meta text-muted-foreground mt-4">
              {t('didNotReceiveEmail')}{" "}
              <button className="text-primary hover:underline">{t('resendEmail')}</button>
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
