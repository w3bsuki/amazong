import type { ReactNode } from 'react'
import { getMessages, setRequestLocale } from 'next-intl/server'

import { ThemeProvider } from '@/components/providers/theme-provider'
import { IntlClientProvider } from './intl-client-provider'
import { AuthStateManager } from '@/components/providers/auth-state-manager'
import { CartProvider } from '@/components/providers/cart-context'
import { WishlistProvider } from '@/components/providers/wishlist-context'
import { MessageProvider } from '@/components/providers/message-context'
import { CurrencyProvider } from '@/components/providers/currency-context'

export default async function LocaleProviders({
  locale,
  children,
}: {
  locale: string
  children: ReactNode
}) {
  // Enable static rendering - CRITICAL for Next.js 16+ with cacheComponents
  setRequestLocale(locale)

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
        <AuthStateManager>
          <MessageProvider>
            <CurrencyProvider>
              <CartProvider>
                <WishlistProvider>{children}</WishlistProvider>
              </CartProvider>
            </CurrencyProvider>
          </MessageProvider>
        </AuthStateManager>
      </ThemeProvider>
    </IntlClientProvider>
  )
}
