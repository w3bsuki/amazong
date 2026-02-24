import { format } from "date-fns"
import { Clock as IconClock } from "lucide-react"

import { OrderDetailSideCard } from "@/components/shared/order-detail/order-side-card"
import { cn } from "@/lib/utils"

import { STATUS_CONFIG, type StatusKey } from "./order-detail-view.helpers"

export function OrderDetailViewTimelineCard({
  createdAt,
  statusConfig,
}: {
  createdAt: string
  statusConfig: (typeof STATUS_CONFIG)[StatusKey]
}) {
  const StatusIcon = statusConfig.icon

  return (
    <OrderDetailSideCard title="Timeline">
      <div className="space-y-4">
        <div className="flex gap-3">
          <div className="flex flex-col items-center">
            <div className={cn("flex size-8 items-center justify-center rounded-full", statusConfig.color)}>
              <StatusIcon className="size-4" />
            </div>
            <div className="w-px h-full bg-border" />
          </div>
          <div className="pb-4">
            <p className="font-medium text-sm">{statusConfig.label}</p>
            <p className="text-xs text-muted-foreground">
              {format(new Date(createdAt), "MMM d, yyyy 'at' h:mm a")}
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <div className="flex flex-col items-center">
            <div className="flex size-8 items-center justify-center rounded-full bg-muted">
              <IconClock className="size-4 text-muted-foreground" />
            </div>
          </div>
          <div>
            <p className="font-medium text-sm">Order placed</p>
            <p className="text-xs text-muted-foreground">
              {format(new Date(createdAt), "MMM d, yyyy 'at' h:mm a")}
            </p>
          </div>
        </div>
      </div>
    </OrderDetailSideCard>
  )
}
