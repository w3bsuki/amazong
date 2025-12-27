import * as React from "react"

import { cn } from "@/lib/utils"

type CountBadgeProps = Omit<React.ComponentPropsWithoutRef<"span">, "children"> & {
  count: number
  max?: number
}

export function CountBadge({ count, max = 99, className, ...props }: CountBadgeProps) {
  if (!Number.isFinite(count) || count <= 0) return null

  const label = count > max ? `${max}+` : String(count)

  return (
    <span
      {...props}
      className={cn(
        "inline-flex items-center justify-center rounded-full px-1 min-w-4 h-4 text-2xs font-bold leading-none tabular-nums",
        className
      )}
    >
      {label}
    </span>
  )
}
