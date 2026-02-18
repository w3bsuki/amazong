import type { ReactNode } from 'react'

import { ThemeProvider } from './_providers/theme-provider'
import { IntlClientProvider } from './_providers/intl-client-provider'
import { ROOT_INTL_NAMESPACES, getScopedMessages } from '@/lib/i18n/scoped-messages'

export default async function LocaleProviders({
  locale,
  children,
}: {
  locale: string
  children: ReactNode
}) {
  const messages = await getScopedMessages(locale, ROOT_INTL_NAMESPACES)

  return (
    <IntlClientProvider locale={locale} messages={messages}>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem={false}
        storageKey="treido-theme"
        disableTransitionOnChange
      >
        {children}
      </ThemeProvider>
    </IntlClientProvider>
  )
}
