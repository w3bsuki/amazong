"use client"

import { useState } from "react"
import { Link } from "@/i18n/routing"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ArrowLeft, MessageCircle as ChatCircle, CircleCheck as CheckCircle, Clock, Copy, MapPin, Package, Receipt, LoaderCircle as SpinnerGap, Truck, CircleX as XCircle } from "lucide-react"

import { toast } from "sonner"
import { formatDistanceToNow, format } from "date-fns"
import { bg, enUS } from "date-fns/locale"
import { getOrderStatusFromItems } from "@/lib/order-status"
import { OrderTimeline } from "./order-timeline"
import { type BuyerOrderActionsServerActions } from "../../_components/buyer-order-actions"
import { useTranslations } from "next-intl"
import { OrderHeader } from "@/components/shared/order-detail/order-header"
import { OrderPriceSummaryRows } from "@/components/shared/order-detail/order-price-summary"
import { OrderListProductThumb } from "@/components/shared/order-list-item"
import { OrderDetailSideCard } from "@/components/shared/order-detail/order-side-card"
import { OrderDetailFeedback } from "./order-detail-feedback"
import { OrderDetailItemsCard } from "./order-detail-items-card"
import type { OrderDetailItem, OrderDetailOrder } from "./order-detail-types"

export type OrderDetailContentServerActions = BuyerOrderActionsServerActions & {
  requestReturn: (
    orderItemId: string,
    reason: string
  ) => Promise<{ success: boolean; error?: string }>
}

interface OrderDetailContentProps {
  locale: string
  order: OrderDetailOrder
  existingSellerFeedbackSellerIds?: string[]
  conversationId?: string | null
  actions: OrderDetailContentServerActions
}

const STATUS_CONFIG = {
  pending: { label: "Pending", labelBg: "Изчаква", color: "bg-warning", text: "text-warning-foreground", icon: Clock },
  paid: { label: "Paid", labelBg: "Платена", color: "bg-info", text: "text-info-foreground", icon: Receipt },
  processing: { label: "Processing", labelBg: "Обработва се", color: "bg-primary", text: "text-primary-foreground", icon: Package },
  shipped: { label: "Shipped", labelBg: "Изпратена", color: "bg-primary", text: "text-primary-foreground", icon: Truck },
  delivered: { label: "Delivered", labelBg: "Доставена", color: "bg-success", text: "text-success-foreground", icon: CheckCircle },
  cancelled: { label: "Cancelled", labelBg: "Отменена", color: "bg-destructive", text: "text-destructive-foreground", icon: XCircle },
} as const satisfies Record<
  "pending" | "paid" | "processing" | "shipped" | "delivered" | "cancelled",
  { label: string; labelBg: string; color: string; text: string; icon: typeof CheckCircle }
>

type OrderStatusKey = keyof typeof STATUS_CONFIG

const ORDER_PROGRESS_STATUSES = ["pending", "paid", "processing", "shipped", "delivered"] as const
type OrderProgressStatusKey = (typeof ORDER_PROGRESS_STATUSES)[number]

function normalizeProgressStatus(status: OrderStatusKey): OrderProgressStatusKey {
  return status === "cancelled" ? "pending" : status
}

function isOrderStatusKey(status: string): status is OrderStatusKey {
  return status in STATUS_CONFIG
}

function getStatusConfig(status: string): (typeof STATUS_CONFIG)[OrderStatusKey] {
  return STATUS_CONFIG[isOrderStatusKey(status) ? status : "pending"]
}

function getLocalizedStatusLabel(
  locale: string,
  config: (typeof STATUS_CONFIG)[OrderStatusKey]
) {
  return locale === "bg" ? config.labelBg : config.label
}

