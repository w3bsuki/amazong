import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { AppBreadcrumb } from "@/components/navigation/app-breadcrumb"
import { SalesChart } from "./_components/sales-chart"
import { SalesStats } from "./_components/sales-stats"
import { SalesTable } from "./_components/sales-table"
import { PendingActions } from "./_components/pending-actions"
import { ExportSales } from "./_components/export-sales"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  CurrencyCircleDollar,
  ChartLineUp,
  Storefront,
  Plus,
} from "@phosphor-icons/react/dist/ssr"

import type { SaleItem } from "./types"
export type { SaleItem } from "./types"

interface SalesPageProps {
  params: Promise<{
    locale: string
  }>
  searchParams: Promise<{
    period?: string
  }>
}

export default async function SalesPage({ params, searchParams }: SalesPageProps) {
  const { locale } = await params
  const { period = "30d" } = await searchParams
  const supabase = await createClient()

  if (!supabase) {
    redirect("/auth/login")
  }

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Check if user has a seller profile (has username)
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  // If no username, redirect to sell page to set one up
  if (!profile || !profile.username) {
    redirect(`/${locale}/sell`)
  }
  
  // Map profile to seller format for compatibility
  const seller = {
    ...profile,
    store_name: profile.display_name || profile.business_name || profile.username,
  }

  // Calculate date range
  const now = new Date()
  let startDate = new Date()
  
  switch (period) {
    case "7d":
      startDate.setDate(now.getDate() - 7)
      break
    case "30d":
      startDate.setDate(now.getDate() - 30)
      break
    case "90d":
      startDate.setDate(now.getDate() - 90)
      break
    case "1y":
      startDate.setFullYear(now.getFullYear() - 1)
      break
    default:
      startDate.setDate(now.getDate() - 30)
  }

  // Fetch sales (order_items where seller_id matches)
  const { data: salesData } = await supabase
    .from("order_items")
    .select("id, order_id, product_id, quantity, price_at_purchase, status")
    .eq("seller_id", user.id)

  // Pending actions (counts)
  const { count: ordersToShipCount } = await supabase
    .from("order_items")
    .select("id", { count: "exact", head: true })
    .eq("seller_id", user.id)
    .is("shipped_at", null)
    .in("status", ["paid", "processing"])

  const { count: unreadMessagesCount } = await supabase
    .from("conversations")
    .select("id", { count: "exact", head: true })
    .eq("seller_id", user.id)
    .gt("seller_unread_count", 0)

  const { count: lowStockCount } = await supabase
    .from("products")
    .select("id", { count: "exact", head: true })
    .eq("seller_id", user.id)
    .eq("status", "active")
    .gt("stock", 0)
    .lte("stock", 2)

  // Get unique order IDs and product IDs
  const orderIds = [...new Set((salesData || []).map(s => s.order_id))]
  const productIds = [...new Set((salesData || []).map(s => s.product_id))]
  
  // Fetch orders with date filter
  const { data: ordersData } = orderIds.length > 0 
    ? await supabase
        .from("orders")
        .select("id, status, created_at, shipping_address, user_id")
        .in("id", orderIds)
        .gte("created_at", startDate.toISOString())
        .order("created_at", { ascending: false })
    : { data: [] }
  
  // Get buyer profiles for the orders
  const buyerIds = [...new Set((ordersData || []).map(o => o.user_id))]
  const { data: buyersData } = buyerIds.length > 0
    ? await supabase
        .from("profiles")
        .select("id, email, full_name")
        .in("id", buyerIds)
    : { data: [] }
  
  // Fetch products
  const { data: productsData } = productIds.length > 0
    ? await supabase
        .from("products")
        .select("id, title, images, price")
        .in("id", productIds)
    : { data: [] }
  
  // Create lookup maps
  const ordersMap = new Map((ordersData || []).map(o => [o.id, o]))
  const buyersMap = new Map((buyersData || []).map(b => [b.id, b]))
  const productsMap = new Map((productsData || []).map(p => [p.id, p]))

  // Transform the data to match our interface - filter only items with orders in date range
  const sales: SaleItem[] = (salesData || [])
    .filter(item => ordersMap.has(item.order_id))
    .map((item) => {
      const order = ordersMap.get(item.order_id)
      const product = productsMap.get(item.product_id)
      const buyer = order ? buyersMap.get(order.user_id) : null
      return {
        id: item.id,
        order_id: item.order_id,
        product_id: item.product_id,
        quantity: item.quantity,
        price_at_purchase: item.price_at_purchase,
        created_at: order?.created_at || '',
        status: typeof order?.status === 'string' ? order.status : 'pending',
        product: product ? {
          id: product.id,
          title: product.title,
          images: product.images || [],
          price: product.price,
        } : null,
        order: order ? {
          id: order.id,
          status: typeof order.status === 'string' ? order.status : 'pending',
          created_at: order.created_at,
          shipping_address: order.shipping_address as { city?: string; country?: string } | null,
          buyer: buyer ? {
            email: buyer.email || '',
            full_name: buyer.full_name,
          } : null,
        } : null,
      }
    })

  // Calculate stats
  const totalRevenue = sales.reduce((sum, sale) => sum + (Number(sale.price_at_purchase) * sale.quantity), 0)
  const totalSales = sales.length
  const totalUnits = sales.reduce((sum, sale) => sum + sale.quantity, 0)
  const avgOrderValue = totalSales > 0 ? totalRevenue / totalSales : 0

  // Get previous period for comparison
  const prevStartDate = new Date(startDate)
  prevStartDate.setDate(prevStartDate.getDate() - (now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
  
  const { data: prevSalesData } = await supabase
    .from("order_items")
    .select(`
      id,
      quantity,
      price_at_purchase,
      orders!inner (
        created_at
      )
    `)
    .eq("seller_id", user.id)
    .gte("orders.created_at", prevStartDate.toISOString())
    .lt("orders.created_at", startDate.toISOString())

  const prevTotalRevenue = (prevSalesData || []).reduce((sum, sale) => 
    sum + (Number(sale.price_at_purchase) * sale.quantity), 0)
  const prevTotalSales = (prevSalesData || []).length

  // Calculate growth percentages
  const revenueGrowth = prevTotalRevenue > 0 
    ? ((totalRevenue - prevTotalRevenue) / prevTotalRevenue) * 100 
    : totalRevenue > 0 ? 100 : 0
  const salesGrowth = prevTotalSales > 0 
    ? ((totalSales - prevTotalSales) / prevTotalSales) * 100 
    : totalSales > 0 ? 100 : 0

  // Commission calculation (based on seller tier)
  const commissionRate = Number(seller.commission_rate || 10)
  const netRevenue = totalRevenue * (1 - commissionRate / 100)
  const totalCommission = totalRevenue * (commissionRate / 100)

  // Group sales by date for chart
  const salesByDate = sales.reduce((acc: Record<string, { revenue: number; orders: number }>, sale) => {
    const date = new Date(sale.created_at).toISOString().split('T')[0]
    if (!acc[date]) {
      acc[date] = { revenue: 0, orders: 0 }
    }
    acc[date].revenue += Number(sale.price_at_purchase) * sale.quantity
    acc[date].orders += 1
    return acc
  }, {})

  // Fill in missing dates
  const chartData: { date: string; revenue: number; orders: number }[] = []
  const currentDate = new Date(startDate)
  while (currentDate <= now) {
    const dateStr = currentDate.toISOString().split('T')[0]
    chartData.push({
      date: dateStr,
      revenue: salesByDate[dateStr]?.revenue || 0,
      orders: salesByDate[dateStr]?.orders || 0,
    })
    currentDate.setDate(currentDate.getDate() + 1)
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: 'EUR',
    }).format(value)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-4 sm:py-6">
        {/* Breadcrumb */}
        <AppBreadcrumb items={[
          { label: locale === 'bg' ? 'Акаунт' : 'Account', href: '/account' },
          { label: locale === 'bg' ? 'Продажби' : 'Sales' }
        ]} />
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="size-14 sm:size-16 rounded-xl bg-account-stat-icon-bg border border-account-stat-border flex items-center justify-center">
              <ChartLineUp weight="fill" className="size-7 sm:size-8 text-account-stat-icon" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-foreground">
                {locale === 'bg' ? 'Продажби' : 'Sales Dashboard'}
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                {locale === 'bg' ? 'Преглед на приходите и продажбите' : 'Track your revenue and orders'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild variant="outline">
              <Link href={`/${locale}/account/selling`}>
                <Storefront className="size-4 mr-2" />
                {locale === 'bg' ? 'Моят магазин' : 'My Store'}
              </Link>
            </Button>
            <Button asChild>
              <Link href={`/${locale}/sell`}>
                <Plus weight="bold" className="size-4 mr-2" />
                {locale === 'bg' ? 'Нова обява' : 'New Listing'}
              </Link>
            </Button>
          </div>
        </div>

        <PendingActions
          locale={locale}
          ordersToShipCount={ordersToShipCount ?? 0}
          unreadMessagesCount={unreadMessagesCount ?? 0}
          lowStockCount={lowStockCount ?? 0}
        />

        {/* Stats Cards */}
        <SalesStats
          locale={locale}
          totalRevenue={totalRevenue}
          netRevenue={netRevenue}
          totalSales={totalSales}
          totalUnits={totalUnits}
          avgOrderValue={avgOrderValue}
          revenueGrowth={revenueGrowth}
          salesGrowth={salesGrowth}
          commissionRate={commissionRate}
          totalCommission={totalCommission}
          formatCurrency={formatCurrency}
        />

        {/* Chart Section */}
        <Card className="mt-6">
          <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="text-lg">
                {locale === 'bg' ? 'Приходи във времето' : 'Revenue Over Time'}
              </CardTitle>
              <CardDescription>
                {locale === 'bg' ? 'Дневни приходи за избрания период' : 'Daily revenue for the selected period'}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Link href={`?period=7d`}>
                <Badge 
                  variant={period === "7d" ? "default" : "outline"} 
                  className="cursor-pointer"
                >
                  7D
                </Badge>
              </Link>
              <Link href={`?period=30d`}>
                <Badge 
                  variant={period === "30d" ? "default" : "outline"}
                  className="cursor-pointer"
                >
                  30D
                </Badge>
              </Link>
              <Link href={`?period=90d`}>
                <Badge 
                  variant={period === "90d" ? "default" : "outline"}
                  className="cursor-pointer"
                >
                  90D
                </Badge>
              </Link>
              <Link href={`?period=1y`}>
                <Badge 
                  variant={period === "1y" ? "default" : "outline"}
                  className="cursor-pointer"
                >
                  1Y
                </Badge>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <SalesChart data={chartData} locale={locale} formatCurrency={formatCurrency} />
          </CardContent>
        </Card>

        {/* Sales Table */}
        <Card className="mt-6">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <CardTitle className="text-lg">
                  {locale === 'bg' ? 'Последни продажби' : 'Recent Sales'}
                </CardTitle>
                <CardDescription>
                  {locale === 'bg' 
                    ? `${totalSales} продажби за последните ${period === '7d' ? '7 дни' : period === '30d' ? '30 дни' : period === '90d' ? '90 дни' : 'година'}`
                    : `${totalSales} sales in the last ${period === '7d' ? '7 days' : period === '30d' ? '30 days' : period === '90d' ? '90 days' : 'year'}`
                  }
                </CardDescription>
              </div>
              <ExportSales
                locale={locale}
                defaultFrom={startDate.toISOString().slice(0, 10)}
                defaultTo={now.toISOString().slice(0, 10)}
              />
            </div>
          </CardHeader>
          <CardContent>
            <SalesTable sales={sales} locale={locale} formatCurrency={formatCurrency} />
          </CardContent>
        </Card>

        {/* Empty State */}
        {sales.length === 0 && (
          <Card className="mt-6">
            <CardContent className="py-16">
              <div className="text-center">
                <div className="size-20 bg-muted rounded-full mx-auto flex items-center justify-center mb-4">
                  <CurrencyCircleDollar weight="duotone" className="size-10 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {locale === 'bg' ? 'Нямате продажби все още' : 'No sales yet'}
                </h3>
                <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                  {locale === 'bg' 
                    ? 'Когато продадете продукт, вашите продажби ще се показват тук' 
                    : 'When you sell a product, your sales will appear here'}
                </p>
                <Button asChild>
                  <Link href={`/${locale}/sell`}>
                    <Plus weight="bold" className="size-4 mr-2" />
                    {locale === 'bg' ? 'Създай обява' : 'Create Listing'}
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
