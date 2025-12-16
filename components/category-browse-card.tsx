import * as React from "react"

import { Link } from "@/i18n/routing"
import { cn } from "@/lib/utils"
import type { Icon as PhosphorIcon } from "@phosphor-icons/react"

export type CategoryBrowseCardTone = {
  icon?: string
  shell?: string
}

export function CategoryBrowseCard({
  href,
  title,
  icon: Icon,
  badge,
  meta,
  tone,
  className,
  iconWrapClassName,
  iconClassName,
}: {
  href: string
  title: string
  icon: PhosphorIcon
  badge?: string
  meta?: string
  tone?: CategoryBrowseCardTone
  className?: string
  iconWrapClassName?: string
  iconClassName?: string
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group",
        "rounded-2xl border border-border bg-card",
        "ring-1 ring-inset ring-border/25",
        "px-3 py-3",
        "touch-action-manipulation",
        "hover:bg-accent/20",
        "active:bg-accent/40",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        className
      )}
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "shrink-0",
            "size-11 rounded-xl",
            "bg-muted/30 border border-border/60",
            "ring-1 ring-inset ring-border/25",
            "flex items-center justify-center",
            tone?.shell,
            iconWrapClassName
          )}
          aria-hidden="true"
        >
          <Icon className={cn("size-6 text-link", tone?.icon, iconClassName)} weight="fill" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="text-sm sm:text-[15px] font-semibold text-foreground tracking-tight leading-snug line-clamp-2">
                {title}
              </div>
              {meta ? <div className="mt-0.5 text-2xs text-muted-foreground">{meta}</div> : null}
            </div>

            {badge ? (
              <span
                className={cn(
                  "shrink-0",
                  "text-2xs font-semibold",
                  "px-2 py-0.5 rounded-full",
                  "bg-muted/20 border border-border/60",
                  "text-muted-foreground"
                )}
              >
                {badge}
              </span>
            ) : null}
          </div>
        </div>
      </div>
    </Link>
  )
}
