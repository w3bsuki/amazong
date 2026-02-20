import { createClient } from "@/lib/supabase/server"
import { redirect } from "@/i18n/routing"
import { getOrderConversation } from "@/app/actions/orders-reads"
import { canBuyerRateSeller } from "@/app/actions/orders-rating"
import { requestOrderCancellation, reportOrderIssue } from "@/app/actions/orders-support"
import { buyerConfirmDelivery } from "@/app/actions/orders-status"
import { submitSellerFeedback } from "@/app/actions/seller-feedback"
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
  slug?: string | null
  price?: number | null
}

type OrderItemRow = {
  id: string
  product_id: string
  seller_id?: string
  seller_username?: string | null
  quantity: number
  price_at_purchase?: number
  product?: OrderProduct | null
}

type OrderRow = {
  id: string
  created_at: string
  status: OrderStatus | null
  fulfillment_status?: OrderStatus | null
  total_amount: number | string | null
  order_items: OrderItemRow[]
}

interface OrdersPageProps {
  params: Promise<{ locale: string }>
  searchParams?: Promise<{ q?: string; status?: string }>
}

export const metadata = {
  title: "Orders | Treido",
  description: "View and track your Treido orders.",
}

export default async function OrdersPage({ params, searchParams }: OrdersPageProps) {
  const { locale: localeParam } = await params
  const locale = localeParam === "bg" ? "bg" : "en"
  const sp = (await searchParams) || {}
  const query = (sp.q || "").trim()
  const statusFilter = (sp.status || "all").trim()
  const supabase = await createClient()

  if (!supabase) {
    return redirect({ href: "/auth/login", locale })
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect({ href: "/auth/login", locale })
  }

  // Fetch orders from Supabase with full details
  const { data: ordersRaw } = await supabase
    .from("orders")
    .select(`
        id,
        created_at,
        status,
        fulfillment_status,
        total_amount,
        order_items (
          id,
          product_id,
          seller_id,
          quantity,
          price_at_purchase,
          status,
          tracking_number,
          shipping_carrier,
          shipped_at,
          product:products(
            id,
            title,
            images,
            slug,
            price
          )
        )
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  const sellerIds = Array.from(
    new Set(
      ((ordersRaw || []) as unknown as OrderRow[])
        .flatMap((order) => (Array.isArray(order.order_items) ? order.order_items : []))
        .map((item) => item.seller_id)
        .filter((id): id is string => typeof id === "string" && id.length > 0)
    )
  )

  const { data: sellerProfiles } = sellerIds.length
    ? await supabase
      .from("profiles")
      .select("id,username")
      .in("id", sellerIds)
    : { data: [] as Array<{ id: string; username: string | null }> }

  const sellerUsernameById = new Map(
    (sellerProfiles || []).map((profile) => [profile.id, profile.username ?? null])
  )

  const allOrders = ((ordersRaw || []) as unknown as OrderRow[]).map((order) => ({
    ...order,
    order_items: Array.isArray(order.order_items)
      ? order.order_items.map((item) => ({
        ...item,
        seller_username: item.seller_id ? sellerUsernameById.get(item.seller_id) ?? null : null,
      }))
      : [],
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

      <AccountOrdersStats stats={stats} locale={locale} />

      {/* Toolbar with Tabs and Search */}
      <AccountOrdersToolbar
        locale={locale}
        initialQuery={query}
        initialStatus={statusFilter}
        counts={counts}
      />

      <AccountOrdersGrid
        orders={filteredOrders}
        locale={locale}
        actions={{
          getOrderConversation,
          buyerConfirmDelivery,
          canBuyerRateSeller,
          requestOrderCancellation,
          reportOrderIssue,
          submitSellerFeedback,
        }}
      />
    </div>
  )
}
