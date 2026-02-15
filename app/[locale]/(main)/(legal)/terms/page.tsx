import { getTranslations, setRequestLocale } from "next-intl/server"
import { breadcrumbPresets } from "../../../_components/navigation/app-breadcrumb"
import { 
  FileText, ShoppingBag, CreditCard, Truck, Scales,
  Warning, Users, Prohibit, ArrowCounterClockwise, Shield, 
  Gavel, CheckCircle
} from "@/lib/icons/phosphor"
import type { Metadata } from 'next'
import { validateLocale } from "@/i18n/routing"
import { extractLastUpdatedDate, getPublicDoc, parsePublicDocIntro, parsePublicDocSections } from "@/lib/public-docs"
import { LegalPageLayout, type LegalSection, type RelatedLink } from "../_components/legal-page-layout"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: localeParam } = await params
  const locale = validateLocale(localeParam)
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: "Terms" })
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  }
}

export default async function TermsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: localeParam } = await params
  const locale = validateLocale(localeParam)
  setRequestLocale(locale)
  const t = await getTranslations('Terms')
  const tBreadcrumbs = await getTranslations("Breadcrumbs")

  const doc = await getPublicDoc({ docKey: "legal/terms", locale })
  const intro = parsePublicDocIntro(doc.markdown)
  const parsedSections = parsePublicDocSections(doc.markdown)
  const lastUpdatedDate = extractLastUpdatedDate(doc.markdown) ?? t("lastUpdatedDate")
  
  const legacySections: LegalSection[] = [
    { id: "acceptance", icon: CheckCircle, title: t("acceptance"), desc: t("acceptanceDesc") },
    { id: "use-of-service", icon: ShoppingBag, title: t("useOfService"), desc: t("useOfServiceDesc") },
    { id: "account", icon: Users, title: t("account"), desc: t("accountDesc") },
    { id: "orders", icon: ShoppingBag, title: t("orders"), desc: t("ordersDesc") },
    { id: "payments", icon: CreditCard, title: t("payments"), desc: t("paymentsDesc") },
    { id: "shipping", icon: Truck, title: t("shipping"), desc: t("shippingDesc") },
    { id: "returns", icon: ArrowCounterClockwise, title: t("returnsPolicy"), desc: t("returnsPolicyDesc") },
    { id: "prohibited", icon: Prohibit, title: t("prohibited"), desc: t("prohibitedDesc") },
    { id: "intellectual", icon: Shield, title: t("intellectual"), desc: t("intellectualDesc") },
    { id: "liability", icon: Scales, title: t("liability"), desc: t("liabilityDesc") },
    { id: "disputes", icon: Gavel, title: t("disputes"), desc: t("disputesDesc") },
    { id: "changes", icon: Warning, title: t("changes"), desc: t("changesDesc") },
  ]

  const iconsById = {
    acceptance: CheckCircle,
    "use-of-service": ShoppingBag,
    account: Users,
    orders: ShoppingBag,
    payments: CreditCard,
    shipping: Truck,
    returns: ArrowCounterClockwise,
    prohibited: Prohibit,
    intellectual: Shield,
    liability: Scales,
    disputes: Gavel,
    changes: Warning,
  } as const

  const sections: LegalSection[] =
    parsedSections.length > 0
      ? parsedSections.map((s) => ({
          id: s.id,
          icon: iconsById[s.id as keyof typeof iconsById] ?? FileText,
          title: s.title,
          desc: s.markdown,
        }))
      : legacySections

  const defaultSection =
    sections.find((s) => s.id === "acceptance")?.id ?? sections[0]?.id ?? "acceptance"

  const relatedLinks: RelatedLink[] = [
    { href: '/privacy', icon: Shield, title: t('privacyLink'), description: t('privacyLinkDesc') },
    { href: '/returns', icon: ArrowCounterClockwise, title: t('returnsLink'), description: t('returnsLinkDesc') },
    { href: '/customer-service', icon: Users, title: t('helpLink'), description: t('helpLinkDesc') },
  ]
  
  return (
    <LegalPageLayout
      heroIcon={FileText}
      title={t('title')}
      lastUpdated={`${t("lastUpdated")}: ${lastUpdatedDate}`}
      breadcrumbItems={breadcrumbPresets(tBreadcrumbs).terms}
      breadcrumbAriaLabel={tBreadcrumbs("ariaLabel")}
      breadcrumbHomeLabel={tBreadcrumbs("homeLabel")}
      tocLabel={t('tableOfContents')}
      introNotice={intro.notice || t("importantNotice")}
      introText={intro.markdown || t("introText")}
      introVariant="warning"
      sections={sections}
      defaultSection={defaultSection}
      questionsTitle={t('questionsTitle')}
      questionsDesc={t('questionsDesc')}
      contactButtonText={t('contactUs')}
      contactEmail="legal@treido.com"
      relatedLinks={relatedLinks}
    />
  )
}


