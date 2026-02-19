import type { ReactNode } from "react"

import { NextIntlClientProvider } from "next-intl"
import { getAllMessages, getScopedMessages, type IntlNamespace } from "@/lib/i18n/scoped-messages"

interface RouteIntlProviderProps {
  locale: string
  namespaces: readonly IntlNamespace[]
  children: ReactNode
}

export async function RouteIntlProvider({ locale, namespaces, children }: RouteIntlProviderProps) {
  const messages = await getScopedMessages(locale, namespaces)

  return (
    <NextIntlClientProvider locale={locale} messages={messages} timeZone="Europe/Sofia">
      {children}
    </NextIntlClientProvider>
  )
}

export async function FullRouteIntlProvider({
  locale,
  children,
}: {
  locale: string
  children: ReactNode
}) {
  const messages = await getAllMessages(locale)

  return (
    <NextIntlClientProvider locale={locale} messages={messages} timeZone="Europe/Sofia">
      {children}
    </NextIntlClientProvider>
  )
}
