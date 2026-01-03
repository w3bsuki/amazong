"use client"

import { useState, useTransition } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useParams, useRouter } from "next/navigation"
import {
  Check,
  ArrowRight,
  SpinnerGap,
  Storefront,
  Sparkle,
} from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { completeSellerOnboarding } from "../_actions/sell"

interface SellerOnboardingWizardProps {
  userId: string
  username: string
  displayName?: string | null
  initialBusinessName?: string | null
  initialAccountType: "personal" | "business"  // Required - from profile!
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
  onComplete,
}: SellerOnboardingWizardProps) {
  const params = useParams()
  const _router = useRouter() // Available for future navigation
  const locale = (typeof params?.locale === "string" ? params.locale : "en") as "en" | "bg"
  const t = translations[locale] || translations.en

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
        const res = await completeSellerOnboarding({
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
      <div className="bg-white rounded-md border border-gray-200 overflow-hidden">
        {/* Progress indicator - step 2 = 66%, step 3 = 100% */}
        <div className="h-1 bg-gray-100">
          <motion.div
            className="h-full bg-blue-600"
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
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-md bg-purple-600 mb-4">
                    <Sparkle weight="bold" className="w-7 h-7 text-white" />
                  </div>
                  <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">
                    {t.step2Title}
                  </h1>
                  <p className="text-sm text-gray-500">{t.step2Subtitle}</p>
                </div>

                {/* Form */}
                <div className="space-y-4 mb-6">
                  {/* Business Name (business accounts only) */}
                  {accountType === "business" && (
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-gray-700">
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
                      <p className="text-xs text-gray-500">{t.businessNameHint}</p>
                    </div>
                  )}

                  {/* Display Name */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">
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
                    <p className="text-xs text-gray-500">{t.displayNameHint}</p>
                  </div>

                  {/* Bio */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">
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
                      <p className="text-xs text-gray-500">{t.bioHint}</p>
                      <p className="text-xs text-gray-400">{bio.length}/160</p>
                    </div>
                  </div>
                </div>

                {/* Error */}
                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                    {error}
                  </div>
                )}

                {/* Actions - No back button since this is the first step now */}
                <Button
                  onClick={handleComplete}
                  disabled={isPending}
                  className="w-full h-11 bg-blue-600 hover:bg-blue-700"
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
                    className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-500 mb-4"
                  >
                    <Check weight="bold" className="w-10 h-10 text-white" />
                  </motion.div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    {t.step3Title}
                  </h1>
                  <p className="text-gray-500">{t.step3Subtitle}</p>
                </div>

                {/* Profile URL */}
                <div className="mb-6 p-4 bg-gray-50 rounded-md border border-gray-200">
                  <p className="text-sm text-gray-500 mb-1">{t.profileUrl}</p>
                  <p className="font-medium text-gray-900">treido.eu/u/{username}</p>
                </div>

                {/* What's next */}
                <div className="mb-6">
                  <p className="text-sm text-gray-600">{t.readyMessage}</p>
                </div>

                {/* Action */}
                <Button
                  onClick={onComplete}
                  className="w-full h-12 bg-amber-500 hover:bg-amber-600 text-white font-medium"
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
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
            <p className="text-xs text-center text-gray-500">{t.freeToStart}</p>
          </div>
        )}
      </div>
    </div>
  )
}
