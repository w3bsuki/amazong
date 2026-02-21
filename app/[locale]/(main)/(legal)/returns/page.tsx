import { getTranslations, setRequestLocale } from "next-intl/server"
import { AppBreadcrumb, breadcrumbPresets } from "../../../_components/navigation/app-breadcrumb"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { RefreshCcw as ArrowCounterClockwise, ChevronRight as CaretRight, CircleCheck as CheckCircle, Clock, CreditCard, FileText, MapPin, Package, Printer, Ban as Prohibit, CircleHelp as Question, ShieldCheck, Truck, CircleAlert as WarningCircle } from "lucide-react";

import { Link } from "@/i18n/routing"
import type { Metadata } from 'next'
import { validateLocale } from "@/i18n/routing"
import { PageShell } from "../../../_components/page-shell"
import { StaticPageHeaderSync } from "../../_components/static-page-header-sync"

// Generate static params for all locales - required for Next.js 16 Cache Components
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = validateLocale(localeParam)
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: "Returns" })
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
}

export default async function ReturnsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: localeParam } = await params
  const locale = validateLocale(localeParam)
  setRequestLocale(locale)
  const t = await getTranslations('Returns')
  const tBreadcrumbs = await getTranslations("Breadcrumbs")
  
  return (
    <PageShell className="pb-20 sm:pb-12 overflow-x-hidden">
      <StaticPageHeaderSync title={t("metaTitle")} backHref="/" />
      {/* Hero Section */}
      <div className="bg-primary text-primary-foreground">
        <div className="container px-4 sm:px-6 py-10 md:py-16">
          <div className="hidden md:block [&_nav]:border-border-subtle [&_nav]:mb-4 [&_a]:text-foreground [&_a:hover]:text-primary-foreground [&_span[aria-current]]:text-primary-foreground [&_svg]:text-muted-foreground">
            <AppBreadcrumb
              items={breadcrumbPresets(tBreadcrumbs).returns}
              ariaLabel={tBreadcrumbs("ariaLabel")}
              homeLabel={tBreadcrumbs("homeLabel")}
            />
          </div>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="max-w-2xl">
              <h1 className="text-2xl md:text-4xl font-bold tracking-tight mb-3">{t('heroTitle')}</h1>
              <p className="text-foreground">{t('heroSubtitle')}</p>
            </div>
            <Button asChild variant="cta" size="lg" className="whitespace-nowrap">
              <Link href="/account/orders">
                <ArrowCounterClockwise className="size-5 mr-2" />
                {t('startReturn')}
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="container px-4 sm:px-6 py-8">
        {/* Return Policy Highlights */}
        <section className="mb-12">
          <div className="grid grid-cols-2 gap-2 sm:gap-4 md:grid-cols-4">
            <Card className="border-success/30 bg-success/10">
              <CardContent className="p-4 text-center">
                <Clock className="size-8 text-success mx-auto mb-3" />
                <h3 className="font-bold tracking-tight text-2xl text-success">30</h3>
                <p className="text-sm text-muted-foreground">{t('daysToReturn')}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Truck className="size-8 text-primary mx-auto mb-3" />
                <h3 className="font-bold tracking-tight">{t('freeReturns')}</h3>
                <p className="text-sm text-muted-foreground">{t('freeReturnsDesc')}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <CreditCard className="size-8 text-primary mx-auto mb-3" />
                <h3 className="font-bold tracking-tight">{t('fastRefunds')}</h3>
                <p className="text-sm text-muted-foreground">{t('fastRefundsDesc')}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <ShieldCheck className="size-8 text-primary mx-auto mb-3" />
                <h3 className="font-bold tracking-tight">{t('noHassle')}</h3>
                <p className="text-sm text-muted-foreground">{t('noHassleDesc')}</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* How to Return Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold tracking-tight mb-6">{t('howToReturn')}</h2>
          <div className="grid grid-cols-2 gap-3 md:gap-4 md:grid-cols-4">
            {/* Step 1 */}
            <Card className="relative">
              <CardContent className="p-6">
                <div className="absolute -top-3 -left-3 size-8 bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                  1
                </div>
                <Package className="size-10 text-primary mb-4 mt-2" />
                <h3 className="font-bold tracking-tight text-lg mb-2">{t('step1')}</h3>
                <p className="text-sm text-muted-foreground">{t('step1Desc')}</p>
              </CardContent>
            </Card>
            
            {/* Step 2 */}
            <Card className="relative">
              <CardContent className="p-6">
                <div className="absolute -top-3 -left-3 size-8 bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                  2
                </div>
                <FileText className="size-10 text-primary mb-4 mt-2" />
                <h3 className="font-bold tracking-tight text-lg mb-2">{t('step2')}</h3>
                <p className="text-sm text-muted-foreground">{t('step2Desc')}</p>
              </CardContent>
            </Card>
            
            {/* Step 3 */}
            <Card className="relative">
              <CardContent className="p-6">
                <div className="absolute -top-3 -left-3 size-8 bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                  3
                </div>
                <Printer className="size-10 text-primary mb-4 mt-2" />
                <h3 className="font-bold tracking-tight text-lg mb-2">{t('step3')}</h3>
                <p className="text-sm text-muted-foreground">{t('step3Desc')}</p>
              </CardContent>
            </Card>
            
            {/* Step 4 */}
            <Card className="relative">
              <CardContent className="p-6">
                <div className="absolute -top-3 -left-3 size-8 bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                  4
                </div>
                <MapPin className="size-10 text-primary mb-4 mt-2" />
                <h3 className="font-bold tracking-tight text-lg mb-2">{t('step4')}</h3>
                <p className="text-sm text-muted-foreground">{t('step4Desc')}</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Return Policy Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Eligible Items */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="size-10 bg-success/10 flex items-center justify-center">
                    <CheckCircle className="size-5 text-success" />
                  </div>
                  <h3 className="text-lg font-bold tracking-tight">{t('eligibleItems')}</h3>
                </div>
                <ul className="space-y-3">
                  {t.raw('eligibleItemsList').map((item: string, index: number) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="size-4 text-success shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Non-Returnable Items */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="size-10 bg-deal-light flex items-center justify-center">
                    <Prohibit className="size-5 text-deal" />
                  </div>
                  <h3 className="text-lg font-bold tracking-tight">{t('nonReturnable')}</h3>
                </div>
                <ul className="space-y-3">
                  {t.raw('nonReturnableList').map((item: string, index: number) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <Prohibit className="size-4 text-deal shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Refund Information */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="size-10 bg-selected flex items-center justify-center">
                    <CreditCard className="size-5 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold tracking-tight">{t('refundInfo')}</h3>
                </div>
                <div className="space-y-4 text-sm text-muted-foreground">
                  <p>{t('refundInfoText')}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div className="p-4 bg-muted">
                      <h4 className="font-medium text-foreground mb-1">{t('creditCard')}</h4>
                      <p>{t('creditCardTime')}</p>
                    </div>
                    <div className="p-4 bg-muted">
                      <h4 className="font-medium text-foreground mb-1">{t('bankTransfer')}</h4>
                      <p>{t('bankTransferTime')}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Start Return CTA */}
            <Card className="border-selected-border bg-selected">
              <CardContent className="p-4 text-center">
                <ArrowCounterClockwise className="size-12 text-primary mx-auto mb-4" />
                <h3 className="font-bold tracking-tight text-lg mb-2">{t('readyToReturn')}</h3>
                <p className="text-sm text-muted-foreground mb-4">{t('readyToReturnDesc')}</p>
                <Link href="/account/orders" className="block">
                  <Button variant="cta" className="w-full">
                    {t('startReturn')}
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Important Notice */}
            <Card>
              <CardContent className="p-5">
                <div className="flex items-start gap-3">
                  <WarningCircle className="size-5 text-warning shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium mb-1">{t('importantNotice')}</h4>
                    <p className="text-sm text-muted-foreground">{t('importantNoticeText')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Need Help */}
            <Card className="bg-muted">
              <CardContent className="p-5">
                <div className="flex items-start gap-3">
                  <Question className="size-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium mb-1">{t('needHelp')}</h4>
                    <p className="text-sm text-muted-foreground mb-3">{t('needHelpDesc')}</p>
                    <div className="flex flex-col gap-2">
                      <Link href="/customer-service">
                        <Button variant="outline" size="sm" className="w-full justify-between">
                          {t('customerService')}
                          <CaretRight className="size-4" />
                        </Button>
                      </Link>
                      <Link href="/contact">
                        <Button variant="outline" size="sm" className="w-full justify-between">
                          {t('contactUs')}
                          <CaretRight className="size-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ Section with Accordion */}
        <section>
          <h2 className="text-2xl font-bold tracking-tight mb-6">{t('faqTitle')}</h2>
          <Card>
            <CardContent className="p-6">
              <Accordion type="single" collapsible className="w-full">
                {t.raw('faqs').map((faq: { q: string; a: string }, index: number) => (
                  <AccordionItem key={index} value={`faq-${index}`}>
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center gap-3 text-left">
                        <Question className="size-5 text-primary shrink-0" />
                        <span className="font-medium">{faq.q}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="pl-8 text-muted-foreground">
                        {faq.a}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </section>
      </div>
    </PageShell>
  )
}


