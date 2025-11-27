import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Package, RefreshCw, CreditCard, User, Shield, HelpCircle, Search } from "lucide-react"
import Link from "next/link"
import { getTranslations } from "next-intl/server"
import { AppBreadcrumb, breadcrumbPresets } from "@/components/app-breadcrumb"

export default async function CustomerServicePage() {
    const t = await getTranslations('CustomerService')

    const helpTopics = [
        { icon: Package, title: t('delivery') },
        { icon: RefreshCw, title: t('prime') },
        { icon: CreditCard, title: t('payment') },
        { icon: User, title: t('address') },
        { icon: Shield, title: t('memberships') },
        { icon: HelpCircle, title: t('accessibility') },
        { icon: HelpCircle, title: t('somethingElse') },
        { icon: HelpCircle, title: t('loginPassword') },
        { icon: HelpCircle, title: t('ebooks') },
    ]

    return (
        <div className="min-h-screen bg-background pb-12">
            <div className="container py-8">
                <AppBreadcrumb items={breadcrumbPresets.customerService} />
                
                <h1 className="text-3xl font-bold mb-8">{t('title')}</h1>

                <div className="mb-12">
                    <h2 className="text-xl font-bold mb-4">{t('helpTitle')}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {helpTopics.map((topic, i) => (
                            <Card key={i} className="hover:bg-muted cursor-pointer transition-colors">
                                <CardContent className="flex items-center p-4 gap-4">
                                    <div className="bg-secondary p-2 rounded-full">
                                        <topic.icon className="w-8 h-8 text-muted-foreground" />
                                    </div>
                                    <span className="font-medium text-foreground">{topic.title}</span>
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

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
                        <div className="bg-muted p-6 rounded-lg border border-border">
                            <h3 className="font-bold text-lg mb-4">{t('contactUs')}</h3>
                            <p className="text-sm text-muted-foreground mb-4">
                                {t('needMoreHelp')}
                            </p>
                            <Button className="w-full bg-brand hover:bg-brand/90 text-foreground border border-brand-dark">
                                {t('startChatting')}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
