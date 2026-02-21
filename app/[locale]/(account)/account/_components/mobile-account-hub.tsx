import type { ComponentType, ReactNode } from "react"
import { ChevronRight as CaretRight, Crown, User } from "lucide-react"

import { Link } from "@/i18n/routing"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { UserAvatar } from "@/components/shared/user-avatar"
import { cn } from "@/lib/utils"
import { MobileAccountSignOutRow } from "./mobile-account-sign-out-row"

type MenuBadgeTone = "destructive" | "warning" | "muted"

type MenuItem = {
  href: string
  icon: ComponentType<{ className?: string }>
  label: string
  badge?: string | null
  badgeTone?: MenuBadgeTone
}

export interface MobileAccountHubProps {
  displayName: string
  username: string | null
  avatarUrl: string | null
  editProfileLabel: string
  signOutLabel: string
  signOutDialogTitle: string
  signOutDialogDescription: string
  signOutCancelLabel: string
  signOutConfirmLabel: string
  planBadgeLabel?: string | null
  planBadgeTone?: "info" | "muted"
  sections: Array<{
    label: string
    items: MenuItem[]
  }>
}

/** Grouped card container — iOS Settings pattern */
const MENU_GROUP_CLASS =
  "overflow-hidden rounded-2xl border border-border-subtle bg-card"

/** Single menu row inside a grouped card */
const MENU_ROW_CLASS = cn(
  "flex min-h-(--spacing-touch-md) w-full items-center gap-3 px-4 text-left",
  "tap-transparent motion-safe:transition-colors motion-safe:duration-fast motion-safe:ease-(--ease-smooth)",
  "hover:bg-hover active:bg-active",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-inset",
)

function MenuIcon({ icon: Icon }: { icon: ComponentType<{ className?: string }> }) {
  return <Icon className="size-5 shrink-0 text-muted-foreground" aria-hidden="true" />
}

function MenuRow({ item, showSeparator }: { item: MenuItem; showSeparator?: boolean }) {
  return (
    <>
      <Link href={item.href} className={MENU_ROW_CLASS}>
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
          <CaretRight className="size-4 text-muted-foreground" aria-hidden="true" />
        </div>
      </Link>
      {showSeparator ? <Separator className="ml-11" /> : null}
    </>
  )
}

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <h2 className="px-1 pb-1.5 text-2xs font-semibold uppercase tracking-wider text-muted-foreground">
      {children}
    </h2>
  )
}

function MenuSection({ label, items }: { label: string; items: MenuItem[] }) {
  return (
    <div>
      <SectionLabel>{label}</SectionLabel>
      <div className={MENU_GROUP_CLASS}>
        {items.map((item, i) => (
          <MenuRow key={item.href} item={item} showSeparator={i < items.length - 1} />
        ))}
      </div>
    </div>
  )
}

export function MobileAccountHub({
  displayName,
  username,
  avatarUrl,
  editProfileLabel,
  signOutLabel,
  signOutDialogTitle,
  signOutDialogDescription,
  signOutCancelLabel,
  signOutConfirmLabel,
  planBadgeLabel,
  planBadgeTone = "muted",
  sections,
}: MobileAccountHubProps) {
  return (
    <div className="space-y-3">
      {/* Profile hero card */}
      <div className={MENU_GROUP_CLASS}>
        <div className="flex items-center gap-3.5 p-4">
          <UserAvatar
            name={displayName}
            avatarUrl={avatarUrl}
            size="xl"
            className="shrink-0 ring-2 ring-border-subtle"
            fallbackClassName="text-lg"
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-base font-semibold text-foreground">{displayName}</p>
            <div className="mt-0.5 flex flex-wrap items-center gap-2">
              {username ? (
                <p className="truncate text-xs text-muted-foreground">@{username}</p>
              ) : null}
              {planBadgeLabel ? (
                <Badge
                  variant={planBadgeTone === "info" ? "info-subtle" : "neutral-subtle"}
                  size="compact"
                  className="shrink-0"
                >
                  {planBadgeTone === "info" ? <Crown className="size-3" aria-hidden="true" /> : null}
                  {planBadgeLabel}
                </Badge>
              ) : null}
            </div>
          </div>
        </div>

        <div className="px-4 pb-4">
          <Button asChild variant="outline" size="lg" className="w-full">
            <Link href="/account/profile">
              <User className="size-4" />
              {editProfileLabel}
            </Link>
          </Button>
        </div>
      </div>

      {/* Menu sections */}
      {sections.map((section) => (
        <MenuSection key={section.label} label={section.label} items={section.items} />
      ))}

      {/* Sign out */}
      <div className={MENU_GROUP_CLASS}>
        <MobileAccountSignOutRow
          label={signOutLabel}
          dialogTitle={signOutDialogTitle}
          dialogDescription={signOutDialogDescription}
          cancelLabel={signOutCancelLabel}
          confirmLabel={signOutConfirmLabel}
          rowClassName={cn(MENU_ROW_CLASS, "text-destructive")}
        />
      </div>
    </div>
  )
}
