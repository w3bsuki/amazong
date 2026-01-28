import { Link } from "@/i18n/routing"
import {
  IconAlertTriangle,
  IconStar,
  IconShoppingCart,
} from "@tabler/icons-react"
import { cn } from "@/lib/utils"

interface TasksCount {
  unfulfilled: number
  lowStock: number
  recentReviews: number
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
    bgColor: "bg-order-processing/10",
    borderColor: "border-order-processing/20",
    textColor: "text-order-processing",
    iconColor: "text-order-processing",
  },
  {
    key: "lowStock" as const,
    label: "low stock",
    href: "/dashboard/inventory?filter=low",
    icon: IconAlertTriangle,
    bgColor: "bg-warning/10",
    borderColor: "border-warning/20",
    textColor: "text-warning",
    iconColor: "text-warning",
  },
  {
    key: "recentReviews" as const,
    label: "new reviews",
    href: "/dashboard/reviews",
    icon: IconStar,
    bgColor: "bg-selected",
    borderColor: "border-selected-border",
    textColor: "text-primary",
    iconColor: "text-primary",
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
