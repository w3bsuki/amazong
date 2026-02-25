"use client"

import Avatar from "boring-avatars"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { COLOR_PALETTES, type AvatarVariant } from "@/lib/avatar-palettes"
import { motion } from "framer-motion"
import { useTranslations } from "next-intl"
import { StepHeader } from "./welcome-step-header"
import { WelcomeStepActions } from "./_lib/welcome-step-wrapper"

export function WelcomeProfileStep({
  profileUsername,
  useCustomAvatar,
  avatarPreview,
  selectedVariant,
  selectedPalette,
  displayName,
  bio,
  isPending,
  onBack,
  onContinue,
  onDisplayNameChange,
  onBioChange,
}: {
  profileUsername: string | null | undefined
  useCustomAvatar: boolean
  avatarPreview: string | null
  selectedVariant: AvatarVariant
  selectedPalette: number
  displayName: string
  bio: string
  isPending: boolean
  onBack: () => void
  onContinue: () => void
  onDisplayNameChange: (value: string) => void
  onBioChange: (value: string) => void
}) {
  const tOnboarding = useTranslations("Onboarding")
  const tSell = useTranslations("Sell")

  return (
    <motion.div
      key="profile"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="bg-card rounded-xl border border-border overflow-hidden"
    >
      <StepHeader
        onBack={onBack}
        title={tOnboarding("profile.title")}
        description={tOnboarding("profile.subtitle")}
      />

      <div className="p-4 space-y-4">
        <div className="flex justify-center mb-2">
          {useCustomAvatar && avatarPreview ? (
            <Image
              src={avatarPreview}
              alt={tOnboarding("profile.profileImageLabel")}
              width={64}
              height={64}
              className="size-16 rounded-full object-cover"
            />
          ) : (
            <Avatar
              size={64}
              name={profileUsername || "user"}
              variant={selectedVariant}
              colors={COLOR_PALETTES[selectedPalette] ?? COLOR_PALETTES[0] ?? []}
            />
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">{tOnboarding("profile.displayNameLabel")}</label>
          <Input
            value={displayName}
            onChange={(e) => onDisplayNameChange(e.target.value)}
            placeholder={profileUsername || tOnboarding("profile.displayNamePlaceholder")}
            className="h-11"
          />
          <p className="text-xs text-muted-foreground mt-1">{tOnboarding("profile.displayNameHint")}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">
            {tSell("sellerOnboardingWizard.bioLabel")}
          </label>
          <Textarea
            value={bio}
            onChange={(e) => onBioChange(e.target.value)}
            placeholder={tSell("sellerOnboardingWizard.bioPlaceholder")}
            rows={3}
            className="resize-none"
            maxLength={200}
          />
          <p className="text-xs text-muted-foreground mt-1 text-right">
            {bio.length}/200 · {tSell("sellerOnboardingWizard.bioHint")}
          </p>
        </div>

        <WelcomeStepActions
          backLabel={tOnboarding("common.back")}
          continueLabel={tOnboarding("common.continue")}
          isPending={isPending}
          onBack={onBack}
          onContinue={onContinue}
        />
      </div>
    </motion.div>
  )
}
