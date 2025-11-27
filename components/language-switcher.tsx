"use client"

import { useRouter, usePathname } from "@/i18n/routing"
import { useLocale, useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card"

const locales = [
    { code: 'bg', name: 'Български', flag: '🇧🇬' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
] as const

export function LanguageSwitcher() {
    const router = useRouter()
    const pathname = usePathname()
    const locale = useLocale()
    const t = useTranslations('Navigation')

    const currentLocale = locales.find(l => l.code === locale) || locales[1]

    const switchLocale = (newLocale: string) => {
        router.replace(pathname, { locale: newLocale })
    }

    return (
        <HoverCard openDelay={50} closeDelay={100}>
            <HoverCardTrigger asChild>
                <Button
                    variant="ghost"
                    className="h-12 flex flex-col items-start leading-none gap-0 p-2 px-3 border border-transparent hover:border-header-text/20 rounded-sm text-header-text hover:text-brand group"
                >
                    <span className="text-[10px] text-header-text-muted group-hover:text-brand">{t('language')}</span>
                    <span className="text-sm font-bold mt-0.5">{currentLocale.name}</span>
                </Button>
            </HoverCardTrigger>
            <HoverCardContent align="start" sideOffset={8} className="w-44 p-1 bg-popover text-popover-foreground border-none shadow-xl rounded-sm">
                {locales.map((loc) => (
                    <button
                        key={loc.code}
                        onClick={() => switchLocale(loc.code)}
                        className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-sm text-sm transition-colors ${
                            loc.code === locale 
                                ? 'bg-brand/10 text-brand font-medium' 
                                : 'text-foreground hover:bg-muted'
                        }`}
                    >
                        <span>{loc.flag}</span>
                        <span>{loc.name}</span>
                        {loc.code === locale && (
                            <span className="ml-auto text-brand-success">✓</span>
                        )}
                    </button>
                ))}
            </HoverCardContent>
        </HoverCard>
    )
}
