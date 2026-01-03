"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  User,
  Buildings,
  ShoppingBag,
  Storefront,
  Check,
  ArrowRight,
  ArrowLeft,
  SpinnerGap,
  Camera,
  Globe,
  MapPin,
  InstagramLogo,
  TiktokLogo,
  YoutubeLogo,
  TwitterLogo,
  Link as LinkIcon,
} from "@phosphor-icons/react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { completePostSignupOnboarding, type OnboardingData } from "@/app/actions/onboarding"
import Image from "next/image"
import Avatar from "boring-avatars"

// Avatar style options
const AVATAR_VARIANTS = ["beam", "marble", "pixel", "sunset", "ring", "bauhaus"] as const
type AvatarVariant = (typeof AVATAR_VARIANTS)[number]

const COLOR_PALETTES = [
  ["#92A1C6", "#146A7C", "#F0AB3D", "#C271B4", "#C20D90"],
  ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7"],
  ["#6C5CE7", "#A29BFE", "#FD79A8", "#FDCB6E", "#00B894"],
] as const

const DEFAULT_PALETTE = COLOR_PALETTES[0]

function getColorPalette(index: number): string[] {
  return [...(COLOR_PALETTES[index] ?? DEFAULT_PALETTE)]
}

interface PostSignupOnboardingModalProps {
  isOpen: boolean
  onClose: () => void
  userId: string
  username: string
  displayName?: string | null
  locale?: string
}

type OnboardingStep = "intent" | "account-type" | "profile" | "social" | "business" | "complete"
type UserIntent = "sell" | "shop" | "browse" | null
type AccountType = "personal" | "business" | null

