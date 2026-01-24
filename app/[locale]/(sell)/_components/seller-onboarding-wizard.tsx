"use client"

import { useState, useTransition } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Check,
  ArrowRight,
  SpinnerGap,
  Storefront,
  Sparkle,
} from "@phosphor-icons/react"
import { useLocale } from "next-intl"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

type CompleteSellerOnboardingAction = (args: {
  userId: string
  accountType: "personal" | "business"
  username: string
  displayName: string
  bio: string
  businessName?: string
}) => Promise<{ success: true; error?: undefined } | { error: string; success?: undefined }>

interface SellerOnboardingWizardProps {
  userId: string
  username: string
  displayName?: string | null
  initialBusinessName?: string | null
  initialAccountType: "personal" | "business"  // Required - from profile!
  completeSellerOnboardingAction: CompleteSellerOnboardingAction
  onComplete: () => void
}

const translations = {
  en: {
    // Step 2 (Profile Customization - now first step since account type is already set)
    step2Title: "Customize Your Profile",
    step2Subtitle: "Help buyers get to know you",
    displayNameLabel: "Display Name",
    displayNamePlaceholder: "How should buyers call you?",
    displayNameHint: "This will be shown on your profile and listings",
    businessNameLabel: "Business name",
    businessNamePlaceholder: "Your company / store name",
    businessNameHint: "Shown on your public business profile",
    bioLabel: "Short Bio (optional)",
    bioPlaceholder: "Tell buyers a bit about yourself or what you sell...",
    bioHint: "Max 160 characters",
    // Step 3 (Success)
    step3Title: "You're All Set! 🎉",
    step3Subtitle: "Your seller profile is ready",
    readyMessage: "You can now start listing items and selling on Treido",
    profileUrl: "Your seller profile",
    // Actions
    continue: "Continue",
    startSelling: "Start Selling",
    settingUp: "Setting up...",
    // Footer
    freeToStart: "Free to start • Upgrade anytime",
  },
  bg: {
    // Step 2 (Profile Customization - now first step)
    step2Title: "Персонализирайте профила си",
    step2Subtitle: "Помогнете на купувачите да ви опознаят",
    displayNameLabel: "Показвано име",
    displayNamePlaceholder: "Как да ви наричат купувачите?",
    displayNameHint: "Ще се показва на вашия профил и обяви",
    businessNameLabel: "Име на фирмата",
    businessNamePlaceholder: "Име на фирма / магазин",
    businessNameHint: "Показва се в публичния бизнес профил",
    bioLabel: "Кратка биография (незадължително)",
    bioPlaceholder: "Разкажете на купувачите малко за себе си или какво продавате...",
    bioHint: "Максимум 160 символа",
    // Step 3 (Success)
    step3Title: "Готови сте! 🎉",
    step3Subtitle: "Вашият профил на продавач е готов",
    readyMessage: "Вече можете да добавяте артикули и да продавате в Treido",
    profileUrl: "Вашият профил на продавач",
    // Actions
    continue: "Продължи",
    startSelling: "Започнете да продавате",
    settingUp: "Настройка...",
    // Footer
    freeToStart: "Безплатно начало • Надградете по всяко време",
  },
}

