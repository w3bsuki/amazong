import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ShoppingCart,
  TrendUp,
  TrendDown,
  Receipt,
} from "@phosphor-icons/react/dist/ssr"

interface SalesStatsProps {
  locale: string
  totalRevenue: number
  netRevenue: number
  totalSales: number
  totalUnits: number
  avgOrderValue: number
  revenueGrowth: number
  salesGrowth: number
  commissionRate: number
  totalCommission: number
  formatCurrency: (value: number) => string
}

export function SalesStats({
  locale,
  totalRevenue,
  netRevenue,
  totalSales,
  totalUnits,
  avgOrderValue,
  revenueGrowth,
  salesGrowth,
  commissionRate,
  totalCommission,
  formatCurrency,
}: SalesStatsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {/* Total Revenue */}
      <Card className="@container/card">
        <CardHeader className="pb-2">
          <CardDescription className="text-xs sm:text-sm">
            {locale === "bg" ? "Общи приходи" : "Total Revenue"}
          </CardDescription>
          <CardTitle className="text-xl sm:text-2xl font-bold tabular-nums">
            {formatCurrency(totalRevenue)}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className={`text-xs ${
                revenueGrowth >= 0
                  ? "bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-400 dark:border-emerald-800"
                  : "bg-red-50 text-red-600 border-red-200 dark:bg-red-950/50 dark:text-red-400 dark:border-red-800"
              }`}
            >
              {revenueGrowth >= 0 ? <TrendUp className="size-3" /> : <TrendDown className="size-3" />}
              {revenueGrowth >= 0 ? "+" : ""}
              {revenueGrowth.toFixed(1)}%
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {locale === "bg" ? "спрямо предишен период" : "vs previous period"}
          </p>
        </CardContent>
      </Card>

      {/* Net Revenue */}
      <Card className="@container/card">
        <CardHeader className="pb-2">
          <CardDescription className="text-xs sm:text-sm">
            {locale === "bg" ? "Нетни приходи" : "Net Revenue"}
          </CardDescription>
          <CardTitle className="text-xl sm:text-2xl font-bold tabular-nums text-emerald-600 dark:text-emerald-400">
            {formatCurrency(netRevenue)}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Receipt className="size-3.5" />
            <span>
              {locale === "bg" ? "след" : "after"} {commissionRate}% {locale === "bg" ? "комисионна" : "commission"}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {locale === "bg" ? "Комисионна" : "Commission"}: {formatCurrency(totalCommission)}
          </p>
        </CardContent>
      </Card>

      {/* Total Sales */}
      <Card className="@container/card">
        <CardHeader className="pb-2">
          <CardDescription className="text-xs sm:text-sm">
            {locale === "bg" ? "Общо поръчки" : "Total Orders"}
          </CardDescription>
          <CardTitle className="text-xl sm:text-2xl font-bold tabular-nums">{totalSales}</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className={`text-xs ${
                salesGrowth >= 0
                  ? "bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-400 dark:border-emerald-800"
                  : "bg-red-50 text-red-600 border-red-200 dark:bg-red-950/50 dark:text-red-400 dark:border-red-800"
              }`}
            >
              {salesGrowth >= 0 ? <TrendUp className="size-3" /> : <TrendDown className="size-3" />}
              {salesGrowth >= 0 ? "+" : ""}
              {salesGrowth.toFixed(1)}%
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {totalUnits} {locale === "bg" ? "продадени бройки" : "units sold"}
          </p>
        </CardContent>
      </Card>

      {/* Avg Order Value */}
      <Card className="@container/card">
        <CardHeader className="pb-2">
          <CardDescription className="text-xs sm:text-sm">
            {locale === "bg" ? "Средна поръчка" : "Avg Order Value"}
          </CardDescription>
          <CardTitle className="text-xl sm:text-2xl font-bold tabular-nums">
            {formatCurrency(avgOrderValue)}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <ShoppingCart className="size-3.5" />
            <span>{locale === "bg" ? "на поръчка" : "per order"}</span>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {(totalUnits / Math.max(totalSales, 1)).toFixed(1)} {locale === "bg" ? "бройки/поръчка" : "items/order"}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
