import { Box as IconBox, DollarSign as IconCurrencyDollar, Eye as IconEye, ShoppingCart as IconShoppingCart, Star as IconStar, TrendingUp as IconTrendingUp } from "lucide-react";


import { Badge } from "@/components/ui/badge"
import { StatCard, StatCardGrid } from "@/components/shared/stat-card"

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
    <StatCardGrid className="gap-2 sm:gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-5">
      <StatCard
        icon={IconCurrencyDollar}
        label="Revenue (30d)"
        value={formatCurrencyBGN(totals.revenue)}
        badge={
          <Badge variant="outline" className="border-success/20 bg-success/10 text-success">
            <IconTrendingUp className="size-3" />
            Sales
          </Badge>
        }
        footer={<div className="text-muted-foreground">Last 30 days earnings</div>}
      />

      <StatCard
        icon={IconShoppingCart}
        label="Orders (30d)"
        value={totals.orders.toLocaleString()}
        badge={
          <Badge variant="outline" className="border-info/20 bg-info/10 text-info">
            <IconTrendingUp className="size-3" />
            Active
          </Badge>
        }
        footer={<div className="text-muted-foreground">Orders received</div>}
      />

      <StatCard
        icon={IconBox}
        label="Products"
        value={totals.products.toLocaleString()}
        badge={
          <Badge variant="outline" className="border-selected-border bg-selected text-primary">
            Listed
          </Badge>
        }
        footer={<div className="text-muted-foreground">Active listings</div>}
      />

      <StatCard
        icon={IconEye}
        label="Views"
        value={totals.views.toLocaleString()}
        badge={
          <Badge variant="outline" className="border-warning/20 bg-warning/10 text-warning">
            Total
          </Badge>
        }
        footer={<div className="text-muted-foreground">Product views</div>}
      />

      <StatCard
        icon={IconStar}
        label="Rating"
        value={totals.rating.toFixed(1)}
        badge={
          <Badge variant="outline" className="border-warning/20 bg-warning/10 text-warning">
            {totals.totalReviews} reviews
          </Badge>
        }
        footer={<div className="text-muted-foreground">Average rating</div>}
      />
    </StatCardGrid>
  )
}
