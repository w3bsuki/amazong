"use client"

import { IconButton } from "@/components/ui/icon-button"
import { ArrowLeft, Export, Gear, ChatCircle } from "@phosphor-icons/react"
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
  isOwnProfile,
  isFollowing,
  sellerId,
  onBack,
}: ProfileHeaderProps) {
  const tProfile = useTranslations("ProfilePage")
  const tNav = useTranslations("Navigation")

  const title = displayName || username || tProfile("profile")
  const profileUrl = typeof window !== "undefined" ? window.location.href : ""

  // Native share with fallback
  const handleShare = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title,
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
        "sticky top-0 z-50 border-b border-border-subtle bg-background pt-safe md:hidden"
      )}
    >
      <div className="flex h-(--control-primary) items-center px-2">
        {/* Back Button */}
        {onBack ? (
          <IconButton
            type="button"
            variant="ghost"
            className={cn(
              "shrink-0 text-foreground hover:bg-hover active:bg-active"
            )}
            aria-label={tNav("back")}
            onClick={onBack}
          >
            <ArrowLeft className="size-icon-sm" weight="bold" />
          </IconButton>
        ) : null}

        {/* Title */}
        <h1 className={cn("flex-1 min-w-0 px-2 text-sm font-semibold text-foreground truncate")}>
          {title}
        </h1>

        {/* Action Buttons */}
        <div className="flex items-center shrink-0">
          {/* Share Button */}
          <IconButton
            type="button"
            variant="ghost"
            className={cn(
              "text-foreground hover:bg-hover active:bg-active"
            )}
            aria-label={tProfile("share")}
            onClick={handleShare}
          >
            <Export className="size-icon-sm" weight="bold" />
          </IconButton>

          {/* Context-aware action: Account for own profile, Follow for others */}
          {isOwnProfile ? (
            <IconButton
              asChild
              variant="ghost"
              className={cn(
                "text-foreground hover:bg-hover active:bg-active"
              )}
              aria-label={tProfile("settings")}
            >
                <Link href="/account">
                  <Gear className="size-icon-sm" weight="bold" />
                </Link>
            </IconButton>
          ) : (
            <>
              {/* Message Button */}
              {sellerId && (
                <IconButton
                  asChild
                  variant="ghost"
                  className={cn(
                    "text-foreground hover:bg-hover active:bg-active"
                  )}
                  aria-label={tProfile("message")}
                >
                  <Link href={`/chat?to=${sellerId}`}>
                    <ChatCircle className="size-icon-sm" weight="bold" />
                  </Link>
                </IconButton>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  )
}
