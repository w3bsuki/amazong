import type { Metadata } from "next"
import { getTranslations, setRequestLocale } from "next-intl/server"
import type { LucideIcon } from "lucide-react"

import { validateLocale } from "@/i18n/routing"

import type { BreadcrumbItemData } from "../../../_components/navigation/app-breadcrumb"
import { getLegalDocLayoutProps } from "../_lib/legal-doc-layout-props"
import { LegalPageLayout, type LegalSection, type RelatedLink } from "./legal-page-layout"

export async function resolveLegalRouteLocale(params: Promise<{ locale: string }>) {
  const { locale: localeParam } = await params
  const locale = validateLocale(localeParam)
  setRequestLocale(locale)
  return locale
}

interface BuildLegalRouteMetadataArgs {
  params: Promise<{ locale: string }>
  namespace: string
  titleKey?: string
  descriptionKey?: string
}

export async function buildLegalRouteMetadata({
  params,
  namespace,
  titleKey = "metaTitle",
  descriptionKey = "metaDescription",
}: BuildLegalRouteMetadataArgs): Promise<Metadata> {
  const locale = await resolveLegalRouteLocale(params)
  const t = await getTranslations({ locale, namespace })

  return {
    title: t(titleKey),
    description: t(descriptionKey),
  }
}

interface RenderLegalDocPageArgs {
  heroIcon: LucideIcon
  title: string
  breadcrumbItems: readonly BreadcrumbItemData[]
  t: (key: string) => string
  tBreadcrumbs: (key: string) => string
  lastUpdatedDate: string
  intro: { notice: string; markdown: string }
  sections: LegalSection[]
  defaultSection: string
  relatedLinks: RelatedLink[]
  contactEmail: string
  introVariant?: "info" | "warning"
  introNoticeFallbackKey?: string
  introTextFallbackKey?: string
}

export function renderLegalDocPage({
  heroIcon,
  title,
  breadcrumbItems,
  ...layoutArgs
}: RenderLegalDocPageArgs) {
  const layoutProps = getLegalDocLayoutProps(layoutArgs)

  return (
    <LegalPageLayout heroIcon={heroIcon} title={title} breadcrumbItems={breadcrumbItems} {...layoutProps} />
  )
}