const translations = {
  en: {
    // Intent step
    intentTitle: "Welcome to Treido! 🎉",
    intentSubtitle: "What brings you here today?",
    wantToSell: "I want to sell",
    wantToSellDesc: "List items and grow your business",
    wantToShop: "I want to shop",
    wantToShopDesc: "Browse and buy amazing products",
    justBrowse: "Just browsing for now",
    // Account type step
    accountTypeTitle: "How will you be selling?",
    accountTypeSubtitle: "Choose your seller account type",
    personal: "Personal Seller",
    personalDesc: "Sell personal items, crafts, or occasional sales",
    personalFeatures: ["Free to start", "Perfect for beginners", "Upgrade anytime"],
    business: "Business Seller",
    businessDesc: "For registered businesses or professional sellers",
    businessFeatures: ["Business badge", "Tax invoice support", "Advanced analytics"],
    // Profile step
    profileTitle: "Set up your store",
    profileSubtitle: "Help buyers get to know you",
    storeNameLabel: "Store Name",
    storeNamePlaceholder: "My Awesome Store",
    storeNameHint: "This is how buyers will find you",
    bioLabel: "About your store (optional)",
    bioPlaceholder: "Tell buyers what you sell or what makes your store special...",
    bioHint: "Max 160 characters",
    profileImageLabel: "Profile Picture",
    profileImageHint: "Click to upload or choose a style",
    // Social links step (personal)
    socialTitle: "Add your social links",
    socialSubtitle: "Help buyers connect with you (optional)",
    instagramPlaceholder: "your.handle",
    tiktokPlaceholder: "your.handle",
    youtubePlaceholder: "channel",
    twitterPlaceholder: "handle",
    otherLinkPlaceholder: "https://your-website.com",
    // Business step
    businessInfoTitle: "Business information",
    businessInfoSubtitle: "Tell us about your business",
    coverImageLabel: "Cover Image",
    coverImageHint: "Recommended: 1200×300px",
    websiteLabel: "Business Website",
    websitePlaceholder: "https://your-business.com",
    locationLabel: "Business Location",
    locationPlaceholder: "Sofia, Bulgaria",
    businessNameLabel: "Legal Business Name",
    businessNamePlaceholder: "Your Company Ltd.",
    // Actions
    continue: "Continue",
    back: "Back",
    skip: "Skip",
    finish: "Start exploring",
    startSelling: "Start selling",
    settingUp: "Setting up...",
    // Complete
    completeTitle: "You're all set! 🚀",
    completeSellerTitle: "Your store is ready! 🎉",
    completeSubtitle: "Time to explore amazing deals",
    completeSellerSubtitle: "Start listing your first product",
  },
  bg: {
    // Intent step
    intentTitle: "Добре дошли в Treido! 🎉",
    intentSubtitle: "Какво ви носи тук днес?",
    wantToSell: "Искам да продавам",
    wantToSellDesc: "Публикувайте артикули и развивайте бизнеса си",
    wantToShop: "Искам да пазарувам",
    wantToShopDesc: "Разгледайте и купете страхотни продукти",
    justBrowse: "Само разглеждам засега",
    // Account type step
    accountTypeTitle: "Как ще продавате?",
    accountTypeSubtitle: "Изберете типа на акаунта си",
    personal: "Личен продавач",
    personalDesc: "Продавайте лични вещи, занаяти или случайни продажби",
    personalFeatures: ["Безплатно начало", "Перфектно за начинаещи", "Надградете по всяко време"],
    business: "Бизнес продавач",
    businessDesc: "За регистрирани фирми или професионални продавачи",
    businessFeatures: ["Бизнес значка", "Фактури", "Разширена аналитика"],
    // Profile step
    profileTitle: "Настройте магазина си",
    profileSubtitle: "Помогнете на купувачите да ви опознаят",
    storeNameLabel: "Име на магазина",
    storeNamePlaceholder: "Моят страхотен магазин",
    storeNameHint: "Така купувачите ще ви намират",
    bioLabel: "За вашия магазин (незадължително)",
    bioPlaceholder: "Разкажете на купувачите какво продавате или какво прави магазина ви специален...",
    bioHint: "Максимум 160 символа",
    profileImageLabel: "Профилна снимка",
    profileImageHint: "Кликнете за качване или изберете стил",
    // Social links step (personal)
    socialTitle: "Добавете социални връзки",
    socialSubtitle: "Помогнете на купувачите да се свържат с вас (незадължително)",
    instagramPlaceholder: "вашият.профил",
    tiktokPlaceholder: "вашият.профил",
    youtubePlaceholder: "канал",
    twitterPlaceholder: "профил",
    otherLinkPlaceholder: "https://вашият-сайт.com",
    // Business step
    businessInfoTitle: "Бизнес информация",
    businessInfoSubtitle: "Разкажете ни за вашия бизнес",
    coverImageLabel: "Корица",
    coverImageHint: "Препоръчително: 1200×300px",
    websiteLabel: "Бизнес уебсайт",
    websitePlaceholder: "https://вашият-бизнес.com",
    locationLabel: "Местоположение на бизнеса",
    locationPlaceholder: "София, България",
    businessNameLabel: "Юридическо име на фирмата",
    businessNamePlaceholder: "Вашата Фирма ООД",
    // Actions
    continue: "Продължи",
    back: "Назад",
    skip: "Пропусни",
    finish: "Започнете да разглеждате",
    startSelling: "Започнете да продавате",
    settingUp: "Настройка...",
    // Complete
    completeTitle: "Готови сте! 🚀",
    completeSellerTitle: "Вашият магазин е готов! 🎉",
    completeSubtitle: "Време е да разгледате страхотни оферти",
    completeSellerSubtitle: "Започнете да публикувате първия си продукт",
  },
}

