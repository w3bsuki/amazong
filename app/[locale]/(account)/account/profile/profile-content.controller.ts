import { useRef, useState, useTransition } from "react"
import { useTranslations } from "next-intl"
import { toast } from "sonner"

import { validateEmail, validatePassword } from "@/lib/validation/auth"

import { getProfileErrorMessage } from "./profile-content.error-message"
import type { ProfileContentProps } from "./profile-content.types"
import type {
  EmailDataState,
  PasswordDataState,
  PasswordStrength,
  ProfileDataState,
} from "./profile-account.types"

export function useProfileContentController({
  profile,
  profileActions,
}: Pick<ProfileContentProps, "profile" | "profileActions">) {
  const tAuth = useTranslations("Auth")
  const tProfile = useTranslations("Account.profileEditor")
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
        toast.success(tProfile("toasts.profileUpdated"))
      } else {
        toast.error(getProfileErrorMessage(tProfile, result.errorCode))
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
      toast.success(tProfile("toasts.avatarUploaded"))
    } else {
      setAvatarPreview(profile.avatar_url)
      toast.error(getProfileErrorMessage(tProfile, result.errorCode))
    }
  }

  const handleDeleteAvatar = async () => {
    setIsUploadingAvatar(true)
    const result = await profileActions.deleteAvatar()
    setIsUploadingAvatar(false)

    if (result.success) {
      setAvatarPreview(result.avatarUrl ?? profile.avatar_url)
      toast.success(tProfile("toasts.avatarReset"))
    } else {
      toast.error(getProfileErrorMessage(tProfile, result.errorCode))
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
        toast.success(tProfile("toasts.avatarUpdated"))
      } else {
        setAvatarPreview(profile.avatar_url)
        toast.error(getProfileErrorMessage(tProfile, result.errorCode))
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
        toast.success(tProfile("toasts.emailChangeSent"))
        setIsChangeEmailOpen(false)
        setEmailData({ newEmail: "" })
      } else {
        toast.error(getProfileErrorMessage(tProfile, result.errorCode))
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
        toast.success(tProfile("toasts.passwordChanged"))
        setIsChangePasswordOpen(false)
        setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" })
      } else {
        toast.error(getProfileErrorMessage(tProfile, result.errorCode))
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

    if (score <= 2) return { label: tProfile("passwordStrength.weak"), color: "bg-destructive", width: "w-1/4" }
    if (score === 3) return { label: tProfile("passwordStrength.fair"), color: "bg-warning", width: "w-2/4" }
    if (score === 4) return { label: tProfile("passwordStrength.good"), color: "bg-info", width: "w-3/4" }
    return { label: tProfile("passwordStrength.strong"), color: "bg-success", width: "w-full" }
  }

  const passwordStrength = getPasswordStrength(passwordData.newPassword)
  const isPasswordValid = validatePassword(passwordData.newPassword).valid
  const displayName = profile.full_name || profile.email || tProfile("defaults.user")

  return {
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
  }
}
