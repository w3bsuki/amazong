"use client"

import { useEffect, useMemo, useState, useTransition } from "react"
import Image from "next/image"
import { Link } from "@/i18n/routing"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
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
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { submitSellerFeedback } from "@/app/actions/seller-feedback"
import { requestReturn } from "@/app/actions/orders"
import {
  ArrowLeft,
  Package,
  Truck,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  ChatCircle,
  Receipt,
  Copy,
  ArrowSquareOut,
  SpinnerGap,
  Warning,
} from "@phosphor-icons/react"
import { toast } from "sonner"
import { formatDistanceToNow, format } from "date-fns"
import { bg, enUS } from "date-fns/locale"
import type { OrderItemStatus } from "@/lib/order-status"
import { OrderTimeline } from "./order-timeline"

interface OrderItem {
  id: string
  order_id: string
  product_id: string
  seller_id: string
  quantity: number
  price_at_purchase: number
  status: OrderItemStatus | null
  seller_received_at: string | null
  tracking_number: string | null
  shipping_carrier: string | null
  shipped_at: string | null
  delivered_at: string | null
  product: {
    id: string
    title: string
    slug: string | null
    images: string[] | null
    price: number
  } | null
  seller: {
    id: string
    store_name: string
    profile?: {
      full_name: string | null
      avatar_url: string | null
    }
  } | null
}

interface Order {
  id: string
  user_id: string
  total_amount: number
  status: string | null
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
  stripe_payment_intent_id: string | null
  order_items: OrderItem[]
}

interface OrderDetailContentProps {
  locale: string
  order: Order
  existingSellerFeedbackSellerIds?: string[]
}

const STATUS_CONFIG = {
  pending: { label: "Pending", labelBg: "Изчаква", color: "bg-warning", icon: Clock },
  paid: { label: "Paid", labelBg: "Платена", color: "bg-info", icon: Receipt },
  processing: { label: "Processing", labelBg: "Обработва се", color: "bg-primary", icon: Package },
  shipped: { label: "Shipped", labelBg: "Изпратена", color: "bg-primary", icon: Truck },
  delivered: { label: "Delivered", labelBg: "Доставена", color: "bg-success", icon: CheckCircle },
  cancelled: { label: "Cancelled", labelBg: "Отменена", color: "bg-destructive", icon: XCircle },
} as const satisfies Record<
  "pending" | "paid" | "processing" | "shipped" | "delivered" | "cancelled",
  { label: string; labelBg: string; color: string; icon: typeof CheckCircle }
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

const CARRIERS: Record<string, { name: string; trackingUrl: string }> = {
  speedy: { name: "Speedy", trackingUrl: "https://www.speedy.bg/bg/track-shipment?shipmentNumber=" },
  econt: { name: "Econt", trackingUrl: "https://www.econt.com/services/track-shipment/" },
  dhl: { name: "DHL", trackingUrl: "https://www.dhl.com/en/express/tracking.html?AWB=" },
  ups: { name: "UPS", trackingUrl: "https://www.ups.com/track?loc=en_US&tracknum=" },
  fedex: { name: "FedEx", trackingUrl: "https://www.fedex.com/fedextrack/?tracknumbers=" },
  dpd: { name: "DPD", trackingUrl: "https://www.dpd.com/bg/bg/paket-trassen/track-and-trace-system-bg/?parcelNr=" },
}

