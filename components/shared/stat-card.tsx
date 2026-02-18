import type { LucideIcon } from "lucide-react"
import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

interface StatCardGridProps {
  children: ReactNode
  className?: string | undefined
}

interface StatCardProps {
  label: ReactNode
  value: ReactNode
  icon?: LucideIcon | undefined
  badge?: ReactNode | undefined
  footer?: ReactNode | undefined
  className?: string | undefined
  headerClassName?: string | undefined
  valueClassName?: string | undefined
  iconClassName?: string | undefined
}

export function StatCardGrid({ children, className }: StatCardGridProps) {
  return <div className={cn("grid grid-cols-2 gap-3 @xl/main:grid-cols-4", className)}>{children}</div>
}

export function StatCard({
  label,
  value,
  icon: Icon,
  badge,
  footer,
  className,
  headerClassName,
  valueClassName,
  iconClassName,
}: StatCardProps) {
  return (
    <Card className={cn("@container/card", className)}>
      <CardHeader className={headerClassName}>
        <CardDescription className="flex items-center gap-1.5">
          {Icon ? <Icon className={cn("size-4 shrink-0", iconClassName)} /> : null}
          <span className="truncate">{label}</span>
        </CardDescription>
        <CardTitle className={cn("text-2xl font-semibold tabular-nums @[250px]/card:text-3xl", valueClassName)}>
          {value}
        </CardTitle>
        {badge ? <CardAction>{badge}</CardAction> : null}
      </CardHeader>
      {footer ? <CardFooter className="flex-col items-start gap-1.5 text-sm">{footer}</CardFooter> : null}
    </Card>
  )
}
