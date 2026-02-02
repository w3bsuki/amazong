"use client"

import { useState, useEffect, useTransition } from "react"
import { useRouter, useSearchParams, redirect } from "next/navigation"
import { useLocale } from "next-intl"
import { ArrowRight, ArrowLeft, Camera, SpinnerGap, Check, X } from "@phosphor-icons/react"
import Image from "next/image"
import Avatar from "boring-avatars"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { AVATAR_VARIANTS, type AvatarVariant, getColorPalette } from "@/lib/avatar-palettes"
import { createClient } from "@/lib/supabase/client"

const translations = {
  en: {
    title: "Set up your profile",
    subtitle: "Help others get to know you",
    step: "Step 2 of 4",
    usernameLabel: "Username",
    usernamePlaceholder: "your_username",
    usernameHint: "This is your unique identity on Treido. You can change it once.",
    displayNameLabel: "Display Name",
    displayNamePlaceholder: "Your display name",
    displayNameHint: "This is how others will see you",
    profileImageLabel: "Profile Picture",
    profileImageHint: "Click to upload or choose a style",
    continue: "Continue",
    back: "Back",
    skip: "Skip for now",
    checking: "Checking...",
    available: "Available",
    unavailable: "Unavailable",
  },
  bg: {
    title: "Настройте профила си",
    subtitle: "Помогнете на другите да ви опознаят",
    step: "Стъпка 2 от 4",
    usernameLabel: "Потребителско име",
    usernamePlaceholder: "вашето_име",
    usernameHint: "Това е вашата уникална идентичност в Treido. Можете да го промените веднъж.",
    displayNameLabel: "Показвано име",
    displayNamePlaceholder: "Вашето показвано име",
    displayNameHint: "Така другите ще ви виждат",
    profileImageLabel: "Профилна снимка",
    profileImageHint: "Кликнете за качване или изберете стил",
    continue: "Продължи",
    back: "Назад",
    skip: "Пропусни за сега",
    checking: "Проверка...",
    available: "Свободно",
    unavailable: "Заето",
  },
}

