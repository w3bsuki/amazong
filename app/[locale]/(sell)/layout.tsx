import { NextIntlClientProvider } from 'next-intl'
import { getMessages, setRequestLocale } from 'next-intl/server'
import { routing } from '@/i18n/routing'

// Generate static params for all supported locales
export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}

/**
 * Sell Layout - Standalone minimal layout for seller flows
 * 
 * No site header/footer - clean, distraction-free experience
 * Header is rendered by the client component for interactivity
 */
export default async function SellLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params;
  
  // Enable static rendering - CRITICAL for Next.js 16+
  setRequestLocale(locale);
  
  const messages = await getMessages()

  return (
    <NextIntlClientProvider messages={messages}>
      <div className="min-h-svh bg-background flex flex-col">
        {/* Main content - header is rendered by client component for user state */}
        <main className="flex-1 flex flex-col">
          {children}
        </main>
      </div>
    </NextIntlClientProvider>
  )
}
