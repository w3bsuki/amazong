"use client"

import * as React from "react"
import {
  IconUsers,
  IconShoppingCart,
} from "@tabler/icons-react"
import { cn } from "@/lib/utils"

interface LiveActivityProps {
  currentVisitors?: number
  cartAdds?: number
  className?: string
}

// Compact inline badge version
export function BusinessLiveActivity({
  currentVisitors = 0,
  cartAdds = 0,
  className,
}: LiveActivityProps) {
  const [isPulsing, setIsPulsing] = React.useState(true)

  React.useEffect(() => {
    const interval = setInterval(() => {
      setIsPulsing(prev => !prev)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  if (currentVisitors === 0 && cartAdds === 0) {
    return null
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {currentVisitors > 0 && (
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
          <span className="relative flex size-1.5">
            <span className={cn(
              "absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75",
              isPulsing && "animate-ping"
            )} />
            <span className="relative inline-flex size-1.5 rounded-full bg-emerald-500" />
          </span>
          <IconUsers className="size-3 text-emerald-600 dark:text-emerald-400" />
          <span className="text-xs font-medium text-emerald-700 dark:text-emerald-300">{currentVisitors}</span>
          <span className="text-2xs text-emerald-600/70 dark:text-emerald-400/70">live</span>
        </div>
      )}
      {cartAdds > 0 && (
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800">
          <IconShoppingCart className="size-3 text-orange-600 dark:text-orange-400" />
          <span className="text-xs font-medium text-orange-700 dark:text-orange-300">{cartAdds}</span>
          <span className="text-2xs text-orange-600/70 dark:text-orange-400/70">cart</span>
        </div>
      )}
    </div>
  )
}
