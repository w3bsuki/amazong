"use client"

import { useEffect, useState, useTransition } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "@/i18n/routing"
import { LoaderCircle as SpinnerGap } from "lucide-react";
import { useTranslations } from "next-intl"

import { AnimatePresence, MotionConfig } from "framer-motion"
import { cn } from "@/lib/utils"
import { type AvatarVariant } from "@/lib/avatar-palettes"
import { Button } from "@/components/ui/button"
import { WelcomeAvatarStep } from "./welcome-avatar-step"
import { WelcomeCompleteStep } from "./welcome-complete-step"
import { WelcomeIntroStep } from "./welcome-intro-step"
import { WelcomeProfileStep } from "./welcome-profile-step"

interface UserProfile {
  id: string
  username: string | null
  display_name: string | null
  avatar_url: string | null
  bio: string | null
}

const MAX_AVATAR_SIZE_BYTES = 5 * 1024 * 1024

export function WelcomeClient({ locale }: { locale: string }) {
  const tAuth = useTranslations("Auth")
  const tOnboarding = useTranslations("Onboarding")
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isPending, startTransition] = useTransition()
  const [loadError, setLoadError] = useState(false)
  const [actionError, setActionError] = useState<"somethingWentWrong" | null>(null)

  const [step, setStep] = useState(1)
  const [selectedVariant, setSelectedVariant] = useState<AvatarVariant>("marble")
  const [selectedPalette, setSelectedPalette] = useState(0)
  const [displayName, setDisplayName] = useState("")
  const [bio, setBio] = useState("")
  const [useCustomAvatar, setUseCustomAvatar] = useState(false)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)

  useEffect(() => {
    let isActive = true

    const fetchProfile = async () => {
      try {
        const supabase = createClient()
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser()

        if (userError || !user) {
          router.push("/auth/login")
          return
        }

        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("id, username, display_name, avatar_url, bio")
          .eq("id", user.id)
          .single()

        if (profileError || !profileData) {
          if (isActive) {
            setLoadError(true)
          }
          return
        }

        if (!isActive) return

        setUserId(user.id)
        setProfile(profileData)
        setDisplayName(profileData.display_name || "")
        setBio(profileData.bio || "")
      } catch {
        if (isActive) {
          setLoadError(true)
        }
      } finally {
        if (isActive) {
          setIsLoading(false)
        }
      }
    }

    void fetchProfile()

    return () => {
      isActive = false
    }
  }, [router, locale])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (!file.type.startsWith("image/") || file.size > MAX_AVATAR_SIZE_BYTES) {
        setActionError("somethingWentWrong")
        return
      }

      setActionError(null)
      setAvatarFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
      setUseCustomAvatar(true)
    }
  }

  const handleSaveAndContinue = async () => {
    if (!userId) return

    setActionError(null)

    startTransition(async () => {
      try {
        const supabase = createClient()
        let avatarUrl = profile?.avatar_url ?? null

        if (useCustomAvatar && avatarFile) {
          if (!avatarFile.type.startsWith("image/") || avatarFile.size > MAX_AVATAR_SIZE_BYTES) {
            setActionError("somethingWentWrong")
            return
          }

          const fileExt = avatarFile.name.split(".").pop()
          const fileName = `${userId}-${Date.now()}.${fileExt}`
          const filePath = `${userId}/${fileName}`

          const { error: uploadError, data } = await supabase.storage
            .from("avatars")
            .upload(filePath, avatarFile, { upsert: true })

          if (uploadError || !data) {
            setActionError("somethingWentWrong")
            return
          }

          const {
            data: { publicUrl },
          } = supabase.storage.from("avatars").getPublicUrl(filePath)
          avatarUrl = publicUrl
        } else if (!useCustomAvatar) {
          avatarUrl = `boring-avatar:${selectedVariant}:${selectedPalette}:${profile?.username || userId}`
        }

        const updatePayload =
          step === 3
            ? {
                display_name: displayName.trim() || profile?.display_name || null,
                bio: bio.trim() || null,
                avatar_url: avatarUrl,
                onboarding_completed: true,
              }
            : {
                avatar_url: avatarUrl,
              }

        const { data: updatedProfile, error: updateError } = await supabase
          .from("profiles")
          .update(updatePayload)
          .eq("id", userId)
          .select("id, username, display_name, avatar_url, bio")
          .single()

        if (updateError) {
          setActionError("somethingWentWrong")
          return
        }

        setProfile(updatedProfile)
        setDisplayName(updatedProfile.display_name || "")
        setBio(updatedProfile.bio || "")

        if (step === 2) {
          setStep(3)
        } else if (step === 3) {
          setStep(4)
        }
      } catch {
        setActionError("somethingWentWrong")
      }
    })
  }

  const handleSkip = async () => {
    if (!userId) return

    setActionError(null)

    startTransition(async () => {
      try {
        const supabase = createClient()
        // Note: onboarding_completed may be added to database schema later
        const { error } = await supabase
          .from("profiles")
          .update({ onboarding_completed: true } as Record<string, unknown>)
          .eq("id", userId)

        if (error) {
          setActionError("somethingWentWrong")
          return
        }

        router.push("/")
      } catch {
        setActionError("somethingWentWrong")
      }
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-dvh flex items-center justify-center">
        <SpinnerGap className="size-8 text-primary animate-spin motion-reduce:animate-none" />
      </div>
    )
  }

  if (loadError) {
    return (
      <div className="min-h-dvh flex items-center justify-center p-4">
        <div className="w-full max-w-sm rounded-xl border border-destructive bg-destructive-subtle p-4 text-center space-y-3">
          <p className="text-sm text-destructive">{tAuth("somethingWentWrong")}</p>
          <Button type="button" size="sm" variant="outline" onClick={() => router.refresh()}>
            {tOnboarding("common.tryAgain")}
          </Button>
        </div>
      </div>
    )
  }

  const name = profile?.display_name || profile?.username || "treido"

  return (
    <div className="min-h-dvh flex items-center justify-center p-4 py-8">
      <div className="w-full max-w-lg">
        {actionError ? (
          <div className="mb-4 rounded-xl border border-destructive bg-destructive-subtle p-3 text-sm text-destructive">
            {tAuth(actionError as never)}
          </div>
        ) : null}

        <div className="flex items-center justify-center gap-2 mb-6">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                s === step ? "w-8 bg-primary" : s < step ? "w-8 bg-selected" : "w-2 bg-muted"
              )}
            />
          ))}
        </div>

        <MotionConfig reducedMotion="user">
          <AnimatePresence mode="wait">
            {(() => {
              switch (step) {
                case 1:
                  return <WelcomeIntroStep name={name} isPending={isPending} onStart={() => setStep(2)} onSkip={handleSkip} />

                case 2:
                  return (
                    <WelcomeAvatarStep
                      profileUsername={profile?.username}
                      useCustomAvatar={useCustomAvatar}
                      avatarPreview={avatarPreview}
                      selectedVariant={selectedVariant}
                      selectedPalette={selectedPalette}
                      isPending={isPending}
                      onBack={() => setStep(1)}
                      onContinue={handleSaveAndContinue}
                      onFileChange={handleFileChange}
                      onSelectVariant={(variant) => {
                        setSelectedVariant(variant)
                        setUseCustomAvatar(false)
                      }}
                      onSelectPalette={(idx) => setSelectedPalette(idx)}
                    />
                  )

                case 3:
                  return (
                    <WelcomeProfileStep
                      profileUsername={profile?.username}
                      useCustomAvatar={useCustomAvatar}
                      avatarPreview={avatarPreview}
                      selectedVariant={selectedVariant}
                      selectedPalette={selectedPalette}
                      displayName={displayName}
                      bio={bio}
                      isPending={isPending}
                      onBack={() => setStep(2)}
                      onContinue={handleSaveAndContinue}
                      onDisplayNameChange={(value) => setDisplayName(value)}
                      onBioChange={(value) => setBio(value)}
                    />
                  )

                case 4:
                  return <WelcomeCompleteStep username={profile?.username} />

                default:
                  return null
              }
            })()}
          </AnimatePresence>
        </MotionConfig>
      </div>
    </div>
  )
}
