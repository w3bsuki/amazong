"use client"

import { useRouter, usePathname } from "@/i18n/routing"
import { useLocale } from "next-intl"
import { Button } from "@/components/ui/button"
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card"
import { Globe } from "lucide-react"

const locales = [
    { code: 'bg', name: 'Български', flag: '🇧🇬' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
] as const

export function LanguageSwitcher() {
    const router = useRouter()
    const pathname = usePathname()
    const locale = useLocale()

    const currentLocale = locales.find(l => l.code === locale) || locales[0]

    const switchLocale = (newLocale: string) => {
        router.replace(pathname, { locale: newLocale })
    }

    return (
        <HoverCard openDelay={100} closeDelay={200}>
            <HoverCardTrigger asChild>
                <Button
                    variant="ghost"
                    className="flex items-center gap-1.5 p-2 border border-transparent hover:border-header-text/20 rounded-md text-header-text hover:bg-header-text/10"
                >
                    <Globe className="h-4 w-4" />
                    <span className="text-sm font-medium">{currentLocale.code.toUpperCase()}</span>
                </Button>
            </HoverCardTrigger>
            <HoverCardContent align="end" sideOffset={8} className="w-40 p-1 bg-popover text-popover-foreground border-none shadow-xl rounded-md">
                {locales.map((loc) => (
                    <button
                        key={loc.code}
                        onClick={() => switchLocale(loc.code)}
                        className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
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
