"use client"

import { useState, useTransition } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useParams, useRouter } from "next/navigation"
import {
  User,
  Buildings,
  Check,
  ArrowRight,
  ArrowLeft,
  SpinnerGap,
  Storefront,
  Sparkle,
} from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { completeSellerOnboarding } from "../_actions/sell"

interface SellerOnboardingWizardProps {
  userId: string
  username: string
  displayName?: string | null
  initialBusinessName?: string | null
  initialAccountType?: "personal" | "business" | null
  onComplete: () => void
}

const translations = {
  en: {
    // Step 1
    step1Title: "Set Up Your Seller Profile",
    step1Subtitle: "Choose how you want to sell on Treido",
    personal: "Personal Account",
    personalDesc: "Sell personal items, handmade goods, or occasional sales",
    personalFeatures: ["Free to start", "10 free listings/month", "Perfect for beginners"],
    business: "Business Account",
    businessDesc: "For registered businesses or professional sellers",
    businessFeatures: ["Business badge", "15 free listings/month", "Tax invoice support"],
    // Step 2
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
    // Step 3 (ready)
    step3Title: "You're All Set! 🎉",
    step3Subtitle: "Your seller profile is ready",
    readyMessage: "You can now start listing items and selling on Treido",
    profileUrl: "Your seller profile",
    // Actions
    continue: "Continue",
    back: "Back",
    startSelling: "Start Selling",
    settingUp: "Setting up...",
    skipForNow: "Skip for now",
    // Benefits
    whySetup: "Why set up a seller profile?",
    benefits: [
      { icon: "tag", text: "List items and earn money" },
      { icon: "shield", text: "Build trust with buyers" },
      { icon: "chart", text: "Track your sales" },
    ],
    upgradeAnytime: "You can upgrade to Business anytime",
    freeToStart: "Free to start • Upgrade anytime",
  },
  bg: {
    // Step 1
    step1Title: "Настройте вашия профил на продавач",
    step1Subtitle: "Изберете как искате да продавате в Treido",
    personal: "Личен акаунт",
    personalDesc: "Продавайте лични вещи, ръчна изработка или случайни продажби",
    personalFeatures: ["Безплатно начало", "10 безплатни обяви/месец", "Перфектно за начинаещи"],
    business: "Бизнес акаунт",
    businessDesc: "За регистрирани фирми или професионални продавачи",
    businessFeatures: ["Бизнес значка", "15 безплатни обяви/месец", "Поддръжка на фактури"],
    // Step 2
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
    // Step 3 (ready)
    step3Title: "Готови сте! 🎉",
    step3Subtitle: "Вашият профил на продавач е готов",
    readyMessage: "Вече можете да добавяте артикули и да продавате в Treido",
    profileUrl: "Вашият профил на продавач",
    // Actions
    continue: "Продължи",
    back: "Назад",
    startSelling: "Започнете да продавате",
    settingUp: "Настройка...",
    skipForNow: "Пропусни засега",
    // Benefits
    whySetup: "Защо да настроите профил на продавач?",
    benefits: [
      { icon: "tag", text: "Публикувайте артикули и печелете" },
      { icon: "shield", text: "Изградете доверие с купувачите" },
      { icon: "chart", text: "Проследявайте продажбите си" },
    ],
    upgradeAnytime: "Можете да надградите до Бизнес по всяко време",
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

  const [step, setStep] = useState(1)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  // Form state
  const [accountType, setAccountType] = useState<"personal" | "business">(initialAccountType || "personal")
  const [displayName, setDisplayName] = useState(initialDisplayName || "")
  const [bio, setBio] = useState("")
  const [businessName, setBusinessName] = useState(initialBusinessName || "")

  const totalSteps = 3

  const nextStep = () => {
    if (step < totalSteps) setStep(step + 1)
  }

  const prevStep = () => {
    if (step > 1) setStep(step - 1)
  }

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
        {/* Progress indicator */}
        <div className="h-1 bg-gray-100">
          <motion.div
            className="h-full bg-blue-600"
            initial={{ width: "0%" }}
            animate={{ width: `${(step / totalSteps) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        <div className="p-4">
          <AnimatePresence mode="wait">
            {/* Step 1: Account Type Selection */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                {/* Header */}
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-md bg-amber-500 mb-4">
                    <Storefront weight="bold" className="w-7 h-7 text-white" />
                  </div>
                  <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">
                    {t.step1Title}
                  </h1>
                  <p className="text-sm text-gray-500">{t.step1Subtitle}</p>
                </div>

                {/* Account Type Options */}
                <div className="space-y-3 mb-6">
                  {/* Personal Option */}
                  <button
                    type="button"
                    onClick={() => setAccountType("personal")}
                    className={cn(
                      "relative w-full p-4 rounded-md border-2 text-left transition-all",
                      accountType === "personal"
                        ? "border-blue-500 bg-blue-50/50"
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    )}
                  >
                    <div className="flex items-start gap-4">
                      <div className={cn(
                        "size-12 rounded-md flex items-center justify-center shrink-0",
                        accountType === "personal" ? "bg-blue-100" : "bg-gray-100"
                      )}>
                        <User
                          weight={accountType === "personal" ? "fill" : "duotone"}
                          className={cn(
                            "size-6",
                            accountType === "personal" ? "text-blue-600" : "text-gray-500"
                          )}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-gray-900">{t.personal}</span>
                          {accountType === "personal" && (
                            <div className="size-5 rounded-full bg-blue-500 flex items-center justify-center">
                              <Check weight="bold" className="size-3 text-white" />
                            </div>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 mb-2">{t.personalDesc}</p>
                        <div className="flex flex-wrap gap-1.5">
                          {t.personalFeatures.map((feature, i) => (
                            <Badge key={i} variant="secondary" className="text-xs bg-gray-100">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </button>

                  {/* Business Option */}
                  <button
                    type="button"
                    onClick={() => setAccountType("business")}
                    className={cn(
                      "relative w-full p-4 rounded-md border-2 text-left transition-all",
                      accountType === "business"
                        ? "border-blue-500 bg-blue-50/50"
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    )}
                  >
                    <div className="flex items-start gap-4">
                      <div className={cn(
                        "size-12 rounded-md flex items-center justify-center shrink-0",
                        accountType === "business" ? "bg-blue-100" : "bg-gray-100"
                      )}>
                        <Buildings
                          weight={accountType === "business" ? "fill" : "duotone"}
                          className={cn(
                            "size-6",
                            accountType === "business" ? "text-blue-600" : "text-gray-500"
                          )}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-gray-900">{t.business}</span>
                          {accountType === "business" && (
                            <div className="size-5 rounded-full bg-blue-500 flex items-center justify-center">
                              <Check weight="bold" className="size-3 text-white" />
                            </div>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 mb-2">{t.businessDesc}</p>
                        <div className="flex flex-wrap gap-1.5">
                          {t.businessFeatures.map((feature, i) => (
                            <Badge key={i} variant="secondary" className="text-xs bg-gray-100">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </button>
                </div>

                {/* Info */}
                <p className="text-xs text-center text-gray-500 mb-6">{t.upgradeAnytime}</p>

                {/* Actions */}
                <Button
                  onClick={nextStep}
                  className="w-full h-11 bg-blue-600 hover:bg-blue-700"
                >
                  {t.continue}
                  <ArrowRight className="ml-2 size-4" />
                </Button>
              </motion.div>
            )}

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

                {/* Actions */}
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={prevStep}
                    className="h-11"
                  >
                    <ArrowLeft className="mr-2 size-4" />
                    {t.back}
                  </Button>
                  <Button
                    onClick={handleComplete}
                    disabled={isPending}
                    className="flex-1 h-11 bg-blue-600 hover:bg-blue-700"
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
                </div>
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
