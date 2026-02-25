import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface StepLayoutProps {
  title: string
  description?: string
  children: ReactNode
  contentClassName?: string
}

export function StepLayout({ title, description, children, contentClassName }: StepLayoutProps) {
  return (
    <div className="space-y-5">
      <div className="space-y-0.5">
        <h2 className="text-base font-semibold text-foreground">{title}</h2>
        {description ? <p className="text-xs text-muted-foreground">{description}</p> : null}
      </div>

      <div className={cn(contentClassName ?? "space-y-5")}>{children}</div>
    </div>
  )
}


