import { formatDistanceToNow, type Locale } from "date-fns"
import { Link } from "@/i18n/routing"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { OrderStatusBadge } from "../../../../_components/orders/order-status-badge"
import type { OrderItemStatus } from "@/lib/order-status"
import { getOrderStatusFromItems } from "@/lib/order-status"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChevronRight as IconChevronRight, MessageCircle as IconMessageCircle, Package as IconPackage } from "lucide-react"
import { BuyerOrderActions } from "./buyer-order-actions"
import type { AccountOrdersGridServerActions, OrderRow } from "./account-orders-grid.types"
import {
  getProductHref,
  getOrderGridText,
  isOrderStatusKey,
} from "./account-orders-grid.utils"
import { OrderListProductThumb, OrderListStatusBadge } from "@/components/shared/order-list-item"
import { OrderSummaryLine } from "@/components/shared/order-summary-line"

interface AccountOrdersGridDesktopProps {
  orders: OrderRow[]
  locale: string
  dateLocale: Locale
  actions: AccountOrdersGridServerActions
  conversationMap: Map<string, string>
  formatCurrency: (value: number) => string
  t: ReturnType<typeof getOrderGridText>
}

export function AccountOrdersGridDesktop({
  orders,
  locale,
  dateLocale,
  actions,
  conversationMap,
  formatCurrency,
  t,
}: AccountOrdersGridDesktopProps) {
  return (
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
                  <div className="w-40 shrink-0">
                    <div className="flex -space-x-2">
                      {visibleItems.map((item) => {
                        const image = item.product?.images?.[0] || "/placeholder.svg"
                        return (
                          <OrderListProductThumb
                            key={item.id}
                            imageSrc={image}
                            alt=""
                            className="size-10 rounded-md border-2 border-background bg-muted ring-1 ring-border"
                            imageClassName="object-contain"
                            sizes="40px"
                            fallbackClassName="text-muted-foreground"
                          />
                        )
                      })}
                      {remainingCount > 0 && (
                        <div className="flex size-10 items-center justify-center rounded-md border-2 border-background bg-muted text-xs font-medium text-muted-foreground ring-1 ring-border">
                          +{remainingCount}
                        </div>
                      )}
                    </div>
                  </div>

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
                      <OrderListStatusBadge status={status} locale={locale} />
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
                      <OrderListStatusBadge status={status} locale={locale} />
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

                      <div className="space-y-4">
                        {order.order_items.map((item) => {
                          const product = item.product
                          const image = product?.images?.[0] || "/placeholder.svg"
                          const title = product?.title || (locale === "bg" ? "Продукт" : "Product")
                          const href = getProductHref(item)
                          const itemStatus = item.status || "pending"

                          return (
                            <OrderSummaryLine
                              key={item.id}
                              className="gap-4 p-3 rounded-lg border bg-card"
                              thumb={{
                                href,
                                linkClassName: "shrink-0",
                                imageSrc: image,
                                alt: title,
                                className: "size-20 rounded-lg border bg-muted",
                                imageClassName: "object-contain",
                                sizes: "80px",
                                fallbackClassName: "text-muted-foreground",
                              }}
                              title={
                                <Link
                                  href={href}
                                  className="font-medium hover:underline line-clamp-2"
                                >
                                  {title}
                                </Link>
                              }
                              statusSlot={
                                <div className="flex items-center gap-2 mt-1.5">
                                  <OrderStatusBadge status={itemStatus as OrderItemStatus} size="sm" />
                                </div>
                              }
                            >
                              <p className="text-sm text-muted-foreground mt-1">
                                {t.qty}: {item.quantity}
                              </p>
                              {item.price_at_purchase && (
                                <p className="text-sm font-semibold mt-2 tabular-nums">
                                  {formatCurrency(item.price_at_purchase)}
                                </p>
                              )}
                              {item.tracking_number && (
                                <div className="text-sm text-muted-foreground mt-2 flex items-center gap-1">
                                  <span>📍</span>
                                  <span className="font-mono">{item.tracking_number}</span>
                                  {item.shipping_carrier && <span>({item.shipping_carrier})</span>}
                                </div>
                              )}
                              <div className="flex items-center gap-3 mt-3">
                                <Link
                                  href={href}
                                  className="inline-flex items-center text-sm text-primary hover:underline"
                                >
                                  {t.viewProduct}
                                  <IconChevronRight className="size-3 ml-0.5" />
                                </Link>
                                {item.seller_id && itemStatus !== "shipped" && itemStatus !== "delivered" && conversationMap.get(order.id) && (
                                  <Link
                                    href={`/chat/${conversationMap.get(order.id)}`}
                                    className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
                                  >
                                    <IconMessageCircle className="size-4" />
                                    {locale === "bg" ? "Чат" : "Chat"}
                                  </Link>
                                )}
                              </div>
                              {item.seller_id && (itemStatus === "shipped" || itemStatus === "delivered") && (
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
                            </OrderSummaryLine>
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
  )
}
