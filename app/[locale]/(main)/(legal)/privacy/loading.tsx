import { LegalDocLoading } from "../_components/legal-doc-loading"

export default function PrivacyLoading() {
  return (
    <LegalDocLoading
      heroTitleWidthClassName="w-48"
      tocItemsCount={6}
      tocItemWidthClassName="w-56"
      sectionsCount={5}
      sectionTitleWidthClassName="w-64"
      sectionLine3WidthClassName="w-5/6"
      sectionLine5WidthClassName="w-3/4"
    />
  )
}
