import { CircleCheck, Clock3, Package, Truck } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { SellerOrdersStats, StatusFilter } from "./seller-orders.types"

type SellerOrdersStatsCardsProps = {
  stats: SellerOrdersStats
  activeTab: StatusFilter
  setActiveTab: (value: StatusFilter) => void
  labels: {
    pending: string
    processing: string
    shipped: string
    delivered: string
  }
}

const statCards = [
  { key: "pending" as const, labelKey: "pending" as const, icon: Clock3, color: "bg-order-pending" },
  { key: "processing" as const, labelKey: "processing" as const, icon: Package, color: "bg-order-processing" },
  { key: "shipped" as const, labelKey: "shipped" as const, icon: Truck, color: "bg-order-shipped" },
  { key: "delivered" as const, labelKey: "delivered" as const, icon: CircleCheck, color: "bg-order-delivered" },
]

export function SellerOrdersStatsCards({
  stats,
  activeTab,
  setActiveTab,
  labels,
}: SellerOrdersStatsCardsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {statCards.map((stat) => {
        const Icon = stat.icon
        return (
          <Card
            key={stat.key}
            className={cn("cursor-pointer transition-shadow hover:shadow-md", activeTab === stat.key && "ring-2 ring-primary")}
            onClick={() => setActiveTab(stat.key)}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={cn("w-10 h-10 rounded-full flex items-center justify-center text-badge-fg-on-solid", stat.color)}>
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats[stat.key]}</p>
                  <p className="text-sm text-muted-foreground">{labels[stat.labelKey]}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
