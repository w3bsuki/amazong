import { Box as IconBox, Store as IconBuildingStore, DollarSign as IconCurrencyDollar, ShoppingCart as IconShoppingCart, TrendingUp as IconTrendingUp, Users as IconUsers } from "lucide-react";

import { useLocale, useTranslations } from "next-intl"

import { Badge } from "@/components/ui/badge"
import { StatCard, StatCardGrid } from "@/components/shared/stat-card"

interface AdminStatsProps {
  totals: {
    users: number
    products: number
    orders: number
    sellers: number
    revenue: number
  }
}

function formatAdminCurrency(value: number, locale: string) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "BGN",
    maximumFractionDigits: 0,
  }).format(value)
}

export function AdminStatsCards({ totals }: AdminStatsProps) {
  const t = useTranslations("AdminDashboard")
  const locale = useLocale()

  return (
    <StatCardGrid className="grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-5">
      <StatCard
        label={t("stats.users.label")}
        value={totals.users.toLocaleString(locale)}
        icon={IconUsers}
        badge={
          <Badge variant="outline" className="border-success bg-muted text-success">
            <IconTrendingUp className="size-3" />
            {t("stats.users.badge")}
          </Badge>
        }
        footer={<div className="text-muted-foreground">{t("stats.users.footer")}</div>}
      />

      <StatCard
        label={t("stats.sellers.label")}
        value={totals.sellers.toLocaleString(locale)}
        icon={IconBuildingStore}
        badge={
          <Badge variant="outline" className="border-info bg-muted text-info">
            <IconTrendingUp className="size-3" />
            {t("stats.sellers.badge")}
          </Badge>
        }
        footer={<div className="text-muted-foreground">{t("stats.sellers.footer")}</div>}
      />

      <StatCard
        label={t("stats.products.label")}
        value={totals.products.toLocaleString(locale)}
        icon={IconBox}
        badge={
          <Badge variant="outline" className="border-selected-border bg-selected text-primary">
            {t("stats.products.badge")}
          </Badge>
        }
        footer={<div className="text-muted-foreground">{t("stats.products.footer")}</div>}
      />

      <StatCard
        label={t("stats.orders.label")}
        value={totals.orders.toLocaleString(locale)}
        icon={IconShoppingCart}
        badge={<Badge variant="outline" className="border-warning bg-muted text-warning">{t("stats.orders.badge")}</Badge>}
        footer={<div className="text-muted-foreground">{t("stats.orders.footer")}</div>}
      />

      <StatCard
        label={t("stats.revenue.label")}
        value={formatAdminCurrency(totals.revenue, locale)}
        icon={IconCurrencyDollar}
        badge={
          <Badge variant="outline" className="border-success bg-muted text-success">
            <IconTrendingUp className="size-3" />
            {t("stats.revenue.badge")}
          </Badge>
        }
        footer={<div className="text-muted-foreground">{t("stats.revenue.footer")}</div>}
      />
    </StatCardGrid>
  )
}

