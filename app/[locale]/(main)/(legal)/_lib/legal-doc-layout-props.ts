import type { LegalSection, RelatedLink } from "../_components/legal-page-layout"

type Translator = (key: string) => string

interface GetLegalDocLayoutPropsArgs {
  t: Translator
  tBreadcrumbs: Translator
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

export function getLegalDocLayoutProps({
  t,
  tBreadcrumbs,
  lastUpdatedDate,
  intro,
  sections,
  defaultSection,
  relatedLinks,
  contactEmail,
  introVariant = "info",
  introNoticeFallbackKey = "introNotice",
  introTextFallbackKey = "introText",
}: GetLegalDocLayoutPropsArgs) {
  return {
    lastUpdated: `${t("lastUpdated")}: ${lastUpdatedDate}`,
    breadcrumbAriaLabel: tBreadcrumbs("ariaLabel"),
    breadcrumbHomeLabel: tBreadcrumbs("homeLabel"),
    tocLabel: t("tableOfContents"),
    introNotice: intro.notice || t(introNoticeFallbackKey),
    introText: intro.markdown || t(introTextFallbackKey),
    introVariant,
    sections,
    defaultSection,
    questionsTitle: t("questionsTitle"),
    questionsDesc: t("questionsDesc"),
    contactButtonText: t("contactUs"),
    contactEmail,
    relatedLinks,
  }
}

