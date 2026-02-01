"use client"

import { IconTrendingUp, IconUsers, IconBox, IconShoppingCart, IconCurrencyDollar, IconBuildingStore } from "@tabler/icons-react"
import { useLocale, useTranslations } from "next-intl"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface AdminStatsProps {
  totals: {
    users: number
    products: number
    orders: number
    sellers: number
    revenue: number
  }
}

export function AdminStatsCards({ totals }: AdminStatsProps) {
  const t = useTranslations("AdminDashboard")
  const locale = useLocale()

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: "BGN",
      maximumFractionDigits: 0,
    }).format(value)
  }

  return (
    <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-5">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription className="flex items-center gap-2">
            <IconUsers className="size-4" />
            {t("stats.users.label")}
          </CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {totals.users.toLocaleString(locale)}
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="border-success bg-muted text-success">
              <IconTrendingUp className="size-3" />
              {t("stats.users.badge")}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="text-muted-foreground">{t("stats.users.footer")}</div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription className="flex items-center gap-2">
            <IconBuildingStore className="size-4" />
            {t("stats.sellers.label")}
          </CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {totals.sellers.toLocaleString(locale)}
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="border-info bg-muted text-info">
              <IconTrendingUp className="size-3" />
              {t("stats.sellers.badge")}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="text-muted-foreground">{t("stats.sellers.footer")}</div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription className="flex items-center gap-2">
            <IconBox className="size-4" />
            {t("stats.products.label")}
          </CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {totals.products.toLocaleString(locale)}
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="border-selected-border bg-selected text-primary">
              {t("stats.products.badge")}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="text-muted-foreground">{t("stats.products.footer")}</div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription className="flex items-center gap-2">
            <IconShoppingCart className="size-4" />
            {t("stats.orders.label")}
          </CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {totals.orders.toLocaleString(locale)}
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="border-warning bg-muted text-warning">
              {t("stats.orders.badge")}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="text-muted-foreground">{t("stats.orders.footer")}</div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription className="flex items-center gap-2">
            <IconCurrencyDollar className="size-4" />
            {t("stats.revenue.label")}
          </CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {formatCurrency(totals.revenue)}
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="border-success bg-muted text-success">
              <IconTrendingUp className="size-3" />
              {t("stats.revenue.badge")}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="text-muted-foreground">{t("stats.revenue.footer")}</div>
        </CardFooter>
      </Card>
    </div>
  )
}
