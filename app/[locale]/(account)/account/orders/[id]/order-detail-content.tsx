"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
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

interface OrderItem {
  id: string
  order_id: string
  product_id: string
  seller_id: string
  quantity: number
  price_at_purchase: number
  status: OrderItemStatus | null
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
}

const STATUS_CONFIG: Record<string, { label: string; labelBg: string; color: string; icon: typeof CheckCircle }> = {
  pending: { label: "Pending", labelBg: "Изчаква", color: "bg-yellow-500", icon: Clock },
  paid: { label: "Paid", labelBg: "Платена", color: "bg-blue-500", icon: Receipt },
  processing: { label: "Processing", labelBg: "Обработва се", color: "bg-indigo-500", icon: Package },
  shipped: { label: "Shipped", labelBg: "Изпратена", color: "bg-purple-500", icon: Truck },
  delivered: { label: "Delivered", labelBg: "Доставена", color: "bg-green-500", icon: CheckCircle },
  cancelled: { label: "Cancelled", labelBg: "Отменена", color: "bg-red-500", icon: XCircle },
}

const CARRIERS: Record<string, { name: string; trackingUrl: string }> = {
  speedy: { name: "Speedy", trackingUrl: "https://www.speedy.bg/bg/track-shipment?shipmentNumber=" },
  econt: { name: "Econt", trackingUrl: "https://www.econt.com/services/track-shipment/" },
  dhl: { name: "DHL", trackingUrl: "https://www.dhl.com/en/express/tracking.html?AWB=" },
  ups: { name: "UPS", trackingUrl: "https://www.ups.com/track?loc=en_US&tracknum=" },
  fedex: { name: "FedEx", trackingUrl: "https://www.fedex.com/fedextrack/?tracknumbers=" },
  dpd: { name: "DPD", trackingUrl: "https://www.dpd.com/bg/bg/paket-trassen/track-and-trace-system-bg/?parcelNr=" },
}

export function OrderDetailContent({ locale, order }: OrderDetailContentProps) {
  const [isReturnDialogOpen, setIsReturnDialogOpen] = useState(false)
  const [returnReason, setReturnReason] = useState("")
  const [selectedItem, setSelectedItem] = useState<OrderItem | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const dateLocale = locale === "bg" ? bg : enUS
  const orderStatus = order.status || "pending"
  const statusConfig = STATUS_CONFIG[orderStatus] || STATUS_CONFIG.pending
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
    // TODO: Implement return request server action
    await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
    setIsSubmitting(false)
    
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
  const shipping = 0 // TODO: Get from order
  const total = Number(order.total_amount)

  const shippingAddress = order.shipping_address?.address

  return (
    <div className="space-y-6">
      {/* Back Button & Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Link href={`/${locale}/account/orders`}>
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
            {["pending", "paid", "processing", "shipped", "delivered"].map((status, index, arr) => {
              const config = STATUS_CONFIG[status]
              const Icon = config.icon
              const isActive = arr.indexOf(orderStatus) >= index
              const isCurrent = orderStatus === status
              
              return (
                <div key={status} className="flex items-center flex-1">
                  <div className={`flex flex-col items-center flex-1 ${isCurrent ? "scale-110" : ""}`}>
                    <div className={`size-8 rounded-full flex items-center justify-center transition-colors ${
                      isActive ? config.color + " text-white" : "bg-muted text-muted-foreground"
                    }`}>
                      <Icon className="size-4" weight={isCurrent ? "fill" : "regular"} />
                    </div>
                    <span className={`text-xs mt-1.5 ${isActive ? "font-medium" : "text-muted-foreground"}`}>
                      {locale === "bg" ? config.labelBg : config.label}
                    </span>
                  </div>
                  {index < arr.length - 1 && (
                    <div className={`h-0.5 flex-1 mx-1 transition-colors ${
                      arr.indexOf(orderStatus) > index ? "bg-primary" : "bg-muted"
                    }`} />
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
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
                const itemConfig = STATUS_CONFIG[itemStatus] || STATUS_CONFIG.pending
                
                return (
                  <div key={item.id} className="flex gap-4 p-3 rounded-lg border bg-card">
                    {/* Product Image */}
                    <div className="relative size-20 rounded-md overflow-hidden bg-muted flex-shrink-0">
                      {item.product?.images?.[0] ? (
                        <Image
                          src={item.product.images[0]}
                          alt={item.product.title || "Product"}
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
                          <Link 
                            href={`/${locale}/product/${item.product?.slug || item.product_id}`}
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
                        <Badge variant="outline" className="flex-shrink-0">
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
                        <Link href={`/${locale}/messages?seller=${item.seller_id}`}>
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
              <Link href={`/${locale}/support`}>
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
