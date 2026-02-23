import * as React from "react"
import { ChevronRight as CaretRight } from "lucide-react"
import type { LucideIcon } from "lucide-react"

import { Link } from "@/i18n/routing"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

import { MENU_GROUP_CLASS, MENU_ROW_CLASS } from "./account-drawer.styles"
import type { MenuItem } from "./account-drawer.types"

/** Bare icon — lightweight neutral style, accent only where needed */
function MenuIcon({ icon: Icon }: { icon: LucideIcon }) {
  return <Icon size={20} className="shrink-0 text-muted-foreground" aria-hidden="true" />
}

/** Single menu row inside a grouped card */
function MenuRow({
  item,
  onClick,
  showSeparator,
}: {
  item: MenuItem
  onClick?: (() => void) | undefined
  showSeparator?: boolean | undefined
}) {
  return (
    <>
      <Link
        href={item.href}
        onClick={onClick}
        data-testid="account-drawer-quick-link"
        className={MENU_ROW_CLASS}
      >
        <MenuIcon icon={item.icon} />
        <span className="min-w-0 flex-1 truncate text-sm font-medium text-foreground">
          {item.label}
        </span>
        <div className="flex shrink-0 items-center gap-2">
          {item.badge ? (
            <Badge
              variant={
                item.badgeTone === "destructive"
                  ? "critical-subtle"
                  : item.badgeTone === "warning"
                    ? "warning-subtle"
                    : "neutral-subtle"
              }
              size="compact"
            >
              {item.badge}
            </Badge>
          ) : null}
          <CaretRight size={16} className="text-muted-foreground" aria-hidden="true" />
        </div>
      </Link>
      {showSeparator && <Separator className="ml-11" />}
    </>
  )
}

/** Section label above menu groups */
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="px-1 pb-1.5 text-2xs font-semibold uppercase tracking-wider text-muted-foreground">
      {children}
    </h3>
  )
}

/** Grouped menu section  — label + card with rows separated by inset dividers */
export function MenuSection({
  label,
  items,
  onItemClick,
}: {
  label: string
  items: MenuItem[]
  onItemClick?: () => void
}) {
  return (
    <div>
      <SectionLabel>{label}</SectionLabel>
      <div className={MENU_GROUP_CLASS}>
        {items.map((item, i) => (
          <MenuRow
            key={item.href}
            item={item}
            onClick={onItemClick}
            showSeparator={i < items.length - 1}
          />
        ))}
      </div>
    </div>
  )
}
