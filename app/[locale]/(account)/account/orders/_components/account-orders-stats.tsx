import { Clock as IconClock, DollarSign as IconCurrencyDollar, Package as IconPackage, Truck as IconTruckDelivery } from "lucide-react";


import { Badge } from "@/components/ui/badge"
import { StatCard, StatCardGrid } from "@/components/shared/stat-card"

interface OrdersStatsProps {
  stats: {
    total: number
    pending: number
    delivered: number
    cancelled: number
    totalSpend: number
  }
  locale: string
}

export function AccountOrdersStats({ stats, locale }: OrdersStatsProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(value)
  }

  const t = {
    totalOrders: locale === 'bg' ? 'Общо поръчки' : 'Total Orders',
    totalOrdersDesc: locale === 'bg' ? 'Направени поръчки' : 'Orders placed',
    inProgress: locale === 'bg' ? 'В процес' : 'In Progress',
    inProgressDesc: locale === 'bg' ? 'Очакващи доставка' : 'Awaiting delivery',
    pending: locale === 'bg' ? 'Активни' : 'Active',
    delivered: locale === 'bg' ? 'Доставени' : 'Delivered',
    deliveredDesc: locale === 'bg' ? 'Успешно получени' : 'Successfully received',
    completed: locale === 'bg' ? 'Завършени' : 'Completed',
    totalSpent: locale === 'bg' ? 'Общо похарчени' : 'Total Spent',
    totalSpentDesc: locale === 'bg' ? 'Всички поръчки' : 'Across all orders',
    lifetime: locale === 'bg' ? 'От началото' : 'Lifetime',
    allTime: locale === 'bg' ? 'Всички' : 'All time',
  }

  return (
    <>
      {/* Mobile: Clean minimal stats row */}
      <div className="flex items-center gap-3 text-sm sm:hidden">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-background border border-border-subtle">
          <IconPackage className="size-4 text-primary" />
          <span className="font-semibold">{stats.total}</span>
          <span className="text-muted-foreground">{locale === 'bg' ? 'поръчки' : 'orders'}</span>
        </div>
        {stats.pending > 0 && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-warning/20 bg-warning/10">
            <span className="size-2 rounded-full bg-warning animate-pulse" />
            <span className="font-semibold text-warning">{stats.pending}</span>
            <span className="text-warning/70">{locale === 'bg' ? 'активни' : 'active'}</span>
          </div>
        )}
      </div>

      {/* Desktop: Full stats cards */}
      <StatCardGrid className="hidden sm:grid">
        <StatCard
          icon={IconPackage}
          label={t.totalOrders}
          value={stats.total.toLocaleString()}
          badge={
            <Badge variant="outline" className="text-muted-foreground border-border">
              {t.allTime}
            </Badge>
          }
        />

        <StatCard
          icon={IconClock}
          label={t.inProgress}
          value={stats.pending.toLocaleString()}
          valueClassName={stats.pending > 0 ? "text-warning" : undefined}
          badge={
            <Badge
              variant="outline"
              className={stats.pending > 0 ? "border-warning/20 bg-warning/10 text-warning" : "text-muted-foreground border-border"}
            >
              {t.pending}
            </Badge>
          }
        />

        <StatCard
          icon={IconTruckDelivery}
          label={t.delivered}
          value={stats.delivered.toLocaleString()}
          valueClassName="text-success"
          badge={
            <Badge variant="outline" className="border-success/20 bg-success/10 text-success">
              {t.completed}
            </Badge>
          }
        />

        <StatCard
          icon={IconCurrencyDollar}
          label={t.totalSpent}
          value={formatCurrency(stats.totalSpend)}
          badge={
            <Badge variant="outline" className="text-info border-border-subtle bg-info/10">
              {t.lifetime}
            </Badge>
          }
        />
      </StatCardGrid>
    </>
  )
}

