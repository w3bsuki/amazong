"use client"

import * as React from "react"
import { useLocale, useTranslations } from "next-intl"
import { useSearchParams } from "next/navigation"
import { Link, usePathname } from "@/i18n/routing"
import { Check as IconCheck, Languages as IconLanguage } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface LocaleSwitcherProps {
  className?: string
  align?: "start" | "center" | "end"
}

export function LocaleSwitcher({ className, align = "end" }: LocaleSwitcherProps) {
  const t = useTranslations("LocaleSwitcher")
  const locale = useLocale()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const search = searchParams?.toString()
  const href = search ? `${pathname}?${search}` : pathname

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className={cn("gap-2", className)} aria-label={t("label")}>
          <IconLanguage className="size-4" />
          <span className="hidden sm:inline">
            {locale === "bg" ? t("bulgarian") : t("english")}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align} className="min-w-36">
        <DropdownMenuItem asChild>
          <Link href={href} locale="en" className="flex items-center gap-2">
            <span className="text-sm font-medium">{t("english")}</span>
            {locale === "en" && <IconCheck className="ml-auto size-4 text-primary" />}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={href} locale="bg" className="flex items-center gap-2">
            <span className="text-sm font-medium">{t("bulgarian")}</span>
            {locale === "bg" && <IconCheck className="ml-auto size-4 text-primary" />}
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
