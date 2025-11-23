"use client"

import { Link } from "@/i18n/routing"
import { useTranslations } from "next-intl"

export function SiteFooter() {
    const t = useTranslations('Footer')
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" })
    }

    const currentYear = new Date().getFullYear()

    return (
        <footer className="bg-slate-800 text-slate-300 mt-auto w-full">
            {/* Back to Top */}
            <div
                className="bg-slate-700 py-3 text-center hover:bg-slate-600 transition-colors cursor-pointer"
                onClick={scrollToTop}
            >
                <span className="text-sm font-medium text-white">{t('backToTop')}</span>
            </div>

            {/* Footer Links */}
            <div className="max-w-[1000px] mx-auto py-12 px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">
                <div className="space-y-3">
                    <h4 className="font-bold text-white mb-2">{t('getToKnow')}</h4>
                    <Link href="#" className="block hover:underline text-xs text-slate-400 hover:text-white transition-colors">
                        {t('careers')}
                    </Link>
                    <Link href="#" className="block hover:underline text-xs text-slate-400 hover:text-white transition-colors">
                        {t('blog')}
                    </Link>
                    <Link href="#" className="block hover:underline text-xs text-slate-400 hover:text-white transition-colors">
                        {t('aboutUs')}
                    </Link>
                </div>

                <div className="space-y-3">
                    <h4 className="font-bold text-white mb-2">{t('makeMoney')}</h4>
                    <Link href="/sell" className="block hover:underline text-xs text-slate-400 hover:text-white transition-colors">
                        {t('sellProducts')}
                    </Link>
                    <Link href="#" className="block hover:underline text-xs text-slate-400 hover:text-white transition-colors">
                        {t('becomeAffiliate')}
                    </Link>
                </div>

                <div className="space-y-3">
                    <h4 className="font-bold text-white mb-2">{t('payment')}</h4>
                    <Link href="#" className="block hover:underline text-xs text-slate-400 hover:text-white transition-colors">
                        {t('businessCard')}
                    </Link>
                    <Link href="#" className="block hover:underline text-xs text-slate-400 hover:text-white transition-colors">
                        {t('shopPoints')}
                    </Link>
                </div>

                <div className="space-y-3">
                    <h4 className="font-bold text-white mb-2">{t('helpYou')}</h4>
                    <Link href="/account" className="block hover:underline text-xs text-slate-400 hover:text-white transition-colors">
                        {t('yourAccount')}
                    </Link>
                    <Link href="/account/orders" className="block hover:underline text-xs text-slate-400 hover:text-white transition-colors">
                        {t('yourOrders')}
                    </Link>
                    <Link href="/customer-service" className="block hover:underline text-xs text-slate-400 hover:text-white transition-colors">
                        {t('help')}
                    </Link>
                </div>
            </div>

            {/* Copyright */}
            <div className="border-t border-slate-700 py-8 text-center">
                <span className="text-lg font-semibold text-white tracking-tighter">AMZN</span>
                <p className="text-xs mt-2 text-slate-500">{t('copyright', { year: currentYear })}</p>
            </div>
        </footer>
    )
}
