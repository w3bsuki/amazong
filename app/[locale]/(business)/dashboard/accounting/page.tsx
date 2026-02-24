import { requireDashboardAccess } from "@/lib/auth/business"
import { createClient } from "@/lib/supabase/server"
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
import { Calculator as IconCalculator, DollarSign as IconCurrencyDollar, Download as IconDownload, FileSpreadsheet as IconFileSpreadsheet, Percent as IconPercentage, Receipt as IconReceipt } from "lucide-react";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "BGN",
    maximumFractionDigits: 2,
  }).format(value)
}

async function getAccountingData(sellerId: string) {
  const supabase = await createClient()
  
  // Get profile's commission rate and financial info
  const [
    { data: seller },
    { data: privateProfile },
  ] = await Promise.all([
    supabase
      .from('profiles')
      .select('tier')
      .eq('id', sellerId)
      .single(),
    supabase
      .from('private_profiles')
      .select('commission_rate')
      .eq('id', sellerId)
      .maybeSingle(),
  ])
  
  // Get completed orders with revenue (order_items doesn't have created_at, join orders)
  const { data: completedOrders } = await supabase
    .from('order_items')
    .select('quantity, price_at_purchase, order:orders(created_at)')
    .eq('seller_id', sellerId)

  const totalSales = completedOrders?.reduce((sum, item) => 
    sum + (Number(item.price_at_purchase) * item.quantity), 0) || 0
  
  const commissionRate = Number(privateProfile?.commission_rate ?? 0)
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

export const metadata = {
  title: "Business Finances | Treido",
  description: "Review sales, fees, and earnings for your Treido store.",
}

export default async function BusinessAccountingPage() {
  // Requires paid business subscription
  const businessSeller = await requireDashboardAccess()
  const accountingData = await getAccountingData(businessSeller.id)

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-4 md:py-6 px-4 lg:px-6">
      {/* Shopify-style Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-bold tracking-tight">Finances</h1>
            {/* Key financial metrics as badges */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border border-success/20 bg-success/10 text-success">
                <IconCurrencyDollar className="size-3" />
                <span className="tabular-nums">{formatCurrency(accountingData.netEarnings)}</span>
                <span className="opacity-70">net</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-muted">
                <IconReceipt className="size-3" />
                <span className="tabular-nums">{accountingData.ordersCount}</span>
                <span className="opacity-70">orders</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border border-warning/20 bg-warning/10 text-warning">
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
            <CardTitle className="text-2xl tabular-nums text-destructive">
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
            <CardTitle className="text-2xl tabular-nums text-success">
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
              <TableRow className="bg-surface-subtle">
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
              <span className="font-medium tabular-nums text-destructive">-{formatCurrency(accountingData.totalCommission)}</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="font-bold">Net Earnings</span>
              <span className="font-bold text-xl tabular-nums text-success">{formatCurrency(accountingData.netEarnings)}</span>
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
                  ? 'mt-1 border-success/20 bg-success/10 text-success' 
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
