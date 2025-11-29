import { getTranslations } from "next-intl/server"
import { AppBreadcrumb, breadcrumbPresets } from "@/components/app-breadcrumb"
import { Card, CardContent } from "@/components/ui/card"
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { 
  FileText, ShoppingBag, CreditCard, Truck, Scales,
  Warning, Users, Prohibit, ArrowCounterClockwise, Shield, 
  Gavel, Envelope, CheckCircle
} from "@phosphor-icons/react/dist/ssr"
import Link from "next/link"
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === 'bg' ? 'Условия за ползване' : 'Terms of Service',
    description: locale === 'bg' 
      ? 'Условия за ползване на услугите на AMZN.'
      : 'Terms of Service for using AMZN services.',
  };
}

export default async function TermsPage() {
  const t = await getTranslations('Terms')
  
  const sections = [
    { id: 'acceptance', icon: CheckCircle, title: t('acceptance'), desc: t('acceptanceDesc') },
    { id: 'use-of-service', icon: ShoppingBag, title: t('useOfService'), desc: t('useOfServiceDesc') },
    { id: 'account', icon: Users, title: t('account'), desc: t('accountDesc') },
    { id: 'orders', icon: ShoppingBag, title: t('orders'), desc: t('ordersDesc') },
    { id: 'payments', icon: CreditCard, title: t('payments'), desc: t('paymentsDesc') },
    { id: 'shipping', icon: Truck, title: t('shipping'), desc: t('shippingDesc') },
    { id: 'returns', icon: ArrowCounterClockwise, title: t('returnsPolicy'), desc: t('returnsPolicyDesc') },
    { id: 'prohibited', icon: Prohibit, title: t('prohibited'), desc: t('prohibitedDesc') },
    { id: 'intellectual', icon: Shield, title: t('intellectual'), desc: t('intellectualDesc') },
    { id: 'liability', icon: Scales, title: t('liability'), desc: t('liabilityDesc') },
    { id: 'disputes', icon: Gavel, title: t('disputes'), desc: t('disputesDesc') },
    { id: 'changes', icon: Warning, title: t('changes'), desc: t('changesDesc') },
  ]
  
  return (
    <div className="min-h-screen bg-background pb-20 sm:pb-12">
      {/* Hero Section */}
      <div className="bg-header-bg text-white">
        <div className="container py-10 md:py-14">
          <div className="[&_nav]:border-white/20 [&_nav]:mb-4 [&_a]:text-white/80 [&_a:hover]:text-white [&_span[aria-current]]:text-white [&_svg]:text-white/50">
            <AppBreadcrumb items={breadcrumbPresets.terms} />
          </div>
          <div className="flex items-start gap-4">
            <div className="size-14 bg-white/10 flex items-center justify-center shrink-0">
              <FileText className="size-7 text-white" />
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
            {/* Important Notice */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4 p-4 bg-brand-warning/10 border-l-4 border-brand-warning mb-4">
                  <Warning className="size-5 text-brand-warning shrink-0 mt-0.5" />
                  <p className="text-sm">{t('importantNotice')}</p>
                </div>
                <p className="text-muted-foreground leading-relaxed">{t('introText')}</p>
              </CardContent>
            </Card>

            {/* Accordion Sections */}
            <Card>
              <CardContent className="p-6">
                <Accordion type="single" collapsible className="w-full" defaultValue="acceptance">
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
                    href="mailto:legal@amzn.bg" 
                    className="inline-flex items-center justify-center px-4 py-2 border border-border text-sm font-medium hover:bg-background transition-colors"
                  >
                    legal@amzn.bg
                  </a>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

            {/* Related Links */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link href="/privacy" className="block p-4 border border-border hover:border-brand/50 hover:bg-brand/5 transition-colors">
            <Shield className="size-5 text-brand mb-2" />
            <h4 className="font-medium">{t('privacyLink')}</h4>
            <p className="text-sm text-muted-foreground">{t('privacyLinkDesc')}</p>
          </Link>
          <Link href="/returns" className="block p-4 border border-border hover:border-brand/50 hover:bg-brand/5 transition-colors">
            <ArrowCounterClockwise className="size-5 text-brand mb-2" />
            <h4 className="font-medium">{t('returnsLink')}</h4>
            <p className="text-sm text-muted-foreground">{t('returnsLinkDesc')}</p>
          </Link>
              <Link href="/customer-service" className="block p-4 border border-border hover:border-brand/50 hover:bg-brand/5 transition-colors">
                <Users className="size-5 text-brand mb-2" />
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
