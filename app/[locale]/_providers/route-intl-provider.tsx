import type { ReactNode } from "react"

import { IntlClientProvider } from "./intl-client-provider"
import { getAllMessages, getScopedMessages, type IntlNamespace } from "@/lib/i18n/scoped-messages"

interface RouteIntlProviderProps {
  locale: string
  namespaces: readonly IntlNamespace[]
  children: ReactNode
}

export async function RouteIntlProvider({ locale, namespaces, children }: RouteIntlProviderProps) {
  const messages = await getScopedMessages(locale, namespaces)

  return (
    <IntlClientProvider locale={locale} messages={messages}>
      {children}
    </IntlClientProvider>
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
    <IntlClientProvider locale={locale} messages={messages}>
      {children}
    </IntlClientProvider>
  )
}
