"use client"

import { Button } from "@/components/ui/button"
import { UserAvatar } from "@/components/shared/user-avatar"
import { ArrowLeft, Export, Gear, UserPlus, ChatCircle } from "@phosphor-icons/react"
import { cn } from "@/lib/utils"
import { useTranslations } from "next-intl"
import { Link } from "@/i18n/routing"
import type { ProfileHeaderProps } from "../types"

/**
 * Mobile Profile Header - Premium E-commerce Design
 * 
 * A clean, contextual header for user profile pages.
 * Features back navigation, user info, and context-aware actions.
 * 
 * Layout: [Back] [Avatar • DisplayName] [Share] [Settings/Follow]
 * 
 * Design principles:
 * - Glass background with premium blur (matches product header)
 * - Context-aware actions based on profile ownership
 * - Native share API integration
 * - Semantic structure for accessibility
 */
export function MobileProfileHeader({
  displayName,
  username,
  avatarUrl,
  isOwnProfile,
  isFollowing,
  sellerId,
  onBack,
}: ProfileHeaderProps) {
  const tProfile = useTranslations("ProfilePage")
  const tNav = useTranslations("Navigation")

  // Display info
  const name = displayName || username || "Profile"
  const profileUrl = typeof window !== "undefined" ? window.location.href : ""

  // Native share with fallback
  const handleShare = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: name,
          url: profileUrl,
        })
      } catch {
        // User cancelled or share failed - silently ignore
      }
    } else if (typeof navigator !== "undefined" && navigator.clipboard) {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(profileUrl)
    }
  }

  return (
    <header
      className={cn(
        "md:hidden",
        "sticky top-0 z-50",
        // Premium glass effect (matches product header)
        "bg-background/80",
        "backdrop-blur-xl backdrop-saturate-150",
        // Subtle shadow instead of harsh border
        "shadow-sm",
        // Safe area for notch devices
        "pt-safe"
      )}
    >
      <div className="h-14 flex items-center px-1">
        {/* Back Button - Large touch target */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={cn(
            "size-touch rounded-full shrink-0",
            "text-foreground",
            "hover:bg-muted",
            "active:scale-95 active:bg-muted",
            "transition-all duration-150"
          )}
          aria-label={tNav("back")}
          onClick={onBack}
        >
          <ArrowLeft className="size-icon-sm" weight="bold" />
        </Button>

        {/* Center Content: Avatar + Name */}
        <div className="flex-1 flex items-center gap-2.5 min-w-0 pl-0.5 pr-1">
          {/* User Avatar */}
          <div
            className={cn(
              "shrink-0 rounded-full",
              "ring-2 ring-background",
              "shadow-sm"
            )}
          >
            <UserAvatar
              name={name}
              avatarUrl={avatarUrl ?? null}
              size="sm"
              className="size-8"
              fallbackClassName="text-xs font-semibold bg-muted text-muted-foreground"
            />
          </div>

          {/* Display Name */}
          <h1
            className={cn(
              "text-sm font-semibold leading-tight",
              "text-foreground",
              "truncate"
            )}
          >
            {name}
          </h1>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center shrink-0">
          {/* Share Button */}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className={cn(
              "size-touch-sm rounded-full",
              "text-foreground",
              "hover:bg-muted",
              "active:scale-95 transition-all duration-150"
            )}
            aria-label={tProfile("share")}
            onClick={handleShare}
          >
            <Export className="size-icon-sm" weight="bold" />
          </Button>

          {/* Context-aware action: Account for own profile, Follow for others */}
          {isOwnProfile ? (
            <Link href="/account">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className={cn(
                  "size-touch-sm rounded-full",
                  "text-foreground",
                  "hover:bg-muted",
                  "active:scale-95 transition-all duration-150"
                )}
                aria-label={tProfile("settings")}
              >
                <Gear className="size-icon-sm" weight="bold" />
              </Button>
            </Link>
          ) : (
            <>
              {/* Message Button */}
              {sellerId && (
                <Link href={`/chat?to=${sellerId}`}>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className={cn(
                      "size-touch-sm rounded-full",
                      "text-foreground",
                      "hover:bg-muted",
                      "active:scale-95 transition-all duration-150"
                    )}
                    aria-label={tProfile("message")}
                  >
                    <ChatCircle className="size-icon-sm" weight="bold" />
                  </Button>
                </Link>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  )
}
