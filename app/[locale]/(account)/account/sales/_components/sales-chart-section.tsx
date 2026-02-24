import { Link } from "@/i18n/routing"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SalesChartLazy } from "./sales-chart-lazy"

type SalesChartSectionProps = {
  title: string
  description: string
  period: string
  locale: string
  chartData: { date: string; revenue: number; orders: number }[]
}

function buildPeriodHref(period: string) {
  return `?period=${period}`
}

export function SalesChartSection({
  title,
  description,
  period,
  locale,
  chartData,
}: SalesChartSectionProps) {
  return (
    <Card className="mt-6">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <CardTitle className="text-lg">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Link href={buildPeriodHref("7d")}>
            <Badge variant={period === "7d" ? "default" : "outline"} className="cursor-pointer">
              7D
            </Badge>
          </Link>
          <Link href={buildPeriodHref("30d")}>
            <Badge variant={period === "30d" ? "default" : "outline"} className="cursor-pointer">
              30D
            </Badge>
          </Link>
          <Link href={buildPeriodHref("90d")}>
            <Badge variant={period === "90d" ? "default" : "outline"} className="cursor-pointer">
              90D
            </Badge>
          </Link>
          <Link href={buildPeriodHref("1y")}>
            <Badge variant={period === "1y" ? "default" : "outline"} className="cursor-pointer">
              1Y
            </Badge>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <SalesChartLazy data={chartData} locale={locale} />
      </CardContent>
    </Card>
  )
}
