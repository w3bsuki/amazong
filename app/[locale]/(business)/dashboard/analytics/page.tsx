import { requireDashboardAccess, getBusinessDashboardStats } from "@/lib/auth/business"
import { ChartAreaInteractive } from "@/components/charts/chart-area-interactive"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { IconChartBar, IconTrendingUp, IconCurrencyDollar, IconEye, IconShoppingCart } from "@tabler/icons-react"

export default async function BusinessAnalyticsPage() {
  // Requires paid business subscription
  const businessSeller = await requireDashboardAccess()
  const stats = await getBusinessDashboardStats(businessSeller.id)
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'BGN',
      maximumFractionDigits: 2,
    }).format(value)
  }

  // Calculate average order value
  const avgOrderValue = stats.totals.orders > 0 
    ? stats.totals.revenue / stats.totals.orders 
    : 0

  // Calculate conversion rate (orders / views * 100)
  const conversionRate = stats.totals.views > 0 
    ? (stats.totals.orders / stats.totals.views * 100) 
    : 0

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-4 md:py-6 px-4 lg:px-6">
      {/* Shopify-style Header with Key Metrics */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
            {/* Key metrics as compact badges */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border border-success/20 bg-success/10 text-success">
                <IconCurrencyDollar className="size-3" />
                <span className="tabular-nums">{formatCurrency(stats.totals.revenue)}</span>
                <span className="opacity-70">revenue</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border border-info/20 bg-info/10 text-info">
                <IconEye className="size-3" />
                <span className="tabular-nums">{stats.totals.views.toLocaleString()}</span>
                <span className="opacity-70">views</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border border-selected-border bg-selected text-primary">
                <IconTrendingUp className="size-3" />
                <span className="tabular-nums">{conversionRate.toFixed(1)}%</span>
                <span className="opacity-70">conversion</span>
              </span>
            </div>
          </div>
          <p className="text-muted-foreground text-sm">
            Last 30 days · Avg order {formatCurrency(avgOrderValue)}
          </p>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <IconCurrencyDollar className="size-4" />
              Total Revenue
            </CardDescription>
            <CardTitle className="text-2xl tabular-nums">
              {formatCurrency(stats.totals.revenue)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Last 30 days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <IconShoppingCart className="size-4" />
              Avg Order Value
            </CardDescription>
            <CardTitle className="text-2xl tabular-nums">
              {formatCurrency(avgOrderValue)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Per transaction
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <IconEye className="size-4" />
              Total Views
            </CardDescription>
            <CardTitle className="text-2xl tabular-nums">
              {stats.totals.views.toLocaleString()}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Product page visits
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <IconTrendingUp className="size-4" />
              Conversion Rate
            </CardDescription>
            <CardTitle className="text-2xl tabular-nums">
              {conversionRate.toFixed(2)}%
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Views to orders
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Sales Overview</CardTitle>
          <CardDescription>
            Track your revenue trends over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartAreaInteractive />
        </CardContent>
      </Card>

      {/* Performance Summary */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Store Performance</CardTitle>
            <CardDescription>Key metrics summary</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Total Products</span>
                <span className="font-medium">{stats.totals.products}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Total Orders</span>
                <span className="font-medium">{stats.totals.orders}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Total Revenue</span>
                <span className="font-medium text-success">{formatCurrency(stats.totals.revenue)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Store Rating</span>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{stats.totals.rating.toFixed(1)}</span>
                  <Badge variant="outline" className="text-xs">
                    {stats.totals.totalReviews} reviews
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Tips to Improve</CardTitle>
            <CardDescription>Suggestions for better performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.totals.products < 10 && (
                <div className="flex items-start gap-3 p-3 rounded-lg bg-surface-subtle">
                  <IconChartBar className="size-5 text-info mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Add more products</p>
                    <p className="text-xs text-muted-foreground">
                      Stores with 10+ products get more visibility
                    </p>
                  </div>
                </div>
              )}
              {stats.totals.views < 100 && (
                <div className="flex items-start gap-3 p-3 rounded-lg bg-surface-subtle">
                  <IconEye className="size-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Boost your listings</p>
                    <p className="text-xs text-muted-foreground">
                      Boosted products appear higher in search results
                    </p>
                  </div>
                </div>
              )}
              {conversionRate < 2 && (
                <div className="flex items-start gap-3 p-3 rounded-lg bg-surface-subtle">
                  <IconTrendingUp className="size-5 text-success mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Improve product photos</p>
                    <p className="text-xs text-muted-foreground">
                      High-quality images can increase conversion by 30%
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
