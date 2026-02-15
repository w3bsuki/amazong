"use client"

import type { ReactNode } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { UserAvatar } from "@/components/shared/user-avatar"
import { CheckCircle } from "@/lib/icons/phosphor"

interface ProfileShellProps {
  /** Display name for the profile */
  displayName: string
  /** Username (without @) */
  username: string | null
  /** Avatar URL */
  avatarUrl: string | null
  /** Banner URL */
  bannerUrl?: string | null
  /** Whether this is a verified business */
  isVerifiedBusiness?: boolean
  /** Stats to display in the horizontal row */
  stats?: ReactNode
  /** Action buttons (Edit Profile, Follow, etc.) */
  actions?: ReactNode
  /** Content below the header (bio, badges, etc.) */
  headerContent?: ReactNode
  /** Tab navigation */
  tabs?: ReactNode
  /** Main content (tab panels) */
  children?: ReactNode
  /** Additional class names */
  className?: string
}

/**
 * ProfileShell - Mobile-first profile layout pattern
 * 
 * Implements clean profile design with:
 * - Banner image with overlapping avatar
 * - Horizontal stats row
 * - Prominent action buttons
 * - Sticky tab navigation
 */
export function ProfileShell({
  displayName,
  username,
  avatarUrl,
  bannerUrl,
  isVerifiedBusiness,
  stats,
  actions,
  headerContent,
  tabs,
  children,
  className,
}: ProfileShellProps) {
  const hasBanner = Boolean(bannerUrl)

  return (
    <div className={cn("bg-background", className)}>
      {/* Banner (optional) */}
      {hasBanner ? (
        <div className="relative h-24 sm:h-36 bg-muted">
          <Image src={bannerUrl as string} alt="" fill className="object-cover" priority />
        </div>
      ) : null}

      {/* Profile Header */}
      <div className={cn("px-4", hasBanner ? "relative" : "pt-4")}>
        {/* Identity row */}
        <div className={cn("flex items-start gap-3", hasBanner ? "-mt-10 sm:-mt-12" : "")}>
          <div className="relative shrink-0">
            <UserAvatar
              name={displayName}
              avatarUrl={avatarUrl}
              size="xl"
              className={cn(
                "border-2 border-background shadow-sm",
                hasBanner ? "bg-background" : "bg-muted"
              )}
              fallbackClassName="text-sm font-semibold bg-muted text-foreground"
            />
            {isVerifiedBusiness ? (
              <div className="absolute -bottom-0.5 -right-0.5 bg-primary rounded-full p-0.5 border-2 border-background">
                <CheckCircle className="size-3.5 text-primary-foreground" weight="fill" />
              </div>
            ) : null}
          </div>

          <div className="min-w-0 flex-1 pt-0.5">
            <h1 className="truncate text-xl font-semibold tracking-tight leading-tight">{displayName}</h1>
            {username ? <p className="text-sm text-muted-foreground truncate">@{username}</p> : null}
          </div>
        </div>

        {/* Additional header content (bio, badges, etc.) */}
        {headerContent && (
          <div className="mt-3">{headerContent}</div>
        )}

        {/* Stats row - horizontal on mobile */}
        {stats && (
          <div className="mt-3">{stats}</div>
        )}

        {/* Action buttons */}
        {actions && (
          <div className="mt-4 flex flex-col gap-2 sm:flex-row">{actions}</div>
        )}
      </div>

      {/* Tabs */}
      {tabs && (
        <div className="mt-4 bg-background border-t border-border py-3">{tabs}</div>
      )}

      {/* Tab content */}
      {children}
    </div>
  )
}
