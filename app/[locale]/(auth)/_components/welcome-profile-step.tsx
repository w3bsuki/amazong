"use client"

import Avatar from "boring-avatars"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { COLOR_PALETTES, type AvatarVariant } from "@/lib/avatar-palettes"
import { ArrowRight, LoaderCircle as SpinnerGap } from "lucide-react"
import { motion } from "framer-motion"
import { StepHeader } from "./welcome-step-header"

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
        title="Tell us about yourself"
        description="This helps other users know who you are"
      />

      <div className="p-4 space-y-4">
        <div className="flex justify-center mb-2">
          {useCustomAvatar && avatarPreview ? (
            <Image
              src={avatarPreview}
              alt="Avatar"
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
          <label className="block text-sm font-medium text-foreground mb-1.5">Display Name</label>
          <Input
            value={displayName}
            onChange={(e) => onDisplayNameChange(e.target.value)}
            placeholder={profileUsername || "Your name"}
            className="h-11"
          />
          <p className="text-xs text-muted-foreground mt-1">This is how other users will see you</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">
            Bio <span className="text-muted-foreground font-normal">(optional)</span>
          </label>
          <Textarea
            value={bio}
            onChange={(e) => onBioChange(e.target.value)}
            placeholder="Tell others a bit about yourself..."
            rows={3}
            className="resize-none"
            maxLength={200}
          />
          <p className="text-xs text-muted-foreground mt-1 text-right">{bio.length}/200</p>
        </div>

        <div className="flex gap-3 pt-4">
          <Button variant="outline" onClick={onBack} className="flex-1">
            Back
          </Button>
          <Button
            onClick={onContinue}
            disabled={isPending}
            className="flex-1 bg-primary text-primary-foreground hover:bg-interactive-hover"
          >
            {isPending ? (
              <SpinnerGap className="size-4 animate-spin motion-reduce:animate-none" />
            ) : (
              <>
                Save & Continue <ArrowRight className="size-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </div>
    </motion.div>
  )
}
