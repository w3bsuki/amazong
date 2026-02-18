import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

interface HeaderDropdownTitleRowProps {
  icon: ReactNode
  title: string
  count?: number
  showZeroCount?: boolean
  className?: string
}

export function HeaderDropdownTitleRow({
  icon,
  title,
  count,
  showZeroCount = false,
  className,
}: HeaderDropdownTitleRowProps) {
  return (
    <div className={cn("flex items-center gap-2 p-4 bg-muted border-b border-border", className)}>
      <span className="text-muted-foreground" aria-hidden="true">
        {icon}
      </span>
      <h3 className="font-semibold text-base text-foreground">{title}</h3>
      {typeof count === "number" && (count > 0 || showZeroCount) && (
        <span className="text-xs bg-notification text-primary-foreground px-2 py-0.5 rounded-full" aria-hidden="true">
          {count}
        </span>
      )}
    </div>
  )
}

export function HeaderDropdownFooter({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div className={cn("p-3 bg-muted border-t border-border", className)}>
      {children}
    </div>
  )
}