function OrderProgressCard({
  locale,
  orderStatusKey,
}: {
  locale: string
  orderStatusKey: OrderStatusKey
}) {
  const normalizedStatus = normalizeProgressStatus(orderStatusKey)
  const normalizedIndex = ORDER_PROGRESS_STATUSES.indexOf(normalizedStatus)

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">{locale === "bg" ? "Статус на поръчката" : "Order Status"}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          {ORDER_PROGRESS_STATUSES.map((status, index, arr) => {
            const config = STATUS_CONFIG[status]
            const Icon = config.icon
            const isActive = normalizedIndex >= index
            const statusClassName = isActive
              ? `${config.color} ${config.text}`
              : "bg-muted text-muted-foreground"
            const connectorClassName = normalizedIndex > index ? "bg-primary" : "bg-muted"

            return (
              <div key={status} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`size-8 rounded-full flex items-center justify-center transition-colors ${statusClassName}`}
                  >
                    <Icon className="size-4" />
                  </div>
                  <span className={`text-xs mt-1.5 ${isActive ? "font-medium" : "text-muted-foreground"}`}>
                    {getLocalizedStatusLabel(locale, config)}
                  </span>
                </div>
                {index < arr.length - 1 && (
                  <div className={`h-0.5 flex-1 mx-1 transition-colors ${connectorClassName}`} />
                )}
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

const CARRIERS: Record<string, { name: string; trackingUrl: string }> = {
  speedy: { name: "Speedy", trackingUrl: "https://www.speedy.bg/bg/track-shipment?shipmentNumber=" },
  econt: { name: "Econt", trackingUrl: "https://www.econt.com/services/track-shipment/" },
  dhl: { name: "DHL", trackingUrl: "https://www.dhl.com/en/express/tracking.html?AWB=" },
  ups: { name: "UPS", trackingUrl: "https://www.ups.com/track?loc=en_US&tracknum=" },
  fedex: { name: "FedEx", trackingUrl: "https://www.fedex.com/fedextrack/?tracknumbers=" },
  dpd: { name: "DPD", trackingUrl: "https://www.dpd.com/bg/bg/paket-trassen/track-and-trace-system-bg/?parcelNr=" },
}

export function OrderDetailContent({ locale, order, existingSellerFeedbackSellerIds, conversationId, actions }: OrderDetailContentProps) {
  const tCommon = useTranslations("Common")
  const [isReturnDialogOpen, setIsReturnDialogOpen] = useState(false)
  const [returnReason, setReturnReason] = useState("")
  const [selectedItem, setSelectedItem] = useState<OrderDetailItem | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const dateLocale = locale === "bg" ? bg : enUS
  const fallbackStatus = order.status && isOrderStatusKey(order.status) ? order.status : "pending"
  const derivedStatus = getOrderStatusFromItems(
    order.order_items.map((item) => item.status),
    fallbackStatus
  )
  const orderStatusKey: OrderStatusKey = isOrderStatusKey(derivedStatus) ? derivedStatus : "pending"
  const statusConfig = STATUS_CONFIG[orderStatusKey]
  const StatusIcon = statusConfig.icon
  const stripePaymentIntentId = order.stripe_payment_intent_id
  const createdAtDate = new Date(order.created_at)
  const orderHeaderSubtitle = `${format(createdAtDate, "PPP", { locale: dateLocale })} · ${formatDistanceToNow(createdAtDate, {
    addSuffix: true,
    locale: dateLocale,
  })}`

  // Format currency
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(locale === "bg" ? "bg-BG" : "en-US", {
      style: "currency",
      currency: "BGN",
    }).format(price)
  }

  // Copy to clipboard
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    toast.success(locale === "bg" ? `${label} копиран` : `${label} copied`)
  }

  // Open tracking URL
  const openTracking = (item: OrderDetailItem) => {
    if (!item.tracking_number || !item.shipping_carrier) return

    const carrier = CARRIERS[item.shipping_carrier.toLowerCase()]
    if (carrier) {
      window.open(carrier.trackingUrl + item.tracking_number, "_blank")
    }
  }

  // Handle return request
  const handleReturnRequest = async () => {
    if (!selectedItem || !returnReason.trim()) {
      toast.error(locale === "bg" ? "Моля, въведете причина" : "Please enter a reason")
      return
    }

    setIsSubmitting(true)
    const result = await actions.requestReturn(selectedItem.id, returnReason)
    setIsSubmitting(false)

    if (!result.success) {
      toast.error(locale === "bg" ? "Неуспешно изпращане на заявката" : "Failed to submit return request")
      return
    }

    toast.success(
      locale === "bg"
        ? "Заявката за връщане е изпратена"
        : "Return request submitted"
    )
    setIsReturnDialogOpen(false)
    setReturnReason("")
    setSelectedItem(null)
  }

  // Calculate order totals
  const subtotal = order.order_items.reduce(
    (sum, item) => sum + (item.price_at_purchase * item.quantity),
    0
  )
  const shipping = 0 // Stub: Shipping cost stored in order.shipping_cost when checkout flow includes shipping calculator
  const total = Number(order.total_amount)

  const shippingAddress = order.shipping_address?.address

  const openReturnDialog = (item: OrderDetailItem) => {
    setSelectedItem(item)
    setIsReturnDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      {/* Back Button & Header */}
      <OrderHeader
        backHref="/account/orders"
        backButton={<ArrowLeft className="size-4" />}
        backAriaLabel={tCommon("back")}
        backButtonSize="icon-sm"
        title={locale === "bg" ? "Поръчка" : "Order"}
        orderId={order.id}
        uppercaseOrderId
        orderIdLength={8}
        titleClassName="text-lg font-semibold tracking-normal"
        subtitle={orderHeaderSubtitle}
        copyAriaLabel={tCommon("copyOrderId")}
        onCopy={() => copyToClipboard(order.id, "ID")}
        rightContent={
          <Badge variant="secondary" className={`${statusConfig.color} ${statusConfig.text}`}>
            <StatusIcon className="size-3.5 mr-1" />
            {getLocalizedStatusLabel(locale, statusConfig)}
          </Badge>
        }
        className="sm:items-center"
        leftClassName="items-center"
      />

      {/* Order Progress */}
      <OrderProgressCard locale={locale} orderStatusKey={orderStatusKey} />

      <OrderDetailFeedback
        locale={locale}
        orderId={order.id}
        orderItems={order.order_items.map((item) => ({
          seller: item.seller
            ? {
              id: item.seller.id,
              store_name: item.seller.store_name,
            }
            : null,
          delivered_at: item.delivered_at,
        }))}
        {...(existingSellerFeedbackSellerIds
          ? { existingSellerFeedbackSellerIds }
          : {})}
        submitSellerFeedback={actions.submitSellerFeedback}
      />

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Order Items */}
        <div className="lg:col-span-2 space-y-4">
          <OrderDetailItemsCard
            locale={locale}
            orderId={order.id}
            conversationId={conversationId ?? null}
            orderItems={order.order_items}
            actions={actions}
            formatPrice={formatPrice}
            getStatusView={getStatusConfig}
            openTracking={openTracking}
            requestReturn={openReturnDialog}
            carriers={CARRIERS}
          />
        </div>

        {/* Order Summary & Shipping */}
        <div className="space-y-4">
          {/* Order Summary */}
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
                    aria-label={tCommon("copyPaymentId")}
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

          {/* Shipping Address */}
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
                {order.shipping_address?.name && (
                  <p className="font-medium">{order.shipping_address.name}</p>
                )}
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

          {/* Help */}
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
      </div>

      {/* Return Request Dialog */}
      <Dialog open={isReturnDialogOpen} onOpenChange={setIsReturnDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{locale === "bg" ? "Заявка за връщане" : "Return Request"}</DialogTitle>
            <DialogDescription>
              {locale === "bg"
                ? "Опишете защо искате да върнете продукта"
                : "Describe why you want to return this item"}
            </DialogDescription>
          </DialogHeader>
          {selectedItem && (
            <div className="flex items-center gap-3 p-3 rounded-lg border bg-surface-subtle">
              <OrderListProductThumb
                imageSrc={selectedItem.product?.images?.[0]}
                alt={selectedItem.product?.title || (locale === "bg" ? "Продукт" : "Product")}
                className="size-12 rounded bg-muted"
                sizes="48px"
                fallbackClassName="text-muted-foreground"
              />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm line-clamp-1">{selectedItem.product?.title}</p>
                <p className="text-xs text-muted-foreground">
                  {selectedItem.quantity} × {formatPrice(selectedItem.price_at_purchase)}
                </p>
              </div>
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="returnReason">{locale === "bg" ? "Причина" : "Reason"}</Label>
            <Textarea
              id="returnReason"
              value={returnReason}
              onChange={(e) => setReturnReason(e.target.value)}
              placeholder={locale === "bg" ? "Опишете проблема..." : "Describe the issue..."}
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsReturnDialogOpen(false)}>
              {locale === "bg" ? "Отказ" : "Cancel"}
            </Button>
            <Button onClick={handleReturnRequest} disabled={isSubmitting || !returnReason.trim()}>
              {isSubmitting ? (
                <SpinnerGap className="size-4 mr-2 animate-spin" />
              ) : null}
              {locale === "bg" ? "Изпрати заявка" : "Submit Request"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
