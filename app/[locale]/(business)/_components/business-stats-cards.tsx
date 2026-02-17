import { Box as IconBox, DollarSign as IconCurrencyDollar, Eye as IconEye, ShoppingCart as IconShoppingCart, Star as IconStar, TrendingUp as IconTrendingUp } from "lucide-react";


import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface BusinessStatsProps {
  totals: {
    products: number
    orders: number
    revenue: number
    views: number
    rating: number
    totalReviews: number
  }
}

const formatCurrencyBGN = (value: number, maximumFractionDigits = 0) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "BGN",
    maximumFractionDigits,
  }).format(value)

export function BusinessStatsCards({ totals }: BusinessStatsProps) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-5">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription className="flex items-center gap-2">
            <IconCurrencyDollar className="size-4" />
            Revenue (30d)
          </CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {formatCurrencyBGN(totals.revenue)}
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="border-success/20 bg-success/10 text-success">
              <IconTrendingUp className="size-3" />
              Sales
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="text-muted-foreground">
            Last 30 days earnings
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription className="flex items-center gap-2">
            <IconShoppingCart className="size-4" />
            Orders (30d)
          </CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {totals.orders.toLocaleString()}
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="border-info/20 bg-info/10 text-info">
              <IconTrendingUp className="size-3" />
              Active
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="text-muted-foreground">
            Orders received
          </div>
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
            <Badge variant="outline" className="border-selected-border bg-selected text-primary">
              Listed
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="text-muted-foreground">
            Active listings
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription className="flex items-center gap-2">
            <IconEye className="size-4" />
            Views
          </CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {totals.views.toLocaleString()}
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="border-warning/20 bg-warning/10 text-warning">
              Total
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="text-muted-foreground">
            Product views
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription className="flex items-center gap-2">
            <IconStar className="size-4" />
            Rating
          </CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {totals.rating.toFixed(1)}
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="border-warning/20 bg-warning/10 text-warning">
              {totals.totalReviews} reviews
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="text-muted-foreground">
            Average rating
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
