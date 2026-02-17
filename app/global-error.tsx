"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { RefreshCw as ArrowClockwise, CircleAlert as WarningCircle } from "lucide-react";

import {
  NextIntlClientProvider,
  useTranslations,
  type AbstractIntlMessages,
} from "next-intl"
import enMessages from "@/messages/en.json"
import bgMessages from "@/messages/bg.json"
import { isValidLocale, type Locale, routing } from "@/i18n/routing"

const messagesByLocale: Record<Locale, unknown> = {
  en: enMessages,
  bg: bgMessages,
}

function getLocaleFromPathname(pathname: string): Locale {
  const seg = pathname.split("/")[1]
  return seg && isValidLocale(seg) ? seg : routing.defaultLocale
}

function GlobalErrorContent({
  error,
  reset,
  locale,
}: {
  error: Error & { digest?: string }
  reset: () => void
  locale: Locale
}) {
  const t = useTranslations("GlobalError")

  useEffect(() => {
    console.error("[global-error]", error.digest ?? "no-digest")
  }, [error])

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-background p-4">
      <div className="mx-auto max-w-md text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-card ring-1 ring-destructive">
          <WarningCircle className="h-10 w-10 text-destructive" />
        </div>
        <h1 className="mb-2 text-2xl font-bold tracking-tight">{t("title")}</h1>
        <p className="mb-6 text-muted-foreground">
          {t("description")}
          {error.digest && (
            <span className="mt-2 block text-xs">{t("errorId", { id: error.digest })}</span>
          )}
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button onClick={reset} variant="default">
            <ArrowClockwise className="mr-2 h-4 w-4" />
            {t("tryAgain")}
          </Button>
          <Button variant="outline" onClick={() => (window.location.href = `/${locale}`)}>
            {t("goToHomepage")}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const locale =
    typeof window === "undefined"
      ? routing.defaultLocale
      : getLocaleFromPathname(window.location.pathname)

  return (
    <html lang={locale}>
      <body className="bg-background text-foreground">
        <NextIntlClientProvider
          locale={locale}
          messages={messagesByLocale[locale] as AbstractIntlMessages}
        >
          <GlobalErrorContent error={error} reset={reset} locale={locale} />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
