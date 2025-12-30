import { getTranslations, setRequestLocale } from "next-intl/server"
import { breadcrumbPresets } from "@/components/navigation/app-breadcrumb"
import { 
  Cookie, Shield, Gear, Eye, Bell, 
  ChartBar, Lock
} from "@phosphor-icons/react/dist/ssr"
import type { Metadata } from 'next'
import { routing, validateLocale } from "@/i18n/routing"
import { LegalPageLayout, type LegalSection, type RelatedLink } from "../_components/legal-page-layout"

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: localeParam } = await params
  const locale = validateLocale(localeParam)
  setRequestLocale(locale)
  return {
    title: locale === 'bg' ? 'Политика за бисквитки' : 'Cookie Policy',
    description: locale === 'bg' 
      ? 'Научете как използваме бисквитки за подобряване на вашето преживяване.'
      : 'Learn how we use cookies to improve your experience.',
  }
}

export default async function CookiesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: localeParam } = await params
  const locale = validateLocale(localeParam)
  setRequestLocale(locale)
  const t = await getTranslations('Cookies')
  
  const sections: LegalSection[] = [
    { id: 'what-are-cookies', icon: Cookie, title: t('whatAreCookies'), desc: t('whatAreCookiesDesc') },
    { id: 'essential-cookies', icon: Shield, title: t('essentialCookies'), desc: t('essentialCookiesDesc') },
    { id: 'functional-cookies', icon: Gear, title: t('functionalCookies'), desc: t('functionalCookiesDesc') },
    { id: 'analytics-cookies', icon: ChartBar, title: t('analyticsCookies'), desc: t('analyticsCookiesDesc') },
    { id: 'advertising-cookies', icon: Eye, title: t('advertisingCookies'), desc: t('advertisingCookiesDesc') },
    { id: 'manage-cookies', icon: Gear, title: t('manageCookies'), desc: t('manageCookiesDesc') },
    { id: 'cookie-duration', icon: Bell, title: t('cookieDuration'), desc: t('cookieDurationDesc') },
    { id: 'your-choices', icon: Lock, title: t('yourChoices'), desc: t('yourChoicesDesc') },
  ]

  const relatedLinks: RelatedLink[] = [
    { href: '/privacy', icon: Shield, title: t('privacyLink'), description: t('privacyLinkDesc') },
    { href: '/terms', icon: Lock, title: t('termsLink'), description: t('termsLinkDesc') },
    { href: '/customer-service', icon: Gear, title: t('helpLink'), description: t('helpLinkDesc') },
  ]
  
  return (
    <LegalPageLayout
      heroIcon={Cookie}
      title={t('pageTitle')}
      lastUpdated={`${t('lastUpdated')}: ${t('lastUpdatedDate')}`}
      breadcrumbItems={breadcrumbPresets.cookies}
      tocLabel={t('tableOfContents')}
      introNotice={t('introNotice')}
      introText={t('introText')}
      introVariant="info"
      sections={sections}
      defaultSection="what-are-cookies"
      questionsTitle={t('questionsTitle')}
      questionsDesc={t('questionsDesc')}
      contactButtonText={t('contactUs')}
      contactEmail="privacy@treido.com"
      relatedLinks={relatedLinks}
    />
  )
}
