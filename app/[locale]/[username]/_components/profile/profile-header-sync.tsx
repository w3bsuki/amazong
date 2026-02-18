"use client"

import { useEffect } from "react"
import { useHeader } from "@/components/providers/header-context"

/**
 * ProfileHeaderSync - Syncs profile data to header context
 * 
 * Similar to ProductHeaderSync, this component pushes profile-specific
 * data to the HeaderProvider so the layout-owned header can display
 * dynamic profile information.
 * 
 * Usage:
 * ```tsx
 * <ProfileHeaderSync
 *   displayName={profile.display_name}
 *   username={profile.username}
 *   avatarUrl={profile.avatar_url}
 *   isOwnProfile={isOwnProfile}
 *   isFollowing={isFollowing}
 *   sellerId={profile.id}
 * />
 * ```
 */
export interface ProfileHeaderSyncProps {
  displayName: string | null
  username: string | null
  avatarUrl: string | null
  isOwnProfile: boolean
  isFollowing: boolean
  sellerId: string | null
}

export function ProfileHeaderSync({
  displayName,
  username,
  avatarUrl,
  isOwnProfile,
  isFollowing,
  sellerId,
}: ProfileHeaderSyncProps) {
  const { setHeaderState } = useHeader()

  useEffect(() => {
    setHeaderState({
      type: "profile",
      value: {
        displayName,
        username,
        avatarUrl,
        isOwnProfile,
        isFollowing,
        sellerId,
      },
    })

    return () => {
      setHeaderState(null)
    }
  }, [displayName, username, avatarUrl, isOwnProfile, isFollowing, sellerId, setHeaderState])

  // This component renders nothing - it just syncs data
  return null
}
