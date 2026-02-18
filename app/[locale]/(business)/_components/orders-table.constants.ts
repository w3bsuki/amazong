import {
  Check as IconCheck,
  Package as IconPackage,
  RefreshCw as IconRefresh,
  Truck as IconTruck,
  X as IconX,
} from "lucide-react"

export const STATUS_CONFIG = {
  pending: {
    label: "Unfulfilled",
    icon: IconPackage,
  },
  processing: {
    label: "In Progress",
    icon: IconRefresh,
  },
  shipped: {
    label: "Shipped",
    icon: IconTruck,
  },
  delivered: {
    label: "Delivered",
    icon: IconCheck,
  },
  cancelled: {
    label: "Cancelled",
    icon: IconX,
  },
  paid: {
    label: "Paid",
    icon: IconCheck,
  },
} as const

type StatusKey = keyof typeof STATUS_CONFIG

export function getStatusConfig(status: string): (typeof STATUS_CONFIG)[StatusKey] {
  if (status in STATUS_CONFIG) return STATUS_CONFIG[status as StatusKey]
  return STATUS_CONFIG.pending
}
