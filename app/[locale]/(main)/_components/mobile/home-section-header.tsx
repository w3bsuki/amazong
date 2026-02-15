"use client"

import type * as React from "react"
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
  const ariaLabel = badgeLabel ? `${badgeLabel}. ${title}. ${actionLabel}` : `${title}. ${actionLabel}`

  return (
    <Link
      href={href}
      aria-label={ariaLabel}
      className={cn(
        "group mb-2 flex w-full min-h-(--spacing-touch-md) items-center rounded-lg px-inset-md",
        "outline-none transition-colors touch-manipulation",
        "hover:bg-hover active:bg-active",
        "focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        className
      )}
    >
      <div className="min-w-0 flex items-center gap-2">
        {!isPromoted && leading ? <div className="shrink-0">{leading}</div> : null}

        <div className="min-w-0">
          {isPromoted && badgeLabel ? (
            <span className="mb-1 inline-flex h-5 max-w-full items-center rounded-full border border-foreground bg-foreground px-1.5 text-2xs font-semibold uppercase leading-none tracking-wide text-background">
              {badgeLabel}
            </span>
          ) : null}
          <h2 className="min-w-0 truncate text-xl font-semibold tracking-tight text-home-section-title">
            {title}
          </h2>
        </div>
      </div>
      <span className="sr-only">{actionLabel}</span>
    </Link>
  )
}
