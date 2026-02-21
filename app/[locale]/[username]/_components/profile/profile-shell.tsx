import type { ReactNode } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { UserAvatar } from "@/components/shared/user-avatar"
import { VisualDrawerSurface } from "@/components/shared/visual-drawer-surface"
import { CircleCheck as CheckCircle } from "lucide-react"


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
  /** Toggle/controls shown between hero and tabs */
  heroTabToggle?: ReactNode
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
  heroTabToggle,
  className,
}: ProfileShellProps) {
  const hasBanner = Boolean(bannerUrl)

  return (
    <div className={cn("bg-background", className)}>
      {hasBanner ? (
        <div className="relative h-24 sm:h-36 bg-muted">
          <Image src={bannerUrl as string} alt="" fill className="object-cover" priority />
        </div>
      ) : null}

      <VisualDrawerSurface showHandle={!hasBanner}>
        <div className="px-4 pb-5 pt-4 space-y-4">
          <div className={cn("flex items-start gap-3", hasBanner ? "-mt-6" : "")}>
            <div className="relative shrink-0">
              <UserAvatar
                name={displayName}
                avatarUrl={avatarUrl}
                size="xl"
                className={cn(
                  "size-16 border-2 border-background",
                  hasBanner ? "bg-background" : "bg-muted"
                )}
                fallbackClassName="text-sm font-semibold bg-muted text-foreground"
              />
              {isVerifiedBusiness ? (
                <div className="absolute -bottom-0.5 -right-0.5 bg-primary rounded-full p-0.5 border-2 border-background">
                  <CheckCircle className="size-3.5 text-primary-foreground" />
                </div>
              ) : null}
            </div>

            <div className="min-w-0 flex-1 pt-0.5">
              <h1 className="truncate text-xl font-semibold tracking-tight leading-tight">{displayName}</h1>
              {username ? <p className="text-sm text-muted-foreground truncate">@{username}</p> : null}
            </div>
          </div>

          {headerContent && <div>{headerContent}</div>}

          {stats && <div>{stats}</div>}

          {actions && <div className="flex gap-3">{actions}</div>}

          {heroTabToggle && <div>{heroTabToggle}</div>}
        </div>

        {tabs && (
          <div className="border-t border-border px-4 pt-3 pb-3">
            {tabs}
          </div>
        )}

        {children}
      </VisualDrawerSurface>
    </div>
  )
}

