"use client"

import { useState, useRef, useTransition, useEffect } from "react"
import Image from "next/image"
import { Link } from "@/i18n/routing"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Alert,
  AlertDescription,
} from "@/components/ui/alert"
import { ArrowRight, AtSign as At, Camera, CircleCheck as CheckCircle, Facebook as FacebookLogo, Globe, Image as ImageIcon, Info, Instagram as InstagramLogo, MapPin, Pencil as PencilSimple, LoaderCircle as SpinnerGap, Store as Storefront, Music2 as TiktokLogo, Bird as TwitterLogo, User } from "lucide-react";

import { toast } from "sonner"

export type PublicProfileEditorServerActions = {
  checkUsernameAvailability: (
    username: string
  ) => Promise<{ available: boolean; error?: string }>
  setUsername: (username: string) => Promise<{ success: boolean; error?: string }>
  updatePublicProfile: (data: {
    display_name?: string | null
    bio?: string | null
    location?: string | null
    website_url?: string | null
    social_links?: Record<string, string | null | undefined> | null
  }) => Promise<{ success: boolean; error?: string }>
  uploadBanner: (formData: FormData) => Promise<{
    success: boolean
    bannerUrl?: string
    error?: string
  }>
  upgradeToBusinessAccount: (data: {
    business_name: string
    vat_number?: string | null
    business_address?: Record<string, unknown> | null
    website_url?: string | null
    change_username?: boolean
    new_username?: string
  }) => Promise<{ success: boolean; error?: string }>
  downgradeToPersonalAccount: () => Promise<{ success: boolean; error?: string }>
  getUsernameChangeCooldown: () => Promise<{
    canChange: boolean
    daysRemaining?: number
  }>
}

interface PublicProfileEditorProps {
  locale: string
  profile: {
    id: string
    username: string | null
    display_name: string | null
    bio: string | null
    banner_url: string | null
    location: string | null
    website_url: string | null
    social_links: Record<string, string> | null
    account_type: "personal" | "business" | null
    is_seller: boolean
    verified_business: boolean
    business_name: string | null
    vat_number: string | null
    last_username_change: string | null
  }
  actions: PublicProfileEditorServerActions
}

