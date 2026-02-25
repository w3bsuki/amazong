import { getTranslations } from "next-intl/server"
import { breadcrumbPresets } from "../../../_components/navigation/app-breadcrumb"
import { RefreshCcw as ArrowCounterClockwise, CircleCheck as CheckCircle, CreditCard, FileText, Gavel, Ban as Prohibit, Scale as Scales, Shield, ShoppingBag, Truck, Users, TriangleAlert as Warning } from "lucide-react";

import { extractLastUpdatedDate, getPublicDoc, parsePublicDocIntro, parsePublicDocSections } from "@/lib/public-docs"
import { buildLegalRouteMetadata, renderLegalDocPage, resolveLegalRouteLocale } from "../_components/legal-page-header"
import type { LegalSection, RelatedLink } from "../_components/legal-page-layout"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  return buildLegalRouteMetadata({ params, namespace: "Terms" })
}

export default async function TermsPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await resolveLegalRouteLocale(params)
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

  return renderLegalDocPage({
    heroIcon: FileText,
    title: t('title'),
    breadcrumbItems: breadcrumbPresets(tBreadcrumbs).terms,
    t,
    tBreadcrumbs,
    lastUpdatedDate,
    intro,
    sections,
    defaultSection,
    relatedLinks,
    contactEmail: "legal@treido.com",
    introVariant: "warning",
    introNoticeFallbackKey: "importantNotice",
  })
}
