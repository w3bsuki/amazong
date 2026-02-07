"use client"

import type * as React from "react"
import { CaretRight, Lightning } from "@phosphor-icons/react"
import { Link } from "@/i18n/routing"
import { cn } from "@/lib/utils"

export interface HomeSectionHeaderProps {
  title: string
  href: string
  actionLabel: string
  variant?: "default" | "promoted"
  badgeLabel?: string
  leading?: React.ReactNode
  className?: string
}

export function HomeSectionHeader({
  title,
  href,
  actionLabel,
  variant = "default",
  leading,
  className,
}: HomeSectionHeaderProps) {
  const isPromoted = variant === "promoted"

  return (
    <div className={cn("mb-2 flex items-center justify-between gap-2 px-inset-md", className)}>
      <div className="min-w-0 flex items-center gap-2">
        {isPromoted ? (
          <>
            <span className="inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-foreground text-background">
              <Lightning size={12} weight="fill" className="shrink-0" />
            </span>
            <h2 className="min-w-0 truncate text-lg font-semibold tracking-tight text-home-section-title">
              {title}
            </h2>
          </>
        ) : (
          <>
            {leading && <div className="shrink-0">{leading}</div>}
            <h2 className="min-w-0 truncate text-lg font-semibold tracking-tight text-home-section-title">
              {title}
            </h2>
          </>
        )}
      </div>
      <Link
        href={href}
        className={cn(
          "inline-flex min-h-(--spacing-touch-md) items-center gap-1 rounded-md px-1.5 -mr-1",
          "text-sm font-medium text-home-section-action transition-colors",
          "hover:text-home-section-title active:bg-active active:text-home-section-title"
        )}
      >
        {actionLabel}
        <CaretRight size={14} weight="bold" aria-hidden="true" />
      </Link>
    </div>
  )
}
