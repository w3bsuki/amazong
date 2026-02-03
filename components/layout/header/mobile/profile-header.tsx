"use client"

import { Button } from "@/components/ui/button"
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
        "md:hidden",
        "sticky top-0 z-50",
        "bg-surface-elevated",
        "border-b border-border",
        // Safe area for notch devices
        "pt-safe"
      )}
    >
      <div className="h-14 flex items-center px-2">
        {/* Back Button */}
        {onBack ? (
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
        ) : null}

        {/* Title */}
        <h1 className={cn("flex-1 min-w-0 px-2 text-sm font-semibold text-foreground truncate")}>
          {title}
        </h1>

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
