"use client";

import { useState, useCallback, useTransition, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import {
  CheckCircle,
  House,
  Plus,
  Share,
  Eye,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import {
  sellFormSchemaV4,
  type SellFormDataV4,
  defaultSellFormValuesV4,
} from "@/lib/sell-form-schema-v4";
import { StepperHeader } from "./ui/stepper-header";
import { StepperNavigation } from "./ui/stepper-navigation";
import { StepPhotos } from "./steps/step-photos";
import { StepCategory } from "./steps/step-category";
import { StepPricing } from "./steps/step-pricing";
import { StepReview } from "./steps/step-review";
import { Link } from "@/i18n/routing";
import type { Category } from "./types";
import { AiSearchDialog } from "@/components/ai-search-dialog";

interface SellFormStepperProps {
  locale?: string;
  existingProduct?: SellFormDataV4 & { id: string };
  sellerId: string;
  categories: Category[];
  onClose?: () => void;
}

// Step configuration
const STEPS = [
  { id: 1, title: { en: "Photos & Details", bg: "Снимки" } },
  { id: 2, title: { en: "Category", bg: "Категория" } },
  { id: 3, title: { en: "Pricing", bg: "Цена" } },
  { id: 4, title: { en: "Review", bg: "Преглед" } },
];

export function SellFormStepper({
  locale = "en",
  existingProduct,
  sellerId,
  categories,
  onClose,
}: SellFormStepperProps) {
  const router = useRouter();
  const contentScrollRef = useRef<HTMLElement | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [stepValidity, setStepValidity] = useState<Record<number, boolean>>({
    1: false,
    2: false,
    3: false,
    4: false,
  });
  const [isPending, startTransition] = useTransition();
  const [showSuccess, setShowSuccess] = useState(false);
  const [createdProductId, setCreatedProductId] = useState<string | null>(null);
  const [aiDialogOpen, setAiDialogOpen] = useState(false);
  const isBg = locale === "bg";
  
  // Track if draft was already restored to prevent spam
  const draftRestoredRef = useRef(false);

  // Form setup
  const form = useForm<SellFormDataV4>({
    resolver: zodResolver(sellFormSchemaV4),
    defaultValues: existingProduct || defaultSellFormValuesV4,
    mode: "onChange",
  });

  // Load draft on mount - ONCE only
  useEffect(() => {
    // Skip if already restored, editing existing product, or no sellerId
    if (draftRestoredRef.current || existingProduct || !sellerId) return;
    draftRestoredRef.current = true;
    
    try {
      const savedDraft = localStorage.getItem(`sell-draft-${sellerId}`);
      if (!savedDraft) return;
      
      const { data, savedAt } = JSON.parse(savedDraft);
      const savedDate = new Date(savedAt);
      const hoursSinceSave = (Date.now() - savedDate.getTime()) / (1000 * 60 * 60);
      
      if (hoursSinceSave < 24 && data) {
        form.reset(data);
        toast.info(
          isBg ? "Чернова възстановена" : "Draft restored",
          { description: isBg ? "Продължете откъдето сте спрели" : "Continue where you left off" }
        );
      }
    } catch {
      // Silent fail - draft restore is not critical
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sellerId]); // Only depend on sellerId - form.reset is stable, isBg doesn't affect logic

  // Auto-save to localStorage with proper debounce (no infinite loop)
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    if (!sellerId) return;

    // Subscribe to form changes with a callback instead of watching all values
    const subscription = form.watch((formData) => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }

      autoSaveTimeoutRef.current = setTimeout(() => {
        try {
          localStorage.setItem(`sell-draft-${sellerId}`, JSON.stringify({
            data: formData,
            savedAt: new Date().toISOString(),
          }));
        } catch {
          // Ignore storage errors
        }
      }, 3000);
    });

    return () => {
      subscription.unsubscribe();
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [sellerId, form]);

  // Update step validity - create stable callbacks for each step
  const handleStep1Validity = useCallback((isValid: boolean) => {
    setStepValidity(prev => {
      if (prev[1] === isValid) return prev; // Prevent unnecessary updates
      return { ...prev, 1: isValid };
    });
  }, []);

  const handleStep2Validity = useCallback((isValid: boolean) => {
    setStepValidity(prev => {
      if (prev[2] === isValid) return prev;
      return { ...prev, 2: isValid };
    });
  }, []);

  const handleStep3Validity = useCallback((isValid: boolean) => {
    setStepValidity(prev => {
      if (prev[3] === isValid) return prev;
      return { ...prev, 3: isValid };
    });
  }, []);

  const handleStep4Validity = useCallback((isValid: boolean) => {
    setStepValidity(prev => {
      if (prev[4] === isValid) return prev;
      return { ...prev, 4: isValid };
    });
  }, []);

  const scrollStepToTop = useCallback(() => {
    const el = contentScrollRef.current;
    if (el) {
      el.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
      return;
    }
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  // Navigation
  const goToStep = useCallback((step: number) => {
    if (step >= 1 && step <= STEPS.length) {
      setCurrentStep(step);
      scrollStepToTop();
    }
  }, [scrollStepToTop]);

  const handleBack = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      scrollStepToTop();
    }
  }, [currentStep, scrollStepToTop]);

  const handleNext = useCallback(() => {
    if (currentStep < STEPS.length && stepValidity[currentStep]) {
      setCurrentStep(prev => prev + 1);
      scrollStepToTop();
    }
  }, [currentStep, stepValidity, scrollStepToTop]);

  // Submit
  const handleSubmit = useCallback(() => {
    startTransition(async () => {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          toast.error(isBg ? "Моля, влезте в профила си" : "Please sign in to continue");
          return;
        }

        const data = form.getValues();

        const response = await fetch("/api/products/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...data, sellerId }),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "Failed to create listing");
        }

        // Clear draft after successful submission
        localStorage.removeItem(`sell-draft-${sellerId}`);

        // Show success screen instead of redirecting
        setCreatedProductId(result.product.id);
        setShowSuccess(true);
        scrollStepToTop();
      } catch (error) {
        console.error("Submit error:", error);
        toast.error(
          error instanceof Error 
            ? error.message 
            : isBg ? "Грешка при публикуване" : "Error publishing listing"
        );
      }
    });
  }, [form, isBg, sellerId, scrollStepToTop]);

  // Handle close with confirmation
  const handleClose = useCallback(() => {
    const hasData = form.getValues().images?.length > 0 || form.getValues().title?.length > 0;
    
    if (hasData) {
      if (window.confirm(
        isBg 
          ? "Имате незапазени промени. Сигурни ли сте, че искате да излезете?" 
          : "You have unsaved changes. Are you sure you want to leave?"
      )) {
        onClose?.();
        router.push(`/${locale}`);
      }
    } else {
      onClose?.();
      router.push(`/${locale}`);
    }
  }, [form, isBg, locale, onClose, router]);

  // Render current step
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <StepPhotos
            form={form}
            locale={locale}
            onValidityChange={handleStep1Validity}
          />
        );
      case 2:
        return (
          <StepCategory
            form={form}
            categories={categories}
            sellerId={sellerId}
            locale={locale}
            onValidityChange={handleStep2Validity}
          />
        );
      case 3:
        return (
          <StepPricing
            form={form}
            locale={locale}
            onValidityChange={handleStep3Validity}
          />
        );
      case 4:
        return (
          <StepReview
            form={form}
            locale={locale}
            onValidityChange={handleStep4Validity}
            onEditStep={goToStep}
          />
        );
      default:
        return null;
    }
  };

  // Success Screen
  if (showSuccess) {
    const productTitle = form.getValues().title || (isBg ? "Вашият продукт" : "Your product");
    const firstImageObj = form.getValues().images?.[0];
    const firstImageUrl = typeof firstImageObj === 'string' ? firstImageObj : firstImageObj?.url;

    return (
      <div className="min-h-screen bg-background flex flex-col">
        {/* Simple header */}
        <header className="sticky top-0 z-40 bg-background border-b border-border">
          <div className="flex items-center justify-center h-14">
            <span className="text-sm font-medium text-muted-foreground">
              {isBg ? "Обявата е публикувана" : "Listing Published"}
            </span>
          </div>
        </header>

        {/* Success content */}
        <main className="flex-1 flex flex-col items-center justify-center px-4 py-8">
          <div className="w-full max-w-sm text-center space-y-6">
            {/* Success animation */}
            <div className="relative mx-auto w-20 h-20">
              <div className="absolute inset-0 bg-status-complete/15 rounded-full animate-ping" />
              <div className="relative w-20 h-20 rounded-full border border-border bg-card flex items-center justify-center">
                <CheckCircle className="size-10 text-status-complete" weight="fill" />
              </div>
            </div>

            {/* Success message */}
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-foreground">
                {isBg ? "Готово" : "All set"}
              </h1>
              <p className="text-muted-foreground">
                {isBg 
                  ? "Вашата обява е публикувана успешно и е на живо!"
                  : "Your listing has been published successfully and is now live!"}
              </p>
            </div>

            {/* Product preview card */}
            {firstImageUrl && (
              <div className="bg-muted/50 rounded-xl p-4 border border-border">
                <div className="flex items-center gap-3">
                  <img 
                    src={firstImageUrl} 
                    alt={productTitle}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div className="flex-1 text-left min-w-0">
                    <p className="font-medium text-sm truncate">{productTitle}</p>
                    <p className="text-xs text-muted-foreground">
                      {isBg ? "Вашата обява е на живо" : "Your listing is live"}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div className="space-y-3 pt-2">
              <Button
                asChild
                className="w-full h-12 gap-2 bg-primary hover:bg-primary/90"
              >
                <Link href={`/product/${createdProductId}`}>
                  <Eye className="size-5" />
                  {isBg ? "Виж обявата" : "View Listing"}
                </Link>
              </Button>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1 h-11 gap-2"
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: productTitle,
                        url: `${window.location.origin}/${locale}/product/${createdProductId}`,
                      });
                    } else {
                      navigator.clipboard.writeText(
                        `${window.location.origin}/${locale}/product/${createdProductId}`
                      );
                      toast.success(isBg ? "Линкът е копиран" : "Link copied");
                    }
                  }}
                >
                  <Share className="size-4" />
                  {isBg ? "Сподели" : "Share"}
                </Button>

                <Button
                  variant="outline"
                  className="flex-1 h-11 gap-2"
                  onClick={() => {
                    // Reset form and go back to step 1
                    form.reset(defaultSellFormValuesV4);
                    setShowSuccess(false);
                    setCreatedProductId(null);
                    setCurrentStep(1);
                    setStepValidity({ 1: false, 2: false, 3: false, 4: false });
                  }}
                >
                  <Plus className="size-4" />
                  {isBg ? "Нова обява" : "New Listing"}
                </Button>
              </div>

              <Button
                variant="ghost"
                asChild
                className="w-full h-11 gap-2 text-muted-foreground"
              >
                <Link href="/">
                  <House className="size-4" />
                  {isBg ? "Към началото" : "Go Home"}
                </Link>
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-background to-muted/30 flex flex-col">
      {/* Header */}
      <StepperHeader
        currentStep={currentStep}
        totalSteps={STEPS.length}
        stepTitles={STEPS.map(s => s.title)}
        locale={locale}
        onClose={handleClose}
        onOpenAiAssistant={() => setAiDialogOpen(true)}
      />

      {/* Main content */}
      <main
        ref={(node) => {
          contentScrollRef.current = node;
        }}
        className="flex-1 overflow-y-auto pb-24"
      >
        <div className="max-w-lg mx-auto px-4 py-4">
          <div className="rounded-2xl border border-border bg-card p-4">
            {renderStep()}
          </div>
        </div>
      </main>

      {/* Navigation footer */}
      <StepperNavigation
        currentStep={currentStep}
        totalSteps={STEPS.length}
        isStepValid={stepValidity[currentStep] ?? false}
        isSubmitting={isPending}
        onBack={handleBack}
        onNext={handleNext}
        onSubmit={handleSubmit}
        locale={locale}
      />

      <AiSearchDialog
        open={aiDialogOpen}
        onOpenChange={setAiDialogOpen}
        initialMode="sell"
        autoSendGreeting={false}
      />
    </div>
  );
}
