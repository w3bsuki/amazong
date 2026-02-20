import { ProfileContent } from "./profile-content"
import {
  deleteAvatar,
  setAvatarUrl,
  updateEmail,
  updatePassword,
  updateProfile,
  uploadAvatar,
} from "@/app/actions/profile-mutations"
import {
  checkUsernameAvailability,
  getUsernameChangeCooldown,
} from "@/app/actions/username-availability"
import {
  downgradeToPersonalAccount,
  setUsername,
  upgradeToBusinessAccount,
} from "@/app/actions/username-account"
import {
  updatePublicProfile,
  uploadBanner,
} from "@/app/actions/username-profile"
import { requireAccountPageContext } from "../_lib/require-account-page-context"

interface ProfilePageProps {
  params: Promise<{
    locale: string
  }>
}

function buildGeneratedAvatar(seed: string): string {
  const safeSeed = seed.trim().length > 0 ? seed.trim() : "user"
  let hash = 0
  for (let i = 0; i < safeSeed.length; i += 1) {
    hash = (hash * 31 + safeSeed.charCodeAt(i)) >>> 0
  }
  const paletteIndex = hash % 6
  return `boring-avatar:marble:${paletteIndex}:${safeSeed}`
}

export const metadata = {
  title: "Profile | Treido",
  description: "Manage your Treido profile information.",
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { locale, t, supabase, user } = await requireAccountPageContext(params)

  // Fetch profile data (public surface) + private PII fields
  const [
    { data: profileRaw },
    { data: privateProfile },
  ] = await Promise.all([
    supabase
      .from("profiles")
      .select(`
        id,
        full_name,
        avatar_url,
        shipping_region,
        country_code,
        role,
        created_at,
        username,
        display_name,
        bio,
        banner_url,
        location,
        website_url,
        social_links,
        account_type,
        is_seller,
        is_verified_business,
        business_name,
        last_username_change,
        tier
      `)
      .eq("id", user.id)
      .single(),
    supabase
      .from("private_profiles")
      .select("email, phone, vat_number")
      .eq("id", user.id)
      .maybeSingle(),
  ])

  // Transform social_links from Json to Record<string, string>
  const profileData = profileRaw ? {
    ...profileRaw,
    avatar_url:
      profileRaw.avatar_url ??
      buildGeneratedAvatar(profileRaw.username ?? user.email ?? user.id),
    email: privateProfile?.email ?? user.email ?? "",
    phone: privateProfile?.phone ?? null,
    vat_number: privateProfile?.vat_number ?? null,
    social_links: profileRaw.social_links && typeof profileRaw.social_links === 'object' && !Array.isArray(profileRaw.social_links)
      ? profileRaw.social_links as Record<string, string>
      : null,
  } : null

  return (
    <div className="flex flex-col gap-4 md:gap-4">
      <h1 className="sr-only">{t("header.profile")}</h1>
      <ProfileContent
        locale={locale}
        profile={profileData || {
          id: user.id,
          email: user.email || "",
          full_name: null,
          avatar_url: buildGeneratedAvatar(user.email ?? user.id),
          phone: null,
          shipping_region: null,
          country_code: null,
          role: "buyer",
          created_at: user.created_at,
          username: null,
          display_name: null,
          bio: null,
          banner_url: null,
          location: null,
          website_url: null,
          social_links: null,
          account_type: "personal",
          is_seller: false,
          is_verified_business: false,
          business_name: null,
          vat_number: null,
          last_username_change: null,
          tier: "free",
        }}
        profileActions={{
          updateProfile,
          uploadAvatar,
          deleteAvatar,
          setAvatarUrl,
          updateEmail,
          updatePassword,
        }}
        publicProfileActions={{
          setUsername,
          updatePublicProfile,
          uploadBanner,
          upgradeToBusinessAccount,
          downgradeToPersonalAccount,
          checkUsernameAvailability,
          getUsernameChangeCooldown,
        }}
      />
    </div>
  )
}
