import { getTranslations, setRequestLocale } from "next-intl/server"
import { AppBreadcrumb } from "@/components/navigation/app-breadcrumb"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  ShieldCheck, CreditCard, Lock, Eye, 
  Warning, Fingerprint, CheckCircle, EnvelopeSimple,
  LockKey, ShieldStar, UserCircleCheck, Bug
} from "@phosphor-icons/react/dist/ssr"
import { Link } from "@/i18n/routing"
import { Button } from "@/components/ui/button"
import { PageShell } from "@/components/shared/page-shell"
import type { Metadata } from 'next'
import { routing, validateLocale } from "@/i18n/routing"

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: localeParam } = await params
  const locale = validateLocale(localeParam)
  setRequestLocale(locale)
  const t = await getTranslations('Security')
  
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
  }
}

export default async function SecurityPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale: localeParam } = await params
  const locale = validateLocale(localeParam)
  setRequestLocale(locale)
  const t = await getTranslations('Security')
  const tBreadcrumbs = await getTranslations("Breadcrumbs")
  
  const breadcrumbItems = [
    { label: t('breadcrumbSecurity') },
  ]
  
  const paymentFeatures = [
    { icon: CreditCard, title: t('pciCompliant'), desc: t('pciCompliantDesc') },
    { icon: Lock, title: t('tlsEncryption'), desc: t('tlsEncryptionDesc') },
    { icon: ShieldStar, title: t('secure3d'), desc: t('secure3dDesc') },
    { icon: Eye, title: t('noCardStorage'), desc: t('noCardStorageDesc') },
  ]
  
  const accountFeatures = [
    { icon: LockKey, title: t('securePasswords'), desc: t('securePasswordsDesc') },
    { icon: EnvelopeSimple, title: t('emailVerification'), desc: t('emailVerificationDesc') },
    { icon: Fingerprint, title: t('sessionManagement'), desc: t('sessionManagementDesc') },
    { icon: UserCircleCheck, title: t('twoFactor'), desc: t('twoFactorDesc') },
  ]
  
  const fraudProtection = [
    { icon: Warning, title: t('transactionMonitoring'), desc: t('transactionMonitoringDesc') },
    { icon: ShieldCheck, title: t('sellerVerification'), desc: t('sellerVerificationDesc') },
    { icon: CheckCircle, title: t('buyerProtection'), desc: t('buyerProtectionDesc') },
    { icon: Bug, title: t('reportSuspicious'), desc: t('reportSuspiciousDesc') },
  ]
  
  return (
    <PageShell className="pb-20 sm:pb-12">
      {/* Hero Section */}
      <div className="bg-primary text-primary-foreground">
        <div className="container py-10 md:py-16">
          <div className="[&_nav]:border-border-subtle [&_nav]:mb-4 [&_a]:text-foreground [&_a:hover]:text-primary-foreground [&_span[aria-current]]:text-primary-foreground [&_svg]:text-muted-foreground">
            <AppBreadcrumb
              items={breadcrumbItems}
              ariaLabel={tBreadcrumbs("ariaLabel")}
              homeLabel={tBreadcrumbs("homeLabel")}
            />
          </div>
          <div className="flex items-center gap-4 mb-4">
            <div className="size-14 bg-hover rounded-full flex items-center justify-center">
              <ShieldCheck className="size-7 text-primary-foreground" weight="fill" />
            </div>
            <div>
              <h1 className="text-2xl md:text-4xl font-bold">{t('heroTitle')}</h1>
              <p className="text-foreground text-lg mt-1">{t('heroSubtitle')}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-8 md:py-12">
        {/* Stripe Badge Section */}
        <Card className="mb-8 border-selected-border bg-selected">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="flex items-center gap-4">
                <div className="size-16 bg-surface-subtle rounded-md flex items-center justify-center shrink-0">
                  <svg viewBox="0 0 60 25" className="h-6 w-auto text-primary" aria-label="Stripe">
                    <path fill="currentColor" d="M59.64 14.28h-8.06c.19 1.93 1.6 2.55 3.2 2.55 1.64 0 2.96-.37 4.05-.95v3.32a8.33 8.33 0 0 1-4.56 1.1c-4.01 0-6.83-2.5-6.83-7.48 0-4.19 2.39-7.52 6.3-7.52 3.92 0 5.96 3.28 5.96 7.5 0 .4-.02.8-.06 1.48zm-5.92-5.62c-1.03 0-2.17.73-2.17 2.58h4.25c0-1.85-1.07-2.58-2.08-2.58zM40.95 20.3c-1.44 0-2.32-.6-2.9-1.04l-.02 4.63-4.12.87V5.57h3.76l.08 1.02a4.7 4.7 0 0 1 3.23-1.29c2.9 0 5.62 2.6 5.62 7.4 0 5.23-2.7 7.6-5.65 7.6zM40 8.95c-.95 0-1.54.34-1.97.81l.02 6.12c.4.44.98.78 1.95.78 1.52 0 2.54-1.65 2.54-3.87 0-2.15-1.04-3.84-2.54-3.84zM28.24 5.57h4.13v14.44h-4.13V5.57zm0-5.13L32.37 0v3.77l-4.13.88V.44zm-4.32 9.35v10.22H19.8V5.57h3.7l.12 1.22c1-1.77 3.07-1.41 3.62-1.22v3.79c-.52-.17-2.29-.45-3.32.43zm-8.55 4.72c0 2.43 2.6 1.68 3.12 1.46v3.36c-.55.3-1.54.54-2.89.54a4.15 4.15 0 0 1-4.27-4.24l.01-13.17 4.02-.86v3.54h3.14V9.1h-3.13v5.41zm-4.91.7c0 3.05-2.84 3.91-5.4 3.91-2.15 0-4.04-.47-5.4-1.14V14.1a9.62 9.62 0 0 0 5.09 1.62c.67 0 1.67-.15 1.67-.88 0-1.83-6.78-1.22-6.78-5.92C-.16 5.73 2.67 5 5.26 5c1.87 0 3.75.34 5.01.9v3.57a10.12 10.12 0 0 0-4.72-1.3c-.63 0-1.52.1-1.52.73 0 1.7 6.78.94 6.78 5.86h.15v-.05z"/>
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-bold">{t('stripePartner')}</h2>
                  <p className="text-muted-foreground">{t('stripePartnerDesc')}</p>
                </div>
              </div>
              <div className="md:ml-auto flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-success/10 text-success text-sm font-medium rounded-full">
                  PCI DSS Level 1
                </span>
                <span className="px-3 py-1 bg-info/10 text-info text-sm font-medium rounded-full">
                  SOC 2 Type II
                </span>
                <span className="px-3 py-1 bg-selected text-primary text-sm font-medium rounded-full">
                  GDPR Compliant
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Security */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-2">{t('paymentSecurity')}</h2>
          <p className="text-muted-foreground mb-6">{t('paymentSecurityDesc')}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {paymentFeatures.map((feature, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="size-12 bg-surface-subtle rounded-lg flex items-center justify-center shrink-0">
                      <feature.icon className="size-6 text-primary" weight="duotone" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground">{feature.desc}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Account Security */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-2">{t('accountSecurity')}</h2>
          <p className="text-muted-foreground mb-6">{t('accountSecurityDesc')}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {accountFeatures.map((feature, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="size-12 bg-success/10 rounded-lg flex items-center justify-center shrink-0">
                      <feature.icon className="size-6 text-success" weight="duotone" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground">{feature.desc}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Fraud Prevention */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-2">{t('fraudPrevention')}</h2>
          <p className="text-muted-foreground mb-6">{t('fraudPreventionDesc')}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fraudProtection.map((feature, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="size-12 bg-warning/10 rounded-lg flex items-center justify-center shrink-0">
                      <feature.icon className="size-6 text-warning" weight="duotone" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground">{feature.desc}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Data Protection */}
        <Card className="mb-12 bg-surface-subtle">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Lock className="size-6 text-primary" />
              {t('dataProtection')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">{t('dataProtectionDesc')}</p>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <CheckCircle className="size-5 text-success shrink-0 mt-0.5" weight="fill" />
                <span>{t('gdprCompliance')}</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="size-5 text-success shrink-0 mt-0.5" weight="fill" />
                <span>{t('dataEncryption')}</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="size-5 text-success shrink-0 mt-0.5" weight="fill" />
                <span>{t('regularAudits')}</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="size-5 text-success shrink-0 mt-0.5" weight="fill" />
                <span>{t('dataMinimization')}</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Contact Security Team */}
        <Card className="border-selected-border">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="flex items-center gap-4">
                <div className="size-14 bg-selected rounded-full flex items-center justify-center shrink-0">
                  <ShieldCheck className="size-7 text-primary" weight="fill" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">{t('reportIssue')}</h3>
                  <p className="text-muted-foreground">{t('reportIssueDesc')}</p>
                </div>
              </div>
              <div className="md:ml-auto flex flex-col sm:flex-row gap-3">
                <Link href="/contact">
                  <Button variant="outline" className="w-full sm:w-auto">
                    {t('contactUs')}
                  </Button>
                </Link>
                <a href="mailto:security@treido.eu">
                  <Button variant="cta" className="w-full sm:w-auto">
                    <EnvelopeSimple className="size-4 mr-2" />
                    security@treido.eu
                  </Button>
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageShell>
  )
}
