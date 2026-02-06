"use client"

import type * as React from "react"
import { CaretRight } from "@phosphor-icons/react"
import { Link } from "@/i18n/routing"
import { cn } from "@/lib/utils"

export interface HomeSectionHeaderProps {
  title: string
  href: string
  actionLabel: string
  leading?: React.ReactNode
  className?: string
}

export function HomeSectionHeader({
  title,
  href,
  actionLabel,
  leading,
  className,
}: HomeSectionHeaderProps) {
  return (
    <div className={cn("mb-2 flex items-center justify-between gap-2 px-inset-md", className)}>
      <div className="min-w-0 flex items-center gap-2">
        {leading && <div className="shrink-0">{leading}</div>}
        <h2 className="min-w-0 truncate text-lg font-bold tracking-tight text-foreground">
          {title}
        </h2>
      </div>
      <Link
        href={href}
        className={cn(
          "inline-flex min-h-(--spacing-touch-md) items-center gap-1 rounded-md px-1.5 -mr-1",
          "text-sm font-semibold text-muted-foreground transition-colors",
          "hover:text-foreground active:bg-active active:text-foreground"
        )}
      >
        {actionLabel}
        <CaretRight size={14} weight="bold" aria-hidden="true" />
      </Link>
    </div>
  )
}
