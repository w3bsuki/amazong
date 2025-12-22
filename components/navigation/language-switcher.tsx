"use client"

import { useRouter, usePathname } from "@/i18n/routing"
import { useLocale } from "next-intl"
import { Button } from "@/components/ui/button"
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card"
import { Globe } from "@phosphor-icons/react"

const locales = [
    { code: 'bg', name: 'Български', flag: 'https://flagcdn.com/w40/bg.png' },
    { code: 'en', name: 'English', flag: 'https://flagcdn.com/w40/gb.png' },
] as const

export function LanguageSwitcher() {
    const router = useRouter()
    const pathname = usePathname()
    const locale = useLocale()

    const currentLocale = locales.find(l => l.code === locale) || locales[1]

    const switchLocale = (newLocale: string) => {
        router.replace(pathname, { locale: newLocale })
    }

    // Flag emoji for compact display
    const flagEmoji = currentLocale.code === 'bg' ? '🇧🇬' : '🇬🇧'

    return (
        <HoverCard openDelay={50} closeDelay={100}>
            <HoverCardTrigger asChild>
                <Button
                    variant="ghost"
                    className="h-11 px-2.5 gap-1 border border-transparent hover:border-header-text/20 rounded-md text-header-text hover:text-brand hover:bg-header-hover"
                    title={currentLocale.name}
                >
                    <Globe weight="regular" className="shrink-0 size-5" />
                    <span className="text-lg">{flagEmoji}</span>
                </Button>
            </HoverCardTrigger>
            <HoverCardContent align="start" sideOffset={8} className="w-44 p-1 bg-popover text-popover-foreground border border-border rounded-sm">
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
                        <img 
                            src={loc.flag} 
                            alt={loc.name} 
                            width={20} 
                            height={14} 
                            className="rounded-sm"
                        />
                        <span>{loc.name}</span>
                        {loc.code === locale && (
                            <span className="ml-auto text-verified">✓</span>
                        )}
                    </button>
                ))}
            </HoverCardContent>
        </HoverCard>
    )
}
