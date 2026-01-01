import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { AccountOrdersToolbar } from "./_components/account-orders-toolbar"
import { AccountOrdersStats } from "./_components/account-orders-stats"
import { AccountOrdersGrid } from "./_components/account-orders-grid"

type OrderStatus =
  | "pending"
  | "processing"
  | "paid"
  | "shipped"
  | "delivered"
  | "cancelled"
  | string

type OrderProduct = {
  id: string
  title: string | null
  images: string[] | null
  price?: number | null
}

type OrderItemRow = {
  id: string
  product_id: string
  quantity: number
  price_at_purchase?: number
  product?: OrderProduct | null
}

type OrderRow = {
  id: string
  created_at: string
  status: OrderStatus | null
  total_amount: number | string | null
  order_items: OrderItemRow[]
}

interface OrdersPageProps {
  params: Promise<{ locale: string }>
  searchParams?: Promise<{ q?: string; status?: string }>
}

export default async function OrdersPage({ params, searchParams }: OrdersPageProps) {
  const { locale } = await params
  const sp = (await searchParams) || {}
  const query = (sp.q || "").trim()
  const statusFilter = (sp.status || "all").trim()
  const supabase = await createClient()

  if (!supabase) {
    redirect("/auth/login")
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Fetch orders from Supabase with full details
  const { data: ordersRaw } = await supabase
    .from("orders")
    .select(`
        *,
        order_items (
            *,
            product:products(*)
        )
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  const allOrders = ((ordersRaw || []) as unknown as OrderRow[]).map((order) => ({
    ...order,
    order_items: Array.isArray(order.order_items) ? order.order_items : [],
  }))

  const normalize = (value: string) => value.toLowerCase()

  const matchesQuery = (order: OrderRow) => {
    if (!query) return true
    const q = normalize(query)
    if (normalize(order.id).includes(q)) return true
    return order.order_items.some((item) => {
      const title = item.product?.title || ""
      return normalize(title).includes(q)
    })
  }

  const isOpenStatus = (status: OrderStatus | null) =>
    status === "pending" || status === "processing" || status === "shipped" || status === "paid"

  const matchesStatus = (order: OrderRow) => {
    const s = (order.status || "pending") as OrderStatus
    switch (statusFilter) {
      case "open":
        return isOpenStatus(s)
      case "delivered":
        return s === "delivered"
      case "cancelled":
        return s === "cancelled"
      case "all":
      default:
        return true
    }
  }

  const filteredOrders = allOrders.filter((o) => matchesStatus(o) && matchesQuery(o))

  // Calculate stats
  const stats = {
    total: allOrders.length,
    pending: allOrders.filter((o) => isOpenStatus((o.status || "pending") as OrderStatus)).length,
    delivered: allOrders.filter((o) => o.status === "delivered").length,
    cancelled: allOrders.filter((o) => o.status === "cancelled").length,
    totalSpend: allOrders.reduce((sum, o) => sum + Number(o.total_amount || 0), 0),
  }

  const counts = {
    all: allOrders.length,
    open: stats.pending,
    delivered: stats.delivered,
    cancelled: stats.cancelled,
  }

  return (
    <div className="flex flex-col gap-4 md:gap-4">
      <h1 className="sr-only">{locale === "bg" ? "Поръчки" : "Orders"}</h1>

      {/* Stats Cards */}
      <AccountOrdersStats stats={stats} locale={locale} />

      {/* Toolbar with Tabs and Search */}
      <AccountOrdersToolbar
        locale={locale}
        initialQuery={query}
        initialStatus={statusFilter}
        counts={counts}
      />

      {/* Orders Grid */}
      <AccountOrdersGrid orders={filteredOrders} locale={locale} />
    </div>
  )
}
