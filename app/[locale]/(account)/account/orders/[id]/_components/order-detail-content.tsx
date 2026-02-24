"use client"

import { useState } from "react"
import { ArrowLeft } from "lucide-react"
import { toast } from "sonner"
import { formatDistanceToNow, format } from "date-fns"
import { bg, enUS } from "date-fns/locale"
import { useTranslations } from "next-intl"

import { getOrderStatusFromItems } from "@/lib/order-status"
import { Badge } from "@/components/ui/badge"
import { OrderHeader } from "@/components/shared/order-detail/order-header"

import { type BuyerOrderActionsServerActions } from "../../_components/buyer-order-actions"
import { OrderDetailFeedback } from "./order-detail-feedback"
import { OrderDetailItemsCard } from "./order-detail-items-card"
import { OrderDetailReturnDialog } from "./order-detail-return-dialog"
import { OrderDetailSidebar } from "./order-detail-sidebar"
import {
  getLocalizedStatusLabel,
  getStatusConfig,
  isOrderStatusKey,
  OrderProgressCard,
  type OrderStatusKey,
} from "./order-detail-status"
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
  const statusConfig = getStatusConfig(orderStatusKey)
  const StatusIcon = statusConfig.icon
  const createdAtDate = new Date(order.created_at)
  const orderHeaderSubtitle = `${format(createdAtDate, "PPP", { locale: dateLocale })} · ${formatDistanceToNow(createdAtDate, {
    addSuffix: true,
    locale: dateLocale,
  })}`

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(locale === "bg" ? "bg-BG" : "en-US", {
      style: "currency",
      currency: "BGN",
    }).format(price)
  }

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    toast.success(locale === "bg" ? `${label} копиран` : `${label} copied`)
  }

  const openTracking = (item: OrderDetailItem) => {
    if (!item.tracking_number || !item.shipping_carrier) return

    const carrier = CARRIERS[item.shipping_carrier.toLowerCase()]
    if (carrier) {
      window.open(carrier.trackingUrl + item.tracking_number, "_blank")
    }
  }

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

  const subtotal = order.order_items.reduce(
    (sum, item) => sum + (item.price_at_purchase * item.quantity),
    0
  )
  const shipping = 0
  const total = Number(order.total_amount)

  const openReturnDialog = (item: OrderDetailItem) => {
    setSelectedItem(item)
    setIsReturnDialogOpen(true)
  }

  return (
    <div className="space-y-6">
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

        <OrderDetailSidebar
          locale={locale}
          order={order}
          subtotal={subtotal}
          shipping={shipping}
          total={total}
          formatPrice={formatPrice}
          copyToClipboard={copyToClipboard}
          copyPaymentAriaLabel={tCommon("copyPaymentId")}
        />
      </div>

      <OrderDetailReturnDialog
        locale={locale}
        open={isReturnDialogOpen}
        onOpenChange={setIsReturnDialogOpen}
        selectedItem={selectedItem}
        returnReason={returnReason}
        onReturnReasonChange={setReturnReason}
        onSubmit={handleReturnRequest}
        isSubmitting={isSubmitting}
        formatPrice={formatPrice}
      />
    </div>
  )
}
