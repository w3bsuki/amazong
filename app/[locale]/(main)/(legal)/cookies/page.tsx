import { getTranslations, setRequestLocale } from "next-intl/server"
import { breadcrumbPresets } from "@/components/navigation/app-breadcrumb"
import { 
  Cookie, Shield, Gear, Eye, Bell, 
  ChartBar, Lock
} from "@phosphor-icons/react/dist/ssr"
import type { Metadata } from 'next'
import { routing, validateLocale } from "@/i18n/routing"
import { extractLastUpdatedDate, getPublicDoc, parsePublicDocIntro, parsePublicDocSections } from "@/lib/public-docs"
import { LegalPageLayout, type LegalSection, type RelatedLink } from "../_components/legal-page-layout"

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: localeParam } = await params
  const locale = validateLocale(localeParam)
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: "Cookies" })
  return {
    title: t("pageTitle"),
    description: t("descriptionShort"),
  }
}

export default async function CookiesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: localeParam } = await params
  const locale = validateLocale(localeParam)
  setRequestLocale(locale)
  const t = await getTranslations('Cookies')
  const tBreadcrumbs = await getTranslations("Breadcrumbs")

  const doc = await getPublicDoc({ docKey: "legal/cookies", locale })
  const intro = parsePublicDocIntro(doc.markdown)
  const parsedSections = parsePublicDocSections(doc.markdown)
  const lastUpdatedDate = extractLastUpdatedDate(doc.markdown) ?? t("lastUpdatedDate")
  
  const legacySections: LegalSection[] = [
    { id: "what-are-cookies", icon: Cookie, title: t("whatAreCookies"), desc: t("whatAreCookiesDesc") },
    { id: "essential-cookies", icon: Shield, title: t("essentialCookies"), desc: t("essentialCookiesDesc") },
    { id: "functional-cookies", icon: Gear, title: t("functionalCookies"), desc: t("functionalCookiesDesc") },
    { id: "analytics-cookies", icon: ChartBar, title: t("analyticsCookies"), desc: t("analyticsCookiesDesc") },
    { id: "advertising-cookies", icon: Eye, title: t("advertisingCookies"), desc: t("advertisingCookiesDesc") },
    { id: "manage-cookies", icon: Gear, title: t("manageCookies"), desc: t("manageCookiesDesc") },
    { id: "cookie-duration", icon: Bell, title: t("cookieDuration"), desc: t("cookieDurationDesc") },
    { id: "your-choices", icon: Lock, title: t("yourChoices"), desc: t("yourChoicesDesc") },
  ]

  const iconsById = {
    "what-are-cookies": Cookie,
    "essential-cookies": Shield,
    "functional-cookies": Gear,
    "analytics-cookies": ChartBar,
    "advertising-cookies": Eye,
    "manage-cookies": Gear,
    "cookie-duration": Bell,
    "your-choices": Lock,
  } as const

  const sections: LegalSection[] =
    parsedSections.length > 0
      ? parsedSections.map((s) => ({
          id: s.id,
          icon: iconsById[s.id as keyof typeof iconsById] ?? Cookie,
          title: s.title,
          desc: s.markdown,
        }))
      : legacySections

  const defaultSection =
    sections.find((s) => s.id === "what-are-cookies")?.id ?? sections[0]?.id ?? "what-are-cookies"

  const relatedLinks: RelatedLink[] = [
    { href: '/privacy', icon: Shield, title: t('privacyLink'), description: t('privacyLinkDesc') },
    { href: '/terms', icon: Lock, title: t('termsLink'), description: t('termsLinkDesc') },
    { href: '/customer-service', icon: Gear, title: t('helpLink'), description: t('helpLinkDesc') },
  ]
  
  return (
    <LegalPageLayout
      heroIcon={Cookie}
      title={t('pageTitle')}
      lastUpdated={`${t("lastUpdated")}: ${lastUpdatedDate}`}
      breadcrumbItems={breadcrumbPresets(tBreadcrumbs).cookies}
      breadcrumbAriaLabel={tBreadcrumbs("ariaLabel")}
      breadcrumbHomeLabel={tBreadcrumbs("homeLabel")}
      tocLabel={t('tableOfContents')}
      introNotice={intro.notice || t("introNotice")}
      introText={intro.markdown || t("introText")}
      introVariant="info"
      sections={sections}
      defaultSection={defaultSection}
      questionsTitle={t('questionsTitle')}
      questionsDesc={t('questionsDesc')}
      contactButtonText={t('contactUs')}
      contactEmail="privacy@treido.com"
      relatedLinks={relatedLinks}
    />
  )
}
