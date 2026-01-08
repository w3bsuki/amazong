"use client"

import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Button } from "@/components/ui/button"
import { Link } from "@/i18n/routing"
import { useLocale, useTranslations } from "next-intl"
import Image from "next/image"
import { Languages } from "lucide-react"
import { MapPin, Check } from "@phosphor-icons/react"
import { useState } from "react"

interface LocaleDeliveryDropdownProps {
  /** Locale-stripped pathname from `usePathname()` in `@/i18n/routing`. */
  pathname: string
  country: string
  onCountryChange?: (code: string, name: string) => void
  className?: string
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

export function LocaleDeliveryDropdown({ pathname, country, onCountryChange, className }: LocaleDeliveryDropdownProps) {
  const locale = useLocale()
  const tNav = useTranslations("Navigation")
  const tLocation = useTranslations("LocationDropdown")
  const [isOpen, setIsOpen] = useState(false)

  const currentLabel = locale === "bg" ? "BG" : "EN"

  const handleLocationSelect = (loc: (typeof SHIPPING_ZONES)[number]) => {
    document.cookie = `user-country=${loc.code}; max-age=${60 * 60 * 24 * 365}; path=/; samesite=lax`
    document.cookie = `user-zone=${loc.zone}; max-age=${60 * 60 * 24 * 365}; path=/; samesite=lax`

    const displayName = locale === "bg" ? loc.nameLocal : loc.name
    onCountryChange?.(loc.code, displayName)
    setIsOpen(false)

    window.location.reload()
  }

  return (
    <HoverCard open={isOpen} onOpenChange={setIsOpen} openDelay={100} closeDelay={200}>
      <HoverCardTrigger asChild>
        <Button
          variant="ghost"
          className={[
            "h-11 px-3 text-xs font-semibold border border-transparent hover:border-header-text/20 rounded-md text-header-text hover:text-header-text hover:bg-header-hover transition-all",
            className,
          ]
            .filter(Boolean)
            .join(" ")}
          data-testid="language-switcher"
          aria-label={tNav("language")}
          title={`${currentLabel} · ${country}`}
        >
          <div className="flex items-center gap-1.5" aria-hidden="true">
            <div className="flex items-center justify-center text-header-text/90">
              <MapPin weight="regular" className="size-4" />
            </div>
            <div className="flex flex-col items-start leading-none gap-0.5">
              <span className="text-2xs text-header-text/70 font-normal">
                {tNav("deliverTo")}
              </span>
              <span className="text-xs font-bold truncate max-w-20 lg:max-w-32">
                {country}
              </span>
            </div>
          </div>
        </Button>
      </HoverCardTrigger>

      <HoverCardContent
        className="w-(--container-dropdown-sm) p-0 bg-popover text-popover-foreground border border-border z-50 rounded-md overflow-hidden"
        align="start"
        sideOffset={8}
      >
        <div className="flex items-center gap-2 p-4 bg-muted border-b border-border">
          <div className="flex items-center gap-1.5" aria-hidden="true">
            <Languages className="size-4 text-muted-foreground" />
            <MapPin weight="fill" className="size-4 text-muted-foreground" />
          </div>
          <h3 className="font-semibold text-base text-foreground">{tNav("language") + " & " + tNav("deliverTo")}</h3>
        </div>

        {/* Language */}
        <div className="p-2">
          <p className="px-3 py-2 text-xs font-medium text-muted-foreground uppercase">{tNav("language")}</p>
          <div className="grid grid-cols-2 gap-2 px-2">
            <Link
              href={pathname || "/"}
              locale="bg"
              className={[
                "flex items-center justify-between gap-2 px-3 py-2 rounded-md hover:bg-muted text-sm border border-transparent transition-colors",
                locale === "bg" ? "bg-accent/30 border-border" : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              <div className="flex items-center gap-2">
                <span className={locale === "bg" ? "font-medium text-foreground" : "text-muted-foreground"}>Български</span>
                {locale === "bg" && <Check weight="bold" className="size-3.5 text-primary" />}
              </div>
              <span className="text-xs text-muted-foreground">BG</span>
            </Link>
            <Link
              href={pathname || "/"}
              locale="en"
              className={[
                "flex items-center justify-between gap-2 px-3 py-2 rounded-md hover:bg-muted text-sm border border-transparent transition-colors",
                locale === "en" ? "bg-accent/30 border-border" : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              <div className="flex items-center gap-2">
                <span className={locale === "en" ? "font-medium text-foreground" : "text-muted-foreground"}>English</span>
                {locale === "en" && <Check weight="bold" className="size-3.5 text-primary" />}
              </div>
              <span className="text-xs text-muted-foreground">EN</span>
            </Link>
          </div>
        </div>

        <div className="h-px bg-border" />

        {/* Delivery */}
        <div className="p-2">
          <p className="px-3 py-2 text-xs font-medium text-muted-foreground uppercase">{tNav("deliverTo")}</p>
          {SHIPPING_ZONES.map((loc) => {
            const displayName = locale === "bg" ? loc.nameLocal : loc.name
            const isSelected = country === displayName || country === loc.name || country === loc.nameLocal
            return (
              <button
                key={loc.code}
                onClick={() => handleLocationSelect(loc)}
                className={
                  "w-full flex items-center gap-3 p-3 rounded-md hover:bg-muted text-left " +
                  (isSelected ? "bg-brand/10" : "")
                }
              >
                {loc.flag ? (
                  <Image
                    src={loc.flag}
                    alt={loc.name}
                    width={24}
                    height={16}
                    sizes="24px"
                    className="rounded-sm border border-border"
                  />
                ) : (
                  <span className="text-lg w-6 text-center">{loc.icon}</span>
                )}
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground leading-tight">{loc.name}</p>
                  <p className="text-xs text-muted-foreground leading-tight">{loc.nameLocal}</p>
                </div>
                {isSelected && <div className="w-2 h-2 bg-brand rounded-full" />}
              </button>
            )
          })}
        </div>

        <div className="p-3 bg-muted border-t border-border">
          <Link href="/account/addresses">
            <Button className="w-full h-9 text-sm bg-cta-trust-blue hover:bg-cta-trust-blue-hover text-cta-trust-blue-text">
              {tLocation("manageAddresses")}
            </Button>
          </Link>
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}
