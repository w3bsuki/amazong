"use client"

import { useState, useRef, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  User,
  Camera,
  Envelope, 
  Key, 
  SpinnerGap,
  Eye,
  EyeSlash,
  CheckCircle,
  Trash,
  MapPin,
  Phone,
  Globe,
  UserCircle,
  GearSix,
} from "@phosphor-icons/react"
import { toast } from "sonner"
import { 
  updateProfile, 
  uploadAvatar, 
  deleteAvatar, 
  setAvatarUrl,
  updateEmail, 
  updatePassword 
} from "@/app/actions/profile"
import { validatePassword, validateEmail } from "@/lib/validations/auth"
import { PublicProfileEditor } from "./public-profile-editor"

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
    // New unified profile fields
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
}

const SHIPPING_REGIONS = [
  { value: "BG", label: "Bulgaria", labelBg: "България" },
  { value: "UK", label: "United Kingdom", labelBg: "Обединено кралство" },
  { value: "EU", label: "Europe", labelBg: "Европа" },
  { value: "US", label: "United States", labelBg: "САЩ" },
  { value: "WW", label: "Worldwide", labelBg: "Целият свят" },
]

const PRESET_AVATARS = [
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Nova",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Riley",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Kai",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Zoe",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Max",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Luna",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Aria",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Theo",
]

function AvatarImg({ src, alt, size, className }: { src: string; alt: string; size: number; className?: string }) {
  return (
    <img
      src={src}
      alt={alt}
      width={size}
      height={size}
      loading="lazy"
      decoding="async"
      className={className}
    />
  )
}

