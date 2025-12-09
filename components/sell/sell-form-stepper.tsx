"use client";

import { useState, useCallback, useTransition, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
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
    }
  }, []);

  const handleBack = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep]);

  const handleNext = useCallback(() => {
    if (currentStep < STEPS.length && stepValidity[currentStep]) {
      setCurrentStep(prev => prev + 1);
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

        toast.success(
          isBg ? "Обявата е публикувана!" : "Listing published!",
          { description: isBg ? "Вашият продукт е на живо" : "Your product is now live" }
        );

        router.push(`/${locale}/products/${result.product.id}`);
      } catch (error) {
        console.error("Submit error:", error);
        toast.error(
          error instanceof Error 
            ? error.message 
            : isBg ? "Грешка при публикуване" : "Error publishing listing"
        );
      }
    });
  }, [form, isBg, locale, router, sellerId]);

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
