"use client"

import * as React from "react"
import { Link } from "@/i18n/routing"
import { cn } from "@/lib/utils"
import {
  MOBILE_ACTION_CHIP_CLASS,
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
  variant?: "chip" | "pill"
}

export interface SmartRailProps {
  ariaLabel: string
  pills: SmartRailPill[]
  leadingAction?: SmartRailAction | undefined
  trailingAction?: SmartRailAction | undefined
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
    return getMobileQuickPillClass(Boolean(action.active), "min-h-(--control-compact)")
  }

  return cn(
    MOBILE_ACTION_CHIP_CLASS,
    action.active && "border-foreground",
  )
}

export function SmartRail({
  ariaLabel,
  pills,
  leadingAction,
  trailingAction,
  sticky = true,
  stickyTop = "var(--offset-mobile-primary-rail)",
  className,
  testId,
}: SmartRailProps) {
  if (pills.length === 0 && !leadingAction && !trailingAction) return null

  return (
    <nav
      aria-label={ariaLabel}
      className={cn(
        "bg-background border-b border-border-subtle py-2",
        sticky && "sticky z-30",
        className,
      )}
      style={sticky ? { top: stickyTop } : undefined}
      {...(testId ? { "data-testid": testId } : {})}
    >
      <div className="overflow-x-auto no-scrollbar">
        <div className="flex w-max min-w-full items-center gap-2 px-inset">
          {leadingAction && (
            <>
              {leadingAction.href ? (
                <Link
                  href={leadingAction.href}
                  onClick={(event) => {
                    if (!leadingAction.onSelect) return
                    if (!shouldInterceptLinkClick(event)) return
                    event.preventDefault()
                    leadingAction.onSelect()
                  }}
                  className={getActionClass(leadingAction)}
                  aria-current={leadingAction.active ? "page" : undefined}
                  aria-label={leadingAction.ariaLabel ?? leadingAction.label}
                  {...(leadingAction.testId ? { "data-testid": leadingAction.testId } : {})}
                >
                  {leadingAction.icon}
                  <span className="whitespace-nowrap">{leadingAction.label}</span>
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={leadingAction.onSelect}
                  className={getActionClass(leadingAction)}
                  aria-pressed={leadingAction.active}
                  aria-label={leadingAction.ariaLabel ?? leadingAction.label}
                  {...(leadingAction.testId ? { "data-testid": leadingAction.testId } : {})}
                >
                  {leadingAction.icon}
                  <span className="whitespace-nowrap">{leadingAction.label}</span>
                </button>
              )}
            </>
          )}

          {pills.map((pill) => {
            const pillClass = getMobileQuickPillClass(Boolean(pill.active), "min-h-(--control-compact)")

            if (pill.href) {
              return (
                <Link
                  key={pill.id}
                  href={pill.href}
                  title={pill.title ?? pill.label}
                  aria-current={pill.active ? "page" : undefined}
                  aria-label={pill.label}
                  onClick={(event) => {
                    if (!pill.onSelect) return
                    if (!shouldInterceptLinkClick(event)) return
                    event.preventDefault()
                    pill.onSelect()
                  }}
                  className={pillClass}
                  {...(pill.testId ? { "data-testid": pill.testId } : {})}
                >
                  <span className="whitespace-nowrap">{pill.label}</span>
                </Link>
              )
            }

            return (
              <button
                key={pill.id}
                type="button"
                onClick={pill.onSelect}
                className={pillClass}
                aria-pressed={pill.active}
                aria-label={pill.label}
                {...(pill.testId ? { "data-testid": pill.testId } : {})}
              >
                <span className="whitespace-nowrap">{pill.label}</span>
              </button>
            )
          })}

          {trailingAction && (
            <>
              {trailingAction.href ? (
                <Link
                  href={trailingAction.href}
                  onClick={(event) => {
                    if (!trailingAction.onSelect) return
                    if (!shouldInterceptLinkClick(event)) return
                    event.preventDefault()
                    trailingAction.onSelect()
                  }}
                  className={getActionClass(trailingAction)}
                  aria-current={trailingAction.active ? "page" : undefined}
                  aria-label={trailingAction.ariaLabel ?? trailingAction.label}
                  {...(trailingAction.testId ? { "data-testid": trailingAction.testId } : {})}
                >
                  {trailingAction.icon}
                  <span className="whitespace-nowrap">{trailingAction.label}</span>
                  {typeof trailingAction.badgeCount === "number" && trailingAction.badgeCount > 0 && (
                    <span
                      className="inline-flex min-w-5 items-center justify-center rounded-full bg-foreground px-1.5 py-0.5 text-2xs font-semibold text-background"
                      aria-label={String(trailingAction.badgeCount)}
                    >
                      {trailingAction.badgeCount}
                    </span>
                  )}
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={trailingAction.onSelect}
                  className={getActionClass(trailingAction)}
                  aria-pressed={trailingAction.active}
                  aria-label={trailingAction.ariaLabel ?? trailingAction.label}
                  {...(trailingAction.testId ? { "data-testid": trailingAction.testId } : {})}
                >
                  {trailingAction.icon}
                  <span className="whitespace-nowrap">{trailingAction.label}</span>
                  {typeof trailingAction.badgeCount === "number" && trailingAction.badgeCount > 0 && (
                    <span
                      className="inline-flex min-w-5 items-center justify-center rounded-full bg-foreground px-1.5 py-0.5 text-2xs font-semibold text-background"
                      aria-label={String(trailingAction.badgeCount)}
                    >
                      {trailingAction.badgeCount}
                    </span>
                  )}
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
