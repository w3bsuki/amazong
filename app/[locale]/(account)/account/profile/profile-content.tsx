"use client"

import { useTranslations } from "next-intl"
import { Settings2 as GearSix, CircleUser as UserCircle } from "lucide-react"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { PublicProfileEditor } from "./public-profile-editor"
import { PRESET_AVATARS, SHIPPING_REGIONS } from "./profile-account.types"
import { ProfileAvatarCard } from "./profile-avatar-card"
import { useProfileContentController } from "./profile-content.controller"
import type { ProfileContentProps } from "./profile-content.types"
import { ProfileEmailDialog } from "./profile-email-dialog"
import { ProfilePasswordDialog } from "./profile-password-dialog"
import { ProfilePersonalInfoCard } from "./profile-personal-info-card"
import { ProfileSecurityCard } from "./profile-security-card"

export type { ProfileContentServerActions } from "./profile-content.types"

export function ProfileContent({
  locale,
  profile,
  profileActions,
  publicProfileActions,
}: ProfileContentProps) {
  const tProfile = useTranslations("Account.profileEditor")
  const {
    isPending,
    isChangePasswordOpen,
    setIsChangePasswordOpen,
    isChangeEmailOpen,
    setIsChangeEmailOpen,
    showNewPassword,
    setShowNewPassword,
    avatarPreview,
    isUploadingAvatar,
    fileInputRef,
    profileData,
    setProfileData,
    passwordData,
    setPasswordData,
    emailData,
    setEmailData,
    handleProfileUpdate,
    handleAvatarChange,
    handleDeleteAvatar,
    handleChoosePresetAvatar,
    handleChangeEmail,
    handleChangePassword,
    passwordStrength,
    isPasswordValid,
    displayName,
  } = useProfileContentController({ profile, profileActions })

  return (
    <Tabs defaultValue="account" className="space-y-6">
      <TabsList className="max-w-md">
        <TabsTrigger value="account" className="flex-1 gap-2">
          <GearSix className="size-4" />
          {tProfile("tabs.account")}
        </TabsTrigger>
        <TabsTrigger value="public" className="flex-1 gap-2">
          <UserCircle className="size-4" />
          {tProfile("tabs.public")}
        </TabsTrigger>
      </TabsList>

      <TabsContent value="public" className="space-y-6 mt-0">
        <PublicProfileEditor
          locale={locale}
          actions={publicProfileActions}
          profile={{
            id: profile.id,
            username: profile.username,
            display_name: profile.display_name,
            bio: profile.bio,
            banner_url: profile.banner_url,
            location: profile.location,
            website_url: profile.website_url,
            social_links: profile.social_links,
            account_type:
              profile.account_type === "business"
                ? "business"
                : profile.account_type === "personal"
                  ? "personal"
                  : null,
            is_seller: profile.is_seller ?? false,
            verified_business: profile.is_verified_business ?? false,
            business_name: profile.business_name,
            vat_number: profile.vat_number,
            last_username_change: profile.last_username_change,
          }}
        />
      </TabsContent>

      <TabsContent value="account" className="space-y-6 mt-0">
        <ProfileAvatarCard
          locale={locale}
          displayName={displayName}
          role={profile.role}
          avatarPreview={avatarPreview}
          isUploadingAvatar={isUploadingAvatar}
          fileInputRef={fileInputRef}
          onAvatarChange={handleAvatarChange}
          onDeleteAvatar={handleDeleteAvatar}
          onChoosePresetAvatar={handleChoosePresetAvatar}
          presetAvatars={PRESET_AVATARS}
        />

        <ProfilePersonalInfoCard
          locale={locale}
          profileData={profileData}
          setProfileData={setProfileData}
          shippingRegions={SHIPPING_REGIONS}
          isPending={isPending}
          onSubmit={handleProfileUpdate}
        />

        <ProfileSecurityCard
          locale={locale}
          email={profile.email}
          onOpenEmail={() => setIsChangeEmailOpen(true)}
          onOpenPassword={() => setIsChangePasswordOpen(true)}
        />
      </TabsContent>

      <ProfileEmailDialog
        locale={locale}
        open={isChangeEmailOpen}
        onOpenChange={setIsChangeEmailOpen}
        emailData={emailData}
        setEmailData={setEmailData}
        isPending={isPending}
        onSubmit={handleChangeEmail}
      />

      <ProfilePasswordDialog
        locale={locale}
        open={isChangePasswordOpen}
        onOpenChange={setIsChangePasswordOpen}
        passwordData={passwordData}
        setPasswordData={setPasswordData}
        showNewPassword={showNewPassword}
        setShowNewPassword={setShowNewPassword}
        passwordStrength={passwordStrength}
        isPasswordValid={isPasswordValid}
        isPending={isPending}
        onSubmit={handleChangePassword}
      />
    </Tabs>
  )
}
