"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Link } from "@/i18n/routing"
import { formatDistanceToNow } from "date-fns"
import { bg, enUS } from "date-fns/locale"
import { IconChevronRight, IconPackage, IconShoppingBag, IconMessageCircle, IconX } from "@/lib/icons/tabler"

import { Badge } from "@/components/ui/badge"
import { BuyerOrderActions, type BuyerOrderActionsServerActions } from "./buyer-order-actions"
import { Button } from "@/components/ui/button"
import { OrderStatusBadge } from "../../../../_components/orders/order-status-badge"
import type { OrderItemStatus, OrderStatusKey } from "@/lib/order-status"
import { getOrderStatusFromItems } from "@/lib/order-status"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Drawer,
  DrawerBody,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { IconButton } from "@/components/ui/icon-button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

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
  // New status fields
  status?: OrderItemStatus
  tracking_number?: string | null
  shipping_carrier?: string | null
  shipped_at?: string | null
}

type OrderRow = {
  id: string
  created_at: string
  status: OrderStatus | null
  fulfillment_status?: OrderStatus | null
  total_amount: number | string | null
  order_items: OrderItemRow[]
}

export type AccountOrdersGridServerActions = BuyerOrderActionsServerActions & {
  getOrderConversation: (
    orderId: string,
    sellerId: string
  ) => Promise<{ conversationId: string | null; error?: string }>
}

interface AccountOrdersGridProps {
  orders: OrderRow[]
  locale: string
  actions: AccountOrdersGridServerActions
}

