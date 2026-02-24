import type { Metadata } from "next"
import { createClient } from "@/lib/supabase/server"
import { Link, redirect } from "@/i18n/routing"
import { getTranslations } from "next-intl/server"
import { getOrderConversation } from "../../../../actions/orders-reads"
import { canBuyerRateSeller } from "../../../../actions/orders-rating"
import { requestOrderCancellation, reportOrderIssue } from "../../../../actions/orders-support"
import { buyerConfirmDelivery } from "../../../../actions/orders-status"
import { submitSellerFeedback } from "../../../../actions/seller-feedback"
import { Button } from "@/components/ui/button"
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
  searchParams?: Promise<{ q?: string; status?: string; page?: string }>
}

const normalizeValue = (value: string) => value.toLowerCase()

const matchesQuery = (order: OrderRow, query: string) => {
  if (!query) return true
  const q = normalizeValue(query)
  if (normalizeValue(order.id).includes(q)) return true
  return order.order_items.some((item) => {
    const title = item.product?.title || ""
    return normalizeValue(title).includes(q)
  })
}

type StatusFilterKey = "all" | "pending" | "shipped" | "completed"

const normalizeStatusFilter = (value: string): StatusFilterKey => {
  switch (value) {
    case "pending":
    case "shipped":
    case "completed":
      return value
    case "all":
    default:
      return "all"
  }
}

const getStatusForFilter = (order: OrderRow): OrderStatus => {
  const raw = (order.fulfillment_status || order.status || "pending") as OrderStatus
  return raw || "pending"
}

const isPendingStatus = (status: OrderStatus) =>
  status === "pending" || status === "processing" || status === "paid"

const matchesStatus = (order: OrderRow, statusFilter: StatusFilterKey) => {
  const s = getStatusForFilter(order)
  switch (statusFilter) {
    case "pending":
      return isPendingStatus(s)
    case "shipped":
      return s === "shipped"
    case "completed":
      return s === "delivered"
    case "all":
    default:
      return true
  }
}

const ORDERS_PAGE_SIZE = 10

function parsePageParam(value?: string): number {
  if (!value) return 1
  const parsed = Number.parseInt(value, 10)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1
}

export async function generateMetadata({
  params,
}: Pick<OrdersPageProps, "params">): Promise<Metadata> {
  const { locale: localeParam } = await params
  const locale = localeParam === "bg" ? "bg" : "en"
  const t = await getTranslations({ locale, namespace: "Account" })

  return {
    title: `${t("orders.title")} | Treido`,
    description: t("orders.desc"),
  }
}

export default async function OrdersPage({ params, searchParams }: OrdersPageProps) {
  const { locale: localeParam } = await params
  const locale = localeParam === "bg" ? "bg" : "en"
  const t = await getTranslations({ locale, namespace: "Account" })
  const tCommon = await getTranslations({ locale, namespace: "Common" })
  const sp = (await searchParams) || {}
  const query = (sp.q || "").trim()
  const statusFilter = normalizeStatusFilter((sp.status || "all").trim())
  const requestedPage = parsePageParam(sp.page)
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

  const sellerIds = [
    ...new Set(
      ((ordersRaw || []) as unknown as OrderRow[])
        .flatMap((order) => (Array.isArray(order.order_items) ? order.order_items : []))
        .map((item) => item.seller_id)
        .filter((id): id is string => typeof id === "string" && id.length > 0)
    ),
  ]

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

  const filteredOrders = allOrders.filter((o) => matchesStatus(o, statusFilter) && matchesQuery(o, query))
  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / ORDERS_PAGE_SIZE))
  const currentPage = Math.min(requestedPage, totalPages)
  const pageStart = (currentPage - 1) * ORDERS_PAGE_SIZE
  const paginatedOrders = filteredOrders.slice(pageStart, pageStart + ORDERS_PAGE_SIZE)

  const buildPageHref = (page: number) => {
    const next = new URLSearchParams()
    if (query) next.set("q", query)
    if (statusFilter !== "all") next.set("status", statusFilter)
    if (page > 1) next.set("page", String(page))

    const qs = next.toString()
    return qs ? `/account/orders?${qs}` : "/account/orders"
  }

  // Calculate stats
  const stats = {
    total: allOrders.length,
    pending: allOrders.filter((o) => matchesStatus(o, "pending")).length,
    shipped: allOrders.filter((o) => matchesStatus(o, "shipped")).length,
    completed: allOrders.filter((o) => matchesStatus(o, "completed")).length,
    totalSpend: allOrders.reduce((sum, o) => sum + Number(o.total_amount || 0), 0),
  }

  const counts = {
    all: allOrders.length,
    pending: stats.pending,
    shipped: stats.shipped,
    completed: stats.completed,
  }

  return (
    <div className="flex flex-col gap-4 md:gap-4">
      <h1 className="sr-only">{t("header.orders")}</h1>

      <div className="hidden md:block">
        <AccountOrdersStats stats={stats} locale={locale} />
      </div>

      {/* Toolbar with Tabs and Search */}
      <AccountOrdersToolbar
        locale={locale}
        initialQuery={query}
        initialStatus={statusFilter}
        counts={counts}
      />

      <AccountOrdersGrid
        orders={paginatedOrders}
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

      {filteredOrders.length > 0 ? (
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
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
    </div>
  )
}
