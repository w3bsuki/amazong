import type { ReactNode } from 'react'
import { Suspense } from 'react'

import { getMessages, setRequestLocale } from 'next-intl/server'

import { ThemeProvider } from '@/components/providers/theme-provider'
import { IntlClientProvider } from './intl-client-provider'
import { AuthStateManager } from '@/components/providers/auth-state-manager'
import { CartProvider } from '@/components/providers/cart-context'
import { WishlistProvider } from '@/components/providers/wishlist-context'
import { MessageProvider } from '@/components/providers/message-context'

async function LocaleProvidersWithMessages({
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
            <CartProvider>
              <WishlistProvider>{children}</WishlistProvider>
            </CartProvider>
          </MessageProvider>
        </AuthStateManager>
      </ThemeProvider>
    </IntlClientProvider>
  )
}

export default function LocaleProviders({
  locale,
  children,
}: {
  locale: string
  children: ReactNode
}) {
  // Ensure any request-bound uncached data (like next-intl messages resolution)
  // happens inside a <Suspense> boundary when cacheComponents is enabled.
  return (
    <Suspense fallback={null}>
      <LocaleProvidersWithMessages locale={locale}>{children}</LocaleProvidersWithMessages>
    </Suspense>
  )
}
