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

  const renderFooter = (key: string) => (
    <div className="text-muted-foreground">{t(key)}</div>
  )

  const renderTrendBadge = (className: string, key: string) => (
    <Badge variant="outline" className={className}>
      <IconTrendingUp className="size-3" />
      {t(key)}
    </Badge>
  )

  const cards = [
    {
      key: "users",
      label: t("stats.users.label"),
      value: totals.users.toLocaleString(locale),
      icon: IconUsers,
      badge: renderTrendBadge("border-success bg-muted text-success", "stats.users.badge"),
      footer: renderFooter("stats.users.footer"),
    },
    {
      key: "sellers",
      label: t("stats.sellers.label"),
      value: totals.sellers.toLocaleString(locale),
      icon: IconBuildingStore,
      badge: renderTrendBadge("border-info bg-muted text-info", "stats.sellers.badge"),
      footer: renderFooter("stats.sellers.footer"),
    },
    {
      key: "products",
      label: t("stats.products.label"),
      value: totals.products.toLocaleString(locale),
      icon: IconBox,
      badge: (
        <Badge variant="outline" className="border-selected-border bg-selected text-primary">
          {t("stats.products.badge")}
        </Badge>
      ),
      footer: renderFooter("stats.products.footer"),
    },
    {
      key: "orders",
      label: t("stats.orders.label"),
      value: totals.orders.toLocaleString(locale),
      icon: IconShoppingCart,
      badge: (
        <Badge variant="outline" className="border-warning bg-muted text-warning">
          {t("stats.orders.badge")}
        </Badge>
      ),
      footer: renderFooter("stats.orders.footer"),
    },
    {
      key: "revenue",
      label: t("stats.revenue.label"),
      value: formatAdminCurrency(totals.revenue, locale),
      icon: IconCurrencyDollar,
      badge: renderTrendBadge("border-success bg-muted text-success", "stats.revenue.badge"),
      footer: renderFooter("stats.revenue.footer"),
    },
  ] as const

  return (
    <StatCardGrid className="grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-5">
      {cards.map((card) => (
        <StatCard
          key={card.key}
          label={card.label}
          value={card.value}
          icon={card.icon}
          badge={card.badge}
          footer={card.footer}
        />
      ))}
    </StatCardGrid>
  )
}

