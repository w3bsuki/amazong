"use client"

import { useEffect, useState, useTransition } from "react"
import { useSearchParams } from "next/navigation"
import { useRouter } from "@/i18n/routing"
import { useLocale, useTranslations } from "next-intl"
import Avatar from "boring-avatars"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { OnboardingShell } from "../_components/onboarding-shell"
import { AvatarUpload } from "../_components/avatar-upload"
import { OnboardingContinueButton } from "../_components/onboarding-continue-button"
import { OnboardingUsernameField } from "../_components/onboarding-username-field"
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

  return (
    <OnboardingShell
      title={t("profile.title")}
      subtitle={t("profile.subtitle")}
      stepLabel={t("common.stepLabel", { current: 2, total: 4 })}
      stepProgress={{ current: 2, total: 4 }}
      onBack={handleBack}
      backLabel={t("common.back")}
      footer={
        <OnboardingContinueButton
          onClick={handleContinue}
          disabled={!canContinue}
          isPending={isPending}
          processingLabel={t("common.processing")}
          continueLabel={t("common.continue")}
        />
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

        <OnboardingUsernameField
          label={t("profile.usernameLabel")}
          placeholder={t("profile.usernamePlaceholder")}
          hint={t("profile.usernameHint")}
          value={username}
          onChange={(value) =>
            setUsername(value.toLowerCase().replaceAll(/[^a-z0-9_]/g, ""))
          }
          checkingLabel={t("profile.checking")}
          availableLabel={t("profile.available")}
          unavailableLabel={t("profile.unavailable")}
          isChecking={isCheckingUsername}
          isAvailable={usernameAvailable}
        />

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


