"use client";

import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import {
  Storefront,
  Sparkle,
  ArrowRight,
  ArrowLeft,
  SpinnerGap,
  Warning,
  Check,
  User,
  Buildings,
  Globe,
  FacebookLogo,
  InstagramLogo,
  Lightning,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { storeSchema } from "./schemas";
import { cn } from "@/lib/utils";
import type { Seller } from "./types";
import * as z from "zod";

// Infer form data type from schema
type StoreFormData = z.infer<typeof storeSchema>;

interface CreateStoreWizardProps {
  onStoreCreated: (seller: Seller) => void;
  locale?: string;
}

const translations = {
  en: {
    // Step 1
    step1Title: "What type of seller are you?",
    step1Subtitle: "Choose the account type that best fits your selling needs",
    personal: "Personal",
    personalDesc: "Selling personal items, handmade goods, or occasional sales",
    personalFeatures: ["10 free listings", "Perfect for beginners", "Quick setup"],
    business: "Business",
    businessDesc: "Registered business or professional seller with regular inventory",
    businessFeatures: ["15 free listings", "Business badge", "Tax invoice support"],
    // Step 2
    step2Title: "Name your store",
    step2Subtitle: "Choose a memorable name that represents your brand",
    storeName: "Store Name",
    storeNamePlaceholder: "My Awesome Store",
    storeNameDesc: "This is how customers will find and remember you",
    description: "Description (optional)",
    descriptionPlaceholder: "Tell customers what you sell...",
    // Step 3 (Business only)
    step3Title: "Business Details",
    step3Subtitle: "Add your business information for credibility",
    businessName: "Business Name",
    businessNamePlaceholder: "Company Ltd.",
    vatNumber: "VAT/EIK Number (optional)",
    vatNumberPlaceholder: "BG123456789",
    vatNumberDesc: "For verified business badge - can be added later",
    socialLinks: "Social Links (optional)",
    websiteUrl: "Website",
    websitePlaceholder: "https://yourstore.com",
    facebookPlaceholder: "https://facebook.com/yourpage",
    instagramPlaceholder: "https://instagram.com/yourprofile",
    tiktokPlaceholder: "https://tiktok.com/@yourprofile",
    // Actions
    continue: "Continue",
    back: "Back",
    createStore: "Create Store",
    creating: "Creating Store...",
    skipForNow: "Skip for now",
    // Benefits
    whatYouGet: "What you get",
    benefits: [
      "Start selling immediately",
      "Secure payments",
      "Analytics dashboard",
      "Customer messaging",
    ],
    // Success hints
    almostDone: "Almost done!",
    freeToStart: "Free to start • Upgrade anytime",
  },
  bg: {
    // Step 1
    step1Title: "Какъв тип продавач сте?",
    step1Subtitle: "Изберете типа акаунт, който най-добре отговаря на вашите нужди",
    personal: "Личен",
    personalDesc: "Продажба на лични вещи, ръчно изработени стоки или случайни продажби",
    personalFeatures: ["10 безплатни обяви", "Перфектно за начинаещи", "Бърза настройка"],
    business: "Бизнес",
    businessDesc: "Регистриран бизнес или професионален продавач с редовен инвентар",
    businessFeatures: ["15 безплатни обяви", "Бизнес значка", "Поддръжка на фактури"],
    // Step 2
    step2Title: "Име на магазина",
    step2Subtitle: "Изберете запомнящо се име, което представя вашата марка",
    storeName: "Име на магазина",
    storeNamePlaceholder: "Моят Страхотен Магазин",
    storeNameDesc: "Така клиентите ще ви намират и запомнят",
    description: "Описание (незадължително)",
    descriptionPlaceholder: "Разкажете на клиентите какво продавате...",
    // Step 3
    step3Title: "Бизнес детайли",
    step3Subtitle: "Добавете вашата бизнес информация за доверие",
    businessName: "Име на фирмата",
    businessNamePlaceholder: "Фирма ООД",
    vatNumber: "ЕИК/ДДС номер (незадължително)",
    vatNumberPlaceholder: "BG123456789",
    vatNumberDesc: "За значка за верифициран бизнес - може да се добави по-късно",
    socialLinks: "Социални мрежи (незадължително)",
    websiteUrl: "Уебсайт",
    websitePlaceholder: "https://вашиямагазин.com",
    facebookPlaceholder: "https://facebook.com/вашатастраница",
    instagramPlaceholder: "https://instagram.com/вашияпрофил",
    tiktokPlaceholder: "https://tiktok.com/@вашияпрофил",
    // Actions
    continue: "Продължи",
    back: "Назад",
    createStore: "Създай магазин",
    creating: "Създаване...",
    skipForNow: "Пропусни засега",
    // Benefits
    whatYouGet: "Какво получавате",
    benefits: [
      "Започнете да продавате веднага",
      "Сигурни плащания",
      "Табло за анализи",
      "Съобщения с клиенти",
    ],
    // Success hints
    almostDone: "Почти готово!",
    freeToStart: "Безплатно за начало • Надградете по всяко време",
  },
};

export function CreateStoreWizard({ onStoreCreated, locale = "en" }: CreateStoreWizardProps) {
  const t = translations[locale as keyof typeof translations] || translations.en;
  const [step, setStep] = useState(1);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const form = useForm<StoreFormData>({
    resolver: zodResolver(storeSchema),
    defaultValues: {
      storeName: "",
      accountType: "personal",
      description: "",
      businessName: "",
      vatNumber: "",
      websiteUrl: "",
      facebookUrl: "",
      instagramUrl: "",
      tiktokUrl: "",
    },
  });

  const accountType = form.watch("accountType");
  const totalSteps = accountType === "business" ? 3 : 2;

  const nextStep = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const onSubmit = (data: StoreFormData) => {
    setError(null);
    startTransition(async () => {
      try {
        const response = await fetch("/api/stores", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to create store");
        }

        const seller = await response.json();
        onStoreCreated(seller);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      }
    });
  };

  return (
    <div className="w-full max-w-lg mx-auto py-6 sm:py-12 px-4">
      <Card className="w-full shadow-lg border-border/50 overflow-hidden">
        {/* Progress indicator */}
        <div className="h-1 bg-muted">
          <motion.div
            className="h-full bg-linear-to-r from-amber-500 to-orange-500"
            initial={{ width: "0%" }}
            animate={{ width: `${(step / totalSteps) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        <CardContent className="p-5 sm:p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
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
                      <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-linear-to-br from-amber-400 to-orange-500 mb-4">
                        <Sparkle weight="bold" className="w-7 h-7 text-white" />
                      </div>
                      <h1 className="text-xl sm:text-2xl font-semibold text-foreground mb-2">
                        {t.step1Title}
                      </h1>
                      <p className="text-sm text-muted-foreground">
                        {t.step1Subtitle}
                      </p>
                    </div>

                    {/* Account Type Options */}
                    <FormField
                      control={form.control}
                      name="accountType"
                      render={({ field }) => (
                        <FormItem className="space-y-4">
                          <div className="grid gap-3">
                            {/* Personal Option */}
                            <button
                              type="button"
                              onClick={() => field.onChange("personal")}
                              className={cn(
                                "relative p-4 rounded-xl border-2 text-left transition-all",
                                field.value === "personal"
                                  ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                                  : "border-border hover:border-primary/50 hover:bg-muted/50"
                              )}
                            >
                              <div className="flex items-start gap-4">
                                <div className={cn(
                                  "size-12 rounded-xl flex items-center justify-center shrink-0",
                                  field.value === "personal"
                                    ? "bg-primary/10"
                                    : "bg-muted"
                                )}>
                                  <User
                                    weight={field.value === "personal" ? "fill" : "duotone"}
                                    className={cn(
                                      "size-6",
                                      field.value === "personal" ? "text-primary" : "text-muted-foreground"
                                    )}
                                  />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="font-semibold">{t.personal}</span>
                                    {field.value === "personal" && (
                                      <div className="size-5 rounded-full bg-primary flex items-center justify-center">
                                        <Check weight="bold" className="size-3 text-primary-foreground" />
                                      </div>
                                    )}
                                  </div>
                                  <p className="text-sm text-muted-foreground mb-2">
                                    {t.personalDesc}
                                  </p>
                                  <div className="flex flex-wrap gap-1.5">
                                    {t.personalFeatures.map((feature, i) => (
                                      <Badge key={i} variant="secondary" className="text-xs">
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
                              onClick={() => field.onChange("business")}
                              className={cn(
                                "relative p-4 rounded-xl border-2 text-left transition-all",
                                field.value === "business"
                                  ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                                  : "border-border hover:border-primary/50 hover:bg-muted/50"
                              )}
                            >
                              <div className="flex items-start gap-4">
                                <div className={cn(
                                  "size-12 rounded-xl flex items-center justify-center shrink-0",
                                  field.value === "business"
                                    ? "bg-primary/10"
                                    : "bg-muted"
                                )}>
                                  <Buildings
                                    weight={field.value === "business" ? "fill" : "duotone"}
                                    className={cn(
                                      "size-6",
                                      field.value === "business" ? "text-primary" : "text-muted-foreground"
                                    )}
                                  />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="font-semibold">{t.business}</span>
                                    {field.value === "business" && (
                                      <div className="size-5 rounded-full bg-primary flex items-center justify-center">
                                        <Check weight="bold" className="size-3 text-primary-foreground" />
                                      </div>
                                    )}
                                  </div>
                                  <p className="text-sm text-muted-foreground mb-2">
                                    {t.businessDesc}
                                  </p>
                                  <div className="flex flex-wrap gap-1.5">
                                    {t.businessFeatures.map((feature, i) => (
                                      <Badge key={i} variant="secondary" className="text-xs">
                                        {feature}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </button>
                          </div>
                        </FormItem>
                      )}
                    />

                    {/* Continue Button */}
                    <Button
                      type="button"
                      onClick={nextStep}
                      size="lg"
                      className="w-full h-11 text-base font-medium mt-6"
                    >
                      {t.continue}
                      <ArrowRight className="ml-2 size-4" />
                    </Button>

                    {/* Free badge */}
                    <p className="text-center text-xs text-muted-foreground mt-4">
                      <Lightning weight="fill" className="inline size-3 text-amber-500 mr-1" />
                      {t.freeToStart}
                    </p>
                  </motion.div>
                )}

                {/* Step 2: Store Name */}
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
                      <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-linear-to-br from-amber-400 to-orange-500 mb-4">
                        <Storefront weight="bold" className="w-7 h-7 text-white" />
                      </div>
                      <h1 className="text-xl sm:text-2xl font-semibold text-foreground mb-2">
                        {t.step2Title}
                      </h1>
                      <p className="text-sm text-muted-foreground">
                        {t.step2Subtitle}
                      </p>
                    </div>

                    <div className="space-y-4">
                      {/* Store Name */}
                      <FormField
                        control={form.control}
                        name="storeName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium">{t.storeName}</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Storefront className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
                                <Input
                                  {...field}
                                  placeholder={t.storeNamePlaceholder}
                                  className="pl-12 h-12 text-base"
                                />
                              </div>
                            </FormControl>
                            <FormDescription className="text-xs">
                              {t.storeNameDesc}
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Description */}
                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium">{t.description}</FormLabel>
                            <FormControl>
                              <Textarea
                                {...field}
                                placeholder={t.descriptionPlaceholder}
                                className="min-h-20 resize-none"
                                rows={3}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {error && (
                      <div
                        className="flex items-center gap-3 p-4 bg-destructive/5 border border-destructive/20 rounded-lg mt-4"
                        role="alert"
                      >
                        <div className="size-9 rounded-full bg-destructive/10 flex items-center justify-center shrink-0">
                          <Warning weight="bold" className="size-4 text-destructive" />
                        </div>
                        <span className="text-sm text-destructive">{error}</span>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3 mt-6">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={prevStep}
                        size="lg"
                        className="h-11"
                      >
                        <ArrowLeft className="mr-2 size-4" />
                        {t.back}
                      </Button>
                      {accountType === "personal" ? (
                        <Button
                          type="submit"
                          size="lg"
                          disabled={isPending}
                          className="flex-1 h-11 text-base font-medium"
                        >
                          {isPending ? (
                            <>
                              <SpinnerGap className="mr-2 size-4 animate-spin" />
                              {t.creating}
                            </>
                          ) : (
                            <>
                              {t.createStore}
                              <ArrowRight className="ml-2 size-4" />
                            </>
                          )}
                        </Button>
                      ) : (
                        <Button
                          type="button"
                          onClick={nextStep}
                          size="lg"
                          className="flex-1 h-11 text-base font-medium"
                        >
                          {t.continue}
                          <ArrowRight className="ml-2 size-4" />
                        </Button>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Business Details (Business only) */}
                {step === 3 && accountType === "business" && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    {/* Header */}
                    <div className="text-center mb-6">
                      <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-linear-to-br from-blue-500 to-indigo-500 mb-4">
                        <Buildings weight="bold" className="w-7 h-7 text-white" />
                      </div>
                      <h1 className="text-xl sm:text-2xl font-semibold text-foreground mb-2">
                        {t.step3Title}
                      </h1>
                      <p className="text-sm text-muted-foreground">
                        {t.step3Subtitle}
                      </p>
                    </div>

                    <div className="space-y-4">
                      {/* Business Name */}
                      <FormField
                        control={form.control}
                        name="businessName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium">{t.businessName}</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Buildings className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
                                <Input
                                  {...field}
                                  placeholder={t.businessNamePlaceholder}
                                  className="pl-12 h-12 text-base"
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* VAT Number */}
                      <FormField
                        control={form.control}
                        name="vatNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium">{t.vatNumber}</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder={t.vatNumberPlaceholder}
                                className="h-12 text-base"
                              />
                            </FormControl>
                            <FormDescription className="text-xs">
                              {t.vatNumberDesc}
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Social Links */}
                      <div className="pt-2">
                        <FormLabel className="text-sm font-medium">{t.socialLinks}</FormLabel>
                        <div className="mt-2 space-y-3">
                          <FormField
                            control={form.control}
                            name="websiteUrl"
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <div className="relative">
                                    <Globe className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
                                    <Input
                                      {...field}
                                      placeholder={t.websitePlaceholder}
                                      className="pl-12 h-11"
                                    />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="facebookUrl"
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <div className="relative">
                                    <FacebookLogo className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
                                    <Input
                                      {...field}
                                      placeholder={t.facebookPlaceholder}
                                      className="pl-12 h-11"
                                    />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="instagramUrl"
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <div className="relative">
                                    <InstagramLogo className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
                                    <Input
                                      {...field}
                                      placeholder={t.instagramPlaceholder}
                                      className="pl-12 h-11"
                                    />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    </div>

                    {error && (
                      <div
                        className="flex items-center gap-3 p-4 bg-destructive/5 border border-destructive/20 rounded-lg mt-4"
                        role="alert"
                      >
                        <div className="size-9 rounded-full bg-destructive/10 flex items-center justify-center shrink-0">
                          <Warning weight="bold" className="size-4 text-destructive" />
                        </div>
                        <span className="text-sm text-destructive">{error}</span>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3 mt-6">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={prevStep}
                        size="lg"
                        className="h-11"
                      >
                        <ArrowLeft className="mr-2 size-4" />
                        {t.back}
                      </Button>
                      <Button
                        type="submit"
                        size="lg"
                        disabled={isPending}
                        className="flex-1 h-11 text-base font-medium"
                      >
                        {isPending ? (
                          <>
                            <SpinnerGap className="mr-2 size-4 animate-spin" />
                            {t.creating}
                          </>
                        ) : (
                          <>
                            {t.createStore}
                            <ArrowRight className="ml-2 size-4" />
                          </>
                        )}
                      </Button>
                    </div>

                    {/* Skip option */}
                    <button
                      type="submit"
                      disabled={isPending}
                      className="w-full text-center text-sm text-muted-foreground hover:text-foreground mt-3 transition-colors"
                    >
                      {t.skipForNow}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </Form>

          {/* Benefits list */}
          <div className="mt-6 pt-6 border-t">
            <p className="text-xs text-muted-foreground text-center mb-4 uppercase tracking-wider">
              {t.whatYouGet}
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
              {t.benefits.map((benefit) => (
                <li
                  key={benefit}
                  className="flex items-center gap-2.5 text-sm text-muted-foreground py-1"
                >
                  <div className="size-5 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                    <Check weight="bold" className="size-3 text-emerald-600" />
                  </div>
                  {benefit}
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
