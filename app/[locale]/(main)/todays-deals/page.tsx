import { setRequestLocale, getTranslations } from "next-intl/server"
import { ComingSoonPage } from "@/components/shared/coming-soon-page"
import { Lightning as Zap } from "@phosphor-icons/react/dist/ssr"
import type { Metadata } from 'next'
import { routing, validateLocale } from "@/i18n/routing"

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: localeParam } = await params
  const locale = validateLocale(localeParam)
  setRequestLocale(locale)
  const t = await getTranslations('TodaysDeals')
  
  return {
    title: t('title'),
    description: t('metaDescription'),
  }
}

export default async function TodaysDealsPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale: localeParam } = await params
  const locale = validateLocale(localeParam)
  setRequestLocale(locale)
  
  const t = await getTranslations('TodaysDeals')
  const tCommon = await getTranslations('ComingSoon')
  
  return (
    <ComingSoonPage
      icon={<Zap className="size-10" weight="duotone" />}
      title={t('title')}
      description={t('comingSoonDescription')}
      timeline={t('comingSoonTimeline')}
      features={t.raw('comingSoonFeatures') as string[]}
      labels={{
        backToHome: tCommon('backToHome'),
        notifyMe: tCommon('notifyMe'),
        emailLabel: tCommon('emailLabel'),
        emailPlaceholder: tCommon('emailPlaceholder'),
        subscribing: tCommon('subscribing'),
        subscribed: tCommon('subscribed'),
        expectedLaunch: tCommon('expectedLaunch'),
        whatToExpect: tCommon('whatToExpect'),
      }}
    />
  )
}
