import { getMessages, setRequestLocale } from 'next-intl/server'
import Script from 'next/script'
import { routing } from '@/i18n/routing'
import { PerformanceMeasureGuard } from './PerformanceMeasureGuard'
import { IntlClientProvider } from '../intl-client-provider'

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
    <IntlClientProvider locale={locale} messages={messages}>
      <Script
        id="perf-measure-guard"
        strategy="beforeInteractive"
      >
        {`(() => {
  try {
    const perf = globalThis.performance;
    if (!perf || typeof perf.measure !== 'function') return;
    const original = perf.measure.bind(perf);
    perf.measure = function(name, ...args) {
      try {
        return original(name, ...args);
      } catch (e) {
        const message = String(e && e.message ? e.message : e);
        if (message.includes("Failed to execute 'measure' on 'Performance'") && message.includes('negative time stamp')) {
          return;
        }
        throw e;
      }
    };
  } catch {
    // noop
  }
})();`}
      </Script>
      <PerformanceMeasureGuard />
      <div className="min-h-svh bg-background flex flex-col">
        {/* Main content - header is rendered by client component for user state */}
        <main className="flex-1 flex flex-col">
          {children}
        </main>
      </div>
    </IntlClientProvider>
  )
}
