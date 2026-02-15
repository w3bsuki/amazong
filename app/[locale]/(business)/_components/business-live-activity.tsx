"use client"

import * as React from "react"
import {
  IconUsers,
  IconShoppingCart,
} from "@/lib/icons/tabler"
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
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-success/10 border border-success/20">
          <span className="relative flex size-1.5">
            <span className={cn(
              "absolute inline-flex h-full w-full rounded-full bg-success/70 opacity-75",
              isPulsing && "animate-ping"
            )} />
            <span className="relative inline-flex size-1.5 rounded-full bg-success" />
          </span>
          <IconUsers className="size-3 text-success" />
          <span className="text-xs font-medium text-success">{currentVisitors}</span>
          <span className="text-2xs text-success">live</span>
        </div>
      )}
      {cartAdds > 0 && (
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-selected border border-selected-border">
          <IconShoppingCart className="size-3 text-primary" />
          <span className="text-xs font-medium text-primary">{cartAdds}</span>
          <span className="text-2xs text-primary">cart</span>
        </div>
      )}
    </div>
  )
}
