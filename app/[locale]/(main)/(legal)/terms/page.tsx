import { getTranslations, setRequestLocale } from "next-intl/server"
import { breadcrumbPresets } from "@/components/navigation/app-breadcrumb"
import { 
  FileText, ShoppingBag, CreditCard, Truck, Scales,
  Warning, Users, Prohibit, ArrowCounterClockwise, Shield, 
  Gavel, CheckCircle
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
    title: locale === 'bg' ? 'Условия за ползване' : 'Terms of Service',
    description: locale === 'bg' 
      ? 'Условия за ползване на услугите на AMZN.'
      : 'Terms of Service for using AMZN services.',
  }
}

export default async function TermsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: localeParam } = await params
  const locale = validateLocale(localeParam)
  setRequestLocale(locale)
  const t = await getTranslations('Terms')
  
  const sections: LegalSection[] = [
    { id: 'acceptance', icon: CheckCircle, title: t('acceptance'), desc: t('acceptanceDesc') },
    { id: 'use-of-service', icon: ShoppingBag, title: t('useOfService'), desc: t('useOfServiceDesc') },
    { id: 'account', icon: Users, title: t('account'), desc: t('accountDesc') },
    { id: 'orders', icon: ShoppingBag, title: t('orders'), desc: t('ordersDesc') },
    { id: 'payments', icon: CreditCard, title: t('payments'), desc: t('paymentsDesc') },
    { id: 'shipping', icon: Truck, title: t('shipping'), desc: t('shippingDesc') },
    { id: 'returns', icon: ArrowCounterClockwise, title: t('returnsPolicy'), desc: t('returnsPolicyDesc') },
    { id: 'prohibited', icon: Prohibit, title: t('prohibited'), desc: t('prohibitedDesc') },
    { id: 'intellectual', icon: Shield, title: t('intellectual'), desc: t('intellectualDesc') },
    { id: 'liability', icon: Scales, title: t('liability'), desc: t('liabilityDesc') },
    { id: 'disputes', icon: Gavel, title: t('disputes'), desc: t('disputesDesc') },
    { id: 'changes', icon: Warning, title: t('changes'), desc: t('changesDesc') },
  ]

  const relatedLinks: RelatedLink[] = [
    { href: '/privacy', icon: Shield, title: t('privacyLink'), description: t('privacyLinkDesc') },
    { href: '/returns', icon: ArrowCounterClockwise, title: t('returnsLink'), description: t('returnsLinkDesc') },
    { href: '/customer-service', icon: Users, title: t('helpLink'), description: t('helpLinkDesc') },
  ]
  
  return (
    <LegalPageLayout
      heroIcon={FileText}
      title={t('title')}
      lastUpdated={`${t('lastUpdated')}: ${t('lastUpdatedDate')}`}
      breadcrumbItems={breadcrumbPresets.terms}
      tocLabel={t('tableOfContents')}
      introNotice={t('importantNotice')}
      introText={t('introText')}
      introVariant="warning"
      sections={sections}
      defaultSection="acceptance"
      questionsTitle={t('questionsTitle')}
      questionsDesc={t('questionsDesc')}
      contactButtonText={t('contactUs')}
      contactEmail="legal@treido.com"
      relatedLinks={relatedLinks}
    />
  )
}
