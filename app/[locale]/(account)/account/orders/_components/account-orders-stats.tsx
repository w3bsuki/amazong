"use client"

import { IconPackage, IconTruckDelivery, IconClock, IconCurrencyDollar } from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

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
      <div className="hidden sm:grid grid-cols-2 gap-3 @xl/main:grid-cols-4">
        <Card className="@container/card">
          <CardHeader>
            <CardDescription className="flex items-center gap-1.5">
              <IconPackage className="size-4 shrink-0" />
              <span className="truncate">{t.totalOrders}</span>
            </CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {stats.total.toLocaleString()}
            </CardTitle>
            <CardAction>
              <Badge variant="outline" className="text-muted-foreground border-border">
                {t.allTime}
              </Badge>
            </CardAction>
          </CardHeader>
        </Card>

        <Card className="@container/card">
          <CardHeader>
            <CardDescription className="flex items-center gap-1.5">
              <IconClock className="size-4 shrink-0" />
              <span className="truncate">{t.inProgress}</span>
            </CardDescription>
            <CardTitle className={`text-2xl font-semibold tabular-nums @[250px]/card:text-3xl ${stats.pending > 0 ? 'text-warning' : ''}`}>
              {stats.pending.toLocaleString()}
            </CardTitle>
            <CardAction>
              {stats.pending > 0 ? (
                <Badge variant="outline" className="border-warning/20 bg-warning/10 text-warning">
                  {t.pending}
                </Badge>
              ) : (
                <Badge variant="outline" className="text-muted-foreground border-border">
                  {t.pending}
                </Badge>
              )}
            </CardAction>
          </CardHeader>
        </Card>

        <Card className="@container/card">
          <CardHeader>
            <CardDescription className="flex items-center gap-1.5">
              <IconTruckDelivery className="size-4 shrink-0" />
              <span className="truncate">{t.delivered}</span>
            </CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums text-success @[250px]/card:text-3xl">
              {stats.delivered.toLocaleString()}
            </CardTitle>
            <CardAction>
              <Badge variant="outline" className="border-success/20 bg-success/10 text-success">
                {t.completed}
              </Badge>
            </CardAction>
          </CardHeader>
        </Card>

        <Card className="@container/card">
          <CardHeader>
            <CardDescription className="flex items-center gap-1.5">
              <IconCurrencyDollar className="size-4 shrink-0" />
              <span className="truncate">{t.totalSpent}</span>
            </CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {formatCurrency(stats.totalSpend)}
            </CardTitle>
            <CardAction>
              <Badge variant="outline" className="text-info border-border-subtle bg-info/10">
                {t.lifetime}
              </Badge>
            </CardAction>
          </CardHeader>
        </Card>
      </div>
    </>
  )
}
