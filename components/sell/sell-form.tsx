"use client";

import { useState, useEffect, useTransition, useRef, useCallback } from "react";
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
import { PageContainer } from "@/components/ui/page-container";
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
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import type { Category } from "./types";
import { Link } from "@/i18n/routing";
import { AiSearchDialog } from "@/components/ai-search-dialog";

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
  onOpenAiAssistant,
}: {
  progressPercent: number;
  autoSaved: boolean;
  isSaving: boolean;
  hasUnsavedChanges: boolean;
  onSaveDraft: () => void;
  locale: string;
  onOpenAiAssistant: () => void;
}) {
  const isBg = locale === "bg";
  const isComplete = progressPercent === 100;

  return (
    <header className="sticky top-0 z-40 bg-background border-b border-border">
      <PageContainer size="default">
        {/* Top bar with logo and actions */}
        <div className="flex items-center justify-between h-14 gap-4">
          {/* Left: Back/Logo */}
          <Link 
            href="/" 
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <CaretLeft className="size-4" weight="bold" />
            <House className="size-5" />
            <span className="hidden sm:inline text-sm font-medium">
              {isBg ? "Начало" : "Home"}
            </span>
          </Link>

          {/* Center: Progress indicator */}
          <div className="flex-1 max-w-md mx-4 hidden sm:block">
            <div className="flex items-center gap-3">
              <Progress 
                value={progressPercent} 
                className="h-2 flex-1" 
                aria-label={`${isBg ? "Прогрес на формуляра" : "Form progress"}: ${progressPercent}%`}
              />
              <span className={cn(
                "text-xs font-semibold tabular-nums min-w-[3rem] text-right",
                isComplete ? "text-status-complete" : "text-muted-foreground"
              )}>
                {progressPercent}%
              </span>
            </div>
          </div>

          {/* Right: Save status + Actions */}
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onOpenAiAssistant}
              className="hidden sm:inline-flex h-9 px-3 gap-2 text-muted-foreground hover:text-foreground"
            >
              <Sparkle className="size-4" />
              <span>{isBg ? "AI помощ" : "AI-assisted"}</span>
            </Button>

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

        {/* Mobile progress bar */}
        <div className="sm:hidden pb-2">
          <div className="flex items-center gap-3">
            <Progress value={progressPercent} className="h-1.5 flex-1" />
            <span className={cn(
              "text-xs font-medium tabular-nums",
              isComplete ? "text-status-complete" : "text-muted-foreground"
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
    <div className="p-5 rounded-lg border border-border bg-card">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-semibold text-foreground">
          {isBg ? "Списък" : "Checklist"}
        </h4>
        <span className="text-xs text-muted-foreground tabular-nums">
          {completedCount}/{items.length}
        </span>
      </div>
      <ul className="space-y-3">
        {items.map((item, index) => (
          <li key={item.key} className="flex items-center gap-3">
            <div className={cn(
              "size-6 rounded-full flex items-center justify-center shrink-0 transition-all",
              item.completed 
                ? "bg-status-complete text-white" 
                : "border-2 border-border text-transparent"
            )}>
              {item.completed && <Check className="size-3.5" weight="bold" />}
              {!item.completed && <span className="text-xs text-muted-foreground">{index + 1}</span>}
            </div>
            <span className={cn(
              "text-sm transition-colors",
              item.completed ? "text-foreground" : "text-muted-foreground"
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
  _isValid,
  isSubmitting,
  onSubmit,
  locale,
}: {
  progressPercent: number;
  _isValid: boolean;
  isSubmitting: boolean;
  onSubmit: () => void;
  locale: string;
}) {
  const isBg = locale === "bg";
  const isComplete = progressPercent === 100;

  return (
    <div className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-background border-t border-border pb-safe">
      <div className="px-4 py-3">
        <Button
          type="button"
          onClick={onSubmit}
          disabled={isSubmitting || progressPercent < 50}
          className={cn(
            "w-full h-12 text-base font-semibold rounded-lg gap-2 transition-colors",
            isComplete
              ? "bg-success hover:bg-success/90"
              : "bg-primary hover:bg-primary/90"
          )}
        >
          {isSubmitting ? (
            <>
              <Spinner className="size-5 animate-spin" />
              {isBg ? "Публикуване..." : "Publishing..."}
            </>
          ) : isComplete ? (
            <>
              <Rocket className="size-5" weight="fill" />
              {isBg ? "Публикувай обявата" : "Publish listing"}
              <ArrowRight className="size-5" />
            </>
          ) : (
            <>
              <Sparkle className="size-5" />
              {isBg ? `${progressPercent}% завършено` : `${progressPercent}% complete`}
            </>
          )}
        </Button>

        {progressPercent < 100 && (
          <p className="text-center text-xs text-muted-foreground mt-2">
            {isBg 
              ? "Попълнете всички задължителни полета"
              : "Fill all required fields to publish"}
          </p>
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
  const [aiDialogOpen, setAiDialogOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
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

  // Watch form values for progress calculation (this is fine - just for display)
  const formValues = form.watch();
  const progressData = calculateFormProgress(formValues);
  const progressPercent = progressData.percentage;

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
        onOpenAiAssistant={() => setAiDialogOpen(true)}
      />

      {/* Main Content */}
      <PageContainer size="default" className="py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Form */}
          <div className="flex-1 min-w-0 lg:max-w-3xl">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Section 1: Photos */}
              <PhotosSection form={form} />

              {/* Section 2: Item Details */}
              <DetailsSection 
                form={form} 
                locale={locale} 
                categories={categories}
              />

              {/* Section 3: Pricing */}
              <PricingSection form={form} />

              {/* Section 4: Shipping */}
              <ShippingSection form={form} locale={locale} />

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
                    "w-full h-12 text-base font-semibold rounded-lg gap-2 transition-colors",
                    progressPercent === 100
                      ? "bg-success hover:bg-success/90"
                      : "bg-primary hover:bg-primary/90"
                  )}
                >
                  {isPending ? (
                    <>
                      <Spinner className="size-5 animate-spin" />
                      {isBg ? "Публикуване..." : "Publishing..."}
                    </>
                  ) : progressPercent === 100 ? (
                    <>
                      <Rocket className="size-5" weight="fill" />
                      {isBg ? "Публикувай обявата" : "Publish listing"}
                      <ArrowRight className="size-5" />
                    </>
                  ) : (
                    <>
                      <Sparkle className="size-5" />
                      {isBg ? `${progressPercent}% завършено` : `${progressPercent}% complete`}
                    </>
                  )}
                </Button>
                {progressPercent < 100 && (
                  <p className="text-center text-xs text-muted-foreground mt-2">
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
              <div className="p-5 rounded-lg border border-border bg-card">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkle className="size-5 text-primary" weight="fill" />
                  <h4 className="text-sm font-semibold text-foreground">
                    {isBg ? "Съвети за продажби" : "Selling Tips"}
                  </h4>
                </div>
                <ul className="space-y-2 text-xs text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <Check className="size-3.5 mt-0.5 text-status-complete shrink-0" />
                    {isBg ? "Качествени снимки увеличават продажбите" : "Quality photos increase sales"}
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="size-3.5 mt-0.5 text-status-complete shrink-0" />
                    {isBg ? "Подробно описание изгражда доверие" : "Detailed descriptions build trust"}
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="size-3.5 mt-0.5 text-status-complete shrink-0" />
                    {isBg ? "Конкурентна цена привлича купувачи" : "Competitive pricing attracts buyers"}
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
        _isValid={form.formState.isValid}
        isSubmitting={isPending}
        onSubmit={handleMobileSubmit}
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
