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
  const isBg = locale === "bg";

  // Form setup
  const form = useForm<SellFormDataV4>({
    resolver: zodResolver(sellFormSchemaV4),
    defaultValues: existingProduct || defaultSellFormValuesV4,
    mode: "onChange",
  });

  // Load draft on mount
  useEffect(() => {
    if (existingProduct) return;
    
    const savedDraft = localStorage.getItem(`sell-draft-${sellerId}`);
    if (savedDraft) {
      try {
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
        console.error("Failed to restore draft");
      }
    }
  }, [sellerId, existingProduct, form, isBg]);

  // Auto-save to localStorage
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const formValues = form.watch();
  
  useEffect(() => {
    if (!sellerId) return;

    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }

    autoSaveTimeoutRef.current = setTimeout(() => {
      try {
        localStorage.setItem(`sell-draft-${sellerId}`, JSON.stringify({
          data: formValues,
          savedAt: new Date().toISOString(),
        }));
      } catch {
        // Ignore storage errors
      }
    }, 3000);

    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [formValues, sellerId]);

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

  // Navigation
  const goToStep = useCallback((step: number) => {
    if (step >= 1 && step <= STEPS.length) {
      setCurrentStep(step);
      // Scroll to top when navigating between steps
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, []);

  const handleBack = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [currentStep]);

  const handleNext = useCallback(() => {
    if (currentStep < STEPS.length && stepValidity[currentStep]) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [currentStep, stepValidity]);

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
        window.scrollTo({ top: 0, behavior: 'instant' });
      } catch (error) {
        console.error("Submit error:", error);
        toast.error(
          error instanceof Error 
            ? error.message 
            : isBg ? "Грешка при публикуване" : "Error publishing listing"
        );
      }
    });
  }, [form, isBg, sellerId]);

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
    const firstImage = form.getValues().images?.[0];

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
              <div className="absolute inset-0 bg-green-500/20 rounded-full animate-ping" />
              <div className="relative w-20 h-20 bg-green-500 rounded-full flex items-center justify-center">
                <CheckCircle className="size-10 text-white" weight="fill" />
              </div>
            </div>

            {/* Success message */}
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-foreground">
                {isBg ? "Поздравления! 🎉" : "Congratulations! 🎉"}
              </h1>
              <p className="text-muted-foreground">
                {isBg 
                  ? "Вашата обява е публикувана успешно и е на живо!"
                  : "Your listing has been published successfully and is now live!"}
              </p>
            </div>

            {/* Product preview card */}
            {firstImage && (
              <div className="bg-muted/50 rounded-xl p-4 border border-border">
                <div className="flex items-center gap-3">
                  <img 
                    src={firstImage} 
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
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <StepperHeader
        currentStep={currentStep}
        totalSteps={STEPS.length}
        stepTitles={STEPS.map(s => s.title)}
        locale={locale}
        onClose={handleClose}
      />

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-lg mx-auto px-4 py-6">
          {renderStep()}
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
    </div>
  );
}
