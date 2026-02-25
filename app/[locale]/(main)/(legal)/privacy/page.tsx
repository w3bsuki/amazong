import { getTranslations } from "next-intl/server"
import { breadcrumbPresets } from "../../../_components/navigation/app-breadcrumb"
import { Bell, Cookie, Database, Eye, FileText, Settings as Gear, Globe, Lock, Shield, UserCheck } from "lucide-react";

import { extractLastUpdatedDate, getPublicDoc, parsePublicDocIntro, parsePublicDocSections } from "@/lib/public-docs"
import { buildLegalRouteMetadata, renderLegalDocPage, resolveLegalRouteLocale } from "../_components/legal-page-header"
import type { LegalSection, RelatedLink } from "../_components/legal-page-layout"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  return buildLegalRouteMetadata({ params, namespace: "Privacy", path: "/privacy" })
}

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await resolveLegalRouteLocale(params)
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

  return renderLegalDocPage({
    heroIcon: Shield,
    title: t('title'),
    breadcrumbItems: breadcrumbPresets(tBreadcrumbs).privacy,
    t,
    tBreadcrumbs,
    lastUpdatedDate,
    intro,
    sections,
    defaultSection,
    relatedLinks,
    contactEmail: "privacy@treido.com",
  })
}