export function PublicProfileEditor({
  locale,
  profile,
  actions,
}: PublicProfileEditorProps) {
  const [isPending, startTransition] = useTransition()
  const bannerInputRef = useRef<HTMLInputElement>(null)

  // Username state
  const [usernameDialogOpen, setUsernameDialogOpen] = useState(false)
  const [newUsername, setNewUsername] = useState(profile.username || "")
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null)
  const [isCheckingUsername, setIsCheckingUsername] = useState(false)
  const [canChangeUsername, setCanChangeUsername] = useState(true)
  const [daysUntilChange, setDaysUntilChange] = useState<number | undefined>()

  // Profile data state
  const [profileData, setProfileData] = useState({
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

  // Banner state
  const [bannerPreview, setBannerPreview] = useState<string | null>(profile.banner_url)
  const [isUploadingBanner, setIsUploadingBanner] = useState(false)

  // Business upgrade state
  const [businessDialogOpen, setBusinessDialogOpen] = useState(false)
  const [businessData, setBusinessData] = useState({
    business_name: profile.business_name || "",
    vat_number: profile.vat_number || "",
    change_username: false,
    new_username: "",
  })

  // Check username change cooldown on mount
  useEffect(() => {
    const checkCooldown = async () => {
      const result = await actions.getUsernameChangeCooldown()
      setCanChangeUsername(result.canChange)
      setDaysUntilChange(result.daysRemaining)
    }
    checkCooldown()
  }, [])

  // Username availability check
  const handleUsernameCheck = async (username: string) => {
    if (!username || username.length < 3) {
      setUsernameAvailable(null)
      return
    }

    if (username === profile.username) {
      setUsernameAvailable(null)
      return
    }

    setIsCheckingUsername(true)
    const result = await actions.checkUsernameAvailability(username)
    setUsernameAvailable(result.available)
    setIsCheckingUsername(false)
  }

  // Handle username change
  const handleUsernameChange = async () => {
    if (!newUsername || newUsername === profile.username) return

    startTransition(async () => {
      const result = await actions.setUsername(newUsername)
      if (result.success) {
        toast.success(locale === "bg" ? "Потребителското име е променено" : "Username changed successfully")
        setUsernameDialogOpen(false)
        // Refresh page to reflect changes
        window.location.reload()
      } else {
        toast.error(result.error)
      }
    })
  }

  // Handle profile update
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

  // Handle banner upload
  const handleBannerChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Preview
    const reader = new FileReader()
    reader.onloadend = () => setBannerPreview(reader.result as string)
    reader.readAsDataURL(file)

    // Upload
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

  // Handle business upgrade
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

  // Handle downgrade to personal
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
      {/* Public Profile Preview Link */}
      {profile.username && (
        <Card className="bg-hover border-selected-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">
                  {locale === "bg" ? "Твоят публичен профил" : "Your Public Profile"}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  treido.eu/{profile.username}
                </p>
              </div>
              <Link href={`/${profile.username}`}>
                <Button variant="outline" size="sm" className="gap-2">
                  {locale === "bg" ? "Виж профила" : "View Profile"}
                  <ArrowRight className="size-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Username Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <At className="size-5" />
            {locale === "bg" ? "Потребителско име" : "Username"}
          </CardTitle>
          <CardDescription>
            {locale === "bg"
              ? "Уникалният ти идентификатор за URL и споменаване"
              : "Your unique identifier for URLs and mentions"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 text-lg font-medium">
                <span className="text-muted-foreground">@</span>
                {profile.username || (
                  <span className="text-muted-foreground italic">
                    {locale === "bg" ? "Не е зададено" : "Not set"}
                  </span>
                )}
              </div>
              {profile.username && (
                <p className="text-xs text-muted-foreground mt-1">
                  treido.eu/u/{profile.username}
                </p>
              )}
            </div>

            <Dialog open={usernameDialogOpen} onOpenChange={setUsernameDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" disabled={!canChangeUsername && !!profile.username}>
                  <PencilSimple className="size-4 mr-1.5" />
                  {profile.username
                    ? (locale === "bg" ? "Промени" : "Change")
                    : (locale === "bg" ? "Задай" : "Set")
                  }
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {profile.username
                      ? (locale === "bg" ? "Промени потребителско име" : "Change Username")
                      : (locale === "bg" ? "Избери потребителско име" : "Choose Username")
                    }
                  </DialogTitle>
                  <DialogDescription>
                    {locale === "bg"
                      ? "Потребителското име може да се променя веднъж на 14 дни"
                      : "Username can be changed once every 14 days"}
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>{locale === "bg" ? "Ново потребителско име" : "New Username"}</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">@</span>
                      <Input
                        value={newUsername}
                        onChange={(e) => {
                          const val = e.target.value.toLowerCase().replaceAll(/[^a-z0-9_]/g, "")
                          setNewUsername(val)
                          handleUsernameCheck(val)
                        }}
                        placeholder="your_username"
                        className="pl-7"
                      />
                      {isCheckingUsername && (
                        <SpinnerGap className="absolute right-3 top-1/2 -translate-y-1/2 size-4 animate-spin" />
                      )}
                      {!isCheckingUsername && usernameAvailable === true && (
                        <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-success" />
                      )}
                    </div>
                    {usernameAvailable === false && (
                      <p className="text-xs text-destructive">
                        {locale === "bg" ? "Това име е заето" : "This username is taken"}
                      </p>
                    )}
                    {newUsername && newUsername.length >= 3 && usernameAvailable === true && (
                      <p className="text-xs text-muted-foreground">
                        treido.eu/u/{newUsername}
                      </p>
                    )}
                  </div>

                  <Alert>
                    <Info className="size-4" />
                    <AlertDescription className="text-xs">
                      {locale === "bg"
                        ? "Правила: 3-30 символа, само малки букви, цифри и долна черта"
                        : "Rules: 3-30 chars, lowercase letters, numbers, and underscores only"}
                    </AlertDescription>
                  </Alert>
                </div>

                <DialogFooter>
                  <Button variant="outline" onClick={() => setUsernameDialogOpen(false)}>
                    {locale === "bg" ? "Отказ" : "Cancel"}
                  </Button>
                  <Button
                    onClick={handleUsernameChange}
                    disabled={isPending || !usernameAvailable || !newUsername || newUsername === profile.username}
                  >
                    {isPending && <SpinnerGap className="size-4 mr-2 animate-spin" />}
                    {locale === "bg" ? "Запази" : "Save"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {!canChangeUsername && daysUntilChange && (
            <p className="text-xs text-muted-foreground mt-2">
              {locale === "bg"
                ? `Можеш да промениш след ${daysUntilChange} дни`
                : `Can change again in ${daysUntilChange} days`}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Profile Banner */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <ImageIcon className="size-5" />
            {locale === "bg" ? "Банер на профила" : "Profile Banner"}
          </CardTitle>
          <CardDescription>
            {locale === "bg"
              ? "Препоръчителен размер: 1200x300 пиксела"
              : "Recommended size: 1200x300 pixels"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className="relative h-32 rounded-lg bg-muted overflow-hidden cursor-pointer group"
            onClick={() => bannerInputRef.current?.click()}
          >
            {bannerPreview ? (
              <Image src={bannerPreview} alt="Banner" fill sizes="100vw" className="object-cover" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <ImageIcon className="size-8 text-muted-foreground" />
              </div>
            )}
            <div className="absolute inset-0 bg-surface-overlay opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              {isUploadingBanner ? (
                <SpinnerGap className="size-6 text-overlay-text animate-spin" />
              ) : (
                <Camera className="size-6 text-overlay-text" />
              )}
            </div>
          </div>
          <input
            ref={bannerInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleBannerChange}
            className="hidden"
          />
        </CardContent>
      </Card>

      {/* Public Profile Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <User className="size-5" />
            {locale === "bg" ? "Публична информация" : "Public Information"}
          </CardTitle>
          <CardDescription>
            {locale === "bg"
              ? "Тази информация се показва на публичния ти профил"
              : "This information is visible on your public profile"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>{locale === "bg" ? "Показвано име" : "Display Name"}</Label>
            <Input
              value={profileData.display_name}
              onChange={(e) => setProfileData(prev => ({ ...prev, display_name: e.target.value }))}
              placeholder={profile.username || (locale === "bg" ? "Твоето име" : "Your name")}
            />
            <p className="text-xs text-muted-foreground">
              {locale === "bg" ? "Показва се вместо @username" : "Shown instead of @username"}
            </p>
          </div>

          <div className="space-y-2">
            <Label>{locale === "bg" ? "Биография" : "Bio"}</Label>
            <Textarea
              value={profileData.bio}
              onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
              placeholder={locale === "bg" ? "Разкажи нещо за себе си..." : "Tell us about yourself..."}
              rows={3}
              maxLength={500}
            />
            <p className="text-xs text-muted-foreground text-right">
              {profileData.bio.length}/500
            </p>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-1.5">
              <MapPin className="size-4" />
              {locale === "bg" ? "Локация" : "Location"}
            </Label>
            <Input
              value={profileData.location}
              onChange={(e) => setProfileData(prev => ({ ...prev, location: e.target.value }))}
              placeholder={locale === "bg" ? "София, България" : "Sofia, Bulgaria"}
            />
          </div>

          <Separator />

          {/* Social Links - Only for business accounts */}
          {isBusiness && (
            <>
              <div className="space-y-2">
                <Label className="flex items-center gap-1.5">
                  <Globe className="size-4" />
                  {locale === "bg" ? "Уебсайт" : "Website"}
                </Label>
                <Input
                  type="url"
                  value={profileData.website_url}
                  onChange={(e) => setProfileData(prev => ({ ...prev, website_url: e.target.value }))}
                  placeholder="https://example.com"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label className="flex items-center gap-1.5">
                    <FacebookLogo className="size-4" />
                    Facebook
                  </Label>
                  <Input
                    value={profileData.social_links.facebook}
                    onChange={(e) => setProfileData(prev => ({
                      ...prev,
                      social_links: { ...prev.social_links, facebook: e.target.value }
                    }))}
                    placeholder="facebook.com/..."
                  />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-1.5">
                    <InstagramLogo className="size-4" />
                    Instagram
                  </Label>
                  <Input
                    value={profileData.social_links.instagram}
                    onChange={(e) => setProfileData(prev => ({
                      ...prev,
                      social_links: { ...prev.social_links, instagram: e.target.value }
                    }))}
                    placeholder="instagram.com/..."
                  />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-1.5">
                    <TwitterLogo className="size-4" />
                    Twitter/X
                  </Label>
                  <Input
                    value={profileData.social_links.twitter}
                    onChange={(e) => setProfileData(prev => ({
                      ...prev,
                      social_links: { ...prev.social_links, twitter: e.target.value }
                    }))}
                    placeholder="x.com/..."
                  />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-1.5">
                    <TiktokLogo className="size-4" />
                    TikTok
                  </Label>
                  <Input
                    value={profileData.social_links.tiktok}
                    onChange={(e) => setProfileData(prev => ({
                      ...prev,
                      social_links: { ...prev.social_links, tiktok: e.target.value }
                    }))}
                    placeholder="tiktok.com/@..."
                  />
                </div>
              </div>
            </>
          )}

          <Button onClick={handleProfileUpdate} disabled={isPending} className="w-full">
            {isPending && <SpinnerGap className="size-4 mr-2 animate-spin" />}
            {locale === "bg" ? "Запази промените" : "Save Changes"}
          </Button>
        </CardContent>
      </Card>

      {/* Account Type Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Storefront className="size-5" />
            {locale === "bg" ? "Тип акаунт" : "Account Type"}
          </CardTitle>
          <CardDescription>
            {isBusiness
              ? (locale === "bg" ? "Бизнес акаунт с разширени функции" : "Business account with extended features")
              : (locale === "bg" ? "Личен акаунт" : "Personal account")
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Badge variant={isBusiness ? "default" : "secondary"} className="gap-1">
                {isBusiness ? <Storefront className="size-3" /> : <User className="size-3" />}
                {isBusiness
                  ? (locale === "bg" ? "Бизнес" : "Business")
                  : (locale === "bg" ? "Личен" : "Personal")
                }
              </Badge>
              {isBusiness && profile.verified_business && (
                <Badge variant="outline" className="gap-1 text-info border-info/30 bg-info/10">
                  <CheckCircle className="size-3" />
                  {locale === "bg" ? "Верифициран" : "Verified"}
                </Badge>
              )}
            </div>

            {isBusiness ? (
              <Button variant="outline" size="sm" onClick={handleDowngrade} disabled={isPending}>
                {locale === "bg" ? "Върни към личен" : "Switch to Personal"}
              </Button>
            ) : (
              <Dialog open={businessDialogOpen} onOpenChange={setBusinessDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="gap-1">
                    <Storefront className="size-4" />
                    {locale === "bg" ? "Надгради до бизнес" : "Upgrade to Business"}
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>
                      {locale === "bg" ? "Надгради до бизнес акаунт" : "Upgrade to Business Account"}
                    </DialogTitle>
                    <DialogDescription>
                      {locale === "bg"
                        ? "Бизнес акаунтите имат допълнителни функции"
                        : "Business accounts have additional features"}
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>{locale === "bg" ? "Име на бизнеса *" : "Business Name *"}</Label>
                      <Input
                        value={businessData.business_name}
                        onChange={(e) => setBusinessData(prev => ({ ...prev, business_name: e.target.value }))}
                        placeholder={locale === "bg" ? "Вашият бизнес" : "Your Business"}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>{locale === "bg" ? "ДДС номер (по желание)" : "VAT Number (optional)"}</Label>
                      <Input
                        value={businessData.vat_number}
                        onChange={(e) => setBusinessData(prev => ({ ...prev, vat_number: e.target.value }))}
                        placeholder="BG123456789"
                      />
                    </div>

                    <Alert>
                      <Info className="size-4" />
                      <AlertDescription className="text-xs">
                        {locale === "bg"
                          ? "Бизнес акаунтите показват допълнителна информация на профила - социални мрежи, уебсайт и др."
                          : "Business accounts display additional profile info - social links, website, etc."}
                      </AlertDescription>
                    </Alert>
                  </div>

                  <DialogFooter>
                    <Button variant="outline" onClick={() => setBusinessDialogOpen(false)}>
                      {locale === "bg" ? "Отказ" : "Cancel"}
                    </Button>
                    <Button
                      onClick={handleBusinessUpgrade}
                      disabled={isPending || !businessData.business_name}
                    >
                      {isPending && <SpinnerGap className="size-4 mr-2 animate-spin" />}
                      {locale === "bg" ? "Надгради" : "Upgrade"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>

          {isBusiness && profile.business_name && (
            <div className="mt-4 pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                {locale === "bg" ? "Име на бизнеса" : "Business Name"}
              </p>
              <p className="font-medium">{profile.business_name}</p>
              {profile.vat_number && (
                <>
                  <p className="text-sm text-muted-foreground mt-2">
                    {locale === "bg" ? "ДДС номер" : "VAT Number"}
                  </p>
                  <p className="font-medium">{profile.vat_number}</p>
                </>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
