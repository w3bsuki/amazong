import { PageShell } from "../../../_components/page-shell"
import { Skeleton } from "@/components/ui/skeleton"

type LegalDocLoadingProps = {
  heroTitleWidthClassName: string
  tocItemsCount: number
  tocItemWidthClassName: string
  sectionsCount: number
  sectionTitleWidthClassName: string
  sectionLine3WidthClassName: string
  sectionLine5WidthClassName: string
}

export function LegalDocLoading({
  heroTitleWidthClassName,
  tocItemsCount,
  tocItemWidthClassName,
  sectionsCount,
  sectionTitleWidthClassName,
  sectionLine3WidthClassName,
  sectionLine5WidthClassName,
}: LegalDocLoadingProps) {
  return (
    <PageShell className="pb-20 sm:pb-12">
      {/* Hero */}
      <div className="bg-muted py-8 sm:py-12">
        <div className="container">
          <Skeleton className={`h-8 sm:h-10 ${heroTitleWidthClassName} mb-2`} />
          <Skeleton className="h-5 w-64" />
        </div>
      </div>

      <div className="container py-8 max-w-4xl">
        <div className="richtext max-w-none text-sm">
          {/* Table of Contents */}
          <div className="bg-card rounded-xl border border-border p-4 mb-8">
            <Skeleton className="h-5 w-40 mb-4" />
            <div className="space-y-2">
              {Array.from({ length: tocItemsCount }, (_, index) => (
                <Skeleton key={index} className={`h-4 ${tocItemWidthClassName}`} />
              ))}
            </div>
          </div>

          {/* Sections */}
          {Array.from({ length: sectionsCount }, (_, index) => (
            <div key={index} className="mb-8">
              <Skeleton className={`h-7 ${sectionTitleWidthClassName} mb-4`} />
              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className={`h-4 ${sectionLine3WidthClassName}`} />
                <Skeleton className="h-4 w-full" />
                <Skeleton className={`h-4 ${sectionLine5WidthClassName}`} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageShell>
  )
}

