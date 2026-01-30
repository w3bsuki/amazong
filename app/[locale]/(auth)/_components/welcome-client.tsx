"use client"

import { Link, useRouter } from "@/i18n/routing"
import Image from "next/image"
import { useEffect, useState, useTransition } from "react"
import { createClient } from "@/lib/supabase/client"
import {
  Confetti,
  ShoppingBag,
  Storefront,
  UserCircle,
  ArrowRight,
  ArrowLeft,
  SpinnerGap,
  CheckCircle,
  Camera,
  Image as ImageIcon,
  Check,
  Sparkle,
} from "@phosphor-icons/react"
import { motion, AnimatePresence } from "framer-motion"
import Avatar from "boring-avatars"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { AVATAR_VARIANTS, type AvatarVariant, COLOR_PALETTES } from "@/lib/avatar-palettes"

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
  const [selectedVariant, setSelectedVariant] = useState<AvatarVariant>("beam")
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
        <SpinnerGap className="size-8 text-primary animate-spin" weight="bold" />
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
          {step === 1 && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-card rounded-md border border-border shadow-sm overflow-hidden"
            >
              <div className="relative bg-primary px-6 py-10 text-center text-primary-foreground overflow-hidden">
                <div className="absolute inset-0 overflow-hidden">
                  <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary-foreground/10 rounded-full" />
                  <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-primary-foreground/10 rounded-full" />
                  <Confetti className="absolute top-4 right-4 size-8 text-primary-foreground/80 opacity-80" weight="fill" />
                  <Confetti className="absolute bottom-4 left-4 size-6 text-primary-foreground/80 opacity-80" weight="fill" />
                </div>

                <div className="relative">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="size-20 bg-primary-foreground/20 rounded-full flex items-center justify-center mx-auto mb-4"
                  >
                    <CheckCircle className="size-12 text-primary-foreground" weight="fill" />
                  </motion.div>
                  <motion.h1
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-2xl font-bold mb-2"
                  >
                    Welcome, {name}! 🎉
                  </motion.h1>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-primary-foreground/80"
                  >
                    Your email has been verified
                  </motion.p>
                </div>
              </div>

              <div className="p-6">
                <h2 className="text-lg font-semibold text-foreground mb-2 text-center">Let&apos;s set up your profile</h2>
                <p className="text-sm text-muted-foreground text-center mb-6">
                  This will only take a minute. Choose an avatar and tell us about yourself!
                </p>

                <div className="space-y-3">
                  <Button
                    onClick={() => setStep(2)}
                    className="w-full h-12 bg-primary text-primary-foreground hover:bg-interactive-hover"
                  >
                    <Sparkle className="size-5 mr-2" weight="fill" />
                    Get Started
                  </Button>
                  <button
                    onClick={handleSkip}
                    disabled={isPending}
                    className="w-full text-sm text-muted-foreground hover:text-foreground py-2"
                  >
                    {isPending ? "..." : "Skip for now"}
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="avatar"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-card rounded-md border border-border shadow-sm overflow-hidden"
            >
              <div className="p-4 border-b border-border">
                <button
                  onClick={() => setStep(1)}
                  className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4"
                >
                  <ArrowLeft className="size-4" />
                  Back
                </button>
                <h2 className="text-xl font-semibold text-foreground">Choose your avatar</h2>
                <p className="text-sm text-muted-foreground mt-1">Pick a style or upload your own photo</p>
              </div>

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
                        name={profile?.username || "user"}
                        variant={selectedVariant}
                        colors={COLOR_PALETTES[selectedPalette] ?? COLOR_PALETTES[0] ?? []}
                      />
                    )}
                    <label className="absolute bottom-0 right-0 size-8 bg-primary text-primary-foreground hover:bg-interactive-hover rounded-full flex items-center justify-center cursor-pointer shadow-sm transition-colors">
                      <Camera className="size-4 text-primary-foreground" weight="bold" />
                      <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                    </label>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-foreground mb-3">Or choose a style</h3>
                  <div className="grid grid-cols-6 gap-2">
                    {AVATAR_VARIANTS.map((variant) => (
                      <button
                        key={variant}
                        onClick={() => {
                          setSelectedVariant(variant)
                          setUseCustomAvatar(false)
                        }}
                        className={cn(
                          "p-2 rounded-md border-2 transition-colors",
                          !useCustomAvatar && selectedVariant === variant
                            ? "border-primary bg-muted"
                            : "border-border hover:border-border/80"
                        )}
                      >
                        <Avatar
                          size={40}
                          name={profile?.username || "user"}
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
                          onClick={() => setSelectedPalette(idx)}
                          className={cn(
                            "p-1.5 rounded-lg border-2 transition-all",
                            selectedPalette === idx ? "border-primary" : "border-border hover:border-border/80"
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
                      <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                    </label>
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                    Back
                  </Button>
                  <Button
                    onClick={handleSaveAndContinue}
                    disabled={isPending}
                    className="flex-1 bg-primary text-primary-foreground hover:bg-interactive-hover"
                  >
                    {isPending ? (
                      <SpinnerGap className="size-4 animate-spin" />
                    ) : (
                      <>
                        Continue <ArrowRight className="size-4 ml-2" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-card rounded-md border border-border shadow-sm overflow-hidden"
            >
              <div className="p-4 border-b border-border">
                <button
                  onClick={() => setStep(2)}
                  className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4"
                >
                  <ArrowLeft className="size-4" />Back
                </button>
                <h2 className="text-xl font-semibold text-foreground">Tell us about yourself</h2>
                <p className="text-sm text-muted-foreground mt-1">This helps other users know who you are</p>
              </div>

              <div className="p-4 space-y-4">
                <div className="flex justify-center mb-2">
                  {useCustomAvatar && avatarPreview ? (
                    <Image src={avatarPreview} alt="Avatar" width={64} height={64} className="size-16 rounded-full object-cover" />
                  ) : (
                    <Avatar
                      size={64}
                      name={profile?.username || "user"}
                      variant={selectedVariant}
                      colors={COLOR_PALETTES[selectedPalette] ?? COLOR_PALETTES[0] ?? []}
                    />
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Display Name</label>
                  <Input
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder={profile?.username || "Your name"}
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
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell others a bit about yourself..."
                    rows={3}
                    className="resize-none"
                    maxLength={200}
                  />
                  <p className="text-xs text-muted-foreground mt-1 text-right">{bio.length}/200</p>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button variant="outline" onClick={() => setStep(2)} className="flex-1">
                    Back
                  </Button>
                  <Button
                    onClick={handleSaveAndContinue}
                    disabled={isPending}
                    className="flex-1 bg-primary text-primary-foreground hover:bg-interactive-hover"
                  >
                    {isPending ? (
                      <SpinnerGap className="size-4 animate-spin" />
                    ) : (
                      <>
                        Save & Continue <ArrowRight className="size-4 ml-2" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="complete"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-card rounded-md border border-border shadow-sm overflow-hidden"
            >
              <div className="p-4 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                  className="size-20 bg-selected rounded-full flex items-center justify-center mx-auto mb-4"
                >
                  <Check className="size-10 text-primary" weight="bold" />
                </motion.div>

                <h2 className="text-xl font-semibold text-foreground mb-2">You&apos;re all set! 🎉</h2>
                <p className="text-muted-foreground mb-6">Your profile is ready. What would you like to do next?</p>

                <div className="space-y-3 text-left">
                  <Link href="/" className="block">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex items-center gap-4 p-4 bg-surface-subtle hover:bg-hover active:bg-active rounded-md border border-border transition-colors group"
                    >
                      <div className="size-12 bg-selected rounded-md flex items-center justify-center shrink-0">
                        <ShoppingBag className="size-6 text-primary" weight="duotone" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-foreground">Browse Products</h3>
                        <p className="text-sm text-muted-foreground">Discover amazing deals</p>
                      </div>
                      <ArrowRight className="size-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                    </motion.div>
                  </Link>

                  <Link href="/sell" className="block">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex items-center gap-4 p-4 bg-surface-subtle hover:bg-hover active:bg-active rounded-md border border-border transition-colors group"
                    >
                      <div className="size-12 bg-primary rounded-md flex items-center justify-center shrink-0">
                        <Storefront className="size-6 text-primary-foreground" weight="fill" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-foreground">Start Selling</h3>
                        <p className="text-sm text-muted-foreground">List your first product</p>
                      </div>
                      <ArrowRight className="size-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                    </motion.div>
                  </Link>

                  <Link href={`/${profile?.username}`} className="block">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex items-center gap-4 p-4 bg-surface-subtle hover:bg-hover active:bg-active rounded-md border border-border transition-colors group"
                    >
                      <div className="size-12 bg-selected rounded-md flex items-center justify-center shrink-0">
                        <UserCircle className="size-6 text-primary" weight="duotone" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-foreground">View Your Profile</h3>
                        <p className="text-sm text-muted-foreground">/{profile?.username}</p>
                      </div>
                      <ArrowRight className="size-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                    </motion.div>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
