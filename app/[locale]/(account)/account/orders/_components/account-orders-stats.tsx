import { Clock as IconClock, DollarSign as IconCurrencyDollar, Package as IconPackage, Truck as IconTruckDelivery } from "lucide-react"
import { getTranslations } from "next-intl/server"

import { Badge } from "@/components/ui/badge"
import { StatCard, StatCardGrid } from "@/components/shared/stat-card"

interface OrdersStatsProps {
  stats: {
    total: number
    pending: number
    shipped: number
    completed: number
    totalSpend: number
  }
  locale: string
}

export async function AccountOrdersStats({ stats, locale }: OrdersStatsProps) {
  const t = await getTranslations({ locale, namespace: "Account" })

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    }).format(value)
  }

  return (
    <StatCardGrid>
      <StatCard
        icon={IconPackage}
        label={t("ordersStats.totalOrders")}
        value={stats.total.toLocaleString()}
        badge={<Badge variant="neutral-subtle">{t("ordersStats.allTime")}</Badge>}
      />

      <StatCard
        icon={IconClock}
        label={t("ordersStats.pending")}
        value={stats.pending.toLocaleString()}
        valueClassName={stats.pending > 0 ? "text-warning" : undefined}
        badge={
          <Badge variant={stats.pending > 0 ? "warning-subtle" : "neutral-subtle"}>
            {t("ordersStats.pending")}
          </Badge>
        }
      />

      <StatCard
        icon={IconTruckDelivery}
        label={t("ordersStats.shipped")}
        value={stats.shipped.toLocaleString()}
        badge={<Badge variant="info-subtle">{t("ordersStats.shipped")}</Badge>}
      />

      <StatCard
        icon={IconCurrencyDollar}
        label={t("ordersStats.totalSpent")}
        value={formatCurrency(stats.totalSpend)}
        badge={<Badge variant="info-subtle">{t("ordersStats.lifetime")}</Badge>}
      />
    </StatCardGrid>
  )
}

