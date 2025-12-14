import { requireDashboardAccess, getBusinessDashboardStats } from "@/lib/auth/business"
import { createClient } from "@/lib/supabase/server"
import { connection } from "next/server"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { 
  IconReceipt, 
  IconCurrencyDollar, 
  IconPercentage, 
  IconCalculator,
  IconDownload,
  IconFileSpreadsheet,
} from "@tabler/icons-react"

async function getAccountingData(sellerId: string) {
  const supabase = await createClient()
  
  // Get seller's commission rate and financial info
  const { data: seller } = await supabase
    .from('sellers')
    .select('commission_rate, tier, total_sales')
    .eq('id', sellerId)
    .single()
  
  // Get completed orders with revenue
  const { data: completedOrders } = await supabase
    .from('order_items')
    .select('quantity, price_at_time, created_at')
    .eq('seller_id', sellerId)
  
  const totalSales = completedOrders?.reduce((sum, item) => 
    sum + (Number(item.price_at_time) * item.quantity), 0) || 0
  
  const commissionRate = seller?.commission_rate || 10
  const totalCommission = totalSales * (commissionRate / 100)
  const netEarnings = totalSales - totalCommission
  
  return {
    totalSales,
    commissionRate,
    totalCommission,
    netEarnings,
    tier: seller?.tier || 'basic',
    ordersCount: completedOrders?.length || 0,
  }
}

export default async function BusinessAccountingPage() {
  await connection()
  
  // Requires paid business subscription
  const businessSeller = await requireDashboardAccess()
  const accountingData = await getAccountingData(businessSeller.id)
  // Note: Stats are available if needed for additional visualizations
  const _stats = await getBusinessDashboardStats(businessSeller.id)
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'BGN',
      maximumFractionDigits: 2,
    }).format(value)
  }

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
      {/* Shopify-style Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-bold tracking-tight">Finances</h1>
            {/* Key financial metrics as badges */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400">
                <IconCurrencyDollar className="size-3" />
                <span className="tabular-nums">{formatCurrency(accountingData.netEarnings)}</span>
                <span className="opacity-70">net</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-muted">
                <IconReceipt className="size-3" />
                <span className="tabular-nums">{accountingData.ordersCount}</span>
                <span className="opacity-70">orders</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700 dark:bg-orange-950/50 dark:text-orange-400">
                <IconPercentage className="size-3" />
                <span className="tabular-nums">{accountingData.commissionRate}%</span>
                <span className="opacity-70">fee</span>
              </span>
            </div>
          </div>
          <p className="text-muted-foreground text-sm">
            {accountingData.tier.charAt(0).toUpperCase() + accountingData.tier.slice(1)} tier · {formatCurrency(accountingData.totalSales)} gross sales
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <IconDownload className="size-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <IconFileSpreadsheet className="size-4 mr-2" />
            Tax Report
          </Button>
        </div>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <IconCurrencyDollar className="size-4" />
              Total Sales
            </CardDescription>
            <CardTitle className="text-2xl tabular-nums">
              {formatCurrency(accountingData.totalSales)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Gross revenue from {accountingData.ordersCount} orders
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <IconPercentage className="size-4" />
              Commission Rate
            </CardDescription>
            <CardTitle className="text-2xl tabular-nums">
              {accountingData.commissionRate}%
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant="outline" className="text-xs">
              {accountingData.tier} tier
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <IconCalculator className="size-4" />
              Total Commission
            </CardDescription>
            <CardTitle className="text-2xl tabular-nums text-red-600">
              -{formatCurrency(accountingData.totalCommission)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Platform fees
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <IconReceipt className="size-4" />
              Net Earnings
            </CardDescription>
            <CardTitle className="text-2xl tabular-nums text-emerald-600">
              {formatCurrency(accountingData.netEarnings)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Your take-home amount
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Commission Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Commission Breakdown</CardTitle>
          <CardDescription>
            Understand how your fees are calculated
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fee Type</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Rate</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Base Commission</TableCell>
                <TableCell className="text-muted-foreground">
                  Platform fee on each sale
                </TableCell>
                <TableCell>{accountingData.commissionRate}%</TableCell>
                <TableCell className="text-right tabular-nums">
                  {formatCurrency(accountingData.totalCommission)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Payment Processing</TableCell>
                <TableCell className="text-muted-foreground">
                  Stripe processing fees (included)
                </TableCell>
                <TableCell>Included</TableCell>
                <TableCell className="text-right tabular-nums text-muted-foreground">
                  {formatCurrency(0)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Listing Fees</TableCell>
                <TableCell className="text-muted-foreground">
                  Free for business accounts
                </TableCell>
                <TableCell>Free</TableCell>
                <TableCell className="text-right tabular-nums text-muted-foreground">
                  {formatCurrency(0)}
                </TableCell>
              </TableRow>
              <TableRow className="bg-muted/50">
                <TableCell className="font-bold">Total Fees</TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell className="text-right font-bold tabular-nums">
                  {formatCurrency(accountingData.totalCommission)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Payout Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Earnings Summary</CardTitle>
          <CardDescription>
            Your financial overview
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2 border-b">
              <span className="text-muted-foreground">Gross Sales</span>
              <span className="font-medium tabular-nums">{formatCurrency(accountingData.totalSales)}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b">
              <span className="text-muted-foreground">Commission ({accountingData.commissionRate}%)</span>
              <span className="font-medium tabular-nums text-red-600">-{formatCurrency(accountingData.totalCommission)}</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="font-bold">Net Earnings</span>
              <span className="font-bold text-xl tabular-nums text-emerald-600">{formatCurrency(accountingData.netEarnings)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Business Information */}
      <Card>
        <CardHeader>
          <CardTitle>Business Information</CardTitle>
          <CardDescription>
            Your business details for invoicing
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm text-muted-foreground">Business Name</p>
              <p className="font-medium">{businessSeller.business_name || businessSeller.store_name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Account Type</p>
              <Badge variant="outline" className="mt-1">
                {businessSeller.account_type === 'business' ? 'Business Account' : 'Personal Account'}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Verification Status</p>
              <Badge 
                variant="outline" 
                className={businessSeller.is_verified_business 
                  ? 'mt-1 bg-emerald-50 text-emerald-700 border-emerald-200' 
                  : 'mt-1'
                }
              >
                {businessSeller.is_verified_business ? 'Verified Business' : 'Not Verified'}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Subscription Tier</p>
              <Badge variant="outline" className="mt-1">
                {businessSeller.tier}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
