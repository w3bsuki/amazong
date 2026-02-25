import { setRequestLocale } from 'next-intl/server'
import { validateLocale } from '@/i18n/routing'
import { PageShell } from "../_components/page-shell"
import { FullRouteIntlProvider } from "../_providers/route-intl-provider"
import { localeStaticParams } from "@/lib/next/static-params"

// Generate static params for all supported locales
export function generateStaticParams() {
  return localeStaticParams()
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

  return (
    <FullRouteIntlProvider locale={locale}>
      <PageShell variant="default">
        <main id="main-content" role="main">
          {children}
        </main>
      </PageShell>
    </FullRouteIntlProvider>
  )
}

