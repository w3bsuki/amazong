import type { ReactNode } from 'react'

import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { NextIntlClientProvider } from 'next-intl'
import { ROOT_INTL_NAMESPACES, getScopedMessages } from '@/lib/i18n/scoped-messages'
import { AuthStateManager } from '@/components/providers/auth-state-manager'

export default async function LocaleProviders({
  locale,
  children,
}: {
  locale: string
  children: ReactNode
}) {
  const messages = await getScopedMessages(locale, ROOT_INTL_NAMESPACES)

  return (
    <NextIntlClientProvider locale={locale} messages={messages} timeZone="Europe/Sofia">
      <NextThemesProvider
        attribute="class"
        defaultTheme="light"
        enableSystem={false}
        storageKey="treido-theme"
        disableTransitionOnChange
      >
        <AuthStateManager>{children}</AuthStateManager>
      </NextThemesProvider>
    </NextIntlClientProvider>
  )
}