export function AccountOrdersGrid({ orders, locale, actions }: AccountOrdersGridProps) {
  const dateLocale = locale === "bg" ? bg : enUS
  const [conversationMap, setConversationMap] = useState<Map<string, string>>(new Map())
  const [openMobileOrderId, setOpenMobileOrderId] = useState<string | null>(null)
  const isOrderStatusKey = (value: unknown): value is OrderStatusKey =>
    typeof value === "string" &&
    ["pending", "paid", "processing", "shipped", "delivered", "cancelled"].includes(value)

  // Fetch conversation IDs for each order
  useEffect(() => {
    async function fetchConversations() {
      const map = new Map<string, string>()
      for (const order of orders) {
        try {
          const result = await actions.getOrderConversation(order.id, '')
          if (result.conversationId) {
            map.set(order.id, result.conversationId)
          }
        } catch {
          // Ignore errors
        }
      }
      setConversationMap(map)
    }

    if (orders.length > 0) {
      fetchConversations()
    }
  }, [actions, orders])

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat(locale, {
      style: "currency",
      currency: locale === "bg" ? "BGN" : "EUR",
      maximumFractionDigits: 2,
    }).format(value)

  const getStatusColor = (status: OrderStatus | null) => {
    switch (status) {
      case "paid":
        return "bg-success/10 text-success border-success/20"
      case "pending":
        return "bg-warning/10 text-warning border-warning/20"
      case "processing":
        return "bg-order-processing/10 text-order-processing border-order-processing/20"
      case "shipped":
        return "bg-order-shipped/10 text-order-shipped border-order-shipped/20"
      case "partially_shipped":
        return "bg-order-shipped/10 text-order-shipped border-order-shipped/20"
      case "delivered":
        return "bg-success/10 text-success border-success/20"
      case "cancelled":
        return "bg-error/10 text-error border-error/20"
      default:
        return "bg-muted text-muted-foreground border-border"
    }
  }

  const getStatusText = (status: OrderStatus | null) => {
    if (locale === "bg") {
      switch (status) {
        case "paid":
          return "Платена"
        case "pending":
          return "Изчакване"
        case "processing":
          return "Обработка"
        case "shipped":
          return "Изпратена"
        case "partially_shipped":
          return "Частично изпратена"
        case "delivered":
          return "Доставена"
        case "cancelled":
          return "Отменена"
        default:
          return status || "Неизвестен"
      }
    }
    if (status === "partially_shipped") return "Partially shipped"
    return status ? status.charAt(0).toUpperCase() + status.slice(1) : "Unknown"
  }

  const getProductHref = (item: OrderItemRow) => {
    if (!item.seller_username) return "#"
    return `/${item.seller_username}/${item.product?.slug || item.product_id}`
  }

  const t = {
    order: locale === "bg" ? "Поръчка" : "Order",
    items: locale === "bg" ? "артикула" : "items",
    item: locale === "bg" ? "артикул" : "item",
    viewOrder: locale === "bg" ? "Виж поръчката" : "View order",
    orderDetails: locale === "bg" ? "Детайли за поръчката" : "Order Details",
    placed: locale === "bg" ? "Направена" : "Placed",
    status: locale === "bg" ? "Статус" : "Status",
    total: locale === "bg" ? "Общо" : "Total",
    qty: locale === "bg" ? "Количество" : "Qty",
    viewProduct: locale === "bg" ? "Виж продукта" : "View product",
    noOrders: locale === "bg" ? "Няма поръчки" : "No orders found",
    noOrdersDesc: locale === "bg" ? "Когато направите поръчка, тя ще се появи тук." : "When you place an order, it will appear here.",
    startShopping: locale === "bg" ? "Към магазина" : "Start shopping",
  }

  // Empty state
  if (orders.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <div className="flex size-16 items-center justify-center rounded-full bg-muted mb-4">
            <IconShoppingBag className="size-8 text-muted-foreground" />
          </div>
          <h3 className="font-semibold text-lg">{t.noOrders}</h3>
          <p className="text-muted-foreground text-sm mt-1 max-w-sm">
            {t.noOrdersDesc}
          </p>
          <Button asChild className="mt-6">
            <Link href="/">{t.startShopping}</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      {/* Mobile: Revolut-style order cards */}
      <div className="space-y-3 md:hidden">
        {orders.map((order) => {
          const fallbackStatus = isOrderStatusKey(order.fulfillment_status)
            ? order.fulfillment_status
            : isOrderStatusKey(order.status)
              ? order.status
              : "pending"
          const displayStatus = getOrderStatusFromItems(
            order.order_items.map((item) => item.status),
            fallbackStatus
          )
          const itemCount = order.order_items.reduce(
            (sum, i) => sum + Number(i.quantity || 0),
            0
          )
          const orderTotal = Number(order.total_amount || 0)
          const visibleItems = order.order_items.slice(0, 3)
          const remainingCount = order.order_items.length - 3

          return (
            <Drawer
              key={order.id}
              open={openMobileOrderId === order.id}
              onOpenChange={(nextOpen) => setOpenMobileOrderId(nextOpen ? order.id : null)}
            >
              <button
                type="button"
                className="active-scale-99 w-full text-left rounded-md bg-card border border-border p-4 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                onClick={() => setOpenMobileOrderId(order.id)}
                aria-label={locale === "bg" ? `Отвори поръчка ${order.id.slice(0, 8)}` : `Open order ${order.id.slice(0, 8)}`}
                aria-haspopup="dialog"
                aria-expanded={openMobileOrderId === order.id}
              >
                  {/* Header: Price + Date */}
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-lg font-bold text-foreground tabular-nums">
                      {formatCurrency(orderTotal)}
                    </p>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(order.created_at), {
                        addSuffix: false,
                        locale: dateLocale,
                      })}
                    </span>
                  </div>

                  {/* Product Images Row */}
                  <div className="flex items-center gap-2 mb-3">
                    {visibleItems.map((item) => {
                      const image = item.product?.images?.[0]
                      return (
                        <div
                          key={item.id}
                          className="relative size-14 rounded-md overflow-hidden bg-card border border-border shrink-0"
                        >
                          {image ? (
                            <Image
                              src={image}
                              alt=""
                              fill
                              className="object-cover"
                              sizes="56px"
                            />
                          ) : (
                            <div className="flex size-full items-center justify-center">
                              <IconPackage className="size-6 text-muted-foreground" strokeWidth={1.5} />
                            </div>
                          )}
                          {item.quantity > 1 && (
                            <div className="absolute -bottom-0.5 -right-0.5 flex size-5 items-center justify-center rounded-full bg-primary text-2xs font-bold text-primary-foreground shadow-sm">
                              x{item.quantity}
                            </div>
                          )}
                        </div>
                      )
                    })}
                    {remainingCount > 0 && (
                      <div className="flex size-14 items-center justify-center rounded-md bg-surface-subtle text-sm font-medium text-muted-foreground">
                        +{remainingCount}
                      </div>
                    )}
                  </div>

                  {/* Footer: Status + Item count + View link */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={`text-2xs font-medium ${getStatusColor(displayStatus)}`}>
                        {getStatusText(displayStatus)}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {itemCount} {itemCount === 1 ? t.item : t.items}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-xs font-medium text-primary">
                      <span>{t.viewOrder}</span>
                      <IconChevronRight className="size-3.5" />
                    </div>
                  </div>
              </button>
              <DrawerContent className="max-h-(--dialog-h-85vh) rounded-t-2xl">
                <DrawerHeader className="border-b border-border-subtle pb-4 text-left">
                  <div className="flex items-center justify-between gap-3">
                    <DrawerTitle className="flex items-center gap-2">
                      <IconPackage className="size-5" />
                      {t.order} #{order.id.slice(0, 8)}
                    </DrawerTitle>
                    <DrawerClose asChild>
                      <IconButton aria-label={locale === "bg" ? "Затвори" : "Close"} variant="ghost" size="icon-compact">
                        <IconX className="size-4" />
                      </IconButton>
                    </DrawerClose>
                  </div>
                  <DrawerDescription>
                    <Badge
                      variant="outline"
                      className={getStatusColor(displayStatus)}
                    >
                      {getStatusText(displayStatus)}
                    </Badge>
                  </DrawerDescription>
                </DrawerHeader>
                <DrawerBody className="px-4 py-4">
                  <div className="space-y-4">
                    {/* Order info */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">{t.placed}</p>
                        <p className="font-medium">
                          {new Date(order.created_at).toLocaleDateString(
                            locale,
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">{t.total}</p>
                        <p className="font-semibold tabular-nums">
                          {formatCurrency(orderTotal)}
                        </p>
                      </div>
                    </div>

                    <Separator />

                    {/* Items */}
                    <div className="space-y-4">
                      {order.order_items.map((item) => {
                        const product = item.product
                        const image =
                          product?.images?.[0] || "/placeholder.svg"
                        const title =
                          product?.title ||
                          (locale === "bg" ? "Продукт" : "Product")
                        const href = getProductHref(item)
                        const itemStatus = item.status || 'pending'

                        return (
                          <div key={item.id} className="flex gap-3">
                            <Link href={href} className="shrink-0">
                              <div className="relative size-16 overflow-hidden rounded-lg border bg-muted">
                                <Image
                                  src={image}
                                  alt={title}
                                  fill
                                  sizes="64px"
                                  className="object-contain"
                                />
                              </div>
                            </Link>
                            <div className="min-w-0 flex-1">
                              <Link
                                href={href}
                                className="text-sm font-medium hover:underline line-clamp-2"
                              >
                                {title}
                              </Link>
                              <div className="flex items-center gap-2 mt-1">
                                <OrderStatusBadge status={itemStatus as OrderItemStatus} size="sm" />
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">
                                {t.qty}: {item.quantity}
                              </p>
                              {item.price_at_purchase && (
                                <p className="text-sm font-medium mt-1 tabular-nums">
                                  {formatCurrency(item.price_at_purchase)}
                                </p>
                              )}
                              {/* Tracking info */}
                              {item.tracking_number && (
                                <p className="text-xs text-muted-foreground mt-1">
                                  📍 {item.tracking_number} {item.shipping_carrier && `(${item.shipping_carrier})`}
                                </p>
                              )}
                              {/* Buyer Actions: Confirm Delivery & Rate Seller */}
                              {item.seller_id && (itemStatus === 'shipped' || itemStatus === 'delivered') && (
                                <div className="mt-2">
                                  <BuyerOrderActions
                                    orderItemId={item.id}
                                    currentStatus={itemStatus as OrderItemStatus}
                                    sellerId={item.seller_id}
                                    conversationId={conversationMap.get(order.id) ?? null}
                                    locale={locale}
                                    orderId={order.id}
                                    actions={actions}
                                  />
                                </div>
                              )}
                              {/* Chat link (shown for other statuses) */}
                              {item.seller_id && itemStatus !== 'shipped' && itemStatus !== 'delivered' && conversationMap.get(order.id) && (
                                <Link
                                  href={`/chat/${conversationMap.get(order.id)}`}
                                  className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-2"
                                >
                                  <IconMessageCircle className="size-3" />
                                  {locale === "bg" ? "Чат с продавача" : "Chat with seller"}
                                </Link>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </DrawerBody>
              </DrawerContent>
            </Drawer>
          )
        })}
      </div>

      {/* Desktop: Table-like layout in Card */}
      <Card className="hidden shadow-none md:block">
        <CardHeader className="pb-4">
          <CardTitle className="text-base">{t.order}s</CardTitle>
          <CardDescription>
            {orders.length} {orders.length === 1 ? t.item : t.items}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y">
            {orders.map((order) => {
              const fallbackStatus = isOrderStatusKey(order.fulfillment_status)
                ? order.fulfillment_status
                : isOrderStatusKey(order.status)
                  ? order.status
                  : "pending"
              const status = getOrderStatusFromItems(
                order.order_items.map((item) => item.status),
                fallbackStatus
              )
              const itemCount = order.order_items.reduce(
                (sum, i) => sum + Number(i.quantity || 0),
                0
              )
              const orderTotal = Number(order.total_amount || 0)
              const visibleItems = order.order_items.slice(0, 4)
              const remainingCount = order.order_items.length - 4

              return (
                <Sheet key={order.id}>
                  <div className="flex items-center gap-4 p-4 hover:bg-hover transition-colors">
                    {/* Product thumbnails - fixed width for alignment */}
                    <div className="w-40 shrink-0">
                      <div className="flex -space-x-2">
                        {visibleItems.map((item) => {
                          const image =
                            item.product?.images?.[0] || "/placeholder.svg"
                          return (
                            <div
                              key={item.id}
                              className="relative size-10 rounded-md border-2 border-background bg-muted overflow-hidden ring-1 ring-border"
                            >
                              <Image
                                src={image}
                                alt=""
                                fill
                                sizes="40px"
                                className="object-contain"
                              />
                            </div>
                          )
                        })}
                        {remainingCount > 0 && (
                          <div className="flex size-10 items-center justify-center rounded-md border-2 border-background bg-muted text-xs font-medium text-muted-foreground ring-1 ring-border">
                            +{remainingCount}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Order info */}
                    <div className="flex-1 min-w-0 grid grid-cols-4 gap-4 items-center">
                      <div className="min-w-0">
                        <p className="text-sm font-medium font-mono">
                          #{order.id.slice(0, 8)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {itemCount} {itemCount === 1 ? t.item : t.items}
                        </p>
                      </div>
                      <div>
                        <Badge
                          variant="outline"
                          className={getStatusColor(status)}
                        >
                          {getStatusText(status)}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {formatDistanceToNow(new Date(order.created_at), {
                          addSuffix: true,
                          locale: dateLocale,
                        })}
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold tabular-nums">
                          {formatCurrency(orderTotal)}
                        </p>
                      </div>
                    </div>

                    {/* Action */}
                    <SheetTrigger asChild>
                      <Button variant="ghost" size="sm">
                        {t.viewOrder}
                        <IconChevronRight className="size-4 ml-1" />
                      </Button>
                    </SheetTrigger>
                  </div>

                  <SheetContent className="sm:max-w-lg">
                    <SheetHeader className="pb-4 border-b">
                      <SheetTitle className="flex items-center gap-2">
                        <IconPackage className="size-5" />
                        {t.order} #{order.id.slice(0, 8)}
                      </SheetTitle>
                      <SheetDescription className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className={getStatusColor(status)}
                        >
                          {getStatusText(status)}
                        </Badge>
                        <span className="text-muted-foreground">
                          {new Date(order.created_at).toLocaleDateString(
                            locale,
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                        </span>
                      </SheetDescription>
                    </SheetHeader>
                    <ScrollArea className="flex-1 -mx-6 px-6 h-(--account-orders-sheet-scroll-h)">
                      <div className="py-6 space-y-6">
                        {/* Summary */}
                        <div className="flex items-center justify-between p-4 rounded-lg bg-surface-subtle">
                          <div>
                            <p className="text-sm text-muted-foreground">
                              {t.total}
                            </p>
                            <p className="text-xl font-semibold tabular-nums">
                              {formatCurrency(orderTotal)}
                            </p>
                          </div>
                          <Badge variant="outline">
                            {itemCount} {itemCount === 1 ? t.item : t.items}
                          </Badge>
                        </div>

                        {/* Items */}
                        <div className="space-y-4">
                          {order.order_items.map((item) => {
                            const product = item.product
                            const image =
                              product?.images?.[0] || "/placeholder.svg"
                            const title =
                              product?.title ||
                              (locale === "bg" ? "Продукт" : "Product")
                            const href = getProductHref(item)
                            const itemStatus = item.status || 'pending'

                            return (
                              <div
                                key={item.id}
                                className="flex gap-4 p-3 rounded-lg border bg-card"
                              >
                                <Link href={href} className="shrink-0">
                                  <div className="relative size-20 overflow-hidden rounded-lg border bg-muted">
                                    <Image
                                      src={image}
                                      alt={title}
                                      fill
                                      sizes="80px"
                                      className="object-contain"
                                    />
                                  </div>
                                </Link>
                                <div className="min-w-0 flex-1">
                                  <Link
                                    href={href}
                                    className="font-medium hover:underline line-clamp-2"
                                  >
                                    {title}
                                  </Link>
                                  {/* Item Status */}
                                  <div className="flex items-center gap-2 mt-1.5">
                                    <OrderStatusBadge status={itemStatus as OrderItemStatus} size="sm" />
                                  </div>
                                  <p className="text-sm text-muted-foreground mt-1">
                                    {t.qty}: {item.quantity}
                                  </p>
                                  {item.price_at_purchase && (
                                    <p className="text-sm font-semibold mt-2 tabular-nums">
                                      {formatCurrency(item.price_at_purchase)}
                                    </p>
                                  )}
                                  {/* Tracking info */}
                                  {item.tracking_number && (
                                    <div className="text-sm text-muted-foreground mt-2 flex items-center gap-1">
                                      <span>📍</span>
                                      <span className="font-mono">{item.tracking_number}</span>
                                      {item.shipping_carrier && <span>({item.shipping_carrier})</span>}
                                    </div>
                                  )}
                                  {/* Actions */}
                                  <div className="flex items-center gap-3 mt-3">
                                    <Link
                                      href={href}
                                      className="inline-flex items-center text-sm text-primary hover:underline"
                                    >
                                      {t.viewProduct}
                                      <IconChevronRight className="size-3 ml-0.5" />
                                    </Link>
                                    {/* Show chat only if NOT showing buyer actions */}
                                    {item.seller_id && itemStatus !== 'shipped' && itemStatus !== 'delivered' && conversationMap.get(order.id) && (
                                      <Link
                                        href={`/chat/${conversationMap.get(order.id)}`}
                                        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
                                      >
                                        <IconMessageCircle className="size-4" />
                                        {locale === "bg" ? "Чат" : "Chat"}
                                      </Link>
                                    )}
                                  </div>
                                  {/* Buyer Actions: Confirm Delivery & Rate Seller */}
                                  {item.seller_id && (itemStatus === 'shipped' || itemStatus === 'delivered') && (
                                    <div className="mt-3 pt-3 border-t">
                                      <BuyerOrderActions
                                        orderItemId={item.id}
                                        currentStatus={itemStatus as OrderItemStatus}
                                        sellerId={item.seller_id}
                                        conversationId={conversationMap.get(order.id) ?? null}
                                        locale={locale}
                                        orderId={order.id}
                                        actions={actions}
                                      />
                                    </div>
                                  )}
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    </ScrollArea>
                  </SheetContent>
                </Sheet>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </>
  )
}
