"use client"

import { useEffect, useRef, useState, useTransition } from "react"
import { useTranslations } from "next-intl"
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
  UsernameAccountErrorCode,
  UsernameAvailabilityErrorCode,
  UsernameProfileErrorCode,
} from "./public-profile-editor.types"

export type { PublicProfileEditorServerActions } from "./public-profile-editor.types"

interface PublicProfileEditorProps {
  locale: string
  profile: PublicProfileRecord
  actions: PublicProfileEditorServerActions
}

export function PublicProfileEditor({ locale, profile, actions }: PublicProfileEditorProps) {
  const t = useTranslations("Account.profileEditor")
  const [isPending, startTransition] = useTransition()
  const bannerInputRef = useRef<HTMLInputElement>(null)

  const [usernameDialogOpen, setUsernameDialogOpen] = useState(false)
  const [newUsername, setNewUsername] = useState(profile.username || "")
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null)
  const [usernameStatusMessage, setUsernameStatusMessage] = useState<string | null>(null)
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
      if (result.success) {
        setCanChangeUsername(result.canChange)
        setDaysUntilChange(result.daysRemaining)
      } else {
        setCanChangeUsername(false)
        setDaysUntilChange(undefined)
      }
    }

    void checkCooldown()
  }, [actions])

  const getUsernameAvailabilityErrorMessage = (errorCode?: UsernameAvailabilityErrorCode): string => {
    switch (errorCode) {
      case "INVALID_USERNAME":
        return t("errors.usernameAvailability.INVALID_USERNAME")
      case "USERNAME_RESERVED":
        return t("errors.usernameAvailability.USERNAME_RESERVED")
      case "USERNAME_TAKEN":
        return t("errors.usernameAvailability.USERNAME_TAKEN")
      case "CHECK_FAILED":
      default:
        return t("errors.usernameAvailability.CHECK_FAILED")
    }
  }

  const getUsernameAccountErrorMessage = (
    errorCode?: UsernameAccountErrorCode,
    daysRemaining?: number
  ): string => {
    switch (errorCode) {
      case "NOT_AUTHENTICATED":
        return t("errors.usernameAccount.NOT_AUTHENTICATED")
      case "INVALID_USERNAME":
        return t("errors.usernameAccount.INVALID_USERNAME")
      case "USERNAME_RESERVED":
        return t("errors.usernameAccount.USERNAME_RESERVED")
      case "USERNAME_COOLDOWN_ACTIVE":
        return t("errors.usernameAccount.USERNAME_COOLDOWN_ACTIVE", { days: daysRemaining ?? 0 })
      case "USERNAME_TAKEN":
        return t("errors.usernameAccount.USERNAME_TAKEN")
      case "USERNAME_UPDATE_FAILED":
        return t("errors.usernameAccount.USERNAME_UPDATE_FAILED")
      case "INVALID_BUSINESS_DATA":
        return t("errors.usernameAccount.INVALID_BUSINESS_DATA")
      case "ACCOUNT_UPGRADE_FAILED":
        return t("errors.usernameAccount.ACCOUNT_UPGRADE_FAILED")
      case "ACTIVE_BUSINESS_SUBSCRIPTION":
        return t("errors.usernameAccount.ACTIVE_BUSINESS_SUBSCRIPTION")
      case "ACCOUNT_DOWNGRADE_FAILED":
        return t("errors.usernameAccount.ACCOUNT_DOWNGRADE_FAILED")
      case "UNKNOWN_ERROR":
      default:
        return t("errors.usernameAccount.UNKNOWN_ERROR")
    }
  }

  const getUsernameProfileErrorMessage = (errorCode?: UsernameProfileErrorCode): string => {
    switch (errorCode) {
      case "NOT_AUTHENTICATED":
        return t("errors.usernameProfile.NOT_AUTHENTICATED")
      case "INVALID_PROFILE_DATA":
        return t("errors.usernameProfile.INVALID_PROFILE_DATA")
      case "NO_FILE":
        return t("errors.usernameProfile.NO_FILE")
      case "FILE_TOO_LARGE":
        return t("errors.usernameProfile.FILE_TOO_LARGE")
      case "INVALID_FILE_TYPE":
        return t("errors.usernameProfile.INVALID_FILE_TYPE")
      case "PUBLIC_PROFILE_UPDATE_FAILED":
        return t("errors.usernameProfile.PUBLIC_PROFILE_UPDATE_FAILED")
      case "BANNER_UPLOAD_FAILED":
        return t("errors.usernameProfile.BANNER_UPLOAD_FAILED")
      case "BANNER_SAVE_FAILED":
        return t("errors.usernameProfile.BANNER_SAVE_FAILED")
      case "PROFILE_NOT_FOUND":
        return t("errors.usernameProfile.PROFILE_NOT_FOUND")
      case "UNKNOWN_ERROR":
      default:
        return t("errors.usernameProfile.UNKNOWN_ERROR")
    }
  }

  const handleUsernameCheck = async (username: string) => {
    if (!username || username.length < 3 || username === profile.username) {
      setUsernameAvailable(null)
      setUsernameStatusMessage(null)
      return
    }

    setIsCheckingUsername(true)
    const result = await actions.checkUsernameAvailability(username)
    setUsernameAvailable(result.available)
    setUsernameStatusMessage(
      result.success ? null : getUsernameAvailabilityErrorMessage(result.errorCode)
    )
    setIsCheckingUsername(false)
  }

  const handleUsernameChange = async () => {
    if (!newUsername || newUsername === profile.username) return

    startTransition(async () => {
      const result = await actions.setUsername(newUsername)
      if (result.success) {
        toast.success(t("toasts.usernameChanged"))
        setUsernameDialogOpen(false)
        window.location.reload()
      } else {
        toast.error(getUsernameAccountErrorMessage(result.errorCode, result.daysRemaining))
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
        toast.success(t("toasts.publicProfileUpdated"))
      } else {
        toast.error(getUsernameProfileErrorMessage(result.errorCode))
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
      setBannerPreview(result.bannerUrl)
      toast.success(t("toasts.bannerUploaded"))
    } else {
      setBannerPreview(profile.banner_url)
      toast.error(getUsernameProfileErrorMessage(result.errorCode))
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
        toast.success(t("toasts.businessUpgraded"))
        setBusinessDialogOpen(false)
        window.location.reload()
      } else {
        toast.error(getUsernameAccountErrorMessage(result.errorCode, result.daysRemaining))
      }
    })
  }

  const handleDowngrade = async () => {
    startTransition(async () => {
      const result = await actions.downgradeToPersonalAccount()
      if (result.success) {
        toast.success(t("toasts.businessDowngraded"))
        window.location.reload()
      } else {
        toast.error(getUsernameAccountErrorMessage(result.errorCode))
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
        usernameStatusMessage={usernameStatusMessage}
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
