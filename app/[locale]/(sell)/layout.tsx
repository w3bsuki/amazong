import { setRequestLocale } from 'next-intl/server'
import Script from 'next/script'
import { PerformanceMeasureGuard } from './performance-measure-guard'
import { PageShell } from "../_components/page-shell"
import { FullRouteIntlProvider } from "../_providers/route-intl-provider"
import { localeStaticParams } from "@/lib/next/static-params"

// Generate static params for all supported locales
export function generateStaticParams() {
    return localeStaticParams()
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

  return (
    <FullRouteIntlProvider locale={locale}>
      <>
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
        <PageShell variant="muted" className="flex flex-col">
          {/* Main content - header is rendered by client component for user state */}
          <main className="flex-1 flex flex-col">
            {children}
          </main>
        </PageShell>
      </>
    </FullRouteIntlProvider>
  )
}

