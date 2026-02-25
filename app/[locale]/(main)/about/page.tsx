import type { Metadata } from "next"
import { setRequestLocale } from "next-intl/server"
import { validateLocale } from "@/i18n/routing"
import { createPageMetadata } from "@/lib/seo/metadata"
import { AboutPageContent } from "./_components/about-page-content"

// Generate static params for all locales - required for Next.js 16 Cache Components
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = validateLocale(localeParam)
  setRequestLocale(locale)
  const title = locale === 'bg' ? 'За нас' : 'About Us'
  const description = locale === 'bg' 
    ? 'Научете повече за Treido - вашият доверен партньор за онлайн пазаруване в България.'
    : 'Learn more about Treido - your trusted partner for online shopping in Bulgaria.'

  return createPageMetadata({
    locale,
    path: "/about",
    title,
    description,
  })
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale: localeParam } = await params
  const locale = validateLocale(localeParam)
  setRequestLocale(locale)

  return (
    <AboutPageContent />
  )
}
