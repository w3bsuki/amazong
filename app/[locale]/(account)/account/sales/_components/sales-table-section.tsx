import { Link } from "@/i18n/routing"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ExportSales } from "./export-sales"
import { SalesTable } from "./sales-table"
import type { SaleItem } from "../types"

type SalesTableSectionProps = {
  title: string
  description: string
  sales: SaleItem[]
  locale: string
  period: string
  startDate: Date
  now: Date
  currentPage: number
  totalPages: number
  previousLabel: string
  nextLabel: string
  paginationLabel: string
}

function buildPageHref(period: string, pageNumber: number) {
  const next = new URLSearchParams()
  if (period !== "30d") next.set("period", period)
  if (pageNumber > 1) next.set("page", String(pageNumber))

  const qs = next.toString()
  return qs ? `/account/sales?${qs}` : "/account/sales"
}

export function SalesTableSection({
  title,
  description,
  sales,
  locale,
  period,
  startDate,
  now,
  currentPage,
  totalPages,
  previousLabel,
  nextLabel,
  paginationLabel,
}: SalesTableSectionProps) {
  return (
    <Card className="mt-6">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <CardTitle className="text-lg">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <ExportSales
            defaultFrom={startDate.toISOString().slice(0, 10)}
            defaultTo={now.toISOString().slice(0, 10)}
          />
        </div>
      </CardHeader>
      <CardContent>
        <SalesTable sales={sales} locale={locale} />

        {sales.length > 0 ? (
          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
              {locale === "bg"
                ? `Страница ${currentPage} от ${totalPages}`
                : `Page ${currentPage} of ${totalPages}`}
            </p>

            <nav className="flex items-center gap-2" aria-label={paginationLabel}>
              {currentPage > 1 ? (
                <Button variant="outline" size="sm" asChild>
                  <Link href={buildPageHref(period, currentPage - 1)}>{previousLabel}</Link>
                </Button>
              ) : (
                <Button variant="outline" size="sm" disabled>
                  {previousLabel}
                </Button>
              )}

              {currentPage < totalPages ? (
                <Button variant="outline" size="sm" asChild>
                  <Link href={buildPageHref(period, currentPage + 1)}>{nextLabel}</Link>
                </Button>
              ) : (
                <Button variant="outline" size="sm" disabled>
                  {nextLabel}
                </Button>
              )}
            </nav>
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}
