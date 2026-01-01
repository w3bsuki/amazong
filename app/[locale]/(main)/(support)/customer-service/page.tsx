import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Package, ArrowsClockwise, CreditCard, User, Shield, Question, MagnifyingGlass as Search } from "@phosphor-icons/react/dist/ssr"
import { Link } from "@/i18n/routing"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { AppBreadcrumb, breadcrumbPresets } from "@/components/navigation/app-breadcrumb"
import type { Metadata } from 'next'
import { routing, validateLocale } from "@/i18n/routing"
import { CustomerServiceChat } from "@/components/support/customer-service-chat"

// Generate static params for all locales - required for Next.js 16 Cache Components
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = validateLocale(localeParam)
  setRequestLocale(locale)
  return {
    title: locale === 'bg' ? 'Обслужване на клиенти' : 'Customer Service',
    description: locale === 'bg' 
      ? 'Получете помощ с вашите поръчки, връщания и акаунт.'
      : 'Get help with your orders, returns, and account.',
  };
}

export default async function CustomerServicePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: localeParam } = await params
  const locale = validateLocale(localeParam)
  
  // Enable static rendering for this locale
  setRequestLocale(locale)
  
  const t = await getTranslations('CustomerService')

    const helpTopics = [
        { icon: Package, title: t('delivery') },
        { icon: CreditCard, title: t('payment') },
        { icon: User, title: t('address') },
        { icon: Shield, title: t('memberships') },
        { icon: Question, title: t('accessibility') },
        { icon: Question, title: t('somethingElse') },
        { icon: Question, title: t('loginPassword') },
    ]

    return (
        <div className="min-h-screen bg-background pb-12 overflow-x-hidden">
            <div className="container py-8 px-4 sm:px-6">
                <AppBreadcrumb items={breadcrumbPresets.customerService} />
                
                <h1 className="text-3xl font-bold mb-8">{t('title')}</h1>

                <div className="mb-12">
                    <h2 className="text-xl font-bold mb-4">{t('helpTitle')}</h2>
                    <div className="grid grid-cols-1 xs:grid-cols-2 gap-2 sm:gap-4 md:grid-cols-3">
                        {helpTopics.map((topic, i) => (
                            <Card key={i} className="hover:bg-muted cursor-pointer transition-colors overflow-hidden">
                                <CardContent className="flex items-center p-3 sm:p-4 gap-2 sm:gap-4">
                                    <div className="bg-secondary p-2 rounded-full shrink-0">
                                        <topic.icon className="w-6 h-6 sm:w-8 sm:h-8 text-muted-foreground" />
                                    </div>
                                    <span className="font-medium text-foreground text-sm sm:text-base line-clamp-2 break-words">{topic.title}</span>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                <div className="mb-12">
                    <h2 className="text-xl font-bold mb-4">{t('searchTitle')}</h2>
                    <div className="relative max-w-2xl">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            className="pl-10 h-12 text-lg border-input"
                            placeholder={t('searchPlaceholder')}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="col-span-2">
                        <h2 className="text-xl font-bold mb-4">{t('allHelpTopics')}</h2>
                        <div className="space-y-4">
                            <details className="group border border-border rounded-lg">
                                <summary className="flex justify-between items-center font-medium cursor-pointer list-none p-4 bg-muted group-open:bg-background">
                                    <span>{t('recommended')}</span>
                                    <span className="transition group-open:rotate-180">
                                        <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                                    </span>
                                </summary>
                                <div className="text-muted-foreground p-4 pt-0">
                                    <ul className="space-y-2">
                                        <li><Link href="#" className="text-link hover:underline">{t('wheresMy')}</Link></li>
                                        <li><Link href="#" className="text-link hover:underline">{t('shipping')}</Link></li>
                                        <li><Link href="#" className="text-link hover:underline">{t('returns')}</Link></li>
                                    </ul>
                                </div>
                            </details>
                            <details className="group border border-border rounded-lg">
                                <summary className="flex justify-between items-center font-medium cursor-pointer list-none p-4 bg-muted group-open:bg-background">
                                    <span>{t('wheresMy')}</span>
                                    <span className="transition group-open:rotate-180">
                                        <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                                    </span>
                                </summary>
                                <div className="text-muted-foreground p-4 pt-0">
                                    <p className="mb-2">{t('trackOrders')}</p>
                                    <Button variant="outline" className="w-full justify-start">{t('goToOrders')}</Button>
                                </div>
                            </details>
                        </div>
                    </div>

                    <div>
                        <div className="bg-muted p-4 rounded-lg border border-border">
                            <h3 className="font-bold text-lg mb-4">{t('contactUs')}</h3>
                            <p className="text-sm text-muted-foreground mb-4">
                                {t('needMoreHelp')}
                            </p>
                            <CustomerServiceChat />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
