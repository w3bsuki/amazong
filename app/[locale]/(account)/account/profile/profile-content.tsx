"use client"

import { useRef, useState, useTransition } from "react"
import { useTranslations } from "next-intl"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Settings2 as GearSix, CircleUser as UserCircle } from "lucide-react"
import { toast } from "sonner"
import { validateEmail, validatePassword } from "@/lib/validation/auth"
import { PublicProfileEditor, type PublicProfileEditorServerActions } from "./public-profile-editor"
import { PRESET_AVATARS, SHIPPING_REGIONS, type EmailDataState, type PasswordDataState, type PasswordStrength, type ProfileDataState } from "./profile-account.types"
import { ProfileAvatarCard } from "./profile-avatar-card"
import { ProfilePersonalInfoCard } from "./profile-personal-info-card"
import { ProfileSecurityCard } from "./profile-security-card"
import { ProfileEmailDialog } from "./profile-email-dialog"
import { ProfilePasswordDialog } from "./profile-password-dialog"

export type ProfileContentServerActions = {
  updateProfile: (formData: FormData) => Promise<{ success: boolean; error?: string }>
  uploadAvatar: (formData: FormData) => Promise<{
    success: boolean
    avatarUrl?: string
    error?: string
  }>
  deleteAvatar: () => Promise<{ success: boolean; avatarUrl?: string; error?: string }>
  setAvatarUrl: (formData: FormData) => Promise<{
    success: boolean
    avatarUrl?: string
    error?: string
  }>
  updateEmail: (formData: FormData) => Promise<{ success: boolean; error?: string }>
  updatePassword: (formData: FormData) => Promise<{ success: boolean; error?: string }>
}

interface ProfileContentProps {
  locale: string
  profile: {
    id: string
    email: string | null
    full_name: string | null
    avatar_url: string | null
    phone: string | null
    shipping_region: string | null
    country_code: string | null
    role: string | null
    created_at: string | null
    username: string | null
    display_name: string | null
    bio: string | null
    banner_url: string | null
    location: string | null
    website_url: string | null
    social_links: Record<string, string> | null
    account_type: string | null
    is_seller: boolean | null
    is_verified_business: boolean | null
    business_name: string | null
    vat_number: string | null
    last_username_change: string | null
    tier?: string | null
  }
  profileActions: ProfileContentServerActions
  publicProfileActions: PublicProfileEditorServerActions
}

