import {
  CircleCheck as CheckCircle,
  Clock,
  Package,
  Receipt,
  Truck,
  CircleX as XCircle,
} from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const STATUS_CONFIG = {
  pending: {
    label: "Pending",
    labelBg: "Изчаква",
    color: "bg-warning",
    text: "text-warning-foreground",
    icon: Clock,
  },
  paid: {
    label: "Paid",
    labelBg: "Платена",
    color: "bg-info",
    text: "text-info-foreground",
    icon: Receipt,
  },
  processing: {
    label: "Processing",
    labelBg: "Обработва се",
    color: "bg-primary",
    text: "text-primary-foreground",
    icon: Package,
  },
  shipped: {
    label: "Shipped",
    labelBg: "Изпратена",
    color: "bg-primary",
    text: "text-primary-foreground",
    icon: Truck,
  },
  delivered: {
    label: "Delivered",
    labelBg: "Доставена",
    color: "bg-success",
    text: "text-success-foreground",
    icon: CheckCircle,
  },
  cancelled: {
    label: "Cancelled",
    labelBg: "Отменена",
    color: "bg-destructive",
    text: "text-destructive-foreground",
    icon: XCircle,
  },
} as const satisfies Record<
  "pending" | "paid" | "processing" | "shipped" | "delivered" | "cancelled",
  { label: string; labelBg: string; color: string; text: string; icon: typeof CheckCircle }
>

export type OrderStatusKey = keyof typeof STATUS_CONFIG

const ORDER_PROGRESS_STATUSES = ["pending", "paid", "processing", "shipped", "delivered"] as const
type OrderProgressStatusKey = (typeof ORDER_PROGRESS_STATUSES)[number]

function normalizeProgressStatus(status: OrderStatusKey): OrderProgressStatusKey {
  return status === "cancelled" ? "pending" : status
}

export function isOrderStatusKey(status: string): status is OrderStatusKey {
  return status in STATUS_CONFIG
}

export function getStatusConfig(status: string): (typeof STATUS_CONFIG)[OrderStatusKey] {
  return STATUS_CONFIG[isOrderStatusKey(status) ? status : "pending"]
}

export function getLocalizedStatusLabel(
  locale: string,
  config: (typeof STATUS_CONFIG)[OrderStatusKey]
) {
  return locale === "bg" ? config.labelBg : config.label
}

export function OrderProgressCard({
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
