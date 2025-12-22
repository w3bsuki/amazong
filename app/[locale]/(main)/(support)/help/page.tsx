import { redirect } from 'next/navigation'
import { routing } from '@/i18n/routing'

// Generate static params for all locales
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function HelpPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  // Redirect to customer-service page
  redirect(`/${locale}/customer-service`)
}
