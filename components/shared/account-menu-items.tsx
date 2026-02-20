import type { LucideIcon } from "lucide-react"

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
