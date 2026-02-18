import type { ReactNode } from "react"

import { CountBadge } from "@/components/shared/count-badge"
import { cn } from "@/lib/utils"

interface HeaderIconTriggerProps {
  icon: ReactNode
  badgeCount?: number
  className?: string | undefined
  badgeClassName?: string | undefined
  bordered?: boolean
}

export function HeaderIconTrigger({
  icon,
  badgeCount = 0,
  className,
  badgeClassName,
  bordered = true,
}: HeaderIconTriggerProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center justify-center rounded-md text-header-text hover:bg-header-hover active:bg-header-active relative size-11 [&_svg]:size-6 cursor-pointer tap-transparent motion-safe:transition-colors motion-safe:duration-fast motion-safe:ease-(--ease-smooth) motion-reduce:transition-none",
        bordered && "border border-transparent hover:border-header-text/20",
        className
      )}
    >
      <span className="relative" aria-hidden="true">
        {icon}
        {badgeCount > 0 && (
          <CountBadge
            count={badgeCount}
            className={badgeClassName}
            aria-hidden="true"
          />
        )}
      </span>
    </div>
  )
}
