import { createClient } from "@/lib/supabase/server"
import { Link, redirect } from "@/i18n/routing"
import { getTranslations } from "next-intl/server"
import type { Metadata } from "next"
import { AppBreadcrumb } from "../../../_components/navigation/app-breadcrumb"
import { PageShell } from "../../../_components/page-shell"
import { SalesChartLazy } from "./_components/sales-chart-lazy"
import { SalesStats } from "./_components/sales-stats"
import { SalesTable } from "./_components/sales-table"
import { PendingActions } from "./_components/pending-actions"
import { ExportSales } from "./_components/export-sales"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChartLine as ChartLineUp, CircleDollarSign as CurrencyCircleDollar, Plus, Store as Storefront } from "lucide-react";


import type { SaleItem } from "./types"
export type { SaleItem } from "./types"

interface SalesPageProps {
  params: Promise<{
    locale: string
  }>
  searchParams: Promise<{
    period?: string
    page?: string
  }>
}

const SALES_PAGE_SIZE = 10

function parsePageParam(value?: string): number {
  if (!value) return 1
  const parsed = Number.parseInt(value, 10)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1
}

function resolveStartDate(period: string, now: Date): Date {
  const startDate = new Date(now)

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

  return startDate
}

function buildChartData(sales: SaleItem[], startDate: Date, now: Date) {
  const salesByDate = sales.reduce((acc: Record<string, { revenue: number; orders: number }>, sale) => {
    const date = new Date(sale.created_at).toISOString().slice(0, 10)
    if (!acc[date]) {
      acc[date] = { revenue: 0, orders: 0 }
    }
    acc[date].revenue += Number(sale.price_at_purchase) * sale.quantity
    acc[date].orders += 1
    return acc
  }, {})

  const chartData: { date: string; revenue: number; orders: number }[] = []
  const currentDate = new Date(startDate)

  while (currentDate <= now) {
    const dateStr = currentDate.toISOString().slice(0, 10)
    chartData.push({
      date: dateStr,
      revenue: salesByDate[dateStr]?.revenue || 0,
      orders: salesByDate[dateStr]?.orders || 0,
    })
    currentDate.setDate(currentDate.getDate() + 1)
  }

  return chartData
}

export async function generateMetadata({
  params,
}: Pick<SalesPageProps, "params">): Promise<Metadata> {
  const { locale } = await params

  return {
    title: locale === "bg" ? "Продажби | Treido" : "Sales | Treido",
    description:
      locale === "bg" ? "Преглед и управление на продажбите." : "View and manage your sales activity.",
  }
}

