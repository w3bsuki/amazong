import { getMessages, setRequestLocale } from 'next-intl/server'
import { routing, validateLocale } from '@/i18n/routing'
import { IntlClientProvider } from '../intl-client-provider'

// Generate static params for all supported locales
export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}

export default async function AuthLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale: localeParam } = await params;
  const locale = validateLocale(localeParam)
  
  // Enable static rendering - CRITICAL for Next.js 16+
  setRequestLocale(locale);
  
  const messages = await getMessages()

  return (
    <IntlClientProvider locale={locale} messages={messages}>
      <div className="min-h-svh bg-background">
        <main id="main-content" role="main" className="min-h-svh">
          {children}
        </main>
      </div>
    </IntlClientProvider>
  )
}
