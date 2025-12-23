import type { Metadata } from "next"
import { Suspense } from "react"
import { setRequestLocale } from "next-intl/server"
import { routing } from "@/i18n/routing"
import { AboutPageContent } from "./_components/about-page-content"
import { AboutPageSkeleton } from "./_components/about-page-skeleton"

// Generate static params for all locales - required for Next.js 16 Cache Components
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === 'bg' ? 'За нас' : 'About Us',
    description: locale === 'bg' 
      ? 'Научете повече за AMZN - вашият доверен партньор за онлайн пазаруване в България.'
      : 'Learn more about AMZN - your trusted partner for online shopping in Bulgaria.',
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <Suspense fallback={<AboutPageSkeleton />}>
      <AboutPageContent />
    </Suspense>
  )
}
