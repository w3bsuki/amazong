import { Link } from "@/i18n/routing"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  MessageCircle as ChatCircle,
  TriangleAlert as Warning,
  Truck,
  SquareArrowOutUpRight as ArrowSquareOut,
} from "lucide-react"
import { BuyerOrderActions, type BuyerOrderActionsServerActions } from "../../_components/buyer-order-actions"
import { OrderDetailItemShell, OrderItemsList } from "@/components/shared/order-detail/order-items-list"
import type { OrderDetailItem } from "./order-detail-types"

interface ItemStatusView {
  label: string
  labelBg: string
}

interface OrderDetailItemsCardProps {
  locale: string
  orderId: string
  conversationId?: string | null
  orderItems: OrderDetailItem[]
  actions: BuyerOrderActionsServerActions
  formatPrice: (value: number) => string
  getStatusView: (status: string) => ItemStatusView
  openTracking: (item: OrderDetailItem) => void
  requestReturn: (item: OrderDetailItem) => void
  carriers: Record<string, { name: string; trackingUrl: string }>
}

export function OrderDetailItemsCard({
  locale,
  orderId,
  conversationId,
  orderItems,
  actions,
  formatPrice,
  getStatusView,
  openTracking,
  requestReturn,
  carriers,
}: OrderDetailItemsCardProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">
          {locale === "bg" ? "Продукти" : "Items"} ({orderItems.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <OrderItemsList>
          {orderItems.map((item) => {
            const itemStatus = item.status || "pending"
            const itemConfig = getStatusView(itemStatus)
            const firstImage = item.product?.images?.[0]

            return (
              <OrderDetailItemShell
                key={item.id}
                imageSrc={firstImage}
                imageAlt={item.product?.title || "Product"}
                imageSizes="80px"
                content={
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <Link
                          href={
                            item.seller?.username
                              ? `/${item.seller.username}/${item.product?.slug || item.product_id}`
                              : "#"
                          }
                          className="font-medium hover:underline line-clamp-2"
                        >
                          {item.product?.title || "Unknown Product"}
                        </Link>
                        {item.seller && (
                          <p className="text-sm text-muted-foreground">
                            {locale === "bg" ? "От" : "From"}: {item.seller.store_name}
                          </p>
                        )}
                      </div>
                      <Badge variant="outline" className="shrink-0">
                        {locale === "bg" ? itemConfig.labelBg : itemConfig.label}
                      </Badge>
                    </div>

                    <div className="mt-2 flex items-center justify-between">
                      <p className="text-sm">
                        {item.quantity} × {formatPrice(item.price_at_purchase)}
                      </p>
                      <p className="font-medium">
                        {formatPrice(item.quantity * item.price_at_purchase)}
                      </p>
                    </div>

                    {item.tracking_number && (
                      <div className="mt-2 flex items-center gap-2 rounded bg-surface-subtle p-2">
                        <Truck className="size-4 text-muted-foreground" />
                        <span className="text-sm flex-1">
                          {item.shipping_carrier && carriers[item.shipping_carrier.toLowerCase()]?.name}
                          : {item.tracking_number}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7"
                          onClick={() => openTracking(item)}
                        >
                          <ArrowSquareOut className="size-3.5" />
                          {locale === "bg" ? "Проследи" : "Track"}
                        </Button>
                      </div>
                    )}

                    <div className="mt-3 flex gap-2">
                      <Link href={`/chat?seller=${item.seller_id}`}>
                        <Button variant="outline" size="sm" className="h-7">
                          <ChatCircle className="size-3.5 mr-1" />
                          {locale === "bg" ? "Съобщение" : "Message"}
                        </Button>
                      </Link>
                      {itemStatus === "delivered" && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7"
                          onClick={() => requestReturn(item)}
                        >
                          <Warning className="size-3.5 mr-1" />
                          {locale === "bg" ? "Върни" : "Return"}
                        </Button>
                      )}
                    </div>
                    {(itemStatus === "shipped" || itemStatus === "delivered") && (
                      <div className="mt-2">
                        <BuyerOrderActions
                          orderItemId={item.id}
                          currentStatus={itemStatus}
                          sellerId={item.seller_id}
                          conversationId={conversationId ?? null}
                          locale={locale}
                          orderId={orderId}
                          actions={actions}
                          mode="report-only"
                        />
                      </div>
                    )}
                  </div>
                }
              />
            )
          })}
        </OrderItemsList>
      </CardContent>
    </Card>
  )
}
