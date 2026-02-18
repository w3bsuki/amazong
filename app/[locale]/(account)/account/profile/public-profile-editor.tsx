"use client"

import { useEffect, useRef, useState, useTransition } from "react"
import { toast } from "sonner"
import { PublicProfileAccountTypeCard } from "./public-profile-account-type-card"
import { PublicProfileBannerCard } from "./public-profile-banner-card"
import { PublicProfileInfoCard } from "./public-profile-info-card"
import { PublicProfileUsernameCard } from "./public-profile-username-card"
import type {
  BusinessDataState,
  ProfileDataState,
  PublicProfileEditorServerActions,
  PublicProfileRecord,
} from "./public-profile-editor.types"

export type { PublicProfileEditorServerActions } from "./public-profile-editor.types"

interface PublicProfileEditorProps {
  locale: string
  profile: PublicProfileRecord
  actions: PublicProfileEditorServerActions
}

export function PublicProfileEditor({
  locale,
  profile,
  actions,
}: PublicProfileEditorProps) {
  const [isPending, startTransition] = useTransition()
  const bannerInputRef = useRef<HTMLInputElement>(null)

  const [usernameDialogOpen, setUsernameDialogOpen] = useState(false)
  const [newUsername, setNewUsername] = useState(profile.username || "")
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null)
  const [isCheckingUsername, setIsCheckingUsername] = useState(false)
  const [canChangeUsername, setCanChangeUsername] = useState(true)
  const [daysUntilChange, setDaysUntilChange] = useState<number | undefined>()

  const [profileData, setProfileData] = useState<ProfileDataState>({
    display_name: profile.display_name || "",
    bio: profile.bio || "",
    location: profile.location || "",
    website_url: profile.website_url || "",
    social_links: {
      facebook: profile.social_links?.facebook || "",
      instagram: profile.social_links?.instagram || "",
      twitter: profile.social_links?.twitter || "",
      tiktok: profile.social_links?.tiktok || "",
    },
  })

  const [bannerPreview, setBannerPreview] = useState<string | null>(profile.banner_url)
  const [isUploadingBanner, setIsUploadingBanner] = useState(false)

  const [businessDialogOpen, setBusinessDialogOpen] = useState(false)
  const [businessData, setBusinessData] = useState<BusinessDataState>({
    business_name: profile.business_name || "",
    vat_number: profile.vat_number || "",
    change_username: false,
    new_username: "",
  })

  useEffect(() => {
    async function checkCooldown() {
      const result = await actions.getUsernameChangeCooldown()
      setCanChangeUsername(result.canChange)
      setDaysUntilChange(result.daysRemaining)
    }

    void checkCooldown()
  }, [actions])

  const handleUsernameCheck = async (username: string) => {
    if (!username || username.length < 3 || username === profile.username) {
      setUsernameAvailable(null)
      return
    }

    setIsCheckingUsername(true)
    const result = await actions.checkUsernameAvailability(username)
    setUsernameAvailable(result.available)
    setIsCheckingUsername(false)
  }

  const handleUsernameChange = async () => {
    if (!newUsername || newUsername === profile.username) return

    startTransition(async () => {
      const result = await actions.setUsername(newUsername)
      if (result.success) {
        toast.success(locale === "bg" ? "Потребителското име е променено" : "Username changed successfully")
        setUsernameDialogOpen(false)
        window.location.reload()
      } else {
        toast.error(result.error)
      }
    })
  }

  const handleProfileUpdate = async () => {
    startTransition(async () => {
      const result = await actions.updatePublicProfile({
        display_name: profileData.display_name || null,
        bio: profileData.bio || null,
        location: profileData.location || null,
        website_url: profileData.website_url || null,
        social_links: profileData.social_links,
      })

      if (result.success) {
        toast.success(locale === "bg" ? "Профилът е обновен" : "Profile updated successfully")
      } else {
        toast.error(result.error)
      }
    })
  }

  const handleBannerChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onloadend = () => setBannerPreview(reader.result as string)
    reader.readAsDataURL(file)

    setIsUploadingBanner(true)
    const formData = new FormData()
    formData.set("banner", file)

    const result = await actions.uploadBanner(formData)
    setIsUploadingBanner(false)

    if (result.success) {
      setBannerPreview(result.bannerUrl || null)
      toast.success(locale === "bg" ? "Банерът е качен" : "Banner uploaded successfully")
    } else {
      setBannerPreview(profile.banner_url)
      toast.error(result.error)
    }
  }

  const handleBusinessUpgrade = async () => {
    startTransition(async () => {
      const result = await actions.upgradeToBusinessAccount({
        business_name: businessData.business_name,
        vat_number: businessData.vat_number || null,
        change_username: businessData.change_username,
        ...(businessData.new_username ? { new_username: businessData.new_username } : {}),
      })

      if (result.success) {
        toast.success(locale === "bg" ? "Профилът е обновен до бизнес" : "Upgraded to business account")
        setBusinessDialogOpen(false)
        window.location.reload()
      } else {
        toast.error(result.error)
      }
    })
  }

  const handleDowngrade = async () => {
    startTransition(async () => {
      const result = await actions.downgradeToPersonalAccount()
      if (result.success) {
        toast.success(locale === "bg" ? "Профилът е върнат до личен" : "Downgraded to personal account")
        window.location.reload()
      } else {
        toast.error(result.error)
      }
    })
  }

  const isBusiness = profile.account_type === "business"

  return (
    <div className="space-y-6">
      <PublicProfileUsernameCard
        locale={locale}
        username={profile.username}
        usernameDialogOpen={usernameDialogOpen}
        setUsernameDialogOpen={setUsernameDialogOpen}
        newUsername={newUsername}
        setNewUsername={setNewUsername}
        usernameAvailable={usernameAvailable}
        isCheckingUsername={isCheckingUsername}
        canChangeUsername={canChangeUsername}
        daysUntilChange={daysUntilChange}
        isPending={isPending}
        onCheckUsername={handleUsernameCheck}
        onSubmitUsername={handleUsernameChange}
      />

      <PublicProfileBannerCard
        locale={locale}
        bannerPreview={bannerPreview}
        isUploadingBanner={isUploadingBanner}
        bannerInputRef={bannerInputRef}
        onBannerChange={handleBannerChange}
      />

      <PublicProfileInfoCard
        locale={locale}
        profileUsername={profile.username}
        isBusiness={isBusiness}
        isPending={isPending}
        profileData={profileData}
        setProfileData={setProfileData}
        onSave={handleProfileUpdate}
      />

      <PublicProfileAccountTypeCard
        locale={locale}
        profile={profile}
        isBusiness={isBusiness}
        isPending={isPending}
        businessDialogOpen={businessDialogOpen}
        setBusinessDialogOpen={setBusinessDialogOpen}
        businessData={businessData}
        setBusinessData={setBusinessData}
        onUpgrade={handleBusinessUpgrade}
        onDowngrade={handleDowngrade}
      />
    </div>
  )
}
