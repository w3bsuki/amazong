import { getTranslations, setRequestLocale } from "next-intl/server"
import { breadcrumbPresets } from "@/components/shared/navigation/app-breadcrumb"
import { 
  Shield, Eye, Lock, FileText, Database, Bell, 
  Cookie, UserCheck, Globe, Gear
} from "@phosphor-icons/react/dist/ssr"
import type { Metadata } from 'next'
import { validateLocale } from "@/i18n/routing"
import { extractLastUpdatedDate, getPublicDoc, parsePublicDocIntro, parsePublicDocSections } from "@/lib/public-docs"
import { LegalPageLayout, type LegalSection, type RelatedLink } from "../_components/legal-page-layout"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: localeParam } = await params
  const locale = validateLocale(localeParam)
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: "Privacy" })
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  }
}

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: localeParam } = await params
  const locale = validateLocale(localeParam)
  setRequestLocale(locale)
  const t = await getTranslations('Privacy')
  const tBreadcrumbs = await getTranslations("Breadcrumbs")

  const doc = await getPublicDoc({ docKey: "legal/privacy", locale })
  const intro = parsePublicDocIntro(doc.markdown)
  const parsedSections = parsePublicDocSections(doc.markdown)
  const lastUpdatedDate = extractLastUpdatedDate(doc.markdown) ?? t("lastUpdatedDate")
  
  const legacySections: LegalSection[] = [
    { id: "info-collect", icon: Eye, title: t("infoCollect"), desc: t("infoCollectDesc") },
    { id: "how-use", icon: FileText, title: t("howWeUse"), desc: t("howWeUseDesc") },
    { id: "data-sharing", icon: Globe, title: t("dataSharing"), desc: t("dataSharingDesc") },
    { id: "cookies", icon: Cookie, title: t("cookies"), desc: t("cookiesDesc") },
    { id: "data-security", icon: Lock, title: t("dataSecurity"), desc: t("dataSecurityDesc") },
    { id: "data-retention", icon: Database, title: t("dataRetention"), desc: t("dataRetentionDesc") },
    { id: "your-rights", icon: UserCheck, title: t("yourRights"), desc: t("yourRightsDesc") },
    { id: "notifications", icon: Bell, title: t("notifications"), desc: t("notificationsDesc") },
  ]

  const iconsById = {
    "who-we-are": Shield,
    scope: FileText,
    "data-we-collect": Eye,
    purposes: Gear,
    sharing: Globe,
    cookies: Cookie,
    security: Lock,
    retention: Database,
    rights: UserCheck,
    changes: Bell,
  } as const

  const sections: LegalSection[] =
    parsedSections.length > 0
      ? parsedSections.map((s) => ({
          id: s.id,
          icon: iconsById[s.id as keyof typeof iconsById] ?? Shield,
          title: s.title,
          desc: s.markdown,
        }))
      : legacySections

  const defaultSection = sections[0]?.id ?? "info-collect"

  const relatedLinks: RelatedLink[] = [
    { href: '/terms', icon: FileText, title: t('termsLink'), description: t('termsLinkDesc') },
    { href: '/returns', icon: Gear, title: t('returnsLink'), description: t('returnsLinkDesc') },
    { href: '/customer-service', icon: Shield, title: t('helpLink'), description: t('helpLinkDesc') },
  ]
  
  return (
    <LegalPageLayout
      heroIcon={Shield}
      title={t('title')}
      lastUpdated={`${t("lastUpdated")}: ${lastUpdatedDate}`}
      breadcrumbItems={breadcrumbPresets(tBreadcrumbs).privacy}
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

