"use client"

import { Languages } from "lucide-react"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Button } from "@/components/ui/button"
import { Link } from "@/i18n/routing"
import { useLocale, useTranslations } from "next-intl"

interface LanguageDropdownProps {
  /** Locale-stripped pathname from `usePathname()` in `@/i18n/routing`. */
  pathname: string
  className?: string
}

export function LanguageDropdown({ pathname, className }: LanguageDropdownProps) {
  const locale = useLocale()
  const tNav = useTranslations("Navigation")

  const currentLabel = locale === "bg" ? "BG" : "EN"

  return (
    <HoverCard openDelay={100} closeDelay={200}>
      <HoverCardTrigger asChild>
        <Button
          variant="ghost"
          className={
            "h-11 px-2.5 text-xs font-semibold border border-transparent hover:border-header-text/20 rounded-md text-header-text hover:text-header-text hover:bg-header-hover gap-2 " +
            (className ?? "")
          }
          data-testid="language-switcher"
          aria-label={tNav("language")}
        >
          <Languages className="size-4" aria-hidden="true" />
          <span className="tabular-nums">{currentLabel}</span>
        </Button>
      </HoverCardTrigger>

      <HoverCardContent
        className="w-56 p-0 bg-popover text-popover-foreground border border-border z-50 rounded-md overflow-hidden"
        align="start"
        sideOffset={8}
      >
        <div className="flex items-center gap-2 p-4 bg-muted border-b border-border">
          <Languages className="size-4 text-muted-foreground" aria-hidden="true" />
          <h3 className="font-semibold text-base text-foreground">{tNav("language")}</h3>
        </div>

        <div className="p-2">
          <Link
            href={pathname || "/"}
            locale="bg"
            className={
              "flex items-center justify-between gap-2 px-3 py-2 rounded-md hover:bg-muted text-sm " +
              (locale === "bg" ? "bg-accent/30" : "")
            }
          >
            <span>Български</span>
            <span className="text-xs text-muted-foreground">BG</span>
          </Link>
          <Link
            href={pathname || "/"}
            locale="en"
            className={
              "flex items-center justify-between gap-2 px-3 py-2 rounded-md hover:bg-muted text-sm " +
              (locale === "en" ? "bg-accent/30" : "")
            }
          >
            <span>English</span>
            <span className="text-xs text-muted-foreground">EN</span>
          </Link>
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}
