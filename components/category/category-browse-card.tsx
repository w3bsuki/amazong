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
        "rounded-xl border border-border bg-card",
        "px-3.5 py-3.5",
        "touch-action-manipulation",
        "hover:bg-accent/5 hover:border-border/80",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        className
      )}
    >
      <div className="flex items-start gap-3.5">
        <div
          className={cn(
            "shrink-0",
            "size-12 rounded-lg",
            "bg-muted/30 border border-border/40",
            "flex items-center justify-center shadow-xs",
            tone?.shell,
            iconWrapClassName
          )}
          aria-hidden="true"
        >
          <Icon className={cn("size-6.5 text-link group-hover:text-brand transition-colors", tone?.icon, iconClassName)} weight="fill" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="text-sm sm:text-[15px] font-semibold text-foreground tracking-tight leading-snug line-clamp-2 group-hover:text-brand transition-colors">
                {title}
              </div>
              {meta ? <div className="mt-0.5 text-2xs text-muted-foreground">{meta}</div> : null}
            </div>

            {badge ? (
              <span
                className={cn(
                  "shrink-0",
                  "text-[10px] font-bold uppercase tracking-wider",
                  "px-2 py-0.5 rounded-md",
                  "bg-muted/30 border border-border/40",
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