export default async function SalesPage({ params, searchParams }: SalesPageProps) {
  const { locale } = await params
  const { period = "30d", page } = await searchParams
  const requestedPage = parsePageParam(page)
  const t = await getTranslations({ locale, namespace: "SellerManagement" })
  const tCommon = await getTranslations({ locale, namespace: "Common" })
  const supabase = await createClient()

  if (!supabase) {
    return redirect({ href: "/auth/login", locale })
  }

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return redirect({ href: "/auth/login", locale })
  }

  // Check if user has a seller profile (has username)
  const [
    { data: profile },
    { data: privateProfile },
  ] = await Promise.all([
    supabase
      .from("profiles")
      .select("id,username,display_name,business_name,created_at")
      .eq("id", user.id)
      .single(),
    supabase
      .from("private_profiles")
      .select("commission_rate")
      .eq("id", user.id)
      .maybeSingle(),
  ])

  // If no username, redirect to sell page to set one up
  if (!profile || !profile.username) {
    return redirect({ href: "/sell", locale })
  }

  // Map profile to seller format for compatibility
  const seller = {
    ...profile,
    commission_rate: privateProfile?.commission_rate ?? null,
    store_name: profile.display_name || profile.business_name || profile.username,
  }

  // Calculate date range
  const now = new Date()
  const startDate = resolveStartDate(period, now)

  const fetchSalesPage = async (nextPage: number) => {
    const from = (nextPage - 1) * SALES_PAGE_SIZE
    const to = from + SALES_PAGE_SIZE - 1

    return supabase
      .from("order_items")
      .select(
        `
          id,
          order_id,
          product_id,
          quantity,
          price_at_purchase,
          status,
          order:orders!inner(
            id,
            status,
            created_at,
            shipping_address,
            user_id
          )
        `,
        { count: "exact" }
      )
      .eq("seller_id", user.id)
      .gte("orders.created_at", startDate.toISOString())
      .order("created_at", { ascending: false, foreignTable: "orders" })
      .range(from, to)
  }

  let salesResponse = await fetchSalesPage(requestedPage)
  const totalSalesCount = salesResponse.count ?? 0
  const totalPages = Math.max(1, Math.ceil(totalSalesCount / SALES_PAGE_SIZE))
  const currentPage = Math.min(requestedPage, totalPages)

  if (currentPage !== requestedPage) {
    salesResponse = await fetchSalesPage(currentPage)
  }

  const salesData = salesResponse.data ?? []

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

  // Get unique buyer IDs and product IDs for the current page
  const buyerIds = [
    ...new Set(
      salesData
        .map((sale) => sale.order?.user_id)
        .filter((id): id is string => typeof id === "string" && id.length > 0)
    ),
  ]
  const productIds = [...new Set(salesData.map((s) => s.product_id))]
  const { data: buyersData } = buyerIds.length > 0
    ? await supabase
      .from("profiles")
      .select("id, full_name")
      .in("id", buyerIds)
    : { data: [] }

  // Fetch products
  const { data: productsData } = productIds.length > 0
    ? await supabase
      .from("products")
      .select("id, title, images, price, slug")
      .in("id", productIds)
    : { data: [] }

  // Create lookup maps
  const buyersMap = new Map((buyersData || []).map(b => [b.id, b]))
  const productsMap = new Map((productsData || []).map(p => [p.id, p]))

  // Transform the data to match our interface
  const sales: SaleItem[] = salesData
    .map((item) => {
      const order = item.order
      const product = productsMap.get(item.product_id)
      const buyer = order ? buyersMap.get(order.user_id) : null
      const shippingAddress = order?.shipping_address as { city?: string; country?: string; email?: string } | null
      const buyerEmail = typeof shippingAddress?.email === 'string' ? shippingAddress.email : ''
      const buyerFullName = buyer?.full_name ?? null
      const buyerInfo = buyerFullName || buyerEmail ? { email: buyerEmail, full_name: buyerFullName } : null
      return {
        id: item.id,
        order_id: item.order_id,
        product_id: item.product_id,
        quantity: item.quantity,
        price_at_purchase: item.price_at_purchase,
        created_at: order?.created_at || '',
        status: typeof item.status === "string" ? item.status : "pending",
        product: product ? {
          id: product.id,
          title: product.title,
          images: product.images || [],
          price: product.price,
          slug: product.slug ?? null,
          username: profile.username ?? null,
        } : null,
         order: order ? {
           id: order.id,
           status: typeof order.status === 'string' ? order.status : 'pending',
           created_at: order.created_at,
          shipping_address: shippingAddress,
          buyer: buyerInfo,
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
    .limit(500)

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
  const commissionRate = seller.commission_rate == null ? 0 : Number(seller.commission_rate)
  const netRevenue = totalRevenue * (1 - commissionRate / 100)
  const totalCommission = totalRevenue * (commissionRate / 100)

  // Group sales by date for chart
  const chartData = buildChartData(sales, startDate, now)

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: 'EUR',
    }).format(value)
  }

  const buildPageHref = (pageNumber: number) => {
    const next = new URLSearchParams()
    if (period !== "30d") next.set("period", period)
    if (pageNumber > 1) next.set("page", String(pageNumber))

    const qs = next.toString()
    return qs ? `/account/sales?${qs}` : "/account/sales"
  }

  return (
    <PageShell>
      <div className="container py-4 sm:py-6">
        {/* Breadcrumb */}
        <AppBreadcrumb items={[
          { label: t("sales.breadcrumb.account"), href: "/account" },
          { label: t("sales.breadcrumb.sales") }
        ]} />

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="size-14 sm:size-16 rounded-md bg-muted border border-border flex items-center justify-center">
              <ChartLineUp className="size-7 sm:size-8 text-muted-foreground" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-foreground">
                {t("sales.header.title")}
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                {t("sales.header.description")}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild variant="outline">
              <Link href="/account/selling">
                <Storefront className="size-4 mr-2" />
                {t("sales.actions.myStore")}
              </Link>
            </Button>
            <Button asChild>
              <Link href="/sell">
                <Plus className="size-4 mr-2" />
                {t("sales.actions.newListing")}
              </Link>
            </Button>
          </div>
        </div>

        <PendingActions
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
                {t("sales.sections.revenueOverTime.title")}
              </CardTitle>
              <CardDescription>
                {t("sales.sections.revenueOverTime.description")}
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
            <SalesChartLazy data={chartData} locale={locale} />
          </CardContent>
        </Card>

        {/* Sales Table */}
        <Card className="mt-6">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <CardTitle className="text-lg">
                  {t("sales.sections.recentSales.title")}
                </CardTitle>
                <CardDescription>
                  {t("sales.sections.recentSales.description", { count: totalSalesCount, period })}
                </CardDescription>
              </div>
              <ExportSales
                defaultFrom={startDate.toISOString().slice(0, 10)}
                defaultTo={now.toISOString().slice(0, 10)}
              />
            </div>
          </CardHeader>
          <CardContent>
            <SalesTable sales={sales} locale={locale} />

            {sales.length > 0 ? (
              <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-muted-foreground">
                  {locale === "bg"
                    ? `Страница ${currentPage} от ${totalPages}`
                    : `Page ${currentPage} of ${totalPages}`}
                </p>

                <nav className="flex items-center gap-2" aria-label={tCommon("pagination")}>
                  {currentPage > 1 ? (
                    <Button variant="outline" size="sm" asChild>
                      <Link href={buildPageHref(currentPage - 1)}>{tCommon("previous")}</Link>
                    </Button>
                  ) : (
                    <Button variant="outline" size="sm" disabled>
                      {tCommon("previous")}
                    </Button>
                  )}

                  {currentPage < totalPages ? (
                    <Button variant="outline" size="sm" asChild>
                      <Link href={buildPageHref(currentPage + 1)}>{tCommon("next")}</Link>
                    </Button>
                  ) : (
                    <Button variant="outline" size="sm" disabled>
                      {tCommon("next")}
                    </Button>
                  )}
                </nav>
              </div>
            ) : null}
          </CardContent>
        </Card>

        {/* Empty State */}
        {sales.length === 0 && (
          <Card className="mt-6">
            <CardContent className="py-16">
              <div className="text-center">
                <div className="size-20 bg-muted rounded-full mx-auto flex items-center justify-center mb-4">
                  <CurrencyCircleDollar className="size-10 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {t("sales.empty.title")}
                </h3>
                <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                  {t("sales.empty.description")}
                </p>
                <Button asChild>
                  <Link href="/sell">
                    <Plus className="size-4 mr-2" />
                    {t("sales.empty.cta")}
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </PageShell>
  )
}

