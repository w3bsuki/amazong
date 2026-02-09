import type { ReactNode } from 'react'
import { getMessages } from 'next-intl/server'

import { ThemeProvider } from './_providers/theme-provider'
import { IntlClientProvider } from './_providers/intl-client-provider'

export default async function LocaleProviders({
  locale,
  children,
}: {
  locale: string
  children: ReactNode
}) {
  // Providing all messages to the client side
  const messages = await getMessages()

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
