import { getTranslations, setRequestLocale } from "next-intl/server"
import { AppBreadcrumb, breadcrumbPresets } from "../../../_components/navigation/app-breadcrumb"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Field, FieldContent, FieldDescription, FieldLabel } from "@/components/shared/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { 
  Envelope, Phone, MapPin, Clock, 
  Headphones, Package, CreditCard, Question,
  CaretRight, PaperPlaneTilt, ShieldCheck
} from "@phosphor-icons/react/dist/ssr"
import { PageShell } from "../../../_components/page-shell"
import { Link } from "@/i18n/routing"
import type { Metadata } from 'next'
import { validateLocale } from "@/i18n/routing"

// Generate static params for all locales - required for Next.js 16 Cache Components
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = validateLocale(localeParam)
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: "Contact" })
  return {
    title: t("title"),
    description: t("metaDescription"),
  };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale: localeParam } = await params
  const locale = validateLocale(localeParam)
  setRequestLocale(locale)
  const t = await getTranslations('Contact')
  const tBreadcrumbs = await getTranslations("Breadcrumbs")
  
  const quickHelp = [
    { icon: Package, title: t('trackOrder'), desc: t('trackOrderDesc'), href: "/account/orders" },
    { icon: CreditCard, title: t('paymentIssues'), desc: t('paymentIssuesDesc'), href: "/customer-service" },
    { icon: Question, title: t('productQuestions'), desc: t('productQuestionsDesc'), href: "/customer-service" },
  ]
  
  return (
    <PageShell className="pb-20 sm:pb-12">
      {/* Hero Section */}
      <div className="bg-primary text-primary-foreground">
        <div className="container py-10 md:py-16">
          <div className="[&_nav]:border-border-subtle [&_nav]:mb-4 [&_a]:text-foreground [&_a:hover]:text-primary-foreground [&_span[aria-current]]:text-primary-foreground [&_svg]:text-muted-foreground">
            <AppBreadcrumb
              items={breadcrumbPresets(tBreadcrumbs).contact}
              ariaLabel={tBreadcrumbs("ariaLabel")}
              homeLabel={tBreadcrumbs("homeLabel")}
            />
          </div>
          <div className="max-w-2xl">
            <h1 className="text-2xl md:text-4xl font-bold mb-3">{t('heroTitle')}</h1>
            <p className="text-foreground text-lg">{t('heroSubtitle')}</p>
          </div>
        </div>
      </div>

      <div className="container py-8">
        {/* Quick Help Section */}
        <section className="mb-12">
          <h2 className="text-xl font-bold mb-6">{t('quickHelp')}</h2>
          <div className="grid grid-cols-2 gap-2 sm:gap-4 md:grid-cols-3">
            {quickHelp.map((item, index) => (
              <Link key={index} href={item.href}>
                <Card className="h-full hover:shadow-md hover:border-hover-border transition-all cursor-pointer group">
                  <CardContent className="p-5">
                    <div className="flex items-start gap-4">
                      <div className="size-12 bg-surface-subtle flex items-center justify-center shrink-0 group-hover:bg-hover transition-colors">
                        <item.icon className="size-6 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="font-semibold">{item.title}</h3>
                          <CaretRight className="size-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{item.desc}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="size-10 bg-selected flex items-center justify-center">
                    <PaperPlaneTilt className="size-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">{t('sendMessage')}</h2>
                    <p className="text-sm text-muted-foreground">{t('sendMessageDesc')}</p>
                  </div>
                </div>
                
                <form className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <Field>
                      <FieldContent>
                        <FieldLabel htmlFor="name">
                          {t('name')} <span className="text-destructive">*</span>
                        </FieldLabel>
                        <Input id="name" name="name" placeholder={t('namePlaceholder')} required />
                      </FieldContent>
                    </Field>
                    <Field>
                      <FieldContent>
                        <FieldLabel htmlFor="email">
                          {t('email')} <span className="text-destructive">*</span>
                        </FieldLabel>
                        <Input id="email" name="email" type="email" placeholder={t('emailPlaceholder')} required />
                      </FieldContent>
                    </Field>
                  </div>
                  
                  <Field>
                    <FieldContent>
                      <FieldLabel htmlFor="phone">{t('phone')}</FieldLabel>
                      <Input id="phone" name="phone" type="tel" placeholder={t('phonePlaceholder')} />
                    </FieldContent>
                  </Field>
                  
                  <Field>
                    <FieldContent>
                      <FieldLabel htmlFor="orderNumber">{t('orderNumber')}</FieldLabel>
                      <Input id="orderNumber" name="orderNumber" placeholder={t('orderNumberPlaceholder')} />
                      <FieldDescription className="text-xs">{t('orderNumberHint')}</FieldDescription>
                    </FieldContent>
                  </Field>
                  
                    <Field>
                    <FieldContent>
                      <FieldLabel htmlFor="subject">
                        {t('subject')} <span className="text-destructive">*</span>
                      </FieldLabel>
                      <select 
                        id="subject" 
                        name="subject"
                        className="flex h-10 w-full border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        required
                      >
                        <option value="">{t('selectSubject')}</option>
                        <option value="order">{t('subjectOrder')}</option>
                        <option value="return">{t('subjectReturn')}</option>
                        <option value="payment">{t('subjectPayment')}</option>
                        <option value="product">{t('subjectProduct')}</option>
                        <option value="account">{t('subjectAccount')}</option>
                        <option value="other">{t('subjectOther')}</option>
                      </select>
                    </FieldContent>
                  </Field>
                  
                  <Field>
                    <FieldContent>
                      <FieldLabel htmlFor="message">
                        {t('message')} <span className="text-destructive">*</span>
                      </FieldLabel>
                      <Textarea 
                        id="message" 
                        name="message"
                        placeholder={t('messagePlaceholder')} 
                        className="min-h-(--textarea-min-h) resize-none" 
                        required 
                      />
                      <FieldDescription className="text-xs">{t('messageHint')}</FieldDescription>
                    </FieldContent>
                  </Field>
                  
                  <div className="flex items-start gap-3 p-4 bg-muted">
                    <ShieldCheck className="size-5 text-success shrink-0 mt-0.5" />
                    <p className="text-xs text-muted-foreground">{t('privacyNote')}</p>
                  </div>
                  
                  <Button type="submit" variant="cta" className="w-full sm:w-auto">
                    <PaperPlaneTilt className="size-4 mr-2" />
                    {t('send')}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
          
          {/* Contact Info Sidebar */}
          <div className="space-y-4">
            {/* Customer Service */}
            <Card className="border-selected-border bg-selected">
              <CardContent className="p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="size-10 bg-surface-subtle flex items-center justify-center">
                    <Headphones className="size-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold">{t('customerService')}</h3>
                    <p className="text-sm text-muted-foreground">{t('fastestWay')}</p>
                  </div>
                </div>
                <Link href="/customer-service">
                  <Button variant="outline" className="w-full border-selected-border text-primary hover:bg-primary hover:text-primary-foreground">
                    {t('visitHelpCenter')}
                  </Button>
                </Link>
              </CardContent>
            </Card>
            
            {/* Email */}
            <Card>
              <CardContent className="p-5">
                <div className="flex items-center gap-4">
                  <div className="size-12 bg-surface-subtle flex items-center justify-center shrink-0">
                    <Envelope className="size-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold">{t('emailUs')}</h3>
                    <a href="mailto:help@treido.com" className="text-sm text-primary hover:underline">
                      help@treido.com
                    </a>
                    <p className="text-xs text-muted-foreground mt-1">{t('emailResponse')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Phone */}
            <Card>
              <CardContent className="p-5">
                <div className="flex items-center gap-4">
                  <div className="size-12 bg-surface-subtle flex items-center justify-center shrink-0">
                    <Phone className="size-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold">{t('callUs')}</h3>
                    <a href="tel:+35921234567" className="text-sm text-primary hover:underline">
                      +359 2 123 4567
                    </a>
                    <p className="text-xs text-muted-foreground mt-1">{t('callHours')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Address */}
            <Card>
              <CardContent className="p-5">
                <div className="flex items-center gap-4">
                  <div className="size-12 bg-surface-subtle flex items-center justify-center shrink-0">
                    <MapPin className="size-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold">{t('headquarters')}</h3>
                    <p className="text-sm text-muted-foreground">
                      Treido Ltd.<br />
                      bul. Vitosha 100<br />
                      1463 Sofia, Bulgaria
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Business Hours */}
            <Card>
              <CardContent className="p-5">
                <div className="flex items-center gap-4">
                  <div className="size-12 bg-surface-subtle flex items-center justify-center shrink-0">
                    <Clock className="size-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold">{t('hours')}</h3>
                    <div className="text-sm text-muted-foreground space-y-1 mt-1">
                      <p>{t('weekdays')}: 09:00 - 21:00</p>
                      <p>{t('saturday')}: 10:00 - 18:00</p>
                      <p>{t('sunday')}: 10:00 - 16:00</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ Teaser */}
        <section className="mt-12">
          <Card className="bg-muted">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="size-12 bg-surface-subtle flex items-center justify-center shrink-0">
                    <Question className="size-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{t('faqTitle')}</h3>
                    <p className="text-muted-foreground">{t('faqDesc')}</p>
                  </div>
                </div>
                <Link href="/customer-service">
                  <Button variant="outline" className="whitespace-nowrap">
                    {t('viewFaq')}
                    <CaretRight className="size-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </PageShell>
  )
}


