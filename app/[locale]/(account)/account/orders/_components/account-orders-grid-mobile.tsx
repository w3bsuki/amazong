import { formatDistanceToNow, type Locale } from "date-fns"
import { Link } from "@/i18n/routing"
import { OrderStatusBadge } from "../../../../_components/orders/order-status-badge"
import type { OrderItemStatus } from "@/lib/order-status"
import { getOrderStatusFromItems } from "@/lib/order-status"
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
import { Separator } from "@/components/ui/separator"
import { ChevronRight as IconChevronRight, MessageCircle as IconMessageCircle, Package as IconPackage, X as IconX } from "lucide-react"
import { BuyerOrderActions } from "./buyer-order-actions"
import type { AccountOrdersGridServerActions, OrderRow } from "./account-orders-grid.types"
import {
  getProductHref,
  getOrderGridText,
  isOrderStatusKey,
} from "./account-orders-grid.utils"
import { OrderListProductThumb, OrderListStatusBadge } from "@/components/shared/order-list-item"
import { OrderSummaryLine } from "@/components/shared/order-summary-line"
import { AccountOrdersEmptyState } from "./account-orders-empty-state"

interface AccountOrdersGridMobileProps {
  orders: OrderRow[]
  locale: string
  dateLocale: Locale
  actions: AccountOrdersGridServerActions
  conversationMap: Map<string, string>
  openMobileOrderId: string | null
  setOpenMobileOrderId: (orderId: string | null) => void
  formatCurrency: (value: number) => string
  t: ReturnType<typeof getOrderGridText>
}

export function AccountOrdersGridMobile({
  orders,
  locale,
  dateLocale,
  actions,
  conversationMap,
  openMobileOrderId,
  setOpenMobileOrderId,
  formatCurrency,
  t,
}: AccountOrdersGridMobileProps) {
  if (orders.length === 0) {
    return <AccountOrdersEmptyState t={t} cardClassName="md:hidden" />
  }

  return (
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

              <div className="flex items-center gap-2 mb-3">
                {visibleItems.map((item) => {
                  const image = item.product?.images?.[0]
                  return (
                    <OrderListProductThumb
                      key={item.id}
                      imageSrc={image}
                      alt=""
                      className="size-14 rounded-md border border-border bg-card shrink-0"
                      sizes="56px"
                      fallbackClassName="text-muted-foreground"
                      overlay={
                        item.quantity > 1 ? (
                          <div className="absolute -bottom-0.5 -right-0.5 flex size-5 items-center justify-center rounded-full bg-primary text-2xs font-bold text-primary-foreground shadow-sm">
                            x{item.quantity}
                          </div>
                        ) : null
                      }
                    />
                  )
                })}
                {remainingCount > 0 && (
                  <div className="flex size-14 items-center justify-center rounded-md bg-surface-subtle text-sm font-medium text-muted-foreground">
                    +{remainingCount}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <OrderListStatusBadge status={displayStatus} locale={locale} className="text-2xs font-medium" />
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
                  <OrderListStatusBadge status={displayStatus} locale={locale} />
                </DrawerDescription>
              </DrawerHeader>
              <DrawerBody className="px-4 py-4">
                <div className="space-y-4">
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
                          thumb={{
                            href,
                            linkClassName: "shrink-0",
                            imageSrc: image,
                            alt: title,
                            className: "size-16 rounded-lg border bg-muted",
                            imageClassName: "object-contain",
                            sizes: "64px",
                            fallbackClassName: "text-muted-foreground",
                          }}
                          title={
                            <Link
                              href={href}
                              className="text-sm font-medium hover:underline line-clamp-2"
                            >
                              {title}
                            </Link>
                          }
                          statusSlot={
                            <div className="flex items-center gap-2 mt-1">
                              <OrderStatusBadge status={itemStatus as OrderItemStatus} size="sm" />
                            </div>
                          }
                        >
                          <p className="text-xs text-muted-foreground mt-1">
                            {t.qty}: {item.quantity}
                          </p>
                          {item.price_at_purchase && (
                            <p className="text-sm font-medium mt-1 tabular-nums">
                              {formatCurrency(item.price_at_purchase)}
                            </p>
                          )}
                          {item.tracking_number && (
                            <p className="text-xs text-muted-foreground mt-1">
                              📍 {item.tracking_number} {item.shipping_carrier && `(${item.shipping_carrier})`}
                            </p>
                          )}
                          {item.seller_id && (itemStatus === "shipped" || itemStatus === "delivered") && (
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
                          {item.seller_id && itemStatus !== "shipped" && itemStatus !== "delivered" && conversationMap.get(order.id) && (
                            <Link
                              href={`/chat/${conversationMap.get(order.id)}`}
                              className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-2"
                            >
                              <IconMessageCircle className="size-3" />
                              {locale === "bg" ? "Чат с продавача" : "Chat with seller"}
                            </Link>
                          )}
                        </OrderSummaryLine>
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
  )
}
