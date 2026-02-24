import { MessageCircle as ChatCircle, Copy, MapPin, Receipt } from "lucide-react"

import { Link } from "@/i18n/routing"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { OrderDetailSideCard } from "@/components/shared/order-detail/order-side-card"
import { OrderPriceSummaryRows } from "@/components/shared/order-detail/order-price-summary"

import { OrderTimeline } from "./order-timeline"
import type { OrderDetailOrder } from "./order-detail-types"

export function OrderDetailSidebar({
  locale,
  order,
  subtotal,
  shipping,
  total,
  formatPrice,
  copyToClipboard,
  copyPaymentAriaLabel,
}: {
  locale: string
  order: OrderDetailOrder
  subtotal: number
  shipping: number
  total: number
  formatPrice: (price: number) => string
  copyToClipboard: (text: string, label: string) => void
  copyPaymentAriaLabel: string
}) {
  const shippingAddress = order.shipping_address?.address
  const stripePaymentIntentId = order.stripe_payment_intent_id

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">{locale === "bg" ? "Обобщение" : "Summary"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <OrderPriceSummaryRows
            subtotalLabel={locale === "bg" ? "Междинна сума" : "Subtotal"}
            subtotalValue={formatPrice(subtotal)}
            shippingLabel={locale === "bg" ? "Доставка" : "Shipping"}
            shippingValue={shipping === 0 ? (locale === "bg" ? "Безплатна" : "Free") : formatPrice(shipping)}
            totalLabel={locale === "bg" ? "Общо" : "Total"}
            totalValue={formatPrice(total)}
          />
          {stripePaymentIntentId && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2">
              <Receipt className="size-3.5" />
              <span>Stripe: {stripePaymentIntentId.slice(0, 20)}...</span>
              <Button
                variant="ghost"
                size="icon"
                className="size-5"
                onClick={() => copyToClipboard(stripePaymentIntentId, "Payment ID")}
                aria-label={copyPaymentAriaLabel}
              >
                <Copy className="size-3" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <OrderTimeline
        locale={locale}
        orderCreatedAt={order.created_at}
        orderStatus={order.status}
        orderItems={order.order_items.map((i) => ({
          status: i.status,
          seller_received_at: i.seller_received_at,
          shipped_at: i.shipped_at,
          delivered_at: i.delivered_at,
          tracking_number: i.tracking_number,
          shipping_carrier: i.shipping_carrier,
        }))}
      />

      {shippingAddress && (
        <OrderDetailSideCard
          title={
            <>
              <MapPin className="size-4" />
              {locale === "bg" ? "Адрес за доставка" : "Shipping Address"}
            </>
          }
          titleClassName="text-base flex items-center gap-2"
        >
          <div className="text-sm space-y-1">
            {order.shipping_address?.name && <p className="font-medium">{order.shipping_address.name}</p>}
            <p>{shippingAddress.line1}</p>
            {shippingAddress.line2 && <p>{shippingAddress.line2}</p>}
            <p>
              {[shippingAddress.city, shippingAddress.state, shippingAddress.postal_code]
                .filter(Boolean)
                .join(", ")}
            </p>
            <p>{shippingAddress.country}</p>
            {order.shipping_address?.email && (
              <p className="text-muted-foreground">{order.shipping_address.email}</p>
            )}
          </div>
        </OrderDetailSideCard>
      )}

      <OrderDetailSideCard
        title={locale === "bg" ? "Нужда от помощ?" : "Need Help?"}
        description={
          locale === "bg"
            ? "Свържете се с продавача или поддръжката"
            : "Contact the seller or support"
        }
        contentClassName="space-y-2"
      >
        <Link href="/support">
          <Button variant="outline" className="w-full justify-start">
            <ChatCircle className="size-4 mr-2" />
            {locale === "bg" ? "Свържете се с поддръжката" : "Contact Support"}
          </Button>
        </Link>
      </OrderDetailSideCard>
    </div>
  )
}
