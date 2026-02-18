import Image from "next/image"
import { ChevronRight as IconChevronRight } from "lucide-react"
import type { ReactNode } from "react"

import { Link } from "@/i18n/routing"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

interface ActivitySectionHeaderProps {
  title: string
  href?: string | undefined
  actionLabel?: string | undefined
  className?: string | undefined
  titleClassName?: string | undefined
  actionClassName?: string | undefined
}

interface ActivityThumbnailProps {
  src?: string | null | undefined
  alt: string
  fallback: ReactNode
  overlay?: ReactNode | undefined
  className?: string | undefined
  imageClassName?: string | undefined
  sizes?: string | undefined
}

interface ActivityRowProps {
  media: ReactNode
  content: ReactNode
  trailing?: ReactNode | undefined
  className?: string | undefined
  contentClassName?: string | undefined
}

interface ActivityCardShellProps {
  title: ReactNode
  description?: ReactNode | undefined
  children: ReactNode
  className?: string | undefined
  headerClassName?: string | undefined
  titleClassName?: string | undefined
  descriptionClassName?: string | undefined
  contentClassName?: string | undefined
}

interface ActivityScrollListProps {
  children: ReactNode
  className?: string | undefined
  listClassName?: string | undefined
}

interface ActivityEmptyStateProps {
  children: ReactNode
  className?: string | undefined
}

interface ActivityListShellProps {
  children: ReactNode
  className?: string | undefined
  listClassName?: string | undefined
}

export function ActivitySectionHeader({
  title,
  href,
  actionLabel,
  className,
  titleClassName,
  actionClassName,
}: ActivitySectionHeaderProps) {
  return (
    <div className={cn("mb-3 flex items-center justify-between px-1", className)}>
      <span className={cn("text-base font-semibold text-foreground", titleClassName)}>{title}</span>
      {href && actionLabel ? (
        <Link
          href={href}
          className={cn(
            "flex items-center gap-0.5 text-xs font-medium text-link transition-colors hover:text-link-hover",
            actionClassName
          )}
        >
          {actionLabel}
          <IconChevronRight className="size-3.5" />
        </Link>
      ) : null}
    </div>
  )
}

export function ActivityThumbnail({
  src,
  alt,
  fallback,
  overlay,
  className,
  imageClassName,
  sizes,
}: ActivityThumbnailProps) {
  return (
    <div className={cn("relative overflow-hidden", className)}>
      {src ? (
        <Image src={src} alt={alt} fill className={cn("object-cover", imageClassName)} sizes={sizes} />
      ) : (
        fallback
      )}
      {overlay}
    </div>
  )
}

export function ActivityRow({ media, content, trailing, className, contentClassName }: ActivityRowProps) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      {media}
      <div className={cn("min-w-0 flex-1", contentClassName)}>{content}</div>
      {trailing}
    </div>
  )
}

export function ActivityCardShell({
  title,
  description,
  children,
  className,
  headerClassName,
  titleClassName,
  descriptionClassName,
  contentClassName,
}: ActivityCardShellProps) {
  return (
    <Card className={className}>
      <CardHeader className={headerClassName}>
        <CardTitle className={cn("text-base", titleClassName)}>{title}</CardTitle>
        {description ? <CardDescription className={descriptionClassName}>{description}</CardDescription> : null}
      </CardHeader>
      <CardContent className={cn("p-0", contentClassName)}>{children}</CardContent>
    </Card>
  )
}

export function ActivityScrollList({ children, className, listClassName }: ActivityScrollListProps) {
  return (
    <ScrollArea className={cn("h-(--spacing-scroll-md)", className)}>
      <div className={cn("divide-y", listClassName)}>{children}</div>
    </ScrollArea>
  )
}

export function ActivityEmptyState({ children, className }: ActivityEmptyStateProps) {
  return <p className={cn("p-4 text-sm text-muted-foreground", className)}>{children}</p>
}

export function ActivityListShell({ children, className, listClassName }: ActivityListShellProps) {
  return (
    <div className={cn("rounded-md bg-card border border-border overflow-hidden", className)}>
      <div className={cn("divide-y divide-border/50", listClassName)}>{children}</div>
    </div>
  )
}
