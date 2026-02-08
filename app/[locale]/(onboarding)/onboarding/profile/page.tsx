"use client"

import { useEffect, useState, useTransition } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useLocale, useTranslations } from "next-intl"
import { ArrowRight, Camera, SpinnerGap, Check, X } from "@phosphor-icons/react"
import Image from "next/image"
import Avatar from "boring-avatars"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { OnboardingShell } from "../_components/onboarding-shell"
import { cn } from "@/lib/utils"
import { AVATAR_VARIANTS, type AvatarVariant, getColorPalette } from "@/lib/avatar-palettes"
import { createClient } from "@/lib/supabase/client"

export default function ProfilePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const locale = useLocale()
  const t = useTranslations("Onboarding")

  const accountType = searchParams.get("type") || "personal"
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    if (accountType === "business") {
      router.replace(`/${locale}/onboarding/business-profile`)
    }
  }, [accountType, locale, router])

  const [username, setUsername] = useState("")
  const [displayName, setDisplayName] = useState("")
  const [isCheckingUsername, setIsCheckingUsername] = useState(false)
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null)

  const [avatarVariant, setAvatarVariant] = useState<AvatarVariant>("beam")
  const [avatarPalette] = useState(0)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [useCustomAvatar, setUseCustomAvatar] = useState(false)

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
    if (!file) return
    const reader = new FileReader()
    reader.onloadend = () => setAvatarPreview(reader.result as string)
    reader.readAsDataURL(file)
    setUseCustomAvatar(true)
  }

  const handleContinue = () => {
    try {
      sessionStorage.setItem(
        "onboarding_profile",
        JSON.stringify({
          username: username.trim().toLowerCase(),
          displayName: displayName.trim(),
          accountType,
          avatarType: useCustomAvatar ? "custom" : "generated",
          avatarVariant: !useCustomAvatar ? avatarVariant : undefined,
          avatarPalette: !useCustomAvatar ? avatarPalette : undefined,
        }),
      )
    } catch {
      // Ignore storage access errors
    }

    startTransition(() => {
      router.push(`/${locale}/onboarding/interests?type=${accountType}`)
    })
  }

  const handleBack = () => {
    router.push(`/${locale}/onboarding/account-type`)
  }

  const canContinue = username.trim().length >= 3 && usernameAvailable === true

  const usernameIndicator = (() => {
    if (!username || username.trim().length < 3) return null

    if (isCheckingUsername) {
      return (
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <SpinnerGap className="size-4 animate-spin" />
          {t("profile.checking")}
        </span>
      )
    }

    if (usernameAvailable === true) {
      return (
        <span className="flex items-center gap-1.5 text-xs text-success">
          <Check className="size-4" weight="bold" />
          {t("profile.available")}
        </span>
      )
    }

    if (usernameAvailable === false) {
      return (
        <span className="flex items-center gap-1.5 text-xs text-destructive">
          <X className="size-4" />
          {t("profile.unavailable")}
        </span>
      )
    }

    return null
  })()

  return (
    <OnboardingShell
      title={t("profile.title")}
      subtitle={t("profile.subtitle")}
      stepLabel={t("common.stepLabel", { current: 2, total: 4 })}
      progress={50}
      onBack={handleBack}
      backLabel={t("common.back")}
      footer={
        <Button
          onClick={handleContinue}
          disabled={!canContinue || isPending}
          size="lg"
          className="w-full"
        >
          {isPending ? (
            <>
              <SpinnerGap className="size-5 animate-spin" />
              {t("common.processing")}
            </>
          ) : (
            <>
              {t("common.continue")}
              <ArrowRight className="size-5" weight="bold" />
            </>
          )}
        </Button>
      }
    >
      <div className="space-y-6">
        <div>
          <Label className="text-sm font-semibold mb-2 block text-foreground">
            {t("profile.profileImageLabel")}
          </Label>
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="size-16 rounded-xl overflow-hidden border-2 border-selected-border shadow-sm">
                {useCustomAvatar && avatarPreview ? (
                  <Image
                    src={avatarPreview}
                    alt={t("profile.profileImageLabel")}
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
                <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
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
                        : "border-input hover:border-hover-border",
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
              <p className="text-xs text-muted-foreground">
                {t("profile.profileImageHint")}
              </p>
            </div>
          </div>
        </div>

        <div>
          <Label htmlFor="username" className="text-sm font-semibold text-foreground">
            {t("profile.usernameLabel")}
          </Label>
          <div className="relative mt-2">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">@</span>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))}
              placeholder={t("profile.usernamePlaceholder")}
              className="pl-8"
              maxLength={30}
            />
          </div>
          <div className="flex justify-between items-center gap-3 mt-1.5">
            <p className="text-xs text-muted-foreground">{t("profile.usernameHint")}</p>
            {usernameIndicator}
          </div>
        </div>

        <div>
          <Label htmlFor="displayName" className="text-sm font-semibold text-foreground">
            {t("profile.displayNameLabel")}
          </Label>
          <Input
            id="displayName"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder={t("profile.displayNamePlaceholder")}
            className="mt-2"
            maxLength={50}
          />
          <p className="text-xs text-muted-foreground mt-1.5">
            {t("profile.displayNameHint")}
          </p>
        </div>
      </div>
    </OnboardingShell>
  )
}

