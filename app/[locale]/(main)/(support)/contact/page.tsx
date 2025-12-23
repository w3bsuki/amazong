import { getTranslations, setRequestLocale } from "next-intl/server"
import { connection } from "next/server"
import { AppBreadcrumb, breadcrumbPresets } from "@/components/navigation/app-breadcrumb"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { 
  Envelope, Phone, MapPin, Clock, 
  Headphones, Package, CreditCard, Question,
  CaretRight, PaperPlaneTilt, ShieldCheck
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
    title: locale === 'bg' ? 'Свържете се с нас' : 'Contact Us',
    description: locale === 'bg' 
      ? 'Свържете се с екипа на AMZN. Ние сме тук да ви помогнем 24/7.'
      : 'Get in touch with the AMZN team. We are here to help you 24/7.',
  };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  await connection()
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('Contact')
  
  const quickHelp = [
    { icon: Package, title: t('trackOrder'), desc: t('trackOrderDesc'), href: "/account/orders" },
    { icon: CreditCard, title: t('paymentIssues'), desc: t('paymentIssuesDesc'), href: "/customer-service" },
    { icon: Question, title: t('productQuestions'), desc: t('productQuestionsDesc'), href: "/customer-service" },
  ]
  
  return (
    <div className="min-h-screen bg-background pb-20 sm:pb-12">
      {/* Hero Section */}
      <div className="bg-header-bg text-white">
        <div className="container py-10 md:py-16">
          <div className="[&_nav]:border-white/20 [&_nav]:mb-4 [&_a]:text-white/80 [&_a:hover]:text-white [&_span[aria-current]]:text-white [&_svg]:text-white/50">
            <AppBreadcrumb items={breadcrumbPresets.contact} />
          </div>
          <div className="max-w-2xl">
            <h1 className="text-2xl md:text-4xl font-bold mb-3">{t('heroTitle')}</h1>
            <p className="text-white/80 text-lg">{t('heroSubtitle')}</p>
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
                <Card className="h-full hover:shadow-md hover:border-brand/30 transition-all cursor-pointer group">
                  <CardContent className="p-5">
                    <div className="flex items-start gap-4">
                      <div className="size-12 bg-brand/10 flex items-center justify-center shrink-0 group-hover:bg-brand/20 transition-colors">
                        <item.icon className="size-6 text-brand" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="font-semibold">{item.title}</h3>
                          <CaretRight className="size-4 text-muted-foreground group-hover:text-brand transition-colors" />
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6 md:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="size-10 bg-brand/10 flex items-center justify-center">
                    <PaperPlaneTilt className="size-5 text-brand" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">{t('sendMessage')}</h2>
                    <p className="text-sm text-muted-foreground">{t('sendMessageDesc')}</p>
                  </div>
                </div>
                
                <form className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label htmlFor="name">{t('name')} <span className="text-brand-deal">*</span></Label>
                      <Input id="name" placeholder={t('namePlaceholder')} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">{t('email')} <span className="text-brand-deal">*</span></Label>
                      <Input id="email" type="email" placeholder={t('emailPlaceholder')} required />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">{t('phone')}</Label>
                    <Input id="phone" type="tel" placeholder={t('phonePlaceholder')} />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="orderNumber">{t('orderNumber')}</Label>
                    <Input id="orderNumber" placeholder={t('orderNumberPlaceholder')} />
                    <p className="text-xs text-muted-foreground">{t('orderNumberHint')}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="subject">{t('subject')} <span className="text-brand-deal">*</span></Label>
                    <select 
                      id="subject" 
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
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="message">{t('message')} <span className="text-brand-deal">*</span></Label>
                    <Textarea 
                      id="message" 
                      placeholder={t('messagePlaceholder')} 
                      className="min-h-[150px] resize-none" 
                      required 
                    />
                    <p className="text-xs text-muted-foreground">{t('messageHint')}</p>
                  </div>
                  
                  <div className="flex items-start gap-3 p-4 bg-muted">
                    <ShieldCheck className="size-5 text-brand-success shrink-0 mt-0.5" />
                    <p className="text-xs text-muted-foreground">{t('privacyNote')}</p>
                  </div>
                  
                  <Button type="submit" className="w-full sm:w-auto bg-brand hover:bg-brand-dark">
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
            <Card className="border-brand/20 bg-brand/5">
              <CardContent className="p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="size-10 bg-brand/20 flex items-center justify-center">
                    <Headphones className="size-5 text-brand" />
                  </div>
                  <div>
                    <h3 className="font-bold">{t('customerService')}</h3>
                    <p className="text-sm text-muted-foreground">{t('fastestWay')}</p>
                  </div>
                </div>
                <Link href="/customer-service">
                  <Button variant="outline" className="w-full border-brand text-brand hover:bg-brand hover:text-white">
                    {t('visitHelpCenter')}
                  </Button>
                </Link>
              </CardContent>
            </Card>
            
            {/* Email */}
            <Card>
              <CardContent className="p-5">
                <div className="flex items-center gap-4">
                  <div className="size-12 bg-brand/10 flex items-center justify-center shrink-0">
                    <Envelope className="size-6 text-brand" />
                  </div>
                  <div>
                    <h3 className="font-bold">{t('emailUs')}</h3>
                    <a href="mailto:support@amzn.bg" className="text-sm text-brand-blue hover:underline">
                      support@amzn.bg
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
                  <div className="size-12 bg-brand/10 flex items-center justify-center shrink-0">
                    <Phone className="size-6 text-brand" />
                  </div>
                  <div>
                    <h3 className="font-bold">{t('callUs')}</h3>
                    <a href="tel:+35921234567" className="text-sm text-brand-blue hover:underline">
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
                  <div className="size-12 bg-brand/10 flex items-center justify-center shrink-0">
                    <MapPin className="size-6 text-brand" />
                  </div>
                  <div>
                    <h3 className="font-bold">{t('headquarters')}</h3>
                    <p className="text-sm text-muted-foreground">
                      AMZN Bulgaria EOOD<br />
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
                  <div className="size-12 bg-brand/10 flex items-center justify-center shrink-0">
                    <Clock className="size-6 text-brand" />
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
            <CardContent className="p-6 md:p-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="size-12 bg-brand/10 flex items-center justify-center shrink-0">
                    <Question className="size-6 text-brand" />
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
    </div>
  )
}
