"use client"

import Link from "next/link"
import {
  IconAlertTriangle,
  IconStar,
  IconShoppingCart,
} from "@tabler/icons-react"
import { cn } from "@/lib/utils"

interface TasksCount {
  unfulfilled: number
  lowStock: number
  pendingReviews: number
}

interface BusinessTaskCardsProps {
  tasks: TasksCount
  className?: string
}

const taskConfig = [
  {
    key: "unfulfilled" as const,
    label: "orders",
    href: "/dashboard/orders?status=pending",
    icon: IconShoppingCart,
    bgColor: "bg-yellow-50 dark:bg-yellow-950/30",
    borderColor: "border-yellow-200 dark:border-yellow-800",
    textColor: "text-yellow-700 dark:text-yellow-300",
    iconColor: "text-yellow-600 dark:text-yellow-400",
  },
  {
    key: "lowStock" as const,
    label: "low stock",
    href: "/dashboard/inventory?filter=low",
    icon: IconAlertTriangle,
    bgColor: "bg-orange-50 dark:bg-orange-950/30",
    borderColor: "border-orange-200 dark:border-orange-800",
    textColor: "text-orange-700 dark:text-orange-300",
    iconColor: "text-orange-600 dark:text-orange-400",
  },
  {
    key: "pendingReviews" as const,
    label: "reviews",
    href: "/dashboard/reviews",
    icon: IconStar,
    bgColor: "bg-blue-50 dark:bg-blue-950/30",
    borderColor: "border-blue-200 dark:border-blue-800",
    textColor: "text-blue-700 dark:text-blue-300",
    iconColor: "text-blue-600 dark:text-blue-400",
  },
]

// Compact inline badge version
export function BusinessTaskCards({ tasks, className }: BusinessTaskCardsProps) {
  const activeTasks = taskConfig.filter((task) => tasks[task.key] > 0)
  
  if (activeTasks.length === 0) return null

  return (
    <div className={cn("flex items-center gap-2 flex-wrap", className)}>
      {activeTasks.map((task) => {
        const count = tasks[task.key]
        const Icon = task.icon
        
        return (
          <Link 
            key={task.key} 
            href={task.href}
            className={cn(
              "flex items-center gap-1.5 px-2.5 py-1 rounded-full border transition-all hover:shadow-sm",
              task.bgColor,
              task.borderColor
            )}
          >
            <Icon className={cn("size-3", task.iconColor)} />
            <span className={cn("text-xs font-medium", task.textColor)}>{count}</span>
            <span className={cn("text-2xs", task.textColor, "opacity-70")}>{task.label}</span>
          </Link>
        )
      })}
    </div>
  )
}