export function SellerOnboardingWizard({
  userId,
  username,
  displayName: initialDisplayName,
  initialBusinessName,
  initialAccountType,
  completeSellerOnboardingAction,
  onComplete,
}: SellerOnboardingWizardProps) {
  const locale = useLocale()
  const safeLocale = locale === "bg" ? "bg" : "en"
  const t = translations[safeLocale]

  const [step, setStep] = useState(2)  // Start at step 2 - account type already set at signup!
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  // Form state - accountType from props, already set at signup!
  const accountType = initialAccountType  // No state needed - use prop directly
  const [displayName, setDisplayName] = useState(initialDisplayName || "")
  const [bio, setBio] = useState("")
  const [businessName, setBusinessName] = useState(initialBusinessName || "")

  // Total steps: 2 (profile) + 3 (success) = effective steps 2-3
  const totalSteps = 3

  const handleComplete = () => {
    setError(null)
    startTransition(async () => {
      try {
        const res = await completeSellerOnboardingAction({
          userId,
          accountType,
          username,
          displayName,
          bio,
          businessName,
        })

        if (res?.error) {
          throw new Error(res.error)
        }

        // Move to success step
        setStep(3)
      } catch (err) {
        console.error("Seller setup error:", err)
        setError(err instanceof Error ? err.message : "An error occurred")
      }
    })
  }

  return (
    <div className="w-full max-w-lg mx-auto py-6 px-4">
      <div className="bg-surface-card rounded-md border border-border overflow-hidden">
        {/* Progress indicator - step 2 = 66%, step 3 = 100% */}
        <div className="h-1 bg-muted">
          <motion.div
            className="h-full bg-brand"
            initial={{ width: "0%" }}
            animate={{ width: `${(step / 3) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        <div className="p-4">
          <AnimatePresence mode="wait">
            {/* Step 1 (Account Type) REMOVED - already set at signup! */}

            {/* Step 2: Profile Customization */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                {/* Header */}
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-md bg-brand mb-4">
                    <Sparkle weight="bold" className="w-7 h-7 text-white" />
                  </div>
                  <h1 className="text-xl sm:text-2xl font-semibold text-foreground mb-2">
                    {t.step2Title}
                  </h1>
                  <p className="text-sm text-muted-foreground">{t.step2Subtitle}</p>
                </div>

                {/* Form */}
                <div className="space-y-4 mb-6">
                  {/* Business Name (business accounts only) */}
                  {accountType === "business" && (
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium">
                        {t.businessNameLabel}
                      </label>
                      <Input
                        type="text"
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}
                        placeholder={t.businessNamePlaceholder}
                        maxLength={80}
                        className="h-11"
                      />
                      <p className="text-xs text-muted-foreground">{t.businessNameHint}</p>
                    </div>
                  )}

                  {/* Display Name */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">
                      {t.displayNameLabel}
                    </label>
                    <Input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder={t.displayNamePlaceholder}
                      maxLength={50}
                      className="h-11"
                    />
                    <p className="text-xs text-muted-foreground">{t.displayNameHint}</p>
                  </div>

                  {/* Bio */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">
                      {t.bioLabel}
                    </label>
                    <Textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value.slice(0, 160))}
                      placeholder={t.bioPlaceholder}
                      maxLength={160}
                      rows={3}
                      className="resize-none"
                    />
                    <div className="flex justify-between">
                      <p className="text-xs text-muted-foreground">{t.bioHint}</p>
                      <p className="text-xs text-muted-foreground/70">{bio.length}/160</p>
                    </div>
                  </div>
                </div>

                {/* Error */}
                {error && (
                  <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive">
                    {error}
                  </div>
                )}

                {/* Actions - No back button since this is the first step now */}
                <Button
                  onClick={handleComplete}
                  disabled={isPending}
                  className="w-full h-11 bg-brand hover:bg-brand-dark"
                >
                  {isPending ? (
                    <>
                      <SpinnerGap className="mr-2 size-4 animate-spin" />
                      {t.settingUp}
                    </>
                    ) : (
                      <>
                        {t.continue}
                        <ArrowRight className="ml-2 size-4" />
                      </>
                    )}
                </Button>
              </motion.div>
            )}

            {/* Step 3: Success */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="text-center"
              >
                {/* Success animation */}
                <div className="mb-6">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.1 }}
                    className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-success mb-4"
                  >
                    <Check weight="bold" className="w-10 h-10 text-white" />
                  </motion.div>
                  <h1 className="text-2xl font-bold text-foreground mb-2">
                    {t.step3Title}
                  </h1>
                  <p className="text-muted-foreground">{t.step3Subtitle}</p>
                </div>

                {/* Profile URL */}
                <div className="mb-6 p-4 bg-muted rounded-md border border-border">
                  <p className="text-sm text-muted-foreground mb-1">{t.profileUrl}</p>
                  <p className="font-medium text-foreground">treido.eu/u/{username}</p>
                </div>

                {/* What's next */}
                <div className="mb-6">
                  <p className="text-sm text-muted-foreground">{t.readyMessage}</p>
                </div>

                {/* Action */}
                <Button
                  onClick={onComplete}
                  className="w-full h-12 bg-warning hover:bg-warning/90 text-white font-medium"
                >
                  <Storefront className="mr-2 size-5" weight="fill" />
                  {t.startSelling}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        {step < 3 && (
          <div className="px-6 py-4 bg-muted border-t border-border">
            <p className="text-xs text-center text-muted-foreground">{t.freeToStart}</p>
          </div>
        )}
      </div>
    </div>
  )
}
