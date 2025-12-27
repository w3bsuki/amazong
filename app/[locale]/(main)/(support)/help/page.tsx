import { redirect } from 'next/navigation'
import { routing, validateLocale } from '@/i18n/routing'
import { setRequestLocale } from 'next-intl/server'

// Generate static params for all locales
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function HelpPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: localeParam } = await params
  const locale = validateLocale(localeParam)
  setRequestLocale(locale)
  // Redirect to customer-service page
  redirect(`/${locale}/customer-service`)
}