export function ProfileContent({ locale, profile }: ProfileContentProps) {
  const [isPending, startTransition] = useTransition()
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false)
  const [isChangeEmailOpen, setIsChangeEmailOpen] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(profile.avatar_url)
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [profileData, setProfileData] = useState({
    full_name: profile.full_name || "",
    phone: profile.phone || "",
    shipping_region: profile.shipping_region || "",
    country_code: profile.country_code || "",
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  })
  
  const [emailData, setEmailData] = useState({
    newEmail: "",
  })

  // Handle profile update
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const formData = new FormData()
    formData.set("full_name", profileData.full_name)
    formData.set("phone", profileData.phone)
    formData.set("shipping_region", profileData.shipping_region)
    formData.set("country_code", profileData.country_code)

    startTransition(async () => {
      const result = await updateProfile(formData)
      if (result.success) {
        toast.success(locale === "bg" ? "Профилът е обновен успешно" : "Profile updated successfully")
      } else {
        toast.error(result.error || (locale === "bg" ? "Грешка при обновяване" : "Error updating profile"))
      }
    })
  }

  // Handle avatar upload
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string)
    }
    reader.readAsDataURL(file)

    // Upload
    setIsUploadingAvatar(true)
    const formData = new FormData()
    formData.set("avatar", file)

    const result = await uploadAvatar(formData)
    setIsUploadingAvatar(false)

    if (result.success) {
      setAvatarPreview(result.avatarUrl || null)
      toast.success(locale === "bg" ? "Аватарът е качен успешно" : "Avatar uploaded successfully")
    } else {
      setAvatarPreview(profile.avatar_url)
      toast.error(result.error || (locale === "bg" ? "Грешка при качване" : "Error uploading avatar"))
    }
  }

  // Handle avatar delete
  const handleDeleteAvatar = async () => {
    setIsUploadingAvatar(true)
    const result = await deleteAvatar()
    setIsUploadingAvatar(false)

    if (result.success) {
      setAvatarPreview(null)
      toast.success(locale === "bg" ? "Аватарът е премахнат" : "Avatar removed")
    } else {
      toast.error(result.error || (locale === "bg" ? "Грешка при премахване" : "Error removing avatar"))
    }
  }

  const handleChoosePresetAvatar = (url: string) => {
    setAvatarPreview(url)
    setIsUploadingAvatar(true)

    const formData = new FormData()
    formData.set("avatar_url", url)

    startTransition(async () => {
      const result = await setAvatarUrl(formData)
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

  // Handle email change
  const handleChangeEmail = async () => {
    const emailValidation = validateEmail(emailData.newEmail, locale)
    if (!emailValidation.valid) {
      toast.error(emailValidation.error!)
      return
    }

    const formData = new FormData()
    formData.set("email", emailData.newEmail)

    startTransition(async () => {
      const result = await updateEmail(formData)
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

  // Handle password change
  const handleChangePassword = async () => {
    const passwordValidation = validatePassword(passwordData.newPassword, locale)
    if (!passwordValidation.valid) {
      toast.error(passwordValidation.errors[0])
      return
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error(locale === "bg" ? "Паролите не съвпадат" : "Passwords do not match")
      return
    }

    const formData = new FormData()
    formData.set("currentPassword", passwordData.currentPassword)
    formData.set("newPassword", passwordData.newPassword)
    formData.set("confirmPassword", passwordData.confirmPassword)

    startTransition(async () => {
      const result = await updatePassword(formData)
      if (result.success) {
        toast.success(locale === "bg" ? "Паролата е променена успешно" : "Password changed successfully")
        setIsChangePasswordOpen(false)
        setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" })
      } else {
        toast.error(result.error || (locale === "bg" ? "Грешка при промяна на паролата" : "Error changing password"))
      }
    })
  }

  // Password strength indicator
  const getPasswordStrength = (password: string) => {
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
    if (score === 3) return { label: locale === "bg" ? "Средна" : "Fair", color: "bg-yellow-500", width: "w-2/4" }
    if (score === 4) return { label: locale === "bg" ? "Добра" : "Good", color: "bg-blue-500", width: "w-3/4" }
    return { label: locale === "bg" ? "Силна" : "Strong", color: "bg-green-500", width: "w-full" }
  }

  const passwordStrength = getPasswordStrength(passwordData.newPassword)
  const isPasswordValid = validatePassword(passwordData.newPassword, locale).valid

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
      
      {/* Public Profile Tab */}
      <TabsContent value="public" className="space-y-6 mt-0">
        <PublicProfileEditor 
          locale={locale} 
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
      
      {/* Account Settings Tab */}
      <TabsContent value="account" className="space-y-6 mt-0">
      {/* Avatar & Basic Info Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{locale === "bg" ? "Профилна снимка" : "Profile Picture"}</CardTitle>
          <CardDescription>
            {locale === "bg" 
              ? "Качете снимка за вашия профил. Максимален размер: 5MB" 
              : "Upload a picture for your profile. Max size: 5MB"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="size-24 rounded-full overflow-hidden bg-muted flex items-center justify-center border-2 border-muted">
                {avatarPreview ? (
                  <AvatarImg src={avatarPreview} alt="Avatar" size={96} className="object-cover size-full" />
                ) : (
                  <User className="size-12 text-muted-foreground" />
                )}
                {isUploadingAvatar && (
                  <div className="absolute inset-0 bg-background/80 flex items-center justify-center rounded-full">
                    <SpinnerGap className="size-6 animate-spin" />
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploadingAvatar}
                className="absolute -bottom-1 -right-1 size-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md hover:bg-primary/90 transition-colors"
              >
                <Camera className="size-4" weight="fill" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">{profile.full_name || profile.email}</p>
              <p className="text-xs text-muted-foreground capitalize">{profile.role}</p>
              {avatarPreview && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleDeleteAvatar}
                  disabled={isUploadingAvatar}
                >
                  <Trash className="size-4 mr-1.5" />
                  {locale === "bg" ? "Премахни" : "Remove"}
                </Button>
              )}
            </div>
          </div>

          <div className="mt-5">
            <p className="text-sm font-medium">
              {locale === "bg" ? "Избери аватар" : "Choose an avatar"}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {locale === "bg" ? "Бърз избор без качване" : "Quick pick without uploading"}
            </p>

            <div className="mt-3 grid grid-cols-4 sm:grid-cols-8 gap-2">
              {PRESET_AVATARS.map((url) => (
                <button
                  key={url}
                  type="button"
                  onClick={() => handleChoosePresetAvatar(url)}
                  disabled={isUploadingAvatar}
                  className="size-10 rounded-full overflow-hidden border bg-muted hover:bg-muted/80 transition-colors disabled:opacity-50"
                  aria-label={locale === "bg" ? "Избери този аватар" : "Choose this avatar"}
                >
                  <AvatarImg src={url} alt="" size={40} className="size-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Info Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{locale === "bg" ? "Лична информация" : "Personal Information"}</CardTitle>
          <CardDescription>
            {locale === "bg" 
              ? "Актуализирайте информацията за вашия профил" 
              : "Update your profile information"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="full_name">
                  <User className="size-4 inline mr-1.5" />
                  {locale === "bg" ? "Име" : "Full Name"}
                </Label>
                <Input
                  id="full_name"
                  value={profileData.full_name}
                  onChange={(e) => setProfileData(prev => ({ ...prev, full_name: e.target.value }))}
                  placeholder={locale === "bg" ? "Вашето име" : "Your name"}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">
                  <Phone className="size-4 inline mr-1.5" />
                  {locale === "bg" ? "Телефон" : "Phone"}
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={profileData.phone}
                  onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="+359 888 123 456"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="shipping_region">
                  <MapPin className="size-4 inline mr-1.5" />
                  {locale === "bg" ? "Регион за доставка" : "Shipping Region"}
                </Label>
                <Select
                  value={profileData.shipping_region}
                  onValueChange={(value) => setProfileData(prev => ({ ...prev, shipping_region: value }))}
                >
                  <SelectTrigger id="shipping_region">
                    <SelectValue placeholder={locale === "bg" ? "Изберете регион" : "Select region"} />
                  </SelectTrigger>
                  <SelectContent>
                    {SHIPPING_REGIONS.map((region) => (
                      <SelectItem key={region.value} value={region.value}>
                        {locale === "bg" ? region.labelBg : region.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="country_code">
                  <Globe className="size-4 inline mr-1.5" />
                  {locale === "bg" ? "Държава" : "Country Code"}
                </Label>
                <Input
                  id="country_code"
                  value={profileData.country_code}
                  onChange={(e) => setProfileData(prev => ({ ...prev, country_code: e.target.value.toUpperCase().slice(0, 2) }))}
                  placeholder="BG"
                  maxLength={2}
                />
              </div>
            </div>

            <Button type="submit" disabled={isPending} className="w-full sm:w-auto">
              {isPending ? (
                <>
                  <SpinnerGap className="size-4 mr-2 animate-spin" />
                  {locale === "bg" ? "Запазване..." : "Saving..."}
                </>
              ) : (
                locale === "bg" ? "Запази промените" : "Save Changes"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Security Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{locale === "bg" ? "Сигурност" : "Security"}</CardTitle>
          <CardDescription>
            {locale === "bg" 
              ? "Управлявайте имейла и паролата на акаунта" 
              : "Manage your account email and password"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Email Row */}
          <button
            onClick={() => setIsChangeEmailOpen(true)}
            className="w-full flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-muted/50 text-left transition-colors"
          >
            <div className="flex size-10 items-center justify-center rounded-full bg-muted">
              <Envelope className="size-5 text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">{locale === "bg" ? "Имейл" : "Email"}</p>
              <p className="text-xs text-muted-foreground truncate">{profile.email}</p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400">
              <CheckCircle className="size-3.5" weight="fill" />
              <span className="hidden sm:inline">{locale === "bg" ? "Потвърден" : "Verified"}</span>
            </div>
          </button>

          {/* Password Row */}
          <button
            onClick={() => setIsChangePasswordOpen(true)}
            className="w-full flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-muted/50 text-left transition-colors"
          >
            <div className="flex size-10 items-center justify-center rounded-full bg-muted">
              <Key className="size-5 text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">{locale === "bg" ? "Парола" : "Password"}</p>
              <p className="text-xs text-muted-foreground">••••••••</p>
            </div>
            <span className="text-xs text-muted-foreground">
              {locale === "bg" ? "Промени" : "Change"}
            </span>
          </button>
        </CardContent>
      </Card>
      </TabsContent>

      {/* Change Email Dialog */}
      <Dialog open={isChangeEmailOpen} onOpenChange={setIsChangeEmailOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{locale === "bg" ? "Промяна на имейл" : "Change Email"}</DialogTitle>
            <DialogDescription>
              {locale === "bg" 
                ? "Ще получите имейл за потвърждение на новия адрес" 
                : "You will receive a confirmation email at the new address"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="newEmail">{locale === "bg" ? "Нов имейл" : "New Email"}</Label>
              <Input
                id="newEmail"
                type="email"
                value={emailData.newEmail}
                onChange={(e) => setEmailData({ newEmail: e.target.value })}
                placeholder="new@example.com"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsChangeEmailOpen(false)}>
              {locale === "bg" ? "Отказ" : "Cancel"}
            </Button>
            <Button onClick={handleChangeEmail} disabled={isPending || !emailData.newEmail}>
              {isPending ? (
                <SpinnerGap className="size-4 mr-2 animate-spin" />
              ) : null}
              {locale === "bg" ? "Промени" : "Change"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Change Password Dialog */}
      <Dialog open={isChangePasswordOpen} onOpenChange={setIsChangePasswordOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{locale === "bg" ? "Промяна на парола" : "Change Password"}</DialogTitle>
            <DialogDescription>
              {locale === "bg" 
                ? "Въведете текущата и новата парола" 
                : "Enter your current and new password"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">{locale === "bg" ? "Текуща парола" : "Current Password"}</Label>
              <Input
                id="currentPassword"
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword">{locale === "bg" ? "Нова парола" : "New Password"}</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showNewPassword ? <EyeSlash className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
              {passwordStrength && (
                <div className="space-y-1">
                  <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
                    <div className={`h-full ${passwordStrength.color} ${passwordStrength.width} transition-all`} />
                  </div>
                  <p className="text-xs text-muted-foreground">{passwordStrength.label}</p>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">{locale === "bg" ? "Потвърди паролата" : "Confirm Password"}</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
              />
              {passwordData.confirmPassword && passwordData.newPassword !== passwordData.confirmPassword && (
                <p className="text-xs text-destructive">
                  {locale === "bg" ? "Паролите не съвпадат" : "Passwords do not match"}
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsChangePasswordOpen(false)}>
              {locale === "bg" ? "Отказ" : "Cancel"}
            </Button>
            <Button 
              onClick={handleChangePassword} 
              disabled={isPending || !isPasswordValid || passwordData.newPassword !== passwordData.confirmPassword}
            >
              {isPending ? (
                <SpinnerGap className="size-4 mr-2 animate-spin" />
              ) : null}
              {locale === "bg" ? "Промени" : "Change"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Tabs>
  )
}
