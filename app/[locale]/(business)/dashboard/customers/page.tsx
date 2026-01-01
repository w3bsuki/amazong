import { requireDashboardAccess, getBusinessCustomers } from "@/lib/auth/business"
import Link from "next/link"
import { format } from "date-fns"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { BusinessEmptyState } from "../../_components/business-empty-state"
import { 
  IconUsers, 
  IconMail, 
  IconMessage,
  IconTrendingUp,
  IconShoppingCart,
  IconCurrencyDollar,
} from "@tabler/icons-react"

export default async function BusinessCustomersPage() {
  // Requires paid business subscription
  const businessSeller = await requireDashboardAccess()
  const { customers, total } = await getBusinessCustomers(businessSeller.id)
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'BGN',
      maximumFractionDigits: 2,
    }).format(value)
  }

  // Calculate summary stats
  const totalRevenue = customers.reduce((sum, c) => sum + c.total_spent, 0)
  const avgOrderValue = total > 0 ? totalRevenue / customers.reduce((sum, c) => sum + c.total_orders, 0) : 0
  const repeatCustomers = customers.filter(c => c.total_orders > 1).length

  if (total === 0) {
    return <BusinessEmptyState type="customers" />
  }

  const returnRate = total > 0 ? Math.round((repeatCustomers / total) * 100) : 0

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-4 md:py-6 px-4 lg:px-6">
      {/* Shopify-style Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-bold tracking-tight">Customers</h1>
            {/* Customer metrics as badges */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400">
                <IconUsers className="size-3" />
                <span className="tabular-nums">{total.toLocaleString()}</span>
                <span className="opacity-70">total</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400">
                <IconTrendingUp className="size-3" />
                <span className="tabular-nums">{repeatCustomers}</span>
                <span className="opacity-70">repeat ({returnRate}%)</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700 dark:bg-purple-950/50 dark:text-purple-400">
                <IconCurrencyDollar className="size-3" />
                <span className="tabular-nums">{formatCurrency(totalRevenue)}</span>
                <span className="opacity-70">lifetime</span>
              </span>
            </div>
          </div>
          <p className="text-muted-foreground text-sm">
            Avg order value {formatCurrency(avgOrderValue)} · {customers.reduce((sum, c) => sum + c.total_orders, 0)} total orders
          </p>
        </div>
      </div>

      {/* Customer Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <IconUsers className="size-4" />
              Total Customers
            </CardDescription>
            <CardTitle className="text-2xl tabular-nums">
              {total.toLocaleString()}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Unique buyers
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <IconTrendingUp className="size-4 text-emerald-600" />
              Repeat Customers
            </CardDescription>
            <CardTitle className="text-2xl tabular-nums text-emerald-600">
              {repeatCustomers.toLocaleString()}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              {returnRate}% return rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <IconCurrencyDollar className="size-4" />
              Total Revenue
            </CardDescription>
            <CardTitle className="text-2xl tabular-nums">
              {formatCurrency(totalRevenue)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              From all customers
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
      </div>

      {/* Customers Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">All Customers</CardTitle>
          <CardDescription>
            Customers who have purchased from your store
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Orders</TableHead>
                <TableHead>Total Spent</TableHead>
                <TableHead>Last Order</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="size-8">
                        <AvatarImage src={customer.avatar_url || undefined} />
                        <AvatarFallback className="text-xs">
                          {(customer.full_name || customer.email || "?").charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">
                          {customer.full_name || "Anonymous"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {customer.email}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="font-normal">
                      {customer.total_orders} order{customer.total_orders !== 1 ? 's' : ''}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium tabular-nums">
                    {formatCurrency(customer.total_spent)}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {format(new Date(customer.last_order), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" className="size-8" asChild>
                        <Link href={`/messages?user=${customer.id}`}>
                          <IconMessage className="size-4" />
                        </Link>
                      </Button>
                      <Button variant="ghost" size="icon" className="size-8" asChild>
                        <a href={`mailto:${customer.email}`}>
                          <IconMail className="size-4" />
                        </a>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
