"use client";

import { useState, useEffect, useTransition, useRef, useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import {
  Rocket,
  Check,
  Warning,
  Sparkle,
  Spinner,
  CloudCheck,
  ArrowRight,
  X,
  FloppyDisk,
  House,
  CaretLeft,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { PageContainer } from "@/components/common/page-container";
import { cn } from "@/lib/utils";
import {
  sellFormSchemaV4,
  type SellFormDataV4,
  calculateFormProgress,
  defaultSellFormValuesV4,
} from "@/lib/sell-form-schema-v4";
import { PhotosSection } from "./sections/photos-section";
import { DetailsSection } from "./sections/details-section";
import { PricingSection } from "./sections/pricing-section";
import { ShippingSection } from "./sections/shipping-section";
import { AiListingAssistant } from "./ai/ai-listing-assistant";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import type { Category } from "./types";
import { Link } from "@/i18n/routing";

interface SellFormProps {
  locale?: string;
  existingProduct?: SellFormDataV4 & { id: string };
  sellerId: string;
  categories?: Category[];
}

// ============================================================================
// Progress Header - Clean, minimal, professional
// ============================================================================
function ProgressHeader({
  progressPercent,
  autoSaved,
  isSaving,
  hasUnsavedChanges,
  onSaveDraft,
  locale,
  currentStep,
  totalSteps,
}: {
  progressPercent: number;
  autoSaved: boolean;
  isSaving: boolean;
  hasUnsavedChanges: boolean;
  onSaveDraft: () => void;
  locale: string;
  currentStep: number;
  totalSteps: number;
}) {
  const isBg = locale === "bg";
  const isComplete = progressPercent === 100;

  return (
    <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border/60">
      <PageContainer size="default">
        {/* Top bar with logo and actions */}
        <div className="flex items-center justify-between h-14 gap-4">
          {/* Left: Back/Logo */}
          <Link 
            href="/" 
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group"
          >
            <CaretLeft className="size-4" weight="bold" />
            <House className="size-5" />
            <span className="hidden sm:inline text-xs font-bold uppercase tracking-wider">
              {isBg ? "Начало" : "Home"}
            </span>
          </Link>

          {/* Center: Progress indicator (Desktop) */}
          <div className="flex-1 max-w-md mx-4 hidden sm:block">
            <div className="flex items-center gap-4">
              <Progress 
                value={progressPercent} 
                className="h-1.5 flex-1" 
                aria-label={`${isBg ? "Прогрес на формуляра" : "Form progress"}: ${progressPercent}%`}
              />
              <span className={cn(
                "text-[11px] font-bold tabular-nums min-w-[2.5rem] text-right uppercase tracking-tighter",
                isComplete ? "text-green-600" : "text-muted-foreground"
              )}>
                {progressPercent}%
              </span>
            </div>
          </div>

          {/* Center: Step indicator (Mobile) */}
          <div className="sm:hidden flex-1 flex justify-center">
            <div className="flex items-center gap-1.5">
              {Array.from({ length: totalSteps }).map((_, i) => (
                <div 
                  key={i}
                  className={cn(
                    "h-1 rounded-full transition-all duration-300",
                    i + 1 === currentStep ? "w-6 bg-primary" : "w-2 bg-muted-foreground/20"
                  )}
                />
              ))}
            </div>
          </div>

          {/* Right: Save status + Actions */}
          <div className="flex items-center gap-2">
            {/* Save status indicator */}
            <div className={cn(
              "flex items-center gap-1.5 text-xs transition-opacity",
              (autoSaved || isSaving) ? "opacity-100" : "opacity-0"
            )}>
              {isSaving ? (
                <>
                  <Spinner className="size-3.5 animate-spin text-muted-foreground" />
                  <span className="text-muted-foreground hidden sm:inline">
                    {isBg ? "Запазване..." : "Saving..."}
                  </span>
                </>
              ) : autoSaved ? (
                <>
                  <CloudCheck className="size-3.5 text-status-complete" />
                  <span className="text-status-complete hidden sm:inline">
                    {isBg ? "Запазено" : "Saved"}
                  </span>
                </>
              ) : null}
            </div>

            {/* Manual save button */}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onSaveDraft}
              className="h-9 px-3 gap-2 text-muted-foreground hover:text-foreground"
              disabled={!hasUnsavedChanges}
            >
              <FloppyDisk className="size-4" />
              <span className="hidden sm:inline">
                {isBg ? "Запази" : "Save"}
              </span>
            </Button>
          </div>
        </div>

        {/* Mobile progress bar (Bottom of header) */}
        <div className="sm:hidden pb-2">
          <div className="flex items-center gap-3">
            <Progress value={progressPercent} className="h-1 flex-1" />
            <span className={cn(
              "text-[10px] font-bold tabular-nums",
              isComplete ? "text-status-complete" : "text-muted-foreground/60"
            )}>
              {progressPercent}%
            </span>
          </div>
        </div>
      </PageContainer>
    </header>
  );
}

// ============================================================================
// Checklist Sidebar (Desktop only)
// ============================================================================
function ChecklistSidebar({
  items,
  locale,
}: {
  items: { key: string; label: string; labelBg: string; completed: boolean }[];
  locale: string;
}) {
  const isBg = locale === "bg";
  const completedCount = items.filter(i => i.completed).length;
  
  return (
    <div className="p-5 rounded-xl border border-border bg-background shadow-xs">
      <div className="flex items-center justify-between mb-5">
        <h4 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80">
          {isBg ? "Списък" : "Checklist"}
        </h4>
        <span className="text-[10px] font-bold text-muted-foreground/60 tabular-nums bg-muted/30 px-1.5 py-0.5 rounded border border-border/50">
          {completedCount}/{items.length}
        </span>
      </div>
      <ul className="space-y-3.5">
        {items.map((item, index) => (
          <li key={item.key} className="flex items-center gap-3.5">
            <div className={cn(
              "size-5.5 rounded-md flex items-center justify-center shrink-0 transition-all border shadow-xs",
              item.completed 
                ? "bg-primary border-primary text-white" 
                : "bg-background border-border text-muted-foreground/40"
            )}>
              {item.completed && <Check className="size-3" weight="bold" />}
              {!item.completed && <span className="text-[10px] font-bold">{index + 1}</span>}
            </div>
            <span className={cn(
              "text-xs font-bold tracking-tight transition-colors",
              item.completed ? "text-foreground" : "text-muted-foreground/70"
            )}>
              {isBg ? item.labelBg : item.label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ============================================================================
// Mobile Sticky Footer
// ============================================================================
function MobileFooter({
  progressPercent,
  isSubmitting,
  onSubmit,
  locale,
  currentStep,
  totalSteps,
  onNext,
  onBack,
  canGoNext,
}: {
  progressPercent: number;
  isSubmitting: boolean;
  onSubmit: () => void;
  locale: string;
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onBack: () => void;
  canGoNext: boolean;
}) {
  const isBg = locale === "bg";
  const isLastStep = currentStep === totalSteps;
  const isComplete = progressPercent === 100;

  return (
    <div className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-background/95 backdrop-blur-md border-t border-border pb-safe shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
      <div className="px-4 py-3.5 flex items-center gap-3">
        {currentStep > 1 && (
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            className="h-12 px-4 rounded-xl border-border/50"
          >
            <CaretLeft className="size-5" weight="bold" />
          </Button>
        )}

        {isLastStep ? (
          <Button
            type="button"
            onClick={onSubmit}
            disabled={isSubmitting || progressPercent < 50}
            className={cn(
              "flex-1 h-12 text-sm font-bold uppercase tracking-wider rounded-xl gap-2.5 transition-all shadow-xs",
              isComplete
                ? "bg-primary hover:bg-primary/90"
                : "bg-muted/20 text-muted-foreground border border-border/50 hover:bg-muted/30"
            )}
          >
            {isSubmitting ? (
              <>
                <Spinner className="size-5 animate-spin" />
                {isBg ? "Публикуване..." : "Publishing..."}
              </>
            ) : (
              <>
                <Rocket className="size-5" weight="bold" />
                {isBg ? "Публикувай" : "Publish"}
              </>
            )}
          </Button>
        ) : (
          <Button
            type="button"
            onClick={onNext}
            disabled={!canGoNext}
            className="flex-1 h-12 text-sm font-bold uppercase tracking-wider rounded-xl gap-2.5 bg-primary hover:bg-primary/90 shadow-xs"
          >
            {isBg ? "Напред" : "Next"}
            <ArrowRight className="size-5" weight="bold" />
          </Button>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// Main Form Component
// ============================================================================
export function SellForm({
  locale = "en",
  existingProduct,
  sellerId,
  categories: initialCategories = [],
}: SellFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isSaving, setIsSaving] = useState(false);
  const [autoSaved, setAutoSaved] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSavedRef = useRef<string>("");
  const draftRestoredRef = useRef(false);
  const isBg = locale === "bg";

  // Form setup
  const form = useForm<SellFormDataV4>({
    resolver: zodResolver(sellFormSchemaV4),
    defaultValues: existingProduct || defaultSellFormValuesV4,
    mode: "onChange",
  });

  // Watch form values for progress calculation
  const formValues = form.watch();
  const progressData = calculateFormProgress(formValues);
  const progressPercent = progressData.percentage;

  // Step validation logic
  const canGoNext = useMemo(() => {
    if (currentStep === 1) {
      return (formValues.images?.length ?? 0) > 0;
    }
    if (currentStep === 2) {
      return !!formValues.title && !!formValues.categoryId;
    }
    return true;
  }, [currentStep, formValues.images, formValues.title, formValues.categoryId]);

  const handleNext = useCallback(() => {
    if (canGoNext && currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [canGoNext, currentStep, totalSteps]);

  const handleBack = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [currentStep]);

  // Fetch categories from API only if not provided from server
  useEffect(() => {
    // Skip if categories were passed from server
    if (initialCategories.length > 0) return;
    
    let cancelled = false;
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories?children=true&depth=4");
        if (!response.ok) throw new Error("Failed to fetch categories");
        const data = await response.json();
        if (!cancelled) {
          setCategories(data.categories || []);
        }
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };
    fetchCategories();
    return () => { cancelled = true; };
  }, [initialCategories.length]);

  // Load draft on mount - ONCE only
  useEffect(() => {
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
        lastSavedRef.current = JSON.stringify(data);
        toast.info(
          isBg ? "Чернова възстановена" : "Draft restored",
          { description: isBg ? "Продължете откъдето сте спрели" : "Continue where you left off" }
        );
      }
    } catch {
      // Silent fail
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sellerId]);

  // Auto-save with subscription pattern (no infinite loops)
  useEffect(() => {
    if (!sellerId) return;

    const subscription = form.watch((formData) => {
      const currentJSON = JSON.stringify(formData);
      
      // Track unsaved changes
      if (currentJSON !== lastSavedRef.current) {
        setHasUnsavedChanges(true);
      }
      
      // Debounced auto-save
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      saveTimeoutRef.current = setTimeout(() => {
        if (currentJSON === lastSavedRef.current) return;

        setIsSaving(true);
        try {
          localStorage.setItem(`sell-draft-${sellerId}`, JSON.stringify({
            data: formData,
            savedAt: new Date().toISOString(),
          }));
          lastSavedRef.current = currentJSON;
          setHasUnsavedChanges(false);
          setAutoSaved(true);
          setTimeout(() => setAutoSaved(false), 2000);
        } catch {
          // Ignore storage errors
        } finally {
          setIsSaving(false);
        }
      }, 2000);
    });

    return () => {
      subscription.unsubscribe();
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, [sellerId, form]);

  // Manual save
  const handleSaveDraft = useCallback(() => {
    if (!sellerId) return;
    
    setIsSaving(true);
    try {
      const currentData = form.getValues();
      const currentJSON = JSON.stringify(currentData);
      localStorage.setItem(`sell-draft-${sellerId}`, JSON.stringify({
        data: currentData,
        savedAt: new Date().toISOString(),
      }));
      lastSavedRef.current = currentJSON;
      setHasUnsavedChanges(false);
      setAutoSaved(true);
      toast.success(isBg ? "Черновата е запазена" : "Draft saved");
      setTimeout(() => setAutoSaved(false), 2000);
    } catch {
      toast.error(isBg ? "Грешка при запазване" : "Failed to save draft");
    } finally {
      setIsSaving(false);
    }
  }, [sellerId, isBg, form]);

  // Form submission
  const onSubmit = useCallback((data: SellFormDataV4) => {
    setSubmitError(null);
    
    startTransition(async () => {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setSubmitError(isBg ? "Моля, влезте в профила си" : "Please sign in to continue");
          return;
        }

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
        setSubmitError(
          error instanceof Error 
            ? error.message 
            : isBg ? "Грешка при публикуване" : "Error publishing listing"
        );
      }
    });
  }, [isBg, locale, router, sellerId]);

  const handleMobileSubmit = useCallback(() => {
    form.handleSubmit(onSubmit)();
  }, [form, onSubmit]);

  return (
    <div className="min-h-screen bg-muted pb-28 lg:pb-8">
      {/* Sticky Header with Progress */}
      <ProgressHeader
        progressPercent={progressPercent}
        autoSaved={autoSaved}
        isSaving={isSaving}
        hasUnsavedChanges={hasUnsavedChanges}
        onSaveDraft={handleSaveDraft}
        locale={locale}
        currentStep={currentStep}
        totalSteps={totalSteps}
      />

      {/* Main Content */}
      <PageContainer size="default" className="py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Form */}
          <div className="flex-1 min-w-0 lg:max-w-3xl">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Step 1: Photos & AI */}
              <div className={cn(
                "space-y-6 transition-all duration-300",
                currentStep !== 1 && "hidden lg:block opacity-50 grayscale-[0.5] pointer-events-none lg:pointer-events-auto lg:opacity-100 lg:grayscale-0"
              )}>
                <PhotosSection form={form} locale={locale} categories={categories} />
                
                {/* AI Assistant Integration - Show after first photo or if already has data */}
                {(formValues.images?.length ?? 0) > 0 && (
                  <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <AiListingAssistant 
                      form={form} 
                      categories={categories} 
                      locale={locale}
                    />
                  </div>
                )}
              </div>

              {/* Step 2: Item Details */}
              <div className={cn(
                "space-y-6 transition-all duration-300",
                currentStep !== 2 && "hidden lg:block lg:opacity-100",
                currentStep < 2 && "lg:opacity-50 lg:grayscale-[0.5] lg:pointer-events-none",
                currentStep > 2 && "lg:opacity-50 lg:grayscale-[0.5] lg:pointer-events-none"
              )}>
                <DetailsSection 
                  form={form} 
                  locale={locale} 
                  categories={categories}
                />
              </div>

              {/* Step 3: Pricing & Shipping */}
              <div className={cn(
                "space-y-6 transition-all duration-300",
                currentStep !== 3 && "hidden lg:block lg:opacity-100",
                currentStep < 3 && "lg:opacity-50 lg:grayscale-[0.5] lg:pointer-events-none"
              )}>
                <PricingSection form={form} categoryId={formValues.categoryId} locale={locale} />
                <ShippingSection form={form} locale={locale} />
              </div>

              {/* Error Display */}
              {submitError && (
                <div className="flex items-center gap-3 p-4 rounded-lg bg-destructive/10 text-destructive border border-destructive/20">
                  <Warning className="size-5 shrink-0" />
                  <p className="text-sm flex-1">{submitError}</p>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 shrink-0"
                    onClick={() => setSubmitError(null)}
                  >
                    <X className="size-4" />
                  </Button>
                </div>
              )}

              {/* Desktop Submit Button (hidden on mobile) */}
              <div className="hidden lg:block">
                <Button
                  type="submit"
                  disabled={isPending || progressPercent < 50}
                  className={cn(
                    "w-full h-12 text-sm font-bold uppercase tracking-wider rounded-xl gap-2.5 transition-all shadow-xs",
                    progressPercent === 100
                      ? "bg-primary hover:bg-primary/90"
                      : "bg-muted/20 text-muted-foreground border border-border/50 hover:bg-muted/30"
                  )}
                >
                  {isPending ? (
                    <>
                      <Spinner className="size-5 animate-spin" />
                      {isBg ? "Публикуване..." : "Publishing..."}
                    </>
                  ) : progressPercent === 100 ? (
                    <>
                      <Rocket className="size-5" weight="bold" />
                      {isBg ? "Публикувай обявата" : "Publish listing"}
                      <ArrowRight className="size-5" weight="bold" />
                    </>
                  ) : (
                    <>
                      <Sparkle className="size-5" weight="bold" />
                      {isBg ? `${progressPercent}% завършено` : `${progressPercent}% complete`}
                    </>
                  )}
                </Button>
                {progressPercent < 100 && (
                  <p className="text-center text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60 mt-3">
                    {isBg 
                      ? "Попълнете всички задължителни полета, за да публикувате"
                      : "Complete all required fields to publish your listing"}
                  </p>
                )}
              </div>
            </form>
          </div>

          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-72 shrink-0">
            <div className="sticky top-20 space-y-4">
              <ChecklistSidebar items={progressData.items} locale={locale} />
              
              {/* Tips Card - Clean, no gradient */}
              <div className="p-5 rounded-xl border border-border bg-background shadow-xs">
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="flex size-8 items-center justify-center rounded-md bg-primary/10 border border-primary/20">
                    <Sparkle className="size-4 text-primary" weight="bold" />
                  </div>
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80">
                    {isBg ? "Съвети за продажби" : "Selling Tips"}
                  </h4>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <div className="size-4 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="size-2.5 text-primary" weight="bold" />
                    </div>
                    <span className="text-[11px] font-medium text-muted-foreground/80 leading-relaxed">
                      {isBg ? "Качествени снимки увеличават продажбите" : "Quality photos increase sales"}
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="size-4 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="size-2.5 text-primary" weight="bold" />
                    </div>
                    <span className="text-[11px] font-medium text-muted-foreground/80 leading-relaxed">
                      {isBg ? "Подробно описание изгражда доверие" : "Detailed descriptions build trust"}
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="size-4 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="size-2.5 text-primary" weight="bold" />
                    </div>
                    <span className="text-[11px] font-medium text-muted-foreground/80 leading-relaxed">
                      {isBg ? "Конкурентна цена привлича купувачи" : "Competitive pricing attracts buyers"}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </aside>
        </div>
      </PageContainer>

      {/* Mobile Sticky Footer */}
      <MobileFooter
        progressPercent={progressPercent}
        isSubmitting={isPending}
        onSubmit={handleMobileSubmit}
        locale={locale}
        currentStep={currentStep}
        totalSteps={totalSteps}
        onNext={handleNext}
        onBack={handleBack}
        canGoNext={canGoNext}
      />
    </div>
  );
}
