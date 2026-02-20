"use client"

import Avatar from "boring-avatars"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { AVATAR_VARIANTS, COLOR_PALETTES, type AvatarVariant } from "@/lib/avatar-palettes"
import { ArrowRight, Camera, Image as ImageIcon, LoaderCircle as SpinnerGap } from "lucide-react"
import { motion } from "framer-motion"
import { StepHeader } from "./welcome-step-header"

export function WelcomeAvatarStep({
  profileUsername,
  useCustomAvatar,
  avatarPreview,
  selectedVariant,
  selectedPalette,
  isPending,
  onBack,
  onContinue,
  onFileChange,
  onSelectVariant,
  onSelectPalette,
}: {
  profileUsername: string | null | undefined
  useCustomAvatar: boolean
  avatarPreview: string | null
  selectedVariant: AvatarVariant
  selectedPalette: number
  isPending: boolean
  onBack: () => void
  onContinue: () => void
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onSelectVariant: (variant: AvatarVariant) => void
  onSelectPalette: (idx: number) => void
}) {
  return (
    <motion.div
      key="avatar"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="bg-card rounded-xl border border-border overflow-hidden"
    >
      <StepHeader onBack={onBack} title="Choose your avatar" description="Pick a style or upload your own photo" />

      <div className="p-4 space-y-4">
        <div className="flex justify-center">
          <div className="relative">
            {useCustomAvatar && avatarPreview ? (
              <Image
                src={avatarPreview}
                alt="Avatar preview"
                width={96}
                height={96}
                className="size-24 rounded-full object-cover border-4 border-selected-border"
              />
            ) : (
              <Avatar
                size={96}
                name={profileUsername || "user"}
                variant={selectedVariant}
                colors={COLOR_PALETTES[selectedPalette] ?? COLOR_PALETTES[0] ?? []}
              />
            )}
            <label
              className="absolute bottom-0 right-0 size-8 bg-primary text-primary-foreground hover:bg-interactive-hover rounded-full flex items-center justify-center cursor-pointer shadow-sm transition-colors"
              aria-label="Upload avatar image"
            >
              <Camera className="size-4 text-primary-foreground" />
              <input type="file" accept="image/*" className="hidden" onChange={onFileChange} />
            </label>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-foreground mb-3">Or choose a style</h3>
          <div className="grid grid-cols-6 gap-2">
            {AVATAR_VARIANTS.map((variant) => (
              <button
                key={variant}
                type="button"
                onClick={() => onSelectVariant(variant)}
                className={cn(
                  "p-2 rounded-xl border-2 transition-colors",
                  !useCustomAvatar && selectedVariant === variant
                    ? "border-primary bg-muted"
                    : "border-border hover:border-border-subtle"
                )}
              >
                <Avatar
                  size={40}
                  name={profileUsername || "user"}
                  variant={variant}
                  colors={COLOR_PALETTES[selectedPalette] ?? COLOR_PALETTES[0] ?? []}
                />
              </button>
            ))}
          </div>
        </div>

        {!useCustomAvatar && (
          <div>
            <h3 className="text-sm font-medium text-foreground mb-3">Color palette</h3>
            <div className="grid grid-cols-6 gap-2">
              {COLOR_PALETTES.map((palette, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => onSelectPalette(idx)}
                  className={cn(
                    "p-1.5 rounded-lg border-2 transition-all",
                    selectedPalette === idx ? "border-primary" : "border-border hover:border-border-subtle"
                  )}
                >
                  <div className="flex gap-0.5">
                    {palette.slice(0, 5).map((color, i) => (
                      <div key={i} className="w-2 h-6 rounded-sm" style={{ backgroundColor: color }} />
                    ))}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {!useCustomAvatar && (
          <div className="text-center">
            <label className="inline-flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground hover:text-foreground cursor-pointer rounded-lg hover:bg-muted transition-colors">
              <ImageIcon className="size-4" />
              Upload your own photo
              <input type="file" accept="image/*" className="hidden" onChange={onFileChange} />
            </label>
          </div>
        )}

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
                Continue <ArrowRight className="size-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </div>
    </motion.div>
  )
}
