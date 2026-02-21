"use client"

import { useEffect, useState, useTransition } from "react"
import { useSearchParams } from "next/navigation"
import { useRouter } from "@/i18n/routing"
import { useLocale, useTranslations } from "next-intl"
import { ArrowRight, Check, LoaderCircle as SpinnerGap, X } from "lucide-react";
import Avatar from "boring-avatars"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { OnboardingShell } from "../_components/onboarding-shell"
import { AvatarUpload } from "../_components/avatar-upload"
import { cn } from "@/lib/utils"
import { AVATAR_VARIANTS, type AvatarVariant, getColorPalette } from "@/lib/avatar-palettes"
import { useUsernameAvailability } from "@/hooks/use-username-availability"

export default function ProfilePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const locale = useLocale()
  const t = useTranslations("Onboarding")

  const accountType = searchParams.get("type") || "personal"
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    if (accountType === "business") {
      router.replace(`/onboarding/business-profile`)
    }
  }, [accountType, locale, router])

  const [username, setUsername] = useState("")
  const [displayName, setDisplayName] = useState("")

  const { isCheckingUsername, usernameAvailable } = useUsernameAvailability(username)

  const [avatarVariant, setAvatarVariant] = useState<AvatarVariant>("marble")
  const [avatarPalette] = useState(0)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [useCustomAvatar, setUseCustomAvatar] = useState(false)

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
      router.push(`/onboarding/interests?type=${accountType}`)
    })
  }

  const handleBack = () => {
    router.push(`/onboarding/account-type`)
  }

  const canContinue = username.trim().length >= 3 && usernameAvailable === true

  const usernameIndicator = (() => {
    if (!username || username.trim().length < 3) return null

    if (isCheckingUsername) {
      return (
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <SpinnerGap className="size-4 animate-spin motion-reduce:animate-none" />
          {t("profile.checking")}
        </span>
      )
    }

    if (usernameAvailable === true) {
      return (
        <span className="flex items-center gap-1.5 text-xs text-success">
          <Check className="size-4" />
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
      stepProgress={{ current: 2, total: 4 }}
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
          <Label className="text-sm font-semibold mb-2 block text-foreground">
            {t("profile.profileImageLabel")}
          </Label>
          <div className="flex items-center gap-4">
            <AvatarUpload
              previewSrc={useCustomAvatar ? avatarPreview : null}
              previewAlt={t("profile.profileImageLabel")}
              ariaLabel={t("profile.profileImageLabel")}
              onFileChange={handleAvatarChange}
              fallbackName={username || "user"}
              fallbackVariant={avatarVariant}
              fallbackPalette={avatarPalette}
            />

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
                onChange={(e) => setUsername(e.target.value.toLowerCase().replaceAll(/[^a-z0-9_]/g, ""))}
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


