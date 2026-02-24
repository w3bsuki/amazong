"use client"

import { useCallback, useEffect, useState } from "react"
import { Link } from "@/i18n/routing"
import Image from "next/image"
import {
  ArrowLeft,
  Package,
  Loader2,
  RefreshCw,
  ExternalLink,
  Clock3,
  Truck,
  CircleCheck,
  MapPin,
  Mail,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { UserAvatar } from "@/components/shared/user-avatar"
import { OrderStatusBadge } from "../../../_components/orders/order-status-badge"
import { OrderStatusActions, type OrderStatusActionsServerActions } from "./_components/order-status-actions"
import { SellerRateBuyerActions, type SellerRateBuyerActionsServerActions } from "./_components/seller-rate-buyer-actions"
import { type OrderItemStatus } from "@/lib/order-status"
import { cn } from "@/lib/utils"
import { formatDistanceToNow } from "date-fns"
import { bg, enUS } from "date-fns/locale"
import { useTranslations } from "next-intl"

type SellerOrderItem = {
  id: string
  order_id: string
  seller_id: string
  quantity: number
  price_at_purchase: number
  status: OrderItemStatus
  tracking_number: string | null
  shipping_carrier: string | null
  created_at: string
  product?: {
    id: string
    title: string
    images: string[]
    slug?: string | null
  }
  order?: {
    id: string
    user_id: string
    total_amount: number
    status: string
    shipping_address: {
      name?: string
      email?: string
      address?: {
        line1?: string
        line2?: string
        city?: string
        state?: string
        postal_code?: string
        country?: string
      }
    } | null
    created_at: string
  }
  buyer?: {
    id: string
    full_name: string | null
    email: string | null
    avatar_url: string | null
  }
}

const SELLER_ORDERS_PAGE_SIZE = 10

export type SellerOrdersClientServerActions = OrderStatusActionsServerActions &
  SellerRateBuyerActionsServerActions & {
    getSellerOrders: (
      statusFilter?: OrderItemStatus | "all" | "active",
      page?: number,
      pageSize?: number
    ) => Promise<{
      orders: SellerOrderItem[]
      currentPage: number
      pageSize: number
      totalPages: number
      totalItems: number
      error?: string
    }>
    getSellerOrderStats: () => Promise<{
      pending: number
      received: number
      processing: number
      shipped: number
      delivered: number
      cancelled: number
      total: number
    }>
    getOrderConversation: (
      orderId: string,
      sellerId: string
    ) => Promise<{ conversationId: string | null; error?: string }>
  }

interface SellerOrdersClientProps {
  locale: string
  sellerUsername: string | null
  actions: SellerOrdersClientServerActions
}

type StatusFilter = OrderItemStatus | "all" | "active"

type SellerOrdersCopy = {
  headerTitle: string
  headerDescription: string
  refresh: string
  tabs: {
    active: string
  }
  empty: {
    title: string
    allDescription: string
    statusDescription: (statusLabel: string) => string
  }
  item: {
    unknownProduct: string
    quantity: string
    unitMultiplier: string
    shipTo: string
    tracking: string
    ordered: string
    unknownUser: string
    unknownBuyer: string
    productImageAlt: string
  }
}

function getSellerOrdersCopy(locale: string): SellerOrdersCopy {
  if (locale === "bg") {
    return {
      headerTitle: "Поръчки от купувачи",
      headerDescription: "Управлявайте входящите поръчки и доставките",
      refresh: "Обнови",
      tabs: {
        active: "Активни",
      },
      empty: {
        title: "Все още няма поръчки",
        allDescription: "Когато клиентите купуват вашите продукти, поръчките ще се появят тук.",
        statusDescription: (statusLabel) => `Нямате поръчки със статус „${statusLabel}“.`,
      },
      item: {
        unknownProduct: "Неизвестен продукт",
        quantity: "Кол.",
        unitMultiplier: "×",
        shipTo: "Адрес за доставка",
        tracking: "Проследяване",
        ordered: "Поръчана",
        unknownUser: "Потребител",
        unknownBuyer: "Неизвестен купувач",
        productImageAlt: "Изображение на продукт",
      },
    }
  }

  return {
    headerTitle: "Your Orders",
    headerDescription: "Manage incoming orders and shipments",
    refresh: "Refresh",
    tabs: {
      active: "Active",
    },
    empty: {
      title: "No orders yet",
      allDescription: "When customers purchase your products, their orders will appear here.",
      statusDescription: (statusLabel) => `You have no ${statusLabel.toLowerCase()} orders.`,
    },
    item: {
      unknownProduct: "Unknown Product",
      quantity: "Qty",
      unitMultiplier: "×",
      shipTo: "Ship to",
      tracking: "Tracking",
      ordered: "Ordered",
      unknownUser: "User",
      unknownBuyer: "Unknown buyer",
      productImageAlt: "Product image",
    },
  }
}

export function SellerOrdersClient({ locale, sellerUsername, actions }: SellerOrdersClientProps) {
  const tCommon = useTranslations("Common")
  const tOrders = useTranslations("Orders")
  const copy = getSellerOrdersCopy(locale)
  const dateLocale = locale === "bg" ? bg : enUS

  const [orders, setOrders] = useState<SellerOrderItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [activeTab, setActiveTab] = useState<StatusFilter>("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [stats, setStats] = useState({
    pending: 0,
    received: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
    total: 0,
  })
  const [conversationMap, setConversationMap] = useState<Map<string, string>>(new Map())

  const formatCurrency = useCallback(
    (value: number) =>
      new Intl.NumberFormat(locale === "bg" ? "bg-BG" : "en-US", {
        style: "currency",
        currency: locale === "bg" ? "BGN" : "EUR",
        maximumFractionDigits: 2,
      }).format(value),
    [locale]
  )

  const statusLabels = {
    pending: tOrders("status.pending.label"),
    processing: tOrders("status.processing.label"),
    shipped: tOrders("status.shipped.label"),
    delivered: tOrders("status.delivered.label"),
    active: copy.tabs.active,
    all: tCommon("all"),
  }

  // Load orders and stats
  const loadData = useCallback(async () => {
    setIsLoading(true)

    try {
      const [ordersResult, statsResult] = await Promise.all([
        actions.getSellerOrders(activeTab, currentPage, SELLER_ORDERS_PAGE_SIZE),
        actions.getSellerOrderStats(),
      ])

      if (ordersResult.orders) {
        setOrders(ordersResult.orders)
        setCurrentPage(ordersResult.currentPage)
        setTotalPages(ordersResult.totalPages)

        // Load conversation IDs for each order
        const convPromises = ordersResult.orders.map(async (item) => {
          const result = await actions.getOrderConversation(item.order_id, item.seller_id)
          return { key: `${item.order_id}-${item.seller_id}`, conversationId: result.conversationId }
        })

        const conversations = await Promise.all(convPromises)
        const map = new Map<string, string>()
        conversations.forEach(({ key, conversationId }) => {
          if (conversationId) map.set(key, conversationId)
        })
        setConversationMap(map)
      }

      setStats(statsResult)
    } catch {
      // Keep UI functional even if refresh fails; existing state remains visible.
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }, [actions, activeTab, currentPage])

  useEffect(() => {
    loadData()
  }, [loadData])

  function handleRefresh() {
    setIsRefreshing(true)
    loadData()
  }

  const handleTabChange = (value: string) => {
    const nextTab = value as StatusFilter
    setActiveTab(nextTab)
    setCurrentPage(1)
  }

  // Stats cards
  const statCards = [
    { key: "pending" as const, label: statusLabels.pending, icon: Clock3, color: "bg-order-pending" },
    { key: "processing" as const, label: statusLabels.processing, icon: Package, color: "bg-order-processing" },
    { key: "shipped" as const, label: statusLabels.shipped, icon: Truck, color: "bg-order-shipped" },
    { key: "delivered" as const, label: statusLabels.delivered, icon: CircleCheck, color: "bg-order-delivered" },
  ]

  const activeTabLabel =
    activeTab === "pending"
      ? statusLabels.pending
      : activeTab === "shipped"
        ? statusLabels.shipped
        : activeTab === "delivered"
          ? statusLabels.delivered
          : activeTab === "active"
            ? statusLabels.active
            : statusLabels.all

  return (
    <div className="flex flex-1 flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background border-b">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild aria-label={tCommon("back")}>
            <Link href="/sell">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-semibold">{copy.headerTitle}</h1>
            <p className="text-sm text-muted-foreground">{copy.headerDescription}</p>
          </div>
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw className={cn("h-4 w-4 mr-2", isRefreshing && "animate-spin")} />
            {copy.refresh}
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {statCards.map((stat) => {
            const Icon = stat.icon
            return (
              <Card
                key={stat.key}
                className={cn(
                  "cursor-pointer transition-shadow hover:shadow-md",
                  activeTab === stat.key && "ring-2 ring-primary"
                )}
                onClick={() => setActiveTab(stat.key)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className={cn("w-10 h-10 rounded-full flex items-center justify-center text-badge-fg-on-solid", stat.color)}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{stats[stat.key]}</p>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Filter Tabs */}
        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="all">
                {tCommon("all")} ({stats.total})
              </TabsTrigger>
              <TabsTrigger value="active">
                {copy.tabs.active} ({stats.pending + stats.received + stats.processing + stats.shipped})
              </TabsTrigger>
              <TabsTrigger value="pending">{statusLabels.pending}</TabsTrigger>
              <TabsTrigger value="shipped">{statusLabels.shipped}</TabsTrigger>
              <TabsTrigger value="delivered">{statusLabels.delivered}</TabsTrigger>
            </TabsList>
          </div>

          {/* Orders List */}
          <TabsContent value={activeTab} className="mt-4">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : orders.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">{copy.empty.title}</h3>
                  <p className="text-muted-foreground">
                    {activeTab === "all"
                      ? copy.empty.allDescription
                      : copy.empty.statusDescription(activeTabLabel)
                    }
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {orders.map((item) => {
                  const convKey = `${item.order_id}-${item.seller_id}`
                  const conversationId = conversationMap.get(convKey)

                  return (
                    <Card key={item.id}>
                      <CardContent className="p-4 md:p-4">
                        <div className="flex flex-col md:flex-row gap-4">
                          {/* Product Image */}
                          <div className="relative w-full md:w-24 h-24 bg-muted rounded-lg overflow-hidden shrink-0">
                            {item.product?.images?.[0] ? (
                              <Image
                                src={item.product.images[0]}
                                alt={item.product?.title || copy.item.productImageAlt}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Package className="h-8 w-8 text-muted-foreground" />
                              </div>
                            )}
                          </div>

                          {/* Order Details */}
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                              <div>
                                <h3 className="font-semibold line-clamp-1">
                                  {item.product?.title || copy.item.unknownProduct}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                  {copy.item.quantity}: {item.quantity} {copy.item.unitMultiplier} {formatCurrency(item.price_at_purchase)}
                                </p>
                              </div>
                              <OrderStatusBadge status={item.status} />
                            </div>

                            {/* Buyer Info */}
                            {item.buyer && (
                              <div className="flex items-center gap-2 mb-3 text-sm">
                                <UserAvatar
                                  name={item.buyer.full_name || item.buyer.email || copy.item.unknownUser}
                                  avatarUrl={item.buyer.avatar_url ?? null}
                                  className="size-6 bg-muted"
                                  fallbackClassName="bg-muted text-2xs font-semibold"
                                />
                                <span className="text-muted-foreground">
                                  {item.buyer.full_name || item.buyer.email || copy.item.unknownBuyer}
                                </span>
                              </div>
                            )}

                            {/* Shipping Address - Full details for seller to ship */}
                            {item.order?.shipping_address && (
                              <div className="text-sm bg-surface-subtle rounded-lg p-3 mb-3 space-y-1">
                                <div className="flex items-center gap-1.5 font-medium text-foreground">
                                  <MapPin className="size-3.5" />
                                  {copy.item.shipTo}
                                </div>
                                {item.order.shipping_address.name && (
                                  <div>{item.order.shipping_address.name}</div>
                                )}
                                {item.order.shipping_address.address?.line1 && (
                                  <div className="text-muted-foreground">{item.order.shipping_address.address.line1}</div>
                                )}
                                {item.order.shipping_address.address?.line2 && (
                                  <div className="text-muted-foreground">{item.order.shipping_address.address.line2}</div>
                                )}
                                {item.order.shipping_address.address && (
                                  <div className="text-muted-foreground">
                                    {[
                                      item.order.shipping_address.address.city,
                                      item.order.shipping_address.address.state,
                                      item.order.shipping_address.address.postal_code,
                                    ].filter(Boolean).join(', ')}
                                  </div>
                                )}
                                {item.order.shipping_address.address?.country && (
                                  <div className="text-muted-foreground font-medium">{item.order.shipping_address.address.country}</div>
                                )}
                                {item.order.shipping_address.email && (
                                  <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                                    <Mail className="size-3.5" />
                                    {item.order.shipping_address.email}
                                  </div>
                                )}
                              </div>
                            )}

                            {/* Tracking Info */}
                            {item.tracking_number && (
                              <div className="text-sm mb-3">
                                <span className="text-muted-foreground">{copy.item.tracking}: </span>
                                <span className="font-mono">{item.tracking_number}</span>
                                {item.shipping_carrier && (
                                  <span className="text-muted-foreground"> ({item.shipping_carrier})</span>
                                )}
                              </div>
                            )}

                            {/* Time */}
                            <p className="text-xs text-muted-foreground">
                              {copy.item.ordered}{" "}
                              {formatDistanceToNow(new Date(item.created_at), {
                                addSuffix: true,
                                locale: dateLocale,
                              })}
                            </p>
                          </div>

                          {/* Actions */}
                          <div className="flex md:flex-col gap-2 justify-end">
                            <OrderStatusActions
                              orderItemId={item.id}
                              currentStatus={item.status}
                              orderId={item.order_id}
                              sellerId={item.seller_id}
                              isSeller={true}
                              conversationId={conversationId ?? null}
                              actions={{ updateOrderItemStatus: actions.updateOrderItemStatus }}
                            />

                            {/* Rate Buyer - only shown for delivered orders */}
                            <SellerRateBuyerActions
                              orderItemId={item.id}
                              currentStatus={item.status}
                              locale={locale}
                              actions={{
                                canSellerRateBuyer: actions.canSellerRateBuyer,
                                submitBuyerFeedback: actions.submitBuyerFeedback,
                              }}
                            />

                            {item.product && (
                              <Button variant="ghost" size="sm" asChild>
                                <Link
                                  href={
                                    sellerUsername
                                      ? `/${sellerUsername}/${item.product.slug || item.product.id}`
                                      : "#"
                                  }
                                  target="_blank"
                                >
                                  <ExternalLink className="h-4 w-4" />
                                </Link>
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}

            {orders.length > 0 ? (
              <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-muted-foreground">
                  {locale === "bg"
                    ? `Страница ${currentPage} от ${totalPages}`
                    : `Page ${currentPage} of ${totalPages}`}
                </p>

                <nav className="flex items-center gap-2" aria-label={tCommon("pagination")}>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                    disabled={currentPage <= 1 || isLoading}
                  >
                    {tCommon("previous")}
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                    disabled={currentPage >= totalPages || isLoading}
                  >
                    {tCommon("next")}
                  </Button>
                </nav>
              </div>
            ) : null}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
