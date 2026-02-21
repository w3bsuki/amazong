"use client"

import { formatDistanceToNow, type Locale } from "date-fns"
import { Link } from "@/i18n/routing"
import { OrderStatusBadge } from "../../../../_components/orders/order-status-badge"
import { SHIPPING_CARRIER_VALUES, getOrderStatusFromItems, type OrderItemStatus } from "@/lib/order-status"
import { DrawerBody } from "@/components/ui/drawer"
import { DrawerShell } from "@/components/shared/drawer-shell"
import { Separator } from "@/components/ui/separator"
import { ChevronRight as IconChevronRight, MessageCircle as IconMessageCircle, Package as IconPackage } from "lucide-react"
import { BuyerOrderActions } from "./buyer-order-actions"
import type { AccountOrdersGridServerActions, OrderRow } from "./account-orders-grid.types"
import {
  getProductHref,
  isOrderStatusKey,
} from "./account-orders-grid.utils"
import { OrderListProductThumb, OrderListStatusBadge } from "@/components/shared/order-list-item"
import { OrderSummaryLine } from "@/components/shared/order-summary-line"
import { AccountOrdersEmptyState } from "./account-orders-empty-state"
import { useTranslations } from "next-intl"

interface AccountOrdersGridMobileProps {
  orders: OrderRow[]
  locale: string
  dateLocale: Locale
  actions: AccountOrdersGridServerActions
  conversationMap: Map<string, string>
  openMobileOrderId: string | null
  setOpenMobileOrderId: (orderId: string | null) => void
  formatCurrency: (value: number) => string
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
}: AccountOrdersGridMobileProps) {
  const tAccount = useTranslations("Account")
  const tCommon = useTranslations("Common")
  const tOrders = useTranslations("Orders")

  if (orders.length === 0) {
    return <AccountOrdersEmptyState cardClassName="md:hidden" />
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
        const drawerTitle = tAccount("ordersPage.drawer.title", { id: order.id.slice(0, 8) })
        const orderTotal = Number(order.total_amount || 0)

        const primaryItem = order.order_items[0] ?? null
        const primaryProduct = primaryItem?.product ?? null
        const primaryTitle = primaryProduct?.title || tAccount("ordersPage.card.productFallbackTitle")
        const primaryImage = primaryProduct?.images?.[0] ?? null
        const orderNumber = tAccount("ordersPage.card.orderNumber", { id: order.id.slice(0, 8) })
        const itemCountLabel = tAccount("ordersPage.card.itemsCount", { count: itemCount })

        const statusForBadge = displayStatus === "paid" ? "processing" : displayStatus
        const statusLabel = tOrders(`status.${statusForBadge}.label`)

        return (
          <div key={order.id}>
            <button
              type="button"
              className="active-scale-99 w-full text-left rounded-2xl bg-card border border-border-subtle p-4 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
              onClick={() => setOpenMobileOrderId(order.id)}
              aria-label={tAccount("ordersPage.card.openOrderAriaLabel", { id: order.id.slice(0, 8) })}
              aria-haspopup="dialog"
              aria-expanded={openMobileOrderId === order.id}
            >
              <div className="flex items-center gap-3">
                <OrderListProductThumb
                  imageSrc={primaryImage}
                  alt={primaryTitle}
                  className="size-16 rounded-xl border border-border-subtle bg-background shrink-0"
                  sizes="64px"
                  fallbackClassName="text-muted-foreground"
                />

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="line-clamp-1 text-sm font-semibold text-foreground">
                        {primaryTitle}
                      </p>
                      <p className="mt-0.5 line-clamp-1 text-2xs text-muted-foreground">
                        {orderNumber} · {itemCountLabel}
                      </p>
                    </div>

                    <div className="shrink-0 text-right">
                      <p className="text-sm font-semibold text-foreground tabular-nums">
                        {formatCurrency(orderTotal)}
                      </p>
                      <p className="mt-0.5 text-2xs text-muted-foreground">
                        {formatDistanceToNow(new Date(order.created_at), {
                          addSuffix: false,
                          locale: dateLocale,
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="mt-2 flex items-center justify-between">
                    <OrderListStatusBadge
                      status={statusForBadge}
                      label={statusLabel}
                      className="text-2xs font-medium"
                    />
                    <IconChevronRight className="size-4 text-muted-foreground" aria-hidden="true" />
                  </div>
                </div>
              </div>
            </button>

            <DrawerShell
              open={openMobileOrderId === order.id}
              onOpenChange={(nextOpen) => setOpenMobileOrderId(nextOpen ? order.id : null)}
              title={drawerTitle}
              closeLabel={tCommon("close")}
              contentAriaLabel={drawerTitle}
              icon={<IconPackage className="size-5" />}
              description={
                <OrderListStatusBadge
                  status={statusForBadge}
                  label={statusLabel}
                />
              }
              descriptionClassName="text-sm text-muted-foreground"
              headerClassName="border-b border-border-subtle pb-4 text-left"
              contentClassName="max-h-(--dialog-h-85vh) rounded-t-2xl"
            >
              <DrawerBody className="px-4 py-4">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">{tAccount("ordersPage.drawer.placed")}</p>
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
                      <p className="text-muted-foreground">{tAccount("ordersPage.drawer.total")}</p>
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
                      const title = product?.title || tAccount("ordersPage.card.productFallbackTitle")
                      const href = getProductHref(item)
                      const itemStatus = item.status || "pending"
                      const carrierLabel = item.shipping_carrier
                        ? SHIPPING_CARRIER_VALUES.includes(item.shipping_carrier as (typeof SHIPPING_CARRIER_VALUES)[number])
                          ? tOrders(`shippingCarriers.${item.shipping_carrier}`)
                          : item.shipping_carrier
                        : null

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
                            {tAccount("ordersPage.drawer.qty")}: {item.quantity}
                          </p>
                          {item.price_at_purchase && (
                            <p className="text-sm font-medium mt-1 tabular-nums">
                              {formatCurrency(item.price_at_purchase)}
                            </p>
                          )}
                          {item.tracking_number && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {tAccount("ordersPage.drawer.tracking")}: {item.tracking_number}{" "}
                              {carrierLabel ? `(${carrierLabel})` : null}
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
                              {tAccount("ordersPage.drawer.chatWithSeller")}
                            </Link>
                          )}
                        </OrderSummaryLine>
                      )
                    })}
                  </div>
                </div>
              </DrawerBody>
            </DrawerShell>
          </div>
        )
      })}
    </div>
  )
}
