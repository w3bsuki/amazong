import { setRequestLocale } from 'next-intl/server'
import { routing, validateLocale } from '@/i18n/routing'
import { PageShell } from "../_components/page-shell"

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

  return (
    <PageShell variant="default">
      <main id="main-content" role="main">
        {children}
      </main>
    </PageShell>
  )
}

