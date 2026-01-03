import { setRequestLocale, getTranslations } from "next-intl/server"
import { ComingSoonPage } from "@/components/shared/coming-soon-page"
import { Megaphone } from "@phosphor-icons/react/dist/ssr"
import type { Metadata } from 'next'
import { routing, validateLocale } from "@/i18n/routing"

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: localeParam } = await params
  const locale = validateLocale(localeParam)
  setRequestLocale(locale)
  const t = await getTranslations('AdvertisePage')
  
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    robots: { index: false, follow: false },
  }
}

export default async function AdvertisePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale: localeParam } = await params
  const locale = validateLocale(localeParam)
  setRequestLocale(locale)
  
  const t = await getTranslations('AdvertisePage')
  const tCommon = await getTranslations('ComingSoon')
  
  return (
    <ComingSoonPage
      icon={<Megaphone className="size-10" weight="duotone" />}
      title={t('title')}
      description={t('description')}
      timeline={t('timeline')}
      features={t.raw('features') as string[]}
      labels={{
        backToHome: tCommon('backToHome'),
        notifyMe: tCommon('notifyMe'),
        emailPlaceholder: tCommon('emailPlaceholder'),
        subscribing: tCommon('subscribing'),
        subscribed: tCommon('subscribed'),
        expectedLaunch: tCommon('expectedLaunch'),
        whatToExpect: tCommon('whatToExpect'),
      }}
    />
  )
}
