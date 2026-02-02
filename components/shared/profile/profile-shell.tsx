"use client"

import type { ReactNode } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { UserAvatar } from "@/components/shared/user-avatar"
import { CheckCircle } from "@phosphor-icons/react"

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
  return (
    <div className={cn("min-h-dvh bg-background", className)}>
      {/* Banner */}
      <div className="relative h-24 sm:h-36 bg-muted">
        {bannerUrl && (
          <Image
            src={bannerUrl}
            alt=""
            fill
            className="object-cover"
            priority
          />
        )}
      </div>

      {/* Profile Header */}
      <div className="px-4 relative">
        {/* Avatar - overlapping banner */}
        <div className="relative -mt-12 sm:-mt-14 mb-3">
          <UserAvatar
            name={displayName}
            avatarUrl={avatarUrl}
            size="lg"
            className="size-20 sm:size-24 border-4 border-background shadow-sm"
            fallbackClassName="text-xl bg-primary text-primary-foreground"
          />
          {isVerifiedBusiness && (
            <div className="absolute bottom-0 right-0 bg-primary rounded-full p-0.5 border-2 border-background">
              <CheckCircle className="size-3.5 text-primary-foreground" weight="fill" />
            </div>
          )}
        </div>

        {/* Name and username */}
        <div className="mb-2">
          <h1 className="text-lg sm:text-xl font-bold leading-tight">{displayName}</h1>
          {username && (
            <p className="text-sm text-muted-foreground">@{username}</p>
          )}
        </div>

        {/* Additional header content (bio, badges, etc.) */}
        {headerContent && (
          <div className="mb-3">
            {headerContent}
          </div>
        )}

        {/* Stats row - horizontal on mobile */}
        {stats && (
          <div className="mb-3">
            {stats}
          </div>
        )}

        {/* Action buttons */}
        {actions && (
          <div className="flex gap-2 mb-4">
            {actions}
          </div>
        )}
      </div>

      {/* Sticky tabs */}
      {tabs && (
        <div className="sticky top-0 z-40 bg-background py-2">
          {tabs}
        </div>
      )}

      {/* Tab content */}
      {children}
    </div>
  )
}