export function ProfileContent({
  locale,
  profile,
  profileActions,
  publicProfileActions,
}: ProfileContentProps) {
  const tAuth = useTranslations("Auth")
  const [isPending, startTransition] = useTransition()
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false)
  const [isChangeEmailOpen, setIsChangeEmailOpen] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(profile.avatar_url)
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [profileData, setProfileData] = useState<ProfileDataState>({
    full_name: profile.full_name || "",
    phone: profile.phone || "",
    shipping_region: profile.shipping_region || "",
    country_code: profile.country_code || "",
  })

  const [passwordData, setPasswordData] = useState<PasswordDataState>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const [emailData, setEmailData] = useState<EmailDataState>({
    newEmail: "",
  })

  const handleProfileUpdate = async (event: React.FormEvent) => {
    event.preventDefault()

    const formData = new FormData()
    formData.set("full_name", profileData.full_name)
    formData.set("phone", profileData.phone)
    formData.set("shipping_region", profileData.shipping_region)
    formData.set("country_code", profileData.country_code)

    startTransition(async () => {
      const result = await profileActions.updateProfile(formData)
      if (result.success) {
        toast.success(locale === "bg" ? "Профилът е обновен успешно" : "Profile updated successfully")
      } else {
        toast.error(result.error || (locale === "bg" ? "Грешка при обновяване" : "Error updating profile"))
      }
    })
  }

  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string)
    }
    reader.readAsDataURL(file)

    setIsUploadingAvatar(true)
    const formData = new FormData()
    formData.set("avatar", file)

    const result = await profileActions.uploadAvatar(formData)
    setIsUploadingAvatar(false)

    if (result.success) {
      setAvatarPreview(result.avatarUrl || null)
      toast.success(locale === "bg" ? "Аватарът е качен успешно" : "Avatar uploaded successfully")
    } else {
      setAvatarPreview(profile.avatar_url)
      toast.error(result.error || (locale === "bg" ? "Грешка при качване" : "Error uploading avatar"))
    }
  }

  const handleDeleteAvatar = async () => {
    setIsUploadingAvatar(true)
    const result = await profileActions.deleteAvatar()
    setIsUploadingAvatar(false)

    if (result.success) {
      setAvatarPreview(result.avatarUrl ?? profile.avatar_url)
      toast.success(locale === "bg" ? "Аватарът е нулиран" : "Avatar reset")
    } else {
      toast.error(result.error || (locale === "bg" ? "Грешка при нулиране" : "Error resetting avatar"))
    }
  }

  const handleChoosePresetAvatar = (url: string) => {
    setAvatarPreview(url)
    setIsUploadingAvatar(true)

    const formData = new FormData()
    formData.set("avatar_url", url)

    startTransition(async () => {
      const result = await profileActions.setAvatarUrl(formData)
      setIsUploadingAvatar(false)

      if (result.success) {
        setAvatarPreview(result.avatarUrl || url)
        toast.success(locale === "bg" ? "Аватарът е обновен" : "Avatar updated")
      } else {
        setAvatarPreview(profile.avatar_url)
        toast.error(result.error || (locale === "bg" ? "Грешка при обновяване" : "Error updating avatar"))
      }
    })
  }

  const handleChangeEmail = async () => {
    const emailValidation = validateEmail(emailData.newEmail)
    if (!emailValidation.valid) {
      toast.error(tAuth(emailValidation.error as never))
      return
    }

    const formData = new FormData()
    formData.set("email", emailData.newEmail)

    startTransition(async () => {
      const result = await profileActions.updateEmail(formData)
      if (result.success) {
        toast.success(
          locale === "bg"
            ? "Изпратен е имейл за потвърждение на новия адрес"
            : "A confirmation email has been sent to your new address"
        )
        setIsChangeEmailOpen(false)
        setEmailData({ newEmail: "" })
      } else {
        toast.error(result.error || (locale === "bg" ? "Грешка при промяна на имейла" : "Error changing email"))
      }
    })
  }

  const handleChangePassword = async () => {
    const passwordValidation = validatePassword(passwordData.newPassword)
    if (!passwordValidation.valid) {
      toast.error(tAuth(passwordValidation.errors[0] as never))
      return
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error(tAuth("passwordsDoNotMatch"))
      return
    }

    const formData = new FormData()
    formData.set("currentPassword", passwordData.currentPassword)
    formData.set("newPassword", passwordData.newPassword)
    formData.set("confirmPassword", passwordData.confirmPassword)

    startTransition(async () => {
      const result = await profileActions.updatePassword(formData)
      if (result.success) {
        toast.success(locale === "bg" ? "Паролата е променена успешно" : "Password changed successfully")
        setIsChangePasswordOpen(false)
        setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" })
      } else {
        toast.error(result.error || (locale === "bg" ? "Грешка при промяна на паролата" : "Error changing password"))
      }
    })
  }

  const getPasswordStrength = (password: string): PasswordStrength | null => {
    if (password.length === 0) return null

    const hasUpper = /[A-Z]/.test(password)
    const hasLower = /[a-z]/.test(password)
    const hasNumber = /[0-9]/.test(password)
    const hasSpecial = /[^a-zA-Z0-9]/.test(password)

    let score = 0
    if (password.length >= 8) score++
    if (password.length >= 12) score++
    if (hasUpper && hasLower) score++
    if (hasNumber) score++
    if (hasSpecial) score++

    if (score <= 2) return { label: locale === "bg" ? "Слаба" : "Weak", color: "bg-destructive", width: "w-1/4" }
    if (score === 3) return { label: locale === "bg" ? "Средна" : "Fair", color: "bg-warning", width: "w-2/4" }
    if (score === 4) return { label: locale === "bg" ? "Добра" : "Good", color: "bg-info", width: "w-3/4" }
    return { label: locale === "bg" ? "Силна" : "Strong", color: "bg-success", width: "w-full" }
  }

  const passwordStrength = getPasswordStrength(passwordData.newPassword)
  const isPasswordValid = validatePassword(passwordData.newPassword).valid
  const displayName = profile.full_name || profile.email || "User"

  return (
    <Tabs defaultValue="account" className="space-y-6">
      <TabsList className="max-w-md">
        <TabsTrigger value="account" className="flex-1 gap-2">
          <GearSix className="size-4" />
          {locale === "bg" ? "Акаунт" : "Account"}
        </TabsTrigger>
        <TabsTrigger value="public" className="flex-1 gap-2">
          <UserCircle className="size-4" />
          {locale === "bg" ? "Публичен профил" : "Public Profile"}
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
            account_type: profile.account_type === "business" ? "business" : profile.account_type === "personal" ? "personal" : null,
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
