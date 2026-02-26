"use client"

import * as React from "react"
import { Link } from "@/i18n/routing"
import { cn } from "@/lib/utils"
import {
  MOBILE_ACTION_CHIP_CLASS,
  MOBILE_ACTION_ICON_CLASS,
  getMobileQuickPillClass,
} from "@/components/mobile/chrome/mobile-control-recipes"

export interface SmartRailPill {
  id: string
  label: string
  active?: boolean
  href?: string
  onSelect?: (() => void) | undefined
  title?: string
  testId?: string
}

export interface SmartRailAction {
  label: string
  icon?: React.ReactNode
  active?: boolean
  badgeCount?: number
  href?: string
  onSelect?: (() => void) | undefined
  ariaLabel?: string
  testId?: string
  variant?: "chip" | "pill" | "icon"
}

export interface SmartRailProps {
  ariaLabel: string
  pills: SmartRailPill[]
  leadingAction?: SmartRailAction | undefined
  trailingAction?: SmartRailAction | undefined
  filterAction?: SmartRailAction | undefined
  sticky?: boolean
  stickyTop?: string | number
  className?: string
  testId?: string
}

function shouldInterceptLinkClick(event: React.MouseEvent<HTMLAnchorElement>): boolean {
  if (event.defaultPrevented) return false
  if (event.button !== 0) return false
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return false
  return true
}

function getActionClass(action: SmartRailAction): string {
  const variant = action.variant ?? "chip"

  if (variant === "pill") {
    return getMobileQuickPillClass(Boolean(action.active))
  }

  if (variant === "icon") {
    return cn(
      MOBILE_ACTION_ICON_CLASS,
      "relative border",
      action.active ? "border-foreground" : "border-border",
    )
  }

  return cn(
    MOBILE_ACTION_CHIP_CLASS,
    action.active && "border-foreground",
  )
}

type SmartRailPressableProps = {
  href?: string
  onSelect?: (() => void) | undefined
  className: string
  active?: boolean
  ariaLabel: string
  title?: string
  testId?: string
  children: React.ReactNode
}

function SmartRailPressable({
  href,
  onSelect,
  className,
  active,
  ariaLabel,
  title,
  testId,
  children,
}: SmartRailPressableProps) {
  const testProps = testId ? { "data-testid": testId } : {}

  if (href) {
    return (
      <Link
        href={href}
        title={title}
        aria-current={active ? "page" : undefined}
        aria-label={ariaLabel}
        onClick={(event) => {
          if (!onSelect) return
          if (!shouldInterceptLinkClick(event)) return
          event.preventDefault()
          onSelect()
        }}
        className={className}
        {...testProps}
      >
        {children}
      </Link>
    )
  }

  return (
    <button
      type="button"
      onClick={onSelect}
      className={className}
      aria-pressed={active}
      aria-label={ariaLabel}
      title={title}
      {...testProps}
    >
      {children}
    </button>
  )
}

type SmartRailActionContentProps = {
  icon?: React.ReactNode
  label: string
  badgeCount?: number | undefined
  variant?: "chip" | "pill" | "icon" | undefined
}

function SmartRailActionContent({ icon, label, badgeCount, variant }: SmartRailActionContentProps) {
  return (
    <>
      {icon}
      <span className={cn("whitespace-nowrap", variant === "icon" && "sr-only")}>{label}</span>
      {typeof badgeCount === "number" && badgeCount > 0 && (
        <span
          className={cn(
            "inline-flex items-center justify-center rounded-full bg-foreground font-semibold text-background",
            variant === "icon" ? "absolute -top-1 -right-1 size-4 text-2xs" : "min-w-5 px-1.5 py-0.5 text-2xs"
          )}
          aria-label={String(badgeCount)}
        >
          {badgeCount}
        </span>
      )}
    </>
  )
}

export function SmartRail({
  ariaLabel,
  pills,
  leadingAction,
  trailingAction,
  filterAction,
  sticky = true,
  stickyTop = "var(--offset-mobile-primary-rail)",
  className,
  testId,
}: SmartRailProps) {
  if (pills.length === 0 && !leadingAction && !trailingAction && !filterAction) return null

  return (
    <nav
      aria-label={ariaLabel}
      className={cn(
        "bg-background border-b border-border py-2",
        sticky && "sticky z-30",
        className,
      )}
      style={sticky ? { top: stickyTop } : undefined}
      {...(testId ? { "data-testid": testId } : {})}
    >
      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex w-max min-w-full items-center gap-2 px-4">
          {filterAction && (
            <>
              <SmartRailPressable
                {...(filterAction.href ? { href: filterAction.href } : {})}
                onSelect={filterAction.onSelect}
                className={cn(
                  getActionClass(filterAction), 
                  "border bg-background hover:bg-secondary relative",
                  !filterAction.active && "border-border"
                )}
                active={Boolean(filterAction.active)}
                ariaLabel={filterAction.ariaLabel ?? filterAction.label}
                {...(filterAction.testId ? { testId: filterAction.testId } : {})}
              >
                <SmartRailActionContent
                  icon={filterAction.icon}
                  label={filterAction.label}
                  badgeCount={filterAction.badgeCount}
                  variant={filterAction.variant}
                />
              </SmartRailPressable>
              <div className="w-px h-5 bg-border shrink-0 mx-0.5" />
            </>
          )}

          {leadingAction && (
            <>
              <SmartRailPressable
                {...(leadingAction.href ? { href: leadingAction.href } : {})}
                onSelect={leadingAction.onSelect}
                className={getActionClass(leadingAction)}
                active={Boolean(leadingAction.active)}
                ariaLabel={leadingAction.ariaLabel ?? leadingAction.label}
                {...(leadingAction.testId ? { testId: leadingAction.testId } : {})}
              >
                <SmartRailActionContent
                  icon={leadingAction.icon}
                  label={leadingAction.label}
                  badgeCount={leadingAction.badgeCount}
                  variant={leadingAction.variant}
                />
              </SmartRailPressable>
            </>
          )}

          {pills.map((pill) => {
            const pillClass = getMobileQuickPillClass(Boolean(pill.active))

            return (
              <SmartRailPressable
                key={pill.id}
                {...(pill.href ? { href: pill.href } : {})}
                onSelect={pill.onSelect}
                className={pillClass}
                active={Boolean(pill.active)}
                ariaLabel={pill.label}
                title={pill.title ?? pill.label}
                {...(pill.testId ? { testId: pill.testId } : {})}
              >
                <span className="whitespace-nowrap">{pill.label}</span>
              </SmartRailPressable>
            )
          })}

          {trailingAction && (
            <>
              <SmartRailPressable
                {...(trailingAction.href ? { href: trailingAction.href } : {})}
                onSelect={trailingAction.onSelect}
                className={getActionClass(trailingAction)}
                active={Boolean(trailingAction.active)}
                ariaLabel={trailingAction.ariaLabel ?? trailingAction.label}
                {...(trailingAction.testId ? { testId: trailingAction.testId } : {})}
              >
                <SmartRailActionContent
                  icon={trailingAction.icon}
                  label={trailingAction.label}
                  badgeCount={trailingAction.badgeCount}
                  variant={trailingAction.variant}
                />
              </SmartRailPressable>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
