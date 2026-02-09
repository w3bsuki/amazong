import { setRequestLocale, getTranslations } from "next-intl/server"
import { ComingSoonPage } from "./_components/coming-soon-page"
import { Wheelchair } from "@phosphor-icons/react/dist/ssr"
import type { Metadata } from 'next'
import { validateLocale } from "@/i18n/routing"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: localeParam } = await params
  const locale = validateLocale(localeParam)
  setRequestLocale(locale)
  const t = await getTranslations('AccessibilityPage')
  
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
  }
}

export default async function AccessibilityPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale: localeParam } = await params
  const locale = validateLocale(localeParam)
  setRequestLocale(locale)
  
  const t = await getTranslations('AccessibilityPage')
  const tCommon = await getTranslations('ComingSoon')
  
  return (
    <ComingSoonPage
      icon={<Wheelchair className="size-10" weight="duotone" />}
      title={t('title')}
      description={t('description')}
      timeline={t('timeline')}
      features={t.raw('features') as string[]}
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

