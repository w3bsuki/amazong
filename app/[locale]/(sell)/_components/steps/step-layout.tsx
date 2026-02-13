"use client"

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
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">{title}</h2>
        {description ? <p className="text-reading text-muted-foreground">{description}</p> : null}
      </div>

      <div className={cn(contentClassName ?? "space-y-6")}>{children}</div>
    </div>
  )
}

