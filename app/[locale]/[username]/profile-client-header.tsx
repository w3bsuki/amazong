import {
  Calendar,
  Globe,
  MapPin,
  MessageCircle as ChatCircle,
  Package,
  Pencil as PencilSimple,
  Share2 as ShareNetwork,
  Store as Storefront,
} from "lucide-react"
import type { useTranslations } from "next-intl"

import { Link } from "@/i18n/routing"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { IconButton } from "@/components/ui/icon-button"
import { FollowSellerButton, type FollowSellerActions } from "./_components/follow-seller-button"
import { SellerVerificationBadge } from "./_components/seller-verification-badge"

import { fallbackSocialIcon, socialIcons, StarRating } from "./profile-client.helpers"

type Translator = ReturnType<typeof useTranslations>

type HeaderProfile = {
  id: string
  username: string | null
  avatar_url: string | null
  bio: string | null
  account_type: string | null
  tier?: string | null
  is_seller: boolean | null
  is_verified_business: boolean | null
  location: string | null
  website_url: string | null
  social_links: Record<string, string> | null
  average_rating?: number | null
}

export function buildProfileHeaderContent({
  profile,
  memberSinceLabel,
  sellerReviewCount,
  tProfile,
}: {
  profile: HeaderProfile
  memberSinceLabel: string | null
  sellerReviewCount: number
  tProfile: Translator
}) {
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1.5">
        {profile.account_type === "business" && (
          <Badge variant="secondary" className="gap-1 text-xs">
            <Storefront className="size-3" />
            {tProfile("business")}
          </Badge>
        )}
        {profile.is_seller && (
          <Badge variant="success-subtle" className="gap-1 text-xs">
            <Package className="size-3" />
            {tProfile("seller")}
          </Badge>
        )}
        <SellerVerificationBadge
          variant="badge"
          size="sm"
          isVerifiedBusiness={Boolean(profile.is_verified_business)}
        />
      </div>

      {profile.is_seller && sellerReviewCount > 0 && profile.average_rating ? (
        <StarRating rating={profile.average_rating} count={sellerReviewCount} />
      ) : null}

      {profile.bio && <p className="text-sm text-muted-foreground">{profile.bio}</p>}

      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
        {profile.location && (
          <span className="flex items-center gap-1">
            <MapPin className="size-3.5" />
            {profile.location}
          </span>
        )}
        {memberSinceLabel && (
          <span className="flex items-center gap-1">
            <Calendar className="size-3.5" />
            {memberSinceLabel}
          </span>
        )}
      </div>

      {profile.social_links && Object.keys(profile.social_links).length > 0 && (
        <div className="flex gap-2 pt-1">
          {profile.website_url && (
            <IconButton
              asChild
              variant="outline"
              aria-label={tProfile("openWebsite")}
              className="rounded-full bg-surface-subtle"
            >
              <a href={profile.website_url} target="_blank" rel="noopener noreferrer">
                <Globe className="size-4" aria-hidden="true" />
              </a>
            </IconButton>
          )}
          {Object.entries(profile.social_links).map(([platform, url]) => {
            if (!url) return null
            return (
              <IconButton
                key={platform}
                asChild
                variant="outline"
                aria-label={tProfile("openSocial", { platform })}
                className="rounded-full bg-surface-subtle"
              >
                <a href={url} target="_blank" rel="noopener noreferrer">
                  <span aria-hidden="true">{socialIcons[platform] || fallbackSocialIcon}</span>
                </a>
              </IconButton>
            )
          })}
        </div>
      )}
    </div>
  )
}

export function buildProfileActions({
  profile,
  isOwnProfile,
  isFollowing,
  locale,
  tProfile,
  tSeller,
  followActions,
  onShare,
}: {
  profile: HeaderProfile
  isOwnProfile: boolean
  isFollowing: boolean
  locale: string
  tProfile: Translator
  tSeller: Translator
  followActions: FollowSellerActions | undefined
  onShare: () => Promise<void>
}) {
  if (isOwnProfile) {
    return (
      <>
        <Link href="/account/profile" className="w-full min-w-0 sm:flex-1">
          <Button className="w-full min-w-0 rounded-xl">
            <PencilSimple className="size-4" />
            <span className="truncate">{tProfile("editProfile")}</span>
          </Button>
        </Link>
        <Button
          type="button"
          variant="secondary"
          size="icon"
          className="hidden rounded-xl sm:inline-flex"
          onClick={onShare}
        >
          <ShareNetwork className="size-4" />
        </Button>
      </>
    )
  }

  return (
    <>
      {profile.is_seller && followActions ? (
        <FollowSellerButton
          sellerId={profile.id}
          initialIsFollowing={isFollowing}
          actions={followActions}
          locale={locale}
          variant="default"
          size="default"
          className="w-full rounded-xl sm:flex-1"
        />
      ) : null}
      {!isOwnProfile && (
        <Link href={`/chat?to=${profile.id}`} className="w-full min-w-0 sm:flex-1">
          <Button variant="secondary" className="w-full min-w-0 gap-2 rounded-xl">
            <ChatCircle className="size-4" />
            <span className="truncate">{tSeller("message")}</span>
          </Button>
        </Link>
      )}
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="hidden rounded-xl sm:inline-flex"
        aria-label={tProfile("share")}
        onClick={onShare}
      >
        <ShareNetwork className="size-5" />
      </Button>
    </>
  )
}

