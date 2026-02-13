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
import { getTranslations } from "next-intl/server"

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

export async function SalesStats({
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
  const t = await getTranslations({ locale, namespace: "SellerManagement" })
  const itemsPerOrder = (totalUnits / Math.max(totalSales, 1)).toFixed(1)

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {/* Total Revenue */}
      <Card className="@container/card">
        <CardHeader className="pb-2">
          <CardDescription className="text-xs sm:text-sm">
            {t("sales.stats.totalRevenue.title")}
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
                  ? "bg-success/10 text-success border-success/20"
                  : "bg-destructive-subtle text-destructive border-destructive/20"
              }`}
            >
              {revenueGrowth >= 0 ? <TrendUp className="size-3" /> : <TrendDown className="size-3" />}
              {revenueGrowth >= 0 ? "+" : ""}
              {revenueGrowth.toFixed(1)}%
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {t("sales.stats.totalRevenue.vsPrevious")}
          </p>
        </CardContent>
      </Card>

      {/* Net Revenue */}
      <Card className="@container/card">
        <CardHeader className="pb-2">
          <CardDescription className="text-xs sm:text-sm">
            {t("sales.stats.netRevenue.title")}
          </CardDescription>
          <CardTitle className="text-xl sm:text-2xl font-bold tabular-nums text-success">
            {formatCurrency(netRevenue)}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Receipt className="size-3.5" />
            <span>
              {t("sales.stats.netRevenue.afterCommission", { rate: commissionRate })}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {t("sales.stats.netRevenue.commissionLabel")}: {formatCurrency(totalCommission)}
          </p>
        </CardContent>
      </Card>

      {/* Total Sales */}
      <Card className="@container/card">
        <CardHeader className="pb-2">
          <CardDescription className="text-xs sm:text-sm">
            {t("sales.stats.totalOrders.title")}
          </CardDescription>
          <CardTitle className="text-xl sm:text-2xl font-bold tabular-nums">{totalSales}</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className={`text-xs ${
                salesGrowth >= 0
                  ? "bg-success/10 text-success border-success/20"
                  : "bg-destructive-subtle text-destructive border-destructive/20"
              }`}
            >
              {salesGrowth >= 0 ? <TrendUp className="size-3" /> : <TrendDown className="size-3" />}
              {salesGrowth >= 0 ? "+" : ""}
              {salesGrowth.toFixed(1)}%
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {t("sales.stats.totalOrders.unitsSold", { count: totalUnits })}
          </p>
        </CardContent>
      </Card>

      {/* Avg Order Value */}
      <Card className="@container/card">
        <CardHeader className="pb-2">
          <CardDescription className="text-xs sm:text-sm">
            {t("sales.stats.avgOrderValue.title")}
          </CardDescription>
          <CardTitle className="text-xl sm:text-2xl font-bold tabular-nums">
            {formatCurrency(avgOrderValue)}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <ShoppingCart className="size-3.5" />
            <span>{t("sales.stats.avgOrderValue.perOrder")}</span>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {t("sales.stats.avgOrderValue.itemsPerOrder", { value: itemsPerOrder })}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
