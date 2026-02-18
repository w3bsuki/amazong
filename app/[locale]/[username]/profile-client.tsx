"use client"

import { useEffect, useState } from "react"
import { useLocale, useTranslations } from "next-intl"
import { useAuth } from "@/components/providers/auth-state-manager"
import { ProfileHeaderSync } from "./_components/profile/profile-header-sync"
import { ProfileShell } from "./_components/profile/profile-shell"
import { ProfileStats } from "./_components/profile/profile-stats"
import { ProfileTabs } from "./_components/profile/profile-tabs"

import {
  buildProfileActions,
  buildProfileHeaderContent,
} from "./profile-client-header"
import { buildProfileTabs } from "./profile-client-tabs"
import type { PublicProfileClientProps } from "./profile-client.types"

export function PublicProfileClient({
  profile,
  products,
  productCount,
  sellerReviews,
  sellerReviewCount,
  buyerReviews,
  buyerReviewCount,
  isOwnProfile,
  isFollowing,
  followActions,
}: PublicProfileClientProps) {
  const locale = useLocale()
  const tProfile = useTranslations("ProfilePage")
  const tSeller = useTranslations("Seller")
  const { signOut } = useAuth()

  // Avoid SSR/hydration mismatch for time-based + Intl-rendered text (React error 419 in prod).
  const [isHydrated, setIsHydrated] = useState(false)
  useEffect(() => {
    setIsHydrated(true)
  }, [])

  const [activeTab, setActiveTab] = useState(profile.is_seller ? "listings" : "reviews")

  const displayName = profile.display_name || profile.username || tProfile("user")
  const memberSince = profile.created_at ? new Date(profile.created_at) : null

  const memberSinceLabel =
    isHydrated && memberSince
      ? tSeller("memberSince", {
          date: new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" }).format(memberSince),
        })
      : null

  const statsItems = profile.is_seller
    ? [
        { value: productCount, label: tProfile("listings") },
        { value: profile.total_sales, label: tProfile("sold") },
        { value: profile.follower_count ?? 0, label: tProfile("followers") },
        { value: profile.total_purchases, label: tProfile("following") },
      ]
    : [
        { value: profile.total_purchases, label: tProfile("purchases") },
        { value: buyerReviewCount, label: tProfile("reviews") },
      ]

  const tabs = buildProfileTabs({
    profile,
    displayName,
    products,
    productCount,
    sellerReviews,
    sellerReviewCount,
    buyerReviews,
    buyerReviewCount,
    isOwnProfile,
    isHydrated,
    locale,
    tProfile,
    signOut,
  })

  const headerContent = buildProfileHeaderContent({
    profile,
    memberSinceLabel,
    sellerReviewCount,
    tProfile,
  })

  const handleShareProfile = async () => {
    const url = typeof window !== "undefined" ? window.location.href : ""
    if (!url) return

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: displayName,
          url,
        })
        return
      } catch {
        // User cancelled or share failed - silently ignore
      }
    }

    if (typeof navigator !== "undefined" && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(url)
      } catch {
        // Best-effort only
      }
    }
  }

  const actions = buildProfileActions({
    profile,
    isOwnProfile,
    isFollowing,
    locale,
    tProfile,
    tSeller,
    followActions,
    onShare: handleShareProfile,
  })

  return (
    <>
      <ProfileHeaderSync
        displayName={profile.display_name}
        username={profile.username}
        avatarUrl={profile.avatar_url}
        isOwnProfile={isOwnProfile}
        isFollowing={isFollowing}
        sellerId={profile.id}
      />
      <ProfileShell
        displayName={displayName}
        username={profile.username}
        avatarUrl={profile.avatar_url}
        bannerUrl={profile.banner_url}
        isVerifiedBusiness={Boolean(profile.is_verified_business)}
        stats={<ProfileStats stats={statsItems} />}
        actions={actions}
        headerContent={headerContent}
        tabs={
          <ProfileTabs
            tabs={tabs}
            value={activeTab}
            onValueChange={setActiveTab}
          />
        }
      />
    </>
  )
}
