"use client"

import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Button } from "@/components/ui/button"
import { Link } from "@/i18n/routing"
import { useTranslations, useLocale } from "next-intl"
import Image from "next/image"
import { MapPin } from "@phosphor-icons/react"
import { useState } from "react"
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
  const tNav = useTranslations("Navigation")
  const locale = useLocale()
  const [isOpen, setIsOpen] = useState(false)

  const handleLocationSelect = (loc: (typeof SHIPPING_ZONES)[number]) => {
    document.cookie = `user-country=${loc.code}; max-age=${60 * 60 * 24 * 365}; path=/; samesite=lax`
    document.cookie = `user-zone=${loc.zone}; max-age=${60 * 60 * 24 * 365}; path=/; samesite=lax`

    const displayName = locale === "bg" ? loc.nameLocal : loc.name
    onCountryChange?.(loc.code, displayName)
    setIsOpen(false)

    window.location.reload()
  }

  return (
    <HoverCard open={isOpen} onOpenChange={setIsOpen} openDelay={50} closeDelay={100}>
      <HoverCardTrigger asChild>
        <Button
          variant="ghost"
          className="h-10 px-2 gap-1.5 rounded-md text-header-text hover:text-header-text hover:bg-transparent"
          title={`${tNav("deliverTo")}: ${country}`}
        >
          <MapPin weight="fill" className="text-brand shrink-0 size-4" />
          <span className="text-xs font-semibold text-header-text/90 truncate max-w-32">{country}</span>
        </Button>
      </HoverCardTrigger>
      <HoverCardContent
        className="w-[320px] p-0 bg-popover text-popover-foreground border border-border z-50 rounded-md overflow-hidden"
        align="start"
        sideOffset={8}
      >
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
                className={`w-full flex items-center gap-3 p-3 rounded-md hover:bg-muted text-left ${isSelected ? "bg-brand/10" : ""}`}
              >
                {loc.flag ? (
                  <Image
                    src={loc.flag}
                    alt={loc.name}
                    width={32}
                    height={22}
                    sizes="32px"
                    className="rounded-sm border border-border"
                  />
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