export default function ProfilePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const locale = useLocale()
  const t = translations[locale as keyof typeof translations] || translations.en

  const accountType = searchParams.get("type") || "personal"
  const [isPending, startTransition] = useTransition()

  // Redirect business users to business-profile page
  useEffect(() => {
    if (accountType === "business") {
      router.replace(`/${locale}/onboarding/business-profile`)
    }
  }, [accountType, locale, router])

  // Form state
  const [username, setUsername] = useState("")
  const [displayName, setDisplayName] = useState("")
  const [isCheckingUsername, setIsCheckingUsername] = useState(false)
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null)

  // Avatar state
  const [avatarVariant, setAvatarVariant] = useState<AvatarVariant>("beam")
  const [avatarPalette, setAvatarPalette] = useState(0)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [useCustomAvatar, setUseCustomAvatar] = useState(false)

  // Username availability check
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

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setAvatarFile(file)
      const reader = new FileReader()
      reader.onloadend = () => setAvatarPreview(reader.result as string)
      reader.readAsDataURL(file)
      setUseCustomAvatar(true)
    }
  }

  const handleContinue = () => {
    // Store profile data in session storage for later steps
    try {
      sessionStorage.setItem("onboarding_profile", JSON.stringify({
        username: username.trim().toLowerCase(),
        displayName: displayName.trim(),
        accountType,
        avatarType: useCustomAvatar ? "custom" : "generated",
        avatarVariant: !useCustomAvatar ? avatarVariant : undefined,
        avatarPalette: !useCustomAvatar ? avatarPalette : undefined,
      }))
    } catch {
      // Ignore storage access errors
    }
    
    // Navigate to interests page
    router.push(`/${locale}/onboarding/interests?type=${accountType}`)
  }

  const handleBack = () => {
    router.push(`/${locale}/onboarding/account-type`)
  }

  const canContinue = 
    username.trim().length >= 3 && 
    usernameAvailable === true

  // Username indicator
  const usernameIndicator = (() => {
    if (!username || username.trim().length < 3) return null
    if (isCheckingUsername) {
      return (
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <SpinnerGap className="size-4 animate-spin" weight="bold" />
          {t.checking}
        </span>
      )
    }
    if (usernameAvailable === true) {
      return (
        <span className="flex items-center gap-1.5 text-xs text-success">
          <Check className="size-4" weight="bold" />
          {t.available}
        </span>
      )
    }
    if (usernameAvailable === false) {
      return (
        <span className="flex items-center gap-1.5 text-xs text-destructive">
          <X className="size-4" />
          {t.unavailable}
        </span>
      )
    }
    return null
  })()

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <button
        onClick={handleBack}
        className="flex items-center gap-1.5 text-sm text-link hover:text-link-hover font-medium transition-colors"
      >
        <ArrowLeft className="size-4" weight="bold" />
        {t.back}
      </button>

      {/* Progress Indicator */}
      <div className="flex items-center justify-center gap-1.5">
        {[1, 2, 3, 4].map((step) => (
          <div
            key={step}
            className={cn(
              "h-2 rounded-full transition-all duration-300",
              step <= 2 ? "bg-primary w-6" : "bg-muted w-2"
            )}
          />
        ))}
      </div>

      {/* Header */}
      <div className="text-center space-y-2">
        <p className="text-xs text-muted-foreground font-medium">{t.step}</p>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
          {t.title}
        </h1>
        <p className="text-muted-foreground">{t.subtitle}</p>
      </div>

      {/* Avatar Selection */}
      <div>
        <Label className="text-sm font-semibold mb-2 block text-foreground">{t.profileImageLabel}</Label>
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="size-16 rounded-xl overflow-hidden border-2 border-selected-border shadow-sm">
              {useCustomAvatar && avatarPreview ? (
                <Image
                  src={avatarPreview}
                  alt="Avatar"
                  width={64}
                  height={64}
                  className="object-cover w-full h-full"
                />
              ) : (
                <Avatar
                  size={64}
                  name={username || "user"}
                  variant={avatarVariant}
                  colors={getColorPalette(avatarPalette)}
                  square
                />
              )}
            </div>
            <label className="absolute -bottom-1 -right-1 size-7 bg-primary text-primary-foreground rounded-full flex items-center justify-center cursor-pointer hover:bg-interactive-hover transition-colors shadow-sm">
              <Camera className="size-3.5" weight="bold" />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
            </label>
          </div>
          <div className="flex-1">
            <div className="flex gap-1.5 mb-2">
              {AVATAR_VARIANTS.slice(0, 4).map((variant) => (
                <button
                  key={variant}
                  type="button"
                  onClick={() => {
                    setAvatarVariant(variant)
                    setUseCustomAvatar(false)
                  }}
                  className={cn(
                    "size-11 rounded-lg border-2 overflow-hidden transition-all",
                    !useCustomAvatar && avatarVariant === variant
                      ? "border-primary shadow-sm ring-2 ring-focus-ring"
                      : "border-input hover:border-hover-border"
                  )}
                >
                  <Avatar
                    size={44}
                    name={username || "user"}
                    variant={variant}
                    colors={getColorPalette(avatarPalette)}
                    square
                  />
                </button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">{t.profileImageHint}</p>
          </div>
        </div>
      </div>

      {/* Username Input */}
      <div>
        <Label htmlFor="username" className="text-sm font-semibold text-foreground">
          {t.usernameLabel}
        </Label>
        <div className="relative mt-2">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">@</span>
          <Input
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))}
            placeholder={t.usernamePlaceholder}
            className="pl-8"
            maxLength={30}
          />
        </div>
        <div className="flex justify-between items-center mt-1.5">
          <p className="text-xs text-muted-foreground">{t.usernameHint}</p>
          {usernameIndicator}
        </div>
      </div>

      {/* Display Name Input */}
      <div>
        <Label htmlFor="displayName" className="text-sm font-semibold text-foreground">
          {t.displayNameLabel}
        </Label>
        <Input
          id="displayName"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder={t.displayNamePlaceholder}
          className="mt-2"
          maxLength={50}
        />
        <p className="text-xs text-muted-foreground mt-1.5">{t.displayNameHint}</p>
      </div>

      {/* Actions */}
      <div className="space-y-3">
        <Button
          onClick={handleContinue}
          disabled={!canContinue || isPending}
          className="w-full h-12 text-base font-semibold"
        >
          {isPending ? (
            <>
              <SpinnerGap className="size-5 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              {t.continue}
              <ArrowRight className="size-5 ml-2" weight="bold" />
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
