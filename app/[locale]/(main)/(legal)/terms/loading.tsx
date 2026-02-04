import { LegalDocLoading } from "../_components/legal-doc-loading"

export default function TermsLoading() {
  return (
    <LegalDocLoading
      heroTitleWidthClassName="w-56"
      tocItemsCount={8}
      tocItemWidthClassName="w-48"
      sectionsCount={6}
      sectionTitleWidthClassName="w-56"
      sectionLine3WidthClassName="w-4/5"
      sectionLine5WidthClassName="w-2/3"
    />
  )
}
