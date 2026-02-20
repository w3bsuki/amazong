"use client"

import { useEffect, useState, useTransition } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "@/i18n/routing"
import { LoaderCircle as SpinnerGap } from "lucide-react";

import { AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { type AvatarVariant } from "@/lib/avatar-palettes"
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

export function WelcomeClient({ locale }: { locale: string }) {
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isPending, startTransition] = useTransition()

  const [step, setStep] = useState(1)
  const [selectedVariant, setSelectedVariant] = useState<AvatarVariant>("marble")
  const [selectedPalette, setSelectedPalette] = useState(0)
  const [displayName, setDisplayName] = useState("")
  const [bio, setBio] = useState("")
  const [useCustomAvatar, setUseCustomAvatar] = useState(false)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)

  useEffect(() => {
    const fetchProfile = async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/auth/login")
        return
      }

      setUserId(user.id)

      const { data: profileData } = await supabase
        .from("profiles")
        .select("id, username, display_name, avatar_url, bio")
        .eq("id", user.id)
        .single()

      if (profileData) {
        setProfile(profileData)
        setDisplayName(profileData.display_name || "")
        setBio(profileData.bio || "")
      }
      setIsLoading(false)
    }

    fetchProfile()
  }, [router, locale])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
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
    if (!userId || !profile?.username) return

    startTransition(async () => {
      const supabase = createClient()
      let avatarUrl = profile?.avatar_url

      if (useCustomAvatar && avatarFile) {
        const fileExt = avatarFile.name.split(".").pop()
        const fileName = `${userId}-${Date.now()}.${fileExt}`
        const filePath = `${userId}/${fileName}`

        const { error: uploadError, data } = await supabase.storage
          .from("avatars")
          .upload(filePath, avatarFile, { upsert: true })

        if (!uploadError && data) {
          const {
            data: { publicUrl },
          } = supabase.storage.from("avatars").getPublicUrl(filePath)
          avatarUrl = publicUrl
        }
      } else if (!useCustomAvatar) {
        avatarUrl = `boring-avatar:${selectedVariant}:${selectedPalette}:${profile.username}`
      }

      await supabase
        .from("profiles")
        .update({
          display_name: displayName || profile?.display_name,
          bio: bio || null,
          avatar_url: avatarUrl,
          onboarding_completed: true,
        })
        .eq("id", userId)

      if (step === 2) {
        setStep(3)
      } else if (step === 3) {
        setStep(4)
      }
    })
  }

  const handleSkip = async () => {
    if (!userId) return

    startTransition(async () => {
      const supabase = createClient()
      // Note: onboarding_completed may be added to database schema later
      await supabase
        .from("profiles")
        .update({ onboarding_completed: true } as Record<string, unknown>)
        .eq("id", userId)
      router.push("/")
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-dvh flex items-center justify-center">
        <SpinnerGap className="size-8 text-primary animate-spin motion-reduce:animate-none" />
      </div>
    )
  }

  const name = profile?.display_name || profile?.username || "there"

  return (
    <div className="min-h-dvh flex items-center justify-center p-4 py-8">
      <div className="w-full max-w-lg">
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
      </div>
    </div>
  )
}
