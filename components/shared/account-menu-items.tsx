import type { LucideIcon } from "lucide-react"
import { ChevronRight as CaretRight } from "lucide-react"

import { Link } from "@/i18n/routing"
import { cn } from "@/lib/utils"

interface AccountDropdownMenuItem {
  href: string
  label: string
  icon: LucideIcon
  badgeCount?: number
}

interface AccountDropdownMenuProps {
  items: AccountDropdownMenuItem[]
  ariaLabel: string
  className?: string
}

const dropdownLinkClass =
  "flex items-center gap-2.5 px-3 py-2 text-sm text-foreground hover:bg-accent active:bg-active focus-visible:bg-accent focus-visible:outline-none motion-safe:transition-colors motion-safe:duration-fast motion-safe:ease-(--ease-smooth) motion-reduce:transition-none"

export function AccountDropdownMenu({ items, ariaLabel, className }: AccountDropdownMenuProps) {
  return (
    <nav className={cn("py-1", className)} aria-label={ariaLabel}>
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(dropdownLinkClass, typeof item.badgeCount === "number" && item.badgeCount > 0 && "justify-between")}
        >
          <span className="flex items-center gap-2.5">
            <item.icon size={16} className="text-muted-foreground" />
            {item.label}
          </span>
          {typeof item.badgeCount === "number" && item.badgeCount > 0 ? (
            <span className="text-2xs bg-notification text-primary-foreground px-1.5 py-0.5 rounded-full" aria-hidden="true">
              {item.badgeCount}
            </span>
          ) : null}
        </Link>
      ))}
    </nav>
  )
}

type AccountDrawerBadgeTone = "destructive" | "warning" | "muted"

export interface AccountDrawerMenuItem {
  href: string
  label: string
  icon: LucideIcon
  badge?: string | null
  badgeTone?: AccountDrawerBadgeTone
}

interface AccountDrawerQuickLinksProps {
  items: AccountDrawerMenuItem[]
  onItemClick?: () => void
  className?: string
  itemClassName?: string
  dataTestId?: string
}

export function AccountDrawerQuickLinks({
  items,
  onItemClick,
  className,
  itemClassName,
  dataTestId,
}: AccountDrawerQuickLinksProps) {
  return (
    <div className={className} data-testid={dataTestId}>
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          onClick={onItemClick}
          data-testid="account-drawer-quick-link"
          className={cn(
            "flex min-h-(--spacing-touch-md) w-full items-center justify-between gap-3 rounded-xl border border-border-subtle bg-background px-3.5 text-left",
            "tap-transparent motion-safe:transition-colors motion-safe:duration-fast motion-safe:ease-(--ease-smooth)",
            "hover:border-border hover:bg-hover active:bg-active",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring",
            itemClassName
          )}
        >
          <div className="flex min-w-0 items-center gap-3">
            <item.icon size={20} className="shrink-0 text-muted-foreground" />
            <span className="truncate text-sm font-medium text-foreground">{item.label}</span>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {item.badge ? (
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-2xs font-medium",
                  item.badgeTone === "destructive" && "text-destructive bg-destructive-subtle",
                  item.badgeTone === "warning" && "text-primary bg-primary-subtle",
                  item.badgeTone === "muted" && "text-muted-foreground bg-surface-subtle"
                )}
              >
                {item.badge}
              </span>
            ) : null}
            <CaretRight size={16} className="text-muted-foreground" aria-hidden="true" />
          </div>
        </Link>
      ))}
    </div>
  )
}
