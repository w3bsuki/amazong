import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Gift, Mail, Printer, CreditCard } from "lucide-react"
import { getTranslations } from "next-intl/server"
import { AppBreadcrumb, breadcrumbPresets } from "@/components/app-breadcrumb"

export default async function GiftCardsPage() {
    const t = await getTranslations('GiftCards')

    return (
        <div className="min-h-screen bg-muted pb-12">
            {/* Breadcrumb */}
            <div className="container pt-4">
                <AppBreadcrumb items={breadcrumbPresets.giftCards} />
            </div>
            
            {/* Hero Banner */}
            <div className="bg-header-bg text-header-text py-8 px-4">
                <div className="container">
                    <h1 className="text-3xl font-bold mb-4">{t('title')}</h1>
                    <div className="flex gap-4 overflow-x-auto pb-2">
                        <Button variant="secondary" className="bg-background text-foreground hover:bg-muted rounded-full px-6">
                            {t('allGiftCards')}
                        </Button>
                        <Button variant="ghost" className="text-header-text hover:bg-header-text/10 rounded-full px-6">
                            {t('eGiftCards')}
                        </Button>
                        <Button variant="ghost" className="text-header-text hover:bg-header-text/10 rounded-full px-6">
                            {t('printAtHome')}
                        </Button>
                        <Button variant="ghost" className="text-header-text hover:bg-header-text/10 rounded-full px-6">
                            {t('mail')}
                        </Button>
                    </div>
                </div>
            </div>

            <div className="container py-8">
                {/* Quick Actions */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                    <Card className="hover:border-brand cursor-pointer transition-colors">
                        <CardContent className="flex flex-col items-center justify-center p-6 space-y-4">
                            <Mail className="w-12 h-12 text-link" />
                            <span className="font-bold text-center">{t('eGiftCards')}</span>
                        </CardContent>
                    </Card>
                    <Card className="hover:border-brand cursor-pointer transition-colors">
                        <CardContent className="flex flex-col items-center justify-center p-6 space-y-4">
                            <Printer className="w-12 h-12 text-link" />
                            <span className="font-bold text-center">{t('printAtHome')}</span>
                        </CardContent>
                    </Card>
                    <Card className="hover:border-brand cursor-pointer transition-colors">
                        <CardContent className="flex flex-col items-center justify-center p-6 space-y-4">
                            <Gift className="w-12 h-12 text-link" />
                            <span className="font-bold text-center">{t('mail')}</span>
                        </CardContent>
                    </Card>
                    <Card className="hover:border-brand cursor-pointer transition-colors">
                        <CardContent className="flex flex-col items-center justify-center p-6 space-y-4">
                            <CreditCard className="w-12 h-12 text-link" />
                            <span className="font-bold text-center">{t('reloadBalance')}</span>
                        </CardContent>
                    </Card>
                </div>

                {/* Featured Designs */}
                <h2 className="text-2xl font-bold mb-6">{t('popularGiftCards')}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                        <div key={i} className="group cursor-pointer">
                            <div className="aspect-[1.6] bg-gradient-to-br from-header-bg to-header-nav-bg rounded-lg mb-2 relative overflow-hidden group-hover:opacity-90 transition-opacity">
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-header-text font-bold text-xl">Amazon</span>
                                    <span className="text-brand ml-1">{t('smile')}</span>
                                </div>
                            </div>
                            <p className="font-medium text-sm hover:text-link-hover hover:underline">{t('giftCard')}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
