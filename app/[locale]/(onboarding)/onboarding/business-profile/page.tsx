"use client"

import { useState, useEffect, useTransition } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useLocale } from "next-intl"
import { ArrowRight, ArrowLeft, Camera, SpinnerGap, Check, X, Globe, MapPin } from "@phosphor-icons/react"
import Image from "next/image"
import Avatar from "boring-avatars"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { AVATAR_VARIANTS, type AvatarVariant, getColorPalette } from "@/lib/avatar-palettes"
import { createClient } from "@/lib/supabase/client"

const translations = {
  en: {
    title: "Set up your business",
    subtitle: "Tell us about your business",
    step: "Step 2 of 5",
    businessNameLabel: "Business Name",
    businessNamePlaceholder: "Your Business",
    businessNameHint: "Your official business name",
    usernameLabel: "Username",
    usernamePlaceholder: "your_business",
    usernameHint: "Auto-suggested from your business name",
    categoryLabel: "Business Category",
    categoryPlaceholder: "Select a category",
    websiteLabel: "Website (optional)",
    websitePlaceholder: "https://your-business.com",
    locationLabel: "Location (optional)",
    locationPlaceholder: "Sofia, Bulgaria",
    logoLabel: "Business Logo",
    logoHint: "Click to upload your logo",
    continue: "Continue",
    back: "Back",
    checking: "Checking...",
    available: "Available",
    unavailable: "Unavailable",
    categories: {
      fashion: "Fashion & Clothing",
      electronics: "Electronics",
      home: "Home & Garden",
      automotive: "Automotive",
      sports: "Sports & Outdoors",
      beauty: "Beauty & Personal Care",
      food: "Food & Beverages",
      services: "Services",
      other: "Other",
    },
  },
  bg: {
    title: "Настройте бизнеса си",
    subtitle: "Разкажете ни за вашия бизнес",
    step: "Стъпка 2 от 5",
    businessNameLabel: "Име на бизнеса",
    businessNamePlaceholder: "Вашият Бизнес",
    businessNameHint: "Официалното име на вашия бизнес",
    usernameLabel: "Потребителско име",
    usernamePlaceholder: "вашият_бизнес",
    usernameHint: "Автоматично предложено от името на бизнеса",
    categoryLabel: "Категория на бизнеса",
    categoryPlaceholder: "Изберете категория",
    websiteLabel: "Уебсайт (незадължително)",
    websitePlaceholder: "https://вашият-бизнес.com",
    locationLabel: "Местоположение (незадължително)",
    locationPlaceholder: "София, България",
    logoLabel: "Лого на бизнеса",
    logoHint: "Кликнете за качване на лого",
    continue: "Продължи",
    back: "Назад",
    checking: "Проверка...",
    available: "Свободно",
    unavailable: "Заето",
    categories: {
      fashion: "Мода и облекло",
      electronics: "Електроника",
      home: "Дом и градина",
      automotive: "Автомобили",
      sports: "Спорт и отдих",
      beauty: "Красота и лична грижа",
      food: "Храни и напитки",
      services: "Услуги",
      other: "Друго",
    },
  },
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s_-]/g, "")
    .replace(/\s+/g, "_")
    .replace(/-+/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_|_$/g, "")
    .slice(0, 30)
}