export function OrderDetailContent({ locale, order, existingSellerFeedbackSellerIds }: OrderDetailContentProps) {
  const [isReturnDialogOpen, setIsReturnDialogOpen] = useState(false)
  const [returnReason, setReturnReason] = useState("")
  const [selectedItem, setSelectedItem] = useState<OrderItem | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [isFeedbackDialogOpen, setIsFeedbackDialogOpen] = useState(false)
  const [feedbackSellerId, setFeedbackSellerId] = useState<string | null>(null)
  const [feedbackRating, setFeedbackRating] = useState<number>(5)
  const [feedbackComment, setFeedbackComment] = useState<string>("")
  const [itemAsDescribed, setItemAsDescribed] = useState(true)
  const [shippingSpeed, setShippingSpeed] = useState(true)
  const [communication, setCommunication] = useState(true)
  const [feedbackDismissed, setFeedbackDismissed] = useState(false)
  const [submittedSellerIds, setSubmittedSellerIds] = useState<Set<string>>(new Set())
  const [isSubmittingFeedback, startFeedbackTransition] = useTransition()

  const dateLocale = locale === "bg" ? bg : enUS
  const orderStatus = order.status || "pending"
  const orderStatusKey: OrderStatusKey = isOrderStatusKey(orderStatus) ? orderStatus : "pending"
  const statusConfig = STATUS_CONFIG[orderStatusKey]
  const StatusIcon = statusConfig.icon

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
  const openTracking = (item: OrderItem) => {
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
    const result = await requestReturn(selectedItem.id, returnReason)
    setIsSubmitting(false)

    if (!result.success) {
      toast.error(result.error || (locale === "bg" ? "Грешка" : "Error"))
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

  useEffect(() => {
    try {
      const key = `seller_feedback_prompt_dismissed_order_${order.id}`
      setFeedbackDismissed(localStorage.getItem(key) === "1")
    } catch {
      // ignore
    }
  }, [order.id])

  const pendingFeedbackSellers = useMemo(() => {
    const existing = new Set(existingSellerFeedbackSellerIds || [])
    const map = new Map<string, { sellerId: string; storeName: string }>()
    const nowMs = Date.now()

    for (const item of order.order_items) {
      if (!item.seller?.id) continue
      const sellerId = item.seller.id
      if (existing.has(sellerId)) continue
      if (submittedSellerIds.has(sellerId)) continue

      if (!item.delivered_at) continue
      const delivered = new Date(item.delivered_at)
      if (Number.isNaN(delivered.getTime())) continue

      const threeDaysMs = 3 * 24 * 60 * 60 * 1000
      if (nowMs - delivered.getTime() < threeDaysMs) continue

      if (!map.has(sellerId)) {
        map.set(sellerId, { sellerId, storeName: item.seller.store_name })
      }
    }

    return [...map.values()]
  }, [order.order_items, existingSellerFeedbackSellerIds, submittedSellerIds])

  const shouldShowFeedbackPrompt = pendingFeedbackSellers.length > 0 && !feedbackDismissed

  const openFeedbackDialog = (sellerId: string) => {
    setFeedbackSellerId(sellerId)
    setFeedbackRating(5)
    setFeedbackComment("")
    setItemAsDescribed(true)
    setShippingSpeed(true)
    setCommunication(true)
    setIsFeedbackDialogOpen(true)
  }

  const dismissFeedbackPrompt = () => {
    try {
      const key = `seller_feedback_prompt_dismissed_order_${order.id}`
      localStorage.setItem(key, "1")
    } catch {
      // ignore
    }
    setFeedbackDismissed(true)
  }

  const submitFeedback = () => {
    if (!feedbackSellerId) return
    startFeedbackTransition(async () => {
      const result = await submitSellerFeedback({
        sellerId: feedbackSellerId,
        orderId: order.id,
        rating: feedbackRating,
        comment: feedbackComment.trim() || null,
        itemAsDescribed,
        shippingSpeed,
        communication,
      })

      if (result.success) {
        toast.success(locale === "bg" ? "Благодарим за обратната връзка" : "Thanks for your feedback")
        setSubmittedSellerIds((prev) => new Set(prev).add(feedbackSellerId))
        setIsFeedbackDialogOpen(false)
        setFeedbackSellerId(null)
      } else {
        toast.error(result.error || (locale === "bg" ? "Грешка" : "Error"))
      }
    })
  }

  return (
    <div className="space-y-6">
      {/* Back Button & Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Link href="/account/orders">
            <Button variant="ghost" size="icon" className="size-8">
              <ArrowLeft className="size-4" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold">
                {locale === "bg" ? "Поръчка" : "Order"} #{order.id.slice(0, 8).toUpperCase()}
              </h2>
              <Button
                variant="ghost"
                size="icon"
                className="size-6"
                onClick={() => copyToClipboard(order.id, locale === "bg" ? "ID" : "ID")}
              >
                <Copy className="size-3" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              {format(new Date(order.created_at), "PPP", { locale: dateLocale })}
              {" · "}
              {formatDistanceToNow(new Date(order.created_at), { addSuffix: true, locale: dateLocale })}
            </p>
          </div>
        </div>
        <Badge variant="secondary" className={`${statusConfig.color} text-white`}>
          <StatusIcon className="size-3.5 mr-1" weight="fill" />
          {locale === "bg" ? statusConfig.labelBg : statusConfig.label}
        </Badge>
      </div>

      {/* Order Progress */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">{locale === "bg" ? "Статус на поръчката" : "Order Status"}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            {ORDER_PROGRESS_STATUSES.map((status, index, arr) => {
              const config = STATUS_CONFIG[status]
              const Icon = config.icon
              const isActive = arr.indexOf(normalizeProgressStatus(orderStatusKey)) >= index
              const isCurrent = orderStatus === status

              return (
                <div key={status} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div className={`size-8 rounded-full flex items-center justify-center transition-colors ${isActive ? config.color + " text-white" : "bg-muted text-muted-foreground"
                      }`}>
                      <Icon className="size-4" weight={isCurrent ? "fill" : "regular"} />
                    </div>
                    <span className={`text-xs mt-1.5 ${isActive ? "font-medium" : "text-muted-foreground"}`}>
                      {locale === "bg" ? config.labelBg : config.label}
                    </span>
                  </div>
                  {index < arr.length - 1 && (
                    <div className={`h-0.5 flex-1 mx-1 transition-colors ${arr.indexOf(normalizeProgressStatus(orderStatusKey)) > index ? "bg-primary" : "bg-muted"
                      }`} />
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Feedback prompt (after delivery + 3 days) */}
      {shouldShowFeedbackPrompt && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <CardTitle className="text-base">
                  {locale === "bg" ? "Оценете продавача" : "Rate your seller"}
                </CardTitle>
                <CardDescription>
                  {locale === "bg"
                    ? "Помогнете на други купувачи с обратна връзка."
                    : "Help other buyers with quick feedback."}
                </CardDescription>
              </div>
              <Button variant="ghost" size="sm" onClick={dismissFeedbackPrompt}>
                {locale === "bg" ? "Скрий" : "Dismiss"}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {pendingFeedbackSellers.map((s) => (
              <div key={s.sellerId} className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-sm font-medium truncate">{s.storeName}</div>
                  <div className="text-xs text-muted-foreground">
                    {locale === "bg" ? "Оставете оценка за поръчката" : "Leave feedback for this order"}
                  </div>
                </div>
                <Button size="sm" onClick={() => openFeedbackDialog(s.sellerId)}>
                  {locale === "bg" ? "Оцени" : "Review"}
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Order Items */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">
                {locale === "bg" ? "Продукти" : "Items"} ({order.order_items.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {order.order_items.map((item) => {
                const itemStatus = item.status || "pending"
                const itemConfig = getStatusConfig(itemStatus)
                const firstImage = item.product?.images?.[0]

                return (
                  <div key={item.id} className="flex gap-4 p-3 rounded-lg border bg-card">
                    {/* Product Image */}
                    <div className="relative size-20 rounded-md overflow-hidden bg-muted shrink-0">
                      {firstImage ? (
                        <Image
                          src={firstImage}
                          alt={item.product?.title || "Product"}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="size-full flex items-center justify-center">
                          <Package className="size-8 text-muted-foreground" />
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>

                          {/* Seller feedback dialog */}
                          <Dialog open={isFeedbackDialogOpen} onOpenChange={setIsFeedbackDialogOpen}>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>{locale === "bg" ? "Обратна връзка" : "Seller feedback"}</DialogTitle>
                                <DialogDescription>
                                  {locale === "bg"
                                    ? "Оценете качеството на поръчката и комуникацията."
                                    : "Rate the order experience and communication."}
                                </DialogDescription>
                              </DialogHeader>

                              <div className="space-y-4">
                                <div className="space-y-2">
                                  <Label>{locale === "bg" ? "Оценка" : "Rating"}</Label>
                                  <RadioGroup
                                    value={String(feedbackRating)}
                                    onValueChange={(v) => setFeedbackRating(Number(v))}
                                    className="flex flex-wrap gap-3"
                                  >
                                    {[5, 4, 3, 2, 1].map((r) => (
                                      <div key={r} className="flex items-center gap-2">
                                        <RadioGroupItem value={String(r)} id={`rating-${r}`} />
                                        <Label htmlFor={`rating-${r}`}>{r}</Label>
                                      </div>
                                    ))}
                                  </RadioGroup>
                                </div>

                                <div className="space-y-2">
                                  <Label>{locale === "bg" ? "Детайли" : "Details"}</Label>
                                  <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-sm">
                                      <Checkbox checked={itemAsDescribed} onCheckedChange={(v) => setItemAsDescribed(Boolean(v))} />
                                      {locale === "bg" ? "Описанието отговаря" : "Item as described"}
                                    </label>
                                    <label className="flex items-center gap-2 text-sm">
                                      <Checkbox checked={shippingSpeed} onCheckedChange={(v) => setShippingSpeed(Boolean(v))} />
                                      {locale === "bg" ? "Бърза доставка" : "Fast shipping"}
                                    </label>
                                    <label className="flex items-center gap-2 text-sm">
                                      <Checkbox checked={communication} onCheckedChange={(v) => setCommunication(Boolean(v))} />
                                      {locale === "bg" ? "Добра комуникация" : "Good communication"}
                                    </label>
                                  </div>
                                </div>

                                <div className="space-y-2">
                                  <Label htmlFor="seller-feedback-comment">{locale === "bg" ? "Коментар (по избор)" : "Comment (optional)"}</Label>
                                  <Textarea
                                    id="seller-feedback-comment"
                                    value={feedbackComment}
                                    onChange={(e) => setFeedbackComment(e.target.value)}
                                    rows={4}
                                  />
                                </div>
                              </div>

                              <DialogFooter>
                                <Button variant="outline" onClick={() => setIsFeedbackDialogOpen(false)}>
                                  {locale === "bg" ? "Отказ" : "Cancel"}
                                </Button>
                                <Button onClick={submitFeedback} disabled={isSubmittingFeedback}>
                                  {isSubmittingFeedback ? (
                                    <>
                                      <SpinnerGap className="size-4 mr-2 animate-spin" />
                                      {locale === "bg" ? "Изпращане..." : "Submitting..."}
                                    </>
                                  ) : (
                                    locale === "bg" ? "Изпрати" : "Submit"
                                  )}
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                          <Link
                            href={`/product/${item.product?.slug || item.product_id}`}
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

                      <div className="flex items-center justify-between mt-2">
                        <p className="text-sm">
                          {item.quantity} × {formatPrice(item.price_at_purchase)}
                        </p>
                        <p className="font-medium">
                          {formatPrice(item.quantity * item.price_at_purchase)}
                        </p>
                      </div>

                      {/* Tracking Info */}
                      {item.tracking_number && (
                        <div className="flex items-center gap-2 mt-2 p-2 rounded bg-muted/50">
                          <Truck className="size-4 text-muted-foreground" />
                          <span className="text-sm flex-1">
                            {item.shipping_carrier && CARRIERS[item.shipping_carrier.toLowerCase()]?.name}
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

                      {/* Actions */}
                      <div className="flex gap-2 mt-3">
                        <Link href={`/messages?seller=${item.seller_id}`}>
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
                            onClick={() => {
                              setSelectedItem(item)
                              setIsReturnDialogOpen(true)
                            }}
                          >
                            <Warning className="size-3.5 mr-1" />
                            {locale === "bg" ? "Върни" : "Return"}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </div>

        {/* Order Summary & Shipping */}
        <div className="space-y-4">
          {/* Order Summary */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">{locale === "bg" ? "Обобщение" : "Summary"}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{locale === "bg" ? "Междинна сума" : "Subtotal"}</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{locale === "bg" ? "Доставка" : "Shipping"}</span>
                <span>{shipping === 0 ? (locale === "bg" ? "Безплатна" : "Free") : formatPrice(shipping)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-medium">
                <span>{locale === "bg" ? "Общо" : "Total"}</span>
                <span>{formatPrice(total)}</span>
              </div>
              {order.stripe_payment_intent_id && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2">
                  <Receipt className="size-3.5" />
                  <span>Stripe: {order.stripe_payment_intent_id.slice(0, 20)}...</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-5"
                    onClick={() => copyToClipboard(order.stripe_payment_intent_id!, "Payment ID")}
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
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <MapPin className="size-4" />
                  {locale === "bg" ? "Адрес за доставка" : "Shipping Address"}
                </CardTitle>
              </CardHeader>
              <CardContent>
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
              </CardContent>
            </Card>
          )}

          {/* Help */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">{locale === "bg" ? "Нужда от помощ?" : "Need Help?"}</CardTitle>
              <CardDescription>
                {locale === "bg"
                  ? "Свържете се с продавача или поддръжката"
                  : "Contact the seller or support"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href="/support">
                <Button variant="outline" className="w-full justify-start">
                  <ChatCircle className="size-4 mr-2" />
                  {locale === "bg" ? "Свържете се с поддръжката" : "Contact Support"}
                </Button>
              </Link>
            </CardContent>
          </Card>
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
            <div className="flex items-center gap-3 p-3 rounded-lg border bg-muted/50">
              <div className="relative size-12 rounded overflow-hidden bg-muted">
                {selectedItem.product?.images?.[0] ? (
                  <Image
                    src={selectedItem.product.images[0]}
                    alt={selectedItem.product.title || "Product"}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="size-full flex items-center justify-center">
                    <Package className="size-5 text-muted-foreground" />
                  </div>
                )}
              </div>
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
