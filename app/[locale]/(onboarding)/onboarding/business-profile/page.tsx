"use client"

import { useEffect, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { useLocale, useTranslations } from "next-intl"
import { ArrowRight, Camera, Check, Globe, MapPin, LoaderCircle as SpinnerGap, X } from "lucide-react";

import Image from "next/image"
import Avatar from "boring-avatars"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { OnboardingShell } from "../_components/onboarding-shell"
import { type AvatarVariant, getColorPalette } from "@/lib/avatar-palettes"
import { createClient } from "@/lib/supabase/client"

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replaceAll(/[^a-z0-9\s_-]/g, "")
    .replaceAll(/\s+/g, "_")
    .replaceAll(/-+/g, "_")
    .replaceAll(/_+/g, "_")
    .replaceAll(/^_|_$/g, "")
    .slice(0, 30)
}

export default function BusinessProfilePage() {
  const router = useRouter()
  const locale = useLocale()
  const t = useTranslations("Onboarding")

  const [isPending, startTransition] = useTransition()

  const [businessName, setBusinessName] = useState("")
  const [username, setUsername] = useState("")
  const [usernameManuallyEdited, setUsernameManuallyEdited] = useState(false)
  const [category, setCategory] = useState("")
  const [website, setWebsite] = useState("")
  const [location, setLocation] = useState("")
  const [isCheckingUsername, setIsCheckingUsername] = useState(false)
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null)

  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [avatarVariant] = useState<AvatarVariant>("bauhaus")
  const [avatarPalette] = useState(2)

  useEffect(() => {
    if (!usernameManuallyEdited && businessName) {
      const suggested = slugify(businessName)
      if (suggested) setUsername(suggested)
    }
  }, [businessName, usernameManuallyEdited])

  useEffect(() => {
    let cancelled = false

    const timeoutId = setTimeout(async () => {
      const cleaned = username.trim().toLowerCase()
      if (!cleaned || cleaned.length < 3) {
        if (!cancelled) setUsernameAvailable(null)
        return
      }

      if (!cancelled) setIsCheckingUsername(true)
      try {
        const supabase = createClient()
        const { data } = await supabase
          .from("profiles")
          .select("id")
          .ilike("username", cleaned)
          .maybeSingle()

        if (!cancelled) setUsernameAvailable(!data)
      } finally {
        if (!cancelled) setIsCheckingUsername(false)
      }
    }, 500)

    return () => {
      cancelled = true
      clearTimeout(timeoutId)
    }
  }, [username])

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onloadend = () => setLogoPreview(reader.result as string)
    reader.readAsDataURL(file)
  }

  const handleUsernameChange = (value: string) => {
    setUsernameManuallyEdited(true)
    setUsername(value.toLowerCase().replaceAll(/[^a-z0-9_]/g, ""))
  }

  const handleContinue = () => {
    try {
      sessionStorage.setItem(
        "onboarding_profile",
        JSON.stringify({
          businessName: businessName.trim(),
          username: username.trim().toLowerCase(),
          category,
          website: website.trim(),
          location: location.trim(),
          accountType: "business",
          avatarType: logoPreview ? "custom" : "generated",
          avatarVariant: !logoPreview ? avatarVariant : undefined,
          avatarPalette: !logoPreview ? avatarPalette : undefined,
        }),
      )
    } catch {
      // Ignore storage access errors
    }

    startTransition(() => {
      router.push(`/${locale}/onboarding/interests?type=business`)
    })
  }

  const handleBack = () => {
    router.push(`/${locale}/onboarding/account-type`)
  }

  const canContinue =
    businessName.trim().length > 0 &&
    username.trim().length >= 3 &&
    usernameAvailable === true &&
    category.length > 0

  const usernameIndicator = (() => {
    if (!username || username.trim().length < 3) return null

    if (isCheckingUsername) {
      return (
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <SpinnerGap className="size-4 animate-spin motion-reduce:animate-none" />
          {t("businessProfile.checking")}
        </span>
      )
    }

    if (usernameAvailable === true) {
      return (
        <span className="flex items-center gap-1.5 text-xs text-success">
          <Check className="size-4" />
          {t("businessProfile.available")}
        </span>
      )
    }

    if (usernameAvailable === false) {
      return (
        <span className="flex items-center gap-1.5 text-xs text-destructive">
          <X className="size-4" />
          {t("businessProfile.unavailable")}
        </span>
      )
    }

    return null
  })()

  return (
    <OnboardingShell
      title={t("businessProfile.title")}
      subtitle={t("businessProfile.subtitle")}
      stepLabel={t("common.stepLabel", { current: 2, total: 5 })}
      progress={40}
      onBack={handleBack}
      backLabel={t("common.back")}
      footer={
        <Button onClick={handleContinue} disabled={!canContinue || isPending} size="lg" className="w-full">
          {isPending ? (
            <>
              <SpinnerGap className="size-5 animate-spin motion-reduce:animate-none" />
              {t("common.processing")}
            </>
          ) : (
            <>
              {t("common.continue")}
              <ArrowRight className="size-5" />
            </>
          )}
        </Button>
      }
    >
      <div className="space-y-6">
        <div>
          <Label className="text-sm font-semibold mb-2 block text-foreground">{t("businessProfile.logoLabel")}</Label>
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="size-16 rounded-xl overflow-hidden border-2 border-selected-border shadow-sm">
                {logoPreview ? (
                  <Image
                    src={logoPreview}
                    alt={t("businessProfile.logoLabel")}
                    width={64}
                    height={64}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <Avatar
                    size={64}
                    name={businessName || "business"}
                    variant={avatarVariant}
                    colors={getColorPalette(avatarPalette)}
                    square
                  />
                )}
              </div>
              <label
                className="absolute -bottom-1 -right-1 size-7 bg-primary text-primary-foreground rounded-full flex items-center justify-center cursor-pointer hover:bg-interactive-hover transition-colors shadow-sm"
                aria-label={t("businessProfile.logoLabel")}
              >
                <Camera className="size-3.5" />
                <input type="file" accept="image/*" className="hidden" onChange={handleLogoChange} />
              </label>
            </div>
            <p className="text-xs text-muted-foreground flex-1">{t("businessProfile.logoHint")}</p>
          </div>
        </div>

        <div>
          <Label htmlFor="businessName" className="text-sm font-semibold text-foreground">
            {t("businessProfile.businessNameLabel")}
          </Label>
          <Input
            id="businessName"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            placeholder={t("businessProfile.businessNamePlaceholder")}
            className="mt-2"
            maxLength={100}
          />
          <p className="text-xs text-muted-foreground mt-1.5">{t("businessProfile.businessNameHint")}</p>
        </div>

        <div>
          <Label htmlFor="username" className="text-sm font-semibold text-foreground">
            {t("businessProfile.usernameLabel")}
          </Label>
          <div className="relative mt-2">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">@</span>
            <Input
              id="username"
              value={username}
              onChange={(e) => handleUsernameChange(e.target.value)}
              placeholder={t("businessProfile.usernamePlaceholder")}
              className="pl-8"
              maxLength={30}
            />
          </div>
          <div className="flex justify-between items-center gap-3 mt-1.5">
            <p className="text-xs text-muted-foreground">{t("businessProfile.usernameHint")}</p>
            {usernameIndicator}
          </div>
        </div>

        <div>
          <Label htmlFor="category" className="text-sm font-semibold text-foreground">
            {t("businessProfile.categoryLabel")}
          </Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="mt-2">
              <SelectValue placeholder={t("businessProfile.categoryPlaceholder")} />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(
                t.raw("businessProfile.categories") as Record<string, string>,
              ).map(([key, label]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="website" className="text-sm font-semibold text-foreground">
            {t("businessProfile.websiteLabel")}
          </Label>
          <div className="mt-2 flex items-center border rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-ring">
            <div className="px-3 flex items-center bg-secondary border-r h-11">
              <Globe className="size-4 text-muted-foreground" />
            </div>
            <input
              id="website"
              type="url"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder={t("businessProfile.websitePlaceholder")}
              className="flex-1 h-11 px-3 text-sm bg-background focus:outline-none"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="location" className="text-sm font-semibold text-foreground">
            {t("businessProfile.locationLabel")}
          </Label>
          <div className="mt-2 flex items-center border rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-ring">
            <div className="px-3 flex items-center bg-secondary border-r h-11">
              <MapPin className="size-4 text-muted-foreground" />
            </div>
            <input
              id="location"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder={t("businessProfile.locationPlaceholder")}
              className="flex-1 h-11 px-3 text-sm bg-background focus:outline-none"
            />
          </div>
        </div>
      </div>
    </OnboardingShell>
  )
}
