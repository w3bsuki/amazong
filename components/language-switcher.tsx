"use client"

import { useRouter, usePathname } from "@/i18n/routing"
import { useLocale } from "next-intl"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    className="flex items-center gap-1.5 p-2 border border-transparent hover:border-white/20 rounded transition-colors duration-200 text-white"
                >
                    <Globe className="h-4 w-4" />
                    <span className="text-sm font-medium">{currentLocale.code.toUpperCase()}</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white text-slate-900">
                {locales.map((loc) => (
                    <DropdownMenuItem
                        key={loc.code}
                        onClick={() => switchLocale(loc.code)}
                        className="cursor-pointer hover:bg-slate-100"
                    >
                        <span className="mr-2">{loc.flag}</span>
                        <span>{loc.name}</span>
                        {loc.code === locale && (
                            <span className="ml-auto text-amber-600">✓</span>
                        )}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
