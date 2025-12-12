"use client"

import { IconTrendingUp, IconPackage, IconChartLine, IconBuildingStore, IconMessage } from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface AccountStatsProps {
  totals: {
    orders: number
    pendingOrders: number
    sales: number
    revenue: number
    products: number
    messages: number
    wishlist: number
  }
  locale: string
}

export function AccountStatsCards({ totals, locale }: AccountStatsProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: locale === 'bg' ? 'BGN' : 'EUR',
      maximumFractionDigits: 0,
    }).format(value)
  }

  const t = {
    orders: locale === 'bg' ? 'Поръчки' : 'Orders',
    ordersDesc: locale === 'bg' ? 'Направени поръчки' : 'Orders placed',
    pending: locale === 'bg' ? 'В изпълнение' : 'In progress',
    sales: locale === 'bg' ? 'Продажби' : 'Sales',
    salesDesc: locale === 'bg' ? 'Продадени артикули' : 'Items sold',
    revenue: locale === 'bg' ? 'Приходи' : 'Revenue',
    revenueDesc: locale === 'bg' ? 'От продажби' : 'From sales',
    products: locale === 'bg' ? 'Обяви' : 'Listings',
    productsDesc: locale === 'bg' ? 'Активни продукти' : 'Active products',
    active: locale === 'bg' ? 'Активни' : 'Active',
    messages: locale === 'bg' ? 'Съобщения' : 'Messages',
    messagesDesc: locale === 'bg' ? 'Непрочетени' : 'Unread',
    wishlist: locale === 'bg' ? 'Любими' : 'Wishlist',
    wishlistDesc: locale === 'bg' ? 'Запазени продукти' : 'Saved items',
  }

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription className="flex items-center gap-2">
            <IconPackage className="size-4" />
            {t.orders}
          </CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {totals.orders.toLocaleString()}
          </CardTitle>
          <CardAction>
            {totals.pendingOrders > 0 ? (
              <Badge variant="outline" className="text-orange-600 border-orange-200 bg-orange-50">
                {totals.pendingOrders} {t.pending}
              </Badge>
            ) : (
              <Badge variant="outline" className="text-emerald-600 border-emerald-200 bg-emerald-50">
                <IconTrendingUp className="size-3" />
                {t.active}
              </Badge>
            )}
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="text-muted-foreground">
            {t.ordersDesc}
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription className="flex items-center gap-2">
            <IconChartLine className="size-4" />
            {t.sales}
          </CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {totals.sales.toLocaleString()}
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="text-emerald-600 border-emerald-200 bg-emerald-50">
              <IconTrendingUp className="size-3" />
              {formatCurrency(totals.revenue)}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="text-muted-foreground">
            {t.salesDesc}
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription className="flex items-center gap-2">
            <IconBuildingStore className="size-4" />
            {t.products}
          </CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {totals.products.toLocaleString()}
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="text-purple-600 border-purple-200 bg-purple-50">
              {t.active}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="text-muted-foreground">
            {t.productsDesc}
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription className="flex items-center gap-2">
            <IconMessage className="size-4" />
            {t.messages}
          </CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {totals.messages.toLocaleString()}
          </CardTitle>
          <CardAction>
            {totals.messages > 0 ? (
              <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50">
                {t.messagesDesc}
              </Badge>
            ) : (
              <Badge variant="outline" className="text-gray-600 border-gray-200 bg-gray-50">
                {t.messagesDesc}
              </Badge>
            )}
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="text-muted-foreground">
            {t.messagesDesc}
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
