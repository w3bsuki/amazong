"use client"

import type * as React from "react"
import { CaretRight } from "@phosphor-icons/react"
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
  badgeLabel,
  leading,
  className,
}: HomeSectionHeaderProps) {
  const isPromoted = variant === "promoted"

  return (
    <div className={cn("mb-2 flex items-center justify-between gap-2 px-inset-md", className)}>
      <div className="min-w-0 flex items-center gap-2">
        {!isPromoted && leading ? <div className="shrink-0">{leading}</div> : null}

        <div className="min-w-0">
          {isPromoted && badgeLabel ? (
            <span className="mb-1 inline-flex h-5 max-w-full items-center rounded-full border border-foreground bg-foreground px-1.5 text-2xs font-semibold uppercase leading-none tracking-wide text-background">
              {badgeLabel}
            </span>
          ) : null}
          <h2 className="min-w-0 truncate text-lg font-semibold tracking-tight text-home-section-title">
            {title}
          </h2>
        </div>
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
