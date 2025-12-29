import { getTranslations, setRequestLocale } from "next-intl/server"
import { breadcrumbPresets } from "@/components/navigation/app-breadcrumb"
import { 
  Shield, Eye, Lock, FileText, Database, Bell, 
  Cookie, UserCheck, Globe, Gear
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
    title: locale === 'bg' ? 'Политика за поверителност' : 'Privacy Policy',
    description: locale === 'bg' 
      ? 'Научете как защитаваме вашите лични данни и гарантираме сигурността ви.'
      : 'Learn how we protect your personal data and ensure your privacy.',
  }
}

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: localeParam } = await params
  const locale = validateLocale(localeParam)
  setRequestLocale(locale)
  const t = await getTranslations('Privacy')
  
  const sections: LegalSection[] = [
    { id: 'info-collect', icon: Eye, title: t('infoCollect'), desc: t('infoCollectDesc') },
    { id: 'how-use', icon: FileText, title: t('howWeUse'), desc: t('howWeUseDesc') },
    { id: 'data-sharing', icon: Globe, title: t('dataSharing'), desc: t('dataSharingDesc') },
    { id: 'cookies', icon: Cookie, title: t('cookies'), desc: t('cookiesDesc') },
    { id: 'data-security', icon: Lock, title: t('dataSecurity'), desc: t('dataSecurityDesc') },
    { id: 'data-retention', icon: Database, title: t('dataRetention'), desc: t('dataRetentionDesc') },
    { id: 'your-rights', icon: UserCheck, title: t('yourRights'), desc: t('yourRightsDesc') },
    { id: 'notifications', icon: Bell, title: t('notifications'), desc: t('notificationsDesc') },
  ]

  const relatedLinks: RelatedLink[] = [
    { href: '/terms', icon: FileText, title: t('termsLink'), description: t('termsLinkDesc') },
    { href: '/returns', icon: Gear, title: t('returnsLink'), description: t('returnsLinkDesc') },
    { href: '/customer-service', icon: Shield, title: t('helpLink'), description: t('helpLinkDesc') },
  ]
  
  return (
    <LegalPageLayout
      heroIcon={Shield}
      title={t('title')}
      lastUpdated={`${t('lastUpdated')}: ${t('lastUpdatedDate')}`}
      breadcrumbItems={breadcrumbPresets.privacy}
      tocLabel={t('tableOfContents')}
      introNotice={t('introNotice')}
      introText={t('introText')}
      introVariant="info"
      sections={sections}
      defaultSection="info-collect"
      questionsTitle={t('questionsTitle')}
      questionsDesc={t('questionsDesc')}
      contactButtonText={t('contactUs')}
      contactEmail="privacy@treido.com"
      relatedLinks={relatedLinks}
    />
  )
}
