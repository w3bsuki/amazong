import type { Locale } from "date-fns"
import { formatDistanceToNow } from "date-fns"
import Image from "next/image"
import { ExternalLink, Mail, MapPin, Package } from "lucide-react"
import { Link } from "@/i18n/routing"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { UserAvatar } from "@/components/shared/user-avatar"
import { OrderStatusBadge } from "../../../../_components/orders/order-status-badge"
import { OrderStatusActions } from "./order-status-actions"
import { SellerRateBuyerActions } from "./seller-rate-buyer-actions"
import type { SellerOrderItem, SellerOrdersClientServerActions, SellerOrdersCopy } from "./seller-orders.types"

type SellerOrderCardProps = {
  item: SellerOrderItem
  conversationId: string | null
  sellerUsername: string | null
  locale: string
  copy: SellerOrdersCopy
  dateLocale: Locale
  formatCurrency: (value: number) => string
  actions: SellerOrdersClientServerActions
}

export function SellerOrderCard({
  item,
  conversationId,
  sellerUsername,
  locale,
  copy,
  dateLocale,
  formatCurrency,
  actions,
}: SellerOrderCardProps) {
  return (
    <Card>
      <CardContent className="p-4 md:p-4">
        <div className="flex flex-col md:flex-row gap-4">
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

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
              <div>
                <h3 className="font-semibold line-clamp-1">{item.product?.title || copy.item.unknownProduct}</h3>
                <p className="text-sm text-muted-foreground">
                  {copy.item.quantity}: {item.quantity} {copy.item.unitMultiplier} {formatCurrency(item.price_at_purchase)}
                </p>
              </div>
              <OrderStatusBadge status={item.status} />
            </div>

            {item.buyer && (
              <div className="flex items-center gap-2 mb-3 text-sm">
                <UserAvatar
                  name={item.buyer.full_name || item.buyer.email || copy.item.unknownUser}
                  avatarUrl={item.buyer.avatar_url ?? null}
                  className="size-6 bg-muted"
                  fallbackClassName="bg-muted text-2xs font-semibold"
                />
                <span className="text-muted-foreground">{item.buyer.full_name || item.buyer.email || copy.item.unknownBuyer}</span>
              </div>
            )}

            {item.order?.shipping_address && (
              <div className="text-sm bg-surface-subtle rounded-lg p-3 mb-3 space-y-1">
                <div className="flex items-center gap-1.5 font-medium text-foreground">
                  <MapPin className="size-3.5" />
                  {copy.item.shipTo}
                </div>
                {item.order.shipping_address.name && <div>{item.order.shipping_address.name}</div>}
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
                    ]
                      .filter(Boolean)
                      .join(", ")}
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

            {item.tracking_number && (
              <div className="text-sm mb-3">
                <span className="text-muted-foreground">{copy.item.tracking}: </span>
                <span className="font-mono">{item.tracking_number}</span>
                {item.shipping_carrier && <span className="text-muted-foreground"> ({item.shipping_carrier})</span>}
              </div>
            )}

            <p className="text-xs text-muted-foreground">
              {copy.item.ordered}{" "}
              {formatDistanceToNow(new Date(item.created_at), {
                addSuffix: true,
                locale: dateLocale,
              })}
            </p>
          </div>

          <div className="flex md:flex-col gap-2 justify-end">
            <OrderStatusActions
              orderItemId={item.id}
              currentStatus={item.status}
              orderId={item.order_id}
              sellerId={item.seller_id}
              isSeller={true}
              conversationId={conversationId}
              actions={{ updateOrderItemStatus: actions.updateOrderItemStatus }}
            />

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
                  href={sellerUsername ? `/${sellerUsername}/${item.product.slug || item.product.id}` : "#"}
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
}
