"use client"

import { useOptimistic, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Heart, SpinnerGap, UserPlus } from "@phosphor-icons/react"
import { toast } from "sonner"

/**
 * Action result type for follow/unfollow operations
 */
export type FollowActionResult = { success: boolean; error?: string }

/**
 * Handler types for follow/unfollow actions - passed from app/ layer
 */
export interface FollowSellerActions {
  followSeller: (sellerId: string) => Promise<FollowActionResult>
  unfollowSeller: (sellerId: string) => Promise<FollowActionResult>
}

interface FollowSellerButtonProps {
  sellerId: string
  initialIsFollowing: boolean
  /** Action handlers - required, passed from app/ layer */
  actions: FollowSellerActions
  locale?: string
  showLabel?: boolean
  onFollowChange?: (isFollowing: boolean) => void
  variant?: "default" | "outline" | "secondary" | "ghost" | "destructive" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
}

/**
 * Follow/Unfollow button for seller profiles and product pages
 * Uses React 19 useOptimistic for instant feedback
 */
export function FollowSellerButton({
  sellerId,
  initialIsFollowing,
  actions,
  locale = "en",
  showLabel = true,
  onFollowChange,
  variant = "outline",
  size = "sm",
  className,
}: FollowSellerButtonProps) {
  const [isPending, startTransition] = useTransition()
  // React 19: useOptimistic for instant UI feedback before server responds
  const [optimisticFollowing, setOptimisticFollowing] = useOptimistic(initialIsFollowing)

  const t = {
    follow: locale === "bg" ? "Следвай" : "Follow",
    unfollow: locale === "bg" ? "Отследвай" : "Unfollow", 
    following: locale === "bg" ? "Следваш" : "Following",
    followSuccess: locale === "bg" ? "Започнахте да следвате магазина" : "Now following this store",
    unfollowSuccess: locale === "bg" ? "Спряхте да следвате магазина" : "Unfollowed store",
    error: locale === "bg" ? "Грешка" : "Error",
    loginRequired: locale === "bg" ? "Влезте в акаунта си, за да следвате" : "Sign in to follow stores",
  }

  const handleClick = async () => {
    const newState = !optimisticFollowing
    startTransition(async () => {
      // Instant UI feedback via useOptimistic (inside transition)
      setOptimisticFollowing(newState)
      onFollowChange?.(newState)

      const result = newState 
        ? await actions.followSeller(sellerId)
        : await actions.unfollowSeller(sellerId)

      if (result.success) {
        toast.success(newState ? t.followSuccess : t.unfollowSuccess)
      } else {
        // On error, useOptimistic automatically rolls back when transition ends
        // But we need to notify parent
        onFollowChange?.(!newState)
        
        if (result.error === "Not authenticated") {
          toast.error(t.loginRequired)
        } else {
          toast.error(result.error || t.error)
        }
      }
    })
  }

  return (
    <Button
      variant={optimisticFollowing ? "secondary" : variant}
      size={size}
      className={className}
      onClick={handleClick}
      disabled={isPending}
    >
      {isPending ? (
        <SpinnerGap className="size-4 animate-spin" />
      ) : optimisticFollowing ? (
        <Heart className="size-4" weight="fill" />
      ) : (
        <UserPlus className="size-4" />
      )}
      {showLabel && (
        <span className="ml-1.5">
          {optimisticFollowing ? t.following : t.follow}
        </span>
      )}
    </Button>
  )
}