export default function BusinessProfilePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const locale = useLocale()
  const t = translations[locale as keyof typeof translations] || translations.en

  const [isPending, startTransition] = useTransition()

  // Form state
  const [businessName, setBusinessName] = useState("")
  const [username, setUsername] = useState("")
  const [usernameManuallyEdited, setUsernameManuallyEdited] = useState(false)
  const [category, setCategory] = useState("")
  const [website, setWebsite] = useState("")
  const [location, setLocation] = useState("")
  const [isCheckingUsername, setIsCheckingUsername] = useState(false)
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null)

  // Logo state
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [avatarVariant] = useState<AvatarVariant>("bauhaus")
  const [avatarPalette] = useState(2)

  // Auto-suggest username from business name
  useEffect(() => {
    if (!usernameManuallyEdited && businessName) {
      const suggested = slugify(businessName)
      if (suggested) {
        setUsername(suggested)
      }
    }
  }, [businessName, usernameManuallyEdited])

  // Username availability check
  useEffect(() => {
    let cancelled = false
    const timeoutId = setTimeout(async () => {
      const cleaned = username.trim().toLowerCase()
      if (!cleaned || cleaned.length < 3) {
        if (!cancelled) setUsernameAvailable(null)
        return
      }

      if (!cancelled) setIsCheckingUsername(true)
      try {
        const supabase = createClient()
        const { data } = await supabase
          .from("profiles")
          .select("id")
          .ilike("username", cleaned)
          .maybeSingle()
        
        if (!cancelled) setUsernameAvailable(!data)
      } finally {
        if (!cancelled) setIsCheckingUsername(false)
      }
    }, 500)

    return () => {
      cancelled = true
      clearTimeout(timeoutId)
    }
  }, [username])

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setLogoFile(file)
      const reader = new FileReader()
      reader.onloadend = () => setLogoPreview(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleUsernameChange = (value: string) => {
    setUsernameManuallyEdited(true)
    setUsername(value.toLowerCase().replace(/[^a-z0-9_]/g, ""))
  }

  const handleContinue = () => {
    // Store business profile data in session storage
    try {
      sessionStorage.setItem("onboarding_profile", JSON.stringify({
        username: username.trim().toLowerCase(),
        businessName: businessName.trim(),
        accountType: "business",
        category,
        website: website.trim(),
        location: location.trim(),
        avatarType: logoFile ? "custom" : "generated",
        avatarVariant: !logoFile ? avatarVariant : undefined,
        avatarPalette: !logoFile ? avatarPalette : undefined,
      }))
    } catch {
      // Ignore storage access errors
    }
    
    // Navigate to interests page
    router.push(`/${locale}/onboarding/interests?type=business`)
  }

  const handleBack = () => {
    router.push(`/${locale}/onboarding/account-type`)
  }

  const canContinue = 
    businessName.trim().length >= 2 && 
    username.trim().length >= 3 && 
    usernameAvailable === true &&
    category

  // Username indicator
  const usernameIndicator = (() => {
    if (!username || username.trim().length < 3) return null
    if (isCheckingUsername) {
      return (
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <SpinnerGap className="size-4 animate-spin" weight="bold" />
          {t.checking}
        </span>
      )
    }
    if (usernameAvailable === true) {
      return (
        <span className="flex items-center gap-1.5 text-xs text-success">
          <Check className="size-4" weight="bold" />
          {t.available}
        </span>
      )
    }
    if (usernameAvailable === false) {
      return (
        <span className="flex items-center gap-1.5 text-xs text-destructive">
          <X className="size-4" />
          {t.unavailable}
        </span>
      )
    }
    return null
  })()

  return (
    <div className="space-y-5">
      {/* Back Button */}
      <button
        onClick={handleBack}
        className="flex items-center gap-1.5 text-sm text-link hover:text-link-hover font-medium transition-colors"
      >
        <ArrowLeft className="size-4" weight="bold" />
        {t.back}
      </button>

      {/* Progress Indicator */}
      <div className="flex items-center justify-center gap-1.5">
        {[1, 2, 3, 4, 5].map((step) => (
          <div
            key={step}
            className={cn(
              "h-2 rounded-full transition-all duration-300",
              step <= 2 ? "bg-primary w-6" : "bg-muted w-2"
            )}
          />
        ))}
      </div>

      {/* Header */}
      <div className="text-center space-y-2">
        <p className="text-xs text-muted-foreground font-medium">{t.step}</p>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
          {t.title}
        </h1>
        <p className="text-muted-foreground">{t.subtitle}</p>
      </div>

      {/* Logo Upload */}
      <div>
        <Label className="text-sm font-semibold mb-2 block text-foreground">{t.logoLabel}</Label>
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="size-16 rounded-xl overflow-hidden border-2 border-selected-border shadow-sm">
              {logoPreview ? (
                <Image
                  src={logoPreview}
                  alt="Logo"
                  width={64}
                  height={64}
                  className="object-cover w-full h-full"
                />
              ) : (
                <Avatar
                  size={64}
                  name={businessName || "business"}
                  variant={avatarVariant}
                  colors={getColorPalette(avatarPalette)}
                  square
                />
              )}
            </div>
            <label className="absolute -bottom-1 -right-1 size-7 bg-primary text-primary-foreground rounded-full flex items-center justify-center cursor-pointer hover:bg-interactive-hover transition-colors shadow-sm">
              <Camera className="size-3.5" weight="bold" />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleLogoChange}
              />
            </label>
          </div>
          <p className="text-xs text-muted-foreground flex-1">{t.logoHint}</p>
        </div>
      </div>

      {/* Business Name Input */}
      <div>
        <Label htmlFor="businessName" className="text-sm font-semibold text-foreground">
          {t.businessNameLabel}
        </Label>
        <Input
          id="businessName"
          value={businessName}
          onChange={(e) => setBusinessName(e.target.value)}
          placeholder={t.businessNamePlaceholder}
          className="mt-2"
          maxLength={100}
        />
        <p className="text-xs text-muted-foreground mt-1.5">{t.businessNameHint}</p>
      </div>

      {/* Username Input */}
      <div>
        <Label htmlFor="username" className="text-sm font-semibold text-foreground">
          {t.usernameLabel}
        </Label>
        <div className="relative mt-2">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">@</span>
          <Input
            id="username"
            value={username}
            onChange={(e) => handleUsernameChange(e.target.value)}
            placeholder={t.usernamePlaceholder}
            className="pl-8"
            maxLength={30}
          />
        </div>
        <div className="flex justify-between items-center mt-1.5">
          <p className="text-xs text-muted-foreground">{t.usernameHint}</p>
          {usernameIndicator}
        </div>
      </div>

      {/* Category Select */}
      <div>
        <Label htmlFor="category" className="text-sm font-semibold text-foreground">
          {t.categoryLabel}
        </Label>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="mt-2">
            <SelectValue placeholder={t.categoryPlaceholder} />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(t.categories).map(([key, label]) => (
              <SelectItem key={key} value={key}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Website Input */}
      <div>
        <Label htmlFor="website" className="text-sm font-semibold text-foreground">
          {t.websiteLabel}
        </Label>
        <div className="mt-2 flex items-center border rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-ring">
          <div className="px-3 flex items-center bg-secondary border-r h-10">
            <Globe className="size-4 text-muted-foreground" weight="duotone" />
          </div>
          <input
            id="website"
            type="url"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            placeholder={t.websitePlaceholder}
            className="flex-1 h-10 px-3 text-sm bg-background focus:outline-none"
          />
        </div>
      </div>

      {/* Location Input */}
      <div>
        <Label htmlFor="location" className="text-sm font-semibold text-foreground">
          {t.locationLabel}
        </Label>
        <div className="mt-2 flex items-center border rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-ring">
          <div className="px-3 flex items-center bg-secondary border-r h-10">
            <MapPin className="size-4 text-muted-foreground" weight="duotone" />
          </div>
          <input
            id="location"
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder={t.locationPlaceholder}
            className="flex-1 h-10 px-3 text-sm bg-background focus:outline-none"
          />
        </div>
      </div>

      {/* Continue Button */}
      <Button
        onClick={handleContinue}
        disabled={!canContinue || isPending}
        className="w-full h-12 text-base font-semibold"
      >
        {isPending ? (
          <>
            <SpinnerGap className="size-5 mr-2 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            {t.continue}
            <ArrowRight className="size-5 ml-2" weight="bold" />
          </>
        )}
      </Button>
    </div>
  )
}
