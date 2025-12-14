"use client"

import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Button } from "@/components/ui/button"
import { Link, useRouter, usePathname } from "@/i18n/routing"
import { useTranslations, useLocale } from "next-intl"
import { MapPin } from "@phosphor-icons/react"
import { useState } from "react"

// Language options
const LANGUAGES = [
  { code: "bg", name: "Български", short: "BG", flag: "https://flagcdn.com/w40/bg.png" },
  { code: "en", name: "English", short: "EN", flag: "https://flagcdn.com/w40/gb.png" },
] as const
interface LocationDropdownProps {
  country: string
  onCountryChange?: (code: string, name: string) => void
}

// Shipping zones - Updated December 2025: Added UK (post-Brexit)
const SHIPPING_ZONES = [
  { code: "BG", zone: "BG", name: "Bulgaria", nameLocal: "България", flag: "https://flagcdn.com/w40/bg.png", icon: "🇧🇬" },
  // Store ISO country code in cookie (GB), keep separate shipping region (UK)
  { code: "GB", zone: "UK", name: "United Kingdom", nameLocal: "Великобритания", flag: "https://flagcdn.com/w40/gb.png", icon: "🇬🇧" },
  { code: "EU", zone: "EU", name: "Europe", nameLocal: "Европа", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Flag_of_Europe.svg/40px-Flag_of_Europe.svg.png", icon: "🇪🇺" },
  { code: "US", zone: "US", name: "USA", nameLocal: "САЩ", flag: "https://flagcdn.com/w40/us.png", icon: "🇺🇸" },
  { code: "WW", zone: "WW", name: "Worldwide", nameLocal: "По целия свят", flag: null, icon: "🌍" },
] as const

export function LocationDropdown({ country, onCountryChange }: LocationDropdownProps) {
  const t = useTranslations("LocationDropdown")
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  // Find the current country's flag icon
  const currentZone = SHIPPING_ZONES.find(
    (loc) => country === loc.name || country === loc.nameLocal
  )
  const flagIcon = currentZone?.icon || "🇧🇬"
  const langFlag = locale === "bg" ? "🇧🇬" : "🇬🇧"

  const handleLocationSelect = (loc: (typeof SHIPPING_ZONES)[number]) => {
    document.cookie = `user-country=${loc.code}; max-age=${60 * 60 * 24 * 365}; path=/; samesite=lax`
    document.cookie = `user-zone=${loc.zone}; max-age=${60 * 60 * 24 * 365}; path=/; samesite=lax`

    const displayName = locale === "bg" ? loc.nameLocal : loc.name
    onCountryChange?.(loc.code, displayName)
    setIsOpen(false)

    window.location.reload()
  }

  const handleLanguageSwitch = (newLocale: string) => {
    setIsOpen(false)
    router.replace(pathname, { locale: newLocale })
  }

  return (
    <HoverCard open={isOpen} onOpenChange={setIsOpen} openDelay={50} closeDelay={100}>
      <HoverCardTrigger asChild>
        <Button
          variant="ghost"
          className="h-10 px-2 gap-1.5 rounded-md text-header-text hover:text-brand hover:bg-transparent"
          title={`${locale.toUpperCase()} / ${country}`}
        >
          <span className="text-base">{langFlag}</span>
          <span className="text-muted-foreground/60">/</span>
          <MapPin weight="fill" className="text-brand shrink-0 size-4" />
          <span className="text-sm font-medium">{country}</span>
        </Button>
      </HoverCardTrigger>
      <HoverCardContent
        className="w-[320px] p-0 bg-popover text-popover-foreground border border-border z-50 rounded-md overflow-hidden"
        align="start"
        sideOffset={8}
      >
        {/* Language Toggle */}
        <div className="p-3 border-b border-border">
          <p className="text-xs font-medium text-muted-foreground uppercase mb-2">
            {locale === "bg" ? "Език" : "Language"}
          </p>
          <div className="flex bg-muted rounded-md p-0.5">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageSwitch(lang.code)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded text-sm font-medium transition-all ${
                  lang.code === locale
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <img src={lang.flag} alt={lang.name} width={16} height={12} className="rounded-sm" />
                <span>{lang.short}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Shipping Zones */}
        <div className="p-2">
          <p className="px-3 py-2 text-xs font-medium text-muted-foreground uppercase">{t("shippingZones")}</p>
          {SHIPPING_ZONES.map((loc) => {
            const displayName = locale === "bg" ? loc.nameLocal : loc.name
            const isSelected = country === displayName || country === loc.name || country === loc.nameLocal
            return (
              <button
                key={loc.code}
                onClick={() => handleLocationSelect(loc)}
                className={`w-full flex items-center gap-3 p-3 rounded-md hover:bg-muted text-left transition-colors ${isSelected ? "bg-brand/10" : ""}`}
              >
                {loc.flag ? (
                  <img src={loc.flag} alt={loc.name} width={32} height={22} className="rounded-sm border border-border" />
                ) : (
                  <span className="text-2xl w-8 text-center">{loc.icon}</span>
                )}
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{loc.name}</p>
                  <p className="text-xs text-muted-foreground">{loc.nameLocal}</p>
                </div>
                {isSelected && <div className="w-2 h-2 bg-brand rounded-full" />}
              </button>
            )
          })}
        </div>

        <div className="p-3 bg-muted border-t border-border">
          <Link href="/account/addresses">
            <Button className="w-full h-9 text-sm bg-cta-trust-blue hover:bg-cta-trust-blue-hover text-cta-trust-blue-text">
              {t("manageAddresses")}
            </Button>
          </Link>
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}
