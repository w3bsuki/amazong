import * as React from "react"
import { cn } from "@/lib/utils"

export function SectionHeader({
  title,
  href,
  className,
}: {
  title: string
  href?: string
  className?: string
}) {
  return (
    <div className={cn("flex items-end justify-between px-4", className)}>
      <h2 className="text-base font-semibold tracking-tight">{title}</h2>
      {href ? (
        <a
          href={href}
          className="text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          See all →
        </a>
      ) : null}
    </div>
  )
}
