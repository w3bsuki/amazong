import { createClient } from "@/lib/supabase/server"
import { redirect } from "@/i18n/routing"
import { getTranslations } from "next-intl/server"
import { ProfileContent } from "./profile-content"
import {
  deleteAvatar,
  setAvatarUrl,
  updateEmail,
  updatePassword,
  updateProfile,
  uploadAvatar,
} from "@/app/actions/profile"
import {
  checkUsernameAvailability,
  downgradeToPersonalAccount,
  getUsernameChangeCooldown,
  setUsername,
  updatePublicProfile,
  upgradeToBusinessAccount,
  uploadBanner,
} from "@/app/actions/username"

interface ProfilePageProps {
  params: Promise<{
    locale: string
  }>
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { locale: localeParam } = await params
  const locale = localeParam === "bg" ? "bg" : "en"
  const t = await getTranslations({ locale, namespace: "Account" })
  const supabase = await createClient()

  if (!supabase) {
    return redirect({ href: "/auth/login", locale })
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect({ href: "/auth/login", locale })
  }

  // Fetch profile data from unified profiles table
  const { data: profileDataRaw } = await supabase
    .from("profiles")
    .select(`
      id,
      email,
      full_name,
      avatar_url,
      phone,
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
      vat_number,
      last_username_change,
      tier
    `)
    .eq("id", user.id)
    .single()

  // Transform social_links from Json to Record<string, string>
  const profileData = profileDataRaw ? {
    ...profileDataRaw,
    social_links: profileDataRaw.social_links && typeof profileDataRaw.social_links === 'object' && !Array.isArray(profileDataRaw.social_links)
      ? profileDataRaw.social_links as Record<string, string>
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
          avatar_url: null,
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
