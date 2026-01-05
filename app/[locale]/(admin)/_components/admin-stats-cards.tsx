"use client"

import { IconTrendingUp, IconUsers, IconBox, IconShoppingCart, IconCurrencyDollar, IconBuildingStore } from "@tabler/icons-react"

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
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
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
            Total Users
          </CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {totals.users.toLocaleString()}
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="border-success/20 bg-success/10 text-success">
              <IconTrendingUp className="size-3" />
              Active
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="text-muted-foreground">Registered accounts</div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription className="flex items-center gap-2">
            <IconBuildingStore className="size-4" />
            Sellers
          </CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {totals.sellers.toLocaleString()}
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="border-info/20 bg-info/10 text-info">
              <IconTrendingUp className="size-3" />
              Active
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="text-muted-foreground">Active seller accounts</div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription className="flex items-center gap-2">
            <IconBox className="size-4" />
            Products
          </CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {totals.products.toLocaleString()}
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="border-primary/20 bg-primary/10 text-primary">Listed</Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="text-muted-foreground">Active listings</div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription className="flex items-center gap-2">
            <IconShoppingCart className="size-4" />
            Orders
          </CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {totals.orders.toLocaleString()}
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="border-warning/20 bg-warning/10 text-warning">Total</Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="text-muted-foreground">Lifetime orders</div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription className="flex items-center gap-2">
            <IconCurrencyDollar className="size-4" />
            Revenue
          </CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {formatCurrency(totals.revenue)}
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="border-success/20 bg-success/10 text-success">
              <IconTrendingUp className="size-3" />
              Paid
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="text-muted-foreground">From paid orders</div>
        </CardFooter>
      </Card>
    </div>
  )
}
