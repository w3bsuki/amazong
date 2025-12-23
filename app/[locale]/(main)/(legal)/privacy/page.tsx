import { getTranslations, setRequestLocale } from "next-intl/server"
import { AppBreadcrumb, breadcrumbPresets } from "@/components/navigation/app-breadcrumb"
import { Card, CardContent } from "@/components/ui/card"
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { 
  Shield, Eye, Lock, FileText, Database, Bell, 
  Cookie, UserCheck, Globe, WarningCircle, Gear, Envelope
} from "@phosphor-icons/react/dist/ssr"
import { Link } from "@/i18n/routing"
import type { Metadata } from 'next'
import { routing } from "@/i18n/routing"

// Generate static params for all locales - required for Next.js 16 Cache Components
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale)
  return {
    title: locale === 'bg' ? 'Политика за поверителност' : 'Privacy Policy',
    description: locale === 'bg' 
      ? 'Научете как защитаваме вашите лични данни и гарантираме сигурността ви.'
      : 'Learn how we protect your personal data and ensure your privacy.',
  };
}

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('Privacy')
  
  const sections = [
    { id: 'info-collect', icon: Eye, title: t('infoCollect'), desc: t('infoCollectDesc') },
    { id: 'how-use', icon: FileText, title: t('howWeUse'), desc: t('howWeUseDesc') },
    { id: 'data-sharing', icon: Globe, title: t('dataSharing'), desc: t('dataSharingDesc') },
    { id: 'cookies', icon: Cookie, title: t('cookies'), desc: t('cookiesDesc') },
    { id: 'data-security', icon: Lock, title: t('dataSecurity'), desc: t('dataSecurityDesc') },
    { id: 'data-retention', icon: Database, title: t('dataRetention'), desc: t('dataRetentionDesc') },
    { id: 'your-rights', icon: UserCheck, title: t('yourRights'), desc: t('yourRightsDesc') },
    { id: 'notifications', icon: Bell, title: t('notifications'), desc: t('notificationsDesc') },
  ]
  
  return (
    <div className="min-h-screen bg-background pb-20 sm:pb-12">
      {/* Hero Section */}
      <div className="bg-header-bg text-white">
        <div className="container py-10 md:py-14">
          <div className="[&_nav]:border-white/20 [&_nav]:mb-4 [&_a]:text-white/80 [&_a:hover]:text-white [&_span[aria-current]]:text-white [&_svg]:text-white/50">
            <AppBreadcrumb items={breadcrumbPresets.privacy} />
          </div>
          <div className="flex items-start gap-4">
            <div className="size-14 bg-white/10 flex items-center justify-center shrink-0">
              <Shield className="size-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-4xl font-bold mb-2">{t('title')}</h1>
              <p className="text-white/70">{t('lastUpdated')}: {t('lastUpdatedDate')}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <aside className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardContent className="p-4">
                <h3 className="font-bold mb-4 text-sm uppercase tracking-wide text-muted-foreground">{t('tableOfContents')}</h3>
                <nav className="space-y-1">
                  {sections.map((section) => (
                    <a
                      key={section.id}
                      href={`#${section.id}`}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                    >
                      <section.icon className="size-4" />
                      <span className="truncate">{section.title}</span>
                    </a>
                  ))}
                </nav>
              </CardContent>
            </Card>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3 space-y-6">
            {/* Introduction Notice */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4 p-4 bg-brand/5 border-l-4 border-brand mb-4">
                  <WarningCircle className="size-5 text-brand shrink-0 mt-0.5" />
                  <p className="text-sm text-muted-foreground">{t('introNotice')}</p>
                </div>
                <p className="text-muted-foreground leading-relaxed">{t('introText')}</p>
              </CardContent>
            </Card>

            {/* Accordion Sections */}
            <Card>
              <CardContent className="p-6">
                <Accordion type="single" collapsible className="w-full" defaultValue="info-collect">
                  {sections.map((section, index) => (
                    <AccordionItem key={section.id} value={section.id} id={section.id} className="scroll-mt-4">
                      <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-center gap-3">
                          <div className="size-8 bg-brand/10 flex items-center justify-center shrink-0">
                            <section.icon className="size-4 text-brand" />
                          </div>
                          <span className="font-semibold text-left">
                            {index + 1}. {section.title}
                          </span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="pl-11 pr-4 text-muted-foreground leading-relaxed whitespace-pre-line">
                          {section.desc}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>

            {/* Contact Section */}
            <Card className="bg-muted">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="size-12 bg-brand/10 flex items-center justify-center shrink-0">
                <Envelope className="size-6 text-brand" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">{t('questionsTitle')}</h3>
                <p className="text-muted-foreground mb-4">{t('questionsDesc')}</p>
                <div className="flex flex-wrap gap-3">
                  <Link 
                    href="/contact" 
                    className="inline-flex items-center justify-center px-4 py-2 bg-brand text-white text-sm font-medium hover:bg-brand-dark transition-colors"
                  >
                    {t('contactUs')}
                  </Link>
                  <a 
                    href="mailto:privacy@amzn.bg" 
                    className="inline-flex items-center justify-center px-4 py-2 border border-border text-sm font-medium hover:bg-background transition-colors"
                  >
                    privacy@amzn.bg
                  </a>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

            {/* Related Links */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link href="/terms" className="block p-4 border border-border hover:border-brand/50 hover:bg-brand/5 transition-colors">
            <FileText className="size-5 text-brand mb-2" />
            <h4 className="font-medium">{t('termsLink')}</h4>
            <p className="text-sm text-muted-foreground">{t('termsLinkDesc')}</p>
          </Link>
          <Link href="/returns" className="block p-4 border border-border hover:border-brand/50 hover:bg-brand/5 transition-colors">
            <Gear className="size-5 text-brand mb-2" />
            <h4 className="font-medium">{t('returnsLink')}</h4>
            <p className="text-sm text-muted-foreground">{t('returnsLinkDesc')}</p>
          </Link>
              <Link href="/customer-service" className="block p-4 border border-border hover:border-brand/50 hover:bg-brand/5 transition-colors">
                <Shield className="size-5 text-brand mb-2" />
                <h4 className="font-medium">{t('helpLink')}</h4>
                <p className="text-sm text-muted-foreground">{t('helpLinkDesc')}</p>
              </Link>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