export function PostSignupOnboardingModal({
  isOpen,
  onClose,
  userId,
  username,
  displayName: initialDisplayName,
  locale = "en",
}: PostSignupOnboardingModalProps) {
  const router = useRouter()
  const t = translations[locale as keyof typeof translations] || translations.en
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  // Step management
  const [step, setStep] = useState<OnboardingStep>("intent")
  
  // User choices
  const [intent, setIntent] = useState<UserIntent>(null)
  const [accountType, setAccountType] = useState<AccountType>(null)
  
  // Profile data
  const [storeName, setStoreName] = useState(initialDisplayName || "")
  const [bio, setBio] = useState("")
  
  // Avatar
  const [avatarVariant, setAvatarVariant] = useState<AvatarVariant>("beam")
  const [avatarPalette, setAvatarPalette] = useState(0)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [useCustomAvatar, setUseCustomAvatar] = useState(false)
  
  // Cover image (business)
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [coverPreview, setCoverPreview] = useState<string | null>(null)
  
  // Social links (personal)
  const [instagram, setInstagram] = useState("")
  const [tiktok, setTiktok] = useState("")
  const [youtube, setYoutube] = useState("")
  const [twitter, setTwitter] = useState("")
  const [otherLink, setOtherLink] = useState("")
  
  // Business info
  const [businessName, setBusinessName] = useState("")
  const [website, setWebsite] = useState("")
  const [location, setLocation] = useState("")

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setAvatarFile(file)
      const reader = new FileReader()
      reader.onloadend = () => setAvatarPreview(reader.result as string)
      reader.readAsDataURL(file)
      setUseCustomAvatar(true)
    }
  }

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setCoverFile(file)
      const reader = new FileReader()
      reader.onloadend = () => setCoverPreview(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleIntentSelect = (selectedIntent: UserIntent) => {
    setIntent(selectedIntent)
    if (selectedIntent === "sell") {
      setStep("account-type")
    } else {
      // For shop or browse, complete immediately
      handleComplete(selectedIntent, null)
    }
  }

  const handleAccountTypeSelect = (type: AccountType) => {
    setAccountType(type)
    setStep("profile")
  }

  const handleProfileNext = () => {
    if (accountType === "personal") {
      setStep("social")
    } else {
      setStep("business")
    }
  }

  const handleComplete = async (finalIntent?: UserIntent, finalAccountType?: AccountType) => {
    setError(null)
    const useIntent = finalIntent ?? intent
    const useAccountType = finalAccountType ?? accountType

    const socialLinks: Record<string, string> = {}
    if (instagram.trim()) socialLinks.instagram = instagram.trim()
    if (tiktok.trim()) socialLinks.tiktok = tiktok.trim()
    if (youtube.trim()) socialLinks.youtube = youtube.trim()
    if (twitter.trim()) socialLinks.twitter = twitter.trim()
    if (otherLink.trim()) socialLinks.other = otherLink.trim()

    const data: OnboardingData = {
      userId,
      intent: useIntent || "browse",
      accountType: useAccountType,
      displayName: storeName.trim() || null,
      bio: bio.trim() || null,
      businessName: useAccountType === "business" ? businessName.trim() || null : null,
      website: useAccountType === "business" ? website.trim() || null : null,
      location: location.trim() || null,
      socialLinks: Object.keys(socialLinks).length > 0 ? socialLinks : null,
      avatarType: useCustomAvatar ? "custom" : "generated",
      avatarVariant: !useCustomAvatar ? avatarVariant : undefined,
      avatarPalette: !useCustomAvatar ? avatarPalette : undefined,
    }

    startTransition(async () => {
      try {
        const result = await completePostSignupOnboarding(data, avatarFile, coverFile)
        
        if (result.error) {
          setError(result.error)
          return
        }

        setStep("complete")
      } catch (err) {
        console.error("Onboarding error:", err)
        setError("An error occurred. Please try again.")
      }
    })
  }

  const handleFinish = () => {
    onClose()
    if (intent === "sell") {
      router.push(`/${locale}/sell`)
    } else {
      router.push(`/${locale}`)
    }
    router.refresh()
  }

  const goBack = () => {
    switch (step) {
      case "account-type":
        setStep("intent")
        break
      case "profile":
        setStep("account-type")
        break
      case "social":
      case "business":
        setStep("profile")
        break
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent 
        className="w-[calc(100vw-2rem)] sm:max-w-md max-h-[85vh] sm:max-h-[90vh] overflow-y-auto p-0 bg-card border-0 shadow-xl"
        showCloseButton={false}
      >
        <AnimatePresence mode="wait">
          {/* STEP: Intent Selection */}
          {step === "intent" && (
            <motion.div
              key="intent"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="p-4 sm:p-5"
            >
              <DialogHeader className="mb-4 sm:mb-5">
                <DialogTitle className="text-xl sm:text-2xl font-bold text-center">{t.intentTitle}</DialogTitle>
                <DialogDescription className="text-center text-muted-foreground">{t.intentSubtitle}</DialogDescription>
              </DialogHeader>

              <div className="space-y-2.5">
                {/* Sell option */}
                <button
                  type="button"
                  onClick={() => handleIntentSelect("sell")}
                  className="w-full p-3 sm:p-4 rounded-lg bg-primary/5 border-2 border-primary/20 hover:border-primary/40 hover:bg-primary/10 transition-all text-left group"
                >
                  <div className="flex items-center gap-3">
                    <div className="size-10 sm:size-11 rounded-lg bg-primary flex items-center justify-center shrink-0 shadow-sm">
                      <Storefront className="size-5" weight="fill" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-foreground">{t.wantToSell}</p>
                      <p className="text-xs sm:text-sm text-muted-foreground">{t.wantToSellDesc}</p>
                    </div>
                    <ArrowRight className="size-5 text-primary group-hover:translate-x-0.5 transition-transform" weight="bold" />
                  </div>
                </button>

                {/* Shop option */}
                <button
                  type="button"
                  onClick={() => handleIntentSelect("shop")}
                  className="w-full p-3 sm:p-4 rounded-lg bg-card border-2 border-input hover:border-primary/30 hover:bg-primary/5 transition-all text-left group"
                >
                  <div className="flex items-center gap-3">
                    <div className="size-10 sm:size-11 rounded-lg bg-info flex items-center justify-center shrink-0 shadow-sm">
                      <ShoppingBag className="size-5" weight="fill" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-foreground">{t.wantToShop}</p>
                      <p className="text-xs sm:text-sm text-muted-foreground">{t.wantToShopDesc}</p>
                    </div>
                    <ArrowRight className="size-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                  </div>
                </button>

                {/* Browse option */}
                <button
                  type="button"
                  onClick={() => handleIntentSelect("browse")}
                  className="w-full py-3 text-sm text-primary/70 hover:text-primary font-medium hover:underline underline-offset-2 transition-colors"
                >
                  {t.justBrowse}
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP: Account Type Selection */}
          {step === "account-type" && (
            <motion.div
              key="account-type"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="p-4 sm:p-5"
            >
              <button
                onClick={goBack}
                className="flex items-center gap-1.5 text-sm text-primary hover:text-primary/80 font-medium mb-3 sm:mb-4 transition-colors"
              >
                <ArrowLeft className="size-4" weight="bold" />
                {t.back}
              </button>

              <DialogHeader className="mb-4 sm:mb-5">
                <DialogTitle className="text-lg sm:text-xl font-semibold">{t.accountTypeTitle}</DialogTitle>
                <DialogDescription className="text-muted-foreground">{t.accountTypeSubtitle}</DialogDescription>
              </DialogHeader>

              <div className="space-y-3">
                {/* Personal option */}
                <button
                  type="button"
                  onClick={() => handleAccountTypeSelect("personal")}
                  className={cn(
                    "w-full p-3 sm:p-4 rounded-lg border-2 text-left transition-all",
                    accountType === "personal"
                      ? "border-primary bg-primary/5 shadow-sm"
                      : "border-input bg-card hover:border-primary/30 hover:bg-primary/5"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className={cn(
                      "size-10 sm:size-11 rounded-lg flex items-center justify-center shrink-0 transition-colors",
                      accountType === "personal" ? "bg-primary shadow-sm" : "bg-primary/10"
                    )}>
                      <User
                        weight="fill"
                        className={cn("size-5", accountType === "personal" ? "text-primary-foreground" : "text-primary")}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-foreground">{t.personal}</span>
                        {accountType === "personal" && (
                          <div className="size-5 rounded-full bg-primary flex items-center justify-center">
                            <Check weight="bold" className="size-3 text-primary-foreground" />
                          </div>
                        )}
                      </div>
                      <p className="text-xs sm:text-sm text-muted-foreground mb-2">{t.personalDesc}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {t.personalFeatures.map((f, i) => (
                          <span key={i} className="text-xs px-2 py-0.5 bg-primary/10 rounded-full text-primary font-medium">
                            {f}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </button>

                {/* Business option */}
                <button
                  type="button"
                  onClick={() => handleAccountTypeSelect("business")}
                  className={cn(
                    "w-full p-3 sm:p-4 rounded-lg border-2 text-left transition-all",
                    accountType === "business"
                      ? "border-primary bg-primary/5 shadow-sm"
                      : "border-input bg-card hover:border-primary/30 hover:bg-primary/5"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className={cn(
                      "size-10 sm:size-11 rounded-lg flex items-center justify-center shrink-0 transition-colors",
                      accountType === "business" ? "bg-primary shadow-sm" : "bg-primary/10"
                    )}>
                      <Buildings
                        weight="fill"
                        className={cn("size-5", accountType === "business" ? "text-primary-foreground" : "text-primary")}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-foreground">{t.business}</span>
                        {accountType === "business" && (
                          <div className="size-5 rounded-full bg-primary flex items-center justify-center">
                            <Check weight="bold" className="size-3 text-primary-foreground" />
                          </div>
                        )}
                      </div>
                      <p className="text-xs sm:text-sm text-muted-foreground mb-2">{t.businessDesc}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {t.businessFeatures.map((f, i) => (
                          <span key={i} className="text-xs px-2 py-0.5 bg-primary/10 rounded-full text-primary font-medium">
                            {f}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP: Profile Setup */}
          {step === "profile" && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="p-4 sm:p-5"
            >
              <button
                onClick={goBack}
                className="flex items-center gap-1.5 text-sm text-primary hover:text-primary/80 font-medium mb-3 sm:mb-4 transition-colors"
              >
                <ArrowLeft className="size-4" weight="bold" />
                {t.back}
              </button>

              <DialogHeader className="mb-4 sm:mb-5">
                <DialogTitle className="text-lg sm:text-xl font-semibold">{t.profileTitle}</DialogTitle>
                <DialogDescription className="text-muted-foreground">{t.profileSubtitle}</DialogDescription>
              </DialogHeader>

              <div className="space-y-4 sm:space-y-5">
                {/* Avatar Selection */}
                <div>
                  <Label className="text-sm font-semibold mb-2 sm:mb-2.5 block text-foreground">{t.profileImageLabel}</Label>
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="relative">
                      <div className="size-14 sm:size-16 rounded-xl overflow-hidden border-2 border-primary/20 shadow-sm">
                        {useCustomAvatar && avatarPreview ? (
                          <Image
                            src={avatarPreview}
                            alt="Avatar"
                            width={64}
                            height={64}
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <Avatar
                            size={64}
                            name={username}
                            variant={avatarVariant}
                            colors={getColorPalette(avatarPalette)}
                            square
                          />
                        )}
                      </div>
                      <label className="absolute -bottom-1 -right-1 size-6 sm:size-7 bg-primary text-primary-foreground rounded-full flex items-center justify-center cursor-pointer hover:bg-primary/90 transition-colors shadow-md">
                        <Camera className="size-3 sm:size-3.5" weight="bold" />
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleAvatarChange}
                        />
                      </label>
                    </div>
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
                              "size-8 sm:size-9 rounded-lg border-2 overflow-hidden transition-all",
                              !useCustomAvatar && avatarVariant === variant
                                ? "border-primary shadow-sm"
                                : "border-input hover:border-primary/30"
                            )}
                          >
                            <Avatar
                              size={30}
                              name={username}
                              variant={variant}
                              colors={getColorPalette(avatarPalette)}
                              square
                            />
                          </button>
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground">{t.profileImageHint}</p>
                    </div>
                  </div>
                </div>

                {/* Store Name */}
                <div>
                  <Label htmlFor="storeName" className="text-sm font-semibold text-foreground">
                    {t.storeNameLabel}
                  </Label>
                  <Input
                    id="storeName"
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    placeholder={t.storeNamePlaceholder}
                    className="mt-2 h-10 border-input focus:border-primary focus:ring-primary/20"
                    maxLength={50}
                  />
                  <p className="text-xs text-muted-foreground mt-1.5">{t.storeNameHint}</p>
                </div>

                {/* Bio */}
                <div>
                  <Label htmlFor="bio" className="text-sm font-semibold text-foreground">
                    {t.bioLabel}
                  </Label>
                  <Textarea
                    id="bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value.slice(0, 160))}
                    placeholder={t.bioPlaceholder}
                    className="mt-2 resize-none border-input focus:border-primary focus:ring-primary/20"
                    rows={3}
                    maxLength={160}
                  />
                  <div className="flex justify-between mt-1.5">
                    <p className="text-xs text-muted-foreground">{t.bioHint}</p>
                    <p className={cn("text-xs", bio.length > 140 ? "text-warning" : "text-muted-foreground")}>{bio.length}/160</p>
                  </div>
                </div>

                {error && (
                  <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-lg border border-destructive/20">
                    {error}
                  </div>
                )}

                <Button onClick={handleProfileNext} className="w-full h-11 text-base font-semibold shadow-sm">
                  {t.continue}
                  <ArrowRight className="size-4 ml-2" weight="bold" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* STEP: Social Links (Personal) */}
          {step === "social" && (
            <motion.div
              key="social"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="p-4 sm:p-5"
            >
              <button
                onClick={goBack}
                className="flex items-center gap-1.5 text-sm text-primary hover:text-primary/80 font-medium mb-3 sm:mb-4 transition-colors"
              >
                <ArrowLeft className="size-4" weight="bold" />
                {t.back}
              </button>

              <DialogHeader className="mb-4 sm:mb-5">
                <DialogTitle className="text-lg sm:text-xl font-semibold">{t.socialTitle}</DialogTitle>
                <DialogDescription className="text-muted-foreground">{t.socialSubtitle}</DialogDescription>
              </DialogHeader>

              <div className="space-y-2.5 sm:space-y-3">
                {/* Instagram */}
                <div className="flex items-center gap-2.5 sm:gap-3">
                  <div className="size-9 sm:size-10 rounded-lg bg-social-instagram flex items-center justify-center shrink-0 shadow-sm">
                    <InstagramLogo className="size-4 sm:size-5 text-primary-foreground" weight="fill" />
                  </div>
                  <div className="flex-1 flex items-center border-2 border-input rounded-lg overflow-hidden focus-within:border-primary/50 transition-colors">
                    <span className="px-2 sm:px-3 text-xs sm:text-sm text-muted-foreground bg-secondary border-r border-input h-9 flex items-center">@</span>
                    <input
                      type="text"
                      value={instagram}
                      onChange={(e) => setInstagram(e.target.value.replace(/^@/, ""))}
                      placeholder={t.instagramPlaceholder}
                      className="flex-1 h-9 px-2 sm:px-3 text-sm bg-card focus:outline-none"
                    />
                  </div>
                </div>

                {/* TikTok */}
                <div className="flex items-center gap-2.5 sm:gap-3">
                  <div className="size-9 sm:size-10 rounded-lg bg-social-tiktok flex items-center justify-center shrink-0 shadow-sm">
                    <TiktokLogo className="size-4 sm:size-5 text-primary-foreground" weight="fill" />
                  </div>
                  <div className="flex-1 flex items-center border-2 border-input rounded-lg overflow-hidden focus-within:border-primary/50 transition-colors">
                    <span className="px-2 sm:px-3 text-xs sm:text-sm text-muted-foreground bg-secondary border-r border-input h-9 flex items-center">@</span>
                    <input
                      type="text"
                      value={tiktok}
                      onChange={(e) => setTiktok(e.target.value.replace(/^@/, ""))}
                      placeholder={t.tiktokPlaceholder}
                      className="flex-1 h-9 px-2 sm:px-3 text-sm bg-card focus:outline-none"
                    />
                  </div>
                </div>

                {/* YouTube */}
                <div className="flex items-center gap-2.5 sm:gap-3">
                  <div className="size-9 sm:size-10 rounded-lg bg-social-youtube flex items-center justify-center shrink-0 shadow-sm">
                    <YoutubeLogo className="size-4 sm:size-5 text-primary-foreground" weight="fill" />
                  </div>
                  <Input
                    value={youtube}
                    onChange={(e) => setYoutube(e.target.value)}
                    placeholder={t.youtubePlaceholder}
                    className="h-9 border-2 border-input focus:border-primary/50"
                  />
                </div>

                {/* Twitter/X */}
                <div className="flex items-center gap-2.5 sm:gap-3">
                  <div className="size-9 sm:size-10 rounded-lg bg-social-twitter flex items-center justify-center shrink-0 shadow-sm">
                    <TwitterLogo className="size-4 sm:size-5 text-primary-foreground" weight="fill" />
                  </div>
                  <div className="flex-1 flex items-center border-2 border-input rounded-lg overflow-hidden focus-within:border-primary/50 transition-colors">
                    <span className="px-2 sm:px-3 text-xs sm:text-sm text-muted-foreground bg-secondary border-r border-input h-9 flex items-center">@</span>
                    <input
                      type="text"
                      value={twitter}
                      onChange={(e) => setTwitter(e.target.value.replace(/^@/, ""))}
                      placeholder={t.twitterPlaceholder}
                      className="flex-1 h-9 px-2 sm:px-3 text-sm bg-card focus:outline-none"
                    />
                  </div>
                </div>

                {/* Other link */}
                <div className="flex items-center gap-2.5 sm:gap-3">
                  <div className="size-9 sm:size-10 rounded-lg bg-primary flex items-center justify-center shrink-0 shadow-sm">
                    <LinkIcon className="size-4 sm:size-5 text-primary-foreground" weight="bold" />
                  </div>
                  <Input
                    type="url"
                    value={otherLink}
                    onChange={(e) => setOtherLink(e.target.value)}
                    placeholder={t.otherLinkPlaceholder}
                    className="h-9 border-2 border-input focus:border-primary/50"
                  />
                </div>
              </div>

              {error && (
                <div className="mt-4 p-3 text-sm text-destructive bg-destructive/10 rounded-lg border border-destructive/20">
                  {error}
                </div>
              )}

              <div className="flex gap-3 mt-5">
                <Button
                  variant="outline"
                  onClick={() => handleComplete()}
                  disabled={isPending}
                  className="flex-1 h-11 border-2 font-medium"
                >
                  {t.skip}
                </Button>
                <Button
                  onClick={() => handleComplete()}
                  disabled={isPending}
                  className="flex-1 h-11 font-semibold shadow-sm"
                >
                  {isPending ? (
                    <>
                      <SpinnerGap className="size-4 mr-2 animate-spin" />
                      {t.settingUp}
                    </>
                  ) : (
                    <>
                      {t.continue}
                      <ArrowRight className="size-4 ml-2" weight="bold" />
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          )}

          {/* STEP: Business Info */}
          {step === "business" && (
            <motion.div
              key="business"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="p-4 sm:p-5"
            >
              <button
                onClick={goBack}
                className="flex items-center gap-1.5 text-sm text-primary hover:text-primary/80 font-medium mb-3 sm:mb-4 transition-colors"
              >
                <ArrowLeft className="size-4" weight="bold" />
                {t.back}
              </button>

              <DialogHeader className="mb-4 sm:mb-5">
                <DialogTitle className="text-lg sm:text-xl font-semibold">{t.businessInfoTitle}</DialogTitle>
                <DialogDescription className="text-muted-foreground">{t.businessInfoSubtitle}</DialogDescription>
              </DialogHeader>

              <div className="space-y-3 sm:space-y-4">
                {/* Cover Image */}
                <div>
                  <Label className="text-sm font-semibold text-foreground mb-2 block">{t.coverImageLabel}</Label>
                  <label className="block w-full h-20 sm:h-24 border-2 border-dashed border-primary/30 rounded-lg hover:border-primary/50 hover:bg-primary/5 cursor-pointer transition-all overflow-hidden">
                    {coverPreview ? (
                      <Image
                        src={coverPreview}
                        alt="Cover"
                        width={400}
                        height={80}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center gap-1">
                        <Camera className="size-5 sm:size-6 text-primary/60" weight="duotone" />
                        <span className="text-xs text-muted-foreground">Click to upload</span>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleCoverChange}
                    />
                  </label>
                  <p className="text-xs text-muted-foreground mt-1.5">{t.coverImageHint}</p>
                </div>

                {/* Business Name */}
                <div>
                  <Label htmlFor="businessName" className="text-sm font-semibold text-foreground">
                    {t.businessNameLabel}
                  </Label>
                  <Input
                    id="businessName"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder={t.businessNamePlaceholder}
                    className="mt-1.5 sm:mt-2 h-9 sm:h-10 border-input focus:border-primary"
                  />
                </div>

                {/* Website */}
                <div>
                  <Label htmlFor="website" className="text-sm font-semibold text-foreground">
                    {t.websiteLabel}
                  </Label>
                  <div className="mt-1.5 sm:mt-2 flex items-center border-2 border-input rounded-lg overflow-hidden focus-within:border-primary/50 transition-colors">
                    <div className="px-2.5 sm:px-3 flex items-center bg-secondary border-r border-input h-9 sm:h-10">
                      <Globe className="size-4 text-primary" weight="duotone" />
                    </div>
                    <input
                      id="website"
                      type="url"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      placeholder={t.websitePlaceholder}
                      className="flex-1 h-9 sm:h-10 px-2.5 sm:px-3 text-sm bg-card focus:outline-none"
                    />
                  </div>
                </div>

                {/* Location */}
                <div>
                  <Label htmlFor="location" className="text-sm font-semibold text-foreground">
                    {t.locationLabel}
                  </Label>
                  <div className="mt-1.5 sm:mt-2 flex items-center border-2 border-input rounded-lg overflow-hidden focus-within:border-primary/50 transition-colors">
                    <div className="px-2.5 sm:px-3 flex items-center bg-secondary border-r border-input h-9 sm:h-10">
                      <MapPin className="size-4 text-primary" weight="duotone" />
                    </div>
                    <input
                      id="location"
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder={t.locationPlaceholder}
                      className="flex-1 h-9 sm:h-10 px-2.5 sm:px-3 text-sm bg-card focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {error && (
                <div className="mt-4 p-3 text-sm text-destructive bg-destructive/10 rounded-lg border border-destructive/20">
                  {error}
                </div>
              )}

              <div className="flex gap-3 mt-5">
                <Button
                  variant="outline"
                  onClick={() => handleComplete()}
                  disabled={isPending}
                  className="flex-1 h-11 border-2 font-medium"
                >
                  {t.skip}
                </Button>
                <Button
                  onClick={() => handleComplete()}
                  disabled={isPending}
                  className="flex-1 h-11 font-semibold shadow-sm"
                >
                  {isPending ? (
                    <>
                      <SpinnerGap className="size-4 mr-2 animate-spin" />
                      {t.settingUp}
                    </>
                  ) : (
                    <>
                      {t.continue}
                      <ArrowRight className="size-4 ml-2" weight="bold" />
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          )}

          {/* STEP: Complete */}
          {step === "complete" && (
            <motion.div
              key="complete"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="p-5 sm:p-6 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.1 }}
                className="size-16 sm:size-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-5 shadow-lg"
              >
                <Check className="size-8 sm:size-10 text-primary-foreground" weight="bold" />
              </motion.div>

              <DialogHeader className="mb-4 sm:mb-5">
                <DialogTitle className="text-xl sm:text-2xl font-bold">
                  {intent === "sell" ? t.completeSellerTitle : t.completeTitle}
                </DialogTitle>
                <DialogDescription className="text-muted-foreground text-sm sm:text-base mt-1">
                  {intent === "sell" ? t.completeSellerSubtitle : t.completeSubtitle}
                </DialogDescription>
              </DialogHeader>

              <Button onClick={handleFinish} className="w-full h-11 sm:h-12 text-sm sm:text-base font-semibold shadow-md">
                {intent === "sell" ? (
                  <>
                    <Storefront className="size-4 sm:size-5 mr-2" weight="fill" />
                    {t.startSelling}
                  </>
                ) : (
                  <>
                    <ShoppingBag className="size-4 sm:size-5 mr-2" weight="fill" />
                    {t.finish}
                  </>
                )}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  )
}
