"use client"

import { useOptimistic, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Heart, SpinnerGap, UserPlus } from "@phosphor-icons/react"
import { followSeller, unfollowSeller } from "@/app/actions/seller-follows"
import { toast } from "sonner"

interface FollowSellerButtonProps {
  sellerId: string
  initialIsFollowing: boolean
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
    // Instant UI feedback via useOptimistic
    setOptimisticFollowing(newState)
    onFollowChange?.(newState)

    startTransition(async () => {
      const result = newState 
        ? await followSeller(sellerId)
        : await unfollowSeller(sellerId)

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
