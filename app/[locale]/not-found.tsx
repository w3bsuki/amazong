import type { Metadata } from 'next'
import { Link } from '@/i18n/routing'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { validateLocale } from '@/i18n/routing'
import { createPageMetadata } from '@/lib/seo/metadata'

export async function generateMetadata({
  params,
}: {
  params?: Promise<{ locale: string }>
}): Promise<Metadata> {
  const resolved = params ? await params : null
  const locale = validateLocale(resolved?.locale ?? "en")
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'NotFound' })

  return createPageMetadata({
    locale,
    path: "",
    title: t('metaTitle'),
    description: t('description'),
    robots: {
      index: false,
      follow: true,
    },
  })
}

export default async function NotFound({
  params,
}: {
  params?: Promise<{ locale: string }>
}) {
  const resolved = params ? await params : null
  const locale = validateLocale(resolved?.locale ?? "en")
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'NotFound' })

  return (
    <div className="min-h-96 py-20 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-8xl font-bold text-muted-foreground mb-4">{t('heroTitle')}</div>

        <h1 className="text-2xl font-bold text-foreground mb-2">{t('title')}</h1>
        
        <p className="text-muted-foreground mb-6">
          {t('description')}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-interactive-hover w-full sm:w-auto"
          >
            {t('goToHomepage')}
          </Link>
          
          <Link
            href="/search"
            className="inline-flex items-center justify-center rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-accent w-full sm:w-auto"
          >
            {t('searchProducts')}
          </Link>
        </div>
        
        <div className="mt-8 pt-6 border-t border-border">
          <p className="text-sm text-muted-foreground mb-3">
            {t('linksTitle')}
          </p>
          <div className="flex flex-wrap justify-center items-center gap-2 text-sm">
            <Link href="/todays-deals" className="text-link hover:underline min-h-7 inline-flex items-center px-1">
              {t('todaysDeals')}
            </Link>
            <span className="text-muted-foreground">•</span>
            <Link href="/customer-service" className="text-link hover:underline min-h-7 inline-flex items-center px-1">
              {t('customerService')}
            </Link>
            <span className="text-muted-foreground">•</span>
            <Link href="/contact" className="text-link hover:underline min-h-7 inline-flex items-center px-1">
              {t('contactUs')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
