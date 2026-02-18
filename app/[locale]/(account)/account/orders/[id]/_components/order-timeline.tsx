import { useMemo } from "react"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { OrderDetailSideCard } from "@/components/shared/order-detail/order-side-card"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { bg, enUS } from "date-fns/locale"
import { CircleCheck as CheckCircle, Clock, Package, Receipt, Truck } from "lucide-react";

import type { OrderItemStatus } from "@/lib/order-status"

type TimelineOrderItem = {
  status: OrderItemStatus | null
  seller_received_at: string | null
  shipped_at: string | null
  delivered_at: string | null
  tracking_number: string | null
  shipping_carrier: string | null
}

interface OrderTimelineProps {
  locale: string
  orderCreatedAt: string
  orderStatus: string | null
  orderItems: TimelineOrderItem[]
}

type TimelineStep = {
  key: string
  label: { en: string; bg: string }
  icon: React.ComponentType<{ className?: string; weight?: "fill" | "regular" }>
  at: string | null
  meta?: string | null
}

const formatDateTime = (iso: string, locale: string) => {
  const dateLocale = locale === "bg" ? bg : enUS
  return format(new Date(iso), "PPP p", { locale: dateLocale })
}

export function OrderTimeline({ locale, orderCreatedAt, orderStatus, orderItems }: OrderTimelineProps) {
  const summary = useMemo(() => {
    const sellerReceivedAt = orderItems
      .map((i) => i.seller_received_at)
      .filter(Boolean)
      .sort()[0] ?? null

    const shippedAt = orderItems
      .map((i) => i.shipped_at)
      .filter(Boolean)
      .sort()[0] ?? null

    const deliveredAt = orderItems
      .map((i) => i.delivered_at)
      .filter(Boolean)
      .sort()[0] ?? null

    const lastDeliveredAt = orderItems
      .map((i) => i.delivered_at)
      .filter(Boolean)
      .sort()
      .at(-1) ?? null

    const hasAnyTracking = orderItems.some((i) => i.tracking_number)
    const sampleTracking = orderItems.find((i) => i.tracking_number)?.tracking_number ?? null
    const sampleCarrier = orderItems.find((i) => i.shipping_carrier)?.shipping_carrier ?? null

    const isCompleted = orderItems.length > 0 && orderItems.every((i) => i.status === "delivered")

    return {
      sellerReceivedAt,
      shippedAt,
      deliveredAt,
      lastDeliveredAt,
      hasAnyTracking,
      sampleTracking,
      sampleCarrier,
      isCompleted,
    }
  }, [orderItems])

  const paymentConfirmedAt = useMemo(() => {
    if (!orderStatus) return null
    const paidStates = new Set(["paid", "processing", "shipped", "delivered", "cancelled"])
    return paidStates.has(orderStatus) ? orderCreatedAt : null
  }, [orderCreatedAt, orderStatus])

  const steps: TimelineStep[] = [
    {
      key: "placed",
      label: { en: "Order placed", bg: "Поръчката е направена" },
      icon: Package,
      at: orderCreatedAt,
    },
    {
      key: "paid",
      label: { en: "Payment confirmed", bg: "Плащането е потвърдено" },
      icon: Receipt,
      at: paymentConfirmedAt,
    },
    {
      key: "received",
      label: { en: "Seller received", bg: "Продавачът я получи" },
      icon: CheckCircle,
      at: summary.sellerReceivedAt,
    },
    {
      key: "shipped",
      label: { en: "Shipped", bg: "Изпратена" },
      icon: Truck,
      at: summary.shippedAt,
      meta: summary.hasAnyTracking
        ? [
            summary.sampleTracking ? `#${summary.sampleTracking}` : null,
            summary.sampleCarrier ? String(summary.sampleCarrier) : null,
          ]
            .filter(Boolean)
            .join(" ")
        : null,
    },
    {
      key: "delivered",
      label: { en: "Delivered", bg: "Доставена" },
      icon: CheckCircle,
      at: summary.deliveredAt,
    },
    {
      key: "completed",
      label: { en: "Completed", bg: "Приключена" },
      icon: CheckCircle,
      at: summary.isCompleted ? summary.lastDeliveredAt : null,
    },
  ]

  const anyKnownTimestamps = steps.some((s) => s.at)

  return (
    <OrderDetailSideCard title={locale === "bg" ? "Хронология" : "Timeline"}>
        {!anyKnownTimestamps ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="size-4" />
            <span>{locale === "bg" ? "Няма налична хронология." : "No timeline data yet."}</span>
          </div>
        ) : (
          <div className="space-y-3">
            {steps.map((step, idx) => {
              const isDone = Boolean(step.at)
              const Icon = step.icon
              return (
                <div key={step.key}>
                  <div className="flex items-start gap-3">
                    <div
                      className={cn(
                        "mt-0.5 flex size-8 items-center justify-center rounded-full border",
                        isDone ? "bg-foreground text-background border-foreground" : "bg-muted text-muted-foreground"
                      )}
                    >
                      <Icon className="size-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className={cn("text-sm", isDone ? "font-medium text-foreground" : "text-muted-foreground")}>
                          {locale === "bg" ? step.label.bg : step.label.en}
                        </p>
                        {isDone ? (
                          <Badge variant="secondary" className="shrink-0">
                            {step.at ? formatDateTime(step.at, locale) : null}
                          </Badge>
                        ) : (
                          <span className="text-xs text-muted-foreground">{locale === "bg" ? "Очаква се" : "Pending"}</span>
                        )}
                      </div>
                      {step.meta && isDone && (
                        <p className="text-xs text-muted-foreground mt-1">{step.meta}</p>
                      )}
                    </div>
                  </div>
                  {idx < steps.length - 1 && <Separator className="my-3" />}
                </div>
              )
            })}
          </div>
        )}
    </OrderDetailSideCard>
  )
}

